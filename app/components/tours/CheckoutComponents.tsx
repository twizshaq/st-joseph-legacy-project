'use client'

import React from 'react';
import { format } from "date-fns";
import { CreditCard, Globe, Smartphone, Wallet, Info, CheckCircle2, Copy, Check } from 'lucide-react';

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

// --- PAYMENT OPTIONS COMPONENT (LEFT SIDE) ---
export function CheckoutPaymentFlow({ booking, onBackToTour }: { booking: any, onBackToTour: () => void }) {
    
    // Success View
    if (booking.isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center h-full bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">Your spot is secured. A receipt and ticket have been sent to <span className="font-bold text-gray-900">{booking.email}</span>.</p>
                <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-md border border-gray-100 mb-8 mx-auto">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Order ID</p>
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-xl font-mono font-bold text-gray-900 tracking-wide">{booking.bookingId}</span>
                        <button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => navigator.clipboard.writeText(booking.bookingId)}><Copy className="w-5 h-5" /></button>
                    </div>
                </div>
                <button onClick={() => { onBackToTour(); booking.setIsSuccess(false); }} className="px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Back to Tours
                </button>
            </div>
        );
    }

    // Payment View
    return (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">Complete Your Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="space-y-6">
                    <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3 border border-blue-100">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">Cash on Arrival is not available for this tour type. Please select a digital payment method below.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Select Payment Method</h3>
                        <div className="space-y-3">
                            <PaymentOption id="card" name="Credit / Debit Card" icon={CreditCard} selected={booking.selectedPaymentMethod === 'card'} onSelect={booking.setSelectedPaymentMethod} />
                            <PaymentOption id="paypal" name="PayPal" icon={Globe} selected={booking.selectedPaymentMethod === 'paypal'} onSelect={booking.setSelectedPaymentMethod} balance="$11.43" />
                            <PaymentOption id="apple_pay" name="Apple Pay" icon={Smartphone} selected={booking.selectedPaymentMethod === 'apple_pay'} onSelect={booking.setSelectedPaymentMethod} needsActivation />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4"><Wallet className="w-8 h-8 text-blue-500" /></div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Total to Pay</h4>
                    <p className="text-5xl font-extrabold text-blue-600 mb-4">{formatCurrency(booking.totals.total, booking.totals.currency)}</p>
                    <p className="text-xs text-gray-500 max-w-xs mb-8">Secure SSL encrypted payment. Your ticket will be emailed immediately after payment.</p>
                    
                    <button onClick={booking.handleBook} disabled={booking.isBooking} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-3">
                        {booking.isBooking ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Pay Securely'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper for Payment Options
const PaymentOption = ({ id, name, icon: Icon, selected, onSelect, balance, needsActivation }: any) => (
    <div onClick={() => !needsActivation && onSelect(id)} className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'} ${needsActivation ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}><Icon className="w-6 h-6" /></div>
            <div>
                <p className={`font-semibold text-base ${selected ? 'text-blue-900' : 'text-gray-900'}`}>{name}</p>
                {balance && <p className="text-sm text-gray-500">{balance}</p>}
            </div>
        </div>
        <div className="flex items-center gap-3">
            {needsActivation ? <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">Activate</span> : <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>{selected && <Check className="w-3.5 h-3.5 text-white" />}</div>}
        </div>
    </div>
);

// --- ORDER SUMMARY CARD (RIGHT SIDE) ---
export function OrderSummaryCard({ booking, tour }: { booking: any, tour: any }) {
    if (booking.isSuccess) return null; // Hide summary if payment is successful

    return (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-6 w-full mt-[45px]">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h4>
            
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
                <div><p className="text-xs text-gray-500 mb-1">Tour</p><p className="text-sm font-bold text-gray-900 font-sans">{tour.name}</p></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-gray-500 mb-1">Date</p><p className="text-sm font-bold text-gray-900 font-sans">{format(booking.selectedDate, 'MMM d, yyyy')}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Time</p><p className="text-sm font-bold text-gray-900 font-sans">{format(booking.selectedDate, 'p')}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    <div><p className="text-xs text-gray-500 mb-1">Attendees</p><p className="text-sm font-bold text-gray-900 font-sans">{booking.totalGuests} Guests</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Contact</p><p className="text-sm font-bold text-gray-900 font-sans truncate">{booking.email}</p></div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span>{formatCurrency(booking.totals.subtotal, booking.totals.currency)}</span></div>
                {booking.appliedDiscount && (
                    <div className="flex justify-between text-green-600 font-bold">
                        <span>Promo ({booking.appliedDiscount.code})</span>
                        <span>-{formatCurrency(booking.totals.discountAmount, booking.totals.currency)}</span>
                    </div>
                )}
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex flex-col items-end">
                <span className="text-sm font-bold text-gray-500 mb-1">Total Due</span>
                <span className="text-4xl font-extrabold text-blue-600">{formatCurrency(booking.totals.total, booking.totals.currency)}</span>
            </div>
        </div>
    );
}