import React from "react";

interface IconProps {
    color?: string;
    size?: number;
    className?: string;
}

export default function LinkIcon({
    color = "currentColor",
    size = 24,
    className = "",
}: IconProps) {
    // Runtime prop validation (optional but added since you asked for prop validation)
    if (typeof color !== "string") {
        console.error("LinkIcon: 'color' prop must be a string.");
    }
    if (typeof size !== "number") {
        console.error("LinkIcon: 'size' prop must be a number.");
    }
    if (typeof className !== "string") {
        console.error("LinkIcon: 'className' prop must be a string.");
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M15 3h6v6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M10 14 21 3"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
