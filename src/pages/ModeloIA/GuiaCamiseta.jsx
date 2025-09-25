// src/pages/ModeloIA/GuiaCamiseta.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { Palette, Shirt, Type, Brush, MoveRight, FileText } from "lucide-react";

export default function GuiaCamiseta() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  // Campos
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [patron, setPatron] = useState("");
  const [colorPatron, setColorPatron] = useState("");
  const [cuello, setCuello] = useState("");
  const [manga, setManga] = useState("");

  // Resultado
  const [images, setImages] = useState([]); // lote de base64
  const [promptResult, setPromptResult] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState(null);
  const [costo, setCosto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guardada, setGuardada] = useState(null); // {url, ficha_tecnica, costo}

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const PALETA = [
    { nombre: "Negro", hex: "#000000" },
    { nombre: "Blanco", hex: "#FFFFFF" },
    { nombre: "Rojo", hex: "#FF0000" },
    { nombre: "Azul", hex: "#0000FF" },
    { nombre: "Verde", hex: "#008000" },
    { nombre: "Amarillo", hex: "#FFFF00" },
    { nombre: "Gris", hex: "#808080" },
    { nombre: "Naranja", hex: "#FFA500" },
    { nombre: "Morado", hex: "#800080" },
    { nombre: "Celeste", hex: "#87CEEB" },
  ];

  // -----------------------------
  // Generar lote de imágenes
  // -----------------------------
  const handleGenerar = async () => {
    if (!user) {
      setError("Debes iniciar sesión para generar la prenda.");
      return;
    }
    setLoading(true);
    setError("");
    setImages([]);
    setGuardada(null);

    try {
      const res = await fetch(`${API_URL}/api/ia/camiseta/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user._id,
          atributos: { estilo, color1, patron, colorPatron, cuello, manga },
          batch_size: 4,
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      if (data.ok && data.images?.length) {
        setImages(data.images);
        setPromptResult(data.prompt);
        setFichaTecnica(data.ficha_tecnica);
        setCosto(data.costo);
      } else {
        setError("No se recibieron imágenes desde el servidor.");
      }
    } catch (err) {
      console.error("Error generando:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      next();
    }
  };

  // -----------------------------
  // Guardar una selección
  // -----------------------------
  const handleGuardar = async (imgBase64) => {
    try {
      const res = await fetch(`${API_URL}/api/ia/camiseta/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user._id,
          prompt: promptResult,
          atributos: { estilo, color1, patron, colorPatron, cuello, manga },
          image: imgBase64.replace(/^data:image\/png;base64,/, ""),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setGuardada({
          url: data.url,
          ficha_tecnica: data.ficha_tecnica,
          costo: data.costo,
        });
      } else {
        alert("❌ Error al guardar: " + (data.error || ""));
      }
    } catch (err) {
      console.error("Error guardando:", err);
    }
  };

  // -----------------------------
  // Descargar PDF ficha técnica
  // -----------------------------
  const handleDescargarPDF = async () => {
    if (!guardada) {
      alert("Primero guarda una camiseta");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/ia/camiseta/ficha_pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ficha: guardada.ficha_tecnica,
          imageUrl: guardada.url,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${data.pdf_base64}`;
        link.download = "ficha_camiseta.pdf";
        link.click();
      }
    } catch (err) {
      console.error("Error descargando PDF:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Diseña tu camiseta paso a paso
        </h1>

        {/* Paso 1 - estilo */}
        {step === 1 && (
          <div>
            <h2 className="font-bold mb-4 text-xl">1. Elige un estilo</h2>
            <div className="grid grid-cols-2 gap-4">
              {["Deportiva", "Casual", "Urbana", "Retro"].map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setEstilo(s);
                    next();
                  }}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:shadow-md ${
                    estilo === s ? "bg-blue-200 font-bold" : "bg-white"
                  }`}
                >
                  <Shirt className="text-blue-600" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2 - color */}
        {step === 2 && (
          <div>
            <h2 className="font-bold mb-4 text-xl">2. Escoge un color principal</h2>
            <div className="grid grid-cols-5 gap-4">
              {PALETA.map((c) => (
                <div
                  key={c.nombre}
                  onClick={() => {
                    setColor1(c.nombre.toLowerCase());
                    next();
                  }}
                  className={`flex flex-col items-center cursor-pointer border rounded-xl p-3 hover:shadow-md ${
                    color1 === c.nombre.toLowerCase() ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  ></div>
                  <span className="text-xs mt-2">{c.nombre}</span>
                </div>
              ))}
            </div>
            <button onClick={prev} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              Atrás
            </button>
          </div>
        )}

        {/* Paso 3 - patrón */}
        {step === 3 && (
          <div>
            <h2 className="font-bold mb-4 text-xl">3. Patrón</h2>
            <div className="grid grid-cols-2 gap-4">
              {["Sin patrón", "Rayas", "Cuadros", "Degradado", "Textura"].map((p) => (
                <div
                  key={p}
                  onClick={() => {
                    if (p === "Sin patrón") {
                      setPatron("");
                      next();
                    } else {
                      setPatron(p);
                    }
                  }}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:shadow-md ${
                    patron === p ? "bg-blue-200 font-bold" : "bg-white"
                  }`}
                >
                  <Brush className="text-blue-600" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            {patron && patron !== "Sin patrón" && (
              <div className="mt-6">
                <h3 className="mb-4 font-medium">Color del patrón</h3>
                <div className="grid grid-cols-5 gap-4">
                  {PALETA.map((c) => (
                    <div
                      key={c.nombre}
                      onClick={() => {
                        setColorPatron(c.nombre.toLowerCase());
                        next();
                      }}
                      className={`flex flex-col items-center cursor-pointer border rounded-xl p-3 hover:shadow-md ${
                        colorPatron === c.nombre.toLowerCase()
                          ? "ring-2 ring-green-600"
                          : ""
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border"
                        style={{ backgroundColor: c.hex }}
                      ></div>
                      <span className="text-xs mt-2">{c.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4">
              <button onClick={prev} className="px-4 py-2 bg-gray-200 rounded">
                Atrás
              </button>
              {(!patron || colorPatron) && (
                <button
                  onClick={next}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paso 4 - cuello */}
        {step === 4 && (
          <div>
            <h2 className="font-bold mb-4 text-xl">4. Tipo de cuello</h2>
            <div className="grid grid-cols-3 gap-4">
              {["Redondo", "En V", "Polo"].map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setCuello(c);
                    next();
                  }}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:shadow-md ${
                    cuello === c ? "bg-blue-200 font-bold" : "bg-white"
                  }`}
                >
                  <Type className="text-blue-600" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
            <button onClick={prev} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              Atrás
            </button>
          </div>
        )}

        {/* Paso 5 - mangas */}
        {step === 5 && (
          <div>
            <h2 className="font-bold mb-4 text-xl">5. Mangas</h2>
            <div className="grid grid-cols-2 gap-4">
              {["Cortas", "Largas"].map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setManga(m);
                    handleGenerar();
                  }}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:shadow-md ${
                    manga === m ? "bg-blue-200 font-bold" : "bg-white"
                  }`}
                >
                  <MoveRight className="text-blue-600" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
            <button onClick={prev} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              Atrás
            </button>
          </div>
        )}

        {/* Paso 6 - selección de imagen */}
        {step === 6 && (
          <div className="text-center">
            {loading && (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-700 font-medium">
                  Generando tus camisetas...
                </p>
              </div>
            )}

            {!loading && images.length > 0 && !guardada && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Elige tu camiseta favorita
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer border rounded-lg shadow hover:shadow-lg"
                      onClick={() => handleGuardar(img)}
                    >
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`Opción ${idx + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guardada && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-green-700">
                  ✅ Camiseta guardada
                </h2>
                <img
                  src={guardada.url}
                  alt="Camiseta seleccionada"
                  className="mx-auto mt-4 rounded-lg shadow-lg w-64"
                />
                <p className="mt-2 text-gray-700 font-medium">
                  Costo estimado: ${guardada.costo}
                </p>
                <button
                  onClick={handleDescargarPDF}
                  className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                >
                  <FileText size={18} /> Descargar ficha técnica (PDF)
                </button>
              </div>
            )}

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
