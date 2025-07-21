"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

// The div element ID where the camera will be rendered
const qrCodeRegionId = "qr-code-full-region";

// Helper function to check if a string is a valid URL
const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export default function Home() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // This function is now only responsible for setting the state.
  // The useEffect hook will handle the actual stopping.
  const onScanSuccess = (decodedText: string) => {
    if (isValidUrl(decodedText)) {
      // Set scanner to closed. The useEffect cleanup will handle stopping the camera.
      setIsScannerOpen(false);
      window.location.href = decodedText;
    } else {
      setIsScannerOpen(false);
      alert(`Scanned Text (not a URL): ${decodedText}`);
    }
  };

  useEffect(() => {
    if (isScannerOpen) {
      // If the scanner should be open, we initialize it.
      if (!html5QrCodeRef.current) {
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        html5QrCodeRef.current = html5QrCode;

        html5QrCode.start(
          { facingMode: { exact: "environment" } },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          (errorMessage) => { /* handle scan failure */ }
        ).catch((err) => {
          console.error("Unable to start scanning.", err);
          // If starting fails, ensure we reset the state.
          setIsScannerOpen(false); 
        });
      }
    }

    // --- This is the crucial part ---
    // The cleanup function of the useEffect hook.
    // This will run WHENEVER isScannerOpen changes from true to false,
    // or when the component unmounts.
    return () => {
      if (html5QrCodeRef.current) {
        // stop() is asynchronous, but we don't need to wait for it here.
        // We fire the command and immediately nullify the ref.
        html5QrCodeRef.current.stop().catch(err => {
            // Log errors but don't crash the app. This can happen if you
            // try to stop a scanner that is already stopping.
            console.error("Failed to stop the scanner gracefully:", err);
        });
        html5QrCodeRef.current = null;
      }
    };
  }, [isScannerOpen]); // The effect is solely dependent on this state.

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 gap-8">
      <button
        onClick={() => setIsScannerOpen(!isScannerOpen)}
        className="rounded-full py-3 px-5 bg-red-500 cursor-pointer md:hidden z-10"
      >
        <p className="text-white font-semibold">
          {isScannerOpen ? "Close Scanner" : "Scan QR Code"}
        </p>
      </button>

      {isScannerOpen && (
        <div className="absolute w-[90vw] max-w-[400px] h-[40vh] max-h-[400px] rounded-[50px] overflow-hidden flex items-center justify-center">
          <div id={qrCodeRegionId} className="w-full h-full" />
        </div>
      )}

      <div className="hidden md:flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold">QR Scanner is Mobile Only</h2>
        <p className="text-gray-600">Please open this page on your mobile device to use the QR code scanner.</p>
      </div>
    </div>
  );
}