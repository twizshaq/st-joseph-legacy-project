'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from "date-fns"
import { PRICING, UserType } from '@/app/hooks/useBooking'
import {
    Check, X, ArrowLeft, ArrowRight, MapPin, Copy, User, Mail, Phone,
    FileText, Ticket, Info, CreditCard, Globe, Smartphone, Wallet, CheckCircle2
} from 'lucide-react'

// --- Internal Helper Components ---
const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Details', 'Tickets', 'Payment', 'Done']
    return (
        <div className="w-full px-12 pb-10 pt-4 border-b border-gray-100">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                {steps.map((label, index) => {
                    const stepNum = index + 1
                    const isActive = stepNum === currentStep
                    const isCompleted = stepNum < currentStep
                    return (
                        <div key={label} className="relative z-10 flex flex-col items-center group cursor-default">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                                ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' :
                                    isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                            </div>
                            <span className={`absolute -bottom-6 md:text-[12px] text-xs font-bold font-sans uppercase tracking-wider whitespace-nowrap transition-colors duration-300
                                ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const PaymentOption = ({ id, name, icon: Icon, selected, onSelect, balance, needsActivation }: any) => (
    <div onClick={() => !needsActivation && onSelect(id)}
        className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'} ${needsActivation ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className={`font-semibold text-base ${selected ? 'text-blue-900' : 'text-gray-900'}`}>{name}</p>
                {balance && <p className="text-sm text-gray-500">{balance}</p>}
            </div>
        </div>
        <div className="flex items-center gap-3">
            {needsActivation ? (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">Activate</span>
            ) : (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
            )}
        </div>
    </div>
)

// --- Main Modal Props ---
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStep: number;
    onNext: () => void;
    onPrev: () => void;
    isBooking: boolean;
    bookingData: {
        bookingId: string; fullName: string; email: string; phone: string; notes: string; selectedDate: Date; totalGuests: number; userType: UserType;
    };
    pricing: {
        tickets: { child: number; adult: number; senior: number };
        totals: { subtotal: number; discountAmount: number; total: number; currency: string };
    };
    promo: {
        input: string; message: any; applied: any;
        onChange: (val: string) => void; onApply: () => void; onRemove: () => void;
    };
    payment: {
        selectedMethod: string; onSelectMethod: (method: string) => void;
    };
    tourName?: string;
}

export function BookingModal({
    isOpen, onClose, currentStep, onNext, onPrev, isBooking, bookingData, pricing, promo, payment, tourName = "Name of Tour"
}: BookingModalProps) {
    const [toast, setToast] = useState<string | null>(null)

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: pricing.totals.currency }).format(amount)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                <motion.div className="relative w-full max-w-3xl bg-[#F8F9FB] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
                    
                    {/* Header */}
                    <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
                        <div className="flex items-center justify-between px-8 py-4">
                            <div className="flex items-center gap-3">
                                {currentStep > 1 && currentStep < 4 && (
                                    <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
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
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
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
                                        <div className="md:col-span-3 space-y-6">
                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0"><MapPin className="w-7 h-7" /></div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[12px] font-semibold font-sans bg-blue-600 text-white px-2 py-0.5 rounded-2xl uppercase tracking-wide flex items-center gap-1 cursor-pointer" 
                                                                  onClick={() => { navigator.clipboard.writeText(bookingData.bookingId.split('-')[1]); setToast('ID copied'); }}>
                                                                ID #{bookingData.bookingId.split('-')[1]} <Copy className="w-3 h-3" />
                                                            </span>
                                                            {toast && <span className="text-xs text-green-600 font-medium">{toast}</span>}
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 text-base">{tourName}</h3>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                                                    <div><p className="text-xs text-gray-500 mb-1">Name</p><p className="text-sm font-bold text-gray-900 truncate font-sans">{bookingData.fullName}</p></div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Date</p>
                                                        <p className="text-sm font-bold text-gray-900 font-sans">{format(bookingData.selectedDate, 'MMM d, yyyy')}</p>
                                                        <p className="text-sm font-bold text-gray-900 font-sans">at&nbsp;{format(bookingData.selectedDate, 'p')}</p>
                                                    </div>
                                                    <div><p className="text-xs text-gray-500 mb-1">Attendees</p><p className="text-sm font-bold text-gray-900 font-sans">{bookingData.totalGuests}</p></div>
                                                    <div><p className="text-xs text-gray-500 mb-1">Rate</p><p className="text-sm bg-blue-600/20 rounded-2xl w-fit py-1 px-3 font-semibold font-sans text-blue-600 capitalize">{bookingData.userType}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="bg-blue-500/20 p-2 rounded-lg"><User className="w-4 h-4 text-blue-500" /></div>Contact Info</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl group">
                                                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" /><p className="flex-1 text-gray-600 font-medium truncate">{bookingData.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl group">
                                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" /><p className="flex-1 text-gray-600 font-medium">{bookingData.phone}</p>
                                                    </div>
                                                    <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl group">
                                                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /><p className="flex-1 text-gray-600 font-medium text-xs break-words">{bookingData.notes || 'No notes provided.'}</p>
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
                                                    { label: 'Adult', count: pricing.tickets.adult, price: PRICING[bookingData.userType].adult },
                                                    { label: 'Child', count: pricing.tickets.child, price: PRICING[bookingData.userType].child },
                                                    { label: 'Senior', count: pricing.tickets.senior, price: PRICING[bookingData.userType].senior },
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
                                                    <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatCurrency(pricing.totals.subtotal)}</span></div>
                                                    {promo.applied && <div className="flex justify-between text-sm text-green-600"><span>Discount ({promo.applied.code})</span><span>-{formatCurrency(pricing.totals.discountAmount)}</span></div>}
                                                </div>
                                                <div className="border-t border-gray-100 pt-4 flex justify-between items-end"><span className="text-sm font-bold text-gray-900">Total</span><span className="text-3xl font-bold text-blue-600">{formatCurrency(pricing.totals.total)}</span></div>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">Have a promo code?</p>
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="CODE" value={promo.input} onChange={(e) => promo.onChange(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors uppercase font-medium" />
                                                    <button onClick={promo.onApply} className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Apply</button>
                                                </div>
                                                {promo.message && <p className={`text-xs mt-2 font-medium ${promo.message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{promo.message.text}</p>}
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
                                                <PaymentOption id="card" name="Credit / Debit Card" icon={CreditCard} selected={payment.selectedMethod === 'card'} onSelect={payment.onSelectMethod} />
                                                <PaymentOption id="paypal" name="PayPal" icon={Globe} selected={payment.selectedMethod === 'paypal'} onSelect={payment.onSelectMethod} balance="$11.43" />
                                                <PaymentOption id="apple_pay" name="Apple Pay" icon={Smartphone} selected={payment.selectedMethod === 'apple_pay'} onSelect={payment.onSelectMethod} needsActivation />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-full flex flex-col justify-center items-center text-center">
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4"><Wallet className="w-8 h-8 text-blue-500" /></div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Total to Pay</h4>
                                        <p className="text-4xl font-extrabold text-blue-600 mb-2">{formatCurrency(pricing.totals.total)}</p>
                                        <p className="text-xs text-gray-500 max-w-xs">Secure SSL encrypted payment. Your ticket will be emailed immediately after payment.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: SUCCESS */}
                            {currentStep === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: 'spring' }} className="flex flex-col items-center justify-center py-8 text-center h-full">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-lg shadow-green-500/20"><CheckCircle2 className="w-12 h-12" /></motion.div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                                    <p className="text-gray-500 mb-8 text-base max-w-md mx-auto">Your spot is secured. A receipt and ticket have been sent to <span className="font-bold text-gray-900">{bookingData.email}</span>.</p>
                                    <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-md border border-gray-100 mb-6 mx-auto">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Order ID</p>
                                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><span className="text-xl font-mono font-bold text-gray-900 tracking-wide">{bookingData.bookingId}</span><button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => navigator.clipboard.writeText(bookingData.bookingId)}><Copy className="w-5 h-5" /></button></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        {currentStep === 4 ? (
                            <button onClick={onClose} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-lg">Done</button>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <button onClick={onNext} disabled={isBooking} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 ml-auto">
                                    {isBooking ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : (<>{currentStep === 3 ? 'Pay Now' : 'Next Step'}{currentStep < 3 && <ArrowRight className="w-5 h-5" />}</>)}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}