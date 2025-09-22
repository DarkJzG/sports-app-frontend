// src/components/3d/PanelAccordion.jsx
import React, { useState } from "react";

export default function PanelAcordeon({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow border">
      {/* Header */}
      <button
        className="w-full flex justify-between items-center px-4 py-3 font-bold text-blue-900 hover:bg-gray-100 rounded-t-xl"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className="text-lg">{open ? "▲" : "▼"}</span>
      </button>

      {/* Contenido con animación */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[flex] p-4" : "max-h-0 p-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
