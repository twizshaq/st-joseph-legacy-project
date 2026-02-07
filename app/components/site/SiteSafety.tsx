// components/site/SiteSafety.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import arrowIcon from "@/public/icons/arrow-icon.svg";
import { SafetyInfo } from '@/app/types/site'; // Import type

// --------- 1️⃣ Mobile detection hook ---------
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia('(pointer: coarse)');
        const update = () => setIsMobile(media.matches);

        update();
        media.addEventListener('change', update);

        return () => media.removeEventListener('change', update);
    }, []);

    return isMobile;
}

// --------- 2️⃣ Component props ---------
interface SiteSafetyProps {
    data: SafetyInfo;
}

// --------- 3️⃣ Main Component ---------
export const SiteSafety = ({ data }: SiteSafetyProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const isMobile = useIsMobile();

    const guidelinesRaw = data.guidelines ?? [];
    const guidelines = Array.isArray(guidelinesRaw) ? guidelinesRaw : [guidelinesRaw];

    const numbers = [
        { number: '211', label: 'Police' },
        { number: '511', label: 'Ambulance' },
        { number: '311', label: 'Fire' },
        { number: '4387575', label: 'Department of Emergency', display: '438-7575' },
    ];

    return (
        <div className="w-full max-w-[450px] relative z-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="rounded-[40px] border border-amber-500/30 bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-[0_0px_20px_rgb(0,0,0,.1)]">

                {/* Header Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group w-full flex items-center justify-between gap-3 px-6 py-5 cursor-pointer relative overflow-hidden"
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,#f59e0b_25%,transparent_25%,transparent_50%,#f59e0b_50%,#f59e0b_75%,transparent_75%,transparent)] bg-[length:20px_20px] pointer-events-none"></div>
                    <div className="absolute left-0 top-0 w-1/3 h-full blur-[20px] bg-gradient-to-r from-amber-50/80 to-transparent pointer-events-none"></div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full text-amber-600">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20 animate-ping group-hover:opacity-40"></span>
                        </div>

                        <div className="flex flex-col text-start">
                            <span className="font-bold text-[1.15rem] text-slate-800 leading-tight">{data.heading}</span>
                            <span className="text-[0.8rem] text-slate-400 font-medium">{data.subheading}</span>
                        </div>
                    </div>

                    <span className={`transform transition-transform duration-300 ease-in-out relative z-10 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        <Image src={arrowIcon} alt="Back" height={28} className="opacity-60 invert" />
                    </span>
                </button>

                <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-amber-200 to-transparent transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className={`${isOpen ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white relative transition-all duration-300`}>
                    <div className="px-6 pb-6 pt-4 relative z-10">
                        {/* Description */}
                        <div className="text-[0.95rem] leading-[1.6] text-slate-600 mb-4">
                            {data.description}
                        </div>

                        {/* Guidelines */}
                        <ul className="space-y-3 mb-5">
                            {guidelines.map((item, index) => (
                                <li key={index} className="flex gap-3 items-start">
                                    <span className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                                    <span className="text-[0.9rem] text-slate-500 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Emergency Numbers Section */}
                        <div className="relative flex items-start gap-3 mt-4 bg-amber-50 border border-amber-100 p-3 rounded-[25px] overflow-hidden">
                            <div className="bg-white p-1.5 rounded-full shadow-sm text-amber-500 mt-0.5 relative z-10 ring-1 ring-amber-100">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                            </div>

                            <div className="flex flex-col relative z-10">
                                <span className="font-bold text-[0.85rem] text-amber-900">
                                    Emergency Advisory {isMobile && <span>(Tap to call)</span>}
                                </span>

                                {/* Numbers */}
                                <div className="mt-1 flex flex-col gap-2">
                                    {numbers.map((item) =>
                                        isMobile ? (
                                            <a
                                                key={item.number}
                                                href={`tel:${item.number}`}
                                                className="bg-amber-200 text-amber-900 font-semibold text-[0.85rem]
                   py-1 px-3 rounded-lg text-center
                   hover:bg-amber-300 transition-colors duration-200"
                                            >
                                                <span>{item.display ?? item.number}</span>
                                                <span className="block text-[0.75rem] font-normal">{item.label}</span>
                                            </a>
                                        ) : (
                                            <span
                                                key={item.number}
                                                className="text-[0.85rem] text-amber-800/70 leading-tight font-medium"
                                            >
                                                {item.display ?? item.number} - {item.label}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
