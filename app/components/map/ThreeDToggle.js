// components/ThreeDToggle.js
import React from 'react';

// A simple SVG icon for "3D"
const Icon3D = () => (
    <p className='font-bold text-white text-[1.2rem]'>3D</p>
);

// A simple SVG icon for "2D"
const Icon2D = () => (
    <p className='font-bold text-white text-[1.2rem]'>2D</p>
);


const ThreeDToggle = ({ is3D, onToggle }) => {
    // Determine which icon and label to show based on the current state
    const Icon = is3D ? Icon2D : Icon3D;
    const label = is3D ? 'Switch to 2D View' : 'Switch to 3D View';

    return (
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
            <button
                onClick={onToggle}
                className="rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg w-[48px] h-[48px] flex items-center justify-center text-white z-[10]"
                aria-label={label}
            >
                <Icon />
            </button>
        </div>
    );
};

export default ThreeDToggle;