'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { format } from "date-fns"
import { createClient } from '@/lib/supabase/client'
import { Tour } from '@/app/types/tours'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Minus,
    Calendar as CalendarIcon,
    Check,
    X,
    Trash2,
    CalendarPlus,
    FileText,
    Mail,
    Phone,
    User,
    MapPin,
    Ticket,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Copy,
    Smartphone,
    Globe,
    Building2,
    Info,
    Wallet
} from 'lucide-react'
import CustomCalendar from "@/app/components/tours/CustomCalendar"
import ArrowIcon from '@/public/icons/arrow-icon'

// --- Types & Mocks ---
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
    'WELCOME10': 0.10,
    'BARBADOS20': 0.20,
    'FAMILY': 0.15
}

type TicketType = 'child' | 'adult' | 'senior'

interface BookingFormProps {
    tour: Tour;
    user?: any;
}

// --- Sub-Components ---

const PaymentOption = ({
    id,
    name,
    icon: Icon,
    selected,
    onSelect,
    balance,
    needsActivation,
}: {
    id: string
    name: string
    icon: React.ElementType
    selected: boolean
    onSelect: (id: string) => void
    balance?: string
    needsActivation?: boolean
}) => (
    <div
        onClick={() => !needsActivation && onSelect(id)}
        className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'} ${needsActivation ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
        <div className="flex items-center gap-4">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
            >
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p
                    className={`font-semibold text-base ${selected ? 'text-blue-900' : 'text-gray-900'}`}
                >
                    {name}
                </p>
                {balance && <p className="text-sm text-gray-500">{balance}</p>}
            </div>
        </div>
        <div className="flex items-center gap-3">
            {needsActivation && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                    Activate
                </span>
            )}
            {!needsActivation && (
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}
                >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
            )}
        </div>
    </div>
)

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Details', 'Tickets', 'Payment', 'Done']
    return (
        <div className="w-full px-12 pb-10 pt-4 border-b border-gray-100">
            <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />

                {/* Active Progress Line */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500 ease-out"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                />

                {/* Step Circles */}
                {steps.map((label, index) => {
                    const stepNum = index + 1
                    const isActive = stepNum === currentStep
                    const isCompleted = stepNum < currentStep
                    return (
                        <div key={label} className="relative z-10 flex flex-col items-center group cursor-default">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                                ${isActive
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                        : isCompleted
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-gray-200 text-gray-400'}`}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                            </div>
                            <span
                                className={`absolute -bottom-6 md:text-[12px] text-xs font-bold font-sans uppercase tracking-wider whitespace-nowrap transition-colors duration-300
                                ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// --- Main Component ---

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
    const [bookingId] = useState(`ORD-${Math.floor(10000000 + Math.random() * 90000000)}`)

    // --- State: Promo Code ---
    const [promoCodeInput, setPromoCodeInput] = useState("")
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number } | null>(null)
    const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    // --- State: Processing & Wizard ---
    const [isBooking, setIsBooking] = useState(false)
    const [showSummary, setShowSummary] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card')
    const [copyMessage, setCopyMessage] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (showSummary) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showSummary]);

    // Clear copy message after 2 seconds
    useEffect(() => {
        if (copyMessage) {
            const timer = setTimeout(() => setCopyMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [copyMessage]);

    // --- Helpers ---
    const updateTicket = (type: TicketType, increment: boolean) => {
        setTickets((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + (increment ? 1 : -1)),
        }))
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: totals.currency,
        }).format(amount)
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

    // --- Handlers ---
    const handleOpenSummary = () => {
        if (!fullName || !email || !phone) return alert("Please fill in your name, email, and phone number.");
        if (totalGuests === 0) return alert("Please select at least one ticket.");
        setCurrentStep(1);
        setShowSummary(true);
    };

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1)
        } else if (currentStep === 3) {
            handleBook()
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleCloseModal = () => {
        setShowSummary(false)
        if (currentStep === 4) {
            setFullName('')
            setEmail('')
            setPhone('')
            setNotes('')
            handleRemovePromo()
            setTickets({ child: 0, adult: 1, senior: 0 })
            setCurrentStep(1)
        }
    }

    // --- Supabase Submission ---
    const handleBook = async () => {
        setIsBooking(true);
        try {
            const ticketDetails = `Type: ${userType.toUpperCase()} | Tickets: ${tickets.adult} Adult, ${tickets.child} Child, ${tickets.senior} Senior`;
            let promoDetails = "";
            if (appliedDiscount) {
                promoDetails = `\nPromo Applied: ${appliedDiscount.code} (-${(appliedDiscount.value * 100)}%)`;
            }
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
            setCurrentStep(4);
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <>
            {/* --- MAIN FORM CARD (Initial View) --- */}
            <div className="bg-white rounded-[50px] border-[2px]/0 border-gray-200 shadow-[0px_0px_15px_rgba(0,0,0,.07)] p-4 md:p-6 lg:w-[700px] relative">
                <div className='flex gap-2 items-center bg-red-500/0 mb-4 ml-[7px] max-sm:mt-[5px]'>
                    <CalendarPlus />
                    <h2 className="text-2xl font-bold text-gray-900">Book Your Tour</h2>
                </div>

                <div className="bg-[#F2F2F2] p-[5px] rounded-[27px] flex mb-4">
                    <button onClick={() => handleUserTypeChange('local')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${userType === 'local' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Local</button>
                    <button onClick={() => handleUserTypeChange('tourist')} className={`flex-1 py-[15px] px-4 rounded-[23px] cursor-pointer font-medium ${userType === 'tourist' ? 'bg-[#007BFF] text-white' : 'text-gray-600 hover:text-gray-900'}`}>Tourist</button>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-600 mb-6">
                    <p className="text-[13px]">🎉 locals enjoy discounted rates! Valid Barbados ID required.</p>
                </div>

                <h3 className="text-gray-600 font-medium mb-4">Select Tickets</h3>
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Child (5-17)</div>
                            <div className="text-sm text-gray-500"><span className="font-medium text-black">${PRICING[userType].child} {PRICING[userType].currency}</span> {userType === 'local' && <span className="line-through">$80</span>}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateTicket('child', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-5 h-5" /></button>
                            <span className="w-4 text-center font-medium">{tickets.child}</span>
                            <button onClick={() => updateTicket('child', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-5 h-5" /></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Adult (18 - 64)</div>
                            <div className="text-sm text-gray-500"><span className="font-medium text-black">${PRICING[userType].adult} {PRICING[userType].currency}</span> {userType === 'local' && <span className="line-through">$100</span>}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateTicket('adult', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-4 h-4" /></button>
                            <span className="w-4 text-center font-medium">{tickets.adult}</span>
                            <button onClick={() => updateTicket('adult', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-[30px]">
                        <div>
                            <div className="font-bold text-gray-900">Senior (65+)</div>
                            <div className="text-sm font-bold text-[#00a911]">FREE</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateTicket('senior', false)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Minus className="w-4 h-4" /></button>
                            <span className="w-4 text-center font-medium">{tickets.senior}</span>
                            <button onClick={() => updateTicket('senior', true)} className="w-8 h-8 bg-[#000]/10 cursor-pointer flex items-center justify-center rounded-[12px] active:scale-[.95] active:bg-[#ccc]"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium text-gray-600 mb-2">Promo Code</label>
                    <div className="flex relative justify-end items-center bg-[#F2F2F2] rounded-[32px] p-[7px] w-full">
                        <input type="text" placeholder="Enter code" value={promoCodeInput} onChange={(e) => setPromoCodeInput(e.target.value)} disabled={!!appliedDiscount} className={`flex-1 font-medium bg-transparent rounded-[22px] px-4 pr-[130px] py-[11px] focus:outline-none ${appliedDiscount ? 'text-gray-500' : ''}`} />
                        <div className='absolute right-[5px]'>
                            {!appliedDiscount ? (
                                <button onClick={handleApplyPromo} className="bg-[#007BFF] shadow-[0_0_7px_rgba(0,123,255,0.5)] text-center text-white w-[120px] h-[50px] py-[13px] rounded-full font-medium active:scale-[.95] active:bg-[#ccc] transition-colors">Apply</button>
                            ) : (
                                <button onClick={handleRemovePromo} className="bg-red-500 text-white w-[120px] h-[50px] rounded-full font-medium hover:bg-red-600 transition-colors flex justify-center items-center gap-2 whitespace-nowrap"><Trash2 className="w-4 h-4" />Remove</button>
                            )}
                        </div>
                    </div>
                    {promoMessage && <div className={`mt-2 text-sm flex items-center gap-1 ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{promoMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{promoMessage.text}</div>}
                </div>

                <div className="space-y-4 mb-6">
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="w-full flex items-center justify-between bg-[#F2F2F2] font-medium rounded-[21px] px-4 py-[15px] hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-2 font-bold text-gray-900"><CalendarIcon className="w-5 h-5" />{format(selectedDate, 'MMMM d, yyyy')}</div>
                            <div className="flex items-center gap-2"><span className="font-bold text-gray-900">{format(selectedDate, 'p')}</span><ArrowIcon className={`transition-transform duration-200 ${isCalendarOpen ? '' : 'rotate-180'}`} color="#000" /></div>
                        </button>
                        {isCalendarOpen && <div className="absolute top-full mx-auto mt-2 z-20"><CustomCalendar selectedDate={selectedDate} onChange={(d) => { setSelectedDate(d); setIsCalendarOpen(false) }} onClose={() => setIsCalendarOpen(false)} /></div>}
                    </div>
                    <textarea placeholder="Notes (Optional)" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-[#F2F2F2] font-medium rounded-[23px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>

                <div onClick={handleOpenSummary} className={`cursor-pointer rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98] transition-transform ${isBooking ? 'pointer-events-none opacity-50' : ''}`}>
                    <div className='flex justify-center items-center gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[15px]'>
                        <p className='text-white font-bold'>Review & Book</p>
                    </div>
                </div>
            </div>

            {/* --- MULTI-STEP WIZARD MODAL --- */}
            <AnimatePresence>
                {showSummary && (
                    /* Z-Index increased to 100 to overlap navbar, items-center for centering */
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                        />

                        {/* Modal Container: Max-width increased to 3xl for horizontal layout */}
                        <motion.div
                            className="relative w-full max-w-3xl bg-[#F8F9FB] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            {/* Header with Stepper */}
                            <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
                                <div className="flex  items-center justify-between px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        {currentStep > 1 && currentStep < 4 && (
                                            <button onClick={handlePrevStep} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {currentStep === 1 && 'Booking Details'}
                                                {currentStep === 2 && 'Review Order'}
                                                {currentStep === 3 && 'Payment Method'}
                                                {currentStep === 4 && 'Confirmation'}
                                            </h2>
                                            <p className="text-xs text-gray-500">Step {currentStep} of 4</p>
                                        </div>
                                    </div>
                                    <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <Stepper currentStep={currentStep} />
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto flex-1 px-8 py-2 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: DETAILS */}
                                    {currentStep === 1 && (
                                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                                                {/* Left Col: Info */}
                                                <div className="md:col-span-3 space-y-6">
                                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                                                <MapPin className="w-7 h-7" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[12px] font-semibold font-sans bg-blue-600 text-white px-2 py-0.5 rounded-2xl uppercase tracking-wide flex items-center gap-1 cursor-pointer" onClick={() => { navigator.clipboard.writeText(bookingId.split('-')[1]); setToast('ID copied'); }}>
                                                                        ID #{bookingId.split('-')[1]} <Copy className="w-3 h-3" />
                                                                    </span>
                                                                    {toast && <span className="text-xs text-green-600 font-medium">{toast}</span>}
                                                                </div>
                                                                <h3 className="font-bold text-gray-900 text-base">Name of Tour</h3>
                                                                <p className="text-sm text-gray-500 mt-1">Location</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                                                            <div><p className="text-xs text-gray-500 mb-1">Name</p><p className="text-sm font-bold text-gray-900 truncate font-sans">{fullName}</p></div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Date</p>
                                                                <p className="text-sm font-bold text-gray-900 font-sans">{format(selectedDate, 'MMM d, yyyy')}</p>
                                                                <p className="text-sm font-bold text-gray-900 font-sans">at&nbsp;{format(selectedDate, 'p')}</p>
                                                            </div>
                                                            <div><p className="text-xs text-gray-500 mb-1">Attendees</p><p className="text-sm font-bold text-gray-900 font-sans">{totalGuests}</p></div>
                                                            <div><p className="text-xs text-gray-500 mb-1">Rate</p><p className="text-sm bg-blue-600/20 rounded-2xl w-fit py-1 px-3 font-semibold font-sans text-blue-600 capitalize">{userType}</p></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Right Col: Contact */}
                                                <div className="md:col-span-2 space-y-6">
                                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                                                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                            <div className="bg-blue-500/20 p-2 rounded-lg"><User className="w-4 h-4 text-blue-500" /></div>Contact Info</h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl group hover:bg-gray-100 transition-colors">
                                                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-gray-600 font-medium" />
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl group hover:bg-gray-100 transition-colors">
                                                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-gray-600 font-medium" />
                                                            </div>
                                                            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl group hover:bg-gray-100 transition-colors">
                                                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." className="flex-1 bg-transparent focus:outline-none text-gray-600 font-medium text-xs resize-none" rows={2} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: TICKETS */}
                                    {currentStep === 2 && (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Ticket className="w-4 h-4 text-blue-500" />Tickets Selected</h4>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Adult', count: tickets.adult, price: PRICING[userType].adult },
                                                            { label: 'Child', count: tickets.child, price: PRICING[userType].child },
                                                            { label: 'Senior', count: tickets.senior, price: PRICING[userType].senior },
                                                        ].map((item) => item.count > 0 && (
                                                            <div key={item.label} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl">
                                                                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600">{item.count}</span><span className="text-gray-700 font-medium">{item.label}</span></div>
                                                                <span className="font-bold text-gray-900">{item.price === 0 ? 'Free' : formatCurrency(item.price * item.count)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900 mb-4">Summary</h4>
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                                                            {appliedDiscount && <div className="flex justify-between text-sm text-green-600"><span>Discount ({appliedDiscount.code})</span><span>-{formatCurrency(totals.discountAmount)}</span></div>}
                                                        </div>
                                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-end"><span className="text-sm font-bold text-gray-900">Total</span><span className="text-3xl font-bold text-blue-600">{formatCurrency(totals.total)}</span></div>
                                                    </div>
                                                    {/* Promo Input */}
                                                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-500 mb-2">Have a promo code?</p>
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="CODE" value={promoCodeInput} onChange={(e) => setPromoCodeInput(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors uppercase font-medium" />
                                                            <button onClick={handleApplyPromo} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Apply</button>
                                                        </div>
                                                        {promoMessage && <p className={`text-xs mt-2 font-medium ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{promoMessage.text}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: PAYMENT */}
                                    {currentStep === 3 && (
                                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                            <div className="space-y-6">
                                                <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3 border border-blue-100">
                                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-blue-800 leading-relaxed font-medium">Cash on Arrival is not available for this tour type. Please select a digital payment method below.</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-4">Select Payment Method</h3>
                                                    <div className="space-y-3">
                                                        <PaymentOption id="card" name="Credit / Debit Card" icon={CreditCard} selected={selectedPaymentMethod === 'card'} onSelect={setSelectedPaymentMethod} />
                                                        <PaymentOption id="paypal" name="PayPal" icon={Globe} selected={selectedPaymentMethod === 'paypal'} onSelect={setSelectedPaymentMethod} balance="$11.43" />
                                                        <PaymentOption id="apple_pay" name="Apple Pay" icon={Smartphone} selected={selectedPaymentMethod === 'apple_pay'} onSelect={setSelectedPaymentMethod} needsActivation />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4"><Wallet className="w-8 h-8 text-blue-500" /></div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">Total to Pay</h4>
                                                <p className="text-4xl font-extrabold text-blue-600 mb-2">{formatCurrency(totals.total)}</p>
                                                <p className="text-xs text-gray-500 max-w-xs">Secure SSL encrypted payment. Your ticket will be emailed immediately after payment.</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 4: SUCCESS */}
                                    {currentStep === 4 && (
                                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: 'spring' }} className="flex flex-col items-center justify-center py-8 text-center h-full">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-lg shadow-green-500/20"><CheckCircle2 className="w-12 h-12" /></motion.div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                                            <p className="text-gray-500 mb-8 text-base max-w-md mx-auto">Your spot is secured. A receipt and ticket have been sent to <span className="font-bold text-gray-900">{email}</span>.</p>
                                            <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-md border border-gray-100 mb-6 mx-auto">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Order ID</p>
                                                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><span className="text-xl font-mono font-bold text-gray-900 tracking-wide">{bookingId}</span><button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"><Copy className="w-5 h-5" /></button></div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-white border-t border-gray-100">
                                {currentStep === 4 ? (
                                    <button onClick={handleCloseModal} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-lg">Done</button>
                                ) : (
                                    <div className="flex items-center justify-between gap-4">
                                        {/* <div className="hidden md:block"><p className="text-xs text-gray-500 mb-0.5">Total Payment</p><div className="flex items-center gap-1"><span className="text-2xl font-bold text-gray-900">{formatCurrency(totals.total)}</span></div></div> */}
                                        <button onClick={handleNextStep} disabled={isBooking} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 ml-auto">
                                            {isBooking ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : (<>{currentStep === 3 ? 'Pay Now' : 'Next Step'}{currentStep < 3 && <ArrowRight className="w-5 h-5" />}</>)}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default BookingForm
