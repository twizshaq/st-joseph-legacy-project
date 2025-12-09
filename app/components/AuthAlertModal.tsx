// app/components/AuthAlertModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// All animation styles are now defined here, inside the component file.
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
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-150%);
      opacity: 0;
    }
  }

  .animate-slide-down-shake {
    animation: slideDownAndShake 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.4s ease-out forwards;
  }
`;

export const AuthAlertModal = ({ isOpen, onClose }: AuthAlertModalProps) => {
  // State to manage the exit animation
  const [isClosing, setIsClosing] = useState(false);

  // This function triggers the slide-out animation and then calls onClose
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for the slide-up animation to finish (400ms) before calling onClose
    setTimeout(() => {
      onClose();
      setIsClosing(false); // Reset state for the next time it opens
    }, 400);
  }, [onClose]);

  // This effect handles the 4-second auto-close timer
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000); // 4000 milliseconds = 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, handleClose]);

  // Only render the component if it's supposed to be open.
  // This is now at the end, AFTER all hooks have been called.
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <style>{animationStyles}</style>

      <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none">
        <div
          className={`
            flex items-center gap-4 w-full max-w-md p-4 mt-[85px] mx-4
            bg-red-600 text-white 
            rounded-[30px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] border border-red-700/50
            pointer-events-auto
            ${isClosing ? 'animate-slide-up' : 'animate-slide-down-shake'}
          `}
          role="alert"
        >
          <div className="flex-shrink-0">
            <IoWarningOutline size={28} />
          </div>
          
          <p className="flex-grow font-semibold">
            You must be signed in to write a review.
          </p>

          <button 
            onClick={handleClose} // Use the new handleClose function
            className="p-2 rounded-full flex-shrink-0 hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
            aria-label="Close notification"
          >
            <FaTimes size={20} />
          </button>
        </div>
      </div>
    </>
  );
};