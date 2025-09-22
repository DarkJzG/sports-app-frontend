// src/components/3d/PanelColores.jsx
import React from "react";


export default function PanelColores({
  colors,
  setColors,
}) {
  const resetColors = () => {
    const reset = {};
    Object.keys(colors).forEach((part) => (reset[part] = "#ffffff"));
    setColors(reset);
  };


  return (
    <div className="flex flex-col gap-6 w-[300px]">
      {/* 🎨 COLORES */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            Parte a cambiar 
          </h3>
          <button
            onClick={resetColors}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Reestablecer
          </button>
        </div>

        {Object.keys(colors).map((part) => (
          <div key={part} className="flex items-center justify-between">
            <label className="capitalize font-medium">{part}:</label>
            <input
              type="color"
              value={colors[part]}
              className="w-10 h-8 border rounded cursor-pointer"
              onChange={(e) =>
                setColors((prev) => ({ ...prev, [part]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>

      </div>
  );
}