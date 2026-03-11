"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";
import { SiteCard } from "@/app/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HERO_IMAGE_PRELOAD_TIMEOUT_MS = 4500;

type HeroImageStatus = "loaded" | "failed";

const shuffleCards = (cards: SiteCard[]) => {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const CARD_TRANSFORMS = [
  "z-10 -translate-x-[200px] lg:-translate-x-[260px] xl:-translate-x-[360px] scale-[0.65] hover:blur-none hover:opacity-100 hover:scale-[0.8] active:scale-[.7] hover:-translate-y-4 shadow-md",
  "z-20 -translate-x-[110px] lg:-translate-x-[130px] xl:-translate-x-[180px] scale-[0.85] hover:scale-[1] active:scale-[.9] hover:opacity-100 hover:-translate-y-4 shadow-xl",
  "z-30 scale-[1.05] shadow-2xl hover:scale-[1.17] active:scale-[1] hover:-translate-y-2 ring-2 ring-white/60",
  "z-20 translate-x-[110px] lg:translate-x-[130px] xl:translate-x-[180px] scale-[0.85] hover:scale-[1] active:scale-[.9] hover:opacity-100 hover:-translate-y-4 shadow-xl",
  "z-10 translate-x-[200px] lg:translate-x-[260px] xl:translate-x-[360px] scale-[0.65] hover:blur-none hover:opacity-100 hover:scale-[0.8] active:scale-[.7] hover:-translate-y-4 shadow-md",
];

const getHeroCardAnimationStyle = (index: number): CSSProperties => ({
  transitionDelay: `${index * 110}ms`,
});

const fireNotifyConfetti = () => {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    colors: ["#FFFFFF", "#007BFF", "#66B2FF", "#D199FF"],
    startVelocity: 32,
    spread: 80,
    ticks: 90,
    gravity: 0.9,
    scalar: 1.05,
    zIndex: 120,
  };

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }

    const particleCount = Math.max(12, Math.round(26 * (timeLeft / duration)));

    confetti({
      ...defaults,
      particleCount,
      angle: 60,
      origin: { x: 0, y: 0.58 },
    });

    confetti({
      ...defaults,
      particleCount,
      angle: 120,
      origin: { x: 1, y: 0.58 },
    });
  }, 220);
};

function HeroSitePreviewSkeleton() {
  return (
    <div className="mx-auto flex h-[330px] w-[260px] items-center justify-center pt-[4px]">
      <div className="origin-center scale-y-[1.08]">
        <SiteCardSkeleton />
      </div>
    </div>
  );
}

