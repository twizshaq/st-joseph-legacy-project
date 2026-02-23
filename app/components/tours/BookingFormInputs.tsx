'use client'

import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarPlus, Plus, Minus, Calendar as CalendarIcon, Check, X, Trash2 } from 'lucide-react';
import CustomCalendar from "@/app/components/tours/CustomCalendar";
import ArrowIcon from '@/public/icons/arrow-icon';

// IMPORT THE TYPES ALONG WITH THE PRICING
import { BookingState, PRICING, TicketType } from '@/app/hooks/useBooking';

// REPLACE `any` WITH `BookingState` HERE
export default function BookingFormInputs({ 
    booking, 
    onReviewClick 
}: { 
    booking: BookingState; 
    onReviewClick: () => void 
}) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Explicitly define our array as TicketTypes for TypeScript
    const TICKET_TYPES: TicketType[] = ['child', 'adult', 'senior'];

    return (
        <div className="bg-white rounded-[50px] border-[2px]/0 border-gray-200 shadow-[0px_0px_15px_rgba(0,0,0,.07)] p-4 md:p-6 relative w-full h-fit">
            <div className='flex gap-2 items-center mb-4 ml-[7px] max-sm:mt-[5px]'>
                <CalendarPlus />
                <h2 className="text-2xl font-bold text-gray-900">Book Your Tour</h2>
            </div>

            {/* Local / Tourist Toggle */}
            <div className="bg-[#F2F2F2] p-[5px] rounded-[27px] flex mb-4">
                <button onClick={() => booking.handleUserTypeChange('local')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${booking.userType === 'local' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Local</button>
                <button onClick={() => booking.handleUserTypeChange('tourist')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${booking.userType === 'tourist' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Tourist</button>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600 mb-6">
                <p className="text-[13px]">🎉 locals enjoy discounted rates! Valid Barbados ID required.</p>
            </div>

            {/* Tickets */}
            <h3 className="text-gray-600 font-medium mb-4">Select Tickets</h3>
            <div className="space-y-3 mb-6">
                {TICKET_TYPES.map((type) => {
                    // Extract values cleanly to avoid TS errors in the JSX
                    const price = PRICING[booking.userType][type];
                    const currency = PRICING[booking.userType].currency;

                    return (
                        <div key={type} className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                            <div>
                                <div className="font-bold text-gray-900 capitalize">
                                    {type} {type === 'child' ? '(5-17)' : type === 'adult' ? '(18-64)' : '(65+)'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {type === 'senior' ? (
                                        <span className="font-bold text-[#00a911]">FREE</span>
                                    ) : (
                                        <>
                                            <span className="font-medium text-black">${price} {currency}</span> 
                                            {booking.userType === 'local' && (
                                                <span className="line-through pl-1">
                                                    ${type === 'child' ? '80' : '100'}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => booking.updateTicket(type, false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95]"><Minus className="w-4 h-4" /></button>
                                <span className="w-4 text-center font-medium">{booking.tickets[type]}</span>
                                <button onClick={() => booking.updateTicket(type, true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95]"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Promo Code */}
            <div className="mb-6">
                <label className="block font-medium text-gray-600 mb-2">Promo Code</label>
                <div className="flex relative justify-end items-center bg-[#F2F2F2] rounded-[32px] p-[7px] w-full">
                    <input type="text" placeholder="Enter code" value={booking.promoCodeInput} onChange={(e) => booking.setPromoCodeInput(e.target.value)} disabled={!!booking.appliedDiscount} className={`flex-1 font-medium bg-transparent rounded-[22px] px-4 pr-[130px] py-[11px] focus:outline-none ${booking.appliedDiscount ? 'text-gray-500' : ''}`} />
                    <div className='absolute right-[5px]'>
                        {!booking.appliedDiscount ? (
                            <button onClick={booking.handleApplyPromo} className="bg-[#007BFF] shadow-[0_0_7px_rgba(0,123,255,0.5)] text-white w-[120px] h-[50px] rounded-full font-medium active:scale-[.95]">Apply</button>
                        ) : (
                            <button onClick={booking.handleRemovePromo} className="bg-red-500 text-white w-[120px] h-[50px] rounded-full font-medium hover:bg-red-600 flex justify-center items-center gap-2"><Trash2 className="w-4 h-4" />Remove</button>
                        )}
                    </div>
                </div>
                {booking.promoMessage && <div className={`mt-2 text-sm flex items-center gap-1 ${booking.promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{booking.promoMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{booking.promoMessage.text}</div>}
            </div>

            {/* Contact Details */}
            <div className="space-y-4 mb-6">
                <input type="text" placeholder="Full Name" value={booking.fullName} onChange={(e) => booking.setFullName(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Phone Number" value={booking.phone} onChange={(e) => booking.setPhone(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="email" placeholder="Email" value={booking.email} onChange={(e) => booking.setEmail(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="relative">
                    <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="w-full flex items-center justify-between bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2 font-bold text-gray-900"><CalendarIcon className="w-5 h-5" />{format(booking.selectedDate, 'MMMM d, yyyy')}</div>
                        <div className="flex items-center gap-2"><span className="font-bold text-gray-900">{format(booking.selectedDate, 'p')}</span><ArrowIcon className={`transition-transform duration-200 ${isCalendarOpen ? '' : 'rotate-180'}`} color="#000" /></div>
                    </button>
                    {isCalendarOpen && <div className="absolute top-full right-0 mt-2 z-20"><CustomCalendar selectedDate={booking.selectedDate} onChange={(d) => { booking.setSelectedDate(d); setIsCalendarOpen(false) }} onClose={() => setIsCalendarOpen(false)} /></div>}
                </div>
                <textarea placeholder="Notes (Optional)" rows={3} value={booking.notes} onChange={(e) => booking.setNotes(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[23px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>

            {/* Action Button */}
            <button onClick={onReviewClick} className={`w-full cursor-pointer rounded-full p-[2.7px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98] transition-transform`}>
                <div className='flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[15px]'>
                    <p className='text-white font-bold text-lg'>Review & Book</p>
                </div>
            </button>
        </div>
    );
}