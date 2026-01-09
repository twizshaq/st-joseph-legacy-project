// src/hooks/useSiteFiltering.ts
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteCard, SortOption } from '@/app/types';

const SITES_PER_PAGE = 12;

export const useSiteFiltering = (siteCards: SiteCard[]) => {
  const searchParams = useSearchParams();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync page with URL
  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    if (Number.isFinite(p) && p >= 1) setCurrentPage(p);
  }, [searchParams]);

  // Derived Data: Categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(siteCards.map(s => s.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [siteCards]);

  // Derived Data: Filtered & Sorted
  const filteredSites = useMemo(() => {
    let result = siteCards;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((card) => 
        card.name.toLowerCase().includes(lowerQuery) ||
        card.category?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((card) => card.category === selectedCategory);
    }

    return [...result].sort((a, b) => {
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      if (sortOption === 'popularity') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      return a.id - b.id;
    });
  }, [siteCards, searchQuery, selectedCategory, sortOption]);

  // Pagination Logic
  const indexOfLastSite = currentPage * SITES_PER_PAGE;
  const indexOfFirstSite = indexOfLastSite - SITES_PER_PAGE;
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
  const pageCount = Math.ceil(filteredSites.length / SITES_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), pageCount);
    if (clamped !== currentPage) {
       window.location.assign(`/all-sites?page=${clamped}`);
    }
  };

  return {
    searchQuery, setSearchQuery,
    sortOption, setSortOption,
    selectedCategory, setSelectedCategory,
    currentPage, goToPage,
    currentSites,
    filteredSitesCount: filteredSites.length,
    pageCount,
    uniqueCategories,
    resetPage
  };
};