// src/components/Prenda3D/PanelTexturasRGB.jsx
import React, { useState } from "react";
import { API_URL } from "../../config";
import PantallaCarga from "../../components/PantallaCarga";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles } from "lucide-react";

const COLORES_BASE = [
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

const TIPOS_TEXTURA = [
  { key: "moteado", label: "Moteado", img: "/img/patrones/TextMoteado.png" },
  { key: "lineas", label: "Líneas o franjas", img: "/img/patrones/TextLineas.png" },
  { key: "circuitos", label: "Circuitos", img: "/img/patrones/TextCircuito.png" },
  { key: "olas", label: "Olas o flujo", img: "/img/patrones/TextFlujo.png" },
  { key: "flores", label: "Orgánico / Flores", img: "/img/patrones/TextOrganico.png" },
  { key: "personalizado", label: "Otro (escribir idea)", img: "/img/patrones/TextCustom.png" },
];

export default function PanelTexturasRGB({ designZones, setTextures, setColors }) {
  const [selectedZone, setSelectedZone] = useState(Object.keys(designZones)[0]);
  const [numColores, setNumColores] = useState(2);
  const [selectedColors, setSelectedColors] = useState([]);
  const [textureType, setTextureType] = useState("moteado");
  const [customTexture, setCustomTexture] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎨 Cambiar selección de color (máx 4)
  const toggleColor = (hex) => {
    setSelectedColors((prev) => {
      if (prev.includes(hex)) return prev.filter((c) => c !== hex);
      if (prev.length < 4) return [...prev, hex];
      toast.info("Máximo 4 colores permitidos");
      return prev;
    });
  };

  // 🔄 Reset
  const resetPanel = () => {
    setSelectedColors([]);
    setNumColores(2);
    setTextureType("moteado");
    setCustomTexture("");
    setPreviewUrl(null);
  };

  // ⚙️ Generar textura IA
  const handleGenerarTextura = async () => {
    if (selectedColors.length < 2) {
      toast.error("Selecciona al menos 2 colores");
      return;
    }

    const coloresTexto = selectedColors.map(
      (hex) => COLORES_BASE.find((c) => c.hex === hex)?.nombre || hex
    );

    const tipo = textureType === "personalizado" && customTexture.trim() !== ""
      ? customTexture.trim()
      : textureType;

    const prompt = `
      High-quality seamless textile pattern, flat fabric surface,
      ${tipo} pattern style, colors: ${coloresTexto.join(", ")},
      ultra-detailed fibers, no folds, no wrinkles, tileable design,
      perfect for sportswear fabrics, white background, no 3D render, 
      diffuse lighting, studio view, sharp focus.
    `;

    setLoading(true);
    setPreviewUrl(null);

    try {
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

      if (data.error) throw new Error(data.error);

      // 🟢 Aplicar textura y color promedio al modelo
      if (data.imageUrl && selectedZone) {
        setTextures((prev) => ({ ...prev, [selectedZone]: data.imageUrl }));
      }
      if (data.color_promedio && selectedZone) {
        setColors((prev) => ({ ...prev, [selectedZone]: data.color_promedio }));
      }

      setPreviewUrl(data.imageUrl);
      toast.success("Textura generada con éxito");
    } catch (err) {
      console.error("Error al generar textura:", err);
      toast.error("Error al generar textura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-5">
      <PantallaCarga show={loading} message="Generando textura con IA..." />

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-1">
          <Sparkles size={22} />
          Texturas IA
        </h3>
        <button
          onClick={resetPanel}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
        >
          Reestablecer
        </button>
      </div>

      <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
        <p>
          Primero <strong>selecciona una zona</strong> para colocar o mover el logo.
        </p>
      </div>

      {/* Zona */}
      <div>
        <label className="font-medium text-sm">Zona de la prenda:</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {Object.entries(designZones).map(([id, z]) => (
            <option key={id} value={id}>{z.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
        <p>
          Segundo <strong>selecciona los colores</strong> para la textura.
        </p>
      </div>
      {/* Colores base */}
      <div>
        <p className="text-sm mb-2">Selecciona los colores:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {COLORES_BASE.map((c) => (
            <div
              key={c.hex}
              onClick={() => toggleColor(c.hex)}
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                selectedColors.includes(c.hex)
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.nombre}
            />
          ))}
        </div>
      </div>

      {/* Tipos de textura visual */}
      <div>
        <h4 className="font-semibold text-center mb-3">Tipo de textura</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TIPOS_TEXTURA.map((opt) => (
            <div
              key={opt.key}
              onClick={() => setTextureType(opt.key)}
              className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
                textureType === opt.key
                  ? "border-blue-600 scale-[1.02]"
                  : "border-gray-300 hover:scale-[1.01]"
              }`}
            >
              <img
                src={opt.img}
                alt={opt.label}
                className="w-full h-20 object-cover"
              />
              <p className="font-semibold bg-white py-1 text-sm">{opt.label}</p>
            </div>
          ))}
        </div>

        {/* Textura personalizada */}
        {textureType === "personalizado" && (
          <div className="mt-4">
            <input
              type="text"
              maxLength={15}
              value={customTexture}
              onChange={(e) => setCustomTexture(e.target.value)}
              placeholder="Describe tu textura (máx. 15 letras)"
              className="w-full border p-2 rounded-lg text-center"
            />
          </div>
        )}
      </div>

      {/* Botón generar */}
      <button
        onClick={handleGenerarTextura}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        }`}
      >
        {loading ? "Generando..." : "Generar textura IA"}
      </button>

      {/* Vista previa */}
      {previewUrl && (
        <div className="mt-4 text-center">
          <img
            src={previewUrl}
            alt="Textura generada"
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
