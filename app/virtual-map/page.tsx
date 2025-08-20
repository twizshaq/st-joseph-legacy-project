"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
// CORRECTED IMPORT PATH: Changed 'FullMap' to 'MapFull'
import MapFull from '@/app/components/MapFull';
import searchIcon from '@/public/icons/search-icon.svg';
import Image from 'next/image';
import { Feature, Point, FeatureCollection } from 'geojson';
import arrowIcon from "@/public/icons/arrow-icon.svg"

// --- TYPE DEFINITIONS ---

type Zoomable = { zoomIn: () => void; zoomOut: () => void };

export type Site = {
  id: number;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  imageUrl: string;
};

// --- SEARCH RESULTS COMPONENT ---

function SearchResults({
  sites,
  selectedSite,
  setSelectedSite,
  mobileSearchInputRef,
  mobileSearchReady,
  handleMobileSearchTap,
  mobileSearchOpen,
}: {
  sites: Site[];
  selectedSite: Site | null;
  setSelectedSite: (s: Site | null) => void;
  mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
  mobileSearchReady: boolean;
  handleMobileSearchTap: () => void;
  mobileSearchOpen: boolean;
}) {
  const handleHeaderClick = () => {
    if (!mobileSearchOpen) {
      handleMobileSearchTap();
    }
  };

  return (
    <div className='relative w-full h-full'>
      {/* VIEW 1: The List View (Search Bar + Results) */}
      <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-300 ${selectedSite ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`relative transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'mt-[13px] w-[93%] mx-auto' : 'w-full self-center'}`}>
          <span className='absolute z-10 mt-[11.5px] ml-[15px] fill-[#E0E0E0]'>
            <Image src={searchIcon} alt='Search Icon' height={25} />
          </span>
          <input
            ref={mobileSearchInputRef}
            type='text'
            placeholder='Search St Joseph'
            readOnly={!mobileSearchReady}
            onPointerDown={handleMobileSearchTap}
            inputMode='search'
            className="bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none"/>
        </div>
        {mobileSearchOpen && (
          <div className='mt-2 overflow-y-auto overflow-x-hidden flex-1 rounded-[16px]'>
            <ul className='px-3 pb-[5px] gap-[10px] mt-[10px] flex flex-col'>
              {sites.map((site) => (
                <li key={site.id}>
                  <button
                    onClick={() => setSelectedSite(site)}
                    className='flex flex-col w-full text-left rounded-[35px] bg-black/50 hover:bg-black/40 transition-colors duration-150 px-4 py-4 gap-3 mb-2'
                  >
                    <div className='flex-1'>
                      <div className='font-semibold text-white leading-tight text-[1rem]'>{site.name}</div>
                      <div className='text-sm text-[#E0E0E0]/80 line-clamp-2'>{site.description}</div>
                    </div>
                    <div className='relative flex flex-row gap-2'>
                      {/* Placeholder images */}
                      <div className='min-w-[60px] min-h-[60px] overflow-hidden rounded-[17px] bg-black/30'></div>
                      <div className='min-w-[60px] min-h-[60px] overflow-hidden rounded-[17px] bg-black/30'></div>
                      <div className='min-w-[60px] min-h-[60px] overflow-hidden rounded-[17px] bg-black/30'></div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* VIEW 2: The Detail View */}
      <div className={`absolute inset-0 flex flex-col h-full py-[6px] transition-opacity duration-300 ${selectedSite ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {selectedSite && (
          <>
            <div onClick={handleHeaderClick} className={`sticky z-10 flex items-center px-[10px] justify-between transition-all duration-400 rounded-full ${mobileSearchOpen ? 'bg-black/0 py-[7.5px] w-[100%] px-[15px]' : 'bg-black/40 mt-[-6px] py-[7.5px] w-[100%]'}`}>
              <button onClick={() => setSelectedSite(null)} className='inline-flex items-center gap-2 text-white/90 hover:text-white active:opacity-80'>
                <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
              </button>
              <h2 className='font-bold text-white truncate text-lg pr-2 text-shadow-[0px_0px_10px_rgba(0,0,0,0.3)]'>
                {selectedSite.name}
              </h2>
            </div>
            <div className='overflow-y-auto flex-1 p-4 space-y-4'>
              {/* Example detail card */}
              <div className='rounded-[16px] overflow-hidden bg-white/5 p-4'>
                <h3 className='text-white text-lg font-bold mb-1'>{selectedSite.name}</h3>
                <p className='text-[#E0E0E0] mb-3'>{selectedSite.description}</p>
                <div className='flex flex-wrap gap-2 text-sm text-[#E0E0E0]'>
                  <span className='bg-white/10 rounded-full px-2 py-1'>Lon: {selectedSite.coordinates[0]}</span>
                  <span className='bg-white/10 rounded-full px-2 py-1'>Lat: {selectedSite.coordinates[1]}</span>
                </div>
              </div>
              {/* Add more detail cards as needed */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function FullScreenMapPage() {
  const mapRef = useRef<Zoomable | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchReady, setMobileSearchReady] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchSites = async () => {
      // !!! IMPORTANT: PASTE YOUR PUBLISHED GOOGLE SHEET CSV URL HERE !!!
      // It MUST end with /pub?output=csv
      const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;

      try {
        const response = await fetch(GOOGLE_SHEET_URL || "");
        if (!response.ok) throw new Error('Network response was not ok');
        
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.trim()).filter(row => row); // filter empty rows
        const headers = rows[0].split(',').map(h => h.trim());
        
        const siteData: Site[] = rows.slice(1).map(row => {
          const values = row.split(',');
          const entry = headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim().replace(/"/g, '') || ''; // Clean up quotes
            return obj;
          }, {} as Record<string, string>);

          return {
            id: parseInt(entry.id, 10) || 0,
            name: entry.name || 'Unnamed Site',
            description: entry.description || '',
            coordinates: [parseFloat(entry.longitude) || 0, parseFloat(entry.latitude) || 0] as [number, number],
            imageUrl: entry.imageUrl || '',
          };
        }).filter(site => site.id && site.coordinates[0] && site.coordinates[1]); // Ensure essential data is present

        setSites(siteData);
      } catch (error) {
        console.error("Failed to fetch or parse site data from Google Sheet:", error);
      }
    };

    fetchSites();
  }, []); // Empty dependency array means this runs once on mount

  // --- DATA TRANSFORMATION ---
  const geojsonData = useMemo((): FeatureCollection<Point> | null => {
    if (sites.length === 0) return null;

    const features: Feature<Point>[] = sites.map(site => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: site.coordinates,
      },
      properties: { ...site }, // Pass all site data in properties
    }));

    return { type: 'FeatureCollection', features };
  }, [sites]);

  // --- HANDLERS ---
  // AFTER THE FIX
    const handleMarkerClick = (feature: Feature<Point> | null) => {
      if (!feature || !feature.properties) {
        setSelectedSite(null);
        // We don't need to change mobileSearchOpen when closing
        return;
      }

      const site = sites.find(s => s.id === feature.properties?.id);

      if (site) {
        setSelectedSite(site);
        setMobileSearchOpen(true); // This is the line that fixes it!
      } else {
        setSelectedSite(null);
      }
    };

  const closeSearchPanels = () => {
    setMobileSearchOpen(false);
    setMobileSearchReady(false);
  };

  const handleMobileSearchTap = () => {
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileSearchReady(false);
      return;
    }
    if (!mobileSearchReady) {
      try { mobileSearchInputRef.current?.removeAttribute('readonly'); } catch {}
      flushSync(() => setMobileSearchReady(true));
      const el = mobileSearchInputRef.current;
      if (el) {
        el.focus({ preventScroll: true });
        try { el.setSelectionRange(el.value.length, el.value.length); } catch {}
      }
    }
  };

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!desktopSearchRef.current?.contains(target) && !mobileSearchRef.current?.contains(target)) {
        closeSearchPanels();
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [mobileSearchOpen]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  // --- RENDER ---
  return (
    <div className="h-[100dvh] overflow-hidden">
      <div className="absolute inset-0">
        <MapFull ref={mapRef} onMarkerClick={handleMarkerClick} geojsonData={geojsonData} />
      </div>

      {/* Desktop Zoom Controls */}
      <div className='absolute bottom-[20px] right-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] hidden sm:block'>
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
          <div className='rounded-full bg-black/40 backdrop-blur-[5px] flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
            <button onClick={handleZoomIn} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
              <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
              <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
            </button>
            <button onClick={handleZoomOut} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
              <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Search Panel */}
      <div className='absolute bottom-[20px] left-[20px] cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[400px] hidden sm:block'>
        <div ref={desktopSearchRef} className={`bg-white/10 backdrop-blur-[15px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[47px]`}>
          <div className={`bg-black/45 relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[55vh] rounded-[45px]' : 'h-[58px] rounded-[47px] p-[4px]'}`}>
            <SearchResults sites={sites} selectedSite={selectedSite} setSelectedSite={setSelectedSite} mobileSearchInputRef={mobileSearchInputRef} mobileSearchReady={mobileSearchReady} handleMobileSearchTap={handleMobileSearchTap} mobileSearchOpen={mobileSearchOpen} />
          </div>
        </div>
      </div>

      {/* Mobile-only stacked controls */}
      <div className='absolute bottom-[20px] right-[15px] sm:hidden flex flex-col items-end gap-[12px] w-[calc(100vw-25px)]'>
        <div className={`cursor-pointer whitespace-nowrap rounded-full p-[3px] -mr-[2px] transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <div className='rounded-full bg-black/45 backdrop-blur-[5px] flex flex-col gap-0 w-[45px] overflow-hidden z-[40]'>
              <button onClick={handleZoomIn} className='px-[10px] py-[20px] pt-[25px] relative active:bg-white/10 flex justify-center items-center'>
                <div className='bg-white h-[3px] w-[90%] rounded-full'></div>
                <div className='absolute bg-white h-[3px] w-[50%] rounded-full rotate-[90deg]'></div>
              </button>
              <button onClick={handleZoomOut} className='px-[12px] py-[20px] pb-[23px] active:bg-white/10'>
                <div className='bg-white h-[3px] w-[100%] rounded-full'></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Panel */}
        <div className='cursor-pointer whitespace-nowrap rounded-full p-[3px] w-full'>
          <div ref={mobileSearchRef} className={`bg-white/10 backdrop-blur-[7px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-400 ease-in-out rounded-[47px]`}>
            <div className={`bg-black/45 relative w-full overflow-hidden transition-all duration-400 ease-in-out ${mobileSearchOpen ? 'h-[60vh] rounded-[45px]' : 'h-[58px] rounded-[47px] p-[4px]'}`}>
              <SearchResults sites={sites} selectedSite={selectedSite} setSelectedSite={setSelectedSite} mobileSearchInputRef={mobileSearchInputRef} mobileSearchReady={mobileSearchReady} handleMobileSearchTap={handleMobileSearchTap} mobileSearchOpen={mobileSearchOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}