import { SiteCardSkeleton } from "@/app/components/SiteCardSkeleton";

export default function HeroSitePreviewSkeleton() {
  return (
    <div className="mx-auto flex h-[330px] w-[260px] items-center justify-center pt-[4px]">
      <div className="origin-center scale-y-[1.08]">
        <SiteCardSkeleton />
      </div>
    </div>
  );
}
