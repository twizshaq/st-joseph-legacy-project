"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Facebook,
  Github,
  Image as ImageIcon,
  Instagram,
  Lock,
  MapPin,
  Settings,
  Trophy,
  Youtube,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Navigation from "@/app/components/ProfileNav";
import SettingsModal from "@/app/components/SettingsModal";
import ArrowIcon from "@/public/icons/arrow-icon";
import { div } from "@tensorflow/tfjs";
import DevIcon from '@/public/icons/dev-icon'

type ProfileTab = "All" | "Tours" | "Badges" | "Media";

interface ActivityItem {
  type: "rank" | "visit" | "upload";
  title: string;
  subtitle?: string;
  points: number;
  images?: string[];
}

interface ActivitySection {
  label: string;
  items: ActivityItem[];
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  is_private: boolean;
}

interface TourItem {
  id: number;
  title: string;
  date: string;
  image: string;
  status: "Upcoming" | "Active" | "Completed";
  type: "Upcoming" | "Self-Guided" | "Custom";
}

interface BadgeItem {
  id: number;
  name: string;
  icon: string;
  desc: string;
  unlocked: boolean;
  date?: string;
}

const mediaData = [
  "https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop",
  "https://i.pinimg.com/1200x/24/b4/f7/24b4f73760970fb2b35dbeb6f2aed0a0.jpg",
  "https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg",
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop",
  "https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
];

const activityData: ActivitySection[] = [
  {
    label: "Today",
    items: [
      {
        type: "visit",
        title: "Visited All Sites",
        subtitle: 'Unlocked the "Island Explorer" badge',
        points: 250,
      },
      {
        type: "visit",
        title: "Visited Bathsheba",
        subtitle: 'Unlocked the "Wave Master" badge',
        points: 250,
      },
      {
        type: "upload",
        title: "Uploaded 10 items",
        points: 250,
        images: mediaData.slice(0, 6),
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        type: "rank",
        title: "Ranked up to #52",
        subtitle: "Moved up 10 positions on the leaderboard",
        points: 250,
      },
    ],
  },
];

const toursData: TourItem[] = [
  {
    id: 1,
    title: "The Gardens of St. Joseph Circuit",
    date: "February 15, 2024",
    image:
      "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg",
    status: "Completed",
    type: "Self-Guided",
  },
  {
    id: 2,
    title: "Cliffs, Coastlines, & Canopies",
    date: "February 15, 2024",
    image:
      "https://i.pinimg.com/1200x/bb/a9/bc/bba9bc4cc096c07d70075dcb03bae5ca.jpg",
    status: "Active",
    type: "Custom",
  },
  {
    id: 3,
    title: "Cliffs, Coastlines, & Canopies",
    date: "February 15, 2024",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    status: "Completed",
    type: "Self-Guided",
  },
];

const badgesData: BadgeItem[] = [
  {
    id: 1,
    name: "Beach Bum",
    icon: "🏖️",
    desc: "Visited 5 beaches",
    unlocked: true,
    date: "Oct 12",
  },
  {
    id: 2,
    name: "Trail Blazer",
    icon: "🥾",
    desc: "Hiked 20km total",
    unlocked: true,
    date: "Nov 01",
  },
  {
    id: 3,
    name: "Early Bird",
    icon: "🌅",
    desc: "Start a tour before 7am",
    unlocked: true,
    date: "Dec 15",
  },
  {
    id: 4,
    name: "Night Owl",
    icon: "🌙",
    desc: "Complete a night tour",
    unlocked: false,
  },
  {
    id: 5,
    name: "Social Butterfly",
    icon: "🦋",
    desc: "Share 10 moments",
    unlocked: false,
  },
  {
    id: 6,
    name: "Champion",
    icon: "🏆",
    desc: "Top 10 this month",
    unlocked: true,
    date: "Jan 03",
  },
  {
    id: 7,
    name: "Guide Star",
    icon: "⭐",
    desc: "Completed all guides",
    unlocked: true,
    date: "Jan 10",
  },
  {
    id: 8,
    name: "Lucky Clover",
    icon: "🍀",
    desc: "Found hidden landmark",
    unlocked: true,
    date: "Jan 17",
  },
];

