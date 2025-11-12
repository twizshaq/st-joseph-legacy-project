// app/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

// Re-using icons from the project
import settingsIcon from '@/public/icons/sort-icon.svg'; // Using an existing icon
import photosIcon from '@/public/icons/photos-icon.svg';
import heartIcon from '@/public/icons/heart-icon.svg';
import awardsIcon from '@/public/icons/awards-icon.svg';

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('contributions');

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

    const renderContent = () => {
        switch (activeTab) {
            case 'contributions':
                return <div className="text-center text-gray-500">No contributions yet.</div>;
            case 'favorites':
                return <div className="text-center text-gray-500">No saved favorites.</div>;
            case 'photos':
                return <div className="text-center text-gray-500">No photos uploaded.</div>;
            default:
                return null;
        }
    };

    return (
        <div className='flex flex-col items-center text-black bg-[#fff] min-h-screen'>
            <div className="w-full max-w-5xl mx-auto">
                {/* --- Profile Header --- */}
                <div className="bg-white shadow-sm rounded-b-lg p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start">
                        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200 flex-shrink-0">
                            <Image 
                                src={userAvatarUrl}
                                alt="User Avatar"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h1 className="text-3xl font-bold">{userName}</h1>
                            <p className="text-md text-gray-600">{user?.email}</p>
                            <div className="flex justify-center sm:justify-start gap-6 mt-4 text-gray-800">
                                <div><span className="font-bold">12</span> Contributions</div>
                                <div><span className="font-bold">150</span> Followers</div>
                                <div><span className="font-bold">80</span> Following</div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Follow</button>
                                <button className="px-4 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition">Message</button>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-4">About</h3>
                            <p className="text-gray-600">
                                A passionate explorer of St. Joseph's hidden gems. Sharing stories and photos from my adventures.
                            </p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                                    <Image src={settingsIcon} alt="" width={20} height={20} />
                                    <span>Account Settings</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex gap-6 px-6">
                                    <button onClick={() => setActiveTab('contributions')} className={`py-4 px-1 border-b-2 font-semibold ${activeTab === 'contributions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-2">
                                            <Image src={awardsIcon} alt="" width={18} height={18} /> Contributions
                                        </div>
                                    </button>
                                    <button onClick={() => setActiveTab('favorites')} className={`py-4 px-1 border-b-2 font-semibold ${activeTab === 'favorites' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-2">
                                            <Image src={heartIcon} alt="" width={18} height={18} /> Favorites
                                        </div>
                                    </button>
                                    <button onClick={() => setActiveTab('photos')} className={`py-4 px-1 border-b-2 font-semibold ${activeTab === 'photos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-2">
                                            <Image src={photosIcon} alt="" width={18} height={18} /> Photos
                                        </div>
                                    </button>
                                </nav>
                            </div>
                            <div className="p-6">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}