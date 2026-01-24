import React from "react";

function Crown({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.45)]"
    >
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8D66B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <g transform="translate(0,1)">
        <path
          d="M8 44 L20 20 L32 30 L44 20 L56 44 Z"
          fill="url(#lg)"
          stroke="#7C2D12"
          strokeWidth="2"
        />
        <rect
          x="18"
          y="40"
          width="28"
          height="8"
          rx="2"
          fill="url(#lg)"
          stroke="#7C2D12"
          strokeWidth="2"
        />
        <circle cx="22" cy="30" r="3" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="2" />
        <circle cx="32" cy="27" r="3.5" fill="#F472B6" stroke="#831843" strokeWidth="2" />
        <circle cx="42" cy="30" r="3" fill="#34D399" stroke="#065F46" strokeWidth="2" />
      </g>
    </svg>
  );
}

export default function Logo({ subtitle = "Pixel RPG" }) {
  return (
    <div className="select-none text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Crown size={56} />
        <h1 className="pixel-logo text-4xl md:text-6xl font-black tracking-wide">
          A Lenda do Reino
        </h1>
      </div>
      <div className="text-sm md:text-base text-gray-300 mt-2 tracking-wider">
        {subtitle}
      </div>
    </div>
  );
}
