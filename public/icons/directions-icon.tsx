import React from "react";

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
  strokeSize?: number;
}

const DirectionsIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = 24,
  className = "",
  strokeSize = 0,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeSize}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Removed the giant square path */}

      <path
        d="M12,2 C12.5523,2 13,2.44772 13,3 L13,4 L16.5858,4 C17.1162,4 17.6249,4.21071 18,4.58579 
           L19.7071,6.29289 C19.8946,6.48043 20,6.73478 20,7 C20,7.26522 19.8946,7.51957 
           19.7071,7.70711 L18,9.41421 C17.6249,9.78929 17.1162,10 16.5858,10 L13,10 
           L13,11 L14,11 C15.1046,11 16,11.8954 16,13 L16,15 C16,16.1046 15.1046,17 
           14,17 L13,17 L13,20 L15,20 C15.5523,20 16,20.4477 16,21 C16,21.5523 15.5523,22 
           15,22 L9,22 C8.44772,22 8,21.5523 8,21 C8,20.4477 8.44772,20 9,20 L11,20 
           L11,17 L7.41421,17 C6.88378,17 6.37507,16.7893 6,16.4142 L4.29289,14.7071 
           C4.10536,14.5196 4,14.2652 4,14 C4,13.7348 4.10536,13.4804 4.29289,13.2929 
           L6,11.5858 C6.37507,11.2107 6.88378,11 7.41421,11 L11,11 L11,10 L10,10 
           C8.89543,10 8,9.10457 8,8 L8,6 C8,4.89543 8.89543,4 10,4 L11,4 L11,3 
           C11,2.44772 11.4477,2 12,2 Z M14,13 L7.41421,13 L6.41421,14 L7.41421,15 
           L14,15 L14,13 Z M16.5858,6 L10,6 L10,8 L16.5858,8 L17.5858,7 L16.5858,6 Z"
        fill={color}
      />
    </svg>
  );
};

export default DirectionsIcon;
