// src/components/allsites/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, pageCount, onPageChange }: PaginationProps) => {
  if (pageCount <= 1) return null;

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className='flex flex-wrap justify-center gap-3 mt-4'>
      <button 
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPageChange(num)}
          className={`flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] font-bold rounded-2xl transition-all ${
            currentPage === num 
              ? 'bg-[#007BFF] text-white shadow-[0px_0px_15px_rgba(0,0,0,0.2)] hover:scale-[1.05]' 
              : 'bg-white/80 border border-slate-200/80 text-slate-500 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:text-blue-600 hover:scale-[1.05]'
          }`}
        >
          {num}
        </button>
      ))}
      
      <button 
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        className='flex items-center cursor-pointer justify-center w-11 h-11 active:scale-[.98] bg-white/80 border border-slate-200/80 text-slate-500 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:scale-[1.05] hover:text-blue-600 transition-all disabled:cursor-default disabled:hover:scale-100 disabled:bg-slate-100 disabled:text-slate-400'
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};