"use client";
import React, { useEffect, useRef } from 'react';

const ConnectCTA = () => {
    // --- FOOTER INTERACTION LOGIC ---
    const footerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = footerRef.current;
        if (el) {
            el.style.setProperty('--opacity', '0'); // Start invisible
        }
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = footerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        el.style.setProperty('--opacity', '1');
    };

    const handlePointerLeave = () => {
        const el = footerRef.current;
        if (!el) return;
        el.style.setProperty('--opacity', '0');
    };

    return (
        <section className="w-full flex justify-center pb-0 pt-0 mb-[-50px] px-2 overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-12px) rotate(var(--tw-rotate)); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-15px) rotate(var(--tw-rotate)); }
        }
        .dot-base {
          background-image: radial-gradient(rgba(37, 99, 235, 0.4) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .dot-dense {
          background-image: radial-gradient(rgba(37, 99, 235, 0.6) 1px, transparent 1px);
          background-size: 14px 14px;
          opacity: var(--opacity, 0);
          transition: opacity 200ms ease;
          -webkit-mask-image: radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(37,99,235,1) 35%, transparent 70%);
          mask-image: radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(37,99,235,1) 35%, transparent 70%);
        }
      `}} />

            <div
                ref={footerRef}
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerMove}
                onPointerUp={handlePointerLeave}
                onPointerLeave={handlePointerLeave}
                className="relative w-full max-w-[1400px] overflow-hidden px-6 py-24 md:py-32"
            >

                {/* Background Texture */}
                <div className="absolute inset-0 z-0 dot-wrap pointer-events-none opacity-40 mix-blend-multiply">
                    <div className="absolute inset-0 dot-base" />
                    <div className="absolute inset-0 dot-dense" />
                </div>

                {/* --- MAIN CTA CONTENT --- */}
                <div className="relative z-30 flex flex-col items-center gap-7 text-center pointer-events-none">

                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">Be The Help</span>
                        <h2 className="font-extrabold text-[2.5rem] md:text-[4rem] leading-[1] text-slate-900 tracking-tight drop-shadow-sm">
                            Stay Connected
                        </h2>
                    </div>

                    <p className="max-w-[600px] text-lg md:text-xl text-slate-500 font-medium leading-relaxed px-4">
                        General Inquiries: <span className="text-slate-900 font-semibold">[Insert Email/Phone]</span>
                        <br />
                        <span className="block mt-2 text-sm text-slate-400">Join our WhatsApp Channel for instant community updates.</span>
                    </p>

                    {/* Interactive Buttons */}
                    <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-4 mt-5">

                        {/* Primary Link Button */}
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSchyhKeD1-RL7bXF1ey-ZcFbb6a_M0Ddvv_YEtXiwk7FNIwxA/viewform" target="_blank" rel="noopener noreferrer" className="group relative block">
                            <button className={`w-full cursor-pointer group rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transition-transform duration-100 transform active:scale-[.98] hover:scale-105`}>
                                <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                                    <span className='font-bold text-lg'>Join the DEO</span>
                                </div>
                            </button>
                        </a>

                        {/* WhatsApp Secondary Button */}
                        <a href="https://dem.gov.bb/deo/volunteerForm" target="_blank" rel="noopener noreferrer" className="group relative block">
                            <button className={`w-full cursor-pointer group rounded-full p-[2px] bg-[linear-gradient(to_right,#25D366,#25D366,#1FA855)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transition-transform duration-100 transform active:scale-[.98] hover:scale-105`}>
                                <div className='bg-[#fff] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                                    <span className='font-bold text-lg bg-[linear-gradient(to_right,#1FA855,#25D366,#25D366)] inline-block text-transparent bg-clip-text'>Whatsapp</span>
                                </div>
                            </button>
                        </a>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default ConnectCTA;
