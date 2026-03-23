"use client";

import Navigation from "@/app/components/ProfileNav";
import { useBucketBadges } from "./components/Badges";
import { DesktopBadgesPanel } from "./components/DesktopPanels";
import { PrivateProfileState } from "./components/PrivateProfileState";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSettingsView } from "./components/ProfileSettingsView";
import { ProfileTabs } from "./components/ProfileTabs";
import { useUserProfilePage } from "./hooks/useUserProfilePage";
import { useProfileMedia } from "./mediaStore";

export default function UserProfilePage() {
  const {
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
    handleLogout,
    handleDeleteAccount,
    handleUpdateProfile,
  } = useUserProfilePage();
  const badges = useBucketBadges();
  const profileMedia = useProfileMedia();

  if (loading) return null;

  return (
    <div className="relative flex min-h-screen flex-row-reverse justify-center gap-0 overflow-x-hidden bg-white md:pl-[92px] xl:pl-[240px]">
      <div className="pointer-events-none relative z-50">
        <div className="pointer-events-auto">
          <Navigation />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1100px] flex-row-reverse gap-20 px-4 sm:px-6 max-[970px]:gap-0">
        {!isSettingsOpen ? (
          <div className="mt-[190px] shrink-0 space-y-4 bg-pink-500/0 max-[970px]:hidden">
            <DesktopBadgesPanel />
          </div>
        ) : null}

        <div className={`mt-[190px] w-full min-w-0 flex-1 bg-red-500/0 px-0 pb-24 max-sm:mt-[110px] ${isSettingsOpen ? "mx-auto max-w-[800px]" : ""}`}>
          {isSettingsOpen && currentUser ? (
            <ProfileSettingsView
              user={currentUser}
              profile={profile}
              onSave={handleUpdateProfile}
              onCancel={() => setIsSettingsOpen(false)}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              isSaving={isSaving}
            />
          ) : (
            <>
              <ProfileHeader
                profile={profile}
                displayUsername={displayUsername}
                userAvatarUrl={userAvatarUrl}
                isOwnProfile={isOwnProfile}
                badgeCount={badges.length}
                mediaCount={profileMedia.length}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />

              {isContentVisible ? <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} userAvatarUrl={userAvatarUrl} /> : <PrivateProfileState displayUsername={displayUsername} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
