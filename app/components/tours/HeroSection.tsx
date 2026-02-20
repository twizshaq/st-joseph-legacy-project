import React from 'react';

const HeroSection = () => {
    return (
        <section className="relative w-full overflow-hidden max-w-[1500px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,123,255,0.03)_0%,rgba(250,250,250,0)_100%)] pointer-events-none" />
            <div className="relative w-[90vw] max-w-[1500px] px-6 mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 max-w-[700px] max-sm:mt-[-60px] flex flex-col">
                        <div className="w-full bg-red-500/0 flex flex-col order-2 lg:order-1 text-center lg:text-left">
                            <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.03] mb-6">
                                <span className="text-[12px] font-semibold font-sans up/percase tracking-[0.12em] text-black/40">Exclusive Experiences</span>
                            </div>
                            <h1 className="text-[3.5rem] md:text-[3.3rem] font-bold leading-[0.95] tracking-tight text-black">
                                St.Joseph&apos;s Hidden Wonders: <br /><span className="text-black/40">Resilience, Culture & History</span>
                            </h1>
                            <p className="mt-8 text-[1rem] text-slate-800 leading-relaxed max-w-[700px] mx-auto lg:mx-0">
                                Journey through the rugged beauty of Barbados with our guided expeditions. Our curated tours take you through secret trails, dramatic coastal cliffs, and the forgotten history of the island’s most untamed parish. Discover how <b>St. Joseph</b> manages its unique geological challenges while preserving its rich Bajan heritage. Get to learn our community from persons in the community. <br /> <br /> We <b>specialize in small group tours</b>  to ensure a personalized and low-impact experience. Explore our three signature tour options below and book your journey today.<br /> <br /> Your journey supports the community. <b>10% of every booking fee</b> goes directly to the <b>St. Joseph District Emergency Organization (DEO)</b>, helping to fund local disaster preparedness and community safety initiatives.
                            </p>
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
            </div>
        </section>
    );
};

export default HeroSection;
