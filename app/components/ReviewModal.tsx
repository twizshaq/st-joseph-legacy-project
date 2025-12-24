"use client";

import React, { useState, useEffect } from 'react';
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: () => void;
  user: User | null;
  siteId?: number | string;
  tourId?: string;
}

export const ReviewModal = ({ isOpen, onClose, onReviewSubmit, user, siteId, tourId }: ReviewModalProps) => {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setReviewText('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDATION CHECK ---
    // If the user hasn't selected a star, show error and stop.
    if (rating === 0) {
      setError("Please select a star rating to submit.");
      return; 
    }

    setIsSubmitting(true); 
    setError(null);

    try {
      let result;

      if (tourId) {
        result = await supabase
          .from('tour_reviews')
          .insert({
            tour_id: tourId,
            user_id: user?.id,
            rating: rating,
            review_text: reviewText,
          });
      } 
      else if (siteId) {
        result = await supabase
          .from('site_reviews')
          .insert({
            site_id: siteId,
            user_id: user?.id,
            rating: rating,
            review_text: reviewText,
          });
      } else {
        throw new Error("No ID provided for review");
      }

      const { error: insertError } = result;

      if (insertError) throw insertError;

      onReviewSubmit();
      onClose();
      setRating(0);
      setReviewText("");

    } catch (err: any) {
      console.error("Supabase insert error:", err.message);
      // Fallback error if something else goes wrong (like network issues)
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 text-white flex items-center justify-center bg-black/60 transition-opacity duration-300"
      onClick={onClose}
    >
      <div className='bg-white/10 backdrop-blur-[15px] rounded-[43px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0.3)]'>
        <div 
          className="bg-black/60 rounded-[40px] p-5 w-[500px] max-w-[90vw] animate-in zoom-in-90 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-1">Write a Comment</h2>
          <p className="mb-6">Share your experience with the community.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="font-semibold mb-2">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      if (error) setError(null); // Clear error when they select a star
                    }}
                    className="text-4xl text-[#FFBA12] cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none"
                  >
                    {star <= rating ? <TiStarFullOutline /> : <TiStarOutline />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="reviewText" className="block font-semibold mb-2">Your Experience</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border-[2px] border-gray-300/10 resize-none bg-[#999]/10 font-[500] rounded-[20px] outline-none transition-shadow duration-200"
                rows={5}
                placeholder="Tell us about the surf, scenery, and your overall visit..."
                required
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 active:scale-[.98] font-bold cursor-pointer text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 font-bold active:scale-[.98] cursor-pointer text-white bg-[#007BFF] hover:bg-[#007BFF] rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,123,225,0.4)]"
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};