"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@supabase/supabase-js";
import type { SiteCard } from "@/app/types";
import {
  HERO_CARD_FETCH_LIMIT,
  HERO_DESKTOP_BREAKPOINT_PX,
  HERO_IMAGE_PRELOAD_TIMEOUT_MS,
  HERO_MIN_VELOCITY_TO_KEEP_MOVING,
  HERO_MOMENTUM_BOOST_PER_WHEEL_UNIT,
  HERO_MOMENTUM_DECAY_PER_SECOND,
  HERO_SNAP_DAMPING,
  HERO_SNAP_SPRING_STRENGTH,
  HERO_TOUCH_RELEASE_BOOST,
  HERO_VELOCITY_SAMPLE_LIMIT,
  average,
  clamp,
  getHeroDragPixelsPerCard,
  getHeroDirectionLockPx,
  normalizeCarouselPosition,
  shuffleCards,
} from "@/app/components/home/landing/home.constants";
import type {
  HeroCarouselModel,
  HeroImageStatus,
  HeroPointerState,
} from "@/app/components/home/landing/home.types";

export const useHomeHeroCarousel = (): HeroCarouselModel => {
  const [heroCards, setHeroCards] = useState<SiteCard[]>([]);
  const [heroCarouselPosition, setHeroCarouselPosition] = useState(0);
  const [heroImageStatusById, setHeroImageStatusById] = useState<Record<number, HeroImageStatus>>({});
  const [hasResolvedHeroCards, setHasResolvedHeroCards] = useState(false);
  const [hasHeroCardsEntered, setHasHeroCardsEntered] = useState(false);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const [isDesktopHeroLayout, setIsDesktopHeroLayout] = useState(false);
  const heroViewportRef = useRef<HTMLDivElement | null>(null);
  const heroPointerStateRef = useRef<HeroPointerState | null>(null);
  const heroCarouselPositionRef = useRef(0);
  const heroQueuedPositionRef = useRef<number | null>(null);
  const heroQueuedCardCountRef = useRef(0);
  const heroVelocityRef = useRef(0);
  const heroAnimationFrameRef = useRef<number | null>(null);
  const heroDragFrameRef = useRef<number | null>(null);
  const heroLastFrameTimestampRef = useRef<number | null>(null);

  const setHeroPosition = useCallback((nextPosition: number, totalCards: number) => {
    const normalizedPosition = normalizeCarouselPosition(nextPosition, totalCards);
    heroCarouselPositionRef.current = normalizedPosition;
    setHeroCarouselPosition(normalizedPosition);
  }, []);

  const flushQueuedHeroPosition = useCallback(() => {
    if (heroDragFrameRef.current !== null) {
      window.cancelAnimationFrame(heroDragFrameRef.current);
      heroDragFrameRef.current = null;
    }

    const queuedPosition = heroQueuedPositionRef.current;
    const queuedCardCount = heroQueuedCardCountRef.current;

    heroQueuedPositionRef.current = null;
    heroQueuedCardCountRef.current = 0;

    if (queuedPosition === null || queuedCardCount <= 0) {
      return;
    }

    setHeroPosition(queuedPosition, queuedCardCount);
  }, [setHeroPosition]);

  const queueHeroPosition = useCallback((nextPosition: number, totalCards: number) => {
    heroQueuedPositionRef.current = nextPosition;
    heroQueuedCardCountRef.current = totalCards;

    if (heroDragFrameRef.current !== null) {
      return;
    }

    heroDragFrameRef.current = window.requestAnimationFrame(() => {
      heroDragFrameRef.current = null;

      const queuedPosition = heroQueuedPositionRef.current;
      const queuedCardCount = heroQueuedCardCountRef.current;

      heroQueuedPositionRef.current = null;
      heroQueuedCardCountRef.current = 0;

      if (queuedPosition === null || queuedCardCount <= 0) {
        return;
      }

      setHeroPosition(queuedPosition, queuedCardCount);
    });
  }, [setHeroPosition]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setHasHeroCardsEntered(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${HERO_DESKTOP_BREAKPOINT_PX}px)`);
    const syncDesktopHeroLayout = () => {
      setIsDesktopHeroLayout(mediaQuery.matches);
    };

    syncDesktopHeroLayout();
    mediaQuery.addEventListener("change", syncDesktopHeroLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncDesktopHeroLayout);
    };
  }, []);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setHeroCards([]);
      setHeroImageStatusById({});
      setHasResolvedHeroCards(true);
      setIsHeroLoading(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        const cardsResponse = await supabase.rpc("get_random_locations", { p_limit: HERO_CARD_FETCH_LIMIT });

        if (!isMounted) return;

        if (cardsResponse.error) {
          throw cardsResponse.error;
        }

        const selectedHeroCards = shuffleCards((cardsResponse.data as SiteCard[]) ?? []).slice(0, HERO_CARD_FETCH_LIMIT);

        setHeroCards(selectedHeroCards);
        heroVelocityRef.current = 0;
        setHeroPosition(0, selectedHeroCards.length);
        setHasResolvedHeroCards(true);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch hero cards:", error);
        setHeroCards([]);
        heroVelocityRef.current = 0;
        setHeroPosition(0, 0);
        setHeroImageStatusById({});
        setHasResolvedHeroCards(true);
        setIsHeroLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, [setHeroPosition]);

  useEffect(() => {
    if (heroCards.length === 0) {
      heroVelocityRef.current = 0;
      setHeroPosition(0, 0);
      return;
    }

    setHeroPosition(heroCarouselPositionRef.current, heroCards.length);
  }, [heroCards.length, setHeroPosition]);

  useEffect(() => {
    if (!hasResolvedHeroCards) {
      return;
    }

    if (heroCards.length === 0) {
      setHeroImageStatusById({});
      setIsHeroLoading(false);
      return;
    }

    let isCancelled = false;

    setHeroImageStatusById({});
    setIsHeroLoading(true);

    const settledStatuses: Record<number, HeroImageStatus> = {};
    const cleanupHandlers: Array<() => void> = [];

    const settleCard = (cardId: number, status: HeroImageStatus) => {
      if (isCancelled || settledStatuses[cardId]) return;

      settledStatuses[cardId] = status;

      setHeroImageStatusById((current) => {
        if (current[cardId] === status) {
          return current;
        }

        return {
          ...current,
          [cardId]: status,
        };
      });

      if (Object.keys(settledStatuses).length === heroCards.length) {
        setIsHeroLoading(false);
      }
    };

    heroCards.forEach((card) => {
      const imageUrl = card.image_url?.trim() ?? "";

      if (!imageUrl) {
        settleCard(card.id, "failed");
        return;
      }

      const image = new window.Image();
      const timeoutId = window.setTimeout(() => {
        cleanupImageListeners();
        settleCard(card.id, "failed");
      }, HERO_IMAGE_PRELOAD_TIMEOUT_MS);

      const cleanupImageListeners = () => {
        window.clearTimeout(timeoutId);
        image.onload = null;
        image.onerror = null;
      };

      image.onload = () => {
        cleanupImageListeners();
        settleCard(card.id, "loaded");
      };

      image.onerror = () => {
        cleanupImageListeners();
        settleCard(card.id, "failed");
      };

      image.src = imageUrl;

      if (image.complete) {
        cleanupImageListeners();
        settleCard(card.id, image.naturalWidth > 0 ? "loaded" : "failed");
      }

      cleanupHandlers.push(cleanupImageListeners);
    });

    return () => {
      isCancelled = true;
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, [hasResolvedHeroCards, heroCards]);

  const canNavigateHeroCards = !isHeroLoading && heroCards.length > 1;

  const kickHeroMomentumLoop = useCallback(() => {
    if (heroAnimationFrameRef.current !== null || heroCards.length <= 1) {
      return;
    }

    const animate = (timestamp: number) => {
      if (heroLastFrameTimestampRef.current === null) {
        heroLastFrameTimestampRef.current = timestamp;
      }

      const deltaTime = Math.min((timestamp - heroLastFrameTimestampRef.current) / 1000, 0.05);
      heroLastFrameTimestampRef.current = timestamp;

      const totalCards = heroCards.length;

      if (totalCards <= 1) {
        heroAnimationFrameRef.current = null;
        heroLastFrameTimestampRef.current = null;
        heroVelocityRef.current = 0;
        return;
      }

      let nextVelocity = heroVelocityRef.current;
      let nextPosition = heroCarouselPositionRef.current + nextVelocity * deltaTime;

      const nearestCard = Math.round(nextPosition);
      const distanceToNearest = nearestCard - nextPosition;

      if (Math.abs(nextVelocity) > HERO_MIN_VELOCITY_TO_KEEP_MOVING) {
        nextVelocity *= Math.exp(-HERO_MOMENTUM_DECAY_PER_SECOND * deltaTime);
      } else {
        nextVelocity += distanceToNearest * HERO_SNAP_SPRING_STRENGTH * deltaTime;
        nextVelocity *= Math.exp(-HERO_SNAP_DAMPING * deltaTime);
      }

      nextPosition = normalizeCarouselPosition(nextPosition, totalCards);
      const snappedNearest = Math.round(nextPosition);
      const normalizedNearest = normalizeCarouselPosition(snappedNearest, totalCards);
      const isSettled =
        Math.abs(nextVelocity) < HERO_MIN_VELOCITY_TO_KEEP_MOVING &&
        Math.abs(snappedNearest - nextPosition) < 0.01;

      if (isSettled) {
        heroVelocityRef.current = 0;
        setHeroPosition(normalizedNearest, totalCards);
        heroAnimationFrameRef.current = null;
        heroLastFrameTimestampRef.current = null;
        return;
      }

      heroVelocityRef.current = nextVelocity;
      setHeroPosition(nextPosition, totalCards);
      heroAnimationFrameRef.current = window.requestAnimationFrame(animate);
    };

    heroAnimationFrameRef.current = window.requestAnimationFrame(animate);
  }, [heroCards.length, setHeroPosition]);

  const applyHeroMomentum = useCallback((velocityDelta: number) => {
    if (!canNavigateHeroCards) return;

    heroVelocityRef.current += velocityDelta;
    kickHeroMomentumLoop();
  }, [canNavigateHeroCards, kickHeroMomentumLoop]);

  const resetHeroPointerState = () => {
    heroPointerStateRef.current = null;
    setIsHeroDragging(false);
  };

  const handleHeroPointerDown: HeroCarouselModel["handleHeroPointerDown"] = (event) => {
    if (!canNavigateHeroCards) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    flushQueuedHeroPosition();

    if (heroAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(heroAnimationFrameRef.current);
      heroAnimationFrameRef.current = null;
    }

    heroLastFrameTimestampRef.current = null;
    heroVelocityRef.current = 0;

    heroPointerStateRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      isHorizontalSwipe: null,
      lastX: event.clientX,
      lastTimestamp: event.timeStamp,
      velocity: 0,
      velocitySamples: [],
    };

    setIsHeroDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHeroPointerMove: HeroCarouselModel["handleHeroPointerMove"] = (event) => {
    const pointerState = heroPointerStateRef.current;

    if (!pointerState || pointerState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointerState.startX;
    const deltaY = event.clientY - pointerState.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const directionLockPx = getHeroDirectionLockPx(pointerState.pointerType);

    if (pointerState.isHorizontalSwipe === null) {
      if (absDeltaX < directionLockPx && absDeltaY < directionLockPx) {
        return;
      }

      pointerState.isHorizontalSwipe = absDeltaX > absDeltaY;
    }

    if (!pointerState.isHorizontalSwipe) {
      return;
    }

    const elapsedMs = Math.max(event.timeStamp - pointerState.lastTimestamp, 16);
    const moveDeltaX = event.clientX - pointerState.lastX;
    const positionDelta = -moveDeltaX / getHeroDragPixelsPerCard(pointerState.pointerType);
    const instantaneousVelocity = positionDelta / (elapsedMs / 1000);
    const currentPosition = heroQueuedPositionRef.current ?? heroCarouselPositionRef.current;

    heroVelocityRef.current = pointerState.velocity * 0.16;
    queueHeroPosition(currentPosition + positionDelta, heroCards.length);

    pointerState.velocitySamples = [...pointerState.velocitySamples, instantaneousVelocity].slice(-HERO_VELOCITY_SAMPLE_LIMIT);
    pointerState.velocity = average(pointerState.velocitySamples);
    pointerState.lastX = event.clientX;
    pointerState.lastTimestamp = event.timeStamp;
    event.preventDefault();
  };

  const handleHeroPointerUp: HeroCarouselModel["handleHeroPointerUp"] = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    flushQueuedHeroPosition();

    const pointerState = heroPointerStateRef.current;

    if (pointerState?.pointerId === event.pointerId && pointerState.isHorizontalSwipe) {
      const releaseVelocity =
        pointerState.pointerType === "touch"
          ? pointerState.velocity * HERO_TOUCH_RELEASE_BOOST
          : pointerState.velocity;

      applyHeroMomentum(clamp(releaseVelocity, -10, 10));
    }

    resetHeroPointerState();
  };

  useEffect(() => {
    const heroViewport = heroViewportRef.current;

    if (!heroViewport) {
      return;
    }

    const handleHeroWheel = (event: WheelEvent) => {
      if (!canNavigateHeroCards) return;

      const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(dominantDelta) < 2) {
        return;
      }

      event.preventDefault();
      applyHeroMomentum(dominantDelta * HERO_MOMENTUM_BOOST_PER_WHEEL_UNIT);
    };

    heroViewport.addEventListener("wheel", handleHeroWheel, { passive: false });

    return () => {
      heroViewport.removeEventListener("wheel", handleHeroWheel);
    };
  }, [applyHeroMomentum, canNavigateHeroCards]);

  useEffect(() => {
    return () => {
      flushQueuedHeroPosition();

      if (heroAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(heroAnimationFrameRef.current);
      }
    };
  }, [flushQueuedHeroPosition]);

  return {
    heroViewportRef,
    heroCards,
    heroCarouselPosition,
    heroImageStatusById,
    hasHeroCardsEntered,
    isHeroLoading,
    isHeroDragging,
    isDesktopHeroLayout,
    canNavigateHeroCards,
    handleHeroPointerDown,
    handleHeroPointerMove,
    handleHeroPointerUp,
  };
};
