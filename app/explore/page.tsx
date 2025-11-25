"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Heart, Play, Pause, Maximize, UserPlus, MessageCircle, MapPin, X } from 'lucide-react';

import Navigation from '@/app/components/ProfileNav'; 
import UploadModal from '@/app/components/UploadModal'; 

// --- Types ---
type MediaType = 'image' | 'video';

interface MediaItem {
  id: number;
  type: MediaType;
  src: string;
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
  followers: string;
  isFollowing: boolean;
}

// --- Mock Data ---
const mockMedia: MediaItem[] = [
  { 
    id: 1, type: 'image', src: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg', 
    likes: 1240, comments: 45, title: 'Beach vibes', location: 'Bathsheba Park',
    user: { username: 'island_girl', avatar: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' }
  },
  { 
    id: 2, type: 'video', src: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg', 
    likes: 8500, comments: 120, title: 'Surfing video', location: 'Soup Bowl',
    user: { username: 'surfer_dude', avatar: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' }
  },
  { 
    id: 3, type: 'image', src: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg', 
    likes: 230, comments: 12, title: 'Cave exploration', location: 'Animal Flower Cave',
    user: { username: 'explorer_99', avatar: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg' }
  },
  { 
    id: 4, type: 'image', src: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg', 
    likes: 945, comments: 89, title: 'Garden walk', location: 'Hunte\'s Gardens',
    user: { username: 'green_thumb', avatar: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg' }
  },
  { 
    id: 5, type: 'video', src: 'https://i.pinimg.com/736x/9c/03/4d/9c034d03d8db6ee172bcf6fe25de24ca.jpg', 
    likes: 310, comments: 34, title: 'Rihanna Drive', location: 'Westbury New Road',
    user: { username: 'barbados_fan', avatar: 'https://i.pinimg.com/736x/9c/03/4d/9c034d03d8db6ee172bcf6fe25de24ca.jpg' }
  },
  { 
    id: 6, type: 'image', src: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg', 
    likes: 156, comments: 8, title: 'Soup bowl surf', location: 'Bathsheba',
    user: { username: 'surfer_dude', avatar: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' }
  },
  { 
    id: 7, type: 'image', src: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg', 
    likes: 88, comments: 2, title: 'Greenery', location: 'Welchman Hall Gully',
    user: { username: 'green_thumb', avatar: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg' }
  },
  { 
    id: 8, type: 'image', src: 'https://i.pinimg.com/736x/d4/aa/92/d4aa9219d018d5fea71a647303b71e62.jpg', 
    likes: 4400, comments: 300, title: 'Selfie', location: 'The Crane',
    user: { username: 'island_girl', avatar: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg' }
  },
  { 
    id: 9, type: 'video', src: 'https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4', 
    likes: 4400, comments: 300, title: 'Driving Tour', location: 'East Coast Road',
    user: { username: 'surfer_dude', avatar: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg' }
  },
];

const mockUsers: UserItem[] = [
  { id: 1, username: 'island_girl', fullName: 'Jessica W.', avatar: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg', followers: '12K', isFollowing: false },
  { id: 2, username: 'surfer_dude', fullName: 'Mikey P.', avatar: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg', followers: '8.5K', isFollowing: true },
  { id: 3, username: 'explore_barbados', fullName: 'Visit Barbados', avatar: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg', followers: '150K', isFollowing: false },
];

export default function ExplorePage() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);

    // Handle Scroll Event
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const fadeDistance = 50; 
            const progress = Math.min(Math.max(scrollY / fadeDistance, 0), 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter Logic
    const isSearching = searchQuery.length > 0;

    const filteredUsers = mockUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMedia = isSearching 
        ? mockMedia.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        : mockMedia;

    // === MEDIA VIEWER MODAL ===
    const MediaViewerModal = () => {
        if (!selectedMedia) return null;

        // --- Custom Video Player ---
        const CustomVideoPlayer = ({ src }: { src: string }) => {
            const videoRef = React.useRef<HTMLVideoElement>(null);
            const [isPlaying, setIsPlaying] = useState(true);
            const [progress, setProgress] = useState(0);

            const togglePlay = () => {
                if (videoRef.current) {
                    if (isPlaying) videoRef.current.pause();
                    else videoRef.current.play();
                    setIsPlaying(!isPlaying);
                }
            };

            const handleTimeUpdate = () => {
                if (videoRef.current) {
                    const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                    setProgress(percent);
                }
            };

            const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newTime = (Number(e.target.value) / 100) * (videoRef.current?.duration || 0);
                if (videoRef.current) videoRef.current.currentTime = newTime;
                setProgress(Number(e.target.value));
            };

            const toggleFullscreen = () => {
                if (videoRef.current) videoRef.current.requestFullscreen();
            };

            return (
                <div className="relative group w-full h-full flex items-center justify-center bg-black rounded-[20px] overflow-hidden">
                    <video 
                        ref={videoRef}
                        src={src} 
                        className="max-h-[85vh] w-auto max-w-full"
                        autoPlay 
                        loop
                        playsInline
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                    />
                    
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full">
                                <Play size={40} fill="white" className="text-white" />
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={togglePlay} className="text-white hover:text-gray-300">
                            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                        </button>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={progress} 
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            );
        };

        return (
            <div 
                className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setSelectedMedia(null)}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-50 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Profile Header */}
                <div 
                    className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-50 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pr-6 rounded-full border border-white/10">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white">
                            <Image src={selectedMedia!.user.avatar} alt="avatar" layout="fill" objectFit="cover" />
                        </div>
                        <div className="text-white">
                            <p className="font-bold text-sm leading-none mb-1">{selectedMedia!.user.username}</p>
                            <div className="flex items-center gap-1 text-white/70 text-xs">
                                <MapPin size={10} />
                                <span>{selectedMedia!.location || 'Unknown Location'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    className="relative w-full max-w-4xl h-[85vh] flex items-center justify-center outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {selectedMedia!.type === 'video' ? (
                        <CustomVideoPlayer src={selectedMedia!.src} />
                    ) : (
                        <div className="relative group w-full h-full flex items-center justify-center">
                            <img 
                                src={selectedMedia!.src} 
                                alt="Full view" 
                                className="max-h-full w-auto max-w-full rounded-[20px] shadow-2xl object-contain"
                            />
                        </div>
                    )}

                    {selectedMedia!.type === 'image' && (
                         <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md p-4 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="font-bold text-lg">{selectedMedia!.title || "Post"}</h3>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1"><Heart size={16} fill="white"/> {selectedMedia!.likes}</span>
                                <span className="flex items-center gap-1"><MessageCircle size={16} /> {selectedMedia!.comments}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // === MAIN RENDER ===
    return (
        <div className='min-h-screen bg-white flex justify-center'>
            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
            />
            
            <MediaViewerModal /> 
            
            <Navigation />

            <div className="w-full max-w-[1000px] bg-red-500/0 flex gap-8 p-4 md:p-8 mt-35 max-sm:mt-20">
                <div className="flex-1 w-full max-w-[600px] mx-auto pb-32">
                    
                    {/* Sticky Search Header */}
                    <div className='fixed top-[0px] z-[30] w-[100vw] ml-[-16px] h-[150px] bg-white/80 backdrop-blur-[3px]'></div>
                    
                    <div className="sticky top-75 p-4 max-sm:top-13 bg-white/0 z-30 pt-0 pb-4 -mx-4 px-4 mb-4">
                        <div 
                            style={{ 
                                opacity: 1 - scrollProgress,
                                marginBottom: `${(1 - scrollProgress) * 12}px`,
                                transform: `translateY(-${scrollProgress * 10}px) scale(${1 - (scrollProgress * 0.05)})`,
                                overflow: 'hidden',
                            }}
                        >
                            <p className='text-[1.7rem] font-[600] text-black leading-tight'>Explore</p>
                        </div>
                         
                        <div className="relative group">
                            <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search size={20} className="text-white transition-colors" />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Search users, or locations"
                                    className="w-full pl-11 pr-4 py-4 bg-[#000]/40 rounded-full focus:outline-none transition-all text-[15px] font-[500] placeholder-text-[#fff] text-[#fff]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEARCH RESULTS */}
                    {isSearching && (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3 px-1 text-gray-900">Accounts</h3>
                            {filteredUsers.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-1">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                                                    <Image src={user.avatar} alt={user.username} layout="fill" objectFit="cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{user.username}</p>
                                                    <p className="text-gray-500 text-xs">{user.fullName} • {user.followers}</p>
                                                </div>
                                            </div>
                                            <button className={`px-4 py-1.5 rounded-[10px] text-sm font-bold transition-colors ${
                                                user.isFollowing 
                                                ? 'bg-gray-100 text-black border border-gray-200' 
                                                : 'bg-[#0095F6] text-white hover:bg-blue-600'
                                            }`}>
                                                {user.isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm p-1">No accounts found.</p>
                            )}
                             <h3 className="font-bold text-lg mt-8 mb-3 px-1 text-gray-900">Explore Posts</h3>
                        </div>
                    )}

                    {/* MEDIA GRID */}
                    <div className="columns-3 md:columns-4 gap-2 space-y-2">
                        {filteredMedia.map((item) => (
                            <div key={item.id} className="relative group break-inside-avoid mb-2">
                                <div onClick={() => setSelectedMedia(item)} className="relative w-full overflow-hidden rounded-[16px] bg-gray-100 cursor-pointer">
                                    {item.type === 'video' && (
                                        <div className="absolute top-2 right-2 z-20 text-white drop-shadow-md">
                                            <Play size={20} fill="white" className="opacity-90" />
                                        </div>
                                    )}
                                    <img 
                                        src={item.src} 
                                        alt="media" 
                                        className="relative w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105" 
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
                                        <div className="flex items-center gap-1 text-white font-bold">
                                            <Heart size={20} fill="white" />
                                            <span>{item.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-white font-bold">
                                            <MessageCircle size={20} fill="white" />
                                            <span>{item.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {isSearching && filteredMedia.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No posts matches "{searchQuery}"</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}