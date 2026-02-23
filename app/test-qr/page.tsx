'use client';

import React, { useState } from 'react';
import { RefreshCw, Link, Hash, FileText } from 'lucide-react'; // If you don't have lucide, remove these or use text
import TicketQR from '@/app/components/tours/TicketQR'; // Adjust if needed

export default function TestQRPage() {
    const [qrData, setQrData] = useState('ORD-1234-5678-ABCD');

    // Helper to generate different types of data to test scannability and density
    const generateData = (type: 'short' | 'url' | 'long' | 'random') => {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        switch (type) {
            case 'short':
                // Test a simple ID (Cleanest look)
                setQrData(`TKT-${Math.floor(Math.random() * 9999)}`);
                break;
            case 'url':
                // Test a realistic Verification URL
                setQrData(`https://myapp.com/v?id=${randomStr}`);
                break;
            case 'long':
                // Test high density (Lots of dots)
                setQrData(`https://myapp.com/api/v1/verify/ticket?id=${randomStr}&session=${Date.now()}&source=mobile_app_ios_v2`);
                break;
            case 'random':
                setQrData(Math.random().toString(36).substring(2, 15));
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 gap-8 font-sans">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">QR Design Studio</h1>
                <p className="text-gray-500 font-medium">Input random links to test density and rotation.</p>
            </div>

            {/* THE VISUAL DISPLAY */}
            <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-80 h-80 transition-all">
                    {/* The QR Component */}
                    <TicketQR 
                        data={qrData} 
                        className="w-full h-full drop-shadow-xl" 
                    />
                </div>
            </div>

            {/* CONTROLS */}
            <div className="w-full max-w-lg space-y-4">
                
                {/* Manual Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider font-extrabold text-gray-400 ml-2">Manual Input</label>
                    <input 
                        type="text" 
                        value={qrData}
                        onChange={(e) => setQrData(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        placeholder="Type something..."
                    />
                </div>

                {/* Generator Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button 
                        onClick={() => generateData('short')}
                        className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all shadow-sm active:scale-95 group"
                    >
                        <Hash className="w-5 h-5 text-gray-400 group-hover:text-blue-500"/>
                        <span className="text-xs font-bold">Short ID</span>
                    </button>

                    <button 
                        onClick={() => generateData('url')}
                        className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all shadow-sm active:scale-95 group"
                    >
                        <Link className="w-5 h-5 text-gray-400 group-hover:text-blue-500"/>
                        <span className="text-xs font-bold">Real URL</span>
                    </button>

                    <button 
                        onClick={() => generateData('long')}
                        className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all shadow-sm active:scale-95 group"
                    >
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500"/>
                        <span className="text-xs font-bold">Dense/Long</span>
                    </button>

                    <button 
                        onClick={() => generateData('random')}
                        className="flex flex-col items-center justify-center gap-1 p-3 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5"/>
                        <span className="text-xs font-bold">Randomize</span>
                    </button>
                </div>
                
                <p className="text-xs text-gray-400 text-center">
                    Note: Clicking random/changing data triggers the random rotation logic.
                </p>
            </div>
        </div>
    );
}