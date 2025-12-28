"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  reviewId: number | null;
  tableName?: string;
}

export const ReportModal = ({ isOpen, onClose, user, reviewId, tableName = "review_reports" }: ReportModalProps) => {
  const supabase = createClient();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setError(null);
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to report content.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for the report.");
      return;
    }

    if (!reviewId) return;

    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from(tableName) 
      .insert({
        review_id: reviewId,
        reporter_id: user.id,
        reason: reason.trim()
      });

    setIsSubmitting(false);

    if (insertError) {
      console.error("Report error:", insertError.message);
      setError("Failed to send report: " + insertError.message);
    } else {
      alert("Report submitted successfully.");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] text-white flex items-center justify-center bg-black/60 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Glass styling matches ReviewModal */}
      <div className='bg-white/10 backdrop-blur-[15px] rounded-[43px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,0.3)]'>
        <div 
          className="bg-black/60 rounded-[40px] p-5 w-[500px] max-w-[90vw] animate-in zoom-in-90 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-500/20 rounded-full text-red-500">
               <AlertTriangle size={24} />
            </div>
            <h2 className="text-2xl font-bold">Report Review</h2>
          </div>
          <p className="mb-6 text-slate-300">Help us keep the community safe. Why are you reporting this?</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="reportReason" className="block font-semibold mb-2 text-sm uppercase tracking-wider text-slate-400">Reason</label>
              <textarea
                id="reportReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border-[2px] border-gray-300/10 resize-none bg-[#999]/10 font-[500] rounded-[20px] outline-none transition-shadow duration-200"
                rows={4}
                placeholder="e.g. Spam, Harassment, Inappropriate content..."
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm mb-3 bg-red-900/0 p-2 rounded-lg text-center">{error}</p>}

            <div className="flex justify-end gap-3">
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
                className="px-8 py-3 font-bold active:scale-[.98] cursor-pointer text-white bg-red-600 hover:bg-red-500 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                {isSubmitting ? 'Sending...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};