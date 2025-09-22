// src/components/3d/PanelTexto.jsx
import React from "react";

export default function PanelTexto({
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
      {/* Campo de texto */}
      <div>
        <label className="block font-medium">Texto</label>
        <input
          type="text"
          value={currentElement.content}
          onChange={(e) =>
            setCurrentElement((prev) => ({ ...prev, content: e.target.value }))
          }
          className="border rounded px-2 py-1 w-full"
          placeholder="Escribe aquí..."
        />
      </div>

      {/* Color */}
      <div>
        <label className="block font-medium">Color</label>
        <input
          type="color"
          value={currentElement.color}
          onChange={(e) =>
            setCurrentElement((prev) => ({ ...prev, color: e.target.value }))
          }
          className="w-12 h-8 cursor-pointer"
        />
      </div>

      {/* Fuente */}
      <div>
        <label className="block font-medium">Fuente</label>
        <select
          value={currentElement.font || "Arial"}
          onChange={(e) =>
            setCurrentElement((prev) => ({ ...prev, font: e.target.value }))
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="/fonts/Anta-Regular.ttf">Anta</option>
          <option value="/fonts/Fascinate-Regular.ttf">Fascinate (default)</option>
          <option value="/fonts/Limelight-Regular.ttf">Limelight</option>
          <option value="/fonts/Moira-Regular.ttf">Moira</option>
          <option value="/fonts/Rock3D-Regular.ttf">Rock3D</option>
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
          min="0.1"
          max="1"
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

      {/* Posición */}
      <div>
        <label className="block font-medium">Ubicación</label>
        <select
          value={currentElement.position}
          onChange={(e) =>
            setCurrentElement((prev) => ({ ...prev, position: e.target.value }))
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="centro">Centro</option>
          <option value="pecho_izquierdo">Pecho Izquierdo</option>
          <option value="pecho_derecho">Pecho Derecho</option>
          <option value="superior">Espalda Superior</option>
          <option value="inferior">Espalda Inferior</option>
        </select>
      </div>

      {/* Botón agregar */}
      <button
        onClick={handleAddText}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        ➕ Agregar Texto
      </button>

      {/* Listado de textos agregados */}
      <div className="mt-4">
        <h4 className="font-bold">Textos agregados</h4>
        {texts.length === 0 && (
          <p className="text-sm text-gray-500">No hay textos aún.</p>
        )}
        <ul className="flex flex-col gap-2 mt-2">
          {texts.map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-center px-2 py-1 border rounded cursor-pointer ${
                selectedElement?.id === t.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedElement({ type: "text", id: t.id })}
            >
              <span style={{ color: t.color }}>{t.content}</span>
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
                    handleRemoveElement(t.id, "text");
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
