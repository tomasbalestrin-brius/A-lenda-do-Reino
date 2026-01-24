import React from "react";

export default function Frame({ children, className = "", title = null }) {
  return (
    <div
      className={`rounded-lg border-2 border-gray-700 shadow-inner ${className}`}
      style={{ background: "#1f2937" }}
    >
      {title ? (
        <div className="px-3 py-2 text-sm font-semibold text-gray-300 border-b border-gray-700">
          {title}
        </div>
      ) : null}
      <div className="p-3">{children}</div>
    </div>
  );
}
