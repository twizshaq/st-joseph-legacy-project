import React from 'react';

interface DevVerifiedBadgeProps extends React.SVGProps<SVGSVGElement> {
  /** Size of the icon (width and height). Defaults to 24. */
  size?: number | string;
  /** Color of the scalloped badge background. Defaults to #2081E2 (Standard Blue). */
  badgeColor?: string;
  /** Color of the inner dev symbol. Defaults to #FFFFFF (White). */
  iconColor?: string;
}

const DevVerifiedBadge: React.FC<DevVerifiedBadgeProps> = ({
  size = 22,
  badgeColor = "#007BFF", // Classic verification blue
  iconColor = "#FFFFFF",
  style,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: size, minHeight: size, ...style }} // Ensures aspect ratio in flex containers
      {...props}
    >
      {/* 1. The Classic Verification Badge Shape (Scalloped Circle) */}
      <path
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
        fill={badgeColor}
      />

      {/* 2. The Dev Icon (User Provided) 
          - Scaled down to 0.5 (50%)
          - Translated 6px to center it (24 - 12) / 2 = 6 
      */}
      <g transform="translate(6, 6) scale(0.5)">
        <path
          d="M1.293,11.293l4-4A1,1,0,1,1,6.707,8.707L3.414,12l3.293,3.293a1,1,0,1,1-1.414,1.414l-4-4A1,1,0,0,1,1.293,11.293Zm17.414-4a1,1,0,1,0-1.414,1.414L20.586,12l-3.293,3.293a1,1,0,1,0,1.414,1.414l4-4a1,1,0,0,0,0-1.414ZM13.039,4.726l-4,14a1,1,0,0,0,.686,1.236A1.053,1.053,0,0,0,10,20a1,1,0,0,0,.961-.726l4-14a1,1,0,1,0-1.922-.548Z"
          fill={iconColor}
        />
      </g>
    </svg>
  );
};

export default DevVerifiedBadge;