function HeroSitePreview({ card, animationIndex = 0 }: { card: SiteCard; animationIndex?: number }) {
  const imageUrl = card.image_url?.trim() ?? "";
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setHasEntered(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className={`relative mx-auto h-[330px] w-[260px] transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        hasEntered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={getHeroCardAnimationStyle(animationIndex)}
    >
      <div className="relative w-[260px] h-[330px] scale-100 duration-200 ">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-[57px] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] flex flex-col justify-end overflow-hidden scale-x-[1.03] scale-y-[1.025]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="rotate-[180deg] self-end">
            <div className="bg-blue-500/0 absolute w-[270px] top-[70px] rotate-[-180deg] backdrop-blur-[10px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] opacity-100 h-[270px]"></div>
          </div>
        </div>

        <div
          className="relative h-full w-full bg-cover bg-center rounded-[54px] flex flex-col justify-end overflow-hidden z-10"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >

        <div className="absolute bottom-0 right-0 rotate-[180deg] pointer-events-none">
            <div className="bg-blue-500/0 w-[270px] backdrop-blur-[2px] bg-black/50 [mask-image:linear-gradient(to_bottom,black_50%,transparent)] opacity-100 h-[200px]"></div>
          </div>

          <div className="relative z-10 h-full w-full flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/30 rounded-[50px] pointer-events-none" />
            <div className="relative z-30 text-center mb-[20px] px-[10px]">
              <div className="text-white drop-shadow-[0px_0px_10px_rgba(0,0,0,.6)]">
                <p className="font-bold text-[1.3rem] mb-[2px]">{card.name}</p>
                <p className="text-[1rem] px-[5px] line-clamp-2">{card.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const[isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [heroCards, setHeroCards] = useState<SiteCard[]>([]);
  const [heroImageStatusById, setHeroImageStatusById] = useState<Record<number, HeroImageStatus>>({});
  const [hasResolvedHeroCards, setHasResolvedHeroCards] = useState(false);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  const isValidEmail = useMemo(() => emailPattern.test(email.trim()), [email]);

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
        const cardsResponse = await supabase.rpc("get_random_locations", { p_limit: 6 });

        if (!isMounted) return;

        if (cardsResponse.error) {
          throw cardsResponse.error;
        }

        const selectedHeroCards = shuffleCards((cardsResponse.data as SiteCard[]) ?? []).slice(0, CARD_TRANSFORMS.length);

        setHeroCards(selectedHeroCards);
        setHasResolvedHeroCards(true);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch hero cards:", error);
        setHeroCards([]);
        setHeroImageStatusById({});
        setHasResolvedHeroCards(true);
        setIsHeroLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  },[]);

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

  const shouldShowHeroSlots = isHeroLoading || heroCards.length > 0;
  const heroSlotCount = shouldShowHeroSlots
    ? (heroCards.length > 0 ? heroCards.length : CARD_TRANSFORMS.length)
    : 0;
  const cardTransformOffset = Math.max(0, Math.floor((CARD_TRANSFORMS.length - heroSlotCount) / 2));
  const heroTransforms = CARD_TRANSFORMS.slice(cardTransformOffset, cardTransformOffset + heroSlotCount);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionMessage("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setSubmissionMessage("Configuration error. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { error } = await supabase.from("waitlist").insert({ email: email.trim() });
      if (error) throw error;

      fireNotifyConfetti();
      setSubmissionMessage("You’re in! We’ll let you know when we Launch.");
      setEmail("");
    } catch (error: unknown) {
      const dbError = error as { code?: string };
      if (dbError.code === "23505") {
        setSubmissionMessage("You are already on the list!");
      } else {
        setSubmissionMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden scroll-smooth text-slate-800">
      <section
        className="relative flex flex-col justify-center min-h-[130dvh] overflow-hidden bg-[#050b16]/0 px-4 pt-16 pb-8 sm:px-6 lg:px-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="hero-heart-intro absolute inset-0">
            <div
              className="pointer-events-none absolute inset-[-6%] opacity-[.6] rotate-180 blur-[50px] max-sm:blur-[30px] top-[-1900px] max-sm:top-[-1900px]"
              style={{
                backgroundImage:
                  'url("https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/heart-bg-gradient.png")',
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>
        <div className="relative z-10 w-full mx-auto max-w-[90vw] w-[1400px] flex flex-col items-center">
          <div className="flex flex-col items-center text-center mt-20 lg:mt-30 z-40">
            <div className="relative inline-flex flex-col items-center">
              <h1 className="max-w-[850px] text-[3.2rem] font-black leading-[1.1] text-slate-800 sm:text-[4.5rem] lg:text-[5.5rem] tracking-[-0.02em]">
                  Bajan Stories
              </h1>
            </div>

            <p className="fontshine max-w-[700px] font-bold leading-[1.6] text-slate-800 text-[1.4rem]">
              Coming Soon
            </p>

            <p className="mt-6 max-w-[700px] text-[1rem] font-medium leading-[1.6] text-slate-800 sm:text-[1.2rem]">
              A new way to experience Barbados, beginning in St. Joseph through place, memory, and resilience. Explore rich coastal history paired with an emersive 3D parish map.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-[560px]">
              <div className="relative flex justify-end items-center rounded-full border-[3px] border-white bg-[#fff]/7 p-[3px] hover:shadow-[0px_0px_40px_rgba(31,63,122,0.2)] shadow-[0px_0px_40px_rgba(31,63,122,0.15)] transition-shadow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-transparent py-4 pl-4 pr-[126px] text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={!isValidEmail || isSubmitting}
                  className={`absolute flex rounded-full py-[13px] active:scale-[.97] px-[22px] mr-[3px] font-semibold transition-all duration-300
                      ${isSubmitting
                                      ? 'bg-transparent'
                                      : isValidEmail
                                          ? 'bg-[#007BFF] hover:bg-[#0056b3] text-white shadow-[0_4px_14px_rgba(0,123,255,0.4)]'
                                          : 'bg-[#777]/20 text-slate-400'
                                  }
                                  ${isSubmitting || !isValidEmail ? "" : "cursor-pointer"}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving
                    </span>
                  ) : (
                    "Notify Me"
                  )}
                </button>
              </div>

              <div className="mt-3 min-h-[24px]">
                {submissionMessage && (
                  <div
                    className={`flex items-center justify-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-1 ${
                      submissionMessage.includes("You’re in!") || submissionMessage.includes("already")
                        ? "text-[#007BFF]"
                        : "text-red-500"
                    }`}
                  >
                    {submissionMessage.includes("You’re in!") && <CheckCircle2 className="h-4 w-4" />}
                    {submissionMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Epic 3D Feature Spread Array Showcase */}
          <div className="mt-16 lg:mt-24 w-full flex flex-col items-center z-30">
            
            <div className="flex items-center gap-4 mb-10 opacity-70 px-4">
               <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-l from-slate-300 to-transparent"></div>
               <p className="font-bold text-slate-500 text-[0.8rem] sm:text-[0.9rem] tracking-[0.2em] uppercase text-center">
                  Discover the sites and stories of St. Joseph
               </p>
               <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* Desktop Layout - 3D Cover Flow Style */}
            <div className="relative max-sm:scale-[.8] flex justify-center  items-center w-full h-[360px]">
                {heroTransforms.map((transform, idx) => {
                  const card = heroCards[idx];
                  const cardStatus = card ? heroImageStatusById[card.id] : undefined;
                  const shouldRenderCard = Boolean(card) && !isHeroLoading && cardStatus === "loaded";

                  return (
                    <div
                      key={`hero-slot-${idx}`}
                      className={`hero-cards-intro absolute transition-all rounded-[57px] duration-500 ease-out ${
                        shouldRenderCard ? "cursor-pointer" : ""
                      } ${transform}`}
                    >
                      {shouldRenderCard && card ? (
                        <HeroSitePreview card={card} animationIndex={idx} />
                      ) : (
                        <HeroSitePreviewSkeleton />
                      )}
                    </div>
                  );
                })}
            </div>

          </div>

        </div>
      </section>

      <style jsx>{`
        .hero-heart-intro {
          animation: hero-heart-intro 2000ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes hero-heart-intro {
          from {
            opacity: 0;
            transform: translateY(-540px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-cards-intro {
          animation: hero-cards-intro 2000ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes hero-cards-intro {
          from {
            opacity: 0;
            transform: translateY(540px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
