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
import IntensityGuidelines from "@/app/components/tours/IntensityGuidelines";
import TourMap from "@/app/components/tours/TourMap";

// Import the logic hook
import { useTourPage } from "@/app/hooks/useTourPage";
import { Flame } from "lucide-react";

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
    const displayLocalPrice = selectedTour ? (selectedTour.local_price * guestCount) : 0;
    const displayVisitorPrice = selectedTour ? (selectedTour.visitor_price * guestCount) : 0;

    return (
        <div className="flex flex-col items-center overflow-x-hidden text-black">

            <HeroSection />
            <IntensityGuidelines />


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
                <div className="p-3 mt-8 w-[1200px] justify-betwe/en max-w-[95vw] flex flex-row max-sm:flex-col gap-6  rounded-[45px]">
                    <div className="flex-col w-full">
                        <TourGallery images={selectedTour.images} />

                        <div className="w-full flex flex-col gap-4">

                            {/* Header Info */}
                            <div>
                                <p className="text-gray-500">Tour</p>
                                <p className="font-bold text-2xl lg:text-3xl">{selectedTour.name}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                                        {selectedTour.duration} Hours
                                    </p>
                                    <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">
                                        ${displayLocalPrice.toLocaleString()} USD
                                    </p>
                                </div>
                                <div className="bg-gray-200/90 w-full mt-4 mb-0 h-px" />
                            </div>

                            {/* Description & Stops Preview */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-6 m/b-6">
                                    <p className="text-xl font-bold">Description</p>
                                    <span className="">Explore the Andromeda Botanic Gardens and the historic Atlantis Hotel at Tent Bay. Trace the path of the old Barbados Railway and witness the power of the Atlantic at Bathsheba. See firsthand how coastal erosion is managed through engineering and nature-based solutions.</span>
                                    <p className="text-gray-700 mt-1">{selectedTour.description}</p>
                                </div>

                                <div>
                                    <div className="bg-[#f9fafb] border border-gray-100 rounded-xl p-6 m/b-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Flame className="w-6 h-6 text-black" />
                                            <h2 className="text-xl font-bold text-gray-900">Intensity Rating</h2>
                                        </div>

                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full rounded-tr-none bg-[#004c08] text-white flex items-center justify-center text-sm font-extrabold">
                                                1
                                            </div>
                                            <span className="font-bold text-[#004c08]">Easy - Moderate</span>
                                        </div>

                                        <div className="flex gap-2 mt-2 ml-9">
                                            <div className="w-3 h-3 rounded-full bg-[#004c08]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#004c08]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#9ca3af]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#9ca3af]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#9ca3af]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {/* <p className="text-xl font-bold mb-4">Trip Route</p> */}
                                    <TourMap stops={selectedTour.stops} />
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
