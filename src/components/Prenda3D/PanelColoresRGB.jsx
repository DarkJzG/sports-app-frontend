import React from "react";

/**
 * PanelColoresRGB:
 * Permite cambiar los colores base de cada zona (R/G/B/A)
 * y ver si una zona tiene una textura AI aplicada.
 */
export default function PanelColoresRGB({ designZones, colors, setColors, textures, setTextures }) {
  // 🧩 Reestablecer todos los colores y eliminar texturas
  const resetColors = () => {
    const reset = {};
    Object.keys(designZones).forEach((z) => (reset[z] = "#ffffff"));
    setColors(reset);
    if (setTextures) setTextures({});
  };

  // 🧽 Quitar textura de una zona (vuelve al color plano)
  const clearTexture = (zone) => {
    if (setTextures)
      setTextures((prev) => {
        const copy = { ...prev };
        delete copy[zone];
        return copy;
      });
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-900">🎨 Colores Base</h3>
        <button
          onClick={resetColors}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          Reestablecer
        </button>
      </div>

      {/* Listado de zonas */}
      <div className="flex flex-col gap-3">
        {Object.entries(designZones).map(([id, zone]) => (
          <div
            key={id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex flex-col">
              <label className="font-medium text-sm">{zone.label}</label>
              {textures?.[id] ? (
                <span className="text-xs text-green-600">
                  🧵 Textura IA aplicada
                </span>
              ) : (
                <span className="text-xs text-gray-500">Color plano</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Selector de color */}
              <input
                type="color"
                value={colors[id] || "#ffffff"}
                className="w-10 h-8 border rounded cursor-pointer"
                onChange={(e) =>
                  setColors((prev) => ({ ...prev, [id]: e.target.value }))
                }
              />

              {/* Botón para quitar textura */}
              {textures?.[id] && (
                <button
                  onClick={() => clearTexture(id)}
                  className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
