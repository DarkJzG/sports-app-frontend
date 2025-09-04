import React, { useMemo, useState } from "react";
import { BACKEND_URL } from "../../config";

// GenerarImagenAPI.jsx
// Requisitos:
//  - Backend Flask corriendo con el endpoint POST /api/ia/generar
//  - Variable de entorno en el frontend: VITE_BACKEND_URL (ej: http://localhost:5000)
//  - Tailwind opcional para estilos (las clases están pensadas para Tailwind)
//
// Ruta sugerida en tu router:
// <Route path="/generar" element={<GenerarImagenAPI />} />

const NEG_ALWAYS =
  "person, people, human, model, mannequin, torso, body, head, face, skin, arms, hands, fingers, legs, full body, portrait, fashion shoot, text, watermark, logo, brand name, letters, words, blurry, lowres, extra objects";

const PRESETS = {
  none: {
    label: "Personalizado",
  },
  purple_vneck: {
    label: "Morado • Cuello V",
    prompt:
      "front view centered high-quality apparel packshot of a sports t-shirt only, white base with purple gradient panels and geometric diagonal strokes and paint splatter accents, purple v-neck collar trim, short sleeves with purple cuffs, realistic fabric texture, soft studio lighting, plain white seamless background, soft shadow, sharp focus, only the shirt",
  },
  green_round: {
    label: "Verde • Cuello redondo",
    prompt:
      "in center high quality mockup of a sports t-shirt only, white color, green abstract details, round green neck, short sleeves with green trim, small central logo, red and white flag on left sleeve, displayed alone, centered, plain white background, only the shirt",
  },
};

function buildPrompt({ tipo, color, cuello, mangas, tela, patron, packshotOnly }) {
  const base =
    `front view centered high-quality ${packshotOnly ? "apparel packshot" : "product photo"} of a ${tipo} only, ` +
    `${color}, ${cuello}, ${mangas}, ${tela}, ${patron}, realistic fabric texture, soft studio lighting, ` +
    `${packshotOnly ? "plain white seamless background, soft shadow" : "studio background"}, sharp focus, only the shirt`;
  return base;
}

