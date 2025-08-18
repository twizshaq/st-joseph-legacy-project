"use client";

import { useEffect, useRef, useState } from "react";

export default function AndromedaGardensAR() {
  const [currentPage, setCurrentPage] = useState<'experience' | 'about'>('experience');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setStream(s);
    } catch (e) {
      console.error("Camera access error:", e);
      alert("Could not start camera. Check permissions and HTTPS.");
      setCurrentPage('about');
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
  };

  useEffect(() => {
    if (currentPage === 'experience') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [currentPage]); // OK for a simple page

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      <div
        className="flex w-[200vw] h-full transition-transform duration-500 ease-in-out"
        style={{ transform: currentPage === 'experience' ? 'translateX(0)' : 'translateX(-100vw)' }}
      >
        <div className="w-screen h-full overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        </div>
        <div className="w-screen h-full overflow-y-auto">
          <div className="flex flex-col items-center text-white p-8 pt-24 pb-24">
            <h1 className="text-3xl font-bold mb-4">Andromeda Gardens AR</h1>
            <p className="text-center max-w-md mb-8">
              This is the about page. Switch back to the &quot;Experience&quot; tab to reactivate the camera view.
            </p>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="relative flex items-center bg-gray-100/70 dark:bg-[#272727]/40 backdrop-blur-[5px] rounded-full p-1 border-[2px] border-[#999]/10">
          <span
            className={`absolute h-[calc(100%-0.5rem)] w-[110px] bg-gradient-to-r from-[#00b9ff] to-[#0068ff] rounded-full transition-transform duration-300 ease-in-out ${currentPage === 'experience' ? 'translate-x-0' : 'translate-x-[110px]'}`}
            style={{ top: '0.25rem' }}
          />
          <button onClick={() => setCurrentPage('experience')} className={`relative z-10 w-[110px] py-2 rounded-full font-semibold ${currentPage === 'experience' ? 'text-white' : 'text-white/70'}`}>
            Experience
          </button>
          <button onClick={() => setCurrentPage('about')} className={`relative z-10 w-[110px] py-2 rounded-full font-semibold ${currentPage === 'about' ? 'text-white' : 'text-white/70'}`}>
            About
          </button>
        </div>
      </nav>
    </main>
  );
}