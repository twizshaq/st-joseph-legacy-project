"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, Loader2, Lock, LogOut, Save, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "../types";

export const ProfileSettingsView = ({
  user: _user,
  profile,
  onSave,
  onCancel,
  onLogout,
  onDeleteAccount,
  isSaving,
}: {
  user: User;
  profile: UserProfile | null;
  onSave: (u: string, b: string, p: boolean, f: File | null) => Promise<void>;
  onCancel: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  isSaving: boolean;
}) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isPrivate, setIsPrivate] = useState(profile?.is_private ?? false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayAvatar = previewUrl || profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${username}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-2">
        <button onClick={onCancel} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="grid w-full max-w-[700px] grid-cols-1 gap-6">
        <div className="flex items-center gap-6 rounded-[32px] bg-white p-2">
          <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-slate-50 shadow-sm">
              <Image src={displayAvatar} alt="Avatar" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Profile Picture</h3>
            <p className="mb-2 text-sm text-slate-500">Tap to change your photo</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Upload New
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="space-y-5 rounded-[32px] bg-white p-1">
          <div className="space-y-2">
            <label className="ml-4 text-sm font-bold uppercase tracking-wider text-slate-500">Username</label>
            <div className="flex items-center rounded-full border-2 border-slate-100 bg-slate-50 px-4 transition-colors focus-within:border-blue-500 focus-within:bg-white">
              <span className="text-slate-400">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent px-2 py-3.5 font-medium text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-4 text-sm font-bold uppercase tracking-wider text-slate-500">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[120px] w-full resize-none rounded-[24px] border-2 border-slate-100 bg-slate-50 p-4 font-medium text-slate-800 outline-none transition-colors focus:border-blue-500 focus:bg-white"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[32px] border-2 border-slate-100 bg-white p-5">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Private Profile</h4>
              <p className="text-sm text-slate-500">Only approved followers can see your activity</p>
            </div>
          </div>
          <button onClick={() => setIsPrivate(!isPrivate)} className={`relative h-8 w-14 rounded-full transition-colors ${isPrivate ? "bg-blue-600" : "bg-slate-200"}`}>
            <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${isPrivate ? "left-7" : "left-1"}`} />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={() => onSave(username, bio, isPrivate, avatarFile)}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
          <button onClick={onCancel} className="rounded-full bg-slate-100 px-6 py-4 font-bold text-slate-600 transition-colors hover:bg-slate-200 active:scale-[0.98]">
            Cancel
          </button>
        </div>

        <div className="mt-8 space-y-3 border-t border-slate-100 pt-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Account Actions</h3>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-[20px] border border-slate-200 p-4 text-left font-bold text-slate-600 transition-colors hover:bg-slate-50">
            <LogOut size={20} />
            Log Out
          </button>
          <button onClick={onDeleteAccount} className="flex w-full items-center gap-3 rounded-[20px] border border-red-100 bg-red-50 p-4 text-left font-bold text-red-600 transition-colors hover:bg-red-100">
            <Trash2 size={20} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
