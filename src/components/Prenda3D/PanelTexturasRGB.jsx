// src/components/Prenda3D/PanelTexturas.jsx
import React, { useState } from "react";
import { API_URL } from "../../config";
import PantallaCarga from "../../components/PantallaCarga";

/**
 * Este PanelTexturas está adaptado al sistema de máscaras RGB del CamisetaViewer.jsx.
 * Trabaja por zonas (neck, sleeves, torso, etc.), no por partes fijas (delantera, trasera).
 * Cada zona puede generar una textura o color base IA, que se aplica al mapa RGB.
 */

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
  "rayas diagonales",
  "cuadros",
  "degradado suave",
  "ondas",
  "camuflaje",
  "líneas finas",
  "textura tejida",
  "patrón geométrico",
  "mosaico artístico",
];

const ESTILOS = [
  "deportivo",
  "urbano",
  "futurista",
  "casual",
  "minimalista",
];

export default function PanelTexturasRGB({ designZones, colors, setColors, setTextures }) {

  const [selectedZone, setSelectedZone] = useState(Object.keys(designZones)[0]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [pattern, setPattern] = useState(PATRONES[0]);
  const [style, setStyle] = useState(ESTILOS[0]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);


  // 🔁 Reestablecer los colores IA generados
  const resetColors = () => {
    const reset = {};
    Object.keys(colors).forEach((z) => (reset[z] = "#ffffff"));
    setColors(reset);
    setPreviewUrl(null);
  };

  // 🎨 Seleccionar hasta 3 colores
  const toggleColor = (hex) => {
    setSelectedColors((prev) => {
      if (prev.includes(hex)) return prev.filter((c) => c !== hex);
      if (prev.length < 3) return [...prev, hex];
      return prev;
    });
  };

  // ⚙️ Generar textura IA para una zona
  const handleGenerarIA = async () => {
    if (selectedColors.length === 0) {
      alert("Selecciona al menos un color base.");
      return;
    }

    setLoading(true);
    setPreviewUrl(null);

    try {
      const coloresTexto = selectedColors.map(
        (hex) => COLORES.find((c) => c.hex === hex)?.nombre || hex
      );

      const prompt = `
      High-quality seamless textile pattern, flat fabric surface, 
      ${pattern} pattern in ${style} style, 
      colors: ${coloresTexto.join(", ")}, 
      diffuse lighting, no folds, no wrinkles, no shadows, 
      no 3D render, no reflections, no depth, 
      perfectly flat texture for PBR materials, white background, 
      sharp details, tileable pattern design, ultra-realistic fibers, 
      digital design view, not photographed fabric.
    `;
    

      const res = await fetch(`${API_URL}/api/ia/generar_textura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_textura: prompt,
          zona: selectedZone,
          userId: "anon",
        }),
      });

      const data = await res.json();

      // ✅ aplicar color promedio automáticamente a la zona
      if (data.color_promedio && selectedZone) {
        setColors((prev) => ({ ...prev, [selectedZone]: data.color_promedio }));
      }
      
      // ✅ aplicar la textura generada
      if (data.imageUrl && selectedZone) {
        setTextures((prev) => ({ ...prev, [selectedZone]: data.imageUrl }));
      }
      
      setPreviewUrl(data.imageUrl);

      // 🟢 Aplicar color IA promedio (como fallback visual)
      // Aquí simplificamos tomando el primer color seleccionado
      const nuevoColor = selectedColors[0];
      setColors((prev) => ({ ...prev, [selectedZone]: nuevoColor }));
    } catch (err) {
      console.error("❌ Error al generar textura:", err);
      alert(err.message || "Error al generar textura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
          <PantallaCarga 
            show={loading} 
            message="Generando textura con IA, por favor espera..." 
          />
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-900">🎨 Generar Texturas IA</h3>
        <button
          onClick={resetColors}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          Reestablecer
        </button>
      </div>

      {/* Selector de zona */}
      <div>
        <label className="font-medium text-sm">Zona a personalizar:</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {Object.entries(designZones).map(([id, z]) => (
            <option key={id} value={id}>
              {z.label}
            </option>
          ))}
        </select>
      </div>

      {/* Paleta de colores */}
      <div>
        <p className="text-sm mb-2">Selecciona hasta 3 colores base:</p>
        <div className="flex flex-wrap gap-2">
          {COLORES.map((c) => (
            <div
              key={c.hex}
              onClick={() => toggleColor(c.hex)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                selectedColors.includes(c.hex)
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.nombre}
            ></div>
          ))}
        </div>
      </div>

      {/* Patrón y estilo */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Patrón:</label>
        <select
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {PATRONES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label className="font-medium text-sm">Estilo:</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {ESTILOS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Botón de generación */}
      <button
        onClick={handleGenerarIA}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
        }`}
      >
        {loading ? 'Generando...' : 'Generar Textura'}
      </button>

      {/* Vista previa */}
      {previewUrl && (
        <div className="mt-4 text-center">
          <img
            src={previewUrl}
            alt="textura generada"
            className="w-40 h-40 object-cover mx-auto rounded border"
          />
          <a
            href={previewUrl}
            download={`textura_${selectedZone}.png`}
            className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Descargar
          </a>
        </div>
      )}
    </div>
  );
}
