// src/components/3d/PanelNumero.jsx
import React from "react";

export default function PanelNumero({
  currentElement,
  setCurrentElement,
  handleAddText,
  selectedElement,
  moveSelectedElement,
  handleRemoveElement,
  texts,
  setSelectedElement,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-blue-900">🔢 Número</h3>

      {/* Campo para escribir número */}
      <div>
        <label className="block font-medium">Número</label>
        <input
          type="text"
          value={currentElement.type === "numero" ? currentElement.content : ""}
          onChange={(e) =>
            setCurrentElement((prev) => ({
              ...prev,
              type: "numero",
              content: e.target.value.replace(/[^0-9]/g, ""), // solo dígitos
              side: "trasera", // siempre en la parte trasera
              position: "numero", // posición definida en POSICIONES
            }))
          }
          className="border rounded px-2 py-1 w-full"
          placeholder="Ej: 10"
        />
      </div>

      {/* Color del número */}
      <div>
        <label className="block font-medium">Color</label>
        <input
          type="color"
          value={currentElement.color}
          onChange={(e) =>
            setCurrentElement((prev) => ({ ...prev, color: e.target.value }))
          }
        />
      </div>

      <div>
        <label className="block font-medium">Fuente</label>
        <select
            value={currentElement.font}
            onChange={(e) => setCurrentElement((prev) => ({ ...prev, font: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
        >
          <option value="/fonts/Anta-Regular.ttf">Anta</option>
          <option value="/fonts/Fascinate-Regular.ttf">Fascinate</option>
          <option value="/fonts/Limelight-Regular.ttf">Limelight</option>
          <option value="/fonts/Moira-Regular.ttf">Moira</option>
          <option value="/fonts/Rock3D-Regular.ttf">Rock3D (default)</option>
          <option value="/fonts/Rubik-SemiBold.ttf">Rubik</option>
          <option value="/fonts/Tourney_Condensed-ExtraLight.ttf">Tourney</option>
          
        </select>
        </div>


      {/* Tamaño */}
      <div>
        <label className="block font-medium">
          Tamaño: {currentElement.fontSize.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.3"
          max="1.5"
          step="0.05"
          value={currentElement.fontSize}
          onChange={(e) =>
            setCurrentElement((prev) => ({
              ...prev,
              fontSize: parseFloat(e.target.value),
            }))
          }
          className="w-full"
        />
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAddText}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        ➕ Agregar número
      </button>

      {/* Lista de números agregados */}
      <div className="mt-4">
        <h4 className="font-bold">Números agregados</h4>
        {texts.filter((t) => t.type === "numero").length === 0 && (
          <p className="text-sm text-gray-500">No hay números aún.</p>
        )}

        <ul className="flex flex-col gap-2 mt-2">
          {texts
            .filter((t) => t.type === "numero")
            .map((n) => (
              <li
                key={n.id}
                className={`flex justify-between items-center px-2 py-1 border rounded cursor-pointer ${
                  selectedElement?.id === n.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedElement({ type: "text", id: n.id })}
              >
                <span className="font-mono text-lg">#{n.content}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSelectedElement("up");
                    }}
                    className="text-xs bg-gray-200 px-1 rounded"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSelectedElement("down");
                    }}
                    className="text-xs bg-gray-200 px-1 rounded"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveElement(n.id, "text");
                    }}
                    className="text-xs bg-red-400 text-white px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
