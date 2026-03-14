import type { CSSProperties } from "react";
import type { SiteCard } from "@/app/types";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const HERO_IMAGE_PRELOAD_TIMEOUT_MS = 4500;
export const HERO_CARD_FETCH_LIMIT = 10;
export const HERO_DRAG_PIXELS_PER_CARD = 180;
export const HERO_TOUCH_DRAG_PIXELS_PER_CARD = 170;
export const HERO_DRAG_DIRECTION_LOCK_PX = 12;
export const HERO_TOUCH_DRAG_DIRECTION_LOCK_PX = 8;
export const HERO_MOMENTUM_BOOST_PER_WHEEL_UNIT = 0.055;
export const HERO_TOUCH_RELEASE_BOOST = 1.5;
export const HERO_MOMENTUM_DECAY_PER_SECOND = 5.4;
export const HERO_SNAP_SPRING_STRENGTH = 22;
export const HERO_SNAP_DAMPING = 9;
export const HERO_MIN_VELOCITY_TO_KEEP_MOVING = 0.015;
export const HERO_VISIBLE_DISTANCE = 2.65;
export const HERO_DESKTOP_BREAKPOINT_PX = 1024;
export const HERO_VELOCITY_SAMPLE_LIMIT = 5;
export const HOME_SITE_SURVEY_OPTIONS = [
  "I haven't been to any listed locations.",
  "Zaccios",
  "Hunte's",
  "Joe's River Bridge",
  "Naniki",
  "Old Chapel",
  "Parris Hill Painted Sculptures",
  "Peg Farm",
  "Round House",
  "Soup Bowl, Bathsheba",
  "St Aidans Church",
  "St Anne Church",
  "St Joseph Church",
  "Tent Bay, Bathsheba",
  "Andromeda, Bathsheba",
  "Atlantis Hotel",
  "Bathsheba Park",
  "Blackman's Bridge",
  "Chalky Mount",
  "CocoHill Forest",
  "Cottage Bar & Grill",
  "Cotton Tower",
  "Eco Lodge",
  "Eric Holder Jr Municipal Complex",
  "Flower Forest",
  "Grantley Adams School",
  "Hackelton Cliff",
  "Hillcrest, Bathsheba",
] as const;
export const HEART_BACKGROUND_IMAGE_URL =
  "https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/heart-bg-gradient.png";
export const SURVEY_SPONSOR_IMAGE_URL =
  "https://auth.bajanstories.com/storage/v1/object/public/sponsors/dem_barbados_logo.webp";

export const CARD_TRANSFORMS = [
  "z-10 -translate-x-[200px] lg:-translate-x-[260px] xl:-translate-x-[360px] scale-[0.65] hover:blur-none hover:opacity-100 hover:scale-[0.8] active:scale-[.7] hover:-translate-y-4 shadow-sm",
  "z-20 -translate-x-[110px] lg:-translate-x-[130px] xl:-translate-x-[180px] scale-[0.85] hover:scale-[1] active:scale-[.9] hover:opacity-100 hover:-translate-y-4 shadow-md",
  "z-30 scale-[1.05] shadow-2xl hover:scale-[1.17] active:scale-[1] hover:-translate-y-2 ring-2 ring-white/60",
  "z-20 translate-x-[110px] lg:translate-x-[130px] xl:translate-x-[180px] scale-[0.85] hover:scale-[1] active:scale-[.9] hover:opacity-100 hover:-translate-y-4 shadow-md",
  "z-10 translate-x-[200px] lg:translate-x-[260px] xl:translate-x-[360px] scale-[0.65] hover:blur-none hover:opacity-100 hover:scale-[0.8] active:scale-[.7] hover:-translate-y-4 shadow-sm",
] as const;

export const HERO_VISIBLE_CARD_COUNT = CARD_TRANSFORMS.length;
export const HERO_CENTER_SLOT_INDEX = Math.floor(HERO_VISIBLE_CARD_COUNT / 2);

export const shuffleCards = (cards: SiteCard[]) => {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;

export const normalizeCarouselPosition = (position: number, total: number) => {
  if (total === 0) return 0;
  return ((position % total) + total) % total;
};

export const getHeroDragPixelsPerCard = (pointerType: string) =>
  pointerType === "touch" ? HERO_TOUCH_DRAG_PIXELS_PER_CARD : HERO_DRAG_PIXELS_PER_CARD;

export const getHeroDirectionLockPx = (pointerType: string) =>
  pointerType === "touch" ? HERO_TOUCH_DRAG_DIRECTION_LOCK_PX : HERO_DRAG_DIRECTION_LOCK_PX;

export const getSignedCarouselDistance = (index: number, position: number, total: number) => {
  if (total === 0) return 0;

  let distance = index - position;
  const half = total / 2;

  while (distance > half) distance -= total;
  while (distance < -half) distance += total;

  return distance;
};

export const getHeroCardAnimationStyle = (index: number): CSSProperties => ({
  transitionDelay: `${index * 110}ms`,
});

export const getHeroCardMotionStyle = (relativePosition: number, isDesktop: boolean): CSSProperties => {
  const direction = Math.sign(relativePosition);
  const distance = Math.abs(relativePosition);

  if (isDesktop) {
    const baseOffset = distance <= 1 ? distance * 192 : 192 + (distance - 1) * 138;
    const translateX = direction * baseOffset;
    const translateY = distance * 10;
    const translateZ = -distance * 180;
    const scale = clamp(1.06 - distance * 0.11, 0.76, 1.06);
    const rotateY = direction * clamp(distance * 7, 0, 12);
    const zIndex = Math.round(60 - distance * 12);

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity: 1,
      willChange: "transform, opacity",
      zIndex,
      pointerEvents: distance <= 1.3 ? "auto" : "none",
    };
  }

  const baseOffset = distance <= 1 ? distance * 118 : 118 + (distance - 1) * 150;
  const translateX = direction * baseOffset;
  const translateY = distance * 4;
  const translateZ = -distance * 72;
  const scale = clamp(1.06 - distance * 0.18, 0.72, 1.06);
  const opacity = clamp(1 - Math.max(0, distance - 1) * 0.18, 0.12, 1);
  const rotateY = direction * clamp(distance * 7, 0, 10);
  const zIndex = Math.round(50 - distance * 10);

  return {
    transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity,
    willChange: "transform, opacity",
    zIndex,
    pointerEvents: distance <= 1.4 ? "auto" : "none",
  };
};
