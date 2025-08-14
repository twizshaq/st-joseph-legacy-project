// components/MapFull.js
"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import searchIcon from '@/public/icons/search-icon.svg';
import Compass from './Compass';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const getDirectionLetter = (bearing) => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

const MapFull = forwardRef((props, ref) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const compassDialRef = useRef(null);
    const [directionLetter, setDirectionLetter] = useState('N');

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
    }));

    const handleResetNorth = () => {
        map.current?.resetNorth({ duration: 500 });
    };

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-59.55, 13.2],
            zoom: 11,
            attributionControl: false,
        });

        const setupMapFeatures = async () => {
            try {
                // STEP 1: Fetch external GeoJSON for initial setup
                const response = await fetch('/data/barbados_parishes.geojson');
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData = await response.json();
                const stJosephFeature_external = parishData.features.find(f => f.properties.name === 'Saint Joseph');

                if (!stJosephFeature_external) {
                    console.error("Could not find 'Saint Joseph' in external GeoJSON.");
                    return;
                }

                // STEP 2: Use external data to set bounds and create the mask immediately
                const bbox = turf.bbox(stJosephFeature_external);
                const mapBounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
                map.current.setMaxBounds(mapBounds);
                map.current.setMinZoom(10);
                map.current.fitBounds(mapBounds, { padding: 20, duration: 0 });

                const worldCoords = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
                const stJosephHole = stJosephFeature_external.geometry.coordinates[0].slice().reverse();
                const maskFeature = {
                    type: 'Feature',
                    geometry: { type: 'Polygon', coordinates: [worldCoords, stJosephHole] },
                };
                map.current.addSource('mask', { type: 'geojson', data: maskFeature });
                map.current.addLayer({
                    id: 'mask-layer',
                    type: 'fill',
                    source: 'mask',
                    paint: { 'fill-color': 'rgba(255, 255, 255, 0)' },
                });

                // STEP 3: Wait for the map to be idle, then query for the PERFECT outline
                map.current.once('idle', () => {
                    const features = map.current.querySourceFeatures('composite', {
                        sourceLayer: 'admin',
                        filter: ['all', ['==', 'name', 'Saint Joseph'], ['==', 'admin_level', 4]]
                    });

                    if (features && features.length > 0) {
                        const stJosephFeature_internal = features[0];
                        
                        // Create a clean LineString from the ACCURATE internal data
                        const outlineFeature = {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: stJosephFeature_internal.geometry.coordinates[0],
                            }
                        };

                        map.current.addSource('st-joseph-perfect-outline', { type: 'geojson', data: outlineFeature });
                        map.current.addLayer({
                            id: 'st-joseph-perfect-outline-layer',
                            type: 'line',
                            source: 'st-joseph-perfect-outline',
                            paint: { 'line-color': '#005a9e', 'line-width': 2.5 },
                        });
                    }
                });

            } catch (error) {
                console.error("Error setting up map features:", error);
            }
        };

        map.current.on('load', setupMapFeatures);
        map.current.addControl(new mapboxgl.AttributionControl(), 'top-right');

        // Compass logic
        map.current.on('rotate', () => {
            const newBearing = map.current.getBearing();
            const newLetter = getDirectionLetter(newBearing);
            if (compassDialRef.current) {
                compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
            }
            setDirectionLetter(prev => newLetter !== prev ? newLetter : prev);
        });
        map.current.on('rotateend', () => {
            if (map.current.getBearing() === 0) {
                if (compassDialRef.current) compassDialRef.current.style.transform = 'rotate(0deg)';
                setDirectionLetter('N');
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
                <div className='absolute bottom-[130px] max-sm:top-[80px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                    <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                        <button onClick={handleResetNorth} className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center z-[10]" aria-label="Reset bearing to north">
                            <Compass ref={compassDialRef} directionLetter={directionLetter} />
                        </button>
                    </div>
                </div>
        </div>
    );
});

MapFull.displayName = 'MapFull';
export default MapFull;