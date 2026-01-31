'use client'

import React, { useState, useMemo } from 'react'
import { format } from "date-fns"
import { createClient } from '@/lib/supabase/client'
import { Tour } from '@/app/types/tours'

// Icons and Components
import { Plus, Minus, Calendar as CalendarIcon, Check, X, Trash2 } from 'lucide-react'
import CustomCalendar from "@/app/components/tours/CustomCalendar"
import ArrowIcon from '@/public/icons/arrow-icon'

// --- Configuration ---

const PRICING = {
    local: {
        child: 25,
        adult: 50,
        senior: 0,
        currency: 'BBD'
    },
    tourist: {
        child: 80,
        adult: 100,
        senior: 0,
        currency: 'USD'
    }
}

const PROMO_CODES: Record<string, number> = {
    'WELCOME10': 0.10, // 10% off
    'BARBADOS20': 0.20, // 20% off
    'FAMILY': 0.15      // 15% off
}

type TicketType = 'child' | 'adult' | 'senior'

interface BookingFormProps {
    tour: Tour;
    user?: any;
}

export function BookingForm({ tour, user }: BookingFormProps) {
    const supabase = createClient();

    // --- State: User Selection ---
    const [userType, setUserType] = useState<'local' | 'tourist'>('local')
    const [tickets, setTickets] = useState({
        child: 0,
        adult: 1,
        senior: 0,
    })

    // --- State: Booking Details ---
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [notes, setNotes] = useState("")

    // --- State: Promo Code ---
    const [promoCodeInput, setPromoCodeInput] = useState("")
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number } | null>(null)
    const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    // --- State: Processing ---
    const [isBooking, setIsBooking] = useState(false)

    // --- Helpers ---
    const updateTicket = (type: TicketType, increment: boolean) => {
        setTickets((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + (increment ? 1 : -1)),
        }))
    }

    // --- Promo Code Logic ---

    const handleApplyPromo = () => {
        if (!promoCodeInput) return;
        const code = promoCodeInput.toUpperCase().trim();

        if (PROMO_CODES[code]) {
            setAppliedDiscount({ code, value: PROMO_CODES[code] });
            setPromoMessage({ text: `Code ${code} applied!`, type: 'success' });
        } else {
            setAppliedDiscount(null);
            setPromoMessage({ text: 'Invalid promo code', type: 'error' });
        }
    }

    const handleRemovePromo = () => {
        setAppliedDiscount(null);
        setPromoCodeInput("");
        setPromoMessage(null);
    }

    // Reset promo when switching user types (optional, prevents currency confusion)
    const handleUserTypeChange = (type: 'local' | 'tourist') => {
        setUserType(type);
        setAppliedDiscount(null);
        setPromoCodeInput("");
        setPromoMessage(null);
    }

    // --- Calculations ---
    const totals = useMemo(() => {
        const prices = PRICING[userType];

        const subtotal =
            (tickets.child * prices.child) +
            (tickets.adult * prices.adult) +
            (tickets.senior * prices.senior);

        const addonsCost = 0;

        const totalBeforeDiscount = subtotal + addonsCost;
        let discountAmount = 0;

        if (appliedDiscount) {
            discountAmount = totalBeforeDiscount * appliedDiscount.value;
        }

        return {
            subtotal,
            addonsCost,
            discountAmount,
            total: Math.max(0, totalBeforeDiscount - discountAmount),
            currency: prices.currency
        }
    }, [tickets, userType, appliedDiscount]);

    const totalGuests = tickets.child + tickets.adult + tickets.senior;

    // --- Supabase Submission ---
    const handleBook = async () => {
        if (!fullName || !email || !phone) return alert("Please fill in your name, email, and phone number.");
        if (totalGuests === 0) return alert("Please select at least one ticket.");

        setIsBooking(true);

        try {
            const ticketDetails = `Type: ${userType.toUpperCase()} | Tickets: ${tickets.adult} Adult, ${tickets.child} Child, ${tickets.senior} Senior`;

            let promoDetails = "";
            if (appliedDiscount) {
                promoDetails = `\nPromo Applied: ${appliedDiscount.code} (-${(appliedDiscount.value * 100)}%)`;
            }

            const finalNotes = `${ticketDetails}${promoDetails}\n\nUser Notes: ${notes}`;

            const { error } = await supabase.from('bookings').insert([{
                tour_id: tour.id,
                user_id: user?.id || null,
                full_name: fullName,
                email,
                phone,
                notes: finalNotes,
                booking_date: selectedDate.toISOString(),
                guest_count: totalGuests,
                total_local_price: userType === 'local' ? totals.total : 0,
                total_visitor_price: userType === 'tourist' ? totals.total : 0
            }]);

            if (error) throw error;

            alert("Booking successful!");
            // Reset form
            setFullName(""); setEmail(""); setPhone(""); setNotes("");
            handleRemovePromo(); // Clears promo states
            setTickets({ child: 0, adult: 1, senior: 0 });

        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:w-[700px] relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Your Tour</h2>

            <p className="text-gray-600 mb-2">I am a...</p>

            {/* User Type Toggle */}
            <div className="bg-gray-100 p-1 rounded-2xl flex mb-4">
                <button
                    onClick={() => handleUserTypeChange('local')}
                    className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-all ${userType === 'local' ? 'bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Local
                </button>
                <button
                    onClick={() => handleUserTypeChange('tourist')}
                    className={`flex-1 py-2 px-4 rounded-2xl text-sm font-medium transition-all ${userType === 'tourist' ? 'bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Tourist
                </button>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-600 mb-6">
                <p className="text-[13px]">🎉 locals enjoy discounted rates! Valid Barbados ID required.</p>
            </div>

            <h3 className="text-gray-600 mb-4">Select Tickets</h3>

            {/* Ticket Selectors */}
            <div className="space-y-3 mb-6">
                {/* Child */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                        <div className="font-bold text-gray-900">Child (5-17)</div>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-black">${PRICING[userType].child} {PRICING[userType].currency}</span>{' '}
                            {userType === 'local' && <span className="line-through">$80</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updateTicket('child', false)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white border border-gray-300 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                        <span className="w-4 text-center font-medium">{tickets.child}</span>
                        <button onClick={() => updateTicket('child', true)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-[linear-gradient(to_right,#007BFF,#66B2FF)] text-white hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Adult */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                        <div className="font-bold text-gray-900">Adult (18 - 64)</div>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-black">${PRICING[userType].adult} {PRICING[userType].currency}</span>{' '}
                            {userType === 'local' && <span className="line-through">$100</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updateTicket('adult', false)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white border border-gray-300 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                        <span className="w-4 text-center font-medium">{tickets.adult}</span>
                        <button onClick={() => updateTicket('adult', true)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-[linear-gradient(to_right,#007BFF,#66B2FF)] text-white hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Senior */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                        <div className="font-bold text-gray-900">Senior (65+)</div>
                        <div className="text-sm font-bold text-[#00a911]">FREE</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updateTicket('senior', false)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white border border-gray-300 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                        <span className="w-4 text-center font-medium">{tickets.senior}</span>
                        <button onClick={() => updateTicket('senior', true)} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-[linear-gradient(to_right,#007BFF,#66B2FF)] text-white hover:bg-gray-800"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Promo Code - Updated Logic */}
            <div className="mb-6">
                <label className="block text-gray-600 mb-2">Promo Code</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter code (e.g. WELCOME10)"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        disabled={!!appliedDiscount} // Disable input when code is applied
                        className={`flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5
                        ${appliedDiscount ? 'text-gray-500 cursor-not-allowed bg-gray-100' : ''}`}
                    />

                    {!appliedDiscount ? (
                        <button
                            onClick={handleApplyPromo}
                            className="bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white px-6 py-2 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            Apply
                        </button>
                    ) : (
                        <button
                            onClick={handleRemovePromo}
                            className="bg-red-500 text-white px-3 py-2 rounded-2xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                    )}
                </div>

                {promoMessage && (
                    <div className={`mt-2 text-sm flex items-center gap-1 ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {promoMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {promoMessage.text}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Tickets ({totalGuests})</span>
                    <span className="font-medium text-black">${totals.subtotal.toFixed(2)}</span>
                </div>

                {/* Discount Row (Only visible if discount applied) */}
                {appliedDiscount && (
                    <div className="flex justify-between text-green-600 animate-in fade-in slide-in-from-top-1">
                        <span className="flex items-center gap-2">
                            Discount <span className="text-xs bg-green-100 px-2 py-0.5 rounded-2xl">{appliedDiscount.code}</span>
                        </span>
                        <span className="font-medium">-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-200">
                    <span>Add-ons</span>
                    <span className="font-medium text-black">${totals.addonsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-1">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)} {totals.currency}</span>
                </div>
            </div>

            {/* Personal Details & Date Selection */}
            <div className="space-y-4 mb-6">
                <div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Date Picker */}
                <div className="relative">
                    <button
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <CalendarIcon className="w-5 h-5" />
                            {format(selectedDate, 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{format(selectedDate, 'p')}</span>
                            <ArrowIcon className={`transition-transform duration-200 ${isCalendarOpen ? '' : 'rotate-180'}`} color="#000" />
                        </div>
                    </button>

                    {isCalendarOpen && (
                        <div className="absolute top-full left-0 mt-2 z-20 shadow-xl rounded-2xl overflow-hidden">
                            <CustomCalendar
                                selectedDate={selectedDate}
                                onChange={(d) => { setSelectedDate(d); setIsCalendarOpen(false) }}
                                onClose={() => setIsCalendarOpen(false)}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <textarea
                        placeholder="Notes"
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                </div>
            </div>

            <div
                onClick={handleBook}
                className={`cursor-pointer rounded-2xl p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98] ${isBooking ? 'pointer-events-none opacity-50' : ''}`}
            >
                <div className='flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-2xl px-[20px] py-[10px]'>
                    <p className='text-white font-bold'>{isBooking ? "Processing..." : "Confirm & Book Tour"}</p>
                </div>
            </div>
        </div>
    )
}

export default BookingForm
