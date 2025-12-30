import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Site, TripData } from '@/app/types/map';
import searchIcon from '@/public/icons/search-icon.svg';
import arrowIcon from "@/public/icons/arrow-icon.svg";
import ShareIcon from "@/public/icons/share-icon";
import PlayIcon from "@/public/icons/play-icon";
import LikeButton from '@/app/components/map/LikeButton';
import DirectionsPopup from '@/app/components/map/DirectionsPopup';
import InfoPopup from '@/app/components/map/InfoPopup';
import TripPlanner from '@/app/components/map/TripPlanner';

interface SearchResultsProps {
  sites: Site[];
  selectedSite: Site | null;
  setSelectedSite: (s: Site | null) => void;
  mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
  mobileSearchReady: boolean;
  handleMobileSearchTap: () => void;
  mobileSearchOpen: boolean;
  isLiked: boolean;
  onToggleLike: () => void;
  onSaveTrip: (data: TripData) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const MOCK_GALLERY = [
  { type: 'image', src: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg' },
  { type: 'video', src: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' }, 
  { type: 'image', src: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg' },
  { type: 'image', src: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg' },
];

export const SearchResults = React.memo(function SearchResults({
  sites,
  selectedSite,
  setSelectedSite,
  mobileSearchInputRef,
  mobileSearchReady,
  handleMobileSearchTap,
  mobileSearchOpen,
  isLiked, 
  onToggleLike,
  onSaveTrip,
  searchQuery,
  onSearchChange
}: SearchResultsProps) {
  
  const [isPlanningTrip, setIsPlanningTrip] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset trip planner state when selectedSite changes or closes
  useEffect(() => {
    if (!selectedSite) setIsPlanningTrip(false);
  }, [selectedSite]);

  // Handle scroll for the shadow effect
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setIsScrolled(scrollContainerRef.current.scrollTop > 0);
    }
  }, []);

  // Handle header click to expand on mobile
  const handleHeaderClick = () => {
    if (!mobileSearchOpen) {
      handleMobileSearchTap();
    }
  };

  // Check for text overflow for the scrolling effect
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && containerRef.current) {
        setIsTitleOverflowing(titleRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [selectedSite, mobileSearchOpen]);

  return (
    <div className='relative w-full h-full '>
      
      {/* --- VIEW 1: SEARCH & LIST --- */}
      <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-300 ${selectedSite ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`relative transition-all duration-400 ease-in-out transform-gpu ${mobileSearchOpen ? 'mt-[13px] w-[93%] mx-auto' : 'w-full self-center'}`}>
          <span className='absolute z-10 mt-[11.5px] ml-[15px] fill-[#E0E0E0]'>
            <Image src={searchIcon} alt='Search Icon' height={25} />
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            ref={mobileSearchInputRef}
            type='text'
            placeholder='Search St Joseph'
            readOnly={!mobileSearchReady}
            onPointerDown={handleMobileSearchTap}
            inputMode='search'
            className="bg-black/40 rounded-full h-[50px] w-full text-[#E0E0E0] placeholder-[#E0E0E0] p-3 font-bold pl-[50px] outline-none"
          />
        </div>

        {mobileSearchOpen && (
          <div className='mt-2 overflow-y-auto overflow-x-hidden flex-1 pb-[10px]'>
            <ul className='px-3 pb-[5px] gap-[10px] mt-[10px] flex flex-col'>
              {sites.map((site) => (
                <li key={site.id}>
                  <div className='bg-white/10 active:scale-[.98] rounded-[37px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] transform-gpu'>
                    <button onClick={() => setSelectedSite(site)} className='flex w-full text-wrap text-left cursor-pointer rounded-[35px] bg-black/40 overflow-hidden hover:bg-black/40 transition-colors duration-150 p-2 gap-3'>
                      {site.imageUrl ? (
                        <Image src={site.imageUrl} alt='site' width={80} height={80} className='min-w-[80px] min-h-[80px] object-cover rounded-[28px] max-w-[80px] max-h-[80px]' sizes="80px" />
                      ) : <div className='min-w-[80px] min-h-[80px] bg-black/20 rounded-[28px]' />}
                      <div className='flex-1'>
                        <div className='font-semibold text-white leading-tight text-[1.2rem]'>{site.name}</div>
                        <div className='text-sm text-[#E0E0E0]/80 line-clamp-2 pr-4 text-wrap'>{site.category}</div>
                      </div>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- VIEW 2: DETAILS --- */}
      <div className={`absolute inset-0 flex flex-col h-full transition-opacity duration-400 ${selectedSite ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {selectedSite && (
          isPlanningTrip ? (
            <TripPlanner 
              sites={sites} 
              onBack={() => setIsPlanningTrip(false)}
              onClose={() => { setIsPlanningTrip(false); setSelectedSite(null); }}
              mobileSearchOpen={mobileSearchOpen}
              onHeaderClick={handleHeaderClick}
              onSaveTrip={onSaveTrip}
            />
          ) : (
            <>
              {/* Header with Animation */}
              <div onClick={handleHeaderClick} className={`absolute z-30 flex items-center px-[10px] justify-between transition-all duration-400 rounded-full ${mobileSearchOpen ? 'bg-black/0 pt-[7.5px] mt-[6px] pb-[0px] w-[100%] px-[15px]' : 'bg-black/0 mt-[0px] py-[7.5px] w-[100%]'}`}>
                <button onClick={(e) => { e.stopPropagation(); setSelectedSite(null); }} className={`inline-flex pr-[10px] active:scale-[.95] shrink-0 cursor-pointer items-center gap-2 text-white/90 hover:text-white active:opacity-80 ${mobileSearchOpen ? 'mt-[-6px]' : 'mt-[-6px]'}`}>
                  <span className='rotate-[-90deg]'><Image src={arrowIcon} alt='Back Icon' height={35} /></span>
                </button>   

                <div ref={containerRef} className='flex flex-col text-right pr-3 pt-1 flex-1 mt-[-11px] min-w-0 overflow-hidden relative'>
                  <style jsx>{`
                    @keyframes marquee-loop {
                      0%, 15% { transform: translateX(0%); }
                      45% { transform: translateX(-105%); }
                      45.01% { transform: translateX(105%); }
                      75%, 100% { transform: translateX(0%); }
                    }
                    .scrolling-text {
                      display: inline-block; white-space: nowrap; padding-right: 10px;
                      animation: marquee-loop 12s linear infinite; will-change: transform; 
                    }
                  `}</style>
                  <div className="w-full overflow-hidden block">
                    <h2 ref={titleRef} className={`font-bold text-white text-[1.23rem] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transition-all duration-400 ${mobileSearchOpen ? 'mt-[10px]' : 'mt-[0px]'} ${isTitleOverflowing ? 'scrolling-text' : 'truncate'}`}>
                      {selectedSite.name}
                    </h2>
                  </div>
                  <p className='text-[#E0E0E0] mt-[-5px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)] truncate'>{selectedSite.category}</p>
                </div>
              </div>

              {/* Scroll Shadow */}
              <div className={`absolute w-full bg-[#676767] transition-all duration-400 ease-in-out z-[20] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] ${isScrolled ? 'opacity-100' : 'opacity-0'} ${mobileSearchOpen ? 'h-[100px]' : 'h-0 opacity-0'}`} />

              <div ref={scrollContainerRef} onScroll={handleScroll} className={`overflow-y-auto flex-1 p-0 space-y-4 transition-opacity duration-300 ease-in-out ${mobileSearchOpen ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                
                {/* Main Content Card */}
                <div className='flex flex-col rounded-[16px] overflow-hidden pb-3 gap-5'>
                  {/* Description Section */}
                  <div className='flex flex-col gap-2 text-sm text-[#E0E0E0] mt-[90px]'>
                    <p className='font-bold text-[1.2rem] px-4'>Description</p>
                    <p className='text-black font-[500] px-4 text-white'>{selectedSite.description}</p>
                  </div>

                  {/* Actions Section */}
                  <div className='px-4'>
                    <div className='flex gap-4 text-sm text-[#E0E0E0]'>
                      <div className='flex w-[100%] text-center items-center bg-black/0 gap-[5px]'>
                        <DirectionsPopup name={selectedSite.name} lat={selectedSite.coordinates[1]} lng={selectedSite.coordinates[0]} />
                        
                        <div className='active:scale-[.98]'>
                          <LikeButton isLiked={isLiked} onClick={onToggleLike} />
                        </div>
                        
                        <Link href={`/${selectedSite.slug}`} passHref>
                          <div className='bg-white/10 active:scale-[.98] rounded-[26px] h-[62px] min-w-[62px] p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)]'>
                            <ShareIcon size={45} color="#fff" className='bg-black/30 p-[13px] h-[100%] w-[100%] rounded-[23px]'/>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className='flex flex-col gap-[15px] mb-[17px]'>
                  <div className='bg-white/10 h-[2px] w-[65%] self-center'></div>
                  <p className='font-bold text-[1.2rem] px-4'>Media</p>
                  
                  <div className='flex flex-row gap-2 text-sm text-[#E0E0E0] w-[100%] px-4 overflow-x-scroll mt-[0px] hide-scrollbar'>
                    
                    {/* Item 1: Large */}
                    <div className='active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800'>
                      <Image src={MOCK_GALLERY[0].src} alt="Gallery 1" fill className='object-cover' sizes="(max-width: 768px) 50vw, 200px" />
                    </div>

                    {/* Item 2: Column */}
                    <div className='snap-start flex flex-col gap-3 min-w-[120px]'>
                      <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                        <Image src={MOCK_GALLERY[1].src} alt="Gallery 2" fill className='object-cover' />
                      </div>
                      <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                        <Image src={MOCK_GALLERY[2].src} alt="Gallery 3" fill className='object-cover' />
                      </div>
                    </div>

                    {/* Item 3: Video */}
                    <div className='active:scale-[.98] snap-start relative min-h-[250px] min-w-[180px] rounded-[30px] overflow-hidden bg-neutral-800 group cursor-pointer'>
                      <Image src={MOCK_GALLERY[3].src} alt="Video" fill className='object-cover opacity-80' />
                      <div className='absolute inset-0 flex'>
                        <PlayIcon size={20} color="#fff" className='absolute top-[15px] right-[15px] drop-shadow-[0px_0px_5px_rgba(0,0,0,0.4)]'/>
                      </div> 
                    </div>

                    {/* Item 4: Column */}
                    <div className='snap-start flex flex-col gap-3 min-w-[120px]'>
                      <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                        <Image src={MOCK_GALLERY[4].src} alt="G5" fill className='object-cover' />
                      </div>
                      <div className='active:scale-[.98] relative h-[119px] w-[120px] rounded-[30px] overflow-hidden bg-neutral-800'>
                        <Image src={MOCK_GALLERY[5].src} alt="G6" fill className='object-cover' />
                      </div>
                    </div>

                    {/* View All Button */}
                    <button className='snap-start relative cursor-pointer min-h-[250px] min-w-[120px] rounded-[30px] overflow-hidden border-[1px] active:scale-[.98] [mask-image:radial-gradient(white,black)] border-white/10'>
                      <div className='absolute inset-0 flex flex-col gap-[1px] rounded-[30px] overflow-hidden'>
                        <div className='relative flex-1 w-full bg-neutral-800'><Image src={MOCK_GALLERY[0].src} alt="" fill className='object-cover' /></div>
                        <div className='relative flex-1 w-full bg-neutral-800'><Image src={MOCK_GALLERY[1].src} alt="" fill className='object-cover' /></div>
                        <div className='relative flex-1 w-full bg-neutral-800'><Image src={MOCK_GALLERY[2].src} alt="" fill className='object-cover' /></div>
                      </div>
                      <div className='absolute inset-0 flex flex-col items-center justify-center z-10 p-2'>
                        <p className='text-[0.8rem] font-bold text-white uppercase tracking-[0.15em] text-center leading-relaxed'>See<br/>More</p>
                        <div className='h-[100%] w-[100%] absolute bg-black/40 backdrop-blur-[2px] z-[-200]'/>
                      </div>
                    </button>
                  </div>

                  <div className='bg-white/10 h-[2px] w-[65%] self-center'></div>
                  
                  <div className='w-[90%] flex self-center items-center gap-[10px]'>
                    <div onClick={() => setIsPlanningTrip(true)} className='self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-[26px] p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] -mr-[2px] w-[100%]'>
                      <div className='flex flex-col text-center w-[100%] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-[23px] px-[15px] py-[15.4px]'>
                        <span className='text-white font-bold'>Create a custom trip</span>
                      </div>
                    </div>
                    <div className='relative'>
                      <InfoPopup key={selectedSite.id} />
                    </div>
                  </div>

                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
});