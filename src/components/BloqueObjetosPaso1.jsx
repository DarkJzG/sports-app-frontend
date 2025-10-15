import React from "react";

export default function BloqueObjetosPaso1({ numObjetos, setNumObjetos, motif1, setMotif1, motif2, setMotif2 }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold mb-4">1️⃣ Objetos o elementos principales</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[{ key: 1, label: "Un solo objeto" }, { key: 2, label: "Dos objetos" }].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setNumObjetos(opt.key)}
            className={`px-4 py-2 rounded-lg border ${
              numObjetos === opt.key ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div>
          <p className="font-semibold mb-2">Objeto 1</p>
          <input
            type="text"
            maxLength={10}
            value={motif1}
            onChange={(e) => setMotif1(e.target.value)}
            placeholder="Ej: rayos"
            className="border p-2 rounded-lg w-40 text-center"
          />
        </div>

        {numObjetos === 2 && (
          <div>
            <p className="font-semibold mb-2">Objeto 2</p>
            <input
              type="text"
              maxLength={10}
              value={motif2}
              onChange={(e) => setMotif2(e.target.value)}
              placeholder="Ej: burbujas"
              className="border p-2 rounded-lg w-40 text-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
