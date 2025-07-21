"use client";

import { useEffect, useRef, useState } from "react";

export default function ScannerPage() {
  const [currentPage, setCurrentPage] = useState('experience');
  // --- CHANGE: Ref for the video element ---
  const videoRef = useRef<HTMLVideoElement>(null);
  // --- CHANGE: State to hold the camera stream ---
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Function to start the camera
  const startCamera = async () => {
    // Stop any existing stream to prevent multiple streams running
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // --- CHANGE: Request camera stream using getUserMedia ---
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          // Prioritize the rear camera
          facingMode: { exact: "environment" },
          // Optional: Request higher resolution
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // --- CHANGE: Attach the stream to the video element ---
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStream(stream); // Save the stream to state
      }
    } catch (err) {
      console.error("Camera access error:", err);
      // Handle errors, e.g., user denied permission
      alert("Could not start camera. Please grant camera permissions and ensure you are on a secure (HTTPS) connection.");
      setCurrentPage('about'); // Switch to about page on error
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (stream) {
      // --- CHANGE: Stop all tracks in the stream ---
      stream.getTracks().forEach(track => track.stop());
      setStream(null); // Clear the stream from state
    }
  };

  useEffect(() => {
    if (currentPage === 'experience') {
      startCamera();
    } else {
      stopCamera();
    }

    // --- CHANGE: Cleanup function to stop the camera ---
    // This runs when the component unmounts
    return () => {
      stopCamera();
    };
  }, [currentPage]); // Re-run effect when currentPage changes

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
          {/* --- CHANGE: Replaced the QR scanner div with a video element --- */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline // Important for iOS to play video inline
            muted     // Muting is often required for autoplay policies
          />
        </div>

        {/* Page 2: About - Remains the same */}
        <div className="w-screen h-full overflow-y-auto">
          <div className="flex flex-col items-center text-white p-8 pt-24 pb-24">
            <h1 className="text-3xl font-bold mb-4">St Joseph Experience</h1>
            <p className="text-center max-w-md mb-8">
              This is the about page. Switch back to the "Experience" tab to reactivate the camera view.
            </p>
            <div className="max-w-md space-y-4 text-left text-gray-300">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <h2 className="text-2xl font-semibold text-white pt-4">Our Mission</h2>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Close button remains the same */}
      <button className="rounded-full absolute top-[20px] left-[20px] bg-[#ff0036]/60 backdrop-blur-[5px] py-[7px] px-[15px] shadow-[2px_2px_3px_rgba(0,0,0,0.1)] z-20"><p className="text-white font-bold">Close</p></button>

      {/* Navigation remains the same */}
      <nav className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40">
        <div className="relative flex items-center bg-gray-100/70 dark:bg-[#272727]/40 backdrop-blur-[5px] rounded-full p-1 shadow-[inset_2px_5px_7px_rgba(0,0,0,.2)] border-[2px] border-[#999]/10">
          <span
            className={`absolute h-[calc(100%-0.5rem)] w-[110px] bg-gradient-to-r from-[#00b9ff] to-[#0068ff] shadow-[3px_2px_3px_rgba(0,0,0,0.2)] rounded-full transition-transform duration-300 ease-in-out
              ${currentPage === 'experience' ? 'transform translate-x-0' : 'transform translate-x-[110px]'}`}
            style={{ top: '0.25rem' }}
          />
          <button
            onClick={() => setCurrentPage('experience')}
            className={`relative z-10 w-[110px] py-2 rounded-full font-semibold text-center transition-colors duration-300 ${currentPage === 'experience' ? 'text-white' : 'text-white/70 dark:text-white/70'}`}
          >
            Experience
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`relative z-10 w-[110px] py-2 rounded-full font-semibold text-center transition-colors duration-300 ${currentPage === 'about' ? 'text-white' : 'text-white/70 dark:text-white/70'}`}
          >
            About
          </button>
        </div>
      </nav>
    </main>
  );
}