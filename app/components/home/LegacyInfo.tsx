import React from 'react';
import Image from 'next/image';
import { HeartIcon } from '@/public/icons/heart-icon';
// import { InfoIcon } from '@/public/icons/info-icon';
import cameraIcon from '@/public/icons/camera-icon.svg';
import InfoIcon from '@/public/icons/info-icon';

export default function LegacyInfo() {
    return (
        <div className="w-[90vw] max-w-[1500px] text-slate-800 mx-auto mt-[70px] max-sm:mt-[20px] pb-20">

            {/* --- TOP SECTION: Split Grid (Text Left | Images Right) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-[80px]">

                {/* LEFT COLUMN: Copy & List */}
                <div className="flex flex-col text-left max-sm:text-center items-start max-sm:items-center">
                    <h2 className="font-bold text-[2rem] max-sm:text-[1.5rem] mb-[14px]">
                        Unveiling Our Legacy
                    </h2>
                    <p className="max-w-[650px] text-slate-600 leading-relaxed mb-8">
                        &quot;Unveiling Our Legacy&quot; is a community initiative led by the St. Joseph District Emergency Organisation (DEO). We have mapped key landmarks across the parish, from the Parris Hill Mural to historic churches and natural wonders. It is time for you to unlock:
                    </p>

                    {/* Feature List (Mobile & Desktop Aligned) */}
                    <ol className="space-y-8 max-w-[600px] w-full text-left list-none">
                        <li className="flex items-start gap-3">
                            <span className="w-[44px] h-[44px] shrink-0 rounded-[16px] bg-[#EAF4FF] flex items-center justify-center shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                <Image src={cameraIcon} alt="Camera" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="font-extrabold text-slate-900 text-lg leading-tight">
                                    Our Culture
                                </p>
                                <p className="text-slate-600">
                                    Dive deep into the stories that make St. Joseph unique.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="w-[44px] h-[44px] shrink-0 rounded-[16px] bg-[#EAF4FF] flex items-center justify-center shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                <HeartIcon size={24} color="#007BFF" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="font-extrabold text-slate-900 text-lg leading-tight">
                                    Our Community
                                </p>
                                <p className="text-slate-600">
                                    Hear the voices of the community and learn directly from them. Join a network of neighbours, artists, and businesses working together to keep St. Joseph safe and thriving.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="w-[44px] h-[44px] shrink-0 rounded-[16px] bg-[#EAF4FF] flex items-center justify-center shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                <InfoIcon size={24} color="#007BFF" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="font-extrabold text-slate-900 text-lg leading-tight">
                                    Build Resilience
                                </p>
                                <p className="text-slate-600">
                                    Don’t just look at the land — understand it. Access critical data on local hazards, coastal risks, and disaster-management tips specific to each location.
                                </p>
                            </div>
                        </li>
                    </ol>

                </div>

                {/* RIGHT COLUMN: Original Collage (Exact styling restoration) */}
                <div className="relative w-full max-w-[560px] aspect-[14/13] mx-auto bg-red-500/0 mt-12">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 pointer-events-none opacity-50">
                            <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
                            <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
                            <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
                            <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
                        </div>
                    </div>

                    {/* Image 1 (Bathsheba) */}
                    <div className="absolute w-[41%] h-[58%] top-[2%] right-[9%] rotate-[12deg] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.04] hover:rotate-[14deg] active:scale-[0.96] active:rotate-[10deg]">
                        <div className="relative w-full h-full rounded-[50px] max-sm:rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG"}
                                alt='Bathsheba'
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Image 2 (Joes River Bridge 2) */}
                    <div className="absolute w-[48%] h-[44%] top-[22%] left-[4%] -rotate-[10deg] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.04] hover:-rotate-[12deg] active:scale-[0.96] active:-rotate-[8deg]">
                        <div className="relative w-full h-full rounded-[50px] max-sm:rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG"}
                                alt='Bridge 2'
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Image 3 (Joes River Bridge 1) */}
                    <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[16%] -rotate-[2deg] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.04] hover:rotate-0 active:scale-[0.96] active:-rotate-[4deg]">
                        <div className="relative w-full h-full rounded-[50px] max-sm:rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-1.JPG"}
                                alt='Bridge 1'
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* --- BOTTOM SECTION: The Journey Cards --- */}
            <div className="flex flex-col items-center text-center">
                <p className="font-[800] text-[1.1rem] md:text-[1.2rem] mt-[20px] max-w-[800px]">
                    Come Take A Tour With Us — Your Journey Through St. Joseph Is Just a Scan Away
                </p>

                <div className="relative mt-10 w-full max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

                        {/* STEP 1 */}
                        <div
                            className="group cursor-pointer rounded-[52px] p-[3px]
                 shadow-[0px_0px_20px_rgba(0,0,0,.1)]
                 transition-all duration-300 hover:-translate-y-1 active:scale-[.98]"
                            style={{ background: 'linear-gradient(135deg, #EAF4FF 0%, #CFE6FF 100%)' }}
                        >
                            <div className="relative h-full rounded-[50px] bg-white/80 p-7 overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(#66B2FF 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                    }}
                                />

                                <div className="relative z-10 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[44px] h-[44px] rounded-[16px] bg-[#EAF4FF]
                            flex items-center justify-center
                            shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                            <span className="text-[#007BFF] font-black">1</span>
                                        </div>
                                        <div>
                                            <p className="text-[0.7rem] font-extrabold tracking-[0.22em] text-[#007BFF]">STEP 1</p>
                                            <h4 className="font-extrabold text-[1.15rem] text-slate-900 leading-tight">
                                                Find a Landmark
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full
                          bg-[#EAF4FF] border border-[#66B2FF]/40
                          text-[#007BFF] text-[0.72rem] font-extrabold">
                                        In-person
                                    </div>
                                </div>

                                <p>
                                    Find an official Unveiling Our Legacy sign at a key historical, cultural, or scenic spot in St. Joseph.
                                </p>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div
                            className="group cursor-pointer rounded-[52px] p-[3px]
                 shadow-[0px_0px_20px_rgba(0,0,0,.1)]
                 transition-all duration-300 hover:-translate-y-1 active:scale-[.98]"
                            style={{ background: 'linear-gradient(135deg, #EAF4FF 0%, #CFE6FF 100%)' }}
                        >
                            <div className="relative h-full rounded-[50px] bg-white/80 p-7 overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(#66B2FF 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                    }}
                                />

                                <div className="relative z-10 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[44px] h-[44px] rounded-[16px] bg-[#EAF4FF]
                            flex items-center justify-center
                            shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                            <span className="text-[#007BFF] font-black">2</span>
                                        </div>
                                        <div>
                                            <p className="text-[0.7rem] font-extrabold tracking-[0.22em] text-[#007BFF]">STEP 2</p>
                                            <h4 className="font-extrabold text-[1.15rem] text-slate-900 leading-tight">
                                                Scan the QR Code
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full
                          bg-[#EAF4FF] border border-[#66B2FF]/40
                          text-[#007BFF] text-[0.72rem] font-extrabold">
                                        No app
                                    </div>
                                </div>
                                <p> Open your camera, scan the QR code, and tap the link —
                                    <span className="font-extrabold"> no app needed</span>.
                                </p>
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div
                            className="group cursor-pointer rounded-[52px] p-[3px]
                 shadow-[0px_0px_20px_rgba(0,0,0,.1)]
                 transition-all duration-300 hover:-translate-y-1 active:scale-[.98]"
                            style={{ background: 'linear-gradient(135deg, #EAF4FF 0%, #CFE6FF 100%)' }}
                        >
                            <div className="relative h-full rounded-[50px] bg-white/80 p-7 overflow-hidden">
                                <div
                                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(#66B2FF 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                    }}
                                />

                                <div className="relative z-10 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[44px] h-[44px] rounded-[16px] bg-[#EAF4FF]
                            flex items-center justify-center
                            shadow-[0_10px_25px_rgba(0,123,255,0.10)]">
                                            <span className="text-[#007BFF] font-black">3</span>
                                        </div>
                                        <div>
                                            <p className="text-[0.7rem] font-extrabold tracking-[0.22em] text-[#007BFF]">STEP 3</p>
                                            <h4 className="font-extrabold text-[1.15rem] text-slate-900 leading-tight">
                                                Explore &amp; Prepare
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full
                          bg-[#EAF4FF] border border-[#66B2FF]/40
                          text-[#007BFF] text-[0.72rem] font-extrabold">
                                        Be ready
                                    </div>
                                </div>

                                <ul className="relative z-10 space-y-2">
                                    <li className="flex items-start gap-2 tex/t-[0.95rem] text-slate-900 ">
                                        <span className="mt-[7px] w-[7px] h-[7px] rounded-full bg-[#66B2FF] shrink-0" />
                                        Learn the story of the location
                                    </li>
                                    <li className="flex items-start gap-2 te/xt-[0.95rem] text-slate-900 ">
                                        <span className="mt-[7px] w-[7px] h-[7px] rounded-full bg-[#66B2FF] shrink-0" />
                                        View local safety &amp; resilience data
                                    </li>
                                    <li className="flex items-start gap-2 tex/t-[0.95rem] text-slate-900 ">
                                        <span className="mt-[7px] w-[7px] h-[7px] rounded-full bg-[#66B2FF] shrink-0" />
                                        Find nearby emergency shelters
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="mt-12 w-full max-w-[800px]">
                    <p className="font-extrabold text-[1.05rem] mb-2 text-slate-900">Can’t make it in person?</p>
                    <p className="text-slate-600 leading-relaxed">
                        You don’t have to be in St. Joseph to experience the magic. Use our Virtual Map on the website to tap any landmark and access the same stories and safety resources from anywhere.
                    </p>
                </div>
            </div>
        </div>
    );
}
