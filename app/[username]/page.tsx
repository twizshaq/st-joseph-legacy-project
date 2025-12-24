"use client"

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Trophy, 
  MapPin, 
  Image as ImageIcon, 
  Calendar,
  Share2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import UploadModal from '@/app/components/UploadModal'; 
import Navigation from '@/app/components/ProfileNav';
import SettingsModal from '@/app/components/SettingsModal';
import { Heart, MessageCircle, Share, Info } from 'lucide-react'; // Ensure these are imported

// --- Types ---
interface ActivityItemProps {
  type: 'rank' | 'visit' | 'upload';
  title: string;
  subtitle: string;
  points: number;
  images?: string[];
  extraBadgeText?: string;
}

interface ActivitySection {
  label: string;
  items: ActivityItemProps[];
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  is_private: boolean;
}

// --- Mock Data ---
const activityData: ActivitySection[] = [
  {
    label: 'Today',
    items: [
      { type: 'rank', title: 'Ranked up to #42', subtitle: 'Moved up 10 positions', points: 250 },
      { type: 'visit', title: 'Visited All Sites', subtitle: 'Unlocked "All Sites" badge', points: 500 },
      { 
        type: 'upload', 
        title: 'Uploaded 5 items', 
        subtitle: 'Contributed to Bathsheba', 
        points: 250,
        images: ['https://i.pinimg.com/736x/8f/bb/62/8fbb625e1c77a0d60ab0477d0551b000.jpg', 'https://i.pinimg.com/736x/e8/61/55/e86155c8a8e27a4eed5df56b1b0f915f.jpg', 'https://i.pinimg.com/736x/3f/82/ac/3f82ac4cde04c3143ed4f2580d64820c.jpg']
      },
    ]
  },
  {
    label: 'Yesterday',
    items: [
      { type: 'visit', title: 'Visited Bathsheba', subtitle: 'Unlocked "Wave Master"', points: 250 },
    ]
  }
];

const tabStats: Record<string, { value: string; label: string; color: string }[]> = {
    'All': [
      { value: "3,483", label: "Points", color: "bg-pink-500" },
      { value: "12", label: "Visited", color: "bg-purple-500" },
      { value: "#8", label: "Rank", color: "bg-orange-500" },
    ],
    'Tours': [
      { value: "0", label: "Completed", color: "bg-emerald-500" },
      { value: "0", label: "Active", color: "bg-teal-500" },
      { value: "0km", label: "Distance", color: "bg-cyan-500" },
    ],
    'Badges': [
      { value: "5", label: "Unlocked", color: "bg-amber-500" },
      { value: "2", label: "Rare", color: "bg-orange-500" },
      { value: "1", label: "Epic", color: "bg-red-500" },
    ],
    'Media': [
      { value: "15", label: "Photos", color: "bg-indigo-500" },
      { value: "2", label: "Videos", color: "bg-violet-500" },
      { value: "4", label: "Reviews", color: "bg-fuchsia-500" },
    ]
  };

  const toursData = [
  {
    id: 1,
    title: "Cliffs, Coastlines, & Canopies",
    date: "February 15, 2024",
    image: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg",
    status: "Upcoming",
    type: "Guided"
  },
  {
    id: 2,
    title: "The Gardens of St. Joseph Circuit",
    date: "January 20, 2024",
    image: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg",
    status: "Active",
    type: "Self-Guided"
  },
  {
    id: 3,
    title: "Historic Bridgetown Walk",
    date: "December 10, 2023",
    image: "https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg",
    status: "Completed",
    type: "Self-Guided"
  }
];

const badgesData = [
  { id: 1, name: "Beach Bum", icon: "🏖️", desc: "Visited 5 beaches", unlocked: true, date: "Oct 12" },
  { id: 2, name: "Trail Blazer", icon: "🥾", desc: "Hiked 20km total", unlocked: true, date: "Nov 01" },
  { id: 3, name: "Early Bird", icon: "🌅", desc: "Start a tour before 7am", unlocked: true, date: "Dec 15" },
  { id: 4, name: "Night Owl", icon: "🌙", desc: "Complete a night tour", unlocked: false },
  { id: 5, name: "Social Butterfly", icon: "🦋", desc: "Share 10 moments", unlocked: false },
];

