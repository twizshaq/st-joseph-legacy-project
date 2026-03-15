import React from 'react';

const TourDetailsSkeleton = () => {
  return (
    <div className="mt-8 w-[1500px] max-w-[95vw] animate-pulse">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
        <div className="w-full">
          <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-[43px] border-[3px] border-white bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_35%,#e5e7eb_100%)] shadow-[0px_-10px_20px_rgba(0,0,0,0.12)] md:h-[450px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),transparent_30%,rgba(0,0,0,0.16)_100%)]" />

            <div className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-[2.5px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] backdrop-blur-[3px]">
              <div className="h-[32px] w-[68px] rounded-full bg-black/35" />
            </div>

            <div className="absolute left-[1vw] top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-[2.5px] shadow-[0px_0px_15px_rgba(0,0,0,0.2)] backdrop-blur-[5px] md:block">
              <div className="h-[50px] w-[50px] rounded-full bg-black/35" />
            </div>

            <div className="absolute right-[1vw] top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-[2.5px] shadow-[0px_0px_15px_rgba(0,0,0,0.2)] backdrop-blur-[5px] md:block">
              <div className="h-[50px] w-[50px] rounded-full bg-black/35" />
            </div>

            <div className="absolute bottom-0 z-10 h-[170px] w-full rounded-b-[40px] bg-black/25 [mask-image:linear-gradient(to_top,black_45%,transparent)]" />
            <div className="absolute bottom-0 z-20 w-full p-5">
              <div className="mb-3 h-[34px] w-[45%] rounded-full bg-white/35 max-sm:w-[70%]" />
              <div className="flex gap-2">
                <div className="rounded-full bg-white/15 p-[2.5px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] backdrop-blur-[3px]">
                  <div className="h-[30px] w-[108px] rounded-full bg-black/35" />
                </div>
                <div className="rounded-full bg-white/15 p-[2.5px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] backdrop-blur-[3px]">
                  <div className="h-[30px] w-[96px] rounded-full bg-black/25" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-[10px]">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`rounded-full ${item === 1 ? 'h-[9px] w-[28px] bg-white/75' : 'h-[9px] w-[9px] bg-white/45'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="rounded-[40px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)] lg:p-8">
              <div className="mb-4 h-6 w-36 rounded-full bg-gray-200" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-full bg-gray-200" />
                <div className="h-4 w-full rounded-full bg-gray-200" />
                <div className="h-4 w-[88%] rounded-full bg-gray-200" />
                <div className="h-4 w-[72%] rounded-full bg-gray-200" />
              </div>
            </div>

            <div className="rounded-[40px] bg-[#f2f2f2] p-6 lg:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-300" />
                <div className="h-6 w-44 rounded-full bg-gray-300" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full rounded-tr-none bg-[#004c08]/80" />
                <div className="h-5 w-40 rounded-full bg-[#004c08]/20" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-2.5 w-16 rounded-full bg-[#004c08]/70" />
                <div className="h-2.5 w-16 rounded-full bg-[#2e7d32]/50" />
                <div className="h-2.5 w-16 rounded-full bg-[#8bc34a]/40" />
              </div>
            </div>

            <div className="overflow-hidden rounded-[40px] border border-[#e5e7eb] bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
              <div className="h-[280px] w-full bg-[linear-gradient(135deg,#dbeafe_0%,#e5e7eb_45%,#dcfce7_100%)]" />
              <div className="border-t border-gray-200 p-5">
                <div className="mb-4 h-5 w-32 rounded-full bg-gray-200" />
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  <div className="h-16 rounded-[24px] bg-gray-100" />
                  <div className="h-16 rounded-[24px] bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-[450px]">
          <div className="sticky top-10">
            <div className="w-full rounded-[50px] bg-white p-4 shadow-[0px_0px_15px_rgba(0,0,0,.07)] md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#dbeafe]" />
                <div className="h-8 w-52 rounded-full bg-gray-200" />
              </div>

              <div className="mb-4 flex rounded-[27px] bg-[#F2F2F2] p-[5px]">
                <div className="h-[52px] flex-1 rounded-[23px] bg-[#007BFF]" />
                <div className="h-[52px] flex-1 rounded-[23px] bg-transparent" />
              </div>

              <div className="mb-6 h-4 w-[78%] rounded-full bg-gray-200" />

              <div className="mb-4 h-5 w-28 rounded-full bg-gray-200" />
              <div className="mb-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-[30px] bg-[#F2F2F2] p-4">
                    <div className="space-y-2">
                      <div className="h-4 w-28 rounded-full bg-gray-300" />
                      <div className="h-3 w-20 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-[12px] bg-black/10" />
                      <div className="h-4 w-4 rounded-full bg-gray-300" />
                      <div className="h-8 w-8 rounded-[12px] bg-black/10" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="mb-2 h-4 w-24 rounded-full bg-gray-200" />
                <div className="relative rounded-[32px] bg-[#F2F2F2] p-[7px]">
                  <div className="h-[50px] w-full rounded-[22px] bg-transparent" />
                  <div className="absolute right-[7px] top-[7px] h-[50px] w-[120px] rounded-full bg-[#007BFF]" />
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="h-[54px] w-full rounded-[21px] bg-[#F2F2F2]" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="h-[54px] w-full rounded-[21px] bg-[#F2F2F2]" />
                  <div className="h-[54px] w-full rounded-[21px] bg-[#F2F2F2]" />
                </div>
                <div className="h-[58px] w-full rounded-[21px] bg-[#F2F2F2]" />
                <div className="h-[92px] w-full rounded-[23px] bg-[#F2F2F2]" />
              </div>

              <div className="rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2.7px] shadow-md">
                <div className="h-[58px] w-full rounded-full bg-[linear-gradient(to_left,#007BFF,#66B2FF)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsSkeleton;
