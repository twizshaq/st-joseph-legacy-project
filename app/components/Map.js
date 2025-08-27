"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import Compass from '@/app/components/Compass';
import CustomMapMarker from './CustomMapMarker'; // Import the custom marker component

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const ZOOM_THRESHOLD = 15; // Define the threshold for switching marker style

const getDirectionLetter = (bearing) => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

// Update props to accept geojsonData and an onMarkerClick handler
const Map = forwardRef(({ geojsonData, onMarkerClick = () => {} }, ref) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const compassDialRef = useRef(null);
    const [directionLetter, setDirectionLetter] = useState('N');

    // State for managing marker appearance and map readiness
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isAboveThreshold, setIsAboveThreshold] = useState(false);

    // Ref to store marker instances and their React roots for cleanup
    const markerDataRef = useRef([]);
    const onMarkerClickRef = useRef(onMarkerClick);
    useEffect(() => {
        onMarkerClickRef.current = onMarkerClick;
    }, [onMarkerClick]);

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
    }));

    const handleResetNorth = () => {
        map.current?.flyTo({ bearing: 0, duration: 1000 });
    };

    // Main effect for map initialization
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-59.55, 13.2],
            zoom: 11,
            pitch: 0,
            bearing: 0,
            attributionControl: false,
        });

        const updateThreshold = () => {
            if (!map.current) return;
            setIsAboveThreshold(map.current.getZoom() >= ZOOM_THRESHOLD);
        };

        map.current.on('load', async () => {
            // Your existing 3D and parish logic...
            // ...

            // When loaded, update zoom threshold state and set mapLoaded to true
            updateThreshold();
            setMapLoaded(true);
        });

        // Add zoom listener to update the marker style
        map.current.on('zoom', updateThreshold);

        map.current.on('rotate', () => {
            const newBearing = map.current.getBearing();
            if (compassDialRef.current) {
                compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
            }
            setDirectionLetter(getDirectionLetter(newBearing));
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Effect for CREATING and DESTROYING markers when geojsonData changes
    useEffect(() => {
        if (!mapLoaded || !geojsonData) return;
        const mapInstance = map.current;

        // 1. Clear existing markers before adding new ones
        markerDataRef.current.forEach(({ marker, root }) => {
            marker.remove();
            root.unmount();
        });
        markerDataRef.current = [];

        // 2. Loop through features to create new markers
        for (const feature of geojsonData.features) {
            const { coordinates } = feature.geometry;
            const { imageUrl: pointimage, colorhex, name } = feature.properties;

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
                .setLngLat(coordinates)
                .addTo(mapInstance);
            
            const handleClick = (e) => {
                e.stopPropagation();
                onMarkerClickRef.current(feature);
                mapInstance.flyTo({
                    center: coordinates,
                    zoom: 15,
                    essential: true
                });
            };
            
            marker.getElement().addEventListener('click', handleClick);

            // 3. Store marker info for future updates and cleanup
            markerDataRef.current.push({ marker, root, name, pointimage, colorhex });
        }

        // Cleanup function for when the component unmounts or data changes again
        return () => {
            markerDataRef.current.forEach(({ marker, root }) => {
                marker.remove();
                root.unmount();
            });
            markerDataRef.current = [];
        };
    }, [geojsonData, mapLoaded]);

    // Effect for UPDATING markers on zoom change (more efficient)
    useEffect(() => {
        // This runs only when the zoom threshold is crossed
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