import React from "react";

interface SendIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const SendIcon: React.FC<SendIconProps> = ({
  size = 24,
  color = "#292929",
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M5.25201 9.97523L16.9111 4.42326C18.6115 3.61355 20.3864 5.38846 19.5767 7.08885L14.0248 18.748C13.2661 20.3413 10.966 20.2427 10.3464 18.5904L9.3192 15.8512C9.11639 15.3104 8.68964 14.8836 8.14879 14.6808L5.40963 13.6536C3.75729 13.034 3.65873 10.7339 5.25201 9.97523Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SendIcon;