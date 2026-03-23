"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Image as ImageIcon,
  MapPin,
  Maximize,
  MessageCircle,
  Pause,
  Play,
  Search,
  Sparkles,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";

import Navigation from "@/app/components/ProfileNav";
import UploadModal from "@/app/components/UploadModal";

type MediaType = "image" | "video";
type MediaFilter = "all" | MediaType;

interface MediaItem {
  id: number;
  type: MediaType;
  src: string;
  poster?: string;
  likes: number;
  comments: number;
  title?: string;
  location: string;
  user: {
    username: string;
    avatar: string;
  };
}

interface UserItem {
  id: number;
  username: string;
  fullName: string;
  avatar: string;
  rank: string;
}

const mockMedia: MediaItem[] = [
  {
    id: 1,
    type: "image",
    src: "https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg",
    likes: 1240,
    comments: 45,
    title: "Sunrise over the rock pools",
    location: "Bathsheba Park",
    user: { username: "island_girl", avatar: "https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg" },
  },
  {
    id: 2,
    type: "video",
    src: "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4",
    poster: "https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg",
    likes: 8500,
    comments: 120,
    title: "Morning sets rolling in",
    location: "Soup Bowl",
    user: { username: "surfer_dude", avatar: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg" },
  },
  {
    id: 3,
    type: "image",
    src: "https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg",
    likes: 230,
    comments: 12,
    title: "Hidden cave textures",
    location: "Animal Flower Cave",
    user: { username: "explorer_99", avatar: "https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg" },
  },
  {
    id: 4,
    type: "image",
    src: "https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg",
    likes: 945,
    comments: 89,
    title: "Garden walk after rain",
    location: "Hunte's Gardens",
    user: { username: "green_thumb", avatar: "https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg" },
  },
  {
    id: 5,
    type: "video",
    src: "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4",
    poster: "https://i.pinimg.com/736x/9c/03/4d/9c034d03d8db6ee172bcf6fe25de24ca.jpg",
    likes: 310,
    comments: 34,
    title: "Roadside drive with sea spray",
    location: "Westbury New Road",
    user: { username: "barbados_fan", avatar: "https://i.pinimg.com/736x/9c/03/4d/9c034d03d8db6ee172bcf6fe25de24ca.jpg" },
  },
  {
    id: 6,
    type: "image",
    src: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg",
    likes: 156,
    comments: 8,
    title: "Foam lines and reef breaks",
    location: "Bathsheba",
    user: { username: "surfer_dude", avatar: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg" },
  },
  {
    id: 7,
    type: "image",
    src: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg",
    likes: 88,
    comments: 2,
    title: "Light through the gully canopy",
    location: "Welchman Hall Gully",
    user: { username: "green_thumb", avatar: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg" },
  },
  {
    id: 8,
    type: "image",
    src: "https://i.pinimg.com/736x/d4/aa/92/d4aa9219d018d5fea71a647303b71e62.jpg",
    likes: 4400,
    comments: 300,
    title: "Golden hour stopover",
    location: "The Crane",
    user: { username: "island_girl", avatar: "https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg" },
  },
  {
    id: 9,
    type: "video",
    src: "https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4",
    poster: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg",
    likes: 4400,
    comments: 300,
    title: "East coast drive journal",
    location: "East Coast Road",
    user: { username: "surfer_dude", avatar: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg" },
  },
];

const mockUsers: UserItem[] = [
  { id: 1, username: "island_girl", fullName: "Jessica W.", avatar: "https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg", rank: "Rank 1" },
  { id: 2, username: "surfer_dude", fullName: "Mikey P.", avatar: "https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg", rank: "Rank 20" },
  { id: 3, username: "explore_barbados", fullName: "Visit Barbados", avatar: "https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg", rank: "Rank 200" },
  { id: 4, username: "green_thumb", fullName: "Alicia M.", avatar: "https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg", rank: "Rank 17" },
];

const cardAspectClasses = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[1/1.15]",
  "aspect-[5/6]",
];

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);

const isPlayableVideo = (src: string) => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src);

const MediaVideoPlayer = ({ src, poster }: { src: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      void videoRef.current.play();
      setIsPlaying(true);
      return;
    }

    videoRef.current.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !Number.isFinite(videoRef.current.duration) || videoRef.current.duration === 0) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !Number.isFinite(videoRef.current.duration) || videoRef.current.duration === 0) return;
    const nextProgress = Number(event.target.value);
    videoRef.current.currentTime = (nextProgress / 100) * videoRef.current.duration;
    setProgress(nextProgress);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    void videoRef.current.requestFullscreen?.();
  };

  return (
    <div className="group relative flex h-full min-h-[60vh] w-full items-center justify-center overflow-hidden rounded-[28px] bg-[#0f172a]">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full max-h-[82vh] w-full rounded-[28px] object-contain"
        autoPlay
        loop
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {!isPlaying ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="rounded-full border border-white/20 bg-white/15 p-5 text-white backdrop-blur-md">
            <Play size={38} fill="white" />
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-12 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <button type="button" onClick={togglePlay} className="text-white transition-colors hover:text-white/75">
          {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <button type="button" onClick={handleFullscreen} className="text-white transition-colors hover:text-white/75">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
};

const MediaViewerModal = ({
  media,
  onClose,
}: {
  media: MediaItem | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!media) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a]/92 p-4 backdrop-blur-md" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={22} />
      </button>

      <div
        className="relative flex w-full max-w-6xl flex-col gap-4 rounded-[34px] border border-white/12 bg-white/8 p-3 shadow-[0px_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-black/25 px-2.5 py-2 text-white">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/30">
              <Image src={media.user.avatar} alt={media.user.username} fill className="object-cover" sizes="44px" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">@{media.user.username}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
                <MapPin size={11} />
                <span>{media.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-white/75">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{formatCompactNumber(media.likes)} likes</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{formatCompactNumber(media.comments)} comments</span>
          </div>
        </div>

        {media.type === "video" && isPlayableVideo(media.src) ? (
          <MediaVideoPlayer src={media.src} poster={media.poster} />
        ) : (
          <div className="relative min-h-[60vh] overflow-hidden rounded-[28px] bg-[#0f172a]">
            <div className="relative h-[76vh] w-full">
              <Image
                src={media.poster || media.src}
                alt={media.title || "Selected media"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        )}

        <div className="rounded-[28px] bg-black/20 px-4 py-4 text-white">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            <span>{media.type === "video" ? "Motion clip" : "Photo story"}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{media.location}</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">{media.title || "Community post"}</h2>
          <div className="mt-4 flex items-center gap-5 text-sm font-medium text-white/80">
            <span className="flex items-center gap-1.5">
              <Heart size={16} fill="currentColor" />
              {formatCompactNumber(media.likes)}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={16} />
              {formatCompactNumber(media.comments)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ExplorePage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<MediaFilter>("all");
  const [activeLocation, setActiveLocation] = useState("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const locationOptions = useMemo(
    () => ["All", ...Array.from(new Set(mockMedia.map((item) => item.location)))],
    []
  );

  const creatorSummaries = useMemo(() => {
    return mockUsers
      .map((user) => {
        const posts = mockMedia.filter((item) => item.user.username === user.username);
        const totalLikes = posts.reduce((sum, item) => sum + item.likes, 0);

        return {
          ...user,
          postCount: posts.length,
          totalLikes,
          topLocation: posts[0]?.location || "St. Joseph",
        };
      })
      .sort((left, right) => right.totalLikes - left.totalLikes);
  }, []);

  const trendingLocations = useMemo(() => {
    return Array.from(
      mockMedia.reduce((acc, item) => {
        const current = acc.get(item.location) ?? { name: item.location, posts: 0, likes: 0 };
        current.posts += 1;
        current.likes += item.likes;
        acc.set(item.location, current);
        return acc;
      }, new Map<string, { name: string; posts: number; likes: number }>())
    )
      .map(([, value]) => value)
      .sort((left, right) => right.likes - left.likes)
      .slice(0, 5);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!isSearching) return creatorSummaries;

    return creatorSummaries.filter(
      (user) =>
        user.username.toLowerCase().includes(normalizedQuery) ||
        user.fullName.toLowerCase().includes(normalizedQuery) ||
        user.rank.toLowerCase().includes(normalizedQuery)
    );
  }, [creatorSummaries, isSearching, normalizedQuery]);

  const filteredMedia = useMemo(() => {
    return mockMedia.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.title?.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery) ||
        item.user.username.toLowerCase().includes(normalizedQuery);

      const matchesType = activeType === "all" || item.type === activeType;
      const matchesLocation = activeLocation === "All" || item.location === activeLocation;

      return Boolean(matchesQuery && matchesType && matchesLocation);
    });
  }, [activeLocation, activeType, normalizedQuery]);

  const spotlightItem = useMemo(() => {
    const source = filteredMedia.length > 0 ? filteredMedia : mockMedia;
    return [...source].sort((left, right) => right.likes - left.likes)[0];
  }, [filteredMedia]);

  const stats = useMemo(
    () => [
      { label: "Shared moments", value: formatCompactNumber(mockMedia.length), icon: ImageIcon, iconBg: "bg-[#FFE8EE] text-[#E11D48]" },
      { label: "Active creators", value: formatCompactNumber(creatorSummaries.length), icon: Users, iconBg: "bg-[#E8F3FF] text-[#007BFF]" },
      { label: "Pinned places", value: formatCompactNumber(locationOptions.length - 1), icon: MapPin, iconBg: "bg-[#FFF1D6] text-[#D97706]" },
    ],
    [creatorSummaries.length, locationOptions.length]
  );

  const matchingLocations = useMemo(
    () => Array.from(new Set(filteredMedia.map((item) => item.location))).slice(0, 6),
    [filteredMedia]
  );

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <MediaViewerModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      <Navigation />

      <div className="w-full max-w-[1240px] flex gap-8 p-4 md:p-8 mt-28 max-sm:mt-20">
        <div className="flex-1 w-full max-w-[760px] mx-auto pb-32">
          <section className="rounded-[42px] p-[3px] bg-white/10 shadow-[0px_0px_20px_rgba(0,0,0,.1)]">
            <div className="rounded-[39px] bg-[#F2F2F2] p-5 sm:p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#007BFF]">
                <Sparkles size={14} />
                Explore
              </div>

              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
                <div>
                  <h1 className="text-[2.2rem] font-bold leading-[1.02] text-slate-900 max-sm:text-[1.8rem]">
                    Explore St. Joseph through community uploads.
                  </h1>
                  <p className="mt-3 max-w-[560px] text-[15px] font-medium leading-7 text-slate-600">
                    Browse recent photos and clips, search creators and locations, and open the most shared moments across the parish.
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1 rounded-full p-[3px] bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.12)]">
                      <Search size={20} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#E0E0E0]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search creators, captions, or locations"
                        className="h-[57px] w-full rounded-full bg-black/50 pl-[50px] pr-4 text-[15px] font-bold text-[#E0E0E0] placeholder-[#E0E0E0] outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_15px_rgba(0,0,0,.1)] active:scale-[.98] transition-transform"
                    >
                      <span className="flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(to_left,#007BFF,#66B2FF)] px-5 py-[15px] text-white font-bold">
                        <Upload size={18} />
                        Upload
                      </span>
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="rounded-[28px] border-[2.5px] border-white bg-black/3 px-4 py-4 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
                          <div className="flex items-center justify-between">
                            <div className={`flex h-[36px] w-[36px] items-center justify-center rounded-full ${stat.iconBg}`}>
                              <Icon size={18} />
                            </div>
                            <p className="text-[1.35rem] font-bold text-slate-900">{stat.value}</p>
                          </div>
                          <p className="mt-3 text-[13px] font-semibold text-slate-500">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {spotlightItem ? (
                  <button
                    type="button"
                    onClick={() => setSelectedMedia(spotlightItem)}
                    className="group rounded-[33px] p-[3px] bg-white/10 shadow-[0px_0px_18px_rgba(0,0,0,.12)] text-left"
                  >
                    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[30px] bg-black/40">
                      <Image
                        src={spotlightItem.poster || spotlightItem.src}
                        alt={spotlightItem.title || "Spotlight media"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="(min-width: 1024px) 250px, 100vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.78))]" />
                      <div className="absolute left-4 top-4 rounded-full bg-white/10 p-[2.5px] shadow-[0px_0px_10px_rgba(0,0,0,.2)]">
                        <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                          Spotlight
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                          <MapPin size={11} />
                          {spotlightItem.location}
                        </div>
                        <h2 className="mt-2 text-[1.45rem] font-bold leading-tight">{spotlightItem.title || "Community spotlight"}</h2>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20">
                              <Image src={spotlightItem.user.avatar} alt={spotlightItem.user.username} fill className="object-cover" sizes="36px" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">@{spotlightItem.user.username}</p>
                              <p className="text-xs text-white/70">{formatCompactNumber(spotlightItem.likes)} likes</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-white/10 p-2">
                            <ArrowUpRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[33px] border-[2.5px] border-white bg-black/3 p-4 shadow-[0px_0px_10px_rgba(0,0,0,.08)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">Browse Feed</p>
                <h2 className="mt-1 text-[1.7rem] font-bold text-slate-900">
                  {filteredMedia.length} moment{filteredMedia.length === 1 ? "" : "s"} in view
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All", icon: Sparkles },
                  { value: "image", label: "Photos", icon: ImageIcon },
                  { value: "video", label: "Videos", icon: Video },
                ].map((option) => {
                  const Icon = option.icon;
                  const isActive = activeType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setActiveType(option.value as MediaFilter)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                        isActive ? "bg-[#007BFF] text-white shadow-[0px_0px_10px_rgba(0,123,255,0.18)]" : "bg-white text-slate-600"
                      }`}
                    >
                      <Icon size={15} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {locationOptions.map((location) => {
                const isActive = activeLocation === location;
                return (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setActiveLocation(location)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                      isActive ? "bg-black text-white" : "bg-white text-slate-600"
                    }`}
                  >
                    {location}
                  </button>
                );
              })}
            </div>
          </section>

          {isSearching ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="rounded-[33px] border-[2.5px] border-white bg-black/3 p-5 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">Matching Accounts</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.slice(0, 4).map((user) => (
                      <Link
                        key={user.id}
                        href={`/${user.username}`}
                        className="flex items-center justify-between rounded-[24px] bg-white p-3 shadow-[0px_0px_10px_rgba(0,0,0,.05)] transition hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image src={user.avatar} alt={user.username} fill className="object-cover" sizes="48px" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">@{user.username}</p>
                            <p className="text-sm font-medium text-slate-500">{user.rank}</p>
                          </div>
                        </div>
                        <ArrowUpRight size={18} className="text-slate-400" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm font-medium text-slate-500">No creator profiles match this search.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[33px] p-[3px] bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
                <div className="rounded-[30px] bg-black/40 p-5 text-white">
                  <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/55">Matching Places</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchingLocations.length > 0 ? (
                      matchingLocations.map((location) => (
                        <span key={location} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white/85">
                          {location}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-white/70">No locations match this query yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {filteredMedia.length > 0 ? (
            <div className="mt-6 columns-1 gap-4 space-y-4 sm:columns-2">
              {filteredMedia.map((item, index) => (
                <article key={item.id} className="break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setSelectedMedia(item)}
                    className="group block w-full rounded-[33px] p-[3px] bg-white/10 shadow-[0px_0px_12px_rgba(0,0,0,.08)] text-left"
                  >
                    <div className={`relative w-full overflow-hidden rounded-[30px] bg-black/20 ${cardAspectClasses[index % cardAspectClasses.length]}`}>
                      {item.type === "video" && isPlayableVideo(item.src) ? (
                        <video
                          src={item.src}
                          poster={item.poster}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={item.poster || item.src}
                          alt={item.title || "Explore media"}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          sizes="(min-width: 640px) 45vw, 100vw"
                        />
                      )}

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.65))]" />

                      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                          {item.location}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                          {item.type === "video" ? "Video" : "Photo"}
                        </span>
                      </div>

                      {item.type === "video" ? (
                        <div className="absolute right-4 top-14 rounded-full bg-white/10 p-3 text-white backdrop-blur-md">
                          <Play size={18} fill="white" />
                        </div>
                      ) : null}

                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/25">
                            <Image src={item.user.avatar} alt={item.user.username} fill className="object-cover" sizes="44px" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white/78">@{item.user.username}</p>
                            <h3 className="truncate text-[1.05rem] font-bold leading-tight">{item.title || "Community update"}</h3>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm font-bold text-white/85">
                          <span className="flex items-center gap-1.5">
                            <Heart size={15} fill="currentColor" />
                            {formatCompactNumber(item.likes)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageCircle size={15} />
                            {formatCompactNumber(item.comments)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[33px] border-[2.5px] border-dashed border-slate-200 bg-black/3 px-6 py-16 text-center shadow-[0px_0px_10px_rgba(0,0,0,.06)]">
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">Nothing In View</p>
              <h3 className="mt-3 text-[1.8rem] font-bold text-slate-900">No moments match those filters.</h3>
              <p className="mt-3 text-[15px] font-medium text-slate-500">
                Try another location, clear the search, or switch back to all media.
              </p>
            </div>
          )}
        </div>

        <aside className="hidden xl:flex w-[320px] shrink-0 flex-col gap-4 pt-1">
          <div className="rounded-[33px] border-[2.5px] border-white bg-black/3 p-5 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">Featured Creators</p>
                <h3 className="mt-1 text-[1.45rem] font-bold text-slate-900">People shaping the feed</h3>
              </div>
              <Users size={18} className="text-slate-400" />
            </div>

            <div className="mt-4 space-y-3">
              {creatorSummaries.slice(0, 4).map((creator) => (
                <Link
                  key={creator.id}
                  href={`/${creator.username}`}
                  className="flex items-center gap-3 rounded-[24px] bg-white p-3 shadow-[0px_0px_10px_rgba(0,0,0,.05)] transition hover:scale-[1.01]"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={creator.avatar} alt={creator.username} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">@{creator.username}</p>
                    <p className="truncate text-sm font-medium text-slate-500">
                      {creator.postCount} posts • {formatCompactNumber(creator.totalLikes)} likes
                    </p>
                  </div>
                  <ArrowUpRight size={17} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[33px] p-[3px] bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
            <div className="rounded-[30px] bg-black/40 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/55">Trending Locations</p>
                  <h3 className="mt-1 text-[1.4rem] font-bold">Where people are posting</h3>
                </div>
                <Sparkles size={18} className="text-white/65" />
              </div>

              <div className="mt-4 space-y-3">
                {trendingLocations.map((location, index) => (
                  <button
                    key={location.name}
                    type="button"
                    onClick={() => setActiveLocation(location.name)}
                    className="flex w-full items-center justify-between rounded-[20px] bg-white/10 px-4 py-3 text-left transition hover:bg-white/14"
                  >
                    <div>
                      <p className="text-sm font-bold text-white/65">0{index + 1}</p>
                      <p className="mt-1 font-bold">{location.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white/85">{location.posts} posts</p>
                      <p className="mt-1 text-xs text-white/55">{formatCompactNumber(location.likes)} likes</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[33px] border-[2.5px] border-white bg-black/3 p-5 shadow-[0px_0px_10px_rgba(0,0,0,.08)]">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">Contribute</p>
            <h3 className="mt-2 text-[1.4rem] font-bold text-slate-900">Add the next community upload.</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              Share a photo or clip from your route and help fill out the public picture of St. Joseph.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 rounded-full p-[2.5px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_15px_rgba(0,0,0,.1)] active:scale-[.98] transition-transform"
            >
              <span className="flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(to_left,#007BFF,#66B2FF)] px-4 py-3 text-sm font-bold text-white">
                <Upload size={16} />
                Open uploader
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