const getTourBadgeClass = (tour: TourItem) => {
  if (tour.status === "Completed") {
    return "text-[#00A835] border-[#00A835] bg-[#00FF03]/20";
  }
  if (tour.status === "Active") {
    return "text-[#208BFF] border-[#208BFF] bg-[#208BFF]/20";
  }
  return "text-[#FFA000] border-[#FFA000] bg-[#FFA000]/20";
};

const TourCard = ({ tour }: { tour: TourItem }) => {
  const badgeLabel = tour.status === "Completed" ? "Completed" : tour.type;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsExpanded((v) => !v)}
      aria-expanded={isExpanded}
      className="mx-auto mb-4 w-[90vw] max-w-[560px] cursor-pointer rounded-[40px] border-[2.5px] border-white bg-black/5 p-[2px] text-left shadow-[0px_0px_30px_rgba(0,0,0,0.08)] active:scale-[.99]"
    >
      <div className="group overflow-hidden rounded-[33px]">
        <div className="flex gap-3 p-2">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[27px]">
            <Image src={tour.image} alt={tour.title} fill className="object-cover" />
          </div>

          <div className="relative flex flex-1 flex-col py-1 pr-2">
            <div className="mb-1 flex items-start justify-between">
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getTourBadgeClass(
                  tour
                )}`}
              >
                {badgeLabel}
              </span>
              <span className="mr-[3px] mt-[3px] text-[11px] font-bold text-slate-500">
                {tour.date}
              </span>
            </div>

            <h3 className="mt-1 line-clamp-2 max-w-[200px] text-[1rem] font-bold leading-tight text-slate-800">
              {tour.title}
            </h3>

            <div className="absolute bottom-0 right-[10px] flex">
              <span
                className={
                  "rotate-[180deg] text-slate-400 transition-transform duration-200 " +
                  (isExpanded ? "rotate-0" : "rotate-[180deg]")
                }
                aria-hidden="true"
              >
                <ArrowIcon color="#1E293B" />
              </span>
            </div>
          </div>
        </div>

        {/* Expandable details */}
        <div
          className={
            "grid transition-[grid-template-rows,opacity] duration-250 ease-out " +
            (isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
          }
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-4 pb-4">
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-extrabold text-slate-700">
                    Status: {tour.status}
                  </span>
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-extrabold text-slate-700">
                    Type: {tour.type}
                  </span>
                </div>

                <p className="mt-3 text-[13px] font-semibold leading-relaxed text-slate-700">
                  {/* Replace this with real tour description/details when available */}
                  Explore this route with curated stops, photo moments, and local highlights. Tap again to collapse.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-slate-500">
                    Estimated time: 45–90 mins
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#007BFF]/10 px-3 py-1 text-[12px] font-extrabold text-[#007BFF]">
                      View details
                    </span>
                    <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[12px] font-extrabold text-slate-700">
                      Save
                    </span>
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

const ActivityCard = ({
  item,
  compact = false,
}: {
  item: ActivityItem;
  compact?: boolean;
}) => {
  let Icon = Trophy;
  let iconBg = "bg-[#FFECCF] text-[#F59E0B]";

  if (item.type === "visit") {
    Icon = MapPin;
    iconBg = "bg-[#DCEEFF] text-[#007BFF]";
  } else if (item.type === "upload") {
    Icon = ImageIcon;
    iconBg = "bg-[#FFDCE2] text-[#FF4D6D]";
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[30px] border-[2.5px] border-white bg-black/5 shadow-[0px_0px_20px_rgba(0,0,0,0.08)] ${
        compact ? "px-3 py-3" : "px-4 py-3.5"
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[45%] rounded-l-[30px] bg-gradient-to-r from-slate-100/80 to-transparent" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div
            className={`mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon size={16} strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <h4
              className={`leading-tight text-slate-800 ${
                compact ? "text-[16px] font-semibold" : "text-[18px] font-semibold"
              }`}
            >
              {item.title}
            </h4>
            {item.subtitle ? (
              <p
                className={`mt-0.5 text-slate-500 ${
                  compact ? "text-[12px]" : "text-[13px]"
                }`}
              >
                {item.subtitle}
              </p>
            ) : null}
            {item.images?.length ? (
              <div className="mt-2 flex items-center gap-2">
                {item.images.slice(0, 5).map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative h-[34px] w-[34px] overflow-hidden rounded-[10px]"
                  >
                    <Image src={src} alt="Uploaded media" fill className="object-cover" />
                  </div>
                ))}
                {item.images.length > 5 ? (
                  <span className="text-[11px] font-semibold text-slate-500">
                    +{item.images.length - 5}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <span className="mt-0.5 text-[12px] font-semibold text-slate-600">
          +{item.points} pts
        </span>
      </div>
    </div>
  );
};

