import {
  CARD_TRANSFORMS,
  HERO_CENTER_SLOT_INDEX,
  HERO_VISIBLE_DISTANCE,
  getHeroCardMotionStyle,
  getSignedCarouselDistance,
} from "@/app/components/home/landing/home.constants";
import type { HeroCarouselModel } from "@/app/components/home/landing/home.types";
import HeroSitePreviewCard from "@/app/components/home/landing/HeroSitePreviewCard";
import HeroSitePreviewSkeleton from "@/app/components/home/landing/HeroSitePreviewSkeleton";

type HeroSiteCarouselProps = {
  hero: HeroCarouselModel;
};

export default function HeroSiteCarousel({ hero }: HeroSiteCarouselProps) {
  const {
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
  } = hero;

  return (
    <div
      ref={heroViewportRef}
      className={`relative flex h-[360px] w-[800px] items-center justify-center select-none max-sm:scale-[.8] ${
        canNavigateHeroCards ? (isHeroDragging ? "cursor-grabbing" : "cursor-grab") : ""
      } ${isHeroDragging ? "pointer-events-none" : ""}`}
      style={{
        touchAction: "pan-y",
        perspective: isDesktopHeroLayout ? "1800px" : undefined,
        perspectiveOrigin: isDesktopHeroLayout ? "50% 42%" : undefined,
      }}
      onPointerDown={handleHeroPointerDown}
      onPointerMove={handleHeroPointerMove}
      onPointerUp={handleHeroPointerUp}
      onPointerCancel={handleHeroPointerUp}
      onDragStart={(event) => event.preventDefault()}
    >
      {isHeroLoading
        ? CARD_TRANSFORMS.map((transform, idx) => (
            <div key={`hero-loading-slot-${idx}`} className={`hero-cards-intro absolute rounded-[57px] ${transform}`}>
              <HeroSitePreviewSkeleton />
            </div>
          ))
        : heroCards.map((card, index) => {
            const relativePosition = getSignedCarouselDistance(index, heroCarouselPosition, heroCards.length);

            if (Math.abs(relativePosition) > HERO_VISIBLE_DISTANCE) {
              return null;
            }

            const cardStatus = heroImageStatusById[card.id];
            const shouldRenderCard = cardStatus === "loaded";

            return (
              <div
                key={`hero-card-${card.id}`}
                // OPTIMIZATION: Added transform-gpu here to ensure the 3D movement is handled entirely by the GPU
                className={`hero-cards-intro absolute rounded-[57px] transform-gpu [transform-style:preserve-3d] will-change-transform ${
                  shouldRenderCard ? "cursor-pointer" : ""
                }`}
                style={getHeroCardMotionStyle(relativePosition, isDesktopHeroLayout)}
              >
                {shouldRenderCard ? (
                  <HeroSitePreviewCard
                    card={card}
                    animationIndex={Math.abs(relativePosition) < 0.5 ? HERO_CENTER_SLOT_INDEX : index}
                    hasEntered={hasHeroCardsEntered}
                    isDragging={isHeroDragging}
                  />
                ) : (
                  <HeroSitePreviewSkeleton />
                )}
              </div>
            );
          })}
    </div>
  );
}
