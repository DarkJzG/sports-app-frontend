// src/components/3d/PanelLogos.jsx
import React, { useState } from "react";

export default function PanelLogos({
  handleLogoUpload,
  logos,
  selectedElement,
  setSelectedElement,
  moveSelectedElement,
  handleRemoveElement,
  currentElement,
  setCurrentElement,
}) {
  const [side, setSide] = useState("delantera");
  const [position, setPosition] = useState("centro");

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">

      {/* Posición */}
      <div>
        <label className="block font-medium">Posición</label>
        <select
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
            setCurrentElement((prev) => ({ ...prev, position: e.target.value }));
          }}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="centro">Pecho Centro</option>
          <option value="pecho_izquierdo">Pecho Izquierdo</option>
          <option value="pecho_derecho">Pecho Derecho</option>
          <option value="superior">Espalda Superior</option>
          <option value="inferior">Espalda Inferior</option>
          <option value="espalda_centro">Espalda Centro</option>
        </select>
      </div>

      {/* Escala */}
      <div>
        <label className="block font-medium">
          Escala: {currentElement.scale.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="1.5"
          step="0.05"
          value={currentElement.scale}
          onChange={(e) =>
            setCurrentElement((prev) => ({
              ...prev,
              scale: parseFloat(e.target.value),
            }))
          }
          className="w-full"
        />
      </div>

            {/* Subida de logo */}
      <div>
        <label className="block font-medium">Subir Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
      </div>

      {/* Logos subidos */}
      <div className="mt-4">
        <h4 className="font-bold">Logos agregados</h4>
        {logos.length === 0 && (
          <p className="text-sm text-gray-500">No hay logos aún.</p>
        )}
        <ul className="flex flex-col gap-2 mt-2">
          {logos.map((l) => (
            <li
              key={l.id}
              className={`flex justify-between items-center px-2 py-1 border rounded cursor-pointer ${
                selectedElement?.id === l.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedElement({ type: "logo", id: l.id })}
            >
              <img
                src={l.url}
                alt="logo-preview"
                className="w-10 h-10 object-contain"
              />
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
                    handleRemoveElement(l.id, "logo");
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
