'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';       // Adjust path if needed
import AuthModal from '@/app/components/AuthModal';   // Adjust path if needed

// Define the type for the wrapper's props
interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children }) => {
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'signup',
  });

  const openAuthModal = (mode: 'login' | 'signup') => {
    setModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      {/* The Navbar now lives inside the client component so it can receive props */}
      <Navbar 
        onLoginClick={() => openAuthModal('login')}
        onSignUpClick={() => openAuthModal('signup')}
      />

      {/* Your page content is passed through here */}
      <main>{children}</main>

      {/* The AuthModal is controlled by state within this component */}
      <AuthModal 
        isOpen={modal.isOpen} 
        onClose={closeAuthModal} 
        initialMode={modal.mode} 
      />

      {/* You can keep the global animation styles here or move them to globals.css */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @keyframes slide-down-fade-in {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-popup { animation: slide-down-fade-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}

export default ClientLayoutWrapper;