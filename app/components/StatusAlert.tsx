// components/StatusAlert.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from "react-icons/fa";
import { AlertTriangle } from 'lucide-react';

interface StatusAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const animationStyles = `
  @keyframes slideDownAndShake {
    0% { transform: translateY(-150%); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    60% { transform: translateX(-8px); }
    70% { transform: translateX(8px); }
    80% { transform: translateX(-4px); }
    90% { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
  @keyframes slideUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-150%); opacity: 0; }
  }
  .animate-slide-down-shake { animation: slideDownAndShake 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
`;

export const StatusAlert = ({ isOpen, onClose, message }: StatusAlertProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(handleClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{animationStyles}</style>
      <div className="fixed top-0 left-0 right-0 z-[100001] flex justify-center pointer-events-none">
        <div
          className={`
            flex items-center gap-4 w-full max-w-md p-4 mt-[40px] mx-4
            bg-red-600 text-white rounded-[30px] shadow-[0px_10px_30px_rgba(0,0,0,0.3)] 
            border border-red-700/50 pointer-events-auto
            ${isClosing ? 'animate-slide-up' : 'animate-slide-down-shake'}
          `}
        >
          <div className="flex-shrink-0"><AlertTriangle size={24} /></div>
          <p className="flex-grow font-semibold text-sm">{message}</p>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <FaTimes size={18} />
          </button>
        </div>
      </div>
    </>
  );
};