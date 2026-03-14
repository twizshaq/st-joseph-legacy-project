export default function HomeHeroHeading() {
  return (
    <>
      <div className="relative inline-flex flex-col items-center">
        <h1 className="max-w-[850px] text-[4rem] font-bold tracking-[-0.02em] text-slate-800 max-sm:text-[2.3rem]">
          Bajan Stories
        </h1>
        <h1 className="max-w-[850px] text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-slate-800 max-sm:text-[2.3rem]">
          Unveiling St Joseph
        </h1>
      </div>

      <p className="fontshine mt-6 max-w-[700px] text-[2rem] font-bold text-slate-800">
        Coming Soon
      </p>

      <div className="mt-6 flex items-center gap-4 px-4">
        <p className="text-center text-[0.8rem] font-bold uppercase tracking-[0.2em] text-slate-800 sm:text-[0.9rem]">
          Weaving St. Joseph&apos;s past into a resilient future.
        </p>
      </div>
    </>
  );
}
