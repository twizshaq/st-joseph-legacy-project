"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createRoot, Root } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import Compass from './Compass';
import ThreeDToggle from './ThreeDToggle';
import { Feature, Point, FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import CustomMapMarker from './CustomMapMarker';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const ZOOM_THRESHOLD = 15;

interface MarkerProperties {
    name: string;
    imageUrl?: string;
    colorhex?: string;
}

interface ParishProperties {
    name: string;
}

type Zoomable = { zoomIn: () => void; zoomOut: () => void };

type MapFullProps = {
    onMarkerClick?: (feature: Feature<Point> | null) => void;
    geojsonData: FeatureCollection<Point> | null;
};

const getDirectionLetter = (bearing: number): string => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

const MapFull = forwardRef<Zoomable, MapFullProps>(({ onMarkerClick = () => {}, geojsonData }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    const markerDataRef = useRef<{
        root: Root;
        name: string;
        pointimage?: string;
        colorhex?: string;
    }[]>([]);
    
    const onMarkerClickRef = useRef(onMarkerClick);
    useEffect(() => {
        onMarkerClickRef.current = onMarkerClick;
    }, [onMarkerClick]);

    const compassDialRef = useRef<HTMLDivElement | null>(null);
    const [directionLetter, setDirectionLetter] = useState<string>('N');
    const [is3D, setIs3D] = useState<boolean>(false);
    const [isAboveThreshold, setIsAboveThreshold] = useState<boolean>(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
        zoomIn: () => map.current?.zoomIn({ duration: 300 }),
        zoomOut: () => map.current?.zoomOut({ duration: 300 }),
    }));

    const handleToggle3D = () => setIs3D(prev => !prev);
    
    const handleResetNorth = () => {
        if (!map.current) return;
        map.current.flyTo({ bearing: 0, pitch: is3D ? 60 : 0, duration: is3D ? 1000 : 500 });
    };

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const initializeMap = async () => {
            try {
                const response = await fetch('/data/barbados_parishes.geojson');
                if (!response.ok) throw new Error("Failed to fetch GeoJSON");
                const parishData: FeatureCollection<Polygon | MultiPolygon, ParishProperties> = await response.json();
                const stJosephFeature = parishData.features.find(f => f.properties.name === 'Saint Joseph');
                
                if (!stJosephFeature) {
                    console.error("Could not find 'Saint Joseph' in GeoJSON.");
                    return;
                }
                
                const shiftedStJosephFeature = turf.transformTranslate(stJosephFeature, 0.5, 135, { units: 'kilometers' });
                const bbox = turf.bbox(shiftedStJosephFeature); 
                const mapBounds: [number, number, number, number] = [bbox[0], bbox[1], bbox[2], bbox[3]];

                map.current = new mapboxgl.Map({
                    container: mapContainer.current!,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    bounds: mapBounds,
                    fitBoundsOptions: { padding: 20, duration: 0 },
                    maxBounds: mapBounds,
                    minZoom: 10,
                    attributionControl: false,
                    pitch: 0,
                });

                const updateThreshold = () => {
                    const z = map.current!.getZoom();
                    setIsAboveThreshold(z >= ZOOM_THRESHOLD);
                };
                
                map.current.on('load', () => {
                    // FIX 1: Check if source exists before adding to prevent crash in Strict Mode.
                    if (!map.current!.getSource('mapbox-dem')) {
                        map.current!.addSource('mapbox-dem', {
                            'type': 'raster-dem',
                            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                            'tileSize': 512,
                            'maxzoom': 14
                        });
                    }

                    // FIX 1: Check if layer exists before adding.
                    if (!map.current!.getLayer('3d-buildings')) {
                        map.current!.addLayer({
                            'id': '3d-buildings',
                            'source': 'composite',
                            'source-layer': 'building',
                            'filter': ['==', 'extrude', 'true'],
                            'type': 'fill-extrusion',
                            'minzoom': 14,
                            'layout': {
                                'visibility': 'none'
                            },
                            'paint': {
                                'fill-extrusion-color': '#aaa',
                                'fill-extrusion-height': ['get', 'height'],
                                'fill-extrusion-base': ['get', 'min_height'],
                                'fill-extrusion-opacity': 0.8
                            }
                        });
                    }

                    updateThreshold();
                    map.current!.on('click', (e) => {
                       if (!e.defaultPrevented) onMarkerClickRef.current(null);
                    });
                    setMapLoaded(true);
                });
                map.current.on('zoom', updateThreshold);

                map.current.on('rotate', () => {
                    const newBearing = map.current!.getBearing();
                    if (compassDialRef.current) compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
                    setDirectionLetter(getDirectionLetter(newBearing));
                });

            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        initializeMap();

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapLoaded || !geojsonData || !map.current) return;
        const mapInstance = map.current;

        const newMarkers: {
            marker: mapboxgl.Marker;
            root: Root;
            name: string;
            pointimage?: string;
            colorhex?: string;
            handleClick: (e: MouseEvent) => void;
        }[] = [];

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
                onMarkerClickRef.current(feature);
                mapInstance.flyTo({
                    center: coordinates as [number, number],
                    zoom: 15,
                    essential: true
                });
            };
            
            marker.getElement().addEventListener('click', handleClick);

            newMarkers.push({ marker, root, name, pointimage, colorhex, handleClick });
        }
        
        // Update the ref used by the isAboveThreshold effect
        markerDataRef.current = newMarkers.map(({ root, name, pointimage, colorhex }) => ({
             root, name, pointimage, colorhex
        }));

        // FIX 2: Return a single, robust cleanup function.
        return () => {
            newMarkers.forEach(({ marker, root, handleClick }) => {
                // Remove event listener to prevent memory leaks
                marker.getElement().removeEventListener('click', handleClick);
                marker.remove();
                // Defer unmount to prevent race condition with React's render cycle
                setTimeout(() => root.unmount(), 0);
            });
            markerDataRef.current = [];
        };
    }, [geojsonData, mapLoaded]);

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

    useEffect(() => {
        if (!mapLoaded) return;
        
        const duration = 1200;
        if (is3D) {
            map.current!.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
            map.current!.setLayoutProperty('3d-buildings', 'visibility', 'visible');
            map.current!.flyTo({ pitch: 60, bearing: map.current!.getBearing(), duration });
        } else {
            map.current!.setTerrain(null);
            map.current!.setLayoutProperty('3d-buildings', 'visibility', 'none');
            map.current!.flyTo({ pitch: 0, bearing: map.current!.getBearing(), duration });
        }
    }, [is3D, mapLoaded]);

    return (
        <div className='h-full w-full relative'>
            <div ref={mapContainer} className='h-full w-full' />
            <div className='fixed bottom-[130px] max-sm:bottom-auto max-sm:top-[85px] flex flex-col max-sm:flex-row max-sm:right-[14px] right-[21px] max-sm:items-center items-end gap-[5px]'>
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