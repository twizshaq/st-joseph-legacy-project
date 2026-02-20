import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tour } from '@/app/types/tours';

export const PRICING = {
    local: { child: 25, adult: 50, senior: 0, currency: 'BBD' },
    tourist: { child: 80, adult: 100, senior: 0, currency: 'USD' }
};

export const PROMO_CODES: Record<string, number> = {
    'WELCOME10': 0.10,
    'BARBADOS20': 0.20,
    'FAMILY': 0.15
};

export type TicketType = 'child' | 'adult' | 'senior';
export type UserType = 'local' | 'tourist';

// FIX #1: Accept Tour | null
export function useBooking(tour: Tour | null, user?: any) {
    const supabase = createClient();

    // --- Form State ---
    const [userType, setUserType] = useState<UserType>('local');
    const [tickets, setTickets] = useState({ child: 0, adult: 1, senior: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    
    // --- Promo & Payment State ---
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number } | null>(null);
    const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
    
    // --- Checkout Status ---
    const [bookingId] = useState(`ORD-${Math.floor(10000000 + Math.random() * 90000000)}`);
    const [isBooking, setIsBooking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // FIX #2: Added Success State

    // --- Math Calculations ---
    const totals = useMemo(() => {
        const prices = PRICING[userType];
        const subtotal = (tickets.child * prices.child) + (tickets.adult * prices.adult) + (tickets.senior * prices.senior);
        let discountAmount = 0;
        if (appliedDiscount) discountAmount = subtotal * appliedDiscount.value;
        
        return {
            subtotal,
            discountAmount,
            total: Math.max(0, subtotal - discountAmount),
            currency: prices.currency
        };
    }, [tickets, userType, appliedDiscount]);

    const totalGuests = tickets.child + tickets.adult + tickets.senior;

    // --- Handlers ---
    const updateTicket = (type: TicketType, increment: boolean) => {
        setTickets(prev => ({ ...prev, [type]: Math.max(0, prev[type] + (increment ? 1 : -1)) }));
    };

    const handleUserTypeChange = (type: UserType) => {
        setUserType(type);
        setAppliedDiscount(null);
        setPromoCodeInput("");
        setPromoMessage(null);
    };

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
    };

    const handleRemovePromo = () => {
        setAppliedDiscount(null);
        setPromoCodeInput("");
        setPromoMessage(null);
    };

    // --- Database Submission ---
    const handleBook = async () => {
        if (!tour) return;
        setIsBooking(true);
        try {
            const ticketDetails = `Type: ${userType.toUpperCase()} | Tickets: ${tickets.adult} Adult, ${tickets.child} Child, ${tickets.senior} Senior`;
            const promoDetails = appliedDiscount ? `\nPromo Applied: ${appliedDiscount.code} (-${(appliedDiscount.value * 100)}%)` : "";
            const finalNotes = `${ticketDetails}${promoDetails}\n\nUser Notes: ${notes}\nPayment Method: ${selectedPaymentMethod}`;

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
            setIsSuccess(true);
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setIsBooking(false);
        }
    };

    return {
        userType, tickets, selectedDate, fullName, phone, email, notes, bookingId,
        promoCodeInput, appliedDiscount, promoMessage, selectedPaymentMethod,
        isBooking, isSuccess, totals, totalGuests,
        setSelectedDate, setFullName, setPhone, setEmail, setNotes, setPromoCodeInput, setSelectedPaymentMethod, setIsSuccess,
        updateTicket, handleUserTypeChange, handleApplyPromo, handleRemovePromo, handleBook
    };
}

// THIS EXPORTS THE PERFECT TYPESCRIPT TYPE FOR THE OTHER COMPONENTS TO USE
export type BookingState = ReturnType<typeof useBooking>;