// src/pages/ModeloIA/FormPantalon.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormPantalon() {
  const { user } = useAuth();
  const location = useLocation();
  const categoria_id = location.state?.categoria_id;
  const categoria_prd = location.state?.categoria_prd || "pantalón";

  // Campos principales
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [diseno, setDiseno] = useState("");
  const [disenoOtro, setDisenoOtro] = useState("");
  const [pretina, setPretina] = useState("");
  const [largo, setLargo] = useState("");
  const [ajuste, setAjuste] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");

  // Extras
  const [bolsillos, setBolsillos] = useState([]);
  const [estiloAvanzado, setEstiloAvanzado] = useState("");
  const [acabado, setAcabado] = useState("");
  const [detalles, setDetalles] = useState([]);

  // Resultados
  const [imagen, setImagen] = useState(null);
  const [promptResult, setPromptResult] = useState("");
  const [costo, setCosto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Opciones
  const estilos = [
    { es: "Deportivo", en: "sports style" },
    { es: "Casual", en: "casual style" },
    { es: "Urbano", en: "urban style" },
    { es: "Cargo", en: "cargo style" },
    { es: "Jogger", en: "jogger style" },
  ];

  const colores = [
    { es: "Negro", en: "black", hex: "#000000" },
    { es: "Blanco", en: "white", hex: "#ffffff" },
    { es: "Rojo", en: "red", hex: "#ff0000" },
    { es: "Azul", en: "blue", hex: "#0000ff" },
    { es: "Gris", en: "gray", hex: "#808080" },
    { es: "Verde", en: "green", hex: "#008000" },
    { es: "Amarillo", en: "yellow", hex: "#ffff00" },
    { es: "Camuflaje", en: "camouflage", hex: "#4b5320" },
  ];

  const disenos = [
    { es: "Franjas laterales", en: "side stripes" },
    { es: "Bloques de color", en: "color block" },
    { es: "Geométrico", en: "geometric" },
    { es: "Camuflaje", en: "camouflage" },
    { es: "Abstracto", en: "abstract" },
    { es: "Otros", en: "other" },
  ];

  const pretinas = [
    { es: "Elástica", en: "elastic waistband" },
    { es: "Con cordón", en: "drawstring waistband" },
    { es: "Ajustable", en: "adjustable waistband" },
    { es: "Estándar", en: "standard waistband" },
  ];

  const largos = [
    { es: "Corto", en: "shorts" },
    { es: "3/4", en: "three quarter length" },
    { es: "Largo", en: "full length" },
  ];

  const ajustes = [
    { es: "Slim Fit", en: "slim fit" },
    { es: "Regular", en: "regular fit" },
    { es: "Holgado", en: "loose fit" },
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

  const opcionesBolsillos = [
    { es: "Laterales", en: "side pockets" },
    { es: "Traseros", en: "back pockets" },
    { es: "Cargo", en: "cargo pockets" },
    { es: "Sin bolsillos", en: "no pockets" },
  ];

  const estilosAvanzados = [
    { es: "Minimalista", en: "minimalist" },
    { es: "Futurista", en: "futuristic" },
    { es: "Camuflaje", en: "camouflage" },
    { es: "Brochazos", en: "brush strokes" },
  ];

  const acabados = [
    { es: "Mate", en: "matte finish" },
    { es: "Brillante", en: "glossy finish" },
    { es: "Texturizado", en: "textured finish" },
  ];

  const detallesExtras = [
    { es: "Cremalleras", en: "zippers" },
    { es: "Costuras visibles", en: "visible seams" },
    { es: "Franjas reflectivas", en: "reflective stripes" },
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
        pretina,
        largo,
        ajuste,
        tela,
        genero,
        bolsillos,
        estiloAvanzado,
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

  // Render UI → igual que FormCamiseta, cambiando títulos
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
        <h1 className="text-3xl font-bold text-blue-900 text-center">Diseña tu pantalón</h1>

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
        {/* (igual que camiseta, con campo adicional disenoOtro) */}

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

        {/* 🔹 Pretina */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Tipo de pretina</h2>
          <div className="flex flex-wrap gap-3">
            {pretinas.map((p) => (
              <button
                key={p.en}
                onClick={() => setPretina(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  pretina === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Largo */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Largos</h2>
          <div className="flex flex-wrap gap-3">
            {largos.map((p) => (
              <button
                key={p.en}
                onClick={() => setLargo(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  largos === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Ajuste */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Ajuste</h2>
          <div className="flex flex-wrap gap-3">
            {ajustes.map((p) => (
              <button
                key={p.en}
                onClick={() => setAjuste(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  largos === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Tela */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Tela</h2>
          <div className="flex flex-wrap gap-3">
            {telas.map((p) => (
              <button
                key={p.en}
                onClick={() => setTela(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  telas === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Género */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Género</h2>
          <div className="flex flex-wrap gap-3">
            {generos.map((p) => (
              <button
                key={p.en}
                onClick={() => setGenero(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  generos === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>



        {/* 🔹 Bolsillos */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Bolsillo</h2>
          <div className="flex flex-wrap gap-3">
            {opcionesBolsillos.map((p) => (
              <button
                key={p.en}
                onClick={() => setBolsillos(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  opcionesBolsillos === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>
        {/* 🔹 Estilo avanzado */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Estilo Avanzado</h2>
          <div className="flex flex-wrap gap-3">
            {estilosAvanzados.map((p) => (
              <button
                key={p.en}
                onClick={() => setEstiloAvanzado(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  estilosAvanzados === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>
        {/* 🔹 Detalles */}

        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Detalles</h2>
          <div className="flex flex-wrap gap-3">
            {detallesExtras.map((p) => (
              <button
                key={p.en}
                onClick={() => setDetalles(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  detallesExtras === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>
        {/* 🔹 Acabado */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Acabado</h2>
          <div className="flex flex-wrap gap-3">
            {acabados.map((p) => (
              <button
                key={p.en}
                onClick={() => setAcabado(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  acabados === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Generar */}
        <div className="text-center">
          <button
            onClick={handleGenerar}
            disabled={loading}
            className="mt-6 bg-blue-900 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
          >
            {loading ? "Generando..." : "Generar Imagen"}
          </button>
        </div>

        {/* Resultado */}
        {imagen && (
          <div className="text-center mt-10 space-y-6">
            <p className="text-green-700 font-bold text-lg">
              ✅ Prenda agregada a tu colección de prendas
            </p>
            <img src={imagen} alt="Pantalón generado" className="mx-auto rounded-lg shadow-lg w-80" />
            {promptResult && (
              <p className="mt-4 text-gray-700 text-lg">
                <strong>Descripción:</strong> {promptResult}
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
