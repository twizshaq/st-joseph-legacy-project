// components/MapFull.js
"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
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
        // Prevent re-initialization
        if (map.current || !mapContainer.current) return;

        // Create an async function to fetch data FIRST, then initialize the map.
        const initializeMap = async () => {
            try {
                // Step 1: Fetch GeoJSON data BEFORE creating the map
                const response = await fetch('/data/barbados_parishes.geojson');
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData = await response.json();
                
                // Find the 'Saint Joseph' feature
                let stJosephFeature = parishData.features.find((f: any) => f.properties.name === 'Saint Joseph');

                if (!stJosephFeature) {
                    console.error("Could not find 'Saint Joseph' in GeoJSON.");
                    return;
                }

                // --- START OF MASK SHIFT LOGIC ---
                // Define how much to shift the mask
                const shiftDistance = 0.5; // distance in kilometers (adjust as needed)
                const shiftBearing = 135;  // bearing in degrees: 135 degrees = Southeast

                // Apply the shift to create a *new* shifted feature for the mask
                const shiftedStJosephFeature = turf.transformTranslate(
                    stJosephFeature,
                    shiftDistance,
                    shiftBearing,
                    { units: 'kilometers' }
                );
                // --- END OF MASK SHIFT LOGIC ---


                // Step 2: Calculate the bounds for the map.
                // CRITICAL FIX: Use the SHIFTED feature to calculate map bounds and maxBounds.
                // This ensures the map's viewport moves with the intended mask location.
                const bbox = turf.bbox(shiftedStJosephFeature); 
                const mapBounds: [number, number, number, number] = [bbox[0], bbox[1], bbox[2], bbox[3]];

                // Step 3: Create the map instance WITH the adjusted bounds
                map.current = new mapboxgl.Map({
                    container: mapContainer.current!,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    bounds: mapBounds, // Set the initial view to fit the SHIFTED bounds
                    fitBoundsOptions: { padding: 20, duration: 0 }, // Options for the initial fit
                    maxBounds: mapBounds, // CRITICAL: Constrain the map to these SHIFTED bounds
                    minZoom: 10,
                    attributionControl: false,
                });

                // Step 4: Add layers and event listeners after the map is created
                map.current.on('load', () => {
                    // Create the visual mask
                    const worldCoords = [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]];
                    
                    // Use the SHIFTED feature's coordinates to define the hole in the mask
                    const stJosephHole = shiftedStJosephFeature.geometry.coordinates[0].slice().reverse();
                    // const maskFeature = {
                    //     type: 'Feature',
                    //     geometry: { type: 'Polygon', coordinates: [worldCoords, stJosephHole] },
                    // };
                    // map.current!.addSource('mask', { type: 'geojson', data: maskFeature as any });
                    // map.current!.addLayer({
                    //     id: 'mask-layer',
                    //     type: 'fill',
                    //     source: 'mask',
                    //     paint: { 'fill-color': 'rgba(200, 200, 200, 0.5)' },
                    // });

                    // Add 3D and sky layers
                    // map.current!.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512, 'maxzoom': 14 });
                    // map.current!.addLayer({ id: 'sky', type: 'sky', paint: { 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 15 } });
                    // map.current!.addLayer({ 'id': '3d-buildings', 'source': 'composite', 'source-layer': 'building', 'filter': ['==', 'extrude', 'true'], 'type': 'fill-extrusion', 'minzoom': 14, 'paint': { 'fill-extrusion-color': '#aaa', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': ['get', 'min_height'], 'fill-extrusion-opacity': 0.6 } });
                });

                // Attach other event listeners
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

            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        initializeMap();

        // Cleanup function
        return () => {
            map.current?.remove();
            map.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this effect runs only once on mount

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