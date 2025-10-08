import React, { useEffect, useState } from "react";
import { PlusCircle, Type, Trash2, ArrowUp, ArrowDown } from "lucide-react";


export default function PanelTextoRGB({
  currentElement,
  setCurrentElement,
  handleAddText,
  selectedElement,
  moveSelectedElement,
  handleRemoveElement,
  texts,
  setSelectedElement,
  updateActiveElement,
  setActiveElement,
}) {

  const hasSelection =
    selectedElement?.type === "text" && Number.isInteger(selectedElement?.id);
  const selIndex = hasSelection ? selectedElement.id : -1;
  const sel = hasSelection ? texts[selIndex] : null;
  const [draftText, setDraftText] = useState(sel?.text ?? "");
    useEffect(() => setDraftText(sel?.text ?? ""), [selIndex]); // sync al cambiar selección
    useEffect(() => {
      if (!hasSelection) return;
      const id = setTimeout(() => updateActiveElement?.({ text: draftText }), 150);
      return () => clearTimeout(id);
    }, [draftText, hasSelection]);

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5">
      {/* ➕ Crear nuevo texto (solo botón) */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleAddText?.("")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold"
          title="Añadir texto"
        >
          <PlusCircle size={18} /> Añadir Texto
        </button>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Edita el contenido directamente en cada fila del listado.
      </p>

      {/* 📜 Lista de textos */}
      <div>
        <h4 className="font-bold text-blue-900 flex items-center gap-2">
          <Type size={18} /> Textos agregados
        </h4>

        {texts.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            No hay textos aún. Añade uno con el botón de arriba 👆
          </p>
        ) : (
          <ul className="flex flex-col gap-2 mt-2">
            {texts.map((t, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-3 px-3 py-2 border rounded-lg ${
                  selIndex === i ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedElement?.({ type: "text", id: i });
                  setActiveElement?.({ type: "text", index: i });
                }}
              >
                {/* ✏️ Edición inline del contenido */}
                <input
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "black", fontFamily: t.fontFamily || "Inter" }}
                  value={selIndex === i ? draftText : (t.text || "")}
                  onChange={(e) => {
                    
                    if (selIndex !== i) {
                      setSelectedElement?.({ type: "text", id: i });
                      setActiveElement?.({ type: "text", index: i });
                    }
                    setDraftText(e.target.value);
                  }}
                  placeholder="Texto"
                />

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveElement(i, "text");
                    }}
                    className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🎚️ Propiedades del seleccionado */}
      {hasSelection && sel && (
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Color del texto
            </label>
            <input
              type="color"
              value={sel.fill || "#ffffff"}              
              onChange={(e) => updateActiveElement?.({ fill: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Fuente
            </label>
            <select
              value={sel.fontFamily || "Inter"}           
              onChange={(e) => updateActiveElement?.({ fontFamily: e.target.value })}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter">Inter (moderna)</option>
              <option value="Rubik">Rubik</option>
              <option value="Rock3D">Rock3D</option>
              <option value="Anta">Anta</option>
              <option value="Tourney">Tourney</option>
              <option value="Fascinate">Fascinate</option>
              <option value="Limelight">Limelight</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Color del contorno
            </label>
            <input
              type="color"
              value={sel.outline || "#000000"}
              onChange={(e) => updateActiveElement?.({ outline: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Grosor del contorno
            </label>
            <input
              type="range"
              min="0" max="24" step="1"
              value={sel.outlineWidth ?? 0}
              onChange={(e) =>
                updateActiveElement?.({ outlineWidth: parseInt(e.target.value, 10) })
              }
              className="w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Escala: {(sel.scale ?? 0.3).toFixed(2)}
            </label>
            <input
              type="range"
              min="1" max="15" step="1"
              value={sel.scale ?? 2}
              onChange={(e) => updateActiveElement?.({ scale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-sm text-blue-900 mb-1">
              Rotación Z: {Math.round(((sel.rotation?.[2] ?? 0) * 180) / Math.PI)}°
            </label>
            <input
              type="range"
              min="-180" max="180" step="10"
              value={Math.round(((sel.rotation?.[2] ?? 0) * 180) / Math.PI)}
              onChange={(e) => {
                const deg = parseInt(e.target.value, 10);
                const z   = (deg * Math.PI) / 180;
                const x   = sel.rotation?.[0] ?? 0;
            const y   = sel.rotation?.[1] ?? 0;
            updateActiveElement?.({ rotation: [x, y, z] });
          }}
          className="w-full"
        />
      </div>
        </div>
      )}

      <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
        👉 Haz <strong>clic en la camiseta 3D</strong> para colocar o mover el elemento seleccionado.
      </div>
    </div>
  );
}

