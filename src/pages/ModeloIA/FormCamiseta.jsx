// src/pages/ModeloIA/FormCamiseta.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormCamiseta() {
  const { user } = useAuth();

  const location = useLocation();
  const categoria_id = location.state?.categoria_id;
  const categoria_prd = location.state?.categoria_prd || "camiseta";

  // Campos principales
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [diseno, setDiseno] = useState("");
  const [disenoOtro, setDisenoOtro] = useState("");
  const [cuello, setCuello] = useState("");
  const [manga, setManga] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");


  // Campos adicionales
  const [estiloAvanzado, setEstiloAvanzado] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [acabado, setAcabado] = useState("");
  const [detalles, setDetalles] = useState([]);

  // Resultado
  const [imagen, setImagen] = useState(null);
  const [promptResult, setPromptResult] = useState("");
  const [costo, setCosto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Opciones
  const estilos = [
    { es: "Deportiva", en: "sports style" },
    { es: "Casual", en: "casual style" },
    { es: "Urbana", en: "urban style" },
    { es: "Retro", en: "retro style" },
  ];

  const colores = [
    { es: "Negro", en: "black", hex: "#000000" },
    { es: "Blanco", en: "white", hex: "#ffffff" },
    { es: "Rojo", en: "red", hex: "#ff0000" },
    { es: "Azul", en: "blue", hex: "#0000ff" },
    { es: "Verde", en: "green", hex: "#008000" },
    { es: "Amarillo", en: "yellow", hex: "#ffff00" },
    { es: "Gris", en: "gray", hex: "#808080" },
    { es: "Naranja", en: "orange", hex: "#ffa500" },
    { es: "Morado", en: "purple", hex: "#800080" },
    { es: "Celeste", en: "sky blue", hex: "#87ceeb" },
  ];

  const disenos = [
    { es: "Rayas", en: "striped" },
    { es: "Líneas", en: "lined" },
    { es: "Geométrico", en: "geometric" },
    { es: "Abstracto", en: "abstract" },
    { es: "Manchas de pintura", en: "paint splatter" },
    { es: "Degradado", en: "gradient" },
    { es: "Otros", en: "other" },
  ];

  const cuellos = [
    { es: "Redondo", en: "round neck" },
    { es: "En V", en: "V-neck" },
    { es: "Polo", en: "polo collar" },
  ];

  const mangas = [
    { es: "Corta", en: "short sleeves" },
    { es: "Larga", en: "long sleeves" },
  ];

  const telas = [
    { es: "Algodón", en: "cotton" },
    { es: "Poliéster", en: "polyester" },
    { es: "Mezcla Algodón/Poliéster", en: "cotton/polyester blend" },
  ];

  const generos = [
    { es: "Hombre", en: "male" },
    { es: "Mujer", en: "female" },
    { es: "Unisex", en: "unisex" },
  ];



  const estilosAvanzados = [
    { es: "Brochazos", en: "brush strokes" },
    { es: "Salpicaduras", en: "splatter" },
    { es: "Minimalista", en: "minimalist" },
    { es: "Futurista", en: "futuristic" },
    { es: "Camuflaje", en: "camouflage" },
  ];

  const ubicaciones = [
    { es: "Completo", en: "full print" },
    { es: "Pecho/frontal", en: "chest only" },
    { es: "Superior o inferior", en: "upper or lower half" },
    { es: "Diagonal", en: "diagonal" },
    { es: "Laterales", en: "side stripes" },
  ];

  const detallesAcabados = [
    { es: "Ribetes en cuello y mangas", en: "ribbed details on collar and sleeves" },
    { es: "Bicolor en mangas/cuello", en: "bicolor sleeves and collar" },
    { es: "Costuras visibles", en: "visible seams" },
  ];

  const acabados = [
    { es: "Mate", en: "matte finish" },
    { es: "Brillante", en: "glossy finish" },
    { es: "Texturizado", en: "textured finish" },
  ];



  const handleGenerar = async () => {
    setLoading(true);
    setImagen(null);
    setPromptResult("");

    const payload = {
      categoria_id,
      categoria_prd,
      userId: user?.id,
      atributos: {
        estilo,
        color1,
        color2,
        diseno: diseno === "other" ? disenoOtro : diseno,
        cuello,
        manga,
        tela,
        genero,
        estiloAvanzado,
        ubicacion,
        detalles,
        acabado,
      },
    };

    try {
      const res = await fetch(`${API_URL}/api/ia/generar_prendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setImagen(data.imageUrl);
      setPromptResult(data.descripcion || "");
      setCosto(data.costo);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div>
      <Navbar />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-900 font-bold text-lg">Generando tu diseño...</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center">Diseña tu camiseta</h1>

        {/* 🔹 Estilo */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">¿Qué estilo prefieres?</h2>
          <div className="grid grid-cols-2 gap-4">
            {estilos.map((s) => (
              <button
                key={s.en}
                onClick={() => setEstilo(s.en)}
                className={`p-4 rounded-lg border ${
                  estilo === s.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {s.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Colores */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Escoge el color principal</h2>
          <div className="flex flex-wrap gap-3">
            {colores.map((c) => (
              <div
                key={c.en}
                onClick={() => setColor1(c.en)}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                  color1 === c.en ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          <h2 className="font-bold text-lg mt-6 mb-4">Escoge el color secundario</h2>
          <div className="flex flex-wrap gap-3">
            {colores.map((c) => (
              <div
                key={c.en}
                onClick={() => setColor2(c.en)}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                  color2 === c.en ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* 🔹 Diseño */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">¿Qué diseño te gusta más?</h2>
          <div className="grid grid-cols-2 gap-4">
            {disenos.map((d) => (
              <button
                key={d.en}
                onClick={() => setDiseno(d.en)}
                className={`p-3 rounded-lg border ${
                  diseno === d.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {d.es}
              </button>
            ))}
          </div>
          {diseno === "other" && (
            <input
              type="text"
              placeholder="Describe tu diseño"
              value={disenoOtro}
              onChange={(e) => setDisenoOtro(e.target.value)}
              className="mt-3 w-full border px-3 py-2 rounded-lg"
            />
          )}
        </div>

        {/* 🔹 Estilo avanzado */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Estilo de diseño avanzado</h2>
          <div className="grid grid-cols-2 gap-4">
            {estilosAvanzados.map((ea) => (
              <button
                key={ea.en}
                onClick={() => setEstiloAvanzado(ea.en)}
                className={`p-3 rounded-lg border ${
                  estiloAvanzado === ea.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {ea.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Ubicación del diseño */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Ubicación del diseño</h2>
          <div className="grid grid-cols-2 gap-4">
            {ubicaciones.map((u) => (
              <button
                key={u.en}
                onClick={() => setUbicacion(u.en)}
                className={`p-3 rounded-lg border ${
                  ubicacion === u.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {u.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Detalles de acabados */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Detalles de acabados</h2>
          <div className="flex flex-wrap gap-3">
            {detallesAcabados.map((d) => (
              <button
                key={d.en}
                onClick={() =>
                  setDetalles((prev) =>
                    prev.includes(d.en)
                      ? prev.filter((x) => x !== d.en)
                      : [...prev, d.en]
                  )
                }
                className={`px-4 py-2 rounded-lg border ${
                  detalles.includes(d.en) ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {d.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Acabado visual */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Acabado visual</h2>
          <div className="flex gap-3 flex-wrap">
            {acabados.map((a) => (
              <button
                key={a.en}
                onClick={() => setAcabado(a.en)}
                className={`px-4 py-2 rounded-lg border ${
                  acabado === a.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {a.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Otros campos (cuello, manga, tela, género) */}
        {[{ label: "Tipo de cuello", options: cuellos, state: cuello, setState: setCuello },
          { label: "Mangas", options: mangas, state: manga, setState: setManga },
          { label: "Tela", options: telas, state: tela, setState: setTela },
          { label: "Género", options: generos, state: genero, setState: setGenero }].map((field) => (
          <div key={field.label} className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="font-bold text-lg mb-4">{field.label}</h2>
            <div className="flex gap-3 flex-wrap">
              {field.options.map((o) => (
                <button
                  key={o.en}
                  onClick={() => field.setState(o.en)}
                  className={`px-4 py-2 rounded-lg border ${
                    field.state === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {o.es}
                </button>
              ))}
            </div>
          </div>
        ))}


        {/* 🔹 Confirmación */}
        {!imagen && (
          <div className="text-center">
            <button
              onClick={handleGenerar}
              disabled={loading}
              className="mt-6 bg-blue-900 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              {loading ? "Generando..." : "Generar Imagen"}
            </button>
          </div>
        )}

        {/* 🔹 Resultado */}
        {imagen && (
          <div className="text-center mt-10 space-y-6">
            <p className="text-green-700 font-bold text-lg">
              ✅ Prenda agregada a tu colección de prendas
            </p>

            <img
              src={imagen}
              alt="Camiseta generada"
              className="mx-auto rounded-lg shadow-lg w-80"
            />

            {promptResult && (
              <p className="mt-4 text-gray-700 text-lg">
                <strong>Descripción:</strong> {promptResult}
              </p>
            )}

            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => {
                  setImagen(null);
                  setPromptResult("");
                  setCosto(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Volver a Generar
              </button>

              <button
                onClick={() => (window.location.href = "/listar-prendasIA")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Ir a mi Colección
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
