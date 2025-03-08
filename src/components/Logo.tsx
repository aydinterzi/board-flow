import React from "react";

function Logo() {
  return (
    <div>
      <svg
        width="250"
        height="60"
        viewBox="0 0 250 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="boardflowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#4F46E5", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#6366F1", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="45"
          fontFamily="sans-serif"
          fontSize="40"
          fontWeight="700"
          fill="url(#boardflowGradient)"
        >
          BoardFlow
        </text>
      </svg>
    </div>
  );
}

export default Logo;
