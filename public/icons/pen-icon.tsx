import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function PenSparkleIcon({
  size = 24,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top-left 4-point star (slightly bigger) */}
      <path
        d="M5 2L6.1 4.7L8.8 5.8L6.1 6.9L5 9.6L3.9 6.9L1.2 5.8L3.9 4.7L5 2Z"
        fill={color}
      />

      {/* Bottom-right 4-point star (slightly bigger) */}
      <path
        d="M18 15L19.1 17.7L21.8 18.8L19.1 19.9L18 22.6L16.9 19.9L14.2 18.8L16.9 17.7L18 15Z"
        fill={color}
      />

      {/* Pen body */}
      <path
        d="M3 17.25V21H6.75L16.6 11.15L12.85 7.4L3 17.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Rounded pen cap */}
      <path
        d="M12.85 7.4L15.9 4.35C16.3 3.95 16.95 3.95 17.35 4.35L19.65 6.65C20.05 7.05 20.05 7.7 19.65 8.1L16.6 11.15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
