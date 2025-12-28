"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function ScannerPage() {
  const [currentPage, setCurrentPage] = useState('experience');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Use a Ref for the stream to keep start/stop functions stable
  const streamRef = useRef<MediaStream | null>(null);

  // Function to stop the camera - Wrapped in useCallback
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Function to start the camera - Wrapped in useCallback
  const startCamera = useCallback(async () => {
    // Stop any existing stream first
    stopCamera();

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        streamRef.current = newStream; // Save to ref
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not start camera. Please grant permissions and ensure a secure (HTTPS) connection.");
      setCurrentPage('about');
    }
  }, [stopCamera]); // stopCamera is a dependency, but it's stable

  useEffect(() => {
    if (currentPage === 'experience') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [currentPage, startCamera, stopCamera]); // All dependencies now included and stable

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      <div
        className="flex w-[200vw] h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: currentPage === 'experience' ? 'translateX(0)' : 'translateX(-100vw)',
        }}
      >
        {/* Page 1: Experience (Camera View) */}
        <div className="w-screen h-full overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline 
            muted     
          />
        </div>

        {/* Page 2: About */}
        <div className="w-screen h-full overflow-y-auto">
          <div className="flex flex-col items-center text-white p-8 pt-24 pb-24">
            <h1 className="text-3xl font-bold mb-4">St Joseph Experience</h1>
            <p className="text-center max-w-md mb-8">
              This is the about page. Switch back to the &quot;Experience&quot; tab to reactivate the camera view.
            </p>
            <div className="max-w-md space-y-4 text-left text-gray-300">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <p>Duis aute irure dolor in reprehenderit...</p>
              <h2 className="text-2xl font-semibold text-white pt-4">Our Mission</h2>
              <p>Pellentesque habitant morbi tristique senectus...</p>
            </div>
          </div>
        </div>
      </div>

      <button className="rounded-full absolute top-[20px] left-[20px] bg-[#ff0036]/60 backdrop-blur-[5px] py-[7px] px-[15px] shadow-[2px_2px_3px_rgba(0,0,0,0.1)] z-20">
        <p className="text-white font-bold">Close</p>
      </button>

      <nav className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40">
        <div className="relative flex items-center bg-gray-100/70 dark:bg-[#272727]/40 backdrop-blur-[5px] rounded-full p-1 shadow-[inset_2px_5px_7px_rgba(0,0,0,.2)] border-[2px] border-[#999]/10">
          <span
            className={`absolute h-[calc(100%-0.5rem)] w-[110px] bg-gradient-to-r from-[#00b9ff] to-[#0068ff] shadow-[3px_2px_3px_rgba(0,0,0,0.2)] rounded-full transition-transform duration-300 ease-in-out
              ${currentPage === 'experience' ? 'transform translate-x-0' : 'transform translate-x-[110px]'}`}
            style={{ top: '0.25rem' }}
          />
          <button
            onClick={() => setCurrentPage('experience')}
            className={`relative z-10 w-[110px] py-2 rounded-full font-semibold text-center transition-colors duration-300 ${currentPage === 'experience' ? 'text-white' : 'text-white/70'}`}
          >
            Experience
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`relative z-10 w-[110px] py-2 rounded-full font-semibold text-center transition-colors duration-300 ${currentPage === 'about' ? 'text-white' : 'text-white/70'}`}
          >
            About
          </button>
        </div>
      </nav>
    </main>
  );
}