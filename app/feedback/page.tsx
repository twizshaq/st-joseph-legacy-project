"use client"

import React, { useState } from 'react';
import { 
  Send, 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Smile, 
  Frown, 
  Meh, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/app/components/ProfileNav';
import ArrowIcon from "@/public/icons/arrow-icon"; // Assuming you have this based on your profile page

// --- Types ---
type FeedbackType = 'suggestion' | 'bug' | 'other';
type Sentiment = 'happy' | 'neutral' | 'unhappy';

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('suggestion');
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !sentiment) return;
    
    setLoading(true);

    try {
      // Get current user (optional)
      const { data: { user } } = await supabase.auth.getUser();

      // Example DB insertion - Modify based on your actual table schema
      /*
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id,
        type: feedbackType,
        sentiment: sentiment,
        message: message,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      */

      // Simulating network request for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: FeedbackType) => {
    switch (type) {
      case 'bug': return <Bug size={18} />;
      case 'suggestion': return <Lightbulb size={18} />;
      case 'other': return <MessageSquare size={18} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* Reusing your Navigation */}
      <div className="relative z-50"><Navigation /></div>

      <div className="pt-[140px] max-sm:pt-[100px] px-5 pb-20 max-w-[800px] mx-auto">
        
        {/* Header Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            Help us improve
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            We are building this together. Let us know what you think.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white/0 rounded-[40px] p-2 sm:p-3">
          
          {success ? (
             // --- Success State ---
            <div className="py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Feedback Received!</h2>
              <p className="text-slate-500 max-w-xs mb-8">
                Thanks for taking the time to share your thoughts. We&apos;ll take a look shortly.
              </p>
              <button 
                onClick={() => {
                   setSuccess(false); 
                   setMessage(''); 
                   setSentiment(null);
                }}
                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-colors"
              >
                Send another
              </button>
            </div>
          ) : (
            // --- Feedback Form ---
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
              
              {/* 1. Category Selection */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 block">
                  What is this about?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['suggestion', 'bug', 'other'] as FeedbackType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackType(type)}
                      className={`
                        relative flex flex-col items-center justify-center gap-2 py-6 rounded-[24px] border-[2px] transition-all duration-200 active:scale-[0.98]
                        ${feedbackType === type 
                          ? 'border-[#007BFF] bg-[#007BFF]/5 text-[#007BFF]' 
                          : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}
                      `}
                    >
                      {getIconForType(type)}
                      <span className="capitalize font-bold text-sm">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sentiment Selection */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 block">
                  How was your experience?
                </label>
                <div className="flex justify-center gap-6">
                  {[
                    { val: 'unhappy', icon: Frown, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { val: 'neutral', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { val: 'happy', icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setSentiment(item.val as Sentiment)}
                      className={`
                        group p-4 rounded-full active:scale-90
                        ${sentiment === item.val ? `${item.bg} ring-2 ring-offset-2 ring-offset-white ${item.color.replace('text', 'ring')}` : 'hover:bg-slate-100 text-slate-300 hover:text-slate-400'}
                      `}
                    >
                      <item.icon size={40} strokeWidth={sentiment === item.val ? 2.5 : 2} className={sentiment === item.val ? item.color : "text-current"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Text Area */}
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 block">
                  Your Message
                </label>
                <div className="relative group">
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={feedbackType === 'bug' ? "Describe what happened..." : "Tell us your thoughts..."}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-[2px] border-transparent focus:border-[#007BFF] text-slate-700 font-medium rounded-[30px] p-6 h-[180px] resize-none focus:outline-none transition-all placeholder:text-slate-300"
                  />
                  {/* Subtle corner icon/hint */}
                  <div className="absolute bottom-6 right-6 pointer-events-none opacity-50">
                    <MessageSquare size={20} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading || !sentiment || !message}
                type="submit"
                className={`
                  w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all duration-200 mt-2
                  ${loading || !sentiment || !message
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'bg-[#007BFF] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-[0.99]'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Feedback <Send size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center px-4">
          <p className="text-xs text-slate-400 font-medium">
            Your feedback helps us make Barbados exploration better for everyone. <br/>
            Need immediate help? <span className="text-slate-600 font-bold cursor-pointer hover:underline">Contact Support</span>
          </p>
        </div>

      </div>
    </div>
  );
}