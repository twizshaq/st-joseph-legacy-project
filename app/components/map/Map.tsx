"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { FeatureCollection, Point, Polygon, MultiPolygon } from 'geojson';
import { useRouter } from 'next/navigation';
import CustomMapMarker from './CustomMapMarker';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const ZOOM_THRESHOLD = 15;

interface LocationProperties {
    name: string;
    pointimage?: string;
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

const Map = forwardRef<MapControlsHandle, MapProps>(({ geojsonData, onRotate = () => {} }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const router = useRouter();
    const [mapLoaded, setMapLoaded] = useState(false);

    const [isAboveThreshold, setIsAboveThreshold] = useState(false);
    const markerDataRef = useRef<{
        root: Root;
        properties: LocationProperties;
    }[]>([]);

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
        resetNorth: () => {
            if (!map.current) return;
            map.current.flyTo({ bearing: 0, pitch: 0, duration: 1000 });
        }
    }));

    // --- INITIALIZATION EFFECT ---
    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        let isMounted = true; // FIX: Lock to prevent race condition

        const initializeMap = async () => {
            try {
                const response = await fetch('/data/barbados_parishes.geojson');
                // FIX: Check if unmounted during fetch
                if (!isMounted) return; 
                
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData: FeatureCollection<Polygon | MultiPolygon, ParishProperties> = await response.json();
                
                const stJosephFeature = parishData.features.find(
                    feature => feature.properties?.name === 'Saint Joseph'
                );

                if (!stJosephFeature) return;
                
                const bbox = turf.bbox(stJosephFeature);
                const mapBounds: [number, number, number, number] = [bbox[0], bbox[1], bbox[2], bbox[3]];

                map.current = new mapboxgl.Map({
                    container: mapContainer.current!,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    attributionControl: false,
                    center: [-59.5436, 13.1939],
                    zoom: 11
                });

                const mapInstance = map.current;

                const updateThreshold = () => {
                    if (!mapInstance) return;
                    const currentZoom = mapInstance.getZoom();
                    setIsAboveThreshold(currentZoom >= ZOOM_THRESHOLD);
                };

                mapInstance.on('load', () => {
                    if (!isMounted) return; // FIX: Ensure we don't set state on unmounted comp
                    mapInstance.fitBounds(mapBounds, { padding: 20, duration: 0 });
                    mapInstance.setMaxBounds(mapBounds);
                    mapInstance.setMinZoom(mapInstance.getZoom());
                    
                    mapInstance.on('rotate', () => onRotate(mapInstance.getBearing()));
                    mapInstance.on('zoom', updateThreshold);
                    updateThreshold();
                    
                    setMapLoaded(true);
                });

            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        initializeMap();

        return () => {
            isMounted = false; // FIX: Cancel any pending init
            map.current?.remove();
            map.current = null;
        };
    }, [onRotate]);

    // --- MARKER EFFECT ---
    useEffect(() => {
        // Guard against race conditions where data exists but map isn't ready
        if (!mapLoaded || !map.current || !geojsonData) return;
        
        const mapInstance = map.current;

        // Cleanup function for this specific render cycle
        const currentMarkers: { marker: mapboxgl.Marker; root: Root; handleClick: () => void }[] = [];

        // Safely add markers
        for (const feature of geojsonData.features) {
            const properties = feature.properties as LocationProperties;
            const coordinates = (feature.geometry as Point).coordinates as [number, number];

            const markerEl = document.createElement('div');
            const root = createRoot(markerEl);

            root.render(
                <CustomMapMarker
                    name={properties.name}
                    pointimage={properties.pointimage}
                    color={properties.colorhex}
                    isTextMode={mapInstance.getZoom() >= ZOOM_THRESHOLD}
                />
            );

            const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
                .setLngLat(coordinates)
                .addTo(mapInstance);

            const handleClick = () => router.push('/virtual-map');
            marker.getElement().addEventListener('click', handleClick);

            currentMarkers.push({ marker, root, handleClick });
        }

        // Update ref for zoom handling
        markerDataRef.current = currentMarkers.map(({ root }, index) => ({
            root,
            properties: geojsonData.features[index].properties as LocationProperties
        }));

        // Cleanup previous markers
        return () => {
            currentMarkers.forEach(({ marker, root, handleClick }) => {
                marker.getElement().removeEventListener('click', handleClick);
                marker.remove();
                setTimeout(() => root.unmount(), 0);
            });
            markerDataRef.current = [];
        };
    }, [geojsonData, mapLoaded, router]); // Added mapLoaded to dependancy

    // Effect for Zoom Text Toggle
    useEffect(() => {
        if (!mapLoaded) return;
        markerDataRef.current.forEach(({ root, properties }) => {
            root.render(
                <CustomMapMarker
                    name={properties.name}
                    pointimage={properties.pointimage}
                    color={properties.colorhex}
                    isTextMode={isAboveThreshold}
                />
            );
        });
    }, [isAboveThreshold, mapLoaded]);

    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
        </div>
    );
});

Map.displayName = 'Map';
export default Map;