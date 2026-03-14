import type { SiteCard } from "@/app/types";
import { getHeroCardAnimationStyle } from "@/app/components/home/landing/home.constants";

type HeroSitePreviewCardProps = {
  card: SiteCard;
  animationIndex?: number;
  hasEntered?: boolean;
  isDragging?:  boolean,
};

export default function HeroSitePreviewCard({
  card,
  animationIndex = 0,
  hasEntered = true,
  isDragging = false,
}: HeroSitePreviewCardProps) {
  const imageUrl = card.image_url?.trim() ?? "";

  return (
    <div
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      className={`relative mx-auto h-[330px] w-[260px] select-none[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        hasEntered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${isDragging ? "transition-none duration-0" : "transition-[transform,opacity] duration-700"}`}
      style={getHeroCardAnimationStyle(animationIndex)}
    >
      <div className="relative h-[330px] w-[260px] scale-100 duration-200">
        <div
          className="absolute inset-0 flex scale-x-[1.03] scale-y-[1.025] flex-col justify-end overflow-hidden rounded-[57px] bg-cover bg-center brightness-[.8] shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transform-gpu"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div
          className="relative z-10 flex h-full w-full flex-col justify-end overflow-hidden rounded-[54px] bg-cover bg-center brightness-[1.5] transform-gpu"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="pointer-events-none absolute bottom-0 right-0 rotate-[180deg]">
            <div className="h-[200px] w-[270px] bg-black/50 opacity-100 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]" />
          </div>

          <div className="relative z-10 flex h-full w-full flex-col justify-end">
            <div className="pointer-events-none absolute inset-0 rounded-[50px] bg-black/30" />
            <div className="relative z-30 mb-[20px] px-[10px] text-center">
              <div className="text-white drop-shadow-[0px_0px_10px_rgba(0,0,0,.6)]">
                <p className="mb-[2px] text-[1.3rem] font-bold">{card.name}</p>
                <p className="line-clamp-2 px-[5px] text-[1rem]">{card.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
