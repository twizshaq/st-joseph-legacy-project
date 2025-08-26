// components/Map.js
"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import Compass from '@/app/components/Compass';

// Make sure the access token is set only once and correctly.
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const getDirectionLetter = (bearing) => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

const Map = forwardRef((props, ref) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const compassDialRef = useRef(null);
    const [directionLetter, setDirectionLetter] = useState('N');

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
        // We'll control the 3D toggle from the parent
    }));

    const handleResetNorth = () => {
        // Use flyTo for a smooth animation that respects the current pitch (3D view)
        map.current?.flyTo({ bearing: 0, duration: 1000 });
    };

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12', // This style works well
            center: [-59.55, 13.2],
            zoom: 11,
            pitch: 0, // Start with a 0 pitch (2D view)
            bearing: 0,
            attributionControl: false,
        });

        map.current.on('load', async () => {
            // --- START OF 3D TERRAIN AND BUILDINGS SETUP ---

            // 1. Add the source for terrain elevation data
            map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });

            // 2. Enable the terrain using the DEM source
            // We set exaggeration to 1.5 to make the hills a bit more dramatic
            map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // 3. Add the 3D buildings layer
            // This layer uses the 'composite' source, which is part of Mapbox's default styles
            map.current.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 14, // Only show buildings when zoomed in
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    // Use an 'interpolate' expression to smoothly fade in buildings as you zoom.
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 0,
                        14.05, ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 0,
                        14.05, ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.8
                }
            });

            // --- END OF 3D SETUP ---

            // Your existing logic for parishes and outlines
            try {
                const response = await fetch('/data/barbados_parishes.geojson');
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData = await response.json();
                const stJosephFeature = parishData.features.find(f => f.properties.name === 'Saint Joseph');

                if (!stJosephFeature) {
                    console.error("Could not find 'Saint Joseph' in GeoJSON.");
                    return;
                }

                const bbox = turf.bbox(stJosephFeature);
                const mapBounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
                map.current.setMaxBounds(mapBounds);
                map.current.setMinZoom(10);
                map.current.fitBounds(mapBounds, { padding: 20, duration: 0 });

                // The rest of your masking and outline logic can remain here
                // ...

            } catch (error) {
                console.error("Error setting up map features:", error);
            }
        });

        map.current.addControl(new mapboxgl.AttributionControl(), 'top-right');

        const updateBearing = () => {
            if (!map.current) return;
            const newBearing = map.current.getBearing();
            const newLetter = getDirectionLetter(newBearing);
            if (compassDialRef.current) {
                compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
            }
            setDirectionLetter(prev => (newLetter !== prev ? newLetter : prev));
        };

        map.current.on('move', updateBearing);
        updateBearing();

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // The rest of your component remains the same
    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
            <div className='absolute top-[130px] left-[18px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                    <button onClick={handleResetNorth} className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center z-[10]" aria-label="Reset bearing to north">
                        <Compass ref={compassDialRef} directionLetter={directionLetter} />
                    </button>
                </div>
            </div>
        </div>
    );
});

Map.displayName = 'Map';
export default Map;