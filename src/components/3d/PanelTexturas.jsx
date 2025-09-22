// src/components/3d/PanelTexturas.jsx
import React, { useState } from "react";
import { API_URL } from "../../config";

const DEFAULTS = {
  repeatX: 1,
  repeatY: 1,
  rotationDeg: 0,
  offsetX: 0,
  offsetY: 0,
  antisotropy: 8,
  mirrored: false,
};

const BASES = {
  delantera: "/texturas/textura_delantera.png",
  trasera: "/texturas/textura_trasera.png",
  manga_izquierda: "/texturas/textura_manga_izq.png",
  manga_derecha: "/texturas/textura_manga_der.png",
};

const COLORES = [
  { nombre: "Negro", hex: "#000000" },
  { nombre: "Blanco", hex: "#FFFFFF" },
  { nombre: "Gris", hex: "#808080" },
  { nombre: "Verde", hex: "#008000" },
  { nombre: "Amarillo", hex: "#FFFF00" },
  { nombre: "Púrpura", hex: "#800080" },
  { nombre: "Rosado", hex: "#FFC0CB" },
  { nombre: "Azul", hex: "#0000FF" },
  { nombre: "Rojo", hex: "#FF0000" },
  { nombre: "Marrón", hex: "#8B4513" },
  { nombre: "Naranja", hex: "#FFA500" },
];

const PATRONES = [
  "manchas de pintura",
  "rayas",
  "cuadros",
  "círculos",
  "circuitos",
  "nubes",
  "flores",
  "triángulos",
];

const ESTILOS = ["urbano", "futbolístico", "casual"];

export default function PanelTexturas({
  textures,
  texOpts,
  setTextures,
  setTexOpts,
}) {
  const [side, setSide] = useState("delantera"); // parte activa
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 🟢 IA States
  const [coloresSel, setColoresSel] = useState([]);
  const [patron, setPatron] = useState(PATRONES[0]);
  const [estilo, setEstilo] = useState(ESTILOS[0]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const o = texOpts[side];

  const update = (field, value) => {
    setTexOpts((prev) => ({
      ...prev,
      [side]: { ...prev[side], [field]: value },
    }));
  };

  const resetSide = () => {
    setTexOpts((prev) => ({ ...prev, [side]: { ...DEFAULTS } }));
    setTextures((prev) => ({ ...prev, [side]: BASES[side] || null }));
  };

  const resetAll = () => {
    const defaults = {
      repeatX: 1,
      repeatY: 1,
      rotationDeg: 0,
      offsetX: 0,
      offsetY: 0,
      mirrored: false,
    };

    setTexOpts({
      delantera: { ...defaults },
      trasera: { ...defaults },
      manga_izquierda: { ...defaults },
      manga_derecha: { ...defaults },
    });

    setTextures({ ...BASES });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTextures((prev) => ({ ...prev, [side]: url }));
    }
  };

  // 🟢 Seleccionar colores (máx 3)
  const toggleColor = (hex) => {
    setColoresSel((prev) => {
      if (prev.includes(hex)) return prev.filter((c) => c !== hex);
      if (prev.length < 3) return [...prev, hex];
      return prev; // máximo 3
    });
  };

  const handleGenerarIA = async () => {
  if (coloresSel.length === 0) {
    alert("Selecciona al menos un color");
    return;
  }
  setLoading(true);
  setPreviewUrl(null);

  try {
    const coloresTexto = coloresSel.map(
      (hex) => COLORES.find((c) => c.hex === hex)?.nombre || hex
    );

    const prompt = `
      Seamless tileable ${estilo} fabric texture,
      patterned with ${patron},
      using colors: ${coloresTexto.join(", ")},
      high quality, detailed, realistic textile,
      smooth, clean surface,
      plain background,
      no logos, no text, no watermark
    `;

    const res = await fetch(`${API_URL}/api/ia/generar_textura`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt_textura: prompt,
        side,
        userId: "anon",
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Error generando textura");
    }

    setPreviewUrl(data.imageUrl);

    // Aplicar textura a la camiseta
    setTextures((prev) => ({ ...prev, [side]: data.imageUrl }));
  } catch (err) {
    console.error("❌ Error:", err);
    alert(err.message || "Error al generar textura");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-lg font-bold text-blue-900">Restablecer</h3>

        <div className="flex gap-2">
          <button
            onClick={resetSide}
            className="text-sm bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
          >
            Solo {side}
          </button>

          <button
            onClick={() => {
              if (
                window.confirm("¿Seguro que quieres restablecer TODAS las texturas?")
              ) {
                resetAll();
              }
            }}
            className="text-sm bg-red-200 hover:bg-red-300 px-2 py-1 rounded"
          >
            Reset todo
          </button>
        </div>
      </div>

      {/* Selector de parte */}
      <div className="flex items-center gap-3">
        <label className="font-medium">Parte:</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="delantera">Delantera</option>
          <option value="trasera">Trasera</option>
          <option value="manga_izquierda">Manga Izquierda</option>
          <option value="manga_derecha">Manga Derecha</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          {textures[side] && (
            <img
              src={textures[side]}
              alt={`${side}-preview`}
              className="w-10 h-10 object-cover rounded border"
            />
          )}
        </div>
      </div>

      {/* 🎨 Generar con IA */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <h4 className="font-semibold mb-2">🎨 Generar con IA</h4>

        <p className="text-sm mb-2">Selecciona hasta 3 colores:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {COLORES.map((c) => (
            <div
              key={c.hex}
              onClick={() => toggleColor(c.hex)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                coloresSel.includes(c.hex) ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.nombre}
            ></div>
          ))}
        </div>

        <label className="font-semibold">Patrón:</label>
        <select
          value={patron}
          onChange={(e) => setPatron(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-2"
        >
          {PATRONES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label className="font-semibold">Estilo:</label>
        <select
          value={estilo}
          onChange={(e) => setEstilo(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-2"
        >
          {ESTILOS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <button
          onClick={handleGenerarIA}
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold"
        >
          {loading ? "Generando..." : `Generar textura (${side})`}
        </button>




        {previewUrl && (
          <div className="mt-4 text-center">
            <img
              src={previewUrl}
              alt="textura generada"
              className="w-40 h-40 object-cover mx-auto rounded border"
            />
            <a
              href={previewUrl}
              download="textura.png"
              className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Descargar
            </a>
          </div>
        )}

      </div>

      {/* 📂 Upload manual */}
      <div>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      {/* 🔧 Opciones avanzadas */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-700 underline self-start"
      >
        {showAdvanced ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-4">
          {/* Repeat X */}
          <div>
            <label className="font-medium">Repetición X: {o.repeatX.toFixed(2)}</label>
            <input
              type="range"
              min="0.25"
              max="8"
              step="0.25"
              value={o.repeatX}
              onChange={(e) => update("repeatX", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Repeat Y */}
          <div>
            <label className="font-medium">Repetición Y: {o.repeatY.toFixed(2)}</label>
            <input
              type="range"
              min="0.25"
              max="8"
              step="0.25"
              value={o.repeatY}
              onChange={(e) => update("repeatY", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rotación */}
          <div>
            <label className="font-medium">Rotación: {o.rotationDeg}°</label>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={o.rotationDeg}
              onChange={(e) => update("rotationDeg", parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Offset X */}
          <div>
            <label className="font-medium">Offset X: {o.offsetX.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={o.offsetX}
              onChange={(e) => update("offsetX", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Offset Y */}
          <div>
            <label className="font-medium">Offset Y: {o.offsetY.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={o.offsetY}
              onChange={(e) => update("offsetY", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
