'use client'

import React from "react";
import Footer from "@/app/components/FooterModal";
import TourDetailsSkeleton from "@/app/components/tours/TourDetailsSkeleton";
import TourGallery from "@/app/components/tours/TourGallery";
import BookingForm from "@/app/components/tours/BookingForm";
import TourReviewsSection from "@/app/components/tours/TourReviewsSection";
import HeroSection from "@/app/components/tours/HeroSection";
import TourSelector from "@/app/components/tours/TourSelector";
import HouseRules from "@/app/components/tours/HouseRules";
import StopsModal from "@/app/components/tours/StopsModal";
import { StopItem } from "@/app/components/tours/StopItem";

// Import the logic hook
import { useTourPage } from "@/app/hooks/useTourPage";

export default function ToursPage() {
  const {
    tours,
    selectedTour,
    setSelectedTour,
    userSession,
    isLoading,
    guestCount,
    setGuestCount,
    isSelectorOpen,
    setIsSelectorOpen,
    isStopsModalOpen,
    setIsStopsModalOpen
  } = useTourPage();

  // Logic: Preview limit
  const PREVIEW_LIMIT = 3;
  const previewStops = selectedTour?.stops ? selectedTour.stops.slice(0, PREVIEW_LIMIT) : [];
  const hasMoreStops = selectedTour?.stops && selectedTour.stops.length > PREVIEW_LIMIT;
  const displayPrice = selectedTour ? (selectedTour.price * guestCount) : 0;

  return (
    <div className="flex flex-col items-center overflow-x-hidden text-black">
      
      <HeroSection />

      {/* --- TOUR SELECTOR POPUP --- */}
      <TourSelector 
        tours={tours}
        isOpen={isSelectorOpen}
        setIsOpen={setIsSelectorOpen}
        onSelect={setSelectedTour}
      />

      {/* --- MAIN TOUR DETAILS AREA --- */}
      {isLoading || !selectedTour ? (
        <TourDetailsSkeleton />
      ) : (
        <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px]">
          
          <TourGallery images={selectedTour.images} />

          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            
            {/* Header Info */}
            <div>
              <p className="text-gray-500">Tour</p>
              <p className="font-bold text-2xl lg:text-3xl">{selectedTour.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                  {selectedTour.duration} Hours
                </p>
                <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                  ${displayPrice.toLocaleString()} USD
                </p>
              </div>
              <div className="bg-gray-200/90 w-full mt-4 mb-0 h-px"/>
            </div>

            {/* Description & Stops Preview */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xl font-bold">Description</p>
                <p className="text-gray-700 mt-1">{selectedTour.description}</p>
              </div>
              
              <div>
                <p className="text-xl font-bold mb-4">Trip Info</p>
                <div className="flex flex-col">
                  {previewStops.map((stop, index) => (
                    <StopItem 
                      key={stop.id} 
                      stop={stop} 
                      index={index} 
                      totalStops={previewStops.length} // Visual fix for line connection in preview
                      isPreview={true} 
                    />
                  ))}

                  {hasMoreStops && (
                    <button 
                      onClick={() => setIsStopsModalOpen(true)}
                      className="font-[500] text-[1rem] self-center mt-[5px] max-sm:my-[15px] px-[17px] py-[7px] cursor-pointer bg-black/5 rounded-full hover:bg-[#E0E0E0] transition-colors"
                    >
                      View All Stops
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <BookingForm 
            tour={selectedTour} 
            user={userSession?.user} 
            guestCount={guestCount} 
            onGuestChange={setGuestCount}
          />
        </div>
      )}

      {/* --- ALL STOPS MODAL --- */}
      {selectedTour && (
        <StopsModal 
          tour={selectedTour} 
          isOpen={isStopsModalOpen} 
          onClose={() => setIsStopsModalOpen(false)} 
        />
      )}

      <HouseRules />

      <TourReviewsSection 
        tour={selectedTour} 
        user={userSession?.user} 
      />

      <Footer />
    </div>
  );
}