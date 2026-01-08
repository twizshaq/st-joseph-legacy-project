import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,123,255,0.03)_0%,rgba(250,250,250,0)_100%)] pointer-events-none" />
      <div className="relative w-full max-w-[1400px] px-6 mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center self-center lg:self-start px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.03] mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Exclusive Experiences</span>
            </div>
            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[3rem] font-bold leading-[0.95] tracking-tighter text-black">
              St.Joseph's Hidden Wonders: <br /><span className="text-black/40">Resilience, Culture & History.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-black/60 leading-relaxed max-w-[500px] mx-auto lg:mx-0">
              Journey through the rugged beauty of Barbados with our guided expeditions. Our curated tours take you through secret trails, dramatic coastal cliffs, and the forgotten history of the island’s most untamed parish. Discover how St. Joseph manages its unique geological challenges while preserving its rich Bajan heritage. Get to learn our community from persons in the community <br/> <br/>
We specialize in small group tours to ensure a personalized and low-impact experience. Explore our three signature tour options below and book your journey today. <br/> <br/>
Your journey supports the community. 10% of every booking fee goes directly to the St. Joseph District Emergency Organization (DEO), helping to fund local disaster preparedness and community safety initiatives.
            </p>
          </div>

          {/* Abstract Image Grid */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative grid grid-cols-12 gap-4 h-[280px] sm:h-[350px] md:h-[550px]">
              <div className="col-span-7 h-full relative rounded-[50px] md:rounded-[5rem] overflow-hidden ring-1 ring-black/5 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-blue-500" />
              </div>
              <div className="col-span-5 flex flex-col gap-4">
                <div className="h-[60%] relative rounded-[40px] md:rounded-[5rem] overflow-hidden ring-1 ring-black/5">
                  <div className="absolute inset-0 bg-blue-500" />
                </div>
                <div className="h-[40%] relative rounded-[35px] md:rounded-[4.2rem] overflow-hidden bg-blue-500 shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
                  <div className="absolute inset-0 opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;