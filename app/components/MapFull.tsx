"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
// CORRECTED IMPORT: The path now correctly resolves to Compass.tsx
import Compass from './Compass';
import ThreeDToggle from './ThreeDToggle';
import { Feature, Point, FeatureCollection } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

// --- TYPE DEFINITIONS ---
type Zoomable = { zoomIn: () => void; zoomOut: () => void };

type MapFullProps = {
    onMarkerClick?: (feature: Feature<Point> | null) => void;
    geojsonData: FeatureCollection<Point> | null;
};

// --- HELPER FUNCTION ---
const getDirectionLetter = (bearing: number): string => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

// --- COMPONENT DEFINITION ---
const MapFull = forwardRef<Zoomable, MapFullProps>(({ onMarkerClick = () => {}, geojsonData }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const compassDialRef = useRef<HTMLDivElement | null>(null);
    const [directionLetter, setDirectionLetter] = useState<string>('N');
    const [is3D, setIs3D] = useState<boolean>(false);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
    }));

    const handleToggle3D = () => setIs3D(prev => !prev);
    
    const handleResetNorth = () => {
        if (!map.current) return;
        if (is3D) {
            map.current.flyTo({ bearing: 0, pitch: 60, duration: 1000 });
        } else {
            map.current.resetNorth({ duration: 500 });
        }
    };

    // Effect for map initialization (runs only once)
    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-59.55, 13.2],
            zoom: 11,
            attributionControl: false,
        });

        map.current.on('load', () => {
            map.current!.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512, 'maxzoom': 14 });
            map.current!.addLayer({ id: 'sky', type: 'sky', paint: { 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 15 } });
            map.current!.addLayer({ 'id': '3d-buildings', 'source': 'composite', 'source-layer': 'building', 'filter': ['==', 'extrude', 'true'], 'type': 'fill-extrusion', 'minzoom': 14, 'paint': { 'fill-extrusion-color': '#aaa', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': ['get', 'min_height'], 'fill-extrusion-opacity': 0.6 } });
        });

        map.current.on('rotate', () => {
            const newBearing = map.current!.getBearing();
            if (compassDialRef.current) compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
            setDirectionLetter(getDirectionLetter(newBearing));
        });

        map.current.on('click', (e) => {
            if (!(e.originalEvent.target as HTMLElement).closest('.custom-marker')) {
                onMarkerClick(null);
            }
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to update markers when geojsonData changes
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (geojsonData) {
            const newMarkers = geojsonData.features.map(feature => {
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.innerText = feature.properties?.name || '';

                el.addEventListener('click', () => {
                    onMarkerClick(feature);
                    map.current!.flyTo({ center: feature.geometry.coordinates as [number, number], zoom: 15, essential: true });
                });

                return new mapboxgl.Marker(el)
                    .setLngLat(feature.geometry.coordinates as [number, number])
                    .addTo(map.current!);
            });
            markersRef.current = newMarkers;
        }
    }, [geojsonData, onMarkerClick]);

    // Effect to handle 3D/2D transitions
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;
        const duration = 1200;
        if (is3D) {
            map.current.flyTo({ pitch: 60, bearing: -17.6, duration });
            map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            map.current.setLayoutProperty('sky', 'visibility', 'visible');
            map.current.setLayoutProperty('3d-buildings', 'visibility', 'visible');
        } else {
            map.current.flyTo({ pitch: 0, bearing: 0, duration });
            map.current.setTerrain(null);
            map.current.setLayoutProperty('sky', 'visibility', 'none');
            map.current.setLayoutProperty('3d-buildings', 'visibility', 'none');
        }
    }, [is3D]);

    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
            <div className='fixed bottom-[130px] max-sm:bottom-auto max-sm:top-[80px] flex flex-col max-sm:flex-row max-sm:right-[14px] right-[21px] items-end gap-[5px]'>
                <ThreeDToggle is3D={is3D} onToggle={handleToggle3D} />
                <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                    <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                        <button onClick={handleResetNorth} className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center z-[10]" aria-label="Reset bearing to north">
                            <Compass ref={compassDialRef} directionLetter={directionLetter} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

MapFull.displayName = 'MapFull';
export default MapFull;