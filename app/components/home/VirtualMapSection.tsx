"use client";

import React, { useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Feature, Point, FeatureCollection } from 'geojson';
import Map from '@/app/components/map/Map';
import Compass from '@/app/components/map/Compass';
import { AlertIcon } from '@/public/icons/alert-icon';
import enlargeIcon from '@/public/icons/enlarge-icon.svg';
import { Site, SiteCard } from '@/app/types';

// Types specific to this component's interaction with the Map component
type MapControlsHandle = {
    zoomIn: () => void;
    zoomOut: () => void;
    resetNorth: () => void;
};

interface VirtualMapSectionProps {
    sites: Site[];
    siteCards: SiteCard[];
}

const getDirectionLetter = (bearing: number): string => {
    if (bearing > -45 && bearing <= 45) return 'N';
    if (bearing > 45 && bearing <= 135) return 'E';
    if (bearing > 135 || bearing <= -135) return 'S';
    if (bearing > -135 && bearing <= -45) return 'W';
    return 'N';
};

export default function VirtualMapSection({ sites, siteCards }: VirtualMapSectionProps) {
    const mapRef = useRef<MapControlsHandle | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const compassDialRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [directionLetter, setDirectionLetter] = useState('N');

    const geojsonData = useMemo((): FeatureCollection<Point> | null => {
        if (siteCards.length === 0 || sites.length === 0) {
            return null;
        }
        const featuredSiteIds = new Set(siteCards.map(card => card.id));
        const featuredSites = sites.filter(site => featuredSiteIds.has(site.id));
        const features: Feature<Point>[] = featuredSites.map(site => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: site.coordinates },
            properties: { ...site },
        }));
        return { type: 'FeatureCollection', features };
    }, [siteCards, sites]);

    const handleZoomIn = () => mapRef.current?.zoomIn();
    const handleZoomOut = () => mapRef.current?.zoomOut();
    const handleResetNorth = () => mapRef.current?.resetNorth();
    
    const handleMapRotate = useCallback((newBearing: number) => {
        if (compassDialRef.current) {
            compassDialRef.current.style.transform = `rotate(${-newBearing}deg)`;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
            setDirectionLetter(getDirectionLetter(newBearing));
        });
    }, []);

    return (
        <div className='bg-pink-500/0 flex flex-col xl:items-center lg:items-center md:items-center w-[90vw] mt-[200px]'>
            <p className='font-bold text-[2rem] max-sm:text-[1.5rem] text-center'>Virtual Map of St. Joseph</p>
            <p className='max-w-[800px] text-center'>Explore St. Joseph with our interactive Virtual Map—your digital guide for planning routes or exploring from home. Click locations for details, build your own tour, or book one of our available guided tours.</p>

            <div ref={mapContainerRef} className='relative h-[500px] max-sm:h-[400px] w-[1000px] max-w-[90vw] rounded-[60px] mt-[50px] overflow-hidden shadow-[0px_0px_15px_rgba(0,0,0,0.1)] border-4 border-white'>

                <Map ref={mapRef} geojsonData={geojsonData} onRotate={handleMapRotate} />

                <div className='absolute top-[20px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                    <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                        <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 p-[0px] py-[0px] w-[45px] overflow-hidden z-[40]'>
                            <button
                                onClick={handleZoomIn}
                                className='rounded-[0px] px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'
                            >
                                <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                                <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
                            </button>
                            <button
                                onClick={handleZoomOut}
                                className='rounded-[0px] px-[12px] py-[20px] pb-[23px] active:bg-white/10'
                            >
                                <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='absolute top-[130px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
                    <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                        <button onClick={handleResetNorth} className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center z-[10]" aria-label="Reset bearing to north">
                            <Compass ref={compassDialRef} directionLetter={directionLetter} />
                        </button>
                    </div>
                </div>

            <Link href="/feedback">
                <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                    <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                        <button className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] flex flex-row text-white font-bold px-[15px] py-[10px] gap-[10px] z-[40]'>
                            <AlertIcon size={23} color="white" />
                            <p className=''>Feedback</p>
                        </button>
                    </div>
                </div>
            </Link>

                <Link href="/virtual-map" target="_blank" rel="noopener noreferrer">
                    <div className='absolute top-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px]'>
                        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                            <div className='rounded-full active:bg-black/30 bg-black/40 backdrop-blur-[5px] p-[8px] z-[40] '>
                                <Image src={enlargeIcon} alt="Open map in new tab" height={30} width={30} />
                            </div>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}