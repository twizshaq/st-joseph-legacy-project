// components/ThreeDToggle.js
import React from 'react';

// A simple SVG icon for "3D"
const Icon3D = () => (
    <p className='font-bold text-white text-[1.1rem]'>3D</p>
);

// A simple SVG icon for "2D"
const Icon2D = () => (
    <p className='font-bold text-white text-[1.1rem]'>2D</p>
);


const ThreeDToggle = ({ is3D, onToggle }) => {
    // Determine which icon and label to show based on the current state
    const Icon = is3D ? Icon2D : Icon3D;
    const label = is3D ? 'Switch to 2D View' : 'Switch to 3D View';

    return (
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <button
                onClick={onToggle}
                className="rounded-full cursor-pointer bg-black/40 active:bg-black/50 hover:bg-black/60 w-[45px] h-[45px] flex items-center justify-center text-white z-[10]"
                aria-label={label}
            >
                <Icon />
            </button>
        </div>
    );
};

export default ThreeDToggle;