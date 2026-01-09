"use client";

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js'; 
import PenIcon from "@/public/icons/pen-icon";

// Components
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { ReportModal } from "@/app/components/ReportModal";
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";

interface ReviewsSectionProps {
  user: User | null;
  reviews: any[]; // Replace 'any' with your actual Review type from Supabase definitions if available
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
  const [reportState, setReportState] = useState<{isOpen: boolean, reviewId: number | null}>({ 
    isOpen: false, 
    reviewId: null 
  });

  // Delete Logic
  const handleDeleteReview = async (reviewId: number) => {
    if (confirm("Delete this review?")) {
       await supabase.from('site_reviews').delete().eq('id', reviewId).eq('user_id', user?.id);
       onRefresh(); 
    }
  };

  return (
    <section className='relative flex flex-col items-center w-[1400px] max-w-[90vw] mb-[120px] mx-auto'>
      
      {/* Header & Add Button */}
      <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
        <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'>
          <h2 className='font-bold text-[2rem] leading-tight max-sm:text-center text-slate-800'>
            Traveler Experiences
          </h2>
        </div>
        
        <div className='cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-95 transition-transform'>
          <button 
            onClick={() => user ? setReviewOpen(true) : setAuthOpen(true)}
            className='flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'
          >
            <span><PenIcon color='#fff'/></span>
            <p className='text-white font-bold'>Add Comment</p>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className='relative max-sm:w-[100vw] w-[90vw] max-w-[1400px] overflow-visible z-10'>
        {/* Background Blur Blob */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' />
        
        {loading ? (
          <div className='flex gap-6 overflow-x-auto hide-scrollbar'>
            <ReviewSkeleton/><ReviewSkeleton/><ReviewSkeleton/>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <span className="text-4xl block mb-2">🧐</span>
            <p>No Reviews Yet. Be the first!</p>
          </div>
        ) : (
          <div className='flex overflow-x-auto pb-12 pt-4 gap-6 px-4 hide-scrollbar snap-x'>
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