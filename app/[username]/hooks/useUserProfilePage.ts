"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useParams, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ProfileTab, UserProfile } from "../types";

export interface UseUserProfilePageResult {
  activeTab: ProfileTab;
  setActiveTab: Dispatch<SetStateAction<ProfileTab>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
  isSaving: boolean;
  profile: UserProfile | null;
  currentUser: User | null;
  loading: boolean;
  displayUsername: string;
  userAvatarUrl: string;
  isOwnProfile: boolean;
  isContentVisible: boolean;
  desktopTab: "All" | "Media";
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleUpdateProfile: (newUsername: string, newBio: string, isPrivate: boolean, newAvatarFile: File | null) => Promise<void>;
}

export const useUserProfilePage = (): UseUserProfilePageResult => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("All");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      if (!usernameFromUrl) {
        setLoading(false);
        return;
      }

      const decodedUsername = decodeURIComponent(usernameFromUrl);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", decodedUsername)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) setCurrentUser(authData.user);
      setLoading(false);
    };

    fetchProfileData();
  }, [usernameFromUrl, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    // Delete logic here
  };

  const handleUpdateProfile = async (
    newUsername: string,
    newBio: string,
    isPrivate: boolean,
    newAvatarFile: File | null
  ) => {
    if (!currentUser) return;
    setIsSaving(true);

    try {
      let finalAvatarUrl = profile?.avatar_url;

      if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split(".").pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, newAvatarFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalAvatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: newUsername,
          bio: newBio,
          is_private: isPrivate,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: newUsername,
              bio: newBio,
              avatar_url: finalAvatarUrl || prev.avatar_url,
              is_private: isPrivate,
            }
          : null
      );

      setIsSettingsOpen(false);

      if (profile?.username !== newUsername) {
        router.push(`/${newUsername}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayUsername = profile?.username || "explorer";
  const userAvatarUrl = profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${displayUsername}`;
  const isOwnProfile = !!(currentUser && profile && currentUser.id === profile.id);
  const isContentVisible = isOwnProfile || !profile?.is_private;
  const desktopTab = useMemo(() => (activeTab === "Media" ? "Media" : "All"), [activeTab]);

  return {
    activeTab,
    setActiveTab,
    isSettingsOpen,
    setIsSettingsOpen,
    isSaving,
    profile,
    currentUser,
    loading,
    displayUsername,
    userAvatarUrl,
    isOwnProfile,
    isContentVisible,
    desktopTab,
    handleLogout,
    handleDeleteAccount,
    handleUpdateProfile,
  };
};
