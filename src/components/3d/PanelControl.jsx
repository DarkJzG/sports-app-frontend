// src/components/3d/PanelColores.jsx
import React from "react";

const BASES = {
  delantera: "/texturas/textura_delantera.png",
  trasera: "/texturas/textura_trasera.png",
};

export default function PanelColores({
  colors,
  setColors,
  handleTextureUpload,
  setTextures,
}) {
  const resetColors = () => {
    const reset = {};
    Object.keys(colors).forEach((part) => (reset[part] = "#ffffff"));
    setColors(reset);
  };

  // 🔁 Volver a las texturas base
  const resetTextures = () => {
    setTextures({
      delantera: BASES.delantera,
      trasera: BASES.trasera,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-[300px]">
      {/* 🎨 COLORES */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            🎨 Colores de camiseta
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

      {/* 🖼️ TEXTURAS */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            🖼️ Texturas completas
          </h3>
          <button
            onClick={resetTextures}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Volver a base
          </button>
        </div>

        {["delantera", "trasera"].map((side) => (
          <div key={side} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {/* Mini preview */}
              <img
                src={BASES[side]} // OJO: esto muestra la base, si quieres mostrar lo actual, pásale también `textures` a este panel y usa `textures[side]`
                alt={`${side}-preview`}
                className="w-10 h-10 object-cover rounded border"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
              <div className="flex flex-col flex-1">
                <label className="capitalize font-medium">{side}:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => handleTextureUpload(e, side)}
                />
              </div>
            </div>

            {/* Volver a textura base */}
            <button
              onClick={() =>
                setTextures((prev) => ({ ...prev, [side]: BASES[side] }))
              }
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              title="Quitar y volver a base"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
