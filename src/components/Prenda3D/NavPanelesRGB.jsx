// src/components/Prenda3D/NavPanelesRGB.jsx
import React from "react";

export default function NavPanelesRGB({ items, activeId, onChange }) {
  return (
    <nav className="w-35 shrink-0 rounded-2xl bg-white border border-gray-200 p-2 space-y-1">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
            ${activeId === it.id
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100 text-gray-800"}`}
          title={it.label}
        >
          {it.icon ?? null}
          <span className="truncate">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
