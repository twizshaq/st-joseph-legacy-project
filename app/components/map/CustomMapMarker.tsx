import React from 'react';

export type CustomMapMarkerProps = {
    name: string;
    pointimage?: string;
    color?: string;
    isTextMode?: boolean;
    stopNumber?: number;
};

const CustomMapMarker: React.FC<CustomMapMarkerProps> = ({
    name,
    pointimage,
    color = 'rgb(80, 86, 102)',
    isTextMode = false,
    stopNumber,
}) => {
    // FIX 3: Removed console.log

    if (isTextMode) {
        return (
            <div className="flex flex-col items-center cursor-pointer text-white">
                <div className="w-auto bg-transparent backdrop-blur-[3px] p-[3px] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
                    {stopNumber && (
                        <div className="absolute ml-[12px] top-[8px] text-[.8rem] font-bold">
                            {stopNumber}.
                        </div>
                    )}
                    <div className={`bg-black/45 rounded-full font-bold px-[12px] py-[5px] ${stopNumber ? 'pl-[27px]' : 'pl-[12px]'}`}>
                        {name}
                    </div>
                </div>
                <div className="w-[20px] h-[20px] bg-white/90 shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transform rotate-45 -mt-[15.5px] rounded-[5px] z-[-1]" />
            </div>
        );
    }

    const circleStyle: React.CSSProperties = {
        backgroundImage: pointimage ? `url("${pointimage}")` : 'none',
        backgroundColor: pointimage ? 'transparent' : color,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div
            className="
                group relative
                w-[48px] h-[58px]
                flex flex-col items-center
                cursor-pointer
                translate-y-[15px]
                /* Hardware acceleration hint */
                will-change-transform
            "
        >
            <div
                className="
                    bg-white/60 backdrop-blur-[3px]
                    rounded-full p-[3px]
                    shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                    
                    /* FIX 1: Targeted transitions instead of transition-all */
                    transition-[padding,background-color,transform] duration-300
                    
                    group-hover:p-[3px]
                    group-hover:bg-[#007BFF]/70
                    group-hover:-translate-y-[1px]
                "
            >
                <div
                    style={circleStyle}
                    className="relative overflow-hidden w-[35px] h-[35px] rounded-full bg-cover bg-center flex items-center justify-center">
                    {stopNumber && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                            <span className="text-white font-extrabold text-sm drop-shadow-md">
                                {stopNumber}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="relative
                    w-[20px] h-[20px]
                    rotate-45
                    -mt-[15.5px]
                    group-hover:-mt-[16px]
                    rounded-[5px]
                    shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                    z-[-1]
                    
                    transition-[margin] duration-300
                    "
            >
                {/* LAYER 1: The Base White (Always visible) */}
                <div className="absolute inset-0 bg-white/90 rounded-[5px]" />

                {/* LAYER 2: The Gradient (Fades in on hover) */}
                <div 
                    className="
                        absolute inset-0 
                        bg-[linear-gradient(to_bottom,#007BFF,#66B2FF)] 
                        opacity-0 
                        rounded-[5px]
                        group-hover:opacity-100 
                        transition-opacity duration-300
                    " 
                />
            </div>
        </div>
    );
};

export default CustomMapMarker;