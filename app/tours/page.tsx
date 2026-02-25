'use client'

import React, { useEffect, useState } from "react";
import Footer from "@/app/components/FooterModal";
import TourDetailsSkeleton from "@/app/components/tours/TourDetailsSkeleton";
import TourGallery from "@/app/components/tours/TourGallery";
import TourReviewsSection from "@/app/components/tours/TourReviewsSection";
import HeroSection from "@/app/components/tours/HeroSection";
import TourSelector from "@/app/components/tours/TourSelector";
import HouseRules from "@/app/components/tours/HouseRules";
import StopsModal from "@/app/components/tours/StopsModal";
import IntensityGuidelines from "@/app/components/tours/IntensityGuidelines";
import TourMap from "@/app/components/tours/TourMap";
import { format } from "date-fns";

import BookingFormInputs from "@/app/components/tours/BookingFormInputs";
import { CheckoutPaymentFlow, OrderSummaryCard } from "@/app/components/tours/CheckoutComponents";

import { useTourPage } from "@/app/hooks/useTourPage";
import { useBooking } from "@/app/hooks/useBooking";
import { Flame, ArrowLeft, AlertTriangle, Check } from "lucide-react";

export default function ToursPage() {
    // 1. Page Level Hook (Data Fetching)
    const {
        tours, selectedTour, setSelectedTour, userSession, isLoading,
        isSelectorOpen, setIsSelectorOpen, isStopsModalOpen, setIsStopsModalOpen
    } = useTourPage();

    // 2. Booking Controller Hook
    const booking = useBooking(selectedTour, userSession?.user);

    // 3. UI State for Checkout Flow
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    // Disable background scroll while the popup is open
    useEffect(() => {
        if (!showConfirmPopup) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [showConfirmPopup]);

    const [isCheckoutMode, setIsCheckoutMode] = useState(false);

    // Render Helpers
    const displayLocalPrice = selectedTour ? selectedTour.local_price : 0;

    const handleConfirmBooking = () => {
    setShowConfirmPopup(false);
    setIsCheckoutMode(true); 

    // Wait a millisecond for React to swap the UI, then dynamically scroll
    setTimeout(() => {
        const checkoutElement = document.getElementById('checkout-section');
        if (checkoutElement) {
            // Calculates exact element position and scrolls slightly above it (- 100px for breathing room)
            const targetPosition = checkoutElement.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }, 50);
};

    return (
        <div className="flex flex-col items-center overflow-x-hidden text-black relative">
            <HeroSection />
            <IntensityGuidelines />

            <TourSelector tours={tours} isOpen={isSelectorOpen} setIsOpen={setIsSelectorOpen} onSelect={setSelectedTour} />

            {/* --- CONFIRMATION POPUP WITH DETAILS --- */}
            {showConfirmPopup && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 transition-opacity p-4"
                    onClick={() => setShowConfirmPopup(false)}
                >
                    <div className='bg-white/10 backdrop-blur-[15px] rounded-[50px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0.3)]'>
                        <div className="bg-black/50 rounded-[47px] p-5 w-[500px] max-w-[90vw] animate-in zoom-in-90 duration-300"
                            onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Review Details</h3>
                        </div>
                        
                        <div className="mb-6 space-y-4 text-sm">
                            {/* Tour Name */}
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Tour</p>
                                <p className="font-bold text-white text-base">{selectedTour?.name}</p>
                            </div>
                            
                            {/* Date & Guests */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Date & Time</p>
                                    <p className="font-bold text-white">{format(booking.selectedDate, 'MMM d, yyyy')}</p>
                                    <p className="font-bold text-white">at {format(booking.selectedDate, 'p')}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Guests</p>
                                    <p className="font-bold text-white">{booking.totalGuests} People</p>
                                    <p className="text-slate-400 capitalize">{booking.userType} Rate</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Contact Details</p>
                                <p className="font-bold text-white">{booking.fullName}</p>
                                <p className="text-white">{booking.email}</p>
                                <p className="text-white">{booking.phone}</p>
                            </div>

                            {/* Total Price */}
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Due</p>
                                <p className="text-2xl font-extrabold text-blue-600">
                                    {new Intl.NumberFormat('en-US', { 
                                        style: 'currency', 
                                        currency: booking.totals.currency 
                                    }).format(booking.totals.total)}
                                </p>
                            </div>
                        </div>

                        <p className="text-white mb-6 font-medium text-center text-sm">Please ensure everything is correct before paying.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirmPopup(false)} className="flex-1 py-4 cursor-pointer rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold transition-colors active:scale-[.98]">
                                Edit
                            </button>
                            <button onClick={handleConfirmBooking} className={`w-[60%] cursor-pointer rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_15px_rgba(0,0,0,.1)] active:scale-[.98] transition-transform`}>
                                <div className='flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[15px]'>
                                    <p className='text-white font-bold'>Continue</p>
                                </div>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MAIN TOUR DETAILS & BOOKING AREA --- */}
            {isLoading || !selectedTour ? (
                <TourDetailsSkeleton />
            ) : (
                <div id="checkout-section" className="p-3 mt-8 w-[1500px] max-w-[95vw] flex flex-row max-lg:flex-col gap-10 lg:gap-20 rounded-[45px]">
                    
                    {/* LEFT SIDE: Info or Payment */}
                    <div className="flex-col w-full">
                        {!isCheckoutMode ? (
                            <>
                                {/* DEFAULT VIEW: Tour Details */}
                                <TourGallery images={selectedTour.images} />
                                <div className="w-full flex flex-col gap-4 mt-6">
                                    {/* <div className="mb-0">
                                        <p className="font-bold text-2xl lg:text-3xl">{selectedTour.name}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">{selectedTour.duration} Hours</p>
                                            <p className="px-4 py-1 text-[.9rem] font-medium bg-gray-200 rounded-full text-gray-800">${displayLocalPrice} USD</p>
                                        </div>
                                    </div> */}
                                    <div className="flex flex-col gap-6">
                                        <div className="rounded-[40px] p-2">
                                            <p className="text-xl font-bold mb-2">Description</p>
                                            <p className="text-gray-700">{selectedTour.description}</p>
                                        </div>
                                        {/* <div className="bg-[#f2f2f2] rounded-[40px] p-6 lg:p-8">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Flame className="w-6 h-6 text-black" />
                                                <h2 className="text-xl font-bold text-gray-900">Intensity Rating</h2>
                                            </div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-6 h-6 rounded-full rounded-tr-none bg-[#004c08] text-white flex items-center justify-center text-sm font-extrabold">1</div>
                                                <span className="font-bold text-[#004c08]">Easy - Moderate</span>
                                            </div>
                                        </div> */}
                                        <div>
                                            <TourMap tourId={selectedTour.id} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                {/* CHECKOUT VIEW: Payment Flow */}
                                {!booking.isSuccess && (
                                    <button onClick={() => setIsCheckoutMode(false)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 font-bold transition-colors w-fit cursor-pointer active:scale-[.97]">
                                        <ArrowLeft className="w-5 h-5" /> Back to Tour Details
                                    </button>
                                )}

                                

                                <CheckoutPaymentFlow booking={booking} onBackToTour={() => setIsCheckoutMode(false)} />
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Booking Inputs or Order Summary */}
                    {!(isCheckoutMode && booking.isSuccess) && (
                        <div className="w-full lg:w-[450px] shrink-0">
                        {!isCheckoutMode ? (
                            <div className="sticky top-10">
                                <BookingFormInputs 
                                    booking={booking} 
                                    onReviewClick={() => {
                                        if(!booking.fullName || !booking.email || !booking.phone) return alert("Please fill in your Contact Details.");
                                        if(booking.totalGuests === 0) return alert("Please select at least 1 ticket.");
                                        setShowConfirmPopup(true);
                                    }} 
                                />
                            </div>
                        ) : (
                            <div className="sticky top-10">
                                <OrderSummaryCard booking={booking} tour={selectedTour} />
                            </div>
                        )}
                        </div>
                    )}
                </div>
            )}

            {/* --- EXTRAS --- */}
            {selectedTour && (
                <StopsModal tour={selectedTour} isOpen={isStopsModalOpen} onClose={() => setIsStopsModalOpen(false)} />
            )}
            <HouseRules />
            <TourReviewsSection tour={selectedTour} user={userSession?.user} />
            <Footer />
        </div>
    );
}