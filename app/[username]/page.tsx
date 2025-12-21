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

// --- Components ---

const StatCard = ({ value, label, color }: { value: string | number, label: string, color: string }) => (
  <div className="bg-white rounded-[30px] px-6 py-4 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-start justify-center relative overflow-hidden group hover:scale-[1.02] transition-transform h-full w-full">
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
    <div className="bg-white rounded-[30px] p-1 shadow-[0_0px_15px_rgba(0,0,0,0.03)] mb-4 transition-all duration-300">
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
  <div className="min-h-screen relative overflow-x-hidden bg-slate-50">
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

    {/* Give the nav real breathing room */}
    <div className="pt-[110px] max-sm:pt-[80px]">
      
      {/* HEADER BAND */}
      <div className="relative">
        {/* soft gradient band */}
        <div className="absolute inset-0 h-[220px]" />
        
        <div className="relative w-full max-w-[1450px] mx-auto px-5 pb-10">
          <div className="pt-6">
            <div className="bg-white/70 backdrop-blur rounded-[35px] border border-white shadow-[0px_10px_30px_rgba(0,0,0,0.05)] p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                
                {/* Left: identity */}
                <div className="flex items-start gap-5">
                  <div className="relative p-2 rounded-full bg-white">
                    <div className="relative w-24 h-24 border-white border-[3px] rounded-full overflow-hidden shadow-[0px_0px_20px_rgba(0,0,0,0.15)]">
                      <Image src={userAvatarUrl} alt="User" fill className="object-cover" />
                    </div>

                    <div className="absolute bg-[#007BFF] bottom-[2px] right-[10px] rotate-[-7deg] text-white px-3 py-1 rounded-full text-xs font-bold border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                      lvl 0
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
                      {displayUsername}
                    </h1>
                    <p className="text-[1rem] font-[600] text-slate-400">Site Explorer</p>

                    {profile?.bio && (
                      <p className="mt-2 max-w-[55ch] text-sm font-medium text-slate-600 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-3 justify-start sm:justify-end">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 rounded-full bg-white text-slate-700 border border-slate-100 shadow-sm hover:bg-slate-50 font-bold text-sm"
                  >
                    Upload
                  </button>

                  {isOwnProfile && (
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <Settings size={20} />
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

          {/* LEFT SIDEBAR (sticky on desktop) */}
          <aside className="lg:sticky lg:top-[130px] flex flex-col gap-6">
            
            {/* Quick Stats / Summary Card */}
            <div className="bg-white rounded-[30px] border border-slate-100 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-800">Profile Overview</p>
                <div className="text-xs font-bold text-slate-400">Public</div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {(tabStats["All"] ?? []).map((s, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                    <p className="text-lg font-black text-slate-800 leading-none">{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                    <div className={`mt-3 h-1.5 w-10 rounded-full ${s.color}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional: small card for achievements / links */}
            <div className="bg-white rounded-[30px] border border-slate-100 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] p-5">
              <p className="text-sm font-black text-slate-800 mb-3">Highlights</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-3">
                  <span className="text-sm font-bold text-slate-700">Top Badge</span>
                  <span className="text-xs font-black text-slate-500">—</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-3">
                  <span className="text-sm font-bold text-slate-700">Favorite Spot</span>
                  <span className="text-xs font-black text-slate-500">—</span>
                </div>
              </div>
            </div>

          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex flex-col gap-8">

            {/* Stats Row */}
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {tabStats[activeTab]?.map((stat, idx) => (
                <div key={idx} className="flex-1 w-full">
                  <StatCard value={stat.value} label={stat.label} color={stat.color} />
                </div>
              ))}
            </div>

            {/* Tabs + Feed wrapper card */}
            <div className="bg-white rounded-[35px] border border-slate-100 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] p-5 sm:p-7">
              
              {/* Tabs */}
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="bg-slate-50 p-1.5 rounded-full inline-flex border border-slate-100">
                  {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-2.5 rounded-full cursor-pointer text-sm font-bold transition-all duration-200
                        ${activeTab === tab 
                          ? 'bg-[#007BFF] text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Optional: filter/search */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
                  Latest activity
                </div>
              </div>

              {/* Feed */}
              <div className="mt-6 space-y-8 animate-in slide-in-from-bottom-5 duration-500 fade-in">
                {activeTab === 'All' ? (
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
          </main>
        </div>
      </div>
    </div>
  </div>
);

}