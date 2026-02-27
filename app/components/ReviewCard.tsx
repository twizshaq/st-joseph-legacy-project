import React, { useState, useEffect, useRef } from 'react';
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { MoreVertical, Trash2, Flag } from 'lucide-react'; // Import icons
import Link from 'next/link';
import Image from 'next/image';

interface Experience {
    id: string;           // Need review ID for actions
    user_id: string;      // Need author ID to check ownership
    username: string;
    description: string;
    upload_date: number;
    user_avatar?: string | null;
    rating: number;
}

interface ReviewCardProps {
    experience: Experience;
    currentUserId?: string | null; // Passed from parent
    onDelete?: (id: string) => void; // Callback to handle deletion
    onReport?: (id: string) => void; // Callback to handle reporting
}

export const ReviewCard = ({ experience, currentUserId, onDelete, onReport }: ReviewCardProps) => {
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const [needsReadMore, setNeedsReadMore] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showOptions, setShowOptions] = useState(false); // State for dropdown

    // Check if current user is the author
    const isAuthor = currentUserId === experience.user_id;

    const avatarUrl = experience.user_avatar
        ? experience.user_avatar
        : `https://api.dicebear.com/9.x/initials/svg?seed=${experience.username}`;

    useEffect(() => {
        const el = descriptionRef.current;
        if (el) {
            setNeedsReadMore(el.scrollHeight > el.clientHeight);
        }
    }, [experience.description]);



    return (
        <div className='rounded-[43px] p-[2px] h-fit bg-white/10 shadow-[0px_0px_10px_rgba(0,0,0,0.08)]'>
            <div className='snap-center shrink-0 relative flex flex-col w-[85vw] md:w-[420px] min-h-[180px] p-5 bg-black/3 rounded-[40px]'>

                {/* Card Header: User & Media Stack */}
                <div className='flex justify-between items-start'>

                    {/* User Profile */}
                    <div className='flex items-center gap-3'>
                        <Link href={`/${experience.username}`} className='relative group cursor-pointer'>
                            <div className='w-[50px] h-[50px] rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                                <div className='relative w-full h-full rounded-full overflow-hidden bg-white'>
                                    <Image
                                        src={avatarUrl}
                                        alt={experience.username}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </Link>
                        <div className='flex flex-col'>
                            <p className='font-bold text-slate-800 text-[1.1rem] leading-none capitalize'>{experience.username}</p>
                            <div className='flex items-center gap-0.5 mt-1'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="flex text-[1.2rem]">
                                        {i < experience.rating ? (
                                            <span className="text-amber-400"><TiStarFullOutline /></span>
                                        ) : (
                                            <span className="text-slate-300"><TiStarOutline /></span>
                                        )}
                                    </span>
                                ))}
                                <span className='text-xs text-slate-400 font-medium'>
                                    • {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(experience.upload_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- OPTIONS BUTTON --- */}
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-1.5 rounded-full cursor-pointer active:scale-[.95] hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showOptions && (
                            <>
                                {/* Backdrop to close menu when clicking outside */}
                                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                                <div className='absolute right-0 rounded-[27px] p-[2px] z-20 h-fit bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
                                    <div className="bg-black/3 rounded-[25px] overflow-hidden p-[5px] gap-1 animate-in fade-in zoom-in-95 duration-200">

                                        {/* Delete Option (Only for Author) */}
                                        {isAuthor && (
                                            <button
                                                onClick={() => { onDelete?.(experience.id); setShowOptions(false); }}
                                                className="w-full text-left px-4 py-2.5 cursor-pointer active:scale-[.98] rounded-[17px] text-sm font-semibold text-red-500 hover:bg-red-300/50 active:bg-red-50 flex items-center gap-2 transition-colors"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        )}

                                        {/* Report Option (For everyone) */}
                                        <button
                                            onClick={() => { onReport?.(experience.id); setShowOptions(false); }}
                                            className="w-full text-left px-4 py-2.5 cursor-pointer active:scale-[.98] rounded-[17px] text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Flag size={14} /> Report
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

                {/* Body Text */}
                <div className='mt-[10px] mb-[0px]'>
                    <p
                        ref={descriptionRef}
                        className={`text-slate-600 font-[500] leading-[1.6] text-[1rem] ${isExpanded ? '' : 'line-clamp-2'}`}
                    >
                        {experience.description}
                    </p>
                    {needsReadMore && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className='text-blue-600 cursor-pointer active:scale-[.97] font-bold text-sm hover:underline decoration-2 underline-offset-4 mt-2'
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
