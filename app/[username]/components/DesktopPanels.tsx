"use client";

import { useState } from "react";
import { BadgeDetailsModal, BadgeTile, useBucketBadges } from "./Badges";
import type { BadgeItem } from "../types";

const DesktopBadgesPanel = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const badges = useBucketBadges();

  return (
    <>
      <div className="w-[350px] rounded-[40px] p-4 pt-3">
        <h3 className="mb-3 ml-[4px] text-[22px] font-semibold text-slate-800">Badges</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {badges.map((badge) => (
            <BadgeTile key={badge.id} badge={badge} onSelect={setSelectedBadge} compact />
          ))}
        </div>
      </div>
      <BadgeDetailsModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </>
  );
};

export { DesktopBadgesPanel };
