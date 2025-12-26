import React, { useState, useEffect, useRef } from 'react';
import { Save, LogOut, Trash2, Camera, Lock, Globe, AlertTriangle } from 'lucide-react';
import { FaTimes } from "react-icons/fa";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUsername: string;
  initialBio: string;
  initialAvatarUrl?: string;
  initialIsPrivate?: boolean;
  onSave: (newUsername: string, newBio: string, isPrivate: boolean, newAvatarFile: File | null) => Promise<void>;
  onLogout: () => void;
  onDeleteAccount: () => void;
  isSaving: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialUsername,
  initialBio,
  initialAvatarUrl,
  initialIsPrivate = false,
  onSave,
  onLogout,
  onDeleteAccount,
  isSaving
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  
  const [avatarPreview, setAvatarPreview] = useState<string>(initialAvatarUrl || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // --- NEW: DELETE CONFIRMATION STATE ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setUsername(initialUsername);
      setBio(initialBio);
      setIsPrivate(initialIsPrivate);
      setAvatarPreview(initialAvatarUrl || '');
      setAvatarFile(null);
      setShowDeleteConfirm(false); // Reset confirmation on open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialUsername, initialBio, initialAvatarUrl, initialIsPrivate]);

  const hasChanges = 
    username !== initialUsername || 
    bio !== initialBio || 
    isPrivate !== initialIsPrivate || 
    avatarFile !== null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setAvatarFile(file);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toLowerCase();
    val = val.replace(/[^a-z0-9_.]/g, '');
    if (val.length <= 15) {
      setUsername(val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className='bg-white/10 backdrop-blur-[20px] rounded-[43px] p-[3px] shadow-[0px_0px_30px_rgba(0,0,0,.5)]'>
        <div className="bg-black/60 rounded-[40px] w-[500px] max-w-[90vw] p-4 max-h-[90dvh] overflow-y-auto relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 no-scrollbar">
          
          <div className="flex justify-between items-center pl-2">
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            <button onClick={onClose} className="cursor-pointer absolute top-6 right-6 z-20 text-white hover:text-red-500 active:text-red-500 transition-colors">
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center -mt-2">
            <div onClick={handleImageClick} className="relative w-24 h-24 rounded-full cursor-pointer group shadow-[0_0_15px_rgba(0,0,0,0.3)] border-2 border-white/20 overflow-hidden">
              {avatarPreview ? (
                 <img src={avatarPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/50">{username?.[0]?.toUpperCase() || 'U'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white drop-shadow-md" size={28} />
              </div>
            </div>
            <p className="text-xs text-white/50 mt-2 font-medium">Tap to change photo</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between ml-1">
                <label className="font-bold text-white/70">Username</label>
                <span className={`text-xs font-bold ${username.length === 15 ? 'text-red-400' : 'text-white/30'}`}>
                  {username.length}/15
                </span>
              </div>
              <input 
                type="text" 
                value={username}
                onChange={handleUsernameChange}
                className="w-full font-[500] rounded-[20px] border-[2px] border-gray-300/10 bg-[#999]/10 p-3 text-white placeholder-white/40 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="username"
              />
              <p className="text-[10px] text-white/30 ml-1">
                Only letters, numbers, underscores, and dots.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-white/70 ml-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border-[2px] border-gray-300/10 resize-none bg-[#999]/10 font-[500] rounded-[20px] outline-none text-white focus:border-blue-500 transition-all duration-200 h-24"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex items-center justify-between bg-[#999]/10 rounded-[25px] p-3 px-4 border-[2px] border-gray-300/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPrivate ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  {isPrivate ? <Lock size={20} /> : <Globe size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Private Account</span>
                  <span className="text-white/50 text-xs">{isPrivate ? "Only you can see your activity" : "Anyone can see your profile"}</span>
                </div>
              </div>
              <button onClick={() => setIsPrivate(!isPrivate)} className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${isPrivate ? 'bg-blue-500' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onLogout} className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-[20px] font-bold transition-colors flex items-center justify-center gap-2">
                <LogOut size={18} /> Log Out
              </button>
              
              <button 
                onClick={() => onSave(username, bio, isPrivate, avatarFile)}
                disabled={!hasChanges || isSaving || username.length < 3}
                className={`w-full py-3 rounded-[20px] font-bold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed
                  ${hasChanges 
                    ? 'bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]' 
                    : 'bg-white/5 text-white/30'
                  }
                `}
              >
                {isSaving ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/> : <Save size={18} />}
                {hasChanges ? 'Save' : 'Save'}
              </button>
            </div>

            <div className="h-[1px] bg-white/10 w-full my-2"></div>

            {/* --- UPDATED DANGER ZONE WITH CONFIRMATION --- */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-red-400/70 ml-1 uppercase tracking-wider">Danger Zone</h3>
              
              {!showDeleteConfirm ? (
                // State 1: Default Delete Button
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border-[1px] border-red-500/20 text-red-400 hover:text-red-300 rounded-[20px] font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete Account
                </button>
              ) : (
                // State 2: Confirmation UI
                <div className="bg-red-500/10 border-[1px] border-red-500/30 rounded-[20px] p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 text-red-400 mb-3 justify-center">
                    <AlertTriangle size={18} />
                    <span className="font-bold text-sm">Are you sure? This is permanent.</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="py-2 bg-transparent hover:bg-white/5 text-white/70 hover:text-white rounded-xl font-bold transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={onDeleteAccount}
                      className="py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors text-sm shadow-md"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;