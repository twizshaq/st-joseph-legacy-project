/* eslint-disable */
"use client";
import React, { useEffect, useRef } from 'react';
import { 
  Users, 
  Shield, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Footer from "@/app/components/FooterModal";

// --- DATA STRUCTURES ---

interface TeamMember {
  role: string;
  name: string;
}

const executiveOfficers: TeamMember[] = [
  { role: 'Chairperson', name: 'Matthew Alleyne' },
  { role: 'Deputy Chairperson', name: 'Tricia Gill' },
  { role: 'Secretary', name: 'Anjelica Catling' },
  { role: 'Treasurer', name: 'Karen Armstrong' },
];

const specialistLeads: TeamMember[] = [
  { role: 'First Aid', name: 'Moreen Smith' },
  { role: 'Damage Assessment', name: 'Harriet Clarke' },
  { role: 'Communications', name: 'Shaun Maynard' },
  { role: 'Shelter Officer', name: 'Edwin Greene' },
  { role: 'Road Clearance', name: 'Sharon Mayers' },
  { role: 'Vulnerable Persons', name: 'Olivia Philips' },
];

export default function AboutUsPage() {
  
  // --- FOOTER INTERACTION LOGIC (From your Reference) ---
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
    <div className="min-h-screen w-full overflow-x-hidden font-sans text-slate-800">
      
      {/* ---------------- SECTION 1: HERO / WHO WE ARE ---------------- */}
      <div className="relative flex flex-col justify-center items-center max-w-[2000px] w-full h-[70vh] text-white gap-[20px] overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                // ADD A POSTER IMAGE HERE (Screenshot your video first frame)
                // poster="/images/hero-placeholder.jpg" 
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
            </video>
            
            {/* Dark Overlay - Optimized opacity for legibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
            
            <div className="max-w-4xl z-[10] mx-auto text-center mt-15">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                    St. Joseph District <br /> 
                    <span className="">Emergency Organisation</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-yellow-600/90 mb-6 uppercase">
                    Who We Are
                </h2>
                <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                    The St. Joseph DEO is one of 24 volunteer groups across Barbados, 
                    serving as the community arm of the Department of Emergency Management (DEM).
                </p>
            </div>
        </div>
      {/* <section className="text-black pt-50 max-sm:pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            St. Joseph District <br /> 
            <span className="">Emergency Organisation</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-yellow-600/90 mb-6 uppercase">
            Who We Are
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            The St. Joseph DEO is one of 24 volunteer groups across Barbados, 
            serving as the community arm of the Department of Emergency Management (DEM).
          </p>
        </div>
      </section> */}

      {/* ---------------- SECTION 2: MISSION & IDENTITY ---------------- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          
          <div className="relative order-2 md:order-1">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-60"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                We Are Proud <span className="text-blue-600">"Josephines"</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We are your neighbours, your friends, and your family. While our primary mandate 
                is Disaster Management, we know that a truly resilient community is one that stays connected.
              </p>
              
              <div className="p-0 bg-blue-500/0 rounded-[30px] shadow-[0px_0px_20px_rgba(0,0,0,0)]">
                <p className="text-slate-800 font-medium italic">
                  "Our goal is to cultivate a more informed, engaged, 
                  and disaster-resilient St. Joseph by integrating cultural heritage 
                  with modern risk management."
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 h-[400px] w-full bg-slate-100 rounded-[50px] overflow-hidden shadow-[0px_0px_20px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white relative">
            {/* Visual Placeholder for St. Joseph Map or Photo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100"></div>
            <div className="text-center relative z-10 text-slate-400">
                <Users className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <span className="font-semibold tracking-wider">COMMUNITY PHOTO</span>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- SECTION 3: LEADERSHIP TEAM ---------------- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Executive Committee</h2>
            <p className="text-blue-600 font-medium tracking-wide">2024 – 2026 Term</p>
          </div>

          {/* Officers (Featured Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {executiveOfficers.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-xl border-2 border-white shadow-sm">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{member.role}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-8 text-center text-slate-800">Specialist Leads</h3>
          
          {/* Specialists (Compact List) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialistLeads.map((member, idx) => (
              <div key={idx} className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Shield className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">{member.name}</h4>
                    <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: ACTION CENTER (Based on provided Design) ---------------- */}
      <section className="w-full flex justify-center pb-0 pt-10 mb-[-50px] px-2 overflow-hidden">
         <style dangerouslySetInnerHTML={{__html: `
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

            {/* --- FLOATING GRAPHICS --- */}
            
            {/* Floating Graphic 1: Status Card */}
            {/* <div className="absolute bottom-6 left-6 md:bottom-24 md:left-20 transform -rotate-[6deg] z-20 w-[160px] md:w-[200px] select-none scale-75 md:scale-100"
                style={{ animation: 'float-medium 6s ease-in-out infinite' }}>
                <div className="bg-white rounded-xl shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                    <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Status</span>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
                        </div>
                         <div className="flex items-center gap-2 opacity-50">
                            <div className="w-4 h-4 border-2 border-slate-200 rounded-full" />
                            <div className="h-1.5 w-12 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Floating Graphic 2: Emergency Icons */}
            {/* <div className="absolute top-10 right-4 md:top-20 md:right-32 z-20 scale-75 md:scale-100"
                style={{ animation: 'float-slow 5s ease-in-out infinite 1s' }}>
                <div className="flex -space-x-4 items-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-400 border-[3px] border-white shadow-lg flex items-center justify-center text-white overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                         <AlertCircle className="w-8 h-8 text-yellow-900 opacity-80" />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-blue-600 border-[4px] border-white shadow-xl flex items-center justify-center text-white z-10 transform hover:-translate-y-2 transition-transform duration-300 delay-75">
                         <Heart className="w-8 h-8 fill-current" />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-[3px] border-white shadow-lg flex items-center justify-center text-white overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 delay-150">
                        <MapPin className="w-7 h-7" />
                    </div>
                </div>
            </div> */}

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
                    <br/>
                    <span className="block mt-2 text-sm text-slate-400">Join our WhatsApp Channel for instant community updates.</span>
                </p>

                {/* Interactive Buttons (Pointer events re-enabled) */}
                <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-4 mt-5">
                    
                    {/* Primary Link Button */}
                    <a href="https://dem.gov.bb/deo/volunteerForm" target="_blank" rel="noopener noreferrer" className="group relative block">
                        <div className='relative cursor-pointer whitespace-nowrap rounded-full shadow-[0px_0px_20px_rgba(0,0,0,0.08)] transition-transform duration-100 transform active:scale-[.98] hover:scale-105 flex items-center'>
                            <button className={`w-full cursor-pointer group rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]`}>
                                <div className='bg-[linear-gradient(to_left,#007BFF,#66B2FF)] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                                    <span className='font-bold text-lg'>Join the DEO</span>
                                </div>
                            </button>
                        </div>
                    </a>

                    {/* WhatsApp Secondary Button */}
                    <a href="https://dem.gov.bb/deo/volunteerForm" target="_blank" rel="noopener noreferrer" className="group relative block">
                        <div className='relative cursor-pointer whitespace-nowrap rounded-full shadow-[0px_0px_20px_rgba(0,0,0,0.08)] transition-transform duration-100 transform active:scale-[.98] hover:scale-105 flex items-center'>
                            <button className={`w-full cursor-pointer group rounded-full p-[2px] bg-[linear-gradient(to_right,#25D366,#25D366,#1FA855)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]`}>
                                <div className='bg-[#fff] text-white rounded-full px-8 py-3.5 flex items-center gap-3'>
                                    <span className='font-bold text-lg bg-[linear-gradient(to_right,#1FA855,#25D366,#25D366)] inline-block text-transparent bg-clip-text'>Whatsapp</span>
                                </div>
                            </button>
                        </div>
                    </a>
                    
                </div>
            </div>

        </div>
      </section>
        <Footer/>
    </div>
  );
}