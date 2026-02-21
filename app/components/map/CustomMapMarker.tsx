import React from 'react';

export type CustomMapMarkerProps = {
    name: string;
    pointimage?: string;
    color?: string;
    isTextMode?: boolean;
};

const CustomMapMarker: React.FC<CustomMapMarkerProps> = ({
    name,
    pointimage,
    color = 'rgb(80, 86, 102)',
    isTextMode = false,
}) => {
    // DEBUG: Log the props to the browser's developer console
    console.log(`Marker "${name}" received pointimage:`, pointimage);
    if (isTextMode) {
        return (
            <div
                className="flex flex-col items-center cursor-pointer text-white"
            >
                <div className="w-auto bg-transparent backdrop-blur-[3px] p-[3px] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
                    <div className="bg-black/45 rounded-full font-bold px-[12px] py-[5px]">
                        {name}
                    </div>
                </div>
                <div className="w-[20px] h-[20px] bg-white/90 shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transform rotate-45 -mt-[15.5px] rounded-[4px] z-[-1]" />
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
            "
        >
            <div
                className="
                    bg-white/60 backdrop-blur-[3px]
                    rounded-full p-[3px]
                    shadow-[0px_0px_10px_rgba(0,0,0,0.2])]
                    transition-[padding,transform,hover] duration-200
                    group-hover:p-0
                    group-hover:-translate-y-[1px]
                    group-hover:ring-[3.5px] group-hover:ring-[#007BFF]
                    "
            >
                <div
                    style={circleStyle}
                    className="w-[35px] h-[35px] rounded-full bg-cover bg-center"
                />
            </div>

            <div
                className="relative
                    w-[20px] h-[20px]
                    bg-white/90
                    rotate-45
                    -mt-[15.5px]
                    group-hover:-mt-[13px]
                    rounded-[4px]
                    shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                    transition-all duration-200
                    group-hover:bg-[linear-gradient(to_bottom,#007BFF,#66B2FF)] z-[-1]
                    "
            />
        </div>

    );
};

export default CustomMapMarker;
