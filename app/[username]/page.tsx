"use client"

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Trophy, 
  MapPin, 
  Image as ImageIcon, 
  LogOut,
  Save,
  X,
  Edit2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import UploadModal from '@/app/components/UploadModal'; 
import Navigation from '@/app/components/ProfileNav';
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
}

// --- Mock Data (Kept same as yours) ---
const activityData: ActivitySection[] = [
  {
    label: 'Today',
    items: [
      { type: 'rank', title: 'Ranked up to #42', subtitle: 'Moved up 10 positions on the leaderboard', points: 250 },
      { type: 'visit', title: 'Visited All Sites', subtitle: 'Unlocked the "All Sites" badge', points: 250 },
      { 
        type: 'upload', 
        title: 'Uploaded 5 items', 
        subtitle: '', 
        points: 250,
        images: ['/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40']
      },
    ]
  },
  {
    label: 'Yesterday',
    items: [
      { type: 'visit', title: 'Visited Bathsheba', subtitle: 'unlocked the "Wave Master" badge', points: 250, extraBadgeText: '+5' },
    ]
  },
  {
    label: 'Last 7 days',
    items: [
      { 
        type: 'upload', 
        title: 'Uploaded 10 items', 
        subtitle: '', 
        points: 250,
        images: ['/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40', '/api/placeholder/40/40']
      },
      { type: 'rank', title: 'Ranked up to #52', subtitle: 'Moved up 10 positions on the leaderboard', points: 250 },
    ]
  }
];

// --- Components ---
const StatCard = ({ 
  value, 
  label, 
  gradient, 
  className = "" 
}: { value: string | number, label: string, gradient: string, className?: string }) => (
  <div className={`rounded-[27px] px-4 py-2 text-white ${gradient} ${className} flex flex-col justify-center`}>
    <div className="text-[1.3rem] font-bold">{value}</div>
    <div className="text-sm font-medium opacity-90">{label}</div>
  </div>
);
const tabStats: Record<string, { value: string; label: string; gradient: string }[]> = {
    'All': [
      { value: "3,483", label: "Total Points", gradient: "bg-[#FF1A84]" },
      { value: "1", label: "Sites Visited", gradient: "bg-[#A100C9]" },
      { value: "#12", label: "Current Rank", gradient: "bg-[#FFA000]" },
    ],
    'Tours': [
      { value: "0", label: "Completed", gradient: "bg-emerald-500" },
      { value: "0", label: "In Progress", gradient: "bg-teal-500" },
      { value: "0km", label: "Distance", gradient: "bg-cyan-500" },
    ],
    'Badges': [
      { value: "5", label: "Unlocked", gradient: "bg-amber-500" },
      { value: "2", label: "Rare Finds", gradient: "bg-orange-500" },
      { value: "1", label: "Legendary", gradient: "bg-rose-500" },
    ],
    'Media': [
      { value: "15", label: "Photos", gradient: "bg-indigo-500" },
      { value: "2", label: "Videos", gradient: "bg-violet-500" },
      { value: "4", label: "Reviews", gradient: "bg-fuchsia-500" },
    ]
  };