export default function GenerarImagenAPI() {
  const [form, setForm] = useState({
    tipo: "sports t-shirt",
    color: "white base with purple geometric accents",
    cuello: "v-neck purple trim",
    mangas: "short sleeves with purple cuffs",
    tela: "polyester athletic fabric",
    patron: "diagonal strokes and splatter",
    packshotOnly: true,
    width: 768,
    height: 768,
    steps: 28,
    cfg: 7.5,
    preset: "purple_vneck",
    mode: "detail", // "fast" | "detail"
  });

  const [img64, setImg64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  const effectivePrompt = useMemo(() => {
    if (form.preset !== "none" && PRESETS[form.preset]?.prompt) return PRESETS[form.preset].prompt;
    return buildPrompt(form);
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const applyModeDefaults = (mode) => {
    if (mode === "fast") {
      setForm((s) => ({ ...s, mode, width: 640, height: 640, steps: 24 }));
    } else {
      setForm((s) => ({ ...s, mode, width: 768, height: 768, steps: 26 }));
    }
  };

  const generate = async () => {
    setLoading(true);
    setMsg("Generando prenda…");
    setImg64(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ia/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: effectivePrompt,
          negative_prompt: NEG_ALWAYS,
          width: Number(form.width),
          height: Number(form.height),
          steps: Number(form.steps),
          guidance_scale: Number(form.cfg),
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.detail || JSON.stringify(json.error) || "Fallo en generación");
      setImg64(`data:image/jpeg;base64,${json.image_base64}`);
      setMsg(`OK • proveedor: ${json?.meta?.provider || "desconocido"}`);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const download = () => {
    if (!img64) return;
    const a = document.createElement("a");
    a.href = img64;
    a.download = `prenda_${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Generador de Prendas (IA)</h1>
        <p className="text-sm opacity-80 mb-6">Construye un mockup de camiseta deportiva y genera la imagen con el backend.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Preset</span>
            <select name="preset" value={form.preset} onChange={onChange} className="bg-[#1b1b23] p-2 rounded">
              {Object.entries(PRESETS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>

          {/* Modo */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Modo</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => applyModeDefaults("fast")} className={`px-3 py-2 rounded-xl ${form.mode === "fast" ? "bg-purple-600" : "bg-[#1b1b23]"}`}>Rápido</button>
              <button type="button" onClick={() => applyModeDefaults("detail")} className={`px-3 py-2 rounded-xl ${form.mode === "detail" ? "bg-purple-600" : "bg-[#1b1b23]"}`}>Detalle</button>
            </div>
          </label>

          {/* Packshot only */}
          <label className="flex items-center gap-2 mt-6 md:mt-0">
            <input type="checkbox" name="packshotOnly" checked={form.packshotOnly} onChange={onChange} className="accent-purple-600 w-4 h-4" />
            <span className="text-sm">Solo prenda (packshot, fondo blanco)</span>
          </label>

          {/* Tipo */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Tipo</span>
            <select name="tipo" value={form.tipo} onChange={onChange} className="bg-[#1b1b23] p-2 rounded">
              <option>sports t-shirt</option>
              <option>sports jersey</option>
              <option>training top</option>
            </select>
          </label>

          {/* Color */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Color/estilo</span>
            <input name="color" value={form.color} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>

          {/* Cuello */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Cuello</span>
            <select name="cuello" value={form.cuello} onChange={onChange} className="bg-[#1b1b23] p-2 rounded">
              <option>v-neck purple trim</option>
              <option>crew neck purple trim</option>
              <option>crew neck</option>
              <option>v-neck</option>
            </select>
          </label>

          {/* Mangas */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Mangas</span>
            <select name="mangas" value={form.mangas} onChange={onChange} className="bg-[#1b1b23] p-2 rounded">
              <option>short sleeves with purple cuffs</option>
              <option>short sleeves</option>
              <option>long sleeves</option>
              <option>sleeveless</option>
            </select>
          </label>

          {/* Tela */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Tela</span>
            <input name="tela" value={form.tela} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>

          {/* Patrón */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Patrón/detalles</span>
            <input name="patron" value={form.patron} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>

          {/* Tamaño */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Ancho (px)</span>
            <input type="number" name="width" min={512} max={1024} step={64} value={form.width} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Alto (px)</span>
            <input type="number" name="height" min={512} max={1024} step={64} value={form.height} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>

          {/* Steps / CFG */}
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">Steps</span>
            <input type="number" name="steps" min={12} max={40} value={form.steps} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm opacity-80">CFG</span>
            <input type="number" name="cfg" step={0.5} min={4} max={12} value={form.cfg} onChange={onChange} className="bg-[#1b1b23] p-2 rounded" />
          </label>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button onClick={generate} disabled={loading} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
            {loading ? "Generando…" : "Generar imagen"}
          </button>
          <button onClick={() => setShowPrompt((s) => !s)} className="px-4 py-2 rounded-xl bg-[#1b1b23] hover:bg-[#242433]">
            {showPrompt ? "Ocultar prompt" : "Ver prompt"}
          </button>
          {img64 && (
            <button onClick={download} className="px-4 py-2 rounded-xl bg-[#1b1b23] hover:bg-[#242433]">Descargar</button>
          )}
        </div>

        {showPrompt && (
          <pre className="mt-3 whitespace-pre-wrap bg-[#0c0c12] p-3 rounded-xl text-xs opacity-90 border border-[#232333]">
{effectivePrompt}

NEGATIVE: {NEG_ALWAYS}
          </pre>
        )}

        <p className="mt-3 text-sm opacity-80">{msg}</p>

        <div className="mt-6 bg-[#121218] rounded-2xl p-4 min-h-[360px] flex items-center justify-center border border-[#232333]">
          {loading && <div className="animate-pulse">Renderizando…</div>}
          {!loading && img64 && (
            <img alt="resultado" src={img64} className="rounded-xl max-h-[720px]" />
          )}
          {!loading && !img64 && (
            <span className="opacity-60">Aquí verás tu imagen generada</span>
          )}
        </div>
      </div>
    </div>
  );
}
