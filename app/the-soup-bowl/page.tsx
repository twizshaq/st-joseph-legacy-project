"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

// 1. Data Hook
import { useSiteData } from '@/app/hooks/useSiteData';

// 2. Widget Components
import { SiteSafety } from '@/app/components/site/SiteSafety';
import { SiteFacts } from '@/app/components/site/SiteFacts';
import { SiteQuiz } from '@/app/components/site/SiteQuiz';

// 3. Shared Components
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { GalleryModal } from "@/app/components/site/GalleryModal";
import Footer from "@/app/components/FooterModal";
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";
import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";
import { WaveformAudioPlayer } from "@/app/components/site/CustomAudioPlayer";
import { ReportModal } from "@/app/components/ReportModal";

// Icons & Data
import PenIcon from "@/public/icons/pen-icon";
import { stories } from '@/public/data/stories';

const GALLERY_ITEMS = [
  { type: 'image', src: 'https://i.pinimg.com/736x/ac/c5/16/acc5165e07eba2b8db85c8a7bcb2eda6.jpg' }, // 0
  { type: 'video', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4' }, // 1
  { type: 'photo_360', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg' }, // 2
  { type: 'image', src: 'https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg' }, // 3
  { type: 'image', src: 'https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg' }, // 4
  { type: 'image', src: 'https://i.pinimg.com/736x/b2/1a/4e/b21a4edd98d5deeae826a459aeeb1b26.jpg' }, // 5
  { type: 'image', src: 'https://i.pinimg.com/736x/a5/71/41/a57141ad568104a6b1e49acedddd1eca.jpg' }, // 6
  { type: 'image', src: 'https://i.pinimg.com/736x/d8/51/26/d85126e7178f37e0f8cb5a73d495707d.jpg' }, // 7
  { type: 'image', src: 'https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg' }, // 8
  { type: 'image', src: 'https://i.pinimg.com/736x/4c/20/00/4c20006b09ffc0b4f31278d3009f7390.jpg' }, // 9
  { type: 'image', src: 'https://i.pinimg.com/736x/ee/f1/ed/eef1ed5ee44a821046bcd209a3e1fbcc.jpg' }, // 10
];

export default function SoupBowlPage() {
  const SITE_ID = 1;
  const { user, reviews, nearbySites, loadingReviews, loadingSites, fetchReviews, supabase } = useSiteData(SITE_ID);

  // Local UI State
  const [activeMedia, setActiveMedia] = useState<'video' | 'image' | '360'>('video');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [reportState, setReportState] = useState<{isOpen: boolean, reviewId: number | null}>({ isOpen: false, reviewId: null });

  // Review Delete Logic (Simple local implementation)
  const handleDeleteReview = async (reviewId: number) => {
    // Optimistic UI updates are handled by fetchReviews refresh usually, or strict local filter
    if(confirm("Delete this review?")) {
       await supabase.from('site_reviews').delete().eq('id', reviewId).eq('user_id', user?.id);
       fetchReviews(); 
    }
  };

  return (
    <div className='flex flex-col items-center self-center min-h-[100dvh] text-black bg-red-500/0 overflow-hidden'>
      
      {/* --- HERO --- */}
      <div className="relative flex flex-col justify-center items-center w-[100vw] max-w-[2000px] h-[100svh] text-white gap-[20px] overflow-hidden group">
        {activeMedia === 'video' && <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover animate-in fade-in duration-500"><source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" /></video>}
        {activeMedia === 'image' && <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500"><Image src={GALLERY_ITEMS[0].src} alt="Hero" fill className="object-cover" priority /></div>}
        {activeMedia === '360' && <div className="absolute top-0 left-0 w-full h-full animate-in fade-in duration-500 bg-black cursor-move"><ReactPhotoSphereViewer src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/Andromeda_20250920_110344_00_008.jpg" height={'100%'} width={"100%"} container={""} defaultZoomLvl={0} navbar={false} /></div>}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 pointer-events-none to-black/30" />

        <div className='absolute bottom-0 w-[1400px] max-w-[90vw] h-full pointer-events-none flex flex-col justify-end pb-[45px]'>
          <div className="w-full flex flex-col md:flex-row max-sm:mb-[-20px] items-end md:justify-between relative pointer-events-auto">
            <div className='z-10 mb-6 md:mb-0 self-start'>
              <p className="font-black text-[3rem] max-md:text-[2rem] text-start leading-[1.1] z-10 mb-[6px] text-shadow-sm drop-shadow-sm">Soup Bowl</p>
              <p className="text-[1rem] max-md:text-[1rem] text-start leading-[1.4] z-10 max-w-[400px] opacity-90">Known worldwide for its powerful reef breaks, Soup Bowl is a surfer’s paradise on the rugged east coast.</p>
            </div>
            
            <div className='z-20 flex gap-2'>
              {['video', 'image', '360'].map((media) => (
                <div key={media} className='bg-white/10 active:scale-[.98] backdrop-blur-[20px] w-fit h-fit rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                  <button onClick={() => setActiveMedia(media as any)} className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors ${activeMedia === media ? 'bg-[#007BFF]/90 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}>
                    <span className="text-sm font-bold capitalize">{media === 'image' ? 'Photo' : media}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-[#E0E0E0] w-[691px] max-w-[80vw] h-[2px] max-sm:mt-[60px] mt-[85px] rounded-full'></div>

      <SiteFacts />

      <div className='grid grid-cols-1 xl:grid-cols-12 gap-12 md:w-[90vw] max-w-[1400px] px-[5vw] xl:px-0 mt-[60px] md:mt-[80px] mb-[80px]'>
        <div className='col-span-1 xl:col-span-7 flex flex-col'>
          <p className='font-bold text-[2rem]'>About</p>
          <p className='text-lg leading-relaxed text-slate-700'>Bathsheba sits along Barbados’ wild Atlantic east coast, framed by dramatic rock formations shaped by centuries of relentless waves and wind. The coastline is famous for its natural rock pools, formed between coral boulders at low tide, creating sheltered pockets of calm amidst the roaring surf. Beyond its striking scenery, Bathsheba is a working fishing community where locals gather for weekend picnics, seaside cricket matches, and casual “liming” under the shade of sea grape trees. On most days, you’ll see brightly painted fishing boats pulled up on the sand, drying nets draped over their sides.
          </p>
          <br /><br />
          <p className='font-bold text-[2rem]'>History & Cultural Significance</p>
          <p className='text-lg leading-relaxed text-slate-700'>
            The name “Bathsheba” is rooted in local lore — some say it recalls the biblical Bathsheba, bathing in beauty, while others link it to the area’s healing mineral-rich waters once believed to have therapeutic benefits. For generations, Bathsheba has been a cultural hub for St. Joseph parish, serving as a meeting place for fishermen, artisans, and surfers alike. The famous Soup Bowl reef break has drawn both local legends and world-class surfers, putting this small village on the international surf map.
            <br /><br />
            Bathsheba’s surroundings form part of the Scotland District, a geologically unique area in the Caribbean where ancient sedimentary rock has been uplifted and eroded into steep hillsides. This fragile landscape has inspired local conservation efforts, with the community actively involved in preserving the area’s heritage and natural beauty. Cultural events, art festivals, and surf competitions here celebrate not just sport, but the deep connection between people, land, and sea.
          </p>
        </div>
        <div className='col-span-1 xl:col-span-5 w-full flex flex-col md:flex-row md:flex-wrap xl:flex-col items-start xl:items-end justify-center gap-6 xl:gap-10 h-fit'>
          <SiteSafety />
          <SiteQuiz user={user} siteId={SITE_ID} />
        </div>
      </div>

      <div className='gap-[50px] mb-[80px] bg-blue-500/0 self-center w-[1400px] max-w-[90vw]'>
        <div className='flex flex-col w-full'><p className='font-bold text-[2rem] mb-8 self-center'>Local Stories</p><div className='flex flex-wrap gap-x-10 gap-y-12 justify-center'>{stories.map((s,i)=><WaveformAudioPlayer key={i} title={s.title} src={s.src} />)}</div></div>
      </div>

      <div className='mb-[180px]'>
        <div className='flex flex-col text-center mb-[50px]'>
          <p className='font-bold text-[1.75rem]'>Photo & Video Gallery</p>
          <p className='text-[#666]'>A glimpse of the coastline, surf, and tidal pools</p>
        </div>
        <div className='relative flex flex-row justify-center items-end bg-green-500/0 min-h-[360px] sm:min-h-[420px] overflow-visible'>
          {/* Blurred color blobs behind the cards */}
          <div aria-hidden className='pointer-events-none absolute inset-0 z-0'>
            {/* <div className='absolute left-[5%] bottom-[0px] w-[320px] h-[320px] rounded-full bg-[#60A5FA]/40 blur-[90px]'></div> */}
            {/* <div className='absolute right-[6%] bottom-[10px] w-[300px] h-[300px] rounded-full bg-[#F472B6]/40 blur-[90px]'></div> */}
            {/* <div className='absolute left-1/2 -translate-x-1/2 top-[-10px] w-[360px] h-[360px] rounded-full bg-[#34D399]/35 blur-[100px]'></div> */}
            {/* <div className='absolute left-[22%] top-[0px] w-[220px] h-[220px] rounded-full bg-[#F59E0B]/35 blur-[80px]'></div> */}
          </div>

          {/* Card cluster (scaled down on small screens to keep spacing visually consistent) */}
          <div className='relative w-full flex justify-center items-end z-10 origin-bottom max-sm:scale-[0.76]'>
            
            {/* Center Card (Index 0) */}
            <div 
              onClick={() => { setSelectedIndex(0); setGalleryOpen(true); }}
              className='bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-20 shadow-[0px_0px_20px_rgba(0,0,0,.3)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
              style={{ backgroundImage: `url(${GALLERY_ITEMS[0]?.src})` }}
            ></div>

            {/* Right Inner Card (Index 3) */}
            <div 
              onClick={() => { setSelectedIndex(3); setGalleryOpen(true); }}
              className='absolute right-[220px] bottom-[80px] rotate-[7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
              style={{ backgroundImage: `url(${GALLERY_ITEMS[3]?.src})` }}
            ></div>

            {/* Left Inner Card (Index 4) */}
            <div 
              onClick={() => { setSelectedIndex(4); setGalleryOpen(true); }}
              className='absolute left-[220px] bottom-[80px] rotate-[-7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
              style={{ backgroundImage: `url(${GALLERY_ITEMS[4]?.src})` }}
            ></div>

            {/* Left Outer Card (Index 5) */}
            <div 
              onClick={() => { setSelectedIndex(5); setGalleryOpen(true); }}
              className='absolute left-[400px] bottom-[0px] rotate-[7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
              style={{ backgroundImage: `url(${GALLERY_ITEMS[5]?.src})` }}
            ></div>

            {/* Right Outer Card (Index 6) */}
            <div 
              onClick={() => { setSelectedIndex(6); setGalleryOpen(true); }}
              className='absolute right-[400px] bottom-[0px] rotate-[-7deg] bg-cover bg-center border-2 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)] transition-transform duration-300 hover:-translate-y-6 active:-translate-y-6 cursor-pointer'
              style={{ backgroundImage: `url(${GALLERY_ITEMS[6]?.src})` }}
            ></div>

          </div>
        </div>
        <div className='relative bg-green-500 flex flex-col justify-center items-center z-30'>
          {/* <div className="w-[100vw] absolute flex justify-center">
                        <div
                          className={`
                            bg-blue-500/0 bottom-[-100px]
                            absolute w-[1100px]
                            backdrop-blur-[15px] [mask-image:linear-gradient(to_top,black_40%,transparent)] opacity-100 h-[300px]
                          `}
                        ></div>
                      </div> */}

                  <Portal>
                    {galleryOpen && (
                      <GalleryModal 
                        items={GALLERY_ITEMS} 
                        initialIndex={selectedIndex} 
                        onClose={() => setGalleryOpen(false)} 
                      />
                    )}
                  </Portal>
            <div className='absolute bottom-[-80px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 active:scale-[.98] backdrop-blur-[3px] rounded-full p-[2.7px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <button onClick={() => setGalleryOpen(true)} className="cursor-pointer flex items-center py-[10px] px-[20px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  {/* <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={photoIcon} alt="" height={30} className=''/>
                  </span> */}
                  <p className='font-bold text-[#fff]'>Open Gallery</p>
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* --- REVIEWS --- */}
      <div className='relative flex flex-col items-center w-[1400px] max-w-[90vw] mb-[120px]'>
        <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
          <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'><p className='font-bold text-[2rem] leading-tight max-sm:text-center text-slate-800'>Traveler Experiences</p></div>
          <div onClick={() => user ? setReviewOpen(true) : setAuthOpen(true)} className='cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-95'><button className='cursor-pointer'><div className='flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'><span><PenIcon color='#fff'/></span><p className='text-white font-bold'>Add Comment</p></div></button></div>
        </div>
        <div className='relative max-sm:w-[100vw] w-[90vw] max-w-[1400px] overflow-visible z-10'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' />
          {loadingReviews ? <div className='flex gap-6 overflow-x-auto'><ReviewSkeleton/><ReviewSkeleton/><ReviewSkeleton/></div> : 
           reviews.length === 0 ? <div className="text-center p-8"><span className="text-4xl">🧐</span><p>No Reviews Yet</p></div> : 
           <div className='flex overflow-x-auto pb-12 pt-4 gap-6 px-4 hide-scrollbar'>{reviews.slice(0, 5).map(r => <ReviewCard key={r.id} experience={{ id:r.id, user_id:r.user_id, username:r.profiles?.username||'Anon', user_avatar:r.profiles?.avatar_url, description:r.review_text, rating:r.rating, upload_date:new Date(r.created_at).getTime() }} currentUserId={user?.id} onDelete={handleDeleteReview} onReport={(id) => setReportState({isOpen:true, reviewId:id})} />)}</div>
          }
        </div>
      </div>

      {/* --- NEARBY --- */}
      <div className='relative flex flex-col items-center w-[1400px] max-w-[90vw] max-sm:max-w-[100vw]'>
        
        {/* Header aligned to match Reviews */}
        <div className='w-full px-[5.4vw] md:px-0 mb-[10px] self-start'>
          <p className='font-bold text-[1.75rem]'>Nearby Sites</p>
          <p className='text-[#666] font-medium'>Plan your route across St. Joseph</p>
        </div>
        
        {/* Scroll Container (Exact copy of Review scroll styling) */}
        <div className='relative w-full overflow-visible z-10'>
          
          <div className="flex overflow-x-auto pb-12 pt-4 gap-6 max-sm:w-[100vw] md:w-[90vw] w-[1400px] px-4 max-sm:px-6 scroll-smooth mandatory hide-scrollbar">
            
            {/* Dynamic Map of Nearby Sites */}
            {loadingSites ? (
              // Show 5 Skeletons while loading
              <div className='flex gap-6'>
                <SiteCardSkeleton />
                <SiteCardSkeleton />
                <SiteCardSkeleton />
                <SiteCardSkeleton />
                <SiteCardSkeleton />
              </div>
            ) : (
            nearbySites.map((card) => (
              <div key={card.id} className="relative flex-shrink-0 snap-center group cursor-pointer">
                {/* Background / shadow layer */}
                <div
                  className="absolute bg-cover bg-center min-h-[310px] max-h-[310px] min-w-[260px] max-w-[260px] rounded-[57px] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025] border-[0px] border-white"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <div className="rotate-[180deg] self-end">
                    <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
                  </div>
                </div>

                {/* Main card (clickable) */}
                <div
                  className="relative bg-cover bg-center min-h-[310px] max-h-[310px] min-w-[260px] max-w-[260px] rounded-[54px] flex flex-col justify-end overflow-hidden z-10 transition-transform duration-300"
                  style={{ backgroundImage: `url(${card.image_url})` }}
                >
                  <Link href={`/${card.slug}`} passHref>
                    <div className="absolute inset-0 bg-black/30 rounded-[50px]" />
                    <div className="relative z-30 text-center mb-[20px] px-[10px]">
                      <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                        <p className="font-bold text-[1.3rem] mb-[2px] leading-tight">{card.name}</p>
                        <p className="text-[0.9rem] px-[5px] line-clamp-2">{card.description}</p>
                        <div className='mt-[10px] flex justify-center items-center'>
                            <div className='cursor-pointer whitespace-nowrap rounded-full p-[2px] w-[190px] bg-white/10 shadow-[0px_0px_40px_rgba(0,0,0,0.3)] -mr-[2px]'>
                              <div className='bg-black/20 rounded-full px-[15px] py-[6.4px]'>
                                <p className='text-center font-bold text-[.85rem]'>{card.category}</p>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="rotate-[180deg] self-end">
                    <div className="bg-blue-500/0 absolute w-[270px] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] opacity-100 h-[150px]"></div>
                  </div>
                </div>
              </div>
            )))}
            
            {/* Empty State if no sites found */}
            {/* {nearbySites.length === 0 && (
               <div className="text-gray-400 italic p-5">Loading nearby locations...</div>
            )} */}

          </div>
        </div>
      </div>

      <Footer />

      {/* --- MODALS --- */}
      <Portal>
        {galleryOpen && <GalleryModal items={GALLERY_ITEMS} initialIndex={selectedIndex} onClose={() => setGalleryOpen(false)} />}
      </Portal>
      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setReviewOpen(false)} 
        onReviewSubmit={fetchReviews} 
        user={user} 
        siteId={SITE_ID} />
      <ReportModal 
        isOpen={reportState.isOpen} 
        reviewId={reportState.reviewId} 
        user={user} 
        tableName="review_reports"
        onClose={() => setReportState({ isOpen: false, reviewId: null })} />
      <AuthAlertModal 
        isOpen={isAuthOpen} 
        onClose={() => setAuthOpen(false)} />
    </div>
  );
};

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  return mounted ? ReactDOM.createPortal(children, document.body) : null;
};