const mediaData = [
  "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596324953332-95f002b8d4de?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=300&auto=format&fit=crop"
];

// --- Components ---

const StatCard = ({ value, label, color }: { value: string | number, label: string, color: string }) => (
  <div className="bg-white rounded-[30px] px-6 py-4 shadow-[0px_0px_20px_rgba(0,0,0,0.1)] flex flex-col items-start justify-center relative overflow-hidden group hover:scale-[1.02] transition-transform h-full w-full">
    <div className="z-10">
      <div className="text-[2rem] font-black text-slate-800 leading-none mb-2">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
    {/* Colored Indicator Bar */}
    <div className={`mt-4 h-1.5 w-12 rounded-full ${color}`}></div>
  </div>
);

const TourCard = ({ tour }: { tour: any }) => {
  // Style logic based on status
  let badgeStyle = "text-slate-500 border-slate-300";
  let badgeIcon = null;

  if (tour.status === "Upcoming") {
    badgeStyle = "text-orange-500 border-orange-500 bg-orange-50";
  } else if (tour.status === "Active" || tour.type === "Self-Guided" && tour.status !== "Completed") {
    badgeStyle = "text-[#007BFF] border-[#007BFF] bg-blue-50";
  } else if (tour.status === "Completed") {
    badgeStyle = "text-green-600 border-green-600 bg-green-50";
  }

  return (
    <div className="group bg-slate-100/50 hover:bg-white border border-transparent hover:border-slate-200 rounded-[24px] p-2 flex gap-4 transition-all duration-300 mb-4 shadow-sm hover:shadow-md">
      {/* Image Section */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-[20px] overflow-hidden">
        <Image 
          src={tour.image} 
          alt={tour.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col py-1 pr-2 relative">
        
        {/* Top Row: Badge & Date */}
        <div className="flex justify-between items-start mb-1">
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${badgeStyle}`}>
            {tour.status === "Completed" ? "Completed" : tour.type}
          </span>
          <span className="text-[10px] font-bold text-slate-400">{tour.date}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-auto mt-1 line-clamp-2">
          {tour.title}
        </h3>

        {/* Bottom Row: Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <Heart size={18} />
          </button>
          <button className="text-slate-400 hover:text-blue-500 transition-colors">
            <Share size={18} />
          </button>
           {/* Different icon based on status */}
          <button className="text-slate-400 hover:text-slate-700 transition-colors">
            {tour.status === 'Upcoming' ? <MessageCircle size={18} /> : <Share2 size={18} className="rotate-180"/> } 
          </button>
        </div>
      </div>
    </div>
  );
};

  const MediaGrid = () => (
  <div className="columns-2 md:columns-3 gap-4 space-y-4">
    {mediaData.map((src, i) => (
      <div key={i} className="relative group rounded-[20px] overflow-hidden break-inside-avoid">
        <img src={src} alt="User upload" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-1 text-white font-bold">
                <Heart size={16} fill="white" /> <span>24</span>
            </div>
        </div>
      </div>
    ))}
  </div>
);

const BadgesGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {badgesData.map((badge) => (
      <div 
        key={badge.id} 
        className={`
          relative flex flex-col items-center text-center p-6 rounded-[30px] border 
          ${badge.unlocked 
            ? 'bg-white border-slate-100 shadow-[0px_5px_20px_rgba(0,0,0,0.05)]' 
            : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
          }
        `}
      >
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h4 className="font-black text-slate-800 text-sm mb-1">{badge.name}</h4>
        <p className="text-xs text-slate-500 font-medium leading-tight mb-2">{badge.desc}</p>
        {badge.unlocked && (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Unlocked {badge.date}
          </span>
        )}
        {!badge.unlocked && (
           <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>
    ))}
  </div>
);

const ActivityCard = ({ item }: { item: ActivityItemProps }) => {
  let Icon = Trophy;
  let bgIcon = "bg-orange-50 text-orange-500";
  let iconBg = 'bg-gray-100';
  let borderClass = 'bg-red-500';
  let bgClass = 'bg-white';
  
  if (item.type === 'rank') {
    borderClass = 'bg-gradient-to-r from-orange-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-orange-200 via-white via-80% to-white';
    iconBg = 'text-orange-500';
    Icon = Trophy;
  } else if (item.type === 'visit') {
    Icon = MapPin;
    bgIcon = "bg-blue-100 text-blue-500";
    borderClass = 'bg-gradient-to-r from-blue-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-blue-200 via-white via-80% to-white';
    iconBg = 'text-blue-500';
  } else if (item.type === 'upload') {
    Icon = ImageIcon;
    bgIcon = "bg-red-100 text-red-500";
    borderClass = 'bg-gradient-to-r from-red-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-red-200 via-white via-80% to-white';
    iconBg = 'text-red-500';
  }

  return (
    <div className={`backdrop-blur-[3px] rounded-[32px] w-[100%] px-auto p-[3px] mb-4 shadow-[0px_0px_30px_rgba(0,0,0,0.1)] ${borderClass}`}>
      <div className={` rounded-[30px] p-0 ${bgClass}`}>
          <div className="flex items-start justify-between p-3">
              <div className="flex gap-5">
                  {/* Icon Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgIcon}`}>
                      <Icon size={20} strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex flex-col pt-1">
                      <h4 className="font-bold text-slate-800 text-[1rem] leading-tight">{item.title}</h4>
                      {item.subtitle && <p className="text-sm text-slate-400 mt-1">{item.subtitle}</p>}
                      
                      {/* Image Gallery inside card */}
                      {item.images && (
                          <div className="flex gap-2 mt-4">
                              {item.images.map((src, i) => (
                                  <div key={i} className="relative w-12 h-12 rounded-[12px] overflow-hidden border border-slate-100 shadow-sm hover:scale-110 transition-transform">
                                      <img src={src} alt="content" className="object-cover w-full h-full" />
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              
              {/* Points Badge */}
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  <span className="text-[11px] font-black text-slate-600">+{item.points} PTS</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Logic hooks
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
              .from('profiles')
              .select('*')
              .eq('username', decodedUsername)
              .maybeSingle();

          if (profileData) setProfile(profileData);
          
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) setCurrentUser(authData.user);
          setLoading(false);
      };

      fetchProfileData();
  }, [usernameFromUrl, supabase]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
  const handleDeleteAccount = async () => { /* Delete logic */ };

  const displayName = profile?.full_name || 'User';
  const displayUsername = profile?.username || 'explorer';
  const userAvatarUrl = profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${displayUsername}`;
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  if (loading) return null;

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
        const fileExt = newAvatarFile.name.split('.').pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, newAvatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        finalAvatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: newUsername,
          bio: newBio,
          is_private: isPrivate, 
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? ({
        ...prev,
        username: newUsername,
        bio: newBio,
        avatar_url: finalAvatarUrl || prev.avatar_url
      }) : null);

      setIsSettingsOpen(false);
      
      if (profile?.username !== newUsername) {
         router.push(`/profile/${newUsername}`);
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Modals */}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialAvatarUrl={userAvatarUrl}
        initialUsername={profile?.username || ""}
        initialBio={profile?.bio || ""}
        onSave={handleUpdateProfile}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        isSaving={isSaving}
      />

      {/* NAV */}
      <div className="relative z-50">
        <Navigation />
      </div>

      {/* Main Container */}
      <div className="pt-[110px] max-sm:pt-[80px] md:pl-[200px] px-5 pb-20 max-w-[1600px] mx-auto">
        
        {/* FLEX ROW: Sidebar (Profile) + Main Content (Stats/Feed) */}
        <div className="flex flex-col xl:flex-row gap-10 items-start justify-center mt-[100px] max-sm:mt-[40px] ">
          
          {/* --- LEFT COLUMN: Profile Info (Previously Header Band) --- */}
          {/* Added 'sticky' so it follows user on scroll on large screens */}
          <div className="w-full xl:w-[400px] shrink-0 xl:sticky">
            
            <div className="rounded-[35px] bg-white/0 relative">
                <div className="flex items-start gap-6">
                  
                  {/* Avatar & Badge */}
                  <div className="relative">
                    <div className="relative w-28 h-28 max-sm:w-26 max-sm:h-26 border-white border-[3px] rounded-full overflow-hidden shadow-[0px_0px_30px_rgba(0,0,0,0.15)]">
                      <Image src={userAvatarUrl} alt="User" fill className="object-cover" />
                    </div>
                    <div className="absolute bg-[#007BFF] bottom-[-7px] right-[10px] rotate-[-5deg] text-white px-3 py-1 rounded-full text-xs font-bold border-[2px] border-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
                      lvl 12
                    </div>
                  </div>

                  {/* Text Info */}
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-3xl font-black text-slate-800 leading-tight">
                        {displayUsername}
                        </h1>
                        
                        {/* Settings Cog */}
                        {isOwnProfile && (
                            <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                            >
                            <Settings size={20} />
                            </button>
                        )}
                    </div>

                    <p className="text-[1rem] font-[600] text-slate-400">Site Explorer</p>
                    
                    {profile?.bio && (
                      <p className="text-sm font-medium text-slate-600 leading-relaxed mt-[2px]">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                </div>
            </div>

            {/* Optional Sidebar Widget: Highlights */}
            <div className="rounded-[35px] mt-[30px]">
            {/* Widget Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Profile Overview</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {profile?.is_private ? 'Private' : 'Public'}
                </span>
            </div>

            {/* Mini Stats Grid */}
            <div className="flex gap-4 w-full">
                {tabStats[activeTab]?.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 active:scale-[.98] bg-slate-50 rounded-[24px] p-4 flex flex-col justify-between min-h-[70px] border border-slate-100 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <div className="text-2xl font-black text-slate-800 leading-none mb-2">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {stat.label}
                      </div>
                    </div>
                    
                    {/* Colored Bar */}
                    <div className={`mt-3 h-1.5 w-8 rounded-full ${stat.color}`}></div>
                  </div>
                ))}
            </div>
        </div>

          </div>

          {/* --- RIGHT COLUMN: Stats & Feed --- */}
          <div className="flex-1 w-full max-w-[650px] flex flex-col gap-10 min-w-0">
            
            {/* Stats Row */}
            {/* <div className="flex flex-col sm:flex-row gap-6 w-full">
              {tabStats[activeTab]?.map((stat, idx) => (
                <div key={idx} className="flex-1 w-full">
                  <StatCard value={stat.value} label={stat.label} color={stat.color} />
                </div>
              ))}
            </div> */}

            {/* Tabs + Feed */}
            <div className="rounded-[35px] p-1 sm:p-0">
              
              {/* Tabs */}
              <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
                <div className="bg-white p-1.5 rounded-full inline-flex border border-slate-100 shadow-sm">
                  {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-2.5 rounded-full active:scale-[.97] cursor-pointer text-sm font-bold transition-all duration-200
                        ${activeTab === tab 
                          ? 'bg-[#007BFF] text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Content */}
              <div className="animate-in slide-in-from-bottom-5 duration-500 fade-in">
                
                {activeTab === 'All' && (
                  <>
                    {activityData.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                          {section.label}
                        </h3>
                        <div className="space-y-0">
                          {section.items.map((item, itemIdx) => (
                            <ActivityCard key={itemIdx} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeTab === 'Tours' && (
                  <div className="flex flex-col">
                    {toursData.map(tour => <TourCard key={tour.id} tour={tour} />)}
                  </div>
                )}

                {activeTab === 'Badges' && <BadgesGrid />}

                {activeTab === 'Media' && <MediaGrid />}

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}