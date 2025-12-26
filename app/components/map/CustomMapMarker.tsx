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
        <div className="w-auto bg-white/10 backdrop-blur-[3px] p-[3px] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <div className="bg-black/45 rounded-full font-bold px-[12px] py-[5px]">
            {name}
          </div>
        </div>
        <div className="w-[20px] h-[20px] bg-white/40 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transform rotate-45 -mt-[15.5px] rounded-[4px] z-[-1]" />
      </div>
    );
  }

  const circleStyle: React.CSSProperties = {
    backgroundImage: pointimage ? `url('${pointimage}')` : 'none',
    backgroundColor: pointimage ? 'transparent' : color,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
      className="w-[48px] h-[58px] flex flex-col items-center cursor-pointer"
      style={{ transform: 'translateY(15px)' }}
    >
      <div className="bg-white/30 backdrop-blur-[3px] rounded-full p-[4px] max-sm:p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div
          style={circleStyle}
          className="w-[35px] h-[35px] rounded-full bg-cover bg-center backdrop-blur-[10px] z-20"  // Removed /50; add bg-opacity-50 if needed
        />
      </div>
      <div className="w-[20px] h-[20px] bg-white/30 backdrop-blur-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] transform rotate-45 -mt-[15.5px] rounded-[4px] z-[-1]" />
    </div>
  );
};

export default CustomMapMarker;