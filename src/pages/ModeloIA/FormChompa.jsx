// src/pages/ModeloIA/FormChompa.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormChompa() {
  const { user } = useAuth();
  const location = useLocation();
  const categoria_id = location.state?.categoria_id;
  const categoria_prd = location.state?.categoria_prd || "chompa";

  // Campos principales
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [diseno, setDiseno] = useState("");
  const [disenoOtro, setDisenoOtro] = useState("");
  const [cuelloCapucha, setCuelloCapucha] = useState("");
  const [manga, setManga] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");
  const [cierre, setCierre] = useState("");
  const [bolsillos, setBolsillos] = useState([]);
  const [estiloAvanzado, setEstiloAvanzado] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [acabado, setAcabado] = useState("");

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
    { es: "Retro", en: "retro style" },
  ];

  const colores = [
    { es: "Negro", en: "black", hex: "#000000" },
    { es: "Blanco", en: "white", hex: "#ffffff" },
    { es: "Rojo", en: "red", hex: "#ff0000" },
    { es: "Azul", en: "blue", hex: "#0000ff" },
    { es: "Gris", en: "gray", hex: "#808080" },
    { es: "Verde", en: "green", hex: "#008000" },
    { es: "Amarillo", en: "yellow", hex: "#ffff00" },
    { es: "Morado", en: "purple", hex: "#800080" },
  ];

  const disenos = [
    { es: "Liso", en: "plain" },
    { es: "Franjas laterales", en: "side stripes" },
    { es: "Bloques de color", en: "color block" },
    { es: "Geométrico", en: "geometric" },
    { es: "Abstracto", en: "abstract" },
    { es: "Otros", en: "other" },
  ];

  const cuellosCapucha = [
    { es: "Cuello redondo", en: "round neck" },
    { es: "Cuello en V", en: "V-neck" },
    { es: "Cuello polo", en: "polo collar" },
    { es: "Con capucha", en: "hooded" },
  ];

  const mangas = [
    { es: "Manga larga", en: "long sleeves" },
    { es: "Manga corta", en: "short sleeves" },
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

  const opcionesCierre = [
    { es: "Con cierre", en: "zipper closure" },
    { es: "Sin cierre", en: "no closure" },
  ];

  const opcionesBolsillos = [
    { es: "Laterales", en: "side pockets" },
    { es: "Canguro", en: "kangaroo pocket" },
    { es: "Sin bolsillos", en: "no pockets" },
  ];

  const estilosAvanzados = [
    { es: "Minimalista", en: "minimalist" },
    { es: "Futurista", en: "futuristic" },
    { es: "Camuflaje", en: "camouflage" },
    { es: "Brochazos", en: "brush strokes" },
  ];

  const detallesExtras = [
    { es: "Costuras visibles", en: "visible seams" },
    { es: "Franjas reflectivas", en: "reflective stripes" },
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
        cuelloCapucha,
        manga,
        tela,
        genero,
        cierre,
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
        <h1 className="text-3xl font-bold text-blue-900 text-center">Diseña tu chompa</h1>

        {/* Estilo */}
        <CampoOpciones titulo="¿Qué estilo prefieres?" opciones={estilos} state={estilo} setState={setEstilo} />

        {/* Colores */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Colores</h2>
          <p className="text-sm text-gray-600 mb-2">Color principal</p>
          <PaletaColores opciones={colores} seleccionado={color1} setSeleccionado={setColor1} />
          <p className="text-sm text-gray-600 mt-6 mb-2">Color secundario</p>
          <PaletaColores opciones={colores} seleccionado={color2} setSeleccionado={setColor2} />
        </div>

        {/* Diseño */}
        <CampoOpciones titulo="¿Qué diseño te gusta?" opciones={disenos} state={diseno} setState={setDiseno} />
        {diseno === "other" && (
          <input
            type="text"
            placeholder="Describe tu diseño"
            value={disenoOtro}
            onChange={(e) => setDisenoOtro(e.target.value)}
            className="mt-3 w-full border px-3 py-2 rounded-lg"
          />
        )}

        {/* Cuello/Capucha */}
        <CampoOpciones titulo="Tipo de cuello o capucha" opciones={cuellosCapucha} state={cuelloCapucha} setState={setCuelloCapucha} />

        {/* Manga */}
        <CampoOpciones titulo="Tipo de manga" opciones={mangas} state={manga} setState={setManga} />

        {/* Tela */}
        <CampoOpciones titulo="Tela" opciones={telas} state={tela} setState={setTela} />

        {/* Género */}
        <CampoOpciones titulo="Género" opciones={generos} state={genero} setState={setGenero} />

        {/* Cierre */}
        <CampoOpciones titulo="Cierre" opciones={opcionesCierre} state={cierre} setState={setCierre} />

        {/* Bolsillos */}
        <CampoMultiple titulo="Bolsillos" opciones={opcionesBolsillos} state={bolsillos} setState={setBolsillos} />

        {/* Estilo avanzado */}
        <CampoOpciones titulo="Estilo avanzado" opciones={estilosAvanzados} state={estiloAvanzado} setState={setEstiloAvanzado} />

        {/* Detalles */}
        <CampoMultiple titulo="Detalles" opciones={detallesExtras} state={detalles} setState={setDetalles} />

        {/* Acabado */}
        <CampoOpciones titulo="Acabado visual" opciones={acabados} state={acabado} setState={setAcabado} />

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
            <img
              src={imagen}
              alt="Chompa generada"
              className="mx-auto rounded-lg shadow-lg w-80"
            />
            {promptResult && (
              <p className="mt-4 text-gray-700 text-lg">
                <strong>Descripción:</strong> {promptResult}
              </p>
            )}
            {costo && (
              <p className="mt-2 text-lg font-bold text-blue-900">
                Costo estimado: ${costo}
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// 🔹 Componentes auxiliares para simplificar
function CampoOpciones({ titulo, opciones, state, setState }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <h2 className="font-bold text-lg mb-4">{titulo}</h2>
      <div className="flex flex-wrap gap-3">
        {opciones.map((o) => (
          <button
            key={o.en}
            onClick={() => setState(o.en)}
            className={`px-4 py-2 rounded-lg border ${
              state === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {o.es}
          </button>
        ))}
      </div>
    </div>
  );
}

function CampoMultiple({ titulo, opciones, state, setState }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <h2 className="font-bold text-lg mb-4">{titulo}</h2>
      <div className="flex flex-wrap gap-3">
        {opciones.map((o) => (
          <button
            key={o.en}
            onClick={() =>
              setState((prev) =>
                prev.includes(o.en) ? prev.filter((x) => x !== o.en) : [...prev, o.en]
              )
            }
            className={`px-4 py-2 rounded-lg border ${
              state.includes(o.en) ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {o.es}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaletaColores({ opciones, seleccionado, setSeleccionado }) {
  return (
    <div className="flex flex-wrap gap-3">
      {opciones.map((c) => (
        <div
          key={c.en}
          onClick={() => setSeleccionado(c.en)}
          className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
            seleccionado === c.en ? "border-blue-600" : "border-gray-300"
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );
}
