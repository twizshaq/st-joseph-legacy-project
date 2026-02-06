// src/app/all-sites/page.tsx (or wherever your main component lives)

"use client";
import React, { Suspense, useEffect } from 'react';
import Footer from "@/app/components/FooterModal";
import { SiteCardSkeleton } from '@/app/components/SiteCardSkeleton';

// Hooks
import { useSitesData } from '@/app/hooks/useAllSitesData';
import { useSiteFiltering } from '@/app/hooks/useSiteFiltering';

// Components
import { HeroHeader } from '@/app/components/allsites/HeroHeader';
import { SearchFilterBar } from '@/app/components/allsites/SearchFilterBar';
import { SiteCardItem } from '@/app/components/allsites/SiteCardItem';
import { Pagination } from '@/app/components/Pagination';

const AllSitesContent = () => {
  // 1. Data
  const { siteCards, loading } = useSitesData();

  // 2. Logic (Filter, Sort, Pagination)
  const {
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
    selectedCategory, setSelectedCategory,
    uniqueCategories,
    currentSites,
    currentPage,
    pageCount,
    goToPage,
    resetPage,
    filteredSitesCount
  } = useSiteFiltering(siteCards);

  // 3. Scroll Restoration Cleanup
  useEffect(() => {
    if ('scrollRestoration' in history) {
      const prev = history.scrollRestoration as 'auto' | 'manual';
      history.scrollRestoration = 'manual';
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  return (
    <div className='flex flex-col justify-center items-center text-black min-h-screen'>
      
      {/* Header with Search Bar composed relative to it */}
      <div className="relative w-full">
        <HeroHeader />
        <SearchFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resetPage={resetPage}
          sortOption={sortOption}
          setSortOption={setSortOption}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={uniqueCategories}
        />
      </div>

      {/* <div className='bg-[#ddd]/80 h-[2px] w-[450px] max-w-[70vw] mt-[55px] rounded-full'></div> */}

      <div className="w-full mt-[40px] max-w-[1400px] mx-auto px-4 pb-20">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-[50px] lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-16 justify-items-center mb-12">
          {loading ? (
             Array.from({ length: 8 }).map((_, i) => <SiteCardSkeleton key={i} />)
          ) : filteredSitesCount > 0 ? (
             currentSites.map((card) => <SiteCardItem key={card.id} card={card} />)
          ) : null}
        </div>

        {/* Empty State */}
        {!loading && filteredSitesCount === 0 && (
          <p className="font-bold text-center mt-10">No <br /> sites found.</p>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination 
            currentPage={currentPage} 
            pageCount={pageCount} 
            onPageChange={goToPage} 
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

const AllSites = () => {
  return (
    <Suspense fallback={
       <div className="w-full mt-[60px] max-w-[1400px] mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8 sm:gap-y-16 justify-items-center mb-12">
             {Array.from({ length: 8 }).map((_, i) => <SiteCardSkeleton key={i} />)}
          </div>
       </div>
    }>
      <AllSitesContent />
    </Suspense>
  );
};

export default AllSites;