import ArrowIcon from "@/public/icons/arrow-icon";
import Portal from '@/app/components/Portal';


// Drop this near your other helper components at the bottom, or import it!
const GalleryNavButtons = ({ canScrollLeft, canScrollRight, scrollGallery }: any) => {
    return (
        <>
            {/* PREVIOUS BUTTON */}
            <div 
                className={`hidden md:flex absolute left-[10px] top-1/2 -translate-y-1/2 z-[55] items-center justify-center p-[2.5px] rounded-full bg-white/10 shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition duration-200 active:scale-[0.93] pointer-events-auto cursor-pointer transform-gpu ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                // Explicit webkit overrides guarantee the blur works through parent stacking contexts!
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} 
                onClick={(e) => { e.stopPropagation(); scrollGallery('left'); }}
            >
                <button
                    type="button"
                    disabled={!canScrollLeft}
                    aria-label="Previous"
                    className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer pointer-events-none'
                >
                    <span className='-rotate-90 flex mr-[2px] items-center scale-[1.1] justify-center text-white'>
                        <ArrowIcon width={30} height={30} />
                    </span>
                </button>
            </div>

            {/* NEXT BUTTON */}
            <div 
                className={`hidden md:flex absolute right-[10px] top-1/2 -translate-y-1/2 z-[55] items-center justify-center p-[2.5px] rounded-full bg-white/10 shadow-[0px_0px_15px_rgba(0,0,0,0.3)] transition duration-200 active:scale-[0.93] pointer-events-auto cursor-pointer transform-gpu ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                onClick={(e) => { e.stopPropagation(); scrollGallery('right'); }}
            >
                <button
                    type="button"
                    disabled={!canScrollRight}
                    aria-label="Next"
                    className='bg-black/40 rounded-full w-[50px] h-[50px] cursor-pointer pointer-events-none'
                >
                    <span className='rotate-90 flex ml-[2px] items-center scale-[1.1] justify-center text-white'>
                        <ArrowIcon width={30} height={30} />
                    </span>
                </button>
            </div>
        </>
    );
};

export default GalleryNavButtons;