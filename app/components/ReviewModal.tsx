"use client";

import React, { useState, useEffect } from 'react';
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Define the props that the modal component will accept
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: () => void; // This function will be called to refresh the reviews list
  user: User | null; // The currently logged-in user, or null if not logged in
  siteId: number;
}

export const ReviewModal = ({ isOpen, onClose, onReviewSubmit, user, siteId }: ReviewModalProps) => {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form state whenever the modal is closed
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
      // Prevent when open scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup: ensure scroll is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard clause: Ensure a user is passed to the component
    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }

    // Guard clause: Basic form validation
    if (rating === 0 || !reviewText.trim()) {
      setError("Please provide a star rating and a description.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Get the reviewer's name from the user's metadata, falling back to their email.
    const reviewerName = user.user_metadata?.full_name || user.email;

    // Send the data to your Supabase 'reviews' table
    const { error: insertError } = await supabase
      .from('site_reviews') // 1. Change table to 'site_reviews'
      .insert([
        { 
          site_id: siteId,   // 2. Add the site ID
          user_id: user.id,
          reviewer_name: reviewerName, 
          review_text: reviewText, 
          rating: rating,
        }
      ]);

    setIsSubmitting(false);

    if (insertError) {
      // If Supabase returns an error (like an RLS violation), display it.
      setError("Failed to submit review. Please try again later.");
      console.error("Supabase insert error:", insertError.message);
    } else {
      // On success, reset the form, trigger a data refresh in the parent, and close the modal.
      onReviewSubmit();
      onClose();
    }
  };

  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Modal backdrop
    <div 
      className="fixed inset-0 z-50 text-white flex items-center justify-center bg-black/60 transition-opacity duration-300"
      onClick={onClose} // Close the modal if the user clicks the backdrop
    >
      {/* Modal content container */}
      <div className='bg-white/10 backdrop-blur-[15px] rounded-[43px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0.3)]'>
        <div 
          className="bg-black/60 rounded-[40px] p-7 w-[500px] max-w-[90vw] animate-in zoom-in-90 duration-300"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <h2 className="text-2xl font-bold mb-1">Write a Review</h2>
          <p className="mb-6">Share your experience with the community.</p>

          <form onSubmit={handleSubmit}>
            {/* Star Rating Input */}
            <div className="mb-6">
              <p className="font-semibold mb-2">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl text-[#FFBA12] cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    {star <= rating ? <TiStarFullOutline /> : <TiStarOutline />}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Review Text Input */}
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

            {/* Display any submission errors */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-bold cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 font-bold cursor-pointer text-white bg-[#007BFF] hover:bg-blue-600 rounded-full transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};