"use client";

import { useState } from "react";
import Image from "next/image";
import ArrowIcon from "@/public/icons/arrow-icon";
import type { TourItem } from "../types";

const getTourBadgeClass = (tour: TourItem) => {
  if (tour.status === "Completed") return "text-[#00A835] border-[#00A835] bg-[#00FF03]/20";
  if (tour.status === "Active") return "text-[#208BFF] border-[#208BFF] bg-[#208BFF]/20";
  return "text-[#FFA000] border-[#FFA000] bg-[#FFA000]/20";
};

export const TourCard = ({ tour }: { tour: TourItem }) => {
  const badgeLabel = tour.status === "Completed" ? "Completed" : tour.type;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsExpanded((v) => !v)}
      aria-expanded={isExpanded}
      className="w-full cursor-pointer rounded-[40px] border-[2.5px] border-white bg-black/5 p-[2px] text-left shadow-[0px_0px_30px_rgba(0,0,0,0.08)] active:scale-[.99]"
    >
      <div className="group overflow-hidden rounded-[33px]">
        <div className="flex gap-3 p-2">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[27px]">
            <Image src={tour.image} alt={tour.title} fill className="object-cover" />
          </div>
          <div className="relative flex flex-1 flex-col py-1 pr-2">
            <div className="mb-1 flex items-start justify-between">
              {/* <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getTourBadgeClass(tour)}`}>
                {badgeLabel}
              </span> */}
              <span className="mr-[3px] mt-[3px] text-[12px] font-bold text-slate-500">{tour.date}</span>
            </div>
            <h3 className="mt-1 line-clamp-2 max-w-[200px] text-[1rem] font-bold leading-tight text-slate-800">{tour.title}</h3>
            <div className="absolute bottom-0 right-[10px] flex">
              <span className={"rotate-[180deg] text-slate-400 transition-transform duration-200 " + (isExpanded ? "rotate-0" : "rotate-[180deg]")} aria-hidden="true">
                <ArrowIcon color="#1E293B" />
              </span>
            </div>
          </div>
        </div>
        <div className={"grid transition-[grid-template-rows,opacity] duration-250 ease-out " + (isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="min-h-0 overflow-hidden">
            <div className="px-4 pb-4">
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-extrabold text-slate-700">Status: {tour.status}</span>
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-extrabold text-slate-700">Type: {tour.type}</span>
                </div>
                <p className="mt-3 text-[13px] font-semibold leading-relaxed text-slate-700">Explore this route with curated stops, photo moments, and local highlights.</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-slate-500">Estimated time: 45–90 mins</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#007BFF]/10 px-3 py-1 text-[12px] font-extrabold text-[#007BFF]">View details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};
