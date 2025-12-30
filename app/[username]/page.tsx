"use client"

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Trophy, 
  MapPin, 
  Image as ImageIcon, 
  Calendar,
  Share2,
  Lock
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import UploadModal from '@/app/components/UploadModal'; 
import Navigation from '@/app/components/ProfileNav';
import SettingsModal from '@/app/components/SettingsModal';
import { Heart, MessageCircle, Share } from 'lucide-react';
import ArrowIcon from "@/public/icons/arrow-icon"

// --- Types ---
interface ActivityItemProps {
  type: 'rank' | 'visit' | 'upload';
  title: string;
  subtitle: string;
  points: number;
  images?: string[];
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
    type: "Upcoming"
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

const TourCard = ({ tour }: { tour: any }) => {
  let badgeStyle = "text-slate-500 border-slate-300";

  if (tour.status === "Upcoming") {
    badgeStyle = "text-[#FFA000] border-[#FFA000] bg-[#FFA000]/20 border-[1.5px]";
  } else if (tour.status === "Active" || tour.type === "Self-Guided" && tour.status !== "Completed") {
    badgeStyle = "text-[#208BFF] border-[#208BFF] bg-[#208BFF]/20 border-[1.5px]";
  } else if (tour.status === "Completed") {
    badgeStyle = "text-[#00A835] border-[#00A835] bg-[#00FF03]/20 border-[1.5px]";
  }

  return (
    <div className={`bg-white cursor-pointer active:scale-[.99] rounded-[40px] w-[100%] h-[100%] px-auto p-[3px] mb-4 shadow-[0px_0px_30px_rgba(0,0,0,0.08)]`}>
    <div className="group bg-black/4 rounded-[38px] p-2 flex gap-4">
      {/* <div className={`bg-black/3 rounded-[30px]`}> */}
        <div className="relative w-20 h-20 shrink-0 rounded-[30px] overflow-hidden">
          <Image src={tour.image} alt={tour.title} fill className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col py-1 pr-2 relative">
          <div className="flex justify-between items-start mb-1">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${badgeStyle}`}>
              {tour.status === "Completed" ? "Completed" : tour.type}
            </span>
            <span className="text-[10px] font-bold text-slate-400 mr-[5px] mt-[5px]">{tour.date}</span>
          </div>
          <h3 className="font-bold text-slate-800 text-[1rem] leading-tight mb-auto mt-1 line-clamp-2  max-sm:max-w-[150px]">{tour.title}</h3>
          <div className="flex absolute bottom-0 right-[10px]">
            {/* <button className="text-slate-400 hover:text-red-500 transition-colors"><Heart size={18} /></button> */}
            <button className="text-slate-400 hover:text-blue-500 transition-colors rotate-[180deg]"><ArrowIcon color="#666" /></button>
            {/* <button className="text-slate-400 hover:text-slate-700 transition-colors">
              {tour.status === 'Upcoming' ? <MessageCircle size={18} /> : <Share2 size={18} className="rotate-180"/> } 
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaGrid = () => (
  <div className="columns-2 md:columns-3 gap-4 space-y-4">
    {mediaData.map((src, i) => (
      <div key={i} className="relative group rounded-[20px] overflow-hidden break-inside-avoid">
        <Image src={src} alt="User upload" className="w-full h-auto object-cover" />
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
      <div key={badge.id} className={`relative flex flex-col items-center text-center p-6 rounded-[30px] border ${badge.unlocked ? 'bg-white border-slate-100 shadow-[0px_5px_20px_rgba(0,0,0,0.05)]' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h4 className="font-black text-slate-800 text-sm mb-1">{badge.name}</h4>
        <p className="text-xs text-slate-500 font-medium leading-tight mb-2">{badge.desc}</p>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badge.unlocked ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-200'}`}>
            {badge.unlocked ? `Unlocked ${badge.date}` : 'Locked'}
        </span>
      </div>
    ))}
  </div>
);

