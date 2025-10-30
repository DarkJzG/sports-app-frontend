// src/components/Prenda3D/NavPanelesRGB.jsx
import React from "react";

export default function NavPanelesRGB({ items, activeId, onChange }) {
  return (
    <nav className="flex flex-col gap-4 w-35 shrink-0 rounded-2xl bg-white border border-gray-200 p-2 space-y-1">
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200
              ${active ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-blue-100"}
            `}
          >
            {/* 🔹 texto arriba */}
            <span className="text-sm font-semibold">{item.label}</span>

            {/* 🔹 icono debajo */}
            <div className="mt-1">{item.icon}</div>
          </button>
        );
      })}
    </nav>
  );
}
