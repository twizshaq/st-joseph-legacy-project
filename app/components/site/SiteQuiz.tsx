"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TbBulb } from "react-icons/tb";
import { User } from '@supabase/supabase-js';

export const SiteQuiz = ({ user, siteId }: { user: User | null, siteId: number }) => {
  const supabase = createClient();
  const [quizStage, setQuizStage] = useState<'start' | 'question' | 'result'>('start');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsSaved, setPointsSaved] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: qs } = await supabase.from('site_quizzes').select('*').eq('site_id', siteId);
      if (qs) setQuestions([...qs].sort(() => 0.5 - Math.random()).slice(0, 2));

      if (user) {
        const { data: done } = await supabase.from('quiz_completions').select('*').eq('site_id', siteId).eq('user_id', user.id).single();
        if (done) {
          setScore(done.score);
          setQuizStage('result');
          setPointsSaved(true);
          setAlreadyCompleted(true);
        }
      }
      setLoading(false);
    };
    init();
  }, [supabase, user, siteId]);

  const handleAnswer = async (idx: number) => {
    const isCorrect = idx === questions[qIndex].correct_answer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(s => s + 1);

    if (qIndex + 1 < questions.length) {
      setQIndex(i => i + 1);
    } else {
      setQuizStage('result');
      if (user) {
        const { error } = await supabase.from('quiz_completions').insert({ user_id: user.id, site_id: siteId, score: newScore });
        if (!error && newScore > 0) {
          await supabase.rpc('increment_points', { user_id: user.id, amount: newScore * 50 });
          setPointsSaved(true);
        } else if (error?.code === '23505') {
          setAlreadyCompleted(true);
          setPointsSaved(true);
        }
      }
    }
  };

  return (
    <div className='shadow-[0px_0px_20px_rgba(0,0,0,0.4)] rounded-[43px] w-full max-w-[450px] mb-[0px]'>
      {/* INNER DIV: Holds the mask, background, and padding (The visual border) */}
      <div className='w-full h-full rounded-[43px] p-[3px] [mask-image:radial-gradient(white,black)] bg-gradient-to-br from-indigo-300 via-blue-800/95 to-blue-300 overflow-hidden'>
        <div 
          className={`
            w-full rounded-[40px]
            flex flex-col justify-center items-center relative overflow-hidden
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            bg-gradient-to-br from-indigo-600 via-blue-500 to-blue-800
            ${quizStage === 'start' ? 'h-[200px]' : 'min-h-[240px] py-8'}
          `}
        >
          {/* --- GRAPHICS LAYER --- */}
          <div className="absolute inset-0 opacity-[0.04]" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 20px)',
            }} 
          />
          <div className="absolute -top-[50%] left-[20%] w-[300px] h-[300px] bg-indigo-300/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[40px]">
            <svg className="absolute bottom-[-5px] w-full min-h-[140px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="rgba(0, 0, 0, 0.15)" d="M0,280 C240,280 480,180 720,180 C960,180 1200,240 1440,240 V320 H0 Z"></path>
                <path fill="rgba(255, 255, 255, 0.08)" d="M0,320 L0,220 C250,260 500,340 750,260 C1000,180 1250,220 1440,160 V320 Z"></path>
            </svg>
          </div>

          {/* --- STAGE: START --- */}
          {quizStage === 'start' && (
            <div className="flex flex-col items-center justify-center w-full z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full mb-3 border border-white/20 shadow-[0px_0px_5px_rgba(0,0,0,0.2)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Site Explorer
                </span>
              </div>
              <h3 className="text-white font-black text-2xl leading-none mb-1 text-center drop-shadow-lg tracking-tight">
                Knowledge Check
              </h3>
              <p className="text-blue-100 text-sm font-medium mb-5 text-center max-w-[85%]">
                Complete <span className="text-white font-bold border-b-2 border-white/20">2 questions</span> on the local geography to earn points.
              </p>
              <button 
                onClick={() => setQuizStage('question')}
                disabled={loading || questions.length === 0}
                className="group cursor-pointer relative bg-white text-indigo-700 rounded-full py-3 pl-5 pr-6 font-bold text-[1rem] shadow-[0_0px_15px_rgba(0,0,0,0.2)] flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Loading...' : 'Begin Quest'}</span>
                <div className="text-[1.3rem]"><TbBulb/></div>
              </button>
            </div>
          )}

          {/* --- STAGE: QUESTION --- */}
          {quizStage === 'question' && questions.length > 0 && (
            <div className="w-full px-6 z-10 flex flex-col items-center gap-6 animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-bold text-xl md:text-2xl text-center leading-tight drop-shadow-md">
                  {questions[qIndex].question}
                </p>
              </div>
              <div className="flex flex-col pb-[10px] w-full gap-3">
                {questions[qIndex].options.map((opt: string, i: number) => (
                  <div key={i} className='bg-white/5 active:scale-[.98] backdrop-blur-[3px] rounded-[28px] w-[100%] px-auto p-[2.5px] shadow-[0_0px_15px_rgba(0,0,0,0.1)] cursor-pointer'>
                    <button
                      onClick={() => handleAnswer(i)}
                      className="
                        flex-1 py-5 px-3 
                        bg-indigo-900/50 cursor-pointer h-[100%] w-[100%] hover:bg-white text-white hover:text-indigo-800
                        rounded-[25px] font-bold text-sm leading-tight
                        transition-all duration-200
                      "
                    >
                      {opt}
                    </button>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-[20px] flex gap-1.5">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === qIndex ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-4 bg-white/30'}`} />
                  ))}
              </div>
            </div>
          )}

          {/* --- STAGE: RESULT --- */}
          {quizStage === 'result' && (
            <div className="flex flex-col items-center justify-center w-full px-6 mt-[-30px] z-10 animate-in zoom-in fade-in duration-500">
              <div className='flex items-center gap-[20px]'>
                <div className="relative mb-3">
                  <div className={`rotate-6 mb-[4px] rounded-[23px] w-[100%] px-auto p-[2.5px] shadow-[0px_0px_30px_rgba(0,0,0,0)] ${score > 0 ? 'bg-gradient-to-br from-yellow-500 via-amber-500/65 to-amber-300' : 'bg-gradient-to-br from-gray-300 via-gray-500/65 to-gray-400'}`}>
                    <div className={`w-13 h-13 rounded-[20px] flex items-center justify-center text-[1.3rem] ${score > 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                        {score === questions.length ? '🏆' : score > 0 ? '✨' : '☁️'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-white font-black text-2xl tracking-tight uppercase drop-shadow-md">
                    {alreadyCompleted ? 'Quest Archived' : (score === questions.length ? 'Quest Complete!' : 'Completed')}
                  </h3>
                  <p className="text-indigo-100 text-sm font-medium mb-5 opacity-90">
                    You got <span className="text-white font-bold">{score}</span> out of {questions.length} correct.
                  </p>
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-[3px] active:scale-[.98] rounded-[28px] w-[100%] px-auto p-[3px] mb-[0px] shadow-[0px_0px_30px_rgba(0,0,0,0)] cursor-pointer'>
                <div className="w-full bg-white/10 rounded-[25px] p-4 flex flex-row items-center justify-between shadow-[0px_0px_20px_rgba(0,0,0,0.2)] relative overflow-hidden group">
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  <div className="flex flex-col items-start">
                    <span className="text-indigo-200 text-[10px] font-[700] uppercase tracking-widest">
                      {alreadyCompleted ? 'Total Earned' : 'Points Earned'}
                    </span>
                    <span className="text-white text-xs opacity-70 font-[500]">Experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-4xl font-black text-white drop-shadow-sm leading-none">+{score * 50}</span>
                    <span className="text-[10px] font-bold text-yellow-900 Scottish bg-yellow-400 px-1.5 py-0.5 rounded-[8px] mb-auto mt-1">PTS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 mb-[-40px] flex items-center justify-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                {alreadyCompleted ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Already Completed</span>
                  </>
                ) : pointsSaved ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Result Recorded</span>
                  </>
                ) : (
                  <span>Saving...</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};