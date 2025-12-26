import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PenIcon from "@/public/icons/pen-icon"; // Update path
import { ReviewCard } from "@/app/components/ReviewCard";
import { ReviewSkeleton } from "@/app/components/ReviewSkeleton";
import { ReviewModal } from "@/app/components/ReviewModal";
import { AuthAlertModal } from "@/app/components/AuthAlertModal";
import { ReportModal } from "@/app/components/ReportModal"; 
import { Tour, Review } from '@/app/types/tours';

export default function TourReviewsSection({ tour, user }: { tour: Tour, user: any }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [reportState, setReportState] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});
  
  const supabase = createClient();

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tour_reviews')
      .select('*, profiles(username, avatar_url)')
      .eq('tour_id', tour.id)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [tour.id]);

  const handleDelete = async (id: number) => {
    setReviews(p => p.filter(r => r.id !== id));
    await supabase.from('tour_reviews').delete().eq('id', id);
  };

  return (
    <div className="relative flex flex-col items-center w-[1400px] max-w-[90vw] mt-[100px] mb-[120px]">
      <div className='w-full flex flex-col md:flex-row justify-between max-sm:items-center items-end md:items-center gap-6 mb-5 z-10'>
        <div className='flex flex-col gap-1 max-md:self-start max-sm:self-center'>
          <div className="text-[1.75rem]">
            <span className="font-[700]">Traveler Experiences - </span>
            <span className="font-[500] text-[#656565]">{tour.name}</span>
          </div>
          <p className='text-slate-500 font-medium'>See what others are saying.</p>
        </div>
        <div onClick={() => user ? setReviewOpen(true) : setAuthOpen(true)} className='cursor-pointer rounded-full p-[2px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-md active:scale-[.98]'>
          <div className='flex gap-[10px] bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[20px] py-[10px]'>
            <span><PenIcon color='#fff'/></span><p className='text-white font-bold'>Write a Review</p>
          </div>
        </div>
      </div>

      <div className='relative max-sm:w-[100vw] w-[90vw] max-w-[1400px] overflow-visible z-10'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 blur-[100px] -z-10 rounded-full' />
        {loading ? (
          <div className='flex overflow-x-auto pb-12 pt-4 gap-6 px-4 scroll-smooth hide-scrollbar'><ReviewSkeleton/><ReviewSkeleton/><ReviewSkeleton/></div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8 rounded-[40px]">
          <span className="text-4xl mb-3">🧐</span>
          {/* <NoReviewsIcon className='h-[40px] w-[40px] text-slate-500'/> */}
          <p className="text-lg font-bold text-slate-700">No Reviews Yet</p>
          <p className="text-slate-500">Be the first to share your experience!</p>
        </div>
        ) : (
          <div className='flex overflow-x-auto pb-12 pt-4 gap-6 w-full px-4 scroll-smooth hide-scrollbar'>
            {reviews.map(r => (
              <ReviewCard key={r.id} currentUserId={user?.id} onDelete={handleDelete} onReport={(id) => setReportState({isOpen: true, id})} experience={{
                id: r.id, user_id: r.user_id,
                username: r.profiles?.username || 'Anon',
                user_avatar: r.profiles?.avatar_url,
                description: r.review_text, rating: r.rating,
                upload_date: new Date(r.created_at).getTime()
              }} />
            ))}
          </div>
        )}
      </div>

      <ReviewModal isOpen={isReviewOpen} onClose={() => setReviewOpen(false)} onReviewSubmit={fetchReviews} user={user} tourId={tour.id.toString()} />
      <AuthAlertModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      <ReportModal isOpen={reportState.isOpen} reviewId={reportState.id} user={user} onClose={() => setReportState({isOpen: false, id: null})} />
    </div>
  );
}