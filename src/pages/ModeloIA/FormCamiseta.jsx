// src/pages/ModeloIA/FormCamiseta.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormCamiseta() {
  const { user } = useAuth();

  // ----- Campos para prompt (visual) -----
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [cuello, setCuello] = useState("");
  const [manga, setManga] = useState("");

  // ----- Campos para ficha técnica -----
  const [tela, setTela] = useState("");
  const [talla, setTalla] = useState("");
  const [diseno, setDiseno] = useState("");
  const [genero, setGenero] = useState("");

  // Resultado / UI
  const [imagen, setImagen] = useState(null); // ahora guarda la URL de Cloudinary
  const [promptResult, setPromptResult] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState(null);
  const [costo, setCosto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Opciones
  const estilos = ["deportiva", "casual", "formal", "urbana"];
  const tallas = ["S", "M", "L", "XL", "XXL"];
  const cuellos = ["redondo", "en V", "polo"];
  const mangas = ["corta", "larga", "sin mangas"];
  const telas = ["algodón", "poliéster", "mezcla algodón/poliéster", "lana"];
  const disenos = ["estampado", "sublimado", "bordado", "sin diseño"];
  const generos = ["hombre", "mujer", "unisex"];

  const validar = () => {
    setError("");
    if (!color1) return "El color principal es obligatorio";
    if (!talla) return "Selecciona una talla";
    if (!tela) return "Indica la tela";
    return null;
  };

  const normalizeUserId = (user) => {
    if (!user) return null;
    return user.id || user._id || null;
  };

  const isValidObjectIdString = (id) => {
    return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
  };

  // --- Generar imagen ---
  const handleGenerar = async () => {
    const v = validar();
    if (v) {
      setError(v);
      return;
    }

    const userIdRaw = normalizeUserId(user);
    if (!userIdRaw) {
      setError("Debes iniciar sesión para generar y guardar la prenda.");
      return;
    }
    if (!isValidObjectIdString(userIdRaw)) {
      setError("userId inválido. Vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);
    setError("");
    setImagen(null);
    setPromptResult("");
    setFichaTecnica(null);
    setCosto(null);

    const payload = {
      tipo_prenda: "camiseta",
      userId: userIdRaw,
      atributos: {
        estilo: estilo || "deportiva",
        color1,
        color2: color2 || null,
        cuello: cuello || null,
        manga: manga || null,
        tela: tela || null,
        talla: talla || null,
        diseno: diseno || null,
        genero: genero || null,
      },
    };

    try {
      const res = await fetch(`${API_URL}/api/ia/generar_prendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let text;
        try { text = await res.text(); } catch (e) { text = `Status ${res.status}`; }
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();

      // Backend ahora devuelve imageUrl (Cloudinary)
      if (data.imageUrl) {
        setImagen(data.imageUrl);
        setPromptResult(data.prompt || "");
        setFichaTecnica(data.ficha_tecnica || {});
        setCosto(data.costo ?? null);
      } else {
        setError("No se recibió URL de la imagen desde el servidor");
      }

    } catch (err) {
      console.error("Error al generar prenda:", err);
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // --- Descargar PDF ---
  const handleDescargarPDF = async () => {
    if (!fichaTecnica || !imagen) {
      setError("Primero genera la prenda para exportar el PDF");
      return;
    }

    try {
      let imageBase64 = null;

      // Si imagen es URL (Cloudinary), convertir a base64
      if (imagen.startsWith("http")) {
        const resp = await fetch(imagen);
        const blob = await resp.blob();
        const arrayBuffer = await blob.arrayBuffer();
        imageBase64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
      } else {
        imageBase64 = imagen.replace("data:image/png;base64,", "");
      }

      const res = await fetch(`${API_URL}/api/ia/ficha_tecnica`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ficha: fichaTecnica,
          imagen: imageBase64
        }),
      });

      const data = await res.json();
      if (data.ok) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${data.pdf_base64}`;
        link.download = "ficha_tecnica.pdf";
        link.click();
      } else {
        setError("No se pudo generar el PDF");
      }

    } catch (err) {
      console.error("Error generando PDF:", err);
      setError("Error generando PDF: " + (err.message || err));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Generar Camiseta</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="flex flex-col gap-4">
            <label className="font-bold text-gray-700">Estilo:</label>
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona estilo</option>
              {estilos.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <label className="font-bold text-gray-700">Color principal:</label>
            <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} placeholder="Ej: rojo" className="w-full border rounded px-3 py-2 mt-1" />

            <label className="font-bold text-gray-700">Color secundario:</label>
            <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} placeholder="Ej: blanco" className="w-full border rounded px-3 py-2 mt-1" />

            <label className="font-bold text-gray-700">Cuello:</label>
            <select value={cuello} onChange={(e) => setCuello(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona un cuello</option>
              {cuellos.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="font-bold text-gray-700">Manga:</label>
            <select value={manga} onChange={(e) => setManga(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona tipo de manga</option>
              {mangas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <label className="font-bold text-gray-700">Tela:</label>
            <select value={tela} onChange={(e) => setTela(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona tela</option>
              {telas.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className="font-bold text-gray-700">Talla:</label>
            <select value={talla} onChange={(e) => setTalla(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona talla</option>
              {tallas.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className="font-bold text-gray-700">Diseño:</label>
            <select value={diseno} onChange={(e) => setDiseno(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona diseño</option>
              {disenos.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <label className="font-bold text-gray-700">Género:</label>
            <select value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Selecciona género</option>
              {generos.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            <button onClick={handleGenerar} disabled={loading} className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
              {loading ? "Generando..." : "Generar Imagen"}
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Resultado */}
          <div className="flex flex-col items-center justify-center gap-4">
            {imagen ? (
              <>
                <img src={imagen} alt="Camiseta generada" className="rounded-xl shadow-lg w-80 h-auto" />
                <p className="text-sm text-gray-600"><strong>Prompt usado:</strong> {promptResult}</p>
                {costo && <p className="text-lg font-bold text-blue-900">Costo estimado: ${costo}</p>}
                <button onClick={handleDescargarPDF} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                  Descargar ficha técnica (PDF)
                </button>
              </>
            ) : (
              <p className="text-gray-500">La imagen generada aparecerá aquí</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