const MobileMediaGrid = () => (
  <div className="columns-3 gap-2 space-y-2">
    {mediaData.map((src, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-[24px] break-inside-avoid"
      >
        <Image
          src={src}
          alt="User upload"
          width={800}
          height={800}
          className="min-h-[100px] w-full object-full"
          sizes="50vw"
        />
      </div>
    ))}
  </div>
);

const DesktopMediaGrid = () => (
  <div className="columns-4 gap-3 space-y-3">
    {mediaData.map((src, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-[30px] break-inside-avoid"
      >
        <Image
          src={src}
          alt="Media tile"
          width={1200}
          height={1200}
          className="h-auto w-full object-contain"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
    ))}
  </div>
);

const BadgesGrid = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const sortedBadges = useMemo(
    () => [...badgesData].sort((b, a) => Number(a.unlocked) - Number(b.unlocked)),
    []
  );

  return (
    <>
      {/* Icon-only responsive grid */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {sortedBadges.map((badge) => {
          const isUnlocked = badge.unlocked;

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => setSelectedBadge(badge)}
              className={
                "group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[26px] border-[2.5px] border-white bg-black/5 shadow-[0px_0px_18px_rgba(0,0,0,0.08)] transition-transform active:scale-[.98]" +
                (isUnlocked ? "" : " opacity-70 grayscale")
              }
              aria-label={`Open badge: ${badge.name}`}
            >
              {/* soft highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-transparent" />

              {/* inner */}
              <div className="relative flex h-full w-full items-center justify-center rounded-[22px] bg-white/55 backdrop-blur-sm">
                {/* refraction */}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="translate-y-[1px] scale-[1.25] text-[34px] leading-none opacity-30 blur-[10px] saturate-200 contrast-200 mix-blend-multiply">
                    {badge.icon}
                  </span>
                </span>
                {/* crisp icon */}
                <span className="relative text-[34px] leading-none transition-transform duration-150 group-hover:scale-[1.06]">
                  {badge.icon}
                </span>

                {!isUnlocked ? (
                  <div className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white shadow-[0px_0px_12px_rgba(0,0,0,0.12)]">
                    <Lock size={14} className="text-slate-600" />
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Details modal */}
      {selectedBadge ? (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Badge details"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-[520px] overflow-hidden rounded-[34px] border-[2.5px] border-white bg-white/80 shadow-[0px_0px_40px_rgba(0,0,0,0.18)] backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-[52px] w-[52px] items-center justify-center bg-white/0 shadow-[0px_0px_16px_rgba(0,0,0,0)]">
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="translate-y-[1px] scale-[1.25] text-[34px] leading-none opacity-40 blur-[10px] saturate-200 contrast-200 mix-blend-multiply">
                      {selectedBadge.icon}
                    </span>
                  </span>
                  <span className="relative text-[34px] leading-none">{selectedBadge.icon}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[18px] font-black text-slate-800">
                    {selectedBadge.name}
                  </h3>
                  <p className="mt-0.5 text-[12px] font-semibold text-slate-500">
                    {selectedBadge.unlocked
                      ? selectedBadge.date
                        ? `Unlocked ${selectedBadge.date}`
                        : "Unlocked"
                      : "Locked"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[12px] font-extrabold text-slate-700 shadow-[0px_0px_12px_rgba(0,0,0,0.10)] hover:bg-white"
              >
                Close
              </button>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-[26px] border border-white/70 bg-slate-50/70 px-4 py-4">
                <p className="text-[14px] font-semibold leading-relaxed text-slate-700">
                  {selectedBadge.desc}
                </p>
              </div>

              {!selectedBadge.unlocked ? (
                <div className="mt-3 flex items-center gap-2 rounded-[22px] border border-white/70 bg-white/70 px-4 py-3">
                  <Lock size={16} className="text-slate-600" />
                  <p className="text-[12px] font-extrabold text-slate-600">
                    Keep exploring to unlock this badge.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const DesktopBadgesPanel = () => (
  <div className="rounded-[40px] border-[2.5px] w-[350px] border-white bg-black/5 pt-3 p-4 shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
    <h3 className="mb-3 text-[22px] font-semibold text-slate-800 ml-[4px]">Badges</h3>
    <div className="grid grid-cols-4 gap-2.5">
      {badgesData.slice(0, 12).map((badge) => (
        <div
          key={badge.id}
          className="flex h-[50px] w-[50px] items-center justify-center rounded-[18px] bg-white/0 text-[35px]"
        >
          {badge.icon}
        </div>
      ))}
    </div>
  </div>
);

const DesktopToursPanel = () => (
  <div className="rounded-[40px] border-[2.5px] w-[350px] border-white bg-black/5 pt-3 p-4 shadow-[0px_0px_20px_rgba(0,0,0,0.1)] backdrop-blur-sm">
    <h3 className="mb-3 text-[22px] font-semibold text-slate-800 ml-[4px]">Tours</h3>
    <div className="space-y-3">
      {toursData.map((tour) => (
        <div key={tour.id} className="flex gap-2.5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px]">
            <Image src={tour.image} alt={tour.title} fill className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 flex items-center justify-between gap-1">
              <span
                className={`rounded-full border px-1.5 py-[1px] text-[9px] font-semibold ${getTourBadgeClass(
                  tour
                )}`}
              >
                {tour.status === "Completed" ? "Completed" : tour.type}
              </span>
              <span className="text-[10px] font-medium text-slate-400">{tour.date}</span>
            </div>
            <p className="line-clamp-2 text-[1rem] font-medium text-slate-800">
              {tour.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("All");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      if (!usernameFromUrl) return;

      const decodedUsername = decodeURIComponent(usernameFromUrl);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", decodedUsername)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) setCurrentUser(authData.user);
      setLoading(false);
    };

    fetchProfileData();
  }, [usernameFromUrl, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    // Delete logic here.
  };

  const handleUpdateProfile = async (
    newUsername: string,
    newBio: string,
    isPrivate: boolean,
    newAvatarFile: File | null
  ) => {
    if (!currentUser) return;
    setIsSaving(true);

    try {
      let finalAvatarUrl = profile?.avatar_url;

      if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split(".").pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, newAvatarFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalAvatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: newUsername,
          bio: newBio,
          is_private: isPrivate,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: newUsername,
              bio: newBio,
              avatar_url: finalAvatarUrl || prev.avatar_url,
              is_private: isPrivate,
            }
          : null
      );

      setIsSettingsOpen(false);

      if (profile?.username !== newUsername) {
        router.push(`/${newUsername}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayUsername = profile?.username || "explorer";
  const userAvatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${displayUsername}`;
  const isOwnProfile = !!(currentUser && profile && currentUser.id === profile.id);
  const isContentVisible = isOwnProfile || !profile?.is_private;

  const desktopTab: "All" | "Media" = useMemo(
    () => (activeTab === "Media" ? "Media" : "All"),
    [activeTab]
  );

  if (loading) return null;

return (
    <div className="relative flex flex-row-reverse min-h-screen gap-0 overflow-x-hidden bg-white justify-center md:pl-[92px] xl:pl-[240px]">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialAvatarUrl={userAvatarUrl}
        initialUsername={profile?.username || ""}
        initialBio={profile?.bio || ""}
        initialIsPrivate={profile?.is_private ?? false}
        onSave={handleUpdateProfile}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        isSaving={isSaving}
      />

      <div className="relative z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Navigation />
        </div>
      </div>
      <div className="flex flex-row-reverse bg-green-500/0 gap-20 max-w-[90vw] w-[1100px]">
      <div className="max-[970px]:hidden mt-[190px] space-y-4 bg-pink-500/0 mr-[30px]">
                <DesktopBadgesPanel />
                <DesktopToursPanel />
              </div>

      <div className="w-[1200px] bg-red-500/0 px-0 pb-24 mt-[190px] max-sm:mt-[110px] md:pl-[0px] justify-center">
        <div className="relative rounded-[32px] bg-transparent p-0 shadow-none">
          <div className="flex items-start gap-4">
            <div className="relative max-sm:h-[90px] max-sm:w-[90px] h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
              <Image src={userAvatarUrl} alt="User avatar" fill className="object-cover" unoptimized />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* The truncate class here will now work because the parent width is constrained */}
                  <h1 className="truncate text-[30px] font-bold h-[37px] text-[#1e293b] leading-none">
                    {profile?.username || displayUsername}
                  </h1>
                  {/* <p className="text-[12px] font-semibold text-[#1e293b] mt-2">Developer</p> */}
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    {profile?.is_private ? "Private" : "Public"}
                  </span> */}
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
                      aria-label="Open settings"
                    >
                      <Settings size={20} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* <div className="mt-2 flex items-center gap-2 text-slate-700">
                <Instagram size={17} />
                <Github size={17} />
                <Youtube size={18} />
                <Facebook size={17} />
              </div> */}

              {/* <p className="text-[12px] font-semibold text-slate-700 mt-2 flex gap-[5px] items-center"><DevIcon/> Developer</p> */}

              <div className="flex justify-between items-center bg-blue-500/0  w-[95%] max-w-[300px] max-sm:max-w-[90vw] mt-1">
                <p className="flex font-medium text-slate-700 text-sm gap-[5px]"><span className="font-bold">#1</span> Rank</p>
                <div className="rounded-full h-[15px] w-[1.7px] bg-slate-600/50"/>
                <p className="flex font-medium text-slate-700 text-sm gap-[5px]"><span className="font-bold">12</span> Badges</p>
                <div className="rounded-full h-[15px] w-[1.7px] bg-slate-600/50"/>
                <p className="flex font-medium text-slate-700 text-sm gap-[5px]"><span className="font-bold">46</span> Media</p>
              </div>

              <p className="text-[12px] font-semibold text-slate-700 mt-2 flex gap-[5px] items-center"><DevIcon/> Developer</p>

              <p className="max-sm:hidden mt-2 max-w-[620px] text-[15px] leading-relaxed font-[500] text-slate-700">
                {profile?.bio || ""}
              </p>
            </div>
          </div>
          <p className="md:hidden mt-2 max-w-[620px] text-[15px] leading-relaxed font-[500] text-slate-700">
                {profile?.bio || ""}
              </p>

          <div className="mt-5 h-[2px] bg-black/5" />
        </div>

        {isContentVisible ? (
          <>
            <div className="hidden min-[971px]:grid min-[971px]:grid-cols-[minmax(0,1fr)_0px] min-[971px]:gap-0">
              <div className="bg-blue-500/0 w-full">
                <div className="mt-4 flex justify-center">
                  <div className="relative inline-flex h-[55px] w-[200px] items-center rounded-full border-white border-2 bg-black/5 p-1.5 shadow-[0px_0px_20px_rgba(0,0,0,0.15)]">
                    <button
                      onClick={() => setActiveTab("All")}
                      className={`z-10 rounded-full px-5 py-0 cursor-pointer active:scale-[-] text-[15px] bg-red-500/0 font-semibold transition-colors ${
                        desktopTab === "All" ? "text-white" : "text-slate-500"
                      }`}
                    >
                      Activity
                    </button>
                    <button
                      onClick={() => setActiveTab("Media")}
                      className={`z-10 flex items-center gap-1 cursor-pointer rounded-full px-5 py-2 text-[15px] font-semibold transition-colors ${
                        desktopTab === "Media" ? "text-white" : "text-slate-500 ml-[7px]"
                      }`}
                    >
                      Media
                      {desktopTab === "Media" ? <ChevronDown size={16} /> : null}
                    </button>

                    <div
                      className={`pointer-events-none absolute h-[40px] rounded-full bg-[#007BFF] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] transition-all duration-200 ${
                        desktopTab === "All"
                          ? "w-[90px]"
                          : "right-1.5 w-[90px]"
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  {desktopTab === "Media" ? (
                    <div className="">
                    <DesktopMediaGrid />
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {activityData.map((section) => (
                        <div key={section.label} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[20px] font-semibold text-slate-800">
                              {section.label}
                            </h3>
                            {/* {section.label === "Today" ? (
                              <button className="flex items-center gap-1 text-[18px] font-medium text-[#007BFF]">
                                Show more
                                <ChevronDown size={16} />
                              </button>
                            ) : null} */}
                          </div>
                          {section.items.map((item, index) => (
                            <ActivityCard key={`${section.label}-${index}`} item={item} />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            
            </div>

            <div className="min-[971px]:hidden">
              <div className="mt-6 flex justify-center">
                <div className="inline-flex rounded-full border-[3px] border-white bg-black/4 p-1.5 shadow-[0px_0px_10px_rgba(0,0,0,0.08)] w-[100%] justify-between">
                  {(
                    [
                      { value: "All", label: "Activity" },
                      { value: "Media", label: "Media" },
                      { value: "Badges", label: "Badges" },
                      { value: "Tours", label: "Tours" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`cursor-pointer rounded-full px-4 py-3 text-sm font-bold active:scale-[.97] ${
                        activeTab === tab.value
                          ? "bg-[#007BFF] px-[20px] text-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="inline-flex items-center gap-0">
                        {tab.label}
                        {tab.value === "Media" && activeTab === "Media" ? (
                          <ChevronDown size={20} className="mr-[-10px]"/>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {activeTab === "All" ? (
                  <div className="space-y-7">
                    {activityData.map((section) => (
                      <div key={section.label} className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {section.label}
                        </h3>
                        {section.items.map((item, index) => (
                          <ActivityCard
                            key={`${section.label}-mobile-${index}`}
                            item={item}
                            compact
                          />
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
        ) : (
          <div className="mt-8 flex w-full justify-center">
            <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-[35px] text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                <Lock size={32} className="text-slate-500" />
              </div>
              <h2 className="mb-2 text-xl font-black text-slate-800">This account is private</h2>
              <p className="max-w-[300px] text-sm font-medium leading-relaxed text-slate-500">
                {displayUsername} has restricted access to their{" "}
                {activeTab === "Media"
                  ? "photos and videos"
                  : activeTab === "All"
                  ? "activity"
                  : activeTab.toLowerCase()}
                .
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
