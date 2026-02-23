'use client'

import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { CreditCard, Globe, Smartphone, Wallet, Info, CheckCircle2, Copy, Check, Lock, ShieldCheck, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import ReceiptIcon from '@/public/icons/receipt-icon'
import SuccessCheckIcon from '@/public/icons/successcheck-icon';
import TicketQR from '@/app/components/tours/TicketQR';

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

// --- PAYMENT OPTIONS COMPONENT (LEFT SIDE) ---
export function CheckoutPaymentFlow({ booking, tour, onBackToTour }: { booking: any, tour?: any, onBackToTour: () => void }) {

    const [copied, setCopied] = useState(false);

    const handleCopyBookingId = async () => {
        try {
            await navigator.clipboard.writeText(booking.bookingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy booking ID:', err);
        }
    };

    // --- 2. ADD THIS ENTIRE useEffect BLOCK ---
    useEffect(() => {
        // Only run this if the payment is actually successful
        if (booking.isSuccess) {
            const duration = 5 * 1000; // 7 seconds
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            }

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                // If 7 seconds have passed, clear the interval to stop it
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                
                // Fire from the left side
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                
                // Fire from the right side
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            // Cleanup function in case the user closes the window early
            return () => clearInterval(interval);
        }
    }, [booking.isSuccess]);
    // ------------------------------------------
    
    // ============================================
    // NEW CONDENSED SUCCESS VIEW WITH TICKET
    // ============================================
    if (booking.isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
                
                {/* Checkmark icon to match image partial */}
                <div className="flex items-center justify-center mb-6 text-[#22C55E]">
                    <SuccessCheckIcon className="w-24 h-24 stroke-[1.5]" />
                </div>
                
                {/* Title and Subtitle matching the mockup */}
                <h2 className="text-[1.7rem] md:text-[2rem] font-bold text-black mb-4">
                    Booking Confirmed!
                </h2>
                <p className="text-gray-500 text-[1rem] font-medium text-center mb-8 leading-[1.4]">
                    Your tour has been successfully booked<br className="hidden sm:block" /> 
                    Please check your email!
                </p>

                {/* Booking Reference Pill matching the mockup */}
                <div 
                    className="bg-[#F2F2F2] rounded-full px-6 py-4 flex items-center justify-between gap-4 mb-10 transition-colors group w-full max-w-md"
                >
                    <div className="flex items-center gap-3 truncate">
                        <span className="text-[#6B7280] text-[1rem] whitespace-nowrap">Booking Reference:</span>
                        <span className="text-black font-extrabold text-[1rem] tracking-wide truncate">
                            {booking.bookingId}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyBookingId}
                        className="flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all rounded-full cursor-pointer shrink-0"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-600" />
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 text-gray-600" />
                            </>
                        )}
                    </button>
                </div>

                {/* --- DIGITAL TICKET --- */}
                {/* Stacks vertically on Mobile, Horizontally side-by-side on desktop */}
                <div className="w-full relative flex flex-col sm:flex-row bg-[#FAFAFA] rounded-[30px] border-[2px] border-gray-200 mb-8 text-left text-gray-900 shadow-sm transition-all group overflow-hidden">
                    
                    {/* Visual Cutouts (To make it look like a physical ticket) */}
                    {/* Desktop cutouts */}
                    <div className="hidden sm:block absolute top-1/2 -left-[14px] -translate-y-1/2 w-6 h-6 bg-white border-r-[2px] border-t-[2px] border-b-[2px] border-gray-200 rounded-full z-10" />
                    <div className="hidden sm:block absolute top-1/2 -right-[14px] -translate-y-1/2 w-6 h-6 bg-white border-l-[2px] border-t-[2px] border-b-[2px] border-gray-200 rounded-full z-10" />
                    {/* Mobile Cutouts */}
                    <div className="sm:hidden absolute -top-[14px] right-[40%] -translate-x-1/2 w-6 h-6 bg-white border-b-[2px] border-r-[2px] border-l-[2px] border-gray-200 rounded-full z-10" />
                    <div className="sm:hidden absolute -bottom-[14px] right-[40%] -translate-x-1/2 w-6 h-6 bg-white border-t-[2px] border-r-[2px] border-l-[2px] border-gray-200 rounded-full z-10" />

                    {/* Left/Top Area: Booking Specifics */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center border-b-[2px] sm:border-b-0 sm:border-r-[2px] border-dashed border-gray-300 bg-white z-0 relative">
                        <div className="flex items-center gap-1.5 mb-2 opacity-60">
                            <Ticket className="w-4 h-4 text-gray-400" />
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Entry Ticket</p>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-6 pr-4 truncate max-w-full">
                            {tour?.name || 'Your Reserved Experience'}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-0.5">Date</p>
                                <p className="text-sm font-bold text-gray-900">{format(booking.selectedDate, 'MMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-0.5">Time</p>
                                <p className="text-sm font-bold text-gray-900">{format(booking.selectedDate, 'p')}</p>
                            </div>
                            <div className="col-span-1 pr-1">
                                <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-0.5">Name</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{booking.fullName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-0.5">Tickets</p>
                                <p className="text-sm font-bold text-gray-900">{booking.totalGuests} Passes</p>
                            </div>
                        </div>
                    </div>

                    {/* Right/Bottom Area: Validation / QR */}
                    <div className="sm:w-[220px] flex flex-col items-center justify-center p-6 bg-[#FAFAFA] z-0">
                        <div className="">
                            <TicketQR 
                                data={booking.bookingId} 
                                className="w-full h-full drop-shadow-sm" 
                            />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-1 text-center">Scan at Gate</p>
                        <button 
                            title="Click to copy Transaction ID"
                            onClick={() => navigator.clipboard.writeText(booking.bookingId)}
                            className="flex items-center justify-center gap-1.5 px-3 py-1 bg-gray-200/60 hover:bg-gray-200 text-gray-500 rounded-lg active:scale-95 transition-all w-fit cursor-pointer"
                        >
                            <Copy className="w-3 h-3"/>
                            <p className="text-[11px] font-mono font-bold text-gray-500 uppercase truncate max-w-[100px]">{booking.bookingId}</p>
                        </button>
                    </div>

                </div>

                {/* Big Button Reverting Home */}
                <button onClick={() => { onBackToTour(); booking.setIsSuccess(false); }} className="w-full sm:w-[60%] py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-transform active:scale-95 shadow-[0px_8px_25px_rgba(0,0,0,0.15)] mt-1">
                    Return to Page
                </button>
                
            </div>
        );
    }

    // Payment View
    return (
        <div className="bg-white rounded-[40px]">
            <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Payment</h2>
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 sm:px-4 py-2 rounded-full border border-green-100 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Secure</span>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 font-medium">Select a payment method below to complete your booking.</p>
            </div>
            
            <div className="w-full">
                {/* --- TAB OPTIONS (Row Aligned) --- */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
                    <PaymentTab 
                        id="card" name="Card" icon={CreditCard} 
                        selected={booking.selectedPaymentMethod === 'card'} onSelect={booking.setSelectedPaymentMethod} 
                    />
                    <PaymentTab 
                        id="paypal" name="PayPal" icon={Globe} 
                        selected={booking.selectedPaymentMethod === 'paypal'} onSelect={booking.setSelectedPaymentMethod} 
                    />
                    <PaymentTab 
                        id="bimpay" name="BIMpay" icon={Smartphone} 
                        selected={booking.selectedPaymentMethod === 'bimpay'} onSelect={booking.setSelectedPaymentMethod} 
                    />
                </div>

                {/* --- DYNAMIC FORM INPUTS AREA --- */}
                <div className="w-full mb-8 min-h-[250px] flex flex-col justify-center transition-all duration-300">
                    
                    {/* CREDIT CARD FIELDS */}
                    {booking.selectedPaymentMethod === 'card' && (
                        <div key="card-form" className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                            <input type="text" placeholder="Cardholder Name" className="w-full bg-[#F2F2F2] font-[500] text-gray-900 rounded-[23px] px-5 py-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                            <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full bg-[#F2F2F2] font-[500] text-gray-900 rounded-[21px] px-5 py-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full sm:w-1/2 bg-[#F2F2F2] font-[500] text-gray-900 rounded-[23px] px-5 py-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                                <input type="text" placeholder="CVC" className="w-full sm:w-1/2 bg-[#F2F2F2] font-[500] text-gray-900 rounded-[23px] px-5 py-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* PAYPAL FIELD */}
                    {booking.selectedPaymentMethod === 'paypal' && (
                        <div key="paypal-form" className="flex flex-col items-center justify-center gap-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300 w-full py-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                <Globe className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="font-extrabold text-xl text-gray-900">Redirecting to PayPal</h3>
                            <p className="text-gray-500 font-medium max-w-sm px-4">
                                After clicking pay below, you will be redirected to PayPal to complete your purchase securely.
                            </p>
                        </div>
                    )}

                    {/* BIMPAY FIELD */}
                    {booking.selectedPaymentMethod === 'bimpay' && (
                        <div key="bimpay-form" className="flex flex-col items-center justify-center gap-2 text-center animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                            <div className="">
                                <TicketQR data={''} />
                            </div>
                            <h3 className="font-extrabold text-xl text-gray-900">Scan & Pay</h3>
                            <p className="text-gray-500 font-medium max-w-sm px-4 text-sm leading-relaxed">
                                Open the <strong className="text-gray-900">BIMpay</strong> app on your device and scan this QR code to automatically fill the transaction details.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// --- TAB OPTION COMPONENT ---
// Renders the clickable square options at the top
const PaymentTab = ({ id, name, icon: Icon, selected, onSelect }: any) => (
    <button 
        onClick={(e) => { e.preventDefault(); onSelect(id); }} 
        className={`relative w-full flex flex-col items-center justify-center p-3 sm:p-5 rounded-[30px] border-[2px] transition-all duration-200 focus:outline-none ${
            selected 
            ? 'border-blue-600 bg-white shadow-[0px_8px_20px_rgba(0,123,255,0.12)] scale-[1.02] z-10' 
            : 'border-gray-200 bg-[#f9fafb] hover:bg-white hover:border-gray-300'
        }`}
    >

        <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 rounded-[16px] flex items-center justify-center transition-colors ${
            selected ? 'bg-blue-600 text-white' : 'bg-gray-200/80 text-gray-500'
        }`}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        
        <span className={`text-[12px] sm:text-[14px] font-bold text-center w-full whitespace-nowrap overflow-hidden text-ellipsis ${
            selected ? 'text-gray-900' : 'text-gray-500'
        }`}>
            {name}
        </span>
    </button>
);


// --- BOOKING SUMMARY CARD (RIGHT SIDE) ---
export function OrderSummaryCard({ booking, tour }: { booking: any, tour: any }) {
    if (booking.isSuccess) return null; // Hide summary if payment is successful

    return (
        <div className="bg-white rounded-[50px] shadow-[0px_0px_15px_rgba(0,0,0,.08)] border border-gray-100/50 p-4 md:p-6 w-full lg:mt-[60px]">
            <div className='flex gap-2 items-center mb-4 ml-[7px] max-sm:mt-[5px] '>
                <ReceiptIcon size={24} color="#334155" />
                <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-2">Booking Summary</h4>
            </div>
            
            <div className="mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5">Tour Details</p>
                    <p className="text-base font-bold text-gray-900 leading-snug">{tour.name}</p>
                </div>
                
                <div className="h-[1px] w-full bg-gray-200" />
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                        <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Date</p>
                        <p className="text-sm font-bold text-gray-900">{format(booking.selectedDate, 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Time</p>
                        <p className="text-sm font-bold text-gray-900">{format(booking.selectedDate, 'p')}</p>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Guests</p>
                        <p className="text-sm font-bold text-gray-900">{booking.totalGuests} <span className="font-semibold text-gray-500 capitalize ml-1">({booking.userType})</span></p>
                    </div>
                </div>
                
                <div className="h-[1px] w-full bg-gray-200" />
                
                <div className="w-full">
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Booking Under</p>
                    <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{booking.fullName || "—"}</p>
                    <p className="text-sm font-semibold text-gray-500 truncate">{booking.email || "—"}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6 px-1 text-[15px]">
                <div className="flex justify-between text-gray-600 font-bold">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(booking.totals.subtotal, booking.totals.currency)}</span>
                </div>
                {booking.appliedDiscount && (
                    <div className="flex justify-between text-blue-600 font-bold bg-blue-50 -mx-3 px-3 py-2 rounded-xl">
                        <span className="flex items-center gap-1.5">Discount <span className="text-xs uppercase bg-white text-blue-800 px-2 py-0.5 rounded-md border border-blue-100 ml-1">{booking.appliedDiscount.code}</span></span>
                        <span>-{formatCurrency(booking.totals.discountAmount, booking.totals.currency)}</span>
                    </div>
                )}
            </div>
            
            <div className="border-t-[2px] border-dashed border-gray-200 pt-6 mt-6 px-1 flex flex-col">
                <div className="flex items-end justify-between w-full">
                    <span className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-1">Total Due</span>
                    <div className="text-right">
                        <span className="text-sm font-extrabold text-blue-600 mr-1">{booking.totals.currency}</span>
                        <span className="text-4xl font-extrabold text-blue-600 tracking-tight">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(booking.totals.total)}</span>
                    </div>
                </div>
            </div>

            {/* --- BIG CHECKOUT BUTTON --- */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400 font-bold mb-4 uppercase tracking-wider flex items-center justify-center gap-1"><Lock className="w-3 h-3"/> Payments are secure and encrypted</p>
                <button 
                    onClick={() => booking.setIsSuccess(true)}
                    disabled={booking.isBooking} 
                    className="group w-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] text-white p-[2.7px] rounded-full font-bold shadow-[0px_0px_20px_rgba(0,123,255,0.3)] active:scale-[.999] hover:scale-[1.01] cursor-pointer transition-all disabled:opacity-70 disabled:active:scale-100"
                >
                    <div className="flex items-center justify-center px-6 sm:px-8 py-[15px] w-full bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full h-full relative overflow-hidden">
                        {/* Shiny hover effect line */}
                        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.07),transparent)] group-hover:left-[200%] transition-all duration-1000 ease-in-out skew-x-[-20deg]" />
                        
                        {booking.isBooking ? (
                            <div className="flex justify-center w-full">
                                <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* <span className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                                    <span className="text-lg font-bold">{booking.totals.currency}</span> 
                                    {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(booking.totals.total)}
                                </span> */}
                                <span className="text-base sm:text-lg flex items-center gap-2">
                                    {booking.selectedPaymentMethod === 'paypal' ? 'Via PayPal' : 'Pay Now'}
                                </span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}