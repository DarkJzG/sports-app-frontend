// src/components/Prenda3D/PanelTexturasRGB.jsx
import React, { useState } from "react";
import { API_URL } from "../../config";
import PantallaCarga from "../../components/PantallaCarga";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles } from "lucide-react";

const COLORES_BASE = [
  { es: "Negro", en: "black", hex: "#000000" },
  { es: "Blanco", en: "white", hex: "#ffffff" },
  { es: "Rojo", en: "red", hex: "#ff0000" },
  { es: "Azul", en: "blue", hex: "#0000ff" },
  { es: "Verde", en: "green", hex: "#008000" },
  { es: "Amarillo", en: "yellow", hex: "#ffff00" },
  { es: "Gris", en: "gray", hex: "#808080" },
  { es: "Naranja", en: "orange", hex: "#ffa500" },
  { es: "Celeste", en: "sky blue", hex: "#87ceeb" },
  { es: "Morado", en: "purple", hex: "#800080" },
];

const TIPOS_TEXTURA = [
  { key: "moteado", label: "Moteado", img: "/img/patrones/TextMoteado.png" },
  { key: "lineas", label: "Líneas o franjas", img: "/img/patrones/TextLineas.png" },
  { key: "circuitos", label: "Circuitos", img: "/img/patrones/TextCircuito.png" },
  { key: "olas", label: "Olas o flujo", img: "/img/patrones/TextFlujo.png" },
  { key: "flores", label: "Orgánico / Flores", img: "/img/patrones/TextOrganico.png" },
  { key: "personalizado", label: "Otro", img: "/img/patrones/TextCustom.png" },
];

export default function PanelTexturasRGB({ designZones, setTextures, setColors }) {
  const [selectedZone, setSelectedZone] = useState(Object.keys(designZones)[0]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [textureType, setTextureType] = useState("moteado");
  const [textureDirection, setTextureDirection] = useState("horizontal");
  const [customTexture, setCustomTexture] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState(""); // Para mostrar el prompt generado

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
    setTextureType("moteado");
    setTextureDirection("horizontal");
    setCustomTexture("");
    setPreviewUrl(null);
    setGeneratedPrompt("");
  };

  // ⚙️ Generar textura IA
  const handleGenerarTextura = async () => {
    if (selectedColors.length < 2) {
      toast.error("Selecciona al menos 2 colores");
      return;
    }

    // Convertir colores a inglés
    const coloresTexto = selectedColors.map(
      (hex) => COLORES_BASE.find((c) => c.hex === hex)?.en || hex
    );

    // ✅ Determinar si es personalizado
    const isCustom = textureType === "personalizado" && customTexture.trim() !== "";
    const tipoReal = isCustom ? "personalizado" : textureType;
    const customField = isCustom ? customTexture.trim() : undefined;

    // Construir payload
    const payload = {
      tipo: tipoReal, // ✅ 'personalizado', 'moteado', 'lineas', etc.
      colores: coloresTexto, // ✅ ['red', 'black', ...]
      direccion: textureDirection, // ✅ 'horizontal' o 'vertical'
      zona: selectedZone,
      userId: "anon"
    };

    // Solo agregar campo 'custom' si es personalizado
    if (customField) {
      payload.custom = customField;
    }

    console.log("📤 Payload enviado al backend:", payload);

    setLoading(true);
    setPreviewUrl(null);
    setGeneratedPrompt("");

    try {
      const res = await fetch(`${API_URL}/api/ia/generar_textura_hf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Respuesta del backend:", data);

      if (data.error) throw new Error(data.error);

      // 🟢 Aplicar textura y color promedio al modelo
      if (data.imageUrl && selectedZone) {
        setTextures((prev) => ({ ...prev, [selectedZone]: data.imageUrl }));
      }
      if (data.color_promedio && selectedZone) {
        setColors((prev) => ({ ...prev, [selectedZone]: data.color_promedio }));
      }

      setPreviewUrl(data.imageUrl);
      setGeneratedPrompt(data.prompt || ""); // Guardar el prompt generado
      toast.success("Textura generada con éxito");
    } catch (err) {
      console.error("❌ Error al generar textura:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-5">
      <PantallaCarga show={loading} message="Generando textura con IA... 10-30 segundos" />

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
          Primero <strong>selecciona una zona</strong> donde aplicar la textura.
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
            <option key={id} value={id}>
              {z.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
        <p>
          Segundo <strong>selecciona al menos 2 colores</strong> para la textura.
        </p>
      </div>

      {/* Colores base */}
      <div>
        <p className="text-sm mb-2 font-medium">Colores seleccionados: {selectedColors.length}/4</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {COLORES_BASE.map((c) => (
            <div
              key={c.hex}
              onClick={() => toggleColor(c.hex)}
              className={`w-10 h-10 rounded-full border-4 cursor-pointer transition ${
                selectedColors.includes(c.hex)
                  ? "border-blue-600 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.es}
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
              <p className="font-semibold bg-white py-1 text-sm text-center">{opt.label}</p>
            </div>
          ))}
        </div>

        {/* Dirección (solo para líneas) */}
        {textureType === "lineas" && (
          <div className="mt-4">
            <label className="font-medium text-sm block mb-2">Dirección de las líneas:</label>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setTextureDirection("horizontal")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  textureDirection === "horizontal"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Vertical
              </button>
              <button
                onClick={() => setTextureDirection("vertical")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  textureDirection === "vertical"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Horizontal
              </button>
            </div>
          </div>
        )}

        {/* Textura personalizada */}
        {textureType === "personalizado" && (
          <div className="mt-4">
            <label className="font-medium text-sm block mb-2">
              Describe tu textura personalizada:
            </label>
            <input
              type="text"
              maxLength={50}
              value={customTexture}
              onChange={(e) => setCustomTexture(e.target.value)}
              placeholder="Ej: Truenos y nubes, fuego, etc."
              className="w-full border border-gray-300 p-3 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Máximo 50 caracteres ({customTexture.length}/50)
            </p>
          </div>
        )}
      </div>

      {/* Botón generar */}
      <button
        onClick={handleGenerarTextura}
        disabled={loading || selectedColors.length < 2}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          loading || selectedColors.length < 2
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-900 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Generando textura..." : "Generar textura con IA"}
      </button>

      {/* Vista previa */}
      {previewUrl && (
        <div className="mt-4 text-center space-y-3">
          <h4 className="font-bold text-gray-800">Textura generada:</h4>
          <img
            src={previewUrl}
            alt="Textura generada"
            className="w-48 h-48 object-cover mx-auto rounded-lg border-4 border-blue-500 shadow-lg"
          />

          <a
            href={previewUrl}
            download={`textura_${selectedZone}.png`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Descargar textura
          </a>
        </div>
      )}
    </div>
  );
}
