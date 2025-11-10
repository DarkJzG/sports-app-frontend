// src/pages/ModeloIA/FormChompa.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { API_URL_GEMINI } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===============================
   PALETA DE COLORES BASE
   =============================== */
const coloresBase = [
  { es: "Negro", en: "black", hex: "#000000" },
  { es: "Blanco", en: "white", hex: "#ffffff" },
  { es: "Rojo", en: "red", hex: "#ff0000" },
  { es: "Azul", en: "blue", hex: "#0000ff" },
  { es: "Verde", en: "green", hex: "#008000" },
  { es: "Amarillo", en: "yellow", hex: "#ffff00" },
  { es: "Amarillo Neón", en: "neon yellow", hex: "#ffff00" },
  { es: "Gris", en: "gray", hex: "#808080" },
  { es: "Naranja", en: "orange", hex: "#ffa500" },
  { es: "Celeste", en: "sky blue", hex: "#87ceeb" },
  { es: "Morado", en: "purple", hex: "#800080" },
];

/* ===============================
   COMPONENTE PRINCIPAL
   =============================== */
export default function FormChompa() {
  const { user } = useAuth();

  // Estados generales
  const [paso, setPaso] = useState(1);
  const [caminoSeleccionado, setCaminoSeleccionado] = useState(""); // 'solido', 'bloques', 'mixto'

  // ========== PASO 1: OPCIONES ESTRUCTURALES (COMÚN) ==========
  const [tipoChompa, setTipoChompa] = useState(""); // 'sudadera' o 'chaqueta'
  const [capucha, setCapucha] = useState(""); // 'si' o 'no'
  const [bolsillos, setBolsillos] = useState(""); // 'canguro', 'laterales', 'sin_bolsillos'

  // ========== CAMINO 1: SÓLIDO CON ACENTOS ==========
  const [colorBase, setColorBase] = useState("");
  const [colorAcentos, setColorAcentos] = useState("");

  // ========== CAMINO 2: BLOQUES DE COLOR ==========
  const [tipoBloque, setTipoBloque] = useState(""); // 'horizontal', 'chevron', 'paneles'
  const [coloresBloque, setColoresBloque] = useState(["", "", ""]); // Hasta 3 colores según el bloque

  // ========== CAMINO 3: MIXTO (SÓLIDO + SUBLIMADO) ==========
  const [areaDisenoIA, setAreaDisenoIA] = useState(""); // 'pecho_hombros' o 'cuerpo_inferior'
  const [colorBaseMixto, setColorBaseMixto] = useState("");
  
  // Subcaminos del diseño IA (reutilizamos lógica de FormCamiseta_V3)
  const [tipoDisenoIA, setTipoDisenoIA] = useState(""); // 'degradado', 'geometrico', 'artistico', 'textura', 'personalizado'
  
  // Para degradado
  const [numColoresGradiente, setNumColoresGradiente] = useState(2);
  const [coloresGradiente, setColoresGradiente] = useState(["", "", ""]);

  // Para geométrico
  const [figuraGeometrica, setFiguraGeometrica] = useState(""); // 'triangulos', 'cuadrados', 'hexagonos'
  const [numColoresGeometrico, setNumColoresGeometrico] = useState(3);
  const [coloresGeometrico, setColoresGeometrico] = useState(["", "", "", ""]);

  // Para artístico
  const [estiloArtistico, setEstiloArtistico] = useState(""); // 'pinceladas', 'salpicaduras', 'fluido', 'humo'
  const [numColoresArtistico, setNumColoresArtistico] = useState(2);
  const [coloresArtistico, setColoresArtistico] = useState(["", "", ""]);

  // Para textura personalizada
  const [tipoTextura, setTipoTextura] = useState(""); // 'moteado', 'lineas', 'circuitos', 'olas', 'flores', 'personalizado'
  const [texturaPersonalizada, setTexturaPersonalizada] = useState("");
  const [numColoresTextura, setNumColoresTextura] = useState(2);
  const [coloresTextura, setColoresTextura] = useState(["", "", ""]);

  // Para objetos personalizados
  const [numObjetos, setNumObjetos] = useState(1);
  const [motif1, setMotif1] = useState("");
  const [motif2, setMotif2] = useState("");
  const [coloresObjetos, setColoresObjetos] = useState(["", "", ""]);
  const [estiloObjetos, setEstiloObjetos] = useState(""); // 'animado', 'realista', 'futurista'
  const [distribucionObjetos, setDistribucionObjetos] = useState(""); // 'aleatorio', 'disperso', 'sin_repeticion'

  // ========== OPCIONES GENERALES ==========
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");
  const [modeloIA, setModeloIA] = useState("stable");

  // Estados de imagen y carga
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     VALIDACIÓN DE PASOS
     =============================== */
  const validarPasoActual = () => {
    // Paso 1: Opciones estructurales
    if (paso === 1 && ( !capucha || !bolsillos)) {
      toast.warning("Completa todas las opciones estructurales.");
      return false;
    }

    // Paso 2: Selección de camino
    if (paso === 2 && !caminoSeleccionado) {
      toast.warning("Selecciona un tipo de diseño.");
      return false;
    }

    // CAMINO 1: SÓLIDO
    if (caminoSeleccionado === "solido") {
      if (paso === 3 && !colorBase) {
        toast.warning("Selecciona el color base.");
        return false;
      }
      if (paso === 4 && !colorAcentos) {
        toast.warning("Selecciona el color de acentos.");
        return false;
      }
    }

    // CAMINO 2: BLOQUES
    if (caminoSeleccionado === "bloques") {
      if (paso === 3 && !tipoBloque) {
        toast.warning("Selecciona un tipo de bloque de color.");
        return false;
      }
      if (paso === 4) {
        const numBloques = tipoBloque === "horizontal" || tipoBloque === "chevron" ? 2 : 3;
        if (coloresBloque.slice(0, numBloques).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
      }
    }

    // CAMINO 3: MIXTO
    if (caminoSeleccionado === "mixto") {
      if (paso === 3 && !areaDisenoIA) {
        toast.warning("Selecciona el área para el diseño IA.");
        return false;
      }
      if (paso === 4 && !colorBaseMixto) {
        toast.warning("Selecciona el color base sólido.");
        return false;
      }
      if (paso === 5 && !tipoDisenoIA) {
        toast.warning("Selecciona el tipo de diseño IA.");
        return false;
      }

      // Validaciones específicas según tipo de diseño IA
      if (tipoDisenoIA === "degradado") {
        if (paso === 6 && coloresGradiente.slice(0, numColoresGradiente).some(c => !c)) {
          toast.warning("Selecciona todos los colores del degradado.");
          return false;
        }
      }

      if (tipoDisenoIA === "geometrico") {
        if (paso === 6 && !figuraGeometrica) {
          toast.warning("Selecciona una figura geométrica.");
          return false;
        }
        if (paso === 7 && coloresGeometrico.slice(0, numColoresGeometrico).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
      }

      if (tipoDisenoIA === "artistico") {
        if (paso === 6 && !estiloArtistico) {
          toast.warning("Selecciona un estilo artístico.");
          return false;
        }
        if (paso === 7 && coloresArtistico.slice(0, numColoresArtistico).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
      }

      if (tipoDisenoIA === "textura") {
        if (paso === 6 && !tipoTextura) {
          toast.warning("Selecciona un tipo de textura.");
          return false;
        }
        if (tipoTextura === "personalizado" && !texturaPersonalizada) {
          toast.warning("Describe la textura personalizada.");
          return false;
        }
        if (paso === 7 && coloresTextura.slice(0, numColoresTextura).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
      }

      if (tipoDisenoIA === "personalizado") {
        if (paso === 6 && (!motif1 || (numObjetos === 2 && !motif2))) {
          toast.warning("Completa los campos de objetos.");
          return false;
        }
        if (paso === 7 && coloresObjetos.slice(0, numObjetos + 1).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
        if (paso === 8 && (!estiloObjetos || !distribucionObjetos)) {
          toast.warning("Selecciona el estilo y distribución.");
          return false;
        }
      }
    }

    // Validación final: Opciones generales
    const pasoActual = pasosActuales[paso - 1];
    if (pasoActual === pasoOpcionesGenerales) {
      if (!tela || !genero) {
        toast.warning("Completa todas las opciones generales.");
        return false;
      }
    }

    return true;
  };

  /* ===============================
     RESET AL CAMBIAR DE CAMINO
     =============================== */
  useEffect(() => {
    if (!caminoSeleccionado) return;
    
    // Reset de todos los estados específicos
    setColorBase("");
    setColorAcentos("");
    setTipoBloque("");
    setColoresBloque(["", "", ""]);
    setAreaDisenoIA("");
    setColorBaseMixto("");
    setTipoDisenoIA("");
    setColoresGradiente(["", "", ""]);
    setFiguraGeometrica("");
    setColoresGeometrico(["", "", "", ""]);
    setEstiloArtistico("");
    setColoresArtistico(["", "", ""]);
    setTipoTextura("");
    setTexturaPersonalizada("");
    setColoresTextura(["", "", ""]);
    setMotif1("");
    setMotif2("");
    setColoresObjetos(["", "", ""]);
    setEstiloObjetos("");
    setDistribucionObjetos("");
    
    setPaso(3); // Ir al paso 3 después de seleccionar el camino
  }, [caminoSeleccionado]);

  /* ===============================
     GENERACIÓN DEL DISEÑO
     =============================== */
  const handleGenerar = async () => {
    setLoading(true);
    setImagen(null);

    let payload = {
      userId: user?.id,
      categoria_id: "chompa_ia_v1",
      tipoChompa: "chaqueta",
      capucha,
      bolsillos,
      caminoSeleccionado,
      tela,
      genero,
    };

    // Datos específicos según el camino
    if (caminoSeleccionado === "solido") {
      payload = {
        ...payload,
        colorBase,
        colorAcentos,
      };
    } else if (caminoSeleccionado === "bloques") {
      payload = {
        ...payload,
        tipoBloque,
        coloresBloque: tipoBloque === "horizontal" || tipoBloque === "chevron" 
          ? coloresBloque.slice(0, 2) 
          : coloresBloque.slice(0, 3),
      };
    } else if (caminoSeleccionado === "mixto") {
      payload = {
        ...payload,
        areaDisenoIA,
        colorBaseMixto,
        tipoDisenoIA,
      };

      // Agregar datos según el tipo de diseño IA
      if (tipoDisenoIA === "degradado") {
        payload.coloresGradiente = coloresGradiente.slice(0, numColoresGradiente);
        payload.tipoGradiente = "lineal";
      } else if (tipoDisenoIA === "geometrico") {
        payload.figuraGeometrica = figuraGeometrica;
        payload.coloresGeometrico = coloresGeometrico.slice(0, numColoresGeometrico);
      } else if (tipoDisenoIA === "artistico") {
        payload.estiloArtistico = estiloArtistico;
        payload.coloresArtistico = coloresArtistico.slice(0, numColoresArtistico);
      } else if (tipoDisenoIA === "textura") {
        payload.tipoTextura = tipoTextura;
        payload.texturaPersonalizada = texturaPersonalizada;
        payload.coloresTextura = coloresTextura.slice(0, numColoresTextura);
      } else if (tipoDisenoIA === "personalizado") {
        payload.motifs = numObjetos === 1 ? motif1 : `${motif1} ${motif2}`.trim();
        payload.coloresObjetos = coloresObjetos.slice(0, numObjetos + 1);
        payload.estiloObjetos = estiloObjetos;
        payload.distribucionObjetos = distribucionObjetos;
      }
    }

    // Limpiar valores vacíos
    Object.keys(payload).forEach(
      (k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]
    );

    const endpoint = modeloIA === "gemini"
      ? API_URL_GEMINI
      : `${API_URL}/api/ia/generar_chompa_v1`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.imageUrl) setImagen(data.imageUrl);
    } catch (e) {
      console.error("Error:", e);
      toast.error("Error al generar la chompa.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     BLOQUES DE INTERFAZ
     =============================== */

  // ========== PASO 1: OPCIONES ESTRUCTURALES ==========
  const paso1Estructural = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold mb-4">Características de la chompa</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Capucha */}
        <div>
          <h3 className="font-semibold mb-2">Capucha</h3>
          <div className="flex justify-center flex-wrap gap-3">
            {[
              { key: "Sí", label: "Con capucha", img: "/img/patrones/Capucha.png" },
              { key: "No", label: "Sin capucha", img: "/img/patrones/SinCapucha.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setCapucha(opt.key)}
                className={`cursor-pointer p-2 rounded-lg border-4 w-28 ${
                  capucha === opt.key ? "border-blue-900 bg-blue-50" : "border-gray-300 hover:border-blue-900"
                }`}
              >
                <img
                  src={opt.img}
                  alt={opt.key}
                  className="w-24 h-40 object-cover rounded-md mb-1"
                />
                <p className="text-center font-medium">{opt.key}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bolsillos */}
        <div>
          <h3 className="font-semibold mb-2">Bolsillos</h3>
          <div className="flex justify-center flex-wrap gap-3">
            {[
              { key: "Canguro", label: "Canguro", img: "/img/patrones/Canguro.png" },
              { key: "Laterales", label: "Laterales", img: "/img/patrones/Laterales.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setBolsillos(opt.key)}
                className={`cursor-pointer p-2 rounded-lg border-4 w-48 ${
                  bolsillos === opt.key ? "border-blue-900 bg-blue-50" : "border-gray-300 hover:border-blue-900"
                }`}
              >
                <p className="font-semibold">{opt.label}</p>
                <img 
                src={opt.img} 
                alt={opt.label} 
                className="w-48 h-20 object-cover rounded-md mb-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ========== PASO 2: SELECCIÓN DE CAMINO ==========
  const paso2SeleccionCamino = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo de diseño</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            key: "solido", 
            label: "Sólido con Acentos",
            img: "/img/patrones/SolidoAcento.png"
          },
          { 
            key: "bloques", 
            label: "Bloques de Color", 
            img: "/img/patrones/BloqueChompa.png"
          },
          { 
            key: "mixto", 
            label: "Diseño Mixto (IA)", 
            img: "/img/patrones/MixtoChompa.png"
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setCaminoSeleccionado(opt.key)}
            className={`cursor-pointer border-4 rounded-xl overflow-hidden transition p-4 ${
              caminoSeleccionado === opt.key
                ? "border-blue-600 ring-2 ring-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="font-bold text-lg mt-2">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== CAMINO 1: SÓLIDO CON ACENTOS ==========
  const pasoSolidoColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base</h2>
      <p className="text-sm text-gray-500 mb-6">Este será el color principal de la chompa</p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorBase(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorBase === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorBase && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorBase}</p>
      )}
    </div>
  );

  const pasoSolidoColorAcentos = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color de acentos</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se usará para cremalleras, cordones, logos y detalles
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorAcentos(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorAcentos === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorAcentos && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorAcentos}</p>
      )}
    </div>
  );

  // ========== CAMINO 2: BLOQUES DE COLOR ==========
  const pasoBloquesTipo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de bloque</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            key: "horizontal",
            label: "División Horizontal",
            desc: "Superior e Inferior",
            img: "/img/patrones/BloqueHChompa.png"
          },
          {
            key: "chevron",
            label: "Diseño Chevron 'V'",
            desc: "Pecho en V y resto",
            img: "/img/patrones/BloqueVChompa.png"
          },
          {
            key: "paneles",
            label: "Paneles Deportivos",
            desc: "Hombros, Cuerpo y Mangas",
            img: "/img/patrones/BloquePChompa.png"
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setTipoBloque(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 transition ${
              tipoBloque === opt.key
                ? "border-blue-600 ring-2 ring-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
             <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="font-bold text-lg mt-2">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasosBloquesColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona los colores de los bloques</h2>
      <p className="text-sm text-gray-500 mb-6">
        {tipoBloque === "horizontal" && "Color 1 = bloque superior · Color 2 = bloque inferior"}
        {tipoBloque === "chevron" && "Color 1 = pecho en V · Color 2 = resto de la chompa"}
        {tipoBloque === "paneles" && "Color 1 = hombros · Color 2 = cuerpo · Color 3 = mangas"}
      </p>
      
      {[...(tipoBloque === "paneles" ? Array(3) : Array(2))].map((_, i) => (
        <div key={i} className="mb-6">
          <p className="font-semibold mb-2">
            Color {i + 1}
            {tipoBloque === "horizontal" && (i === 0 ? " (Superior)" : " (Inferior)")}
            {tipoBloque === "chevron" && (i === 0 ? " (Pecho V)" : " (Resto)")}
            {tipoBloque === "paneles" && (i === 0 ? " (Hombros)" : i === 1 ? " (Cuerpo)" : " (Mangas)")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevosColores = [...coloresBloque];
                  nuevosColores[i] = c.es;
                  setColoresBloque(nuevosColores);
                }}
                className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
                  coloresBloque[i] === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.es}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ========== CAMINO 3: MIXTO (SÓLIDO + SUBLIMADO) ==========
  const pasoMixtoArea = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el área para el diseño IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "pecho_hombros",
            label: "Superior",
            desc: "El diseño IA se aplicará en pecho y hombros",
            img: "/img/patrones/GeometricoChompa.png"
          },
          {
            key: "cuerpo_inferior",
            label: "Inferior",
            desc: "El diseño IA se aplicará en el torso y mangas",
            img: "/img/patrones/CompletoChompa.png"

          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setAreaDisenoIA(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 transition ${
              areaDisenoIA === opt.key
                ? "border-blue-600 ring-2 ring-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoMixtoColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base sólido</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se aplicará en las partes que NO tendrán el diseño IA
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorBaseMixto(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorBaseMixto === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorBaseMixto && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorBaseMixto}</p>
      )}
    </div>
  );

  const pasoMixtoTipoDisenoIA = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de diseño IA</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {[
          { key: "degradado", label: "Degradado", img: "/img/patrones/DegradadoChompa.png"},
          { key: "geometrico", label: "Geométrico", img: "/img/patrones/GeometricoChompa.png" },
          { key: "artistico", label: "Artístico", img: "/img/patrones/ArtChompa.png" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setTipoDisenoIA(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 transition ${
              tipoDisenoIA === opt.key
                ? "border-blue-600 ring-2 ring-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-20 object-cover" />
            <p className="font-bold">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Sub-pasos para cada tipo de diseño IA (reutilizando lógica de FormCamiseta_V3)
  
  // DEGRADADO
  const pasoMixtoDegradadoColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Colores del degradado</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setNumColoresGradiente(n)}
            className={`px-4 py-2 rounded-lg border ${
              numColoresGradiente === n ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {n} Colores
          </button>
        ))}
      </div>
      {[...Array(numColoresGradiente)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold mb-2">Color {i + 1}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevos = [...coloresGradiente];
                  nuevos[i] = c.es;
                  setColoresGradiente(nuevos);
                }}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  coloresGradiente[i] === c.es ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // GEOMÉTRICO
  const pasoMixtoGeometricoFigura = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona la figura geométrica</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: "triangulos", label: "Triángulos", img: "/img/patrones/MixedTriangulo.png" },
          { key: "cuadrados", label: "Cuadrados", img: "/img/patrones/MixedCuadrados.png" },
          { key: "hexagonos", label: "Hexágonos", img: "/img/patrones/MixedHexagono.png" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setFiguraGeometrica(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              figuraGeometrica === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-20 object-cover" />
            <p className="font-bold">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoMixtoGeometricoColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Colores del patrón geométrico</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setNumColoresGeometrico(n)}
            className={`px-4 py-2 rounded-lg border ${
              numColoresGeometrico === n ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {n} Colores
          </button>
        ))}
      </div>
      {[...Array(numColoresGeometrico)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold mb-2">
            Color {i + 1} {i === 0 ? "(Base)" : i === 1 ? "(Figuras)" : "(Apoyo)"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevos = [...coloresGeometrico];
                  nuevos[i] = c.es;
                  setColoresGeometrico(nuevos);
                }}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  coloresGeometrico[i] === c.es ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ARTÍSTICO
  const pasoMixtoArtisticoEstilo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo artístico</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: "pinceladas", label: "Pinceladas", img: "/img/patrones/MixedPinceladas.png" },
          { key: "fluido", label: "Fluido", img: "/img/patrones/MixedFluido.png" },
          { key: "humo", label: "Humo", img: "/img/patrones/MixedHumo.png" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setEstiloArtistico(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              estiloArtistico === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-20 object-cover" />
            <p className="font-bold">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoMixtoArtisticoColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Colores del diseño artístico</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setNumColoresArtistico(n)}
            className={`px-4 py-2 rounded-lg border ${
              numColoresArtistico === n ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {n} Colores
          </button>
        ))}
      </div>
      {[...Array(numColoresArtistico)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold mb-2">Color {i + 1}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevos = [...coloresArtistico];
                  nuevos[i] = c.es;
                  setColoresArtistico(nuevos);
                }}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  coloresArtistico[i] === c.es ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // TEXTURA
  const pasoMixtoTexturaTipo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Tipo de textura</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: "moteado", label: "Moteado" },
          { key: "lineas", label: "Líneas" },
          { key: "circuitos", label: "Circuitos" },
          { key: "olas", label: "Olas/Flujo" },
          { key: "flores", label: "Flores" },
          { key: "personalizado", label: "Personalizado" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setTipoTextura(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              tipoTextura === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <p className="font-bold">{opt.label}</p>
          </div>
        ))}
      </div>
      {tipoTextura === "personalizado" && (
        <div className="mt-6">
          <input
            type="text"
            maxLength={20}
            value={texturaPersonalizada}
            onChange={(e) => setTexturaPersonalizada(e.target.value)}
            placeholder="Describe tu textura"
            className="w-full md:w-3/4 border p-2 rounded-lg"
          />
        </div>
      )}
    </div>
  );

  const pasoMixtoTexturaColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Colores de la textura</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setNumColoresTextura(n)}
            className={`px-4 py-2 rounded-lg border ${
              numColoresTextura === n ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {n} Colores
          </button>
        ))}
      </div>
      {[...Array(numColoresTextura)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold mb-2">
            Color {i + 1} {i === 0 ? "(Base)" : "(Textura)"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevos = [...coloresTextura];
                  nuevos[i] = c.es;
                  setColoresTextura(nuevos);
                }}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  coloresTextura[i] === c.es ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // PERSONALIZADO (OBJETOS)
  const pasoMixtoPersonalizadoObjetos = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold">Objetos o elementos principales</h2>
      <div className="flex justify-center gap-4 mb-6">
        {[1, 2].map((n) => (
          <button
            key={n}
            onClick={() => setNumObjetos(n)}
            className={`px-4 py-2 rounded-lg border ${
              numObjetos === n ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {n} {n === 1 ? "Objeto" : "Objetos"}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div>
          <p className="font-semibold mb-2">Objeto 1</p>
          <input
            type="text"
            maxLength={15}
            value={motif1}
            onChange={(e) => setMotif1(e.target.value)}
            placeholder="Ej: rayos"
            className="border p-2 rounded-lg w-40 text-center"
          />
        </div>
        {numObjetos === 2 && (
          <div>
            <p className="font-semibold mb-2">Objeto 2</p>
            <input
              type="text"
              maxLength={15}
              value={motif2}
              onChange={(e) => setMotif2(e.target.value)}
              placeholder="Ej: estrellas"
              className="border p-2 rounded-lg w-40 text-center"
            />
          </div>
        )}
      </div>
    </div>
  );

  const pasoMixtoPersonalizadoColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Colores del diseño</h2>
      <p className="text-sm text-gray-500 mb-6">
        {numObjetos === 1
          ? "Color 1 = base · Color 2 = objetos"
          : "Color 1 = base · Color 2 = primer objeto · Color 3 = segundo objeto"}
      </p>
      {[...Array(numObjetos + 1)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold mb-2">Color {i + 1}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {coloresBase.map((c) => (
              <div
                key={c.es}
                onClick={() => {
                  const nuevos = [...coloresObjetos];
                  nuevos[i] = c.es;
                  setColoresObjetos(nuevos);
                }}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  coloresObjetos[i] === c.es ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const pasoMixtoPersonalizadoEstilo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold">Estilo visual y distribución</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Estilo visual</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "animado", label: "Animado" },
              { key: "realista", label: "Realista" },
              { key: "futurista", label: "Futurista" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setEstiloObjetos(opt.key)}
                className={`cursor-pointer border-4 rounded-xl p-3 ${
                  estiloObjetos === opt.key ? "border-blue-600" : "border-gray-300"
                }`}
              >
                <p className="font-semibold">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Distribución</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "aleatorio", label: "Aleatoria" },
              { key: "disperso", label: "Dispersos" },
              { key: "sin_repeticion", label: "Sin repetición" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setDistribucionObjetos(opt.key)}
                className={`cursor-pointer border-4 rounded-xl p-3 ${
                  distribucionObjetos === opt.key ? "border-blue-600" : "border-gray-300"
                }`}
              >
                <p className="font-semibold">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ========== OPCIONES GENERALES (FINAL) ==========
  const pasoOpcionesGenerales = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold mb-4">Características Finales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tela */}
        <div>
          <h3 className="font-semibold mb-2">Tela</h3>
          <div className="flex flex-col gap-3">
            {[
              { key: "Algodón", label: "Algodón", img: "/img/patrones/Algodon.png" },
              { key: "Poliéster", label: "Poliéster", img: "/img/patrones/Poliester.png" },
              { key: "Fleece", label: "Impermeable", img: "/img/patrones/Impermeable.png" },
              { key: "Mezcla", label: "Alg/Pol", img: "/img/patrones/Mezcla.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setTela(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  tela === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-full h-10 object-cover" />
                <p className="font-semibold ">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Género */}
        <div>
          <h3 className="font-semibold mb-2">Género</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "Hombre", label: "Hombre", img: "/img/patrones/HombreChompa.png" },
              { key: "Mujer", label: "Mujer", img: "/img/patrones/MujerChompa.png" },
              { key: "Unisex", label: "Unisex", img: "/img/patrones/UnisexChompa.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setGenero(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  genero === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-40 h-20 object-cover" />
                <p className="font-semibold">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="font-semibold mr-2">Modelo IA:</label>
        <select
          value={modeloIA}
          onChange={(e) => setModeloIA(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="stable">Stable Diffusion</option>
          <option value="gemini">Gemini Imagen</option>
        </select>
      </div>

      <div className="pt-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!tela || !genero) {
              toast.warning("Completa todas las opciones generales.");
              return;
            }
            handleGenerar();
          }}
          disabled={loading}
          className={`font-bold px-8 py-3 rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800 text-white"
          }`}
        >
          {loading ? "Generando..." : "Generar Chompa"}
        </button>
      </div>
    </div>
  );

  /* ===============================
     CONTROL DE FLUJO DE PASOS
     =============================== */
  let pasosActuales = [paso1Estructural, paso2SeleccionCamino];

  if (caminoSeleccionado === "solido") {
    pasosActuales = [
      ...pasosActuales,
      pasoSolidoColorBase,
      pasoSolidoColorAcentos,
      pasoOpcionesGenerales,
    ];
  } else if (caminoSeleccionado === "bloques") {
    pasosActuales = [
      ...pasosActuales,
      pasoBloquesTipo,
      pasosBloquesColores,
      pasoOpcionesGenerales,
    ];
  } else if (caminoSeleccionado === "mixto") {
    pasosActuales = [
      ...pasosActuales,
      pasoMixtoArea,
      pasoMixtoColorBase,
      pasoMixtoTipoDisenoIA,
    ];

    if (tipoDisenoIA === "degradado") {
      pasosActuales.push(pasoMixtoDegradadoColores);
    } else if (tipoDisenoIA === "geometrico") {
      pasosActuales.push(pasoMixtoGeometricoFigura, pasoMixtoGeometricoColores);
    } else if (tipoDisenoIA === "artistico") {
      pasosActuales.push(pasoMixtoArtisticoEstilo, pasoMixtoArtisticoColores);
    } else if (tipoDisenoIA === "textura") {
      pasosActuales.push(pasoMixtoTexturaTipo, pasoMixtoTexturaColores);
    } else if (tipoDisenoIA === "personalizado") {
      pasosActuales.push(
        pasoMixtoPersonalizadoObjetos,
        pasoMixtoPersonalizadoColores,
        pasoMixtoPersonalizadoEstilo
      );
    }

    pasosActuales.push(pasoOpcionesGenerales);
  }

  /* ===============================
     RENDER PRINCIPAL
     =============================== */
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {imagen ? (
          <div className="text-center space-y-6">
            <p className="text-blue-600 font-bold mb-4 text-2xl">
              ¡Chompa generada con éxito!
            </p>
            <img
              src={imagen}
              alt="Chompa generada"
              className="mx-auto rounded-lg shadow-lg w-80"
            />
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => (window.location.href = "/listar-prendasIA")}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
              >
                Ir a mi colección
              </button>
              <button
                onClick={() => {
                  setImagen(null);
                  setPaso(1);
                  setCaminoSeleccionado("");
                  setTipoChompa("");
                  setCapucha("");
                  setBolsillos("");
                  setColorBase("");
                  setColorAcentos("");
                  setTipoBloque("");
                  setColoresBloque(["", "", ""]);
                  setAreaDisenoIA("");
                  setColorBaseMixto("");
                  setTipoDisenoIA("");
                  setColoresGradiente(["", "", ""]);
                  setFiguraGeometrica("");
                  setColoresGeometrico(["", "", "", ""]);
                  setEstiloArtistico("");
                  setColoresArtistico(["", "", ""]);
                  setTipoTextura("");
                  setTexturaPersonalizada("");
                  setColoresTextura(["", "", ""]);
                  setMotif1("");
                  setMotif2("");
                  setColoresObjetos(["", "", ""]);
                  setEstiloObjetos("");
                  setDistribucionObjetos("");
                  setTela("");
                  setGenero("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-3 rounded-lg shadow-md"
              >
                Volver a generar
              </button>
            </div>
          </div>
        ) : (
          <>
            {pasosActuales[paso - 1]}
            <div className="flex justify-between mt-6">
              {paso > 1 && (
                <button
                  onClick={() => setPaso(paso - 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-blue-900 px-6 py-2 rounded-lg"
                >
                  Atrás
                </button>
              )}
              {paso < pasosActuales.length && (
                <button
                  onClick={() => {
                    if (!validarPasoActual()) return;
                    setPaso(paso + 1);
                  }}
                  className="bg-blue-900 hover:bg-blue-300 text-white px-6 py-2 rounded-lg ml-auto"
                >
                  Siguiente
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
