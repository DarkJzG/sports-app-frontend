// src/pages/ModeloIA/FormPantalon.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PantallaCarga from "../../components/PantallaCarga";

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
  { es: "Gris", en: "gray", hex: "#808080" },
  { es: "Naranja", en: "orange", hex: "#ffa500" },
  { es: "Celeste", en: "sky blue", hex: "#87ceeb" },
  { es: "Morado", en: "purple", hex: "#800080" },
  { es: "Azul Marino", en: "navy blue", hex: "#000080" },
];

/* ===============================
   COMPONENTE PRINCIPAL
   =============================== */
export default function FormPantalon() {
  const { user } = useAuth();

  // Estados generales
  const [paso, setPaso] = useState(1);
  const [caminoSeleccionado, setCaminoSeleccionado] = useState(""); // 'solido', 'paneles', 'sublimacion'

  // ========== PASO 1: OPCIONES ESTRUCTURALES (COMÚN) ==========
  const [tipoCorte, setTipoCorte] = useState(""); // 'jogger' o 'recto'
  const [tipoTobillo, setTipoTobillo] = useState(""); 

  useEffect(() => {
    if (tipoCorte === "jogger") {
      setTipoTobillo("elastico");
    } else if (tipoCorte === "recto") {
      setTipoTobillo("suelto");
    }
  }, [tipoCorte]);

  const [bolsillos, setBolsillos] = useState(""); // 'laterales_zip', 'laterales_sin_zip', 'sin_bolsillos'

  // ========== CAMINO 1: SÓLIDO CON ACENTOS ==========
  const [colorBase, setColorBase] = useState("");
  const [colorAcentos, setColorAcentos] = useState("");

  // ========== CAMINO 2: PANELES Y RAYAS ==========
  const [tipoPanelCorte, setTipoPanelCorte] = useState(""); // 'rayas_laterales' o 'panel_ancho_lateral'
  const [coloresBloque, setColoresBloque] = useState(["", ""]); // [Color Base, Color Panel/Raya]

  // ========== CAMINO 3: SUBLIMACIÓN (IA) ==========
  const [areaDisenoIA, setAreaDisenoIA] = useState(""); // 'completo' o 'paneles_laterales'
  const [colorBaseMixto, setColorBaseMixto] = useState("");
  
  // Tipo de diseño IA
  const [tipoDisenoIA, setTipoDisenoIA] = useState(""); // 'degradado', 'geometrico', 'artistico'
  
  // Para degradado
  const [numColoresGradiente, setNumColoresGradiente] = useState(2);
  const [coloresGradiente, setColoresGradiente] = useState(["", "", ""]);

  // Para geométrico
  const [figuraGeometrica, setFiguraGeometrica] = useState(""); // 'triangulos', 'cuadrados', 'lineas_diagonales'
  const [numColoresGeometrico, setNumColoresGeometrico] = useState(3);
  const [coloresGeometrico, setColoresGeometrico] = useState(["", "", "", ""]);

  // Para artístico
  const [estiloArtistico, setEstiloArtistico] = useState(""); // 'pinceladas', 'fluido', 'humo'
  const [numColoresArtistico, setNumColoresArtistico] = useState(2);
  const [coloresArtistico, setColoresArtistico] = useState(["", "", ""]);

  // ========== OPCIONES GENERALES ==========
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");

  // Estados de imagen y carga
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     VALIDACIÓN DE PASOS
     =============================== */
  const validarPasoActual = () => {
    // Paso 1: Opciones estructurales
    if (paso === 1 && (!tipoCorte || !bolsillos)) {
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

    // CAMINO 2: PANELES
    if (caminoSeleccionado === "paneles") {
      if (paso === 3 && !tipoPanelCorte) {
        toast.warning("Selecciona un tipo de panel.");
        return false;
      }
      if (paso === 4 && coloresBloque.some(c => !c)) {
        toast.warning("Selecciona todos los colores requeridos.");
        return false;
      }
    }

    // CAMINO 3: SUBLIMACIÓN
    if (caminoSeleccionado === "sublimacion") {
      if (paso === 3 && !areaDisenoIA) {
        toast.warning("Selecciona el área de sublimación.");
        return false;
      }
      
      // Paso 4 condicional: solo si areaDisenoIA es 'paneles_laterales'
      if (areaDisenoIA === "paneles_laterales" && paso === 4 && !colorBaseMixto) {
        toast.warning("Selecciona el color base sólido.");
        return false;
      }

      // Validar tipo de diseño IA
      const pasoTipoDisenoIA = areaDisenoIA === "completo" ? 4 : 5;
      if (paso === pasoTipoDisenoIA && !tipoDisenoIA) {
        toast.warning("Selecciona el tipo de diseño IA.");
        return false;
      }

      // Validaciones específicas según tipo de diseño IA
      if (tipoDisenoIA === "degradado") {
        const pasoColores = areaDisenoIA === "completo" ? 5 : 6;
        if (paso === pasoColores && coloresGradiente.slice(0, numColoresGradiente).some(c => !c)) {
          toast.warning("Selecciona todos los colores del degradado.");
          return false;
        }
      }

      if (tipoDisenoIA === "geometrico") {
        const pasoFigura = areaDisenoIA === "completo" ? 5 : 6;
        const pasoColores = areaDisenoIA === "completo" ? 6 : 7;
        
        if (paso === pasoFigura && !figuraGeometrica) {
          toast.warning("Selecciona una figura geométrica.");
          return false;
        }
        if (paso === pasoColores && coloresGeometrico.slice(0, numColoresGeometrico).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
          return false;
        }
      }

      if (tipoDisenoIA === "artistico") {
        const pasoEstilo = areaDisenoIA === "completo" ? 5 : 6;
        const pasoColores = areaDisenoIA === "completo" ? 6 : 7;
        
        if (paso === pasoEstilo && !estiloArtistico) {
          toast.warning("Selecciona un estilo artístico.");
          return false;
        }
        if (paso === pasoColores && coloresArtistico.slice(0, numColoresArtistico).some(c => !c)) {
          toast.warning("Selecciona todos los colores requeridos.");
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
    setTipoPanelCorte("");
    setColoresBloque(["", ""]);
    setAreaDisenoIA("");
    setColorBaseMixto("");
    setTipoDisenoIA("");
    setColoresGradiente(["", "", ""]);
    setFiguraGeometrica("");
    setColoresGeometrico(["", "", "", ""]);
    setEstiloArtistico("");
    setColoresArtistico(["", "", ""]);
    
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
      categoria_id: "Pantalon IA",
      tipoCorte,
      tipoTobillo,
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
    } else if (caminoSeleccionado === "paneles") {
      payload = {
        ...payload,
        tipoPanelCorte,
        coloresBloque,
      };
    } else if (caminoSeleccionado === "sublimacion") {
      payload = {
        ...payload,
        areaDisenoIA,
        tipoDisenoIA,
      };

      // Solo agregar colorBaseMixto si el área es paneles laterales
      if (areaDisenoIA === "paneles_laterales") {
        payload.colorBaseMixto = colorBaseMixto;
      }

      // Agregar datos según el tipo de diseño IA
      if (tipoDisenoIA === "degradado") {
        payload.coloresGradiente = coloresGradiente.slice(0, numColoresGradiente);
      } else if (tipoDisenoIA === "geometrico") {
        payload.figuraGeometrica = figuraGeometrica;
        payload.coloresGeometrico = coloresGeometrico.slice(0, numColoresGeometrico);
      } else if (tipoDisenoIA === "artistico") {
        payload.estiloArtistico = estiloArtistico;
        payload.coloresArtistico = coloresArtistico.slice(0, numColoresArtistico);
      }
    }

    // Limpiar valores vacíos
    Object.keys(payload).forEach(
      (k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]
    );

    try {
      console.log("📤 Enviando payload:", payload);
      
      // ✅ ENDPOINT UNIFICADO
      const res = await fetch(`${API_URL}/api/ia/generar_prenda_hf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok && data.imageUrl) {
        setImagen(data.imageUrl);
        toast.success("Pantalón generado exitosamente!");
      } else if (data.error) {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error al generar la chompa");
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
      <h2 className="text-xl font-bold mb-4">Opciones estructurales del pantalón</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de corte */}
        <div>
          <h3 className="font-semibold mb-2">Tipo de corte</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "jogger", label: "Jogger", img: "/img/patrones/Jogger.png" },
              { key: "recto", label: "Recto", img: "/img/patrones/Recto.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setTipoCorte(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  tipoCorte === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-24 h-40 object-cover" />
                <p className="font-semibold mt-2">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bolsillos */}
        <div>
          <h3 className="font-semibold mb-2">Bolsillos</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "laterales_zip", label: "Con cierre", img: "/img/patrones/Cierre.png" },
              { key: "laterales_sin_zip", label: "Sin cierre", img: "/img/patrones/SinCierre.png" },
          
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setBolsillos(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  bolsillos === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-45 h-20 object-cover" />
                <p className="font-semibold">{opt.label}</p>
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
            img: "/img/patrones/SolidoPant.png"
          },
          { 
            key: "paneles", 
            label: "Paneles y Rayas", 
            img: "/img/patrones/RayasPant.png"
          },
          { 
            key: "sublimacion", 
            label: "Diseño Sublimado", 
            img: "/img/patrones/CompletoPant.png"
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
      <p className="text-sm text-gray-500 mb-6">Este será el color principal del pantalón</p>
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
        Este color se usará para cordones, zippers y detalles
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

  // ========== CAMINO 2: PANELES Y RAYAS ==========
  const pasoPanelesTipo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "rayas_laterales",
            label: "Rayas Finas",
            desc: "3 rayas finas en los laterales",
            img: "/img/patrones/RayasPant.png"
          },
          {
            key: "panel_ancho_lateral",
            label: "Raya Ancha",
            desc: "1 franja ancha en cada lado",
            img: "/img/patrones/RayaAnchaPant.png"
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setTipoPanelCorte(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 transition ${
              tipoPanelCorte === opt.key
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

  const pasosPanelesColores = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona los colores</h2>
      <p className="text-sm text-gray-500 mb-6">
        Color 1 = cuerpo principal · Color 2 = paneles/rayas laterales
      </p>
      
      {[0, 1].map((i) => (
        <div key={i} className="mb-6">
          <p className="font-semibold mb-2">
            Color {i + 1}
            {i === 0 ? " (Cuerpo Principal)" : " (Paneles/Rayas)"}
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

  // ========== CAMINO 3: SUBLIMACIÓN ==========
  const pasoSublimacionArea = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el área de sublimación</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "completo",
            label: "Completo",
            desc: "Todo el pantalón es sublimado",
            img: "/img/patrones/CompletoPant.png"
          },
          {
            key: "paneles_laterales",
            label: "Paneles Laterales",
            desc: "Solo los paneles anchos laterales",
            img: "/img/patrones/PanelPant.png"
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
            <p className="font-bold text-lg mt-2">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoSublimacionColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base sólido</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se aplicará en el frente, espalda y cintura
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

  const pasoSublimacionTipoDisenoIA = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de diseño IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "degradado", label: "Degradado", img: "/img/patrones/DegradadoPant.png" },
          { key: "artistico", label: "Artístico", img: "/img/patrones/PinceladasPant.png" },
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
            <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="font-bold text-lg mt-2">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Sub-pasos para diseños IA

  // DEGRADADO
  const pasoSublimacionDegradadoColores = (
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
  const pasoSublimacionGeometricoFigura = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona la figura geométrica</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: "triangulos", label: "Triángulos" },
          { key: "cuadrados", label: "Cuadrados" },
          { key: "lineas_diagonales", label: "Líneas Diagonales" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setFiguraGeometrica(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              figuraGeometrica === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <p className="font-bold">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoSublimacionGeometricoColores = (
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
  const pasoSublimacionArtisticoEstilo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo artístico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "pinceladas", label: "Pinceladas", img: "/img/patrones/PinceladasPant.png" },
          { key: "humo", label: "Humo", img: "/img/patrones/HumoPant.png" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setEstiloArtistico(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              estiloArtistico === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="font-bold text-lg mt-2">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoSublimacionArtisticoColores = (
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

  // ========== OPCIONES GENERALES (FINAL) ==========
  const pasoOpcionesGenerales = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold mb-4">Opciones generales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tela */}
        <div>
          <h3 className="font-semibold mb-2">Tela</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "Algodón", label: "Algodón", img: "/img/patrones/Algodon.png" },
              { key: "Poliéster", label: "Poliéster", img: "/img/patrones/Poliester.png" },
              { key: "Fleece", label: "Impermeable", img: "/img/patrones/Impermeable.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setTela(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  tela === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-24 h-24 object-cover" />
                <p className="font-semibold text-lg mt-2">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Género */}
        <div>
          <h3 className="font-semibold mb-2">Género</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "Hombre", label: "Hombre", img: "/img/patrones/HombrePant.png" },
              { key: "Mujer", label: "Mujer", img: "/img/patrones/MujerPant.png" },
              { key: "Unisex", label: "Unisex", img: "/img/patrones/UnisexPant.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setGenero(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  genero === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-24 h-24 object-cover" />
                <p className="font-semibold text-lg mt-2">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>
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
          {loading ? "Generando..." : "Generar Pantalón"}
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
  } else if (caminoSeleccionado === "paneles") {
    pasosActuales = [
      ...pasosActuales,
      pasoPanelesTipo,
      pasosPanelesColores,
      pasoOpcionesGenerales,
    ];
  } else if (caminoSeleccionado === "sublimacion") {
    pasosActuales = [
      ...pasosActuales,
      pasoSublimacionArea,
    ];

    // Solo agregar paso de color base si el área es paneles laterales
    if (areaDisenoIA === "paneles_laterales") {
      pasosActuales.push(pasoSublimacionColorBase);
    }

    pasosActuales.push(pasoSublimacionTipoDisenoIA);

    // Agregar sub-pasos según el tipo de diseño IA
    if (tipoDisenoIA === "degradado") {
      pasosActuales.push(pasoSublimacionDegradadoColores);
    } else if (tipoDisenoIA === "geometrico") {
      pasosActuales.push(pasoSublimacionGeometricoFigura, pasoSublimacionGeometricoColores);
    } else if (tipoDisenoIA === "artistico") {
      pasosActuales.push(pasoSublimacionArtisticoEstilo, pasoSublimacionArtisticoColores);
    }

    pasosActuales.push(pasoOpcionesGenerales);
  }

  /* ===============================
     RENDER PRINCIPAL
     =============================== */
  return (
    <div>
      <Navbar />
      <PantallaCarga 
        show={loading} 
        message="Generando tu pantalón con IA... 10-30 segundos"
      />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {imagen ? (
          <div className="text-center space-y-6">
            <p className="text-blue-600 font-bold mb-4 text-2xl">
              ¡Pantalón generado con éxito!
            </p>
            <img
              src={imagen}
              alt="Pantalón generado"
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
                  setTipoCorte("");
                  setTipoTobillo("");
                  setBolsillos("");
                  setColorBase("");
                  setColorAcentos("");
                  setTipoPanelCorte("");
                  setColoresBloque(["", ""]);
                  setAreaDisenoIA("");
                  setColorBaseMixto("");
                  setTipoDisenoIA("");
                  setColoresGradiente(["", "", ""]);
                  setFiguraGeometrica("");
                  setColoresGeometrico(["", "", "", ""]);
                  setEstiloArtistico("");
                  setColoresArtistico(["", "", ""]);
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
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg ml-auto"
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
