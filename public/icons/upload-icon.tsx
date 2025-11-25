import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function UploadIcon({ color = "currentColor", size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 12H18M12 6V18" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}