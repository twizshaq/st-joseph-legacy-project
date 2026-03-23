"use client";

import { useSyncExternalStore } from "react";

export type ProfileMediaType = "image" | "video";

export interface ProfileMediaItem {
  id: string;
  type: ProfileMediaType;
  src: string;
  poster?: string;
  location?: string;
  createdAt: number;
}

const seedMedia: ProfileMediaItem[] = [];

let uploadedMedia: ProfileMediaItem[] = [];
let profileMediaSnapshot: ProfileMediaItem[] = seedMedia;

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeProfileMedia = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getProfileMedia = (): ProfileMediaItem[] => profileMediaSnapshot;

export const useProfileMedia = () =>
  useSyncExternalStore(subscribeProfileMedia, getProfileMedia, () => seedMedia);

const generateVideoPoster = (file: File): Promise<string | undefined> =>
  new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(objectUrl);
    };

    const captureFrame = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx || !canvas.width || !canvas.height) {
          cleanup();
          resolve(undefined);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL("image/jpeg", 0.82);
        cleanup();
        resolve(poster);
      } catch {
        cleanup();
        resolve(undefined);
      }
    };

    video.addEventListener(
      "loadeddata",
      () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0.15) {
          captureFrame();
          return;
        }

        const targetTime = Math.min(0.15, Math.max(video.duration * 0.05, 0.05));
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          captureFrame();
        };

        video.addEventListener("seeked", onSeeked, { once: true });
        try {
          video.currentTime = targetTime;
        } catch {
          video.removeEventListener("seeked", onSeeked);
          captureFrame();
        }
      },
      { once: true }
    );

    video.addEventListener(
      "error",
      () => {
        cleanup();
        resolve(undefined);
      },
      { once: true }
    );
  });

export const addProfileMediaFiles = async (files: File[], location?: string) => {
  const acceptedFiles = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
  const timestamp = Date.now();

  const nextMedia = (await Promise.all(
    acceptedFiles.map(async (file, index) => {
      const type: ProfileMediaType = file.type.startsWith("video/") ? "video" : "image";
      const src = URL.createObjectURL(file);
      const poster = type === "video" ? await generateVideoPoster(file) : undefined;

      return {
        id: `upload-${timestamp}-${index}-${file.name}`,
        type,
        src,
        poster,
        location,
        createdAt: timestamp + index,
      } satisfies ProfileMediaItem;
    })
  )) satisfies ProfileMediaItem[];

  uploadedMedia = [...nextMedia, ...uploadedMedia];
  profileMediaSnapshot = [...uploadedMedia, ...seedMedia];
  emitChange();

  return nextMedia;
};
