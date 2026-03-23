"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BadgeItem } from "../types";

const BADGE_BUCKET = "badges";
type BadgeFile = {
  name: string;
};

const formatBadgeName = (fileName: string) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const useBucketBadges = () => {
  const [bucketBadges, setBucketBadges] = useState<BadgeItem[]>([]);
  const latestRequestRef = useRef(0);
  const supabase = createClient();

  const fetchBadges = useCallback(async () => {
      const requestId = ++latestRequestRef.current;
      const { data, error } = await supabase.storage.from(BADGE_BUCKET).list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

      if (error || !data) {
        console.error("Failed to list badges bucket", error);
        return;
      }

      const files = (data as BadgeFile[]).filter((item: BadgeFile) =>
        /\.(png|webp|jpg|jpeg)$/i.test(item.name)
      );

      const mappedBadges = files.map((file: BadgeFile, index: number) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BADGE_BUCKET).getPublicUrl(file.name);

        return {
          id: index + 1,
          name: formatBadgeName(file.name),
          icon: "🏅",
          imageUrl: publicUrl,
          desc: `Badge asset loaded from the ${BADGE_BUCKET} bucket.`,
          unlocked: true,
        } satisfies BadgeItem;
      });

      if (latestRequestRef.current === requestId) {
        setBucketBadges(mappedBadges);
      }
  }, [supabase]);

  useEffect(() => {
    const refreshBadges = () => {
      void fetchBadges();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshBadges();
      }
    };

    const handleFocus = () => refreshBadges();
    const handlePageShow = () => refreshBadges();
    const handleOnline = () => refreshBadges();

    refreshBadges();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchBadges]);

  return bucketBadges;
};

export const BadgeTile = ({
  badge,
  onSelect,
  compact = false,
}: {
  badge: BadgeItem;
  onSelect: (badge: BadgeItem) => void;
  compact?: boolean;
}) => (
  <button
    type="button"
    onClick={() => onSelect(badge)}
    className="group relative flex aspect-square w-full items-center justify-center transition-transform active:scale-[.98]"
  >
    {badge.imageUrl ? (
      <div className="relative h-full w-full transition-transform duration-150">
        <Image src={badge.imageUrl} alt={badge.name} fill className="object-contain scale-[1.3]" unoptimized />
      </div>
    ) : (
      <span className={"relative leading-none transition-transform duration-150 group-hover:scale-[1.06] " + (compact ? "text-[48px]" : "text-[66px]")}>
        {badge.icon}
      </span>
    )}
  </button>
);

export const BadgeDetailsModal = ({
  badge,
  onClose,
}: {
  badge: BadgeItem | null;
  onClose: () => void;
}) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-[520px] overflow-hidden rounded-[34px] border-[2.5px] border-white bg-white/80 shadow-[0px_0px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-[64px] w-[64px] items-center justify-center">
              {badge.imageUrl ? (
                <div className="relative h-[52px] w-[52px]">
                  <Image src={badge.imageUrl} alt={badge.name} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <span className="relative text-[42px] leading-none">{badge.icon}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[18px] font-black text-slate-800">{badge.name}</h3>
              <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{badge.date ? `Unlocked ${badge.date}` : "Loaded from storage"}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[12px] font-extrabold text-slate-700 shadow-[0px_0px_12px_rgba(0,0,0,0.10)] hover:bg-white">
            Close
          </button>
        </div>
        <div className="px-5 pb-5">
          <div className="rounded-[26px] border border-white/70 bg-slate-50/70 px-4 py-4">
            <p className="text-[14px] font-semibold leading-relaxed text-slate-700">{badge.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BadgesGrid = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const badges = useBucketBadges();

  return (
    <>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {badges.map((badge) => (
          <BadgeTile key={badge.id} badge={badge} onSelect={setSelectedBadge} />
        ))}
      </div>
      <BadgeDetailsModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </>
  );
};
