import React from "react";

export default function HealthBar({ current, max, colorClass }) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, max)) * 100));
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-900 overflow-hidden relative">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
      <span className="absolute inset-0 w-full h-full flex items-center justify-center text-xs font-bold text-white text-shadow-sm">
        {`${current} / ${max}`}
      </span>
    </div>
  );
}
