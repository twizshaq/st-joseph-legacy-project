"use client";

import { Lock } from "lucide-react";

export interface PrivateProfileStateProps {
  displayUsername: string;
}

export const PrivateProfileState = ({ displayUsername }: PrivateProfileStateProps) => {
  return (
    <div className="mt-8 flex w-full justify-center">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center rounded-[35px] text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
          <Lock size={32} className="text-slate-500" />
        </div>
        <h2 className="mb-2 text-xl font-black text-slate-800">This account is private</h2>
        <p className="max-w-[300px] text-sm font-medium leading-relaxed text-slate-500">{displayUsername} has restricted access.</p>
      </div>
    </div>
  );
};
