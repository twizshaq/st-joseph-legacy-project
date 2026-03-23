"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { activityData, toursData } from "../data";
import type { ProfileTab } from "../types";
import { ActivityCard } from "./ActivityCard";
import { BadgesGrid } from "./Badges";
import { DesktopMediaGrid, MobileMediaGrid } from "./MediaGrids";
import { TourCard } from "./TourCard";

export interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  userAvatarUrl: string;
}

export const ProfileTabs = ({ activeTab, onTabChange, userAvatarUrl }: ProfileTabsProps) => {
  const desktopTab = useMemo(() => (activeTab === "Media" || activeTab === "Tours" ? activeTab : "All"), [activeTab]);

  return (
    <>
      <div className="hidden min-[971px]:grid min-[971px]:grid-cols-[minmax(0,1fr)_0px] min-[971px]:gap-0">
        <div className="w-full bg-blue-500/0">
          <div className="mt-4 border-b border-slate-200">
            <div className="flex items-center gap-8">
              <button
                onClick={() => onTabChange("All")}
                className={`relative flex h-12 items-center active:scale-[.98] cursor-pointer px-1 text-[15px] font-semibold transition-colors ${desktopTab === "All" ? "text-[#007BFF]" : "text-slate-500 hover:text-slate-600"}`}
              >
                Activity
                {desktopTab === "All" ? <div className="absolute bottom-0 left-1/2 h-[3px] w-full -translate-x-1/2 rounded-full bg-[#007BFF]" /> : null}
              </button>
              <button
                onClick={() => onTabChange("Media")}
                className={`relative flex h-12 items-center active:scale-[.98] cursor-pointer gap-1 px-1 text-[15px] font-semibold transition-colors ${desktopTab === "Media" ? "text-[#007BFF]" : "text-slate-500 hover:text-slate-600"}`}
              >
                Media
                {desktopTab === "Media" ? <ChevronDown size={16} /> : null}
                {desktopTab === "Media" ? <div className="absolute bottom-0 left-1/2 h-[3px] w-full -translate-x-1/2 rounded-full bg-[#007BFF]" /> : null}
              </button>
              <button
                onClick={() => onTabChange("Tours")}
                className={`relative flex h-12 items-center active:scale-[.98] cursor-pointer px-1 text-[15px] font-semibold transition-colors ${desktopTab === "Tours" ? "text-[#007BFF]" : "text-slate-500 hover:text-slate-600"}`}
              >
                Tours
                {desktopTab === "Tours" ? <div className="absolute bottom-0 left-1/2 h-[3px] w-full -translate-x-1/2 rounded-full bg-[#007BFF]" /> : null}
              </button>
            </div>
          </div>

          <div className="mt-6">
            {desktopTab === "Media" ? (
              <DesktopMediaGrid />
            ) : desktopTab === "Tours" ? (
              <div className="flex flex-col gap-3 bg-red-500/0">
                {toursData.map((tour) => (
                  <TourCard key={`desktop-tour-${tour.id}`} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {activityData.map((section) => (
                  <div key={section.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[20px] font-semibold text-slate-800">{section.label}</h3>
                    </div>
                    {section.items.map((item, index) => (
                      <ActivityCard key={`${section.label}-${index}`} item={item} userAvatarUrl={userAvatarUrl} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-[971px]:hidden">
        <div className="mt-6 border-b border-slate-200 bg-red-50/0">
          <div className="flex w-full items-center">
            {(["All", "Media", "Badges", "Tours"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative flex h-12 flex-1 items-center justify-center text-sm font-semibold transition-colors active:scale-[.98] ${activeTab === tab ? "text-[#007BFF]" : "text-slate-500 hover:text-slate-800"}`}
              >
                <span className="inline-flex items-center gap-0">
                  {tab === "All" ? "Activity" : tab}
                  {tab === "Media" && activeTab === "Media" ? <ChevronDown size={20} className="mr-[-10px]" /> : null}
                </span>
                {activeTab === tab ? <div className="absolute bottom-0 left-1/2 h-[3px] w-[calc(100%-16px)] max-w-[56px] -translate-x-1/2 rounded-full bg-[#007BFF]" /> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "All" ? (
            <div className="space-y-7">
              {activityData.map((section) => (
                <div key={section.label} className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{section.label}</h3>
                  {section.items.map((item, index) => (
                    <ActivityCard key={`${section.label}-mobile-${index}`} item={item} userAvatarUrl={userAvatarUrl} compact />
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "Tours" ? (
            <div className="flex flex-col gap-3 bg-red-500/0">
              {toursData.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : null}

          {activeTab === "Badges" ? <BadgesGrid /> : null}
          {activeTab === "Media" ? <MobileMediaGrid /> : null}
        </div>
      </div>
    </>
  );
};
