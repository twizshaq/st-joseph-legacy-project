"use client"

import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, ChevronDown, MapPin, Trash2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
 import { FaTimes } from "react-icons/fa";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocationPin {
  id: number;
  name: string;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [locations, setLocations] = useState<LocationPin[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update handleFileChange
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Limit check
      if (files.length + newFiles.length > 7) {
        alert("You can only upload a maximum of 7 items.");
        return;
      }

      const newUrls = newFiles.map(file => URL.createObjectURL(file));

      setFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newUrls = [...previewUrls];
    
    // Cleanup URL memory
    URL.revokeObjectURL(newUrls[index]);

    newFiles.splice(index, 1);
    newUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newUrls);
  };




  // Fetch locations when the modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      if (isOpen) {
        setLoadingLocations(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('location_pins')
          .select('id, name')
          .order('name');

        if (!error && data) {
          setLocations(data);
        }
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [isOpen]);

    // 1. Prevent Background Scrolling
  useEffect(() => {
      if (isOpen) {
        // Prevent when open scrolling
        document.body.style.overflow = 'hidden';
      } else {
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
      }
  
      // Cleanup: ensure scroll is re-enabled if component unmounts
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isOpen]);

  if (!isOpen) return null;

  return (
    
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
        <div className='fixed top-[0px] bg-white/1 h-[50px] w-full z-[200] z-[-20]' />
       <div className='fixed bottom-[0px] bg-white/1 z-[200] h-[50px] w-full z-[-20]' />
    <div className='bg-white/10 backdrop-blur-[15px] rounded-[42px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,.5)]'>
      <div 
        className="bg-black/65 flex flex-col justify-center max-w-[90vw] w-[400px] rounded-[40px] p-0 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center m-6">
            <h3 className="text-xl font-bold">Upload Media</h3>
            <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 z-20 text-white hover:text-red-500 active:text-red-500 transition-colors">
                <FaTimes size={24} />
            </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6 w-[90%] self-center">
            <div className=''>
                <label className="block text-sm font-semibold  mb-2">Location</label>
                
                <div className="relative">
                  {/* Dropdown Icon Overlay */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-white">
                    <ChevronDown size={20} />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white">
                    <MapPin size={18} />
                  </div>

                  {/* Select Dropdown */}
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    disabled={loadingLocations}
                    className="w-full pl-11 pr-10 py-3 font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 transition-all appearance-none text-white cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 px-[20px]"
                  >
                    <option value="" disabled>
                      {loadingLocations ? 'Select the location' : 'Select the location'}
                    </option>
                    
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
        </div>

        {/* Upload Area */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden" 
            multiple
          />
          
          {/* Container for Media */}
{/* Container for Media */}
<div className="mb-6">
  {files.length === 0 ? (
    // --- STATE 1: Empty (Big Clickable Area) ---
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-[#999] mx-[20px] rounded-[25px] h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
    >
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 text-blue-400">
            <ImageIcon size={24} />
        </div>
        <p className="text-sm font-semibold">Click to upload media</p>
        <p className="text-xs mt-1 text-gray-400">Max 7 items</p>
    </div>
  ) : (
    // --- STATE 2: Horizontal Scroll (Original Ratio) ---
    // 'flex' creates the row, 'overflow-x-auto' allows scrolling
    <div className="flex gap-4 overflow-x-auto pb-4 px-6 pt-2 snap-x scrollbar-hide">
        
        {previewUrls.map((url, index) => (
            <div key={index} className="relative h-54 flex-shrink-0 snap-center rounded-[20px] overflow-hidden border border-white/10 group bg-black/20">
                {/* Media Preview - h-full w-auto preserves aspect ratio based on height */}
                {files[index].type.startsWith('image/') ? (
                    <img 
                        src={url} 
                        alt="preview" 
                        className="h-full w-auto object-contain" 
                    />
                ) : (
                    <video 
                        src={url} 
                        className="h-full w-auto object-contain" 
                        controls 
                    />
                )}
                
                {/* Remove Button */}
                <button 
                    onClick={() => removeFile(index)}
                    className="absolute cursor-pointer top-2 right-2 p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-500 active:bg-red-500 active:scale-[.95] transition-colors shadow-lg"
                >
                    <Trash2 size={16} />
                </button>
                
                {/* Number Badge */}
                {/* <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                    {index + 1}
                </div> */}
            </div>
        ))}

        {/* Add More Button (Appends to the right) */}
        {files.length < 7 && (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-54 w-24 flex-shrink-0 rounded-[20px] border-2 border-dashed border-[#999]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/50 text-gray-400 hover:text-white transition-all snap-center"
            >
                <Plus size={24} />
                <span className="text-xs font-bold mt-2">Add</span>
            </div>
        )}
    </div>
  )}
</div>

        {/* Footer Action */}
        <button className="w-[90%] self-center mb-6 rounded-[20px] bg-[#007BFF] py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer">
            Post
        </button>
      </div>
      </div>
    </div>
  );
};

export default UploadModal;