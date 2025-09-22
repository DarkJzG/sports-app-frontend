// src/components/3d/PanelElementos.jsx
import React from "react";

export default function PanelElementos({
  currentElement,
  setCurrentElement,
  handleAddText,
  handleLogoUpload,
  selectedElement,
  moveSelectedElement,
  handleRemoveElement,
  texts,
  logos,
  setSelectedElement,
}) {
  return (
    <div className="flex flex-col gap-6 w-[300px]">
      {/* ================== ➕ ELEMENTOS ================== */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          ➕ Elementos
        </h3>

        {/* Tipo */}
        <div>
          <label className="font-medium">Tipo: </label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={currentElement.type}
            onChange={(e) =>
              setCurrentElement((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="text">Texto</option>
            <option value="logo">Logo</option>
            <option value="numero">Número</option>
          </select>
        </div>

        {/* Lado (no aplica para número) */}
        {currentElement.type !== "numero" && (
          <div>
            <label className="font-medium">Lado: </label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={currentElement.side}
              onChange={(e) =>
                setCurrentElement((prev) => ({ ...prev, side: e.target.value }))
              }
            >
              <option value="delantera">Delantera</option>
              <option value="trasera">Trasera</option>
            </select>
          </div>
        )}

        {/* ================== TEXTO ================== */}
        {currentElement.type === "text" && (
          <>
            <div>
              <label className="font-medium">Ubicación: </label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={currentElement.position}
                onChange={(e) =>
                  setCurrentElement((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
              >
                {currentElement.side === "delantera" ? (
                  <>
                    <option value="pecho_izquierdo">Pecho izquierdo</option>
                    <option value="pecho_derecho">Pecho derecho</option>
                    <option value="centro">Centro</option>
                  </>
                ) : (
                  <>
                    <option value="superior">Superior</option>
                    <option value="centro">Centro</option>
                    <option value="inferior">Inferior</option>
                  </>
                )}
              </select>
            </div>

            <input
              type="text"
              placeholder="Escribe tu texto"
              value={currentElement.content}
              className="border rounded px-2 py-1 w-full"
              onChange={(e) =>
                setCurrentElement((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
            />

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentElement.color}
                onChange={(e) =>
                  setCurrentElement((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
              />
              <label className="font-medium">
                Tamaño: {currentElement.fontSize}
              </label>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={currentElement.fontSize}
              onChange={(e) =>
                setCurrentElement((prev) => ({
                  ...prev,
                  fontSize: parseFloat(e.target.value),
                }))
              }
            />

            <button
              onClick={handleAddText}
              className="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              Agregar Texto
            </button>
          </>
        )}

        {/* ================== LOGO ================== */}
        {currentElement.type === "logo" && (
          <>
            <div>
              <label className="font-medium">Ubicación: </label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={currentElement.position}
                onChange={(e) =>
                  setCurrentElement((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
              >
                {currentElement.side === "delantera" ? (
                  <>
                    <option value="pecho_izquierdo">Pecho izquierdo</option>
                    <option value="pecho_derecho">Pecho derecho</option>
                    <option value="centro">Centro</option>
                  </>
                ) : (
                  <>
                    <option value="superior">Superior</option>
                    <option value="centro">Centro</option>
                    <option value="inferior">Inferior</option>
                  </>
                )}
              </select>
            </div>

            <label className="font-medium">
              Escala: {currentElement.scale}
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={currentElement.scale}
              onChange={(e) =>
                setCurrentElement((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="text-sm"
            />
          </>
        )}

        {/* ================== NÚMERO (solo trasera) ================== */}
        {currentElement.type === "numero" && (
          <>
            <h4 className="font-bold text-blue-900">🔢 Número en la espalda</h4>
            <input
              type="text"
              maxLength="2"
              placeholder="Ej: 10"
              value={currentElement.content}
              className="border rounded px-2 py-1 w-full"
              onChange={(e) =>
                setCurrentElement((prev) => ({
                  ...prev,
                  content: e.target.value,
                  side: "trasera",
                  position: "numero",
                }))
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentElement.color}
                onChange={(e) =>
                  setCurrentElement((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
              />
              <label className="font-medium">
                Tamaño: {currentElement.fontSize}
              </label>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={currentElement.fontSize}
              onChange={(e) =>
                setCurrentElement((prev) => ({
                  ...prev,
                  fontSize: parseFloat(e.target.value),
                  side: "trasera",
                  position: "numero",
                }))
              }
            />

            <button
              onClick={handleAddText}
              className="bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              Agregar Número
            </button>
          </>
        )}
      </div>

      {/* ================== 📋 LISTADO ================== */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          📋 Elementos agregados
        </h3>

        {[...texts, ...logos].map((el) => (
          <div
            key={el.id}
            className={`flex items-center gap-3 px-3 py-2 rounded border ${
              selectedElement?.id === el.id
                ? "bg-blue-50 border-blue-400"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Icono + contenido */}
            <div className="flex-1 flex items-center gap-3">
              {el.type === "logo" ? (
                <img
                  src={el.url}
                  alt="logo"
                  className="w-10 h-10 object-contain rounded border bg-white"
                />
              ) : (
                <span className="text-blue-900 font-bold">{el.content}</span>
              )}
              <div className="text-xs text-gray-500">
                {el.side} - {el.position}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedElement({ type: el.type, id: el.id })}
                className="text-blue-600 hover:text-blue-900"
                title="Editar"
              >
                ✏️
              </button>
              <button
                onClick={() => handleRemoveElement(el.id, el.type)}
                className="text-red-600 hover:text-red-800"
                title="Eliminar"
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        {texts.length === 0 && logos.length === 0 && (
          <p className="text-gray-500 text-sm">No hay elementos aún</p>
        )}
      </div>
    </div>
  );
}
