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

// --- Icons & Assets (Using Lucide where assets missing) ---
// Assuming you have these or use replacements
import devIcon from '@/public/icons/dev-icon.svg'

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

// --- Components ---

const StatCard = ({ value, label, color }: { value: string | number, label: string, color: string }) => (
  <div className="bg-white rounded-[30px] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-start justify-center min-h-[140px] relative overflow-hidden group hover:scale-[1.02] transition-transform">
    <div className="z-10">
      <div className="text-[2rem] font-black text-slate-800 leading-none mb-2">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
    {/* Colored Indicator Bar */}
    <div className={`mt-4 h-1.5 w-12 rounded-full ${color}`}></div>
  </div>
);

const ActivityCard = ({ item }: { item: ActivityItemProps }) => {
  let Icon = Trophy;
  let bgIcon = "bg-orange-50 text-orange-500";
  
  if (item.type === 'rank') {
    Icon = Trophy;
    bgIcon = "bg-orange-100 text-orange-500";
  } else if (item.type === 'visit') {
    Icon = MapPin;
    bgIcon = "bg-blue-100 text-blue-500";
  } else if (item.type === 'upload') {
    Icon = ImageIcon;
    bgIcon = "bg-red-100 text-red-500";
  }

  return (
    <div className="bg-white rounded-[24px] p-1 shadow-[0_2px_15px_rgba(0,0,0,0.03)] mb-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between p-5">
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

  const handleUpdateProfile = async (newUsername: string, newBio: string, isPrivate: boolean, newAvatarFile: File | null) => {
    // Implement update logic (kept brief for layout focus)
    setIsSettingsOpen(false);
  };
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };
  const handleDeleteAccount = async () => { /* Delete logic */ };

  const displayName = profile?.full_name || 'User';
  const displayUsername = profile?.username || 'explorer';
  const userAvatarUrl = profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${displayUsername}`;
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] mt-[100px] relative overflow-x-hidden">
      
      {/* 1. Global Background Gradient (Simulating the blue top in screenshot) */}
      {/* <div className="fixed top-0 left-0 w-full h-[50vh] pointer-events-none -z-10" /> */}

      {/* 2. Modals */}
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

      {/* 3. Navigation Component */}
      <Navigation />

      {/* 
         4. Main Content Wrapper 
         KEY CHANGE: Added `md:pl-28` to create a gutter on the left 
         for the Fixed Navigation so it never overlaps content.
      */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-5 md:pl-28 pt-[80px] pb-20">

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* --- LEFT SIDEBAR (Profile Card) --- */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-[35px] pt-12 pb-8 px-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative mt-16">
                    
                    {/* Floating Settings Button */}
                    {isOwnProfile && (
                        <button 
                            onClick={() => setIsSettingsOpen(true)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <Settings size={20} />
                        </button>
                    )}

                    {/* Avatar (Overlapping Top) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-[4px] border-slate-100 shadow-md">
                            <Image 
                                src={userAvatarUrl} 
                                alt="User" 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                    </div>

                    {/* User Text Info */}
                    <h1 className="text-3xl font-black text-slate-800 mt-6 mb-1">{displayUsername}</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Site Explorer</p>
                    
                    {/* Badges */}
                    <div className="flex justify-center gap-2 mb-6">
                         <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                            <Image src={devIcon} alt="dev" width={12} height={12} />
                            Developer
                        </span>
                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                            Level 12
                        </span>
                    </div>

                    {/* Bio */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 text-left">
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                            {profile?.bio || "No bio yet."}
                        </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex justify-center gap-6 pt-2 border-t border-slate-100 text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} /> 2024
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} /> BARBADOS
                        </div>
                    </div>
                </div>

                {/* Dark 'Weekly Quest' Card */}
                <div className="bg-[#1E293B] rounded-[30px] p-8 text-white shadow-xl relative overflow-hidden group">
                    {/* Decorative blurred blob */}
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400 border border-white/5">
                            <Trophy size={24} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-1">Weekly Quest</h3>
                        <p className="text-slate-400 text-sm font-medium mb-6">Visit 3 new sites this week to earn the Pathfinder Badge.</p>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- RIGHT CONTENT (Stats & Feed) --- */}
            <div className="lg:col-span-8 flex flex-col gap-10 mt-6 lg:mt-0">
                
                {/* 1. Stats Row (Bento Grid Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {tabStats[activeTab]?.map((stat, idx) => (
                        <StatCard 
                            key={idx} 
                            value={stat.value} 
                            label={stat.label} 
                            color={stat.color} 
                        />
                    ))}
                </div>

                {/* 2. Tabs Selector */}
                <div className="flex gap-2">
                    <div className="bg-white p-1.5 rounded-full inline-flex shadow-sm border border-slate-100">
                        {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200
                                    ${activeTab === tab 
                                        ? 'bg-[#1E293B] text-white shadow-md' 
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Activity Feed */}
                <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500 fade-in">
                    {activeTab === 'All' ? (
                        <>
                             {/* Sectioned by Date */}
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
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                                <Share2 className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-bold">No {activeTab.toLowerCase()} yet</p>
                        </div>
                    )}
                </div>

            </div>

        </div>

      </div>
    </div>
  );
}