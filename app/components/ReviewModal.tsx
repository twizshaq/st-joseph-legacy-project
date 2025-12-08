"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Make sure this path is correct
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { User } from '@supabase/supabase-js';

// Define the props that the modal component will accept
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: () => void; // This function will be called to refresh the reviews list
  user: User | null; // The currently logged-in user, or null if not logged in
}

export const ReviewModal = ({ isOpen, onClose, onReviewSubmit, user }: ReviewModalProps) => {
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
      .from('reviews')
      .insert([
        { 
          user_id: user.id, // Associate the review with the logged-in user's ID
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose} // Close the modal if the user clicks the backdrop
    >
      {/* Modal content container */}
      <div 
        className="bg-white rounded-[40px] shadow-2xl p-8 m-4 max-w-lg w-full relative animate-in zoom-in-90 duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Write a Review</h2>
        <p className="text-slate-500 mb-6">Share your experience with the community.</p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Input */}
          <div className="mb-6">
            <p className="font-semibold text-slate-700 mb-2">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl text-amber-400 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  {star <= rating ? <TiStarFullOutline /> : <TiStarOutline />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Review Text Input */}
          <div className="mb-6">
            <label htmlFor="reviewText" className="block font-semibold text-slate-700 mb-2">Your Experience</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
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
              className="px-6 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};