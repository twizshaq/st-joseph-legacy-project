"use client";

import React, { useRef, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomMapMarker from '@/app/components/map/CustomMapMarker';
import * as turf from '@turf/turf'; 

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const ZOOM_THRESHOLD = 14; 

interface StopMarker {
    id: string;
    name: string;
    lat: number;
    lng: number;
    pointimage?: string;
    colorhex?: string;
}

interface TourStopsMapProps {
    stops: StopMarker[];
}

export default function TourStopsMap({ stops }: TourStopsMapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    
    const markerRoots = useRef<{ root: Root; marker: mapboxgl.Marker; stop: StopMarker; index: number }[]>([]);
    
    const [isTextMode, setIsTextMode] = useState(false);

    useEffect(() => {
        if (!mapContainer.current || stops.length === 0) return;

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [stops[0].lng, stops[0].lat],
                zoom: 12,
                attributionControl: false,
            });

            map.current.on('zoom', () => {
                if (map.current) {
                    const currentZoom = map.current.getZoom();
                    setIsTextMode(currentZoom >= ZOOM_THRESHOLD);
                }
            });
        }

        const mapInstance = map.current;

        const loadRouteAndMarkers = async () => {
            if (markerRoots.current.length === stops.length) {
                const firstStopId = stops[0]?.id;
                const currentFirstId = markerRoots.current[0]?.stop.id;
                if (firstStopId === currentFirstId) return; // Data is likely the same, skip cleanup
            }

            // Cleanup old markers (only if data actually changed)
            markerRoots.current.forEach(({ root, marker }) => {
                marker.remove();
                setTimeout(() => root.unmount(), 0);
            });
            markerRoots.current = [];

            const bounds = new mapboxgl.LngLatBounds();

            stops.forEach((stop, index) => {
                const el = document.createElement('div');
                const root = createRoot(el);
                
                const currentZoom = mapInstance.getZoom();
                const initialTextMode = currentZoom >= ZOOM_THRESHOLD;

                root.render(
                    <CustomMapMarker 
                        // Fix: Just pass the name, let the marker handle the number
                        name={stop.name} 
                        pointimage={stop.pointimage}
                        color={stop.colorhex || "rgb(80, 86, 102)"} 
                        isTextMode={initialTextMode} 
                        stopNumber={index + 1}
                    />
                );

                const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                    .setLngLat([stop.lng, stop.lat])
                    .addTo(mapInstance);
                
                bounds.extend([stop.lng, stop.lat]);
                markerRoots.current.push({ root, marker, stop, index });
            });

            mapInstance.fitBounds(bounds, { padding: 80, duration: 1000 });

            // Fetch Route
            if (stops.length > 1) {
                const coordinatesString = stops.map(s => `${s.lng},${s.lat}`).join(';');
                
                // 1. UPDATE: Added "&overview=full"
                // This tells Mapbox to return the EXACT geometry of the road, not a simplified straight line.
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.routes && data.routes[0]) {
                        // 1. Get the raw, highly accurate road geometry
                        const routeGeoJSON = data.routes[0].geometry;

                        // 2. Remove Turf entirely and just pass the raw GeoJSON
                        if (mapInstance.isStyleLoaded()) {
                            drawRoute(mapInstance, routeGeoJSON);
                        } else {
                            mapInstance.once('load', () => drawRoute(mapInstance, routeGeoJSON));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching mapbox route:", error);
                }
            }
        };

        loadRouteAndMarkers();

        return () => {
            markerRoots.current.forEach(({ root, marker }) => {
                marker.remove();
                setTimeout(() => root.unmount(), 0);
            });
            markerRoots.current = [];
        };
    }, [stops]);

    useEffect(() => {
        markerRoots.current.forEach(({ root, stop, index }) => {
            root.render(
                <CustomMapMarker 
                    name={stop.name}
                    pointimage={stop.pointimage}
                    color={stop.colorhex || "rgb(80, 86, 102)"}
                    isTextMode={isTextMode} 
                    stopNumber={index + 1}
                />
            );
        });
    }, [isTextMode]);

    const drawRoute = (mapInstance: mapboxgl.Map, geometry: any) => {
        if (mapInstance.getSource('route')) {
            (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(geometry);
        } else {
            mapInstance.addSource('route', { 'type': 'geojson', 'data': geometry });
            
            mapInstance.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': { 
                    'line-join': 'round', 
                    'line-cap': 'round' 
                },
                'paint': { 
                    'line-blur': 0.7,
                    'line-color': '#007BFF',
                    // 2. UPDATE: Lower opacity slightly so it acts like a "Highlighter" on top of the road
                    'line-opacity': 0.9, 
                    // 3. UPDATE: Dynamic Width based on Zoom level
                    'line-width': [
                        'interpolate', ['linear'], ['zoom'],
                        10, 4,    // At zoom 10, line is 4px thick
                        14, 8,    // At zoom 14, line is 8px thick
                        18, 13    // At zoom 18 (street view), line is 22px thick (fills the road)
                    ]
                }
            }, 'waterway-label'); 
        }
    };

    return (
        <div className="w-full h-[400px] max-sm:h-[400px] bg-gray-100 rounded-3xl overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}