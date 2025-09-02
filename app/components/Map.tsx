"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { Feature, Point, FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import CustomMapMarker from './CustomMapMarker';
import { useRouter } from 'next/navigation';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const ZOOM_THRESHOLD = 15;

// --- TYPE DEFINITIONS ---

interface MarkerProperties {
    name: string;
    imageUrl?: string;
    colorhex?: string;
}

interface ParishProperties {
    name: string;
}

export type MapControlsHandle = { 
    zoomIn: () => void; 
    zoomOut: () => void; 
    resetNorth: () => void; 
};

type MapProps = {
    geojsonData: FeatureCollection<Point> | null;
    onRotate?: (bearing: number) => void;
};

// --- THE COMPONENT ---

const Map = forwardRef<MapControlsHandle, MapProps>(({ geojsonData, onRotate = () => {} }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const router = useRouter();

    const markerDataRef = useRef<{ 
        root: Root; 
        name: string; 
        pointimage?: string; 
        colorhex?: string; 
    }[]>([]);
    
    const [isAboveThreshold, setIsAboveThreshold] = useState<boolean>(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
        resetNorth: () => {
            if (!map.current) return;
            map.current.flyTo({ bearing: 0, pitch: 0, duration: 1000 });
        }
    }));

    // Effect to initialize the map instance
    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        // Step 1: Initialize a basic map without any bounds.
        // It will be centered generically on Barbados and then adjusted forcefully.
        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-59.55, 13.18], // General center of Barbados
            zoom: 9,
            attributionControl: false,
        });

        const mapInstance = map.current;

        // This function will be called ONLY after the map's style has loaded
        const setMapBounds = async () => {
            try {
                const response = await fetch('/data/barbados_parishes.geojson');
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData: FeatureCollection<Polygon | MultiPolygon, ParishProperties> = await response.json();
                
                const stJosephFeature = parishData.features.find(f => f.properties.name === 'Saint Joseph');
                
                if (!stJosephFeature) {
                    console.error("Could not find 'Saint Joseph' parish in GeoJSON data.");
                    return;
                }
                
                const bbox = turf.bbox(stJosephFeature); 
                const mapBounds: [number, number, number, number] = [bbox[0], bbox[1], bbox[2], bbox[3]];

                // --- NEW ROBUST STRATEGY ---
                // Step 2: Forcefully apply the bounds and view to the loaded map.
                mapInstance.fitBounds(mapBounds, {
                    padding: 40,
                    duration: 0, // No animation on initial load
                });
                
                mapInstance.setMaxBounds(mapBounds);
                
                // Step 3: After fitting the bounds, get the resulting zoom level and set it as the minimum.
                // This is a reliable way to prevent zooming out further.
                const currentZoom = mapInstance.getZoom();
                mapInstance.setMinZoom(currentZoom);

            } catch (error) {
                console.error("Error setting map bounds:", error);
            }
        };

        // Step 1 (cont.): Listen for the 'load' event.
        mapInstance.on('load', () => {
            setMapBounds(); // Now, call the function to set the bounds.

            const updateThreshold = () => {
                const z = mapInstance.getZoom();
                setIsAboveThreshold(z >= ZOOM_THRESHOLD);
            };

            updateThreshold();
            mapInstance.on('zoom', updateThreshold);

            mapInstance.on('rotate', () => {
                const newBearing = mapInstance.getBearing();
                onRotate(newBearing);
            });

            setMapLoaded(true);
        });

        // Cleanup function
        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [onRotate]);

    // Effect for creating and destroying markers (no changes needed)
    useEffect(() => {
        if (!mapLoaded || !geojsonData || !map.current) return;
        const mapInstance = map.current;
        const newMarkers: { marker: mapboxgl.Marker; root: Root; handleClick: (e: MouseEvent) => void; }[] = [];

        for (const feature of geojsonData.features) {
            const { coordinates } = feature.geometry as Point;
            const { imageUrl: pointimage, colorhex, name } = feature.properties as MarkerProperties;
            const markerEl = document.createElement('div');
            const root = createRoot(markerEl);
            
            root.render(
                <CustomMapMarker 
                    name={name}
                    pointimage={pointimage} 
                    color={colorhex}
                    isTextMode={mapInstance.getZoom() >= ZOOM_THRESHOLD}
                />
            );

            const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
                .setLngLat(coordinates as [number, number])
                .addTo(mapInstance);
            
            const handleClick = (e: MouseEvent) => {
                e.stopPropagation();
                router.push('/virtual-map');
            };
            
            marker.getElement().addEventListener('click', handleClick);
            newMarkers.push({ marker, root, handleClick });
        }
        
        markerDataRef.current = geojsonData.features.map((feature, i) => {
            const { imageUrl: pointimage, colorhex, name } = feature.properties as MarkerProperties;
            return { root: newMarkers[i].root, name, pointimage, colorhex };
        });

        return () => {
            newMarkers.forEach(({ marker, root, handleClick }) => {
                marker.getElement().removeEventListener('click', handleClick);
                marker.remove();
                setTimeout(() => root.unmount(), 0);
            });
            markerDataRef.current = [];
        };
    }, [geojsonData, mapLoaded, router]);

    // Effect for updating marker styles on zoom (no changes needed)
    useEffect(() => {
        if (!map.current) return;
        markerDataRef.current.forEach(({ root, name, pointimage, colorhex }) => {
            root.render(
                <CustomMapMarker 
                    name={name}
                    pointimage={pointimage}
                    color={colorhex}
                    isTextMode={isAboveThreshold}
                />
            );
        });
    }, [isAboveThreshold]);

    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
        </div>
    );
});

Map.displayName = 'Map';
export default Map;