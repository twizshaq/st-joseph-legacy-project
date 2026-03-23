"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowIcon from "@/public/icons/arrow-icon";
import type { ActivityItem } from "../types";

export const ActivityCard = ({ item, userAvatarUrl, compact = false }: { item: ActivityItem; userAvatarUrl: string; compact?: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollMedia = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const handleMediaScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const atLeft = element.scrollLeft <= 2;
    const atRight = Math.ceil(element.scrollLeft + element.clientWidth) >= element.scrollWidth - 2;

    setCanScrollLeft(!atLeft);
    setCanScrollRight(!atRight);
  }, []);

  useEffect(() => {
    handleMediaScroll();
    window.addEventListener("resize", handleMediaScroll);

    return () => window.removeEventListener("resize", handleMediaScroll);
  }, [handleMediaScroll, item.images]);

  return (
    <div className={`rounded-[33px] border-[2.5px] bg-black/3 shadow-[0px_0px_10px_rgba(0,0,0,.08)] border-white transition-colors ${compact ? "px-3.5 py-3.5" : "px-4 py-4"}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#007BFF] to-[#66B2FF] p-[1.7px]`}>
                  <div className='bg-white rounded-full w-full h-full overflow-hidden relative'>
                    <Image
                      key={userAvatarUrl}
                      src={userAvatarUrl}
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <h4 className={`leading-tight text-slate-800 ${compact ? "text-[15px] font-semibold" : "text-[17px] font-semibold"}`}>{item.title}</h4>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 font-semibold text-slate-600 ${compact ? "text-[11px]" : "text-[12px]"}`}>+{item.points} pts</span>
          </div>

          {item.subtitle ? <p className={`mt-1.5 pr-2 leading-relaxed text-slate-500 ${compact ? "text-[12px]" : "text-[13px]"}`}>{item.subtitle}</p> : null}


          {item.images?.length ? (
            <div className="relative mt-3">
              <div className={`pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-6 bg-[#f7f7f7] [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 md:block ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
              <div className={`pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-6 rotate-180 bg-[#f7f7f7] [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 md:block ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

              <div className={`absolute left-[-7px] top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-[2.5px] shadow-[0px_0px_15px_rgba(0,0,0,0.18)] backdrop-blur-[5px] transition-all duration-100 md:flex ${canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <button
                  type="button"
                  onClick={() => scrollMedia("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll uploaded media left"
                  className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-black/40"
                >
                  <span className="-rotate-90 mr-[2px] flex scale-[1.05] items-center justify-center text-white">
                    <ArrowIcon width={24} height={24} />
                  </span>
                </button>
              </div>

              <div className={`absolute right-[-7px] top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-[2.5px] shadow-[0px_0px_15px_rgba(0,0,0,0.18)] backdrop-blur-[5px] transition-all duration-100 md:flex ${canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <button
                  type="button"
                  onClick={() => scrollMedia("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll uploaded media right"
                  className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-black/40"
                >
                  <span className="ml-[2px] rotate-90 flex scale-[1.05] items-center justify-center text-white">
                    <ArrowIcon width={24} height={24} />
                  </span>
                </button>
              </div>

              <div ref={scrollRef} onScroll={handleMediaScroll} className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 scroll-smooth">
                {item.images.map((src, index) => (
                  <div key={`${src}-${index}`} className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[18px] md:h-[112px] md:w-[112px]">
                    <Image src={src} alt="Uploaded media" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
