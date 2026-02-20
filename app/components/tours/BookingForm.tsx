'use client'

import React, { useState } from 'react'
import { format } from "date-fns"
import { Tour } from '@/app/types/tours'
import { CalendarPlus, Plus, Minus, Calendar as CalendarIcon, Check, X, Trash2 } from 'lucide-react'

// Sub-components
import CustomCalendar from "@/app/components/tours/CustomCalendar"
import ArrowIcon from '@/public/icons/arrow-icon'
import { BookingModal } from './BookingModal'

// Hooks & Constants
import { useBooking, PRICING } from '@/app/hooks/useBooking'

interface BookingFormProps {
    tour: Tour;
    user?: any;
}

export function BookingForm({ tour, user }: BookingFormProps) {
    // 1. Initialize Custom Hook
    const booking = useBooking(tour, user)

    // 2. Component Specific Local UI State
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    return (
        <>
            {/* --- MAIN FORM CARD --- */}
            <div className="bg-white rounded-[50px] border-[2px]/0 border-gray-200 shadow-[0px_0px_15px_rgba(0,0,0,.07)] p-4 md:p-6 lg:w-[700px] relative">
                <div className='flex gap-2 items-center bg-red-500/0 mb-4 ml-[7px] max-sm:mt-[5px]'>
                    <CalendarPlus />
                    <h2 className="text-2xl font-bold text-gray-900">Book Your Tour</h2>
                </div>

                <div className="bg-[#F2F2F2] p-[5px] rounded-[27px] flex mb-4">
                    <button onClick={() => booking.handleUserTypeChange('local')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${booking.userType === 'local' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Local</button>
                    <button onClick={() => booking.handleUserTypeChange('tourist')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${booking.userType === 'tourist' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Tourist</button>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-600 mb-6">
                    <p className="text-[13px]">🎉 locals enjoy discounted rates! Valid Barbados ID required.</p>
                </div>

                <h3 className="text-gray-600 font-medium mb-4">Select Tickets</h3>
                <div className="space-y-3 mb-6">
                    {/* Child */}
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Child (5-17)</div>
                            <div className="text-sm text-gray-500"><span className="font-medium text-black">${PRICING[booking.userType].child} {PRICING[booking.userType].currency}</span> {booking.userType === 'local' && <span className="line-through">$80</span>}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => booking.updateTicket('child', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-5 h-5" /></button>
                            <span className="w-4 text-center font-medium">{booking.tickets.child}</span>
                            <button onClick={() => booking.updateTicket('child', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-5 h-5" /></button>
                        </div>
                    </div>
                    {/* Adult */}
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Adult (18 - 64)</div>
                            <div className="text-sm text-gray-500"><span className="font-medium text-black">${PRICING[booking.userType].adult} {PRICING[booking.userType].currency}</span> {booking.userType === 'local' && <span className="line-through">$100</span>}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => booking.updateTicket('adult', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-4 h-4" /></button>
                            <span className="w-4 text-center font-medium">{booking.tickets.adult}</span>
                            <button onClick={() => booking.updateTicket('adult', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                    {/* Senior */}
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Senior (65+)</div>
                            <div className="text-sm font-bold text-[#00a911]">FREE</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => booking.updateTicket('senior', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-4 h-4" /></button>
                            <span className="w-4 text-center font-medium">{booking.tickets.senior}</span>
                            <button onClick={() => booking.updateTicket('senior', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium text-gray-600 mb-2">Promo Code</label>
                    <div className="flex relative justify-end items-center bg-[#F2F2F2] rounded-[32px] p-[7px] w-full">
                        <input type="text" placeholder="Enter code" value={booking.promoCodeInput} onChange={(e) => booking.setPromoCodeInput(e.target.value)} disabled={!!booking.appliedDiscount} className={`flex-1 font-medium bg-transparent rounded-[22px] px-4 pr-[130px] py-[11px] focus:outline-none ${booking.appliedDiscount ? 'text-gray-500' : ''}`} />
                        <div className='absolute right-[5px]'>
                            {!booking.appliedDiscount ? (
                                <button onClick={booking.handleApplyPromo} className="bg-[#007BFF] shadow-[0_0_7px_rgba(0,123,255,0.5)] text-center text-white w-[120px] h-[50px] py-[13px] rounded-full font-medium active:scale-[.95] active:bg-[#ccc] transition-colors">Apply</button>
                            ) : (
                                <button onClick={booking.handleRemovePromo} className="bg-red-500 text-white w-[120px] h-[50px] rounded-full font-medium hover:bg-red-600 transition-colors flex justify-center items-center gap-2 whitespace-nowrap"><Trash2 className="w-4 h-4" />Remove</button>
                            )}
                        </div>
                    </div>
                    {booking.promoMessage && <div className={`mt-2 text-sm flex items-center gap-1 ${booking.promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{booking.promoMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{booking.promoMessage.text}</div>}
                </div>

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
                        {isCalendarOpen && <div className="absolute top-full mx-auto mt-2 z-20"><CustomCalendar selectedDate={booking.selectedDate} onChange={(d) => { booking.setSelectedDate(d); setIsCalendarOpen(false) }} onClose={() => setIsCalendarOpen(false)} /></div>}
                    </div>
                    <textarea placeholder="Notes (Optional)" rows={4} value={booking.notes} onChange={(e) => booking.setNotes(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[23px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>

                <div onClick={booking.openSummary} className={`cursor-pointer rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98] transition-transform ${booking.isBooking ? 'pointer-events-none opacity-50' : ''}`}>
                    <div className='flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[15px]'>
                        <p className='text-white font-bold'>Review & Book</p>
                    </div>
                </div>
            </div>

            {/* --- MOUNTED POPUP MODAL --- */}
            <BookingModal
                isOpen={booking.isModalOpen}
                onClose={booking.closeModal}
                currentStep={booking.currentStep}
                onNext={booking.nextStep}
                onPrev={booking.prevStep}
                isBooking={booking.isBooking}
                tourName={tour?.name}
                bookingData={{
                    bookingId: booking.bookingId,
                    fullName: booking.fullName,
                    email: booking.email,
                    phone: booking.phone,
                    notes: booking.notes,
                    selectedDate: booking.selectedDate,
                    totalGuests: booking.totalGuests,
                    userType: booking.userType,
                }}
                pricing={{
                    tickets: booking.tickets,
                    totals: booking.totals,
                }}
                promo={{
                    input: booking.promoCodeInput,
                    message: booking.promoMessage,
                    applied: booking.appliedDiscount,
                    onChange: booking.setPromoCodeInput,
                    onApply: booking.handleApplyPromo,
                    onRemove: booking.handleRemovePromo,
                }}
                payment={{
                    selectedMethod: booking.selectedPaymentMethod,
                    onSelectMethod: booking.setSelectedPaymentMethod,
                }}
            />
        </>
    )
}

export default BookingForm