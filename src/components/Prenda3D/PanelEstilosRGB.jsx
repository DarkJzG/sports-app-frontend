import React from "react";
import { Layers } from "lucide-react";

export default function PanelEstilosRGB({ designs, designId, onPick }) {
    return (
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-1">
            <Layers size={22} />
            Estilos
          </h3>
        </div>
        <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
          <p>
            Selecciona un estilo para la prenda.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(designs).map(([id, d]) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className={`border rounded-lg p-2 text-left hover:bg-blue-50
                ${designId === id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
            >
              <div className="font-semibold">{d.name}</div>
              <div className="text-xs text-gray-500">Máscara: {d.mask.split('/').pop()}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  