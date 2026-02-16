import React from "react";

interface CodeIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const CodeIcon: React.FC<CodeIconProps> = ({
  width = 15,
  height = 15,
  color = "#334155",
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CodeIcon;