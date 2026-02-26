"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import PenIcon from "@/public/icons/pen-icon";
import ArrowIcon from '@/public/icons/arrow-icon';

// Components
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { ReportModal } from "@/app/components/ReportModal";
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";

interface ReviewsSectionProps {
    user: User | null;
    reviews: any[];
    loading: boolean;
    onRefresh: () => void;
    supabase: any;
    siteId: number;
}

export const ReviewsSection = ({
    user,
    reviews,
    loading,
    onRefresh,
    supabase,
    siteId
}: ReviewsSectionProps) => {

    // Local State for Modals
    const [isReviewOpen, setReviewOpen] = useState(false);
    const [isAuthOpen, setAuthOpen] = useState(false);

    // Scroll State
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
            left: -320,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({
            left: 320,
            behavior: 'smooth',
        });
    };

    const handleScroll = useCallback(() => {
        const element = scrollRef.current;
        if (element) {
            const atLeft = element.scrollLeft <= 2;
            const atRight = Math.ceil(element.scrollLeft + element.clientWidth) >= element.scrollWidth - 2;

            setCanScrollLeft(!atLeft);
            setCanScrollRight(!atRight);
        }
    }, []);

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [handleScroll, reviews, loading]);

    // FIX 1: Change reviewId type from 'number | null' to 'string | null'
    const [reportState, setReportState] = useState<{ isOpen: boolean, reviewId: string | null }>({
        isOpen: false,
        reviewId: null
    });

    // FIX 2: Change parameter type from 'number' to 'string'
    const handleDeleteReview = async (reviewId: string) => {
        if (confirm("Delete this review?")) {
            await supabase.from('site_reviews').delete().eq('id', reviewId).eq('user_id', user?.id);
            onRefresh();
        }
    };

    return (
        <section className='relative flex flex-col items-center w-[1400px] max-w-[90vw] mb-[70px] mx-auto'>

            {/* Header & Add Button */}
            <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
                <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'>
                    <h2 className='font-bold text-[2rem] leading-tight max-sm:text-center text-slate-800'>
                        Traveler Experiences
                    </h2>
                </div>

                <div className='rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-95 transition-transform'>
                    <button
                        onClick={() => user ? setReviewOpen(true) : setAuthOpen(true)}
                        className='cursor-pointer flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'
                    >
                        <span><PenIcon color='#fff' /></span>
                        <p className='text-white font-bold'>Add Comment</p>
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className='relative max-sm:w-[100vw] w-[90vw] max-w-[1400px] overflow-visible z-10'>
                {/* Background Blur Blob */}
                {/* <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' /> */}

                {/* Edge Blur Overlays */}
                <div
                    className={`pointer-events-none absolute -left-[1vw] top-[0px] z-50 h-[240px] w-[30px] max-sm:hidden bg-white [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
                />

                <div
                    className={`pointer-events-none absolute -right-[1vw] rotate-180 top-[0px] z-50 h-[240px] w-[30px] max-sm:hidden bg-white [mask-image:linear-gradient(to_right,black_50%,transparent)] transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Previous Button */}
                <div className={`hidden md:flex absolute -left-[1.5vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        type="button"
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        aria-label="Scroll left"
                        className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors'
                    >
                        <span className='-rotate-90 flex mr-[2px] items-center scale-[1.1] justify-center text-white'>
                            <ArrowIcon width={30} height={30} />
                        </span>
                    </button>
                </div>

                {/* Next Button */}
                <div className={`hidden md:flex absolute -right-[1.5vw] top-1/2 -translate-y-1/2 z-50 items-center justify-center p-[2.5px] rounded-full bg-white/10 backdrop-blur-[5px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition-all duration-100 active:scale-[0.93] cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button
                        type="button"
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        aria-label="Scroll right"
                        className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer hover:bg-black/50 transition-colors'
                    >
                        <span className='rotate-90 flex ml-[2px] items-center scale-[1.1] justify-center text-white'>
                            <ArrowIcon width={30} height={30} />
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className='flex pb-12 pt-4 gap-6 px-4 overflow-x-auto overflow-y-visible bg-green-500/0 hide-scrollbar'>
                        <ReviewSkeleton /><ReviewSkeleton /><ReviewSkeleton />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        <span className="text-4xl block mb-2">🧐</span>
                        <p>No Reviews Yet. Be the first!</p>
                    </div>
                ) : (
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className='flex overflow-x-auto overflow-y-visible pb-12 pt-4 gap-6 px-4 hide-scrollbar'
                    >
                        {reviews.slice(0, 10).map((r) => (
                            <div key={r.id} className="snap-center">
                                <ReviewCard
                                    experience={{
                                        id: r.id,
                                        user_id: r.user_id,
                                        username: r.profiles?.username || 'Anon',
                                        user_avatar: r.profiles?.avatar_url,
                                        description: r.review_text,
                                        rating: r.rating,
                                        upload_date: new Date(r.created_at).getTime()
                                    }}
                                    currentUserId={user?.id}
                                    onDelete={handleDeleteReview}
                                    onReport={(id) => setReportState({ isOpen: true, reviewId: id })}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setReviewOpen(false)}
                onReviewSubmit={onRefresh}
                user={user}
                siteId={siteId}
            />
            <ReportModal
                isOpen={reportState.isOpen}
                reviewId={reportState.reviewId}
                user={user}
                tableName="review_reports"
                onClose={() => setReportState({ isOpen: false, reviewId: null })}
            />
            <AuthAlertModal
                isOpen={isAuthOpen}
                onClose={() => setAuthOpen(false)}
            />
        </section>
    );
};
