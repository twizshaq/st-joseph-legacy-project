import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function ExploreIcon({ color = "currentColor", size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_explore)">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.3074 9.73851L15 9L14.2615 12.6926C14.1031 13.4843 13.4843 14.1031 12.6926 14.2615L9 15L9.73851 11.3074C9.89686 10.5157 10.5157 9.89686 11.3074 9.73851Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs><clipPath id="clip0_explore"><rect width="24" height="24" fill="white"/></clipPath></defs>
    </svg>
  );
}