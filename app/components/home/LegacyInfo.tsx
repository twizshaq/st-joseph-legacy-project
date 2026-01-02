import React from 'react';

export default function LegacyInfo() {
    return (
        <div className="w-[90vw] max-w-[1500px] mx-auto mt-[70px] max-sm:mt-[-50px] flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* LEFT: Copy */}
            <div className="flex-1 max-w-[700px] max-sm:mt-[100px] flex flex-col">
                <h2 className="font-bold text-[2rem] max-sm:text-[1.5rem] mb-[14px] mt-[]">Unveiling Our Legacy</h2>
                <p className="max-w-[1000px]">
                    &quot;Unveiling Our Legacy&quot; is a community initiative led by the St. Joseph District Emergency Organisation (DEO). We have mapped key landmarks across the parish, from the Parris Hill Mural to historic churches and natural wonders. It is time for you to unlock:
                </p>
                <br />
                <div className="list-disc pl-6 md:pl-12 space-y-2">
                    <li>
                        <b>Our Culture:</b> Dive deep into the stories that make St. Joseph unique.
                    </li>
                    <li>
                        <b>Our Community:</b> Hear the voices of the community and learn directly from them. Join a network of neighbours, artists, and businesses working together to keep St. Joseph safe and thriving.
                    </li>
                    <li>
                        <b>Build Resilience:</b> Don&apos;t just look at the land, understand it. Critical data on local hazards (land slippage, coastal risks) and disaster management tips specific to that spot.
                    </li>
                </div>

                {/* Mobile-Only Collage */}
                <div className="block lg:hidden relative max-w-[90vw] w-[560px] bg-red-500/0 aspect-[14/13] self-center my-12 max-sm:right-[14px]">
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
                        <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
                        <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
                        <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
                    </div>
                    <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
                        <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                    </div>
                    <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
                        <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_2px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                    </div>
                    <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
                        <div className="relative w-full h-full rounded-[30px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                    </div>
                </div>

                {/* <h3 className="font-bold text-[2rem] max-sm:text-[1.5rem] mt-8 mb-2">About</h3>
                <p className="">
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="mt-4">
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <p className="mt-6">With some of the popular attractions being</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Tent Bay</li>
                    <li>Soup Bowl</li>
                    <li>Flower Forest Botanical Gardens</li>
                    <li>Andromeda Gardens</li>
                    <li>Hunte&apos;s Gardens</li>
                    <li>Cotton Tower Signal Station</li>
                </ul> */}
            </div>

            {/* RIGHT: Desktop-Only Collage */}
            <div className="hidden lg:block relative flex-1 w-full max-w-[560px] aspect-[14/13] self-center my-12 lg:my-0">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
                        <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
                        <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
                        <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
                    </div>
                </div>
                <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                </div>
                <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                </div>
                <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50" />
                </div>
            </div>
        </div>
    );
}