const ActivityCard = ({ item }: { item: ActivityItemProps }) => {
  let bgClass = 'bg-white';
  let iconBg = 'bg-gray-100';
  let Icon = Trophy;
  let borderClass = 'bg-red-500';

  if (item.type === 'rank') {
    borderClass = 'bg-gradient-to-r from-orange-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-orange-200 via-white via-80% to-white';
    iconBg = 'text-orange-500';
    Icon = Trophy;
  } else if (item.type === 'visit') {
    borderClass = 'bg-gradient-to-r from-blue-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-blue-200 via-white via-80% to-white';
    iconBg = 'text-blue-500';
    Icon = MapPin;
  } else if (item.type === 'upload') {
    borderClass = 'bg-gradient-to-r from-red-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-red-200 via-white via-80% to-white';
    iconBg = 'text-red-500';
    Icon = ImageIcon;
  }

  if (item.title.includes('Bathsheba')) {
    borderClass = 'bg-gradient-to-r from-purple-400 via-white via-50% to-white';
    bgClass = 'bg-gradient-to-r from-purple-200 via-white via-80% to-white';
    iconBg = 'text-purple-500';
  }

  return (
    <div className={`mb-3 active:scale-[.99] rounded-[33px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] ${borderClass}`}>
      <div className={`relative p-4 rounded-[30px] ${bgClass}`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className={`mt-1`}>
              <Icon className={`${iconBg}`} size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{item.title}</h4>
              {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
              {item.images && (
                <div className="flex gap-2 mt-3">
                  {item.images.map((src, i) => (
                    <img key={i} src={src} alt="uploaded" className="w-10 h-10 rounded-[15px] object-cover border-2 border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]" />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 block">+{item.points} pts</span>
            {item.extraBadgeText && (
              <span className="text-lg font-bold text-gray-800 block mt-2">{item.extraBadgeText}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Settings & Edit States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  
  const params = useParams();
  const usernameFromUrl = params?.username as string;
  const [notFound, setNotFound] = useState(false); // <--- Make sure this exists
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 1. Fetch User AND Profile Data
  useEffect(() => {
      const fetchProfileData = async () => {
          setLoading(true); // Start loading
          setNotFound(false); // Reset not found

          if (!usernameFromUrl) return;

          const decodedUsername = decodeURIComponent(usernameFromUrl);
          
          // Query Supabase
          const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('username', decodedUsername)
              .maybeSingle(); // <--- USE maybeSingle() INSTEAD OF single()

          // If no data returned, it doesn't exist
          if (error || !profileData) {
              setNotFound(true);
              setLoading(false);
              return; // <--- STOP EXECUTION HERE
          }

          setProfile(profileData);
          setNewUsername(profileData.username);

          // Check current user ownership
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            setCurrentUser(authData.user);
          }
          
          setLoading(false);
      };

      fetchProfileData();
  }, [usernameFromUrl, supabase]);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/');
  };

  // 2. Handle Username Update
  const handleUpdateProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    setUpdateError("");

    // Simple validation
    const formattedUsername = newUsername.trim().toLowerCase().replace(/\s+/g, '_');
    
    if (formattedUsername.length < 3) {
        setUpdateError("Username must be at least 3 chars");
        setIsSaving(false);
        return;
    }

    try {
        // Check uniqueness (unless it's the same username)
        if (formattedUsername !== profile.username) {
            const { data: existing } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', formattedUsername)
                .single();

            if (existing) {
                setUpdateError("Username already taken");
                setIsSaving(false);
                return;
            }
        }

        // Update database
        const { error } = await supabase
            .from('profiles')
            .update({ username: formattedUsername })
            .eq('id', profile.id);

        if (error) throw error;

        // Update local state
        setProfile({ ...profile, username: formattedUsername });
        setNewUsername(formattedUsername);
        setIsEditing(false);
        setIsSettingsOpen(false); // Close dropdown
    } catch (err) {
        setUpdateError("Failed to update. Try again.");
    } finally {
        setIsSaving(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const displayUsername = profile?.username || 'User Not Found';
  const userAvatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${displayName}`;

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="animate-spin w-12 h-12 bg-blue-500 rounded-full border-4 border-white border-t-transparent shadow-lg" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center pb-20">

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

      <Navigation />

      <div className="w-full max-w-7xl bg-red-500/0 flex gap-8 p-4 md:p-8 mt-24">

        <div className="flex-1 w-full max-w-[700px] mx-auto">
          
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex justify-center gap-4 items-start w-full">
              {/* Avatar */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 shadow-[0px_0px_10px_rgba(0,0,0,0)]">
                 <Image 
                    src={userAvatarUrl}
                    alt="User Avatar"
                    layout="fill"
                    objectFit="cover"
                    />
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0 pt-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-[#8BCBFF] flex gap-[4px] text-[#007BFF] border-[1.5px] border-[#007BFF] text-[.75rem] px-2 py-0.5 rounded-full font-[600] items-center">
                    <Image src={devIcon} alt='dev icon' height={14} className="w-3.5 h-3.5" />
                    DEV
                  </span>
                  <span className="bg-[#FFE3B3] text-[#FFA000] border-[1.5px] border-[#FFA000] text-[.75rem] px-2 py-0.5 rounded-full font-[600]">
                    #12 Rank
                  </span>
                </div>

                {/* --- Username & Edit Mode --- */}
                {isEditing ? (
                   <div className="flex flex-col items-start gap-2 max-w-[250px]">
                      <div className="flex items-center gap-2 w-full">
                        <input 
                            type="text" 
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                            autoFocus
                        />
                        <button onClick={handleUpdateProfile} disabled={isSaving} className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                            <Save size={18}/>
                        </button>
                        <button onClick={() => { setIsEditing(false); setNewUsername(profile?.username || ""); }} className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                            <X size={18}/>
                        </button>
                      </div>
                      {updateError && <p className="text-xs text-red-500 font-medium">{updateError}</p>}
                   </div>
                ) : (
                    <div className="group flex items-center gap-2">
                        <h1 className="text-[1.5rem] font-bold text-gray-900 truncate">
                            {displayUsername}
                        </h1>
                        {/* <p className="text-sm text-gray-500 font-medium pt-1">({displayName})</p> */}
                    </div>
                )}
                
                {/* Level Progress */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2.5 w-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <div className="h-full w-2/3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Lvl 630</span>
                </div>
                {/* --- DESKTOP BIO (Hidden on mobile, Visible on MD+) --- */}
                <p className="hidden md:block text-sm text-gray-600 mt-3 leading-relaxed">
                    I like to travel, and explore the various parishes throughout Barbados. 🇧🇧
                </p>
              </div>
            </div>
            
            {/* Settings Dropdown */}
            <div className="relative shrink-0 ml-2">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 active:scale-95"
              >
                <Settings size={24} />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                   <div className="p-1.5">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setIsSettingsOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                        <Edit2 size={16} className="text-blue-500"/>
                        Edit Username
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* --- MOBILE BIO (Visible on mobile, Hidden on MD+) --- */}
          {/* This places it physically under the flex container of the user header */}
          <p className="md:hidden text-sm text-gray-600 mb-3 leading-relaxed">
             I like to travel, and explore the various parishes throughout Barbados. 🇧🇧
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 py-2 overflow-x-auto overflow-y-visible bg-red-500/0 no-scrollbar">
            {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-2xl cursor-pointer active:scale-95 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab 
                    ? 'bg-blue-500 text-white shadow-[0px_0px_7px_rgba(0,0,0,0.2)]' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                >
                {tab}
                </button>
            ))}
            </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
            {tabStats[activeTab]?.map((stat, index) => (
              <div 
                key={`${activeTab}-${index}`} // Key ensures animation restarts on tab change
                className={`
                  relative overflow-hidden
                  ${stat.gradient}/60 backdrop-blur-[3px] rounded-[30px] p-[3px] 
                  shadow-[0px_0px_20px_rgba(0,0,0,0.2)] active:scale-[.99]
                  hover:scale-[1.02]
                  ${index === 2 ? 'col-span-2 md:col-span-1' : 'col-span-1'} 
                  h-full
                `}
              >
                <StatCard 
                  value={stat.value} 
                  label={stat.label} 
                  gradient={stat.gradient} 
                  className="h-full"
                />
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-[200px] animate-in slide-in-from-bottom-2 fade-in duration-300">
            {activeTab === 'All' && (
              <div className="space-y-6">
                {activityData.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4 ml-1">{section.label}</h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <ActivityCard key={itemIdx} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
             {/* Simple placeholders for other tabs to prevent crash */}
             {activeTab === 'Tours' && <div className="text-center p-10 text-gray-400">No tours yet.</div>}
             {activeTab === 'Badges' && <div className="text-center p-10 text-gray-400">No badges yet.</div>}
             {activeTab === 'Media' && <div className="text-center p-10 text-gray-400">No media yet.</div>}
          </div>

        </div>
      </div>
    </div>
  );
}