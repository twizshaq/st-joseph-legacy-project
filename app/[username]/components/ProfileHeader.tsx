"use client";

import Image from "next/image";
import { Settings } from "lucide-react";
import type { UserProfile } from "../types";
import DevVerifiedBadge from "@/public/icons/verified-icon";

export interface ProfileHeaderProps {
  profile: UserProfile | null;
  displayUsername: string;
  userAvatarUrl: string;
  isOwnProfile: boolean;
  badgeCount: number;
  mediaCount: number;
  onOpenSettings: () => void;
}

export const ProfileHeader = ({
  profile,
  displayUsername,
  userAvatarUrl,
  isOwnProfile,
  badgeCount,
  mediaCount,
  onOpenSettings,
}: ProfileHeaderProps) => {
  return (
    <div className="relative rounded-[32px] bg-transparent p-0 shadow-none">
      <div className="flex items-start gap-4">
        <div className="relative max-sm:h-[90px] max-sm:w-[90px] h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
          <Image src={userAvatarUrl} alt="User avatar" fill className="object-cover" unoptimized />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 bg-red-500/0">
            <div className="min-w-0 flex items-center gap-[5px] bg-green-500/0">
              <h1 className="truncate text-[27px] font-bold text-[#1e293b]">{profile?.username || displayUsername}</h1>
              <DevVerifiedBadge />
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <button onClick={onOpenSettings} className="rounded-full p-1.5 h-[40px] flex items-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Open settings">
                  <Settings size={25} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-500/0 w-[95%] max-w-[300px] max-sm:max-w-[90vw] mt-1">
            <p className="flex flex-col font-medium text-slate-700 text-[.9rem] text-center gap-[0px]">
              <span className="font-bold">#1</span> Rank
            </p>
            <div className="rounded-full h-[15px] w-[2px] bg-black/7" />
            <p className="flex flex-col font-medium text-slate-700 text-[.9rem] text-center gap-[0px]">
              <span className="font-bold">{badgeCount}</span> Badges
            </p>
            <div className="rounded-full h-[15px] w-[2px] bg-black/7" />
            <p className="flex flex-col font-medium text-slate-700 text-[.9rem] text-center gap-[0px]">
              <span className="font-bold">{mediaCount}</span> Media
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed font-[500] text-slate-700">{profile?.bio || ""}</p>
      {/* <div className="mt-4 h-[2px] bg-black/5" /> */}
    </div>
  );
};
