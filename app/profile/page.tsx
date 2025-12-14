"use client"

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Trophy, 
  MapPin, 
  Image as ImageIcon, 
  MoreHorizontal, 
  Globe, 
  BarChart2, 
  ChevronDown,
  X,
  UploadCloud,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import UploadModal from '@/app/components/UploadModal'; 
import Navigation from '@/app/components/ProfileNav';
import Link from 'next/link';
// --- Icons ---
import ExploreIcon from '@/public/icons/explore-icon';
import UploadIcon from '@/public/icons/upload-icon';
import LeaderboardIcon from '@/public/icons/leaderboard-icon';
import { ProfileIcon } from '@/public/icons/profile-icon';
import { AlertIcon } from '@/public/icons/alert-icon';
import devIcon from '@/public/icons/dev-icon.svg'
import feedbackIcon from '@/public/icons/feedback-icon.svg'

// --- Types ---
interface ActivityItemProps {
  type: 'rank' | 'visit' | 'upload';
  title: string;
  subtitle: string;
  points: number;
  images?: string[];
  extraBadgeText?: string; // For the "+5" in the bottom card
}

interface ActivitySection {
  label: string;
  items: ActivityItemProps[];
}


// --- Mock Data ---
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

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 p-3 text-black font-[500] rounded-xl cursor-pointer transition-colors ${active ? '' : ''}`}>
    <Icon size={25} className={active ? 'text-black' : 'text-black'} />
    <span>{label}</span>
  </div>
);

const StatCard = ({ 
  value, 
  label, 
  gradient, 
  className = "" 
}: { value: string | number, label: string, gradient: string, className?: string }) => (
  <div className={`rounded-[35px] p-5 text-white ${gradient} ${className} flex flex-col justify-center`}>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm font-medium opacity-90">{label}</div>
  </div>
);


const ActivityCard = ({ item }: { item: ActivityItemProps }) => {
  // Determine styling based on activity type
  let bgClass = 'bg-white';
  let iconBg = 'bg-gray-100';
  let Icon = Trophy; // Default

  if (item.type === 'rank') {
    bgClass = 'bg-gradient-to-r from-orange-50 to-white border border-orange-100';
    iconBg = 'text-orange-500';
    Icon = Trophy;
  } else if (item.type === 'visit') {
    bgClass = 'bg-gradient-to-r from-blue-50 to-white border border-blue-100';
    iconBg = 'text-blue-500';
    Icon = MapPin; // Using MapPin as a shield substitute
  } else if (item.type === 'upload') {
    bgClass = 'bg-gradient-to-r from-red-50 to-white border border-red-100';
    iconBg = 'text-red-500';
    Icon = ImageIcon;
  }

  // Visited Bathsheba specific styling from screenshot (Purple/Pinkish)
  if (item.title.includes('Bathsheba')) {
    bgClass = 'bg-gradient-to-r from-purple-50 to-white border border-purple-100';
    iconBg = 'text-purple-500';
  }


  



  return (
    <div className={`relative p-4 mb-3 rounded-[30px] shadow-sm ${bgClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {/* Icon Circle */}
          <div className={`mt-1`}>
             <Icon className={`${iconBg}`} size={24} />
          </div>
          
          {/* Text Content */}
          <div>
            <h4 className="font-bold text-gray-900">{item.title}</h4>
            {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
            
            {/* Image Gallery Grid */}
            {item.images && (
               <div className="flex gap-2 mt-3 overflow-hidden">
                 {item.images.map((src, i) => (
                   <img 
                    key={i} 
                    src={src} 
                    alt="uploaded" 
                    className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm" 
                   />
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Points */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 block">+{item.points} pts</span>
          {item.extraBadgeText && (
            <span className="text-lg font-bold text-gray-800 block mt-2">{item.extraBadgeText}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const supabase = createClient();
    const router = useRouter();
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // const [activeTab, setActiveTab] = useState('contributions');

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            
            if (error || !data.user) {
                router.push('/'); // Redirect to home to trigger auth modal
            } else {
                setUser(data.user);
            }
            setLoading(false);
        };

        fetchUser();
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const meta = user?.user_metadata;
    const userName = meta?.full_name || 
                   (meta?.first_name && meta?.last_name ? `${meta.first_name} ${meta.last_name}` : null) || 
                   user?.email?.split('@')[0] || 'Anonymous User';
    
    const userAvatarUrl = meta?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${userName}`;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div
                  aria-label="Loading"
                  className="animate-spin w-12 h-12 bg-blue-500 [mask-image:url('/loading-icon.png')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] [-webkit-mask-image:url('/loading-icon.png')] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:contain]"
                />
            </div>
        );
    }

    // Define these small components for the different views
const AllActivityView = () => (
  <div className="space-y-6">
    {activityData.map((section, idx) => (
      <div key={idx}>
        <h3 className="text-sm font-bold text-gray-800 mb-3">{section.label}</h3>
        <div className="space-y-3">
          {section.items.map((item, itemIdx) => (
            <ActivityCard key={itemIdx} item={item} />
          ))}
        </div>
        {section.label === 'Today' && (
            <div className="flex items-center justify-center mt-4 mb-8">
            <button className="flex items-center text-sm font-bold text-gray-700 gap-1">
                Show more <ChevronDown size={16} />
            </button>
            </div>
        )}
      </div>
    ))}
  </div>
);

const ToursView = () => (
  <div className="grid grid-cols-1 gap-4">
     {/* Placeholder for Tours Content */}
    <div className="p-6 border border-gray-200 rounded-3xl bg-gray-50 text-center">
        <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
        <h3 className="font-bold text-gray-700">My Tours</h3>
        <p className="text-sm text-gray-500">List of completed tours will appear here.</p>
    </div>
  </div>
);

const BadgesView = () => (
  <div className="grid grid-cols-3 gap-4">
    {/* Placeholder for Badges Grid */}
    {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center">
            <Trophy size={24} className="text-yellow-500 mb-2"/>
            <span className="text-xs font-bold text-gray-600">Badge {i}</span>
        </div>
    ))}
  </div>
);

const SocialView = () => (
  <div className="space-y-4">
     {/* Placeholder for Social Feed */}
    <div className="p-4 bg-white border rounded-2xl shadow-sm">
        <p className="text-sm font-semibold">Friend Request</p>
        <p className="text-xs text-gray-500">John Doe wants to follow you.</p>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-white flex justify-center">

        {/* --- Upload Modal --- */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

        <Navigation />

      <div className="w-full max-w-7xl bg-red-500/0 flex gap-8 p-4 md:p-8 mt-40">

        {/* --- Main Content Area --- */}
        <div className="flex-1 w-full max-w-[700px] mx-auto">
          
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex justify-center gap-4 items-start">
              {/* Avatar */}
              <div className="relative w-33 h-33 rounded-full overflow-hidden">
                 <Image 
                    src={userAvatarUrl}
                    alt="User Avatar"
                    layout="fill"
                    objectFit="cover"
                    />
              </div>
              
              {/* User Info */}
              <div>
                <div className="flex gap-2 mb-1">
                  <span className="bg-[#8BCBFF] flex gap-[4px] text-[#007BFF] border-[2px] border-[#007BFF] text-[.9rem] px-2 py-0.5 rounded-full font-[500]"><Image src={devIcon} alt='dev icon' height={20} />dev</span>
                  <span className="bg-[#FFE3B3] text-[#FFA000] border-[2px] border-[#FFA000] text-[.9rem] px-2 py-0.5 rounded-full font-[500]">#12 Rank</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                
                {/* Level Progress */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-24 md:w-32 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-linear-to-r from-[#66B2FF] to-[#007BFF] rounded-full"></div>
                  </div>
                  <span className="text-[.8rem] font-[600] text-gray-500">Level 6</span>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 max-w-md mt-2">
                    I like to travel, and explore the various parishes throughout Barbados. 🇧🇧
                </p>
              </div>
            </div>
            
            
            {/* Settings / Logout Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <Settings size={24} />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 origin-top-right">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <h2 className="text-xl font-bold mb-4">User Activities</h2> */}
          {/* <div className='w-[800px] h-[1px] rounded-full ml-[-45px] bg-black/20 absolute '></div> */}

          {/* Tabs */}
          <div className="flex gap-2 my-6 overflow-x-auto no-scrollbar ">
            {['All', 'Tours', 'Badges', 'Media'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-[13px] cursor-pointer active:scale-[.95] text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab 
                    ? 'bg-blue-100 text-[#007BFF]' 
                    : 'bg-[#EDEDED] text-[#666] hover:bg-gray-200'
                }`}
                >
                {tab}
                </button>
            ))}
            </div>


          {/* <div className='w-[800px] my-6 h-[1px] ml-[-45px] rounded-full bg-black/10 '></div> */}

          {/* Stats Cards - Responsive Grid */}
          {/* Mobile: 2 columns. Rank spans full width on bottom. */}
          {/* Desktop: 3 columns. All equal width. */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
            <div className='bg-[#FF1A84]/60 backdrop-blur-[3px] rounded-[37px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.2)]'>
            <StatCard 
              value="3,483" 
              label="Total Points" 
              gradient="bg-[#FF1A84]" 
              className="col-span-1"
            />
            </div>
            <div className='bg-[#A100C9]/60 backdrop-blur-[3px] rounded-[37px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.2)]'>
            <StatCard 
              value="1" 
              label="Sites Visited" 
              gradient="bg-[#A100C9]" 
              className="col-span-1"
            />
            </div>
            <div className='bg-[#FFA000]/60 backdrop-blur-[3px] rounded-[37px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,0.2)]'>
                <StatCard 
                value="12" 
                label="Current Rank" 
                gradient="bg-[#FFA000]" 
                className="col-span-2 md:col-span-1" // Spans 2 cols on mobile, 1 on desktop
                />
            </div>
          </div>


          {/* Content Area - Switches based on State */}
          <div className="min-h-[200px]">
            {activeTab === 'All' && <AllActivityView />}
            {activeTab === 'Tours' && <ToursView />}
            {activeTab === 'Badges' && <BadgesView />}
            {activeTab === 'Media' && <SocialView />}
        </div>

        </div>
      </div>
    </div>
  );
}