const ActivityCard = ({ item }: { item: ActivityItemProps }) => {
  let Icon = Trophy;
  let bgIcon = "bg-orange-50 text-orange-500";
  
  if (item.type === 'rank') {
    Icon = Trophy;
  } else if (item.type === 'visit') {
    Icon = MapPin;
    bgIcon = "bg-blue-100 text-blue-500";
  } else if (item.type === 'upload') {
    Icon = ImageIcon;
    bgIcon = "bg-red-100 text-red-500";
  }

  return (
    <div className={`bg-white rounded-[32px] w-[100%] px-auto p-[3px] mb-4 shadow-[0px_0px_30px_rgba(0,0,0,0.08)]`}>
      <div className={`bg-black/4 rounded-[30px]`}>
          <div className="flex items-start justify-between p-3">
              <div className="flex gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgIcon}`}>
                      <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col pt-1">
                      <h4 className="font-bold text-slate-800 text-[1rem] leading-tight">{item.title}</h4>
                      {item.subtitle && <p className="text-sm text-slate-400 mt-1">{item.subtitle}</p>}
                      {item.images && (
                          <div className="flex gap-2 mt-4">
                              {item.images.map((src, i) => (
                                  <div key={i} className="relative w-12 h-12 rounded-[12px] overflow-hidden border border-slate-100 shadow-sm hover:scale-110 transition-transform">
                                      <Image width={20} height={20} src={src} alt="content" className="object-cover w-full h-full" />
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
              <span className="text-[11px] font-black text-slate-600 mr-[5px]">+{item.points} Pts</span>
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
  const userAvatarUrl = profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${displayUsername}`;
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  // Content is visible if it's your own profile OR if the profile is NOT private
  const isContentVisible = isOwnProfile || !profile?.is_private;

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
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, newAvatarFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrl;
      }
      const { error: updateError } = await supabase.from('profiles').update({
          username: newUsername,
          bio: newBio,
          is_private: isPrivate, 
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        }).eq('id', currentUser.id);

      if (updateError) throw updateError;
      setProfile(prev => prev ? ({ ...prev, username: newUsername, bio: newBio, avatar_url: finalAvatarUrl || prev.avatar_url, is_private: isPrivate }) : null);
      setIsSettingsOpen(false);
      if (profile?.username !== newUsername) { router.push(`/profile/${newUsername}`); }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialAvatarUrl={userAvatarUrl}
        initialUsername={profile?.username || ""}
        initialBio={profile?.bio || ""}
        initialIsPrivate={profile?.is_private}
        onSave={handleUpdateProfile}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        isSaving={isSaving}
      />

      <div className="relative z-50"><Navigation /></div>

      <div className="pt-[110px] max-sm:pt-[80px] md:pl-[200px] px-5 pb-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-10 items-start justify-center mt-[100px] max-sm:mt-[40px] ">
          
          {/* --- LEFT COLUMN --- */}
          <div className="w-full xl:w-[400px] shrink-0 xl:sticky">
            <div className="rounded-[35px] bg-white/0 relative">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="relative w-28 h-28 max-sm:w-26 max-sm:h-26 border-white border-[3px] rounded-full overflow-hidden shadow-[0px_0px_30px_rgba(0,0,0,0.15)]">
                      <Image src={userAvatarUrl} alt="User" fill className="object-cover" unoptimized/>
                    </div>
                    <div className="absolute bg-[#007BFF] bottom-[-7px] right-[10px] rotate-[-5deg] text-white px-3 py-1 rounded-full text-xs font-bold border-[2px] border-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
                      lvl 12
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-3xl font-black text-slate-800 leading-tight">{displayUsername}</h1>
                        {isOwnProfile && (
                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 cursor-pointer active:scale-[.95] rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                              <Settings size={25} />
                            </button>
                        )}
                    </div>
                    <p className="text-[1rem] font-[600] text-slate-400">Site Explorer</p>
                    {profile?.bio && (<p className="text-sm font-medium text-slate-600 leading-relaxed mt-[2px]">{profile.bio}</p>)}
                  </div>
                </div>
            </div>

            {isContentVisible && (
              <div className="rounded-[35px] mt-[30px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Profile Overview</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{profile?.is_private ? 'Private' : 'Public'}</span>
                </div>
                <div className="flex gap-4 w-full">
                    {tabStats[activeTab]?.map((stat, idx) => (
                      <div key={idx} className="flex-1 active:scale-[.98] shadow-[0px_0px_30px_rgba(0,0,0,0.06)] bg-black/4 rounded-[30px] p-4 flex flex-col justify-between min-h-[60px] border-[3px] border-white hover:bg-slate-100 transition-colors">
                        <div>
                          <div className="text-2xl font-black text-slate-800 leading-none mb-2">{stat.value}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                        <div className={`mt-3 h-1.5 w-8 rounded-full ${stat.color}`}></div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex-1 w-full max-w-[650px] flex flex-col gap-10 min-w-0">
            <div className="rounded-[35px] p-1 sm:p-0">
              
              {/* TABS (Always Visible) */}
              <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
                <div className="bg-black/4 p-1.5 rounded-full inline-flex border-[3px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.08)]">
                  {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-2.5 rounded-full active:scale-[.97] cursor-pointer text-sm font-bold transition-all duration-200
                        ${activeTab === tab ? 'bg-[#007BFF] text-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]' : 'text-slate-500 hover:text-slate-800'}
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* FEED CONTENT (Only if Visible) */}
              {isContentVisible && (
                  <div className="animate-in slide-in-from-bottom-5 duration-500 fade-in">
                    {activeTab === 'All' && (
                      <>
                        {activityData.map((section, idx) => (
                          <div key={idx}>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">{section.label}</h3>
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
                      <div className="flex flex-col gap-3">
                        
                        {/* 1. UPCOMING SECTION */}
                        {toursData.filter(t => t.status === "Upcoming").length > 0 && (
                          <div>
                            {/* <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Upcoming</h3> */}
                            {toursData.filter(t => t.status === "Upcoming").map(tour => (
                              <TourCard key={tour.id} tour={tour} />
                            ))}
                          </div>
                        )}

                        {/* 2. ACTIVE SECTION */}
                        {toursData.filter(t => t.status === "Active").length > 0 && (
                          <div className="relative">
                            {/* The Separator Line */}
                            <div className="w-[200px] h-[1.8px] bg-slate-200/80 mx-auto mb-8 rounded-full"></div>
                            
                            {/* <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Active</h3> */}
                            {toursData.filter(t => t.status === "Active").map(tour => (
                              <TourCard key={tour.id} tour={tour} />
                            ))}
                          </div>
                        )}

                        {/* 3. COMPLETED SECTION */}
                        {toursData.filter(t => t.status === "Completed").length > 0 && (
                          <div className="relative">
                            {/* The Separator Line */}
                            <div className="w-[200px] h-[1.8px] bg-slate-200/80 mx-auto mb-8 rounded-full"></div>

                            {/* <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Completed</h3> */}
                            {toursData.filter(t => t.status === "Completed").map(tour => (
                              <TourCard key={tour.id} tour={tour} />
                            ))}
                          </div>
                        )}

                      </div>
                    )}

                    {activeTab === 'Badges' && <BadgesGrid />}

                    {activeTab === 'Media' && <MediaGrid />}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* --- PRIVATE VIEW MESSAGE (Centered below columns) --- */}
        {!isContentVisible && (
            <div className="w-full max-w-[1050px] flex justify-center mt-12 animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center text-center rounded-[35px] w-full max-w-3xl">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                    <Lock size={32} className="text-slate-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">This account is private</h2>
                    <p className="text-sm font-medium text-slate-500 max-w-[300px] leading-relaxed">
                    {displayUsername} has restricted access to their {activeTab === 'Media' ? 'photos and videos' : activeTab === 'All' ? 'activity' : activeTab.toLowerCase()}.
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}