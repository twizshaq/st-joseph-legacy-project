import { HEART_BACKGROUND_IMAGE_URL } from "@/app/components/home/landing/home.constants";

export default function HeroBackground() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="hero-heart-intro absolute inset-0">
          <div
            className="pointer-events-none absolute inset-[-6%] top-[-3000px] rotate-180 opacity-[.6] blur-[50px] max-sm:top-[-3300px] max-sm:blur-[30px]"
            style={{
              backgroundImage: `url("${HEART_BACKGROUND_IMAGE_URL}")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
        </div>
      </div>

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
      `}</style>
    </>
  );
}
