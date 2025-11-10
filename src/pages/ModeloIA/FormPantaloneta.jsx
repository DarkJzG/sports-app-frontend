// src/pages/ModeloIA/FormPantaloneta.jsx
import React, { useEffect, useState } from "react";
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
  { es: "Azul Marino", en: "navy blue", hex: "#000080" },
];

/* ===============================
   COMPONENTE PRINCIPAL
   =============================== */
export default function FormPantaloneta() {
  const { user } = useAuth();

  // Estados generales
  const [paso, setPaso] = useState(1);
  const [caminoSeleccionado, setCaminoSeleccionado] = useState(""); // 'solido', 'paneles', 'sublimacion'

  // ========== PASO 1: OPCIONES ESTRUCTURALES ==========
  const [largo, setLargo] = useState(""); // 'corto', 'medio', 'largo'
  const [bolsillos, setBolsillos] = useState(""); // 'laterales_zip', 'laterales_sin_zip', 'sin_bolsillos'
  const [cordon, setCordon] = useState(""); // 'visible', 'interno'

  // ========== CAMINO 1: SÓLIDO CON ACENTOS ==========
  const [colorBase, setColorBase] = useState("");
  const [colorAcentos, setColorAcentos] = useState("");

  // ========== CAMINO 2: PANELES Y RAYAS ==========
  const [tipoPanelCorte, setTipoPanelCorte] = useState(""); // 'rayas_finas', 'panel_ancho', 'panel_curvo'
  const [colorBasePanel, setColorBasePanel] = useState("");
  const [colorPanel, setColorPanel] = useState("");

  // ========== CAMINO 3: SUBLIMACIÓN (IA) ==========
  const [areaDisenoIA, setAreaDisenoIA] = useState(""); // 'completo' o 'paneles_laterales'
  const [colorBaseMixto, setColorBaseMixto] = useState("");
  
  // Tipo de diseño IA (solo degradado y artistico)
  const [tipoDisenoIA, setTipoDisenoIA] = useState(""); // 'degradado' o 'artistico'
  
  // Para degradado
  const [numColoresGradiente, setNumColoresGradiente] = useState(2);
  const [coloresGradiente, setColoresGradiente] = useState(["", "", ""]);

  // Para artístico (solo pinceladas y humo)
  const [estiloArtistico, setEstiloArtistico] = useState(""); // 'pinceladas' o 'humo'
  const [numColoresArtistico, setNumColoresArtistico] = useState(2);
  const [coloresArtistico, setColoresArtistico] = useState(["", "", ""]);

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
    if (paso === 1 && (!largo || !bolsillos || !cordon)) {
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
      if (paso === 4 && !colorBasePanel) {
        toast.warning("Selecciona el color base.");
        return false;
      }
      if (paso === 5 && !colorPanel) {
        toast.warning("Selecciona el color del panel.");
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
    setColorBasePanel("");
    setColorPanel("");
    setAreaDisenoIA("");
    setColorBaseMixto("");
    setTipoDisenoIA("");
    setColoresGradiente(["", "", ""]);
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
      categoria_id: "pantaloneta_ia_v1",
      largo,
      bolsillos,
      cordon,
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
        colorBasePanel,
        colorPanel,
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
      } else if (tipoDisenoIA === "artistico") {
        payload.estiloArtistico = estiloArtistico;
        payload.coloresArtistico = coloresArtistico.slice(0, numColoresArtistico);
      }
    }

    // Limpiar valores vacíos
    Object.keys(payload).forEach(
      (k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]
    );

    const endpoint = modeloIA === "gemini"
      ? API_URL_GEMINI
      : `${API_URL}/api/ia/generar_pantaloneta_v1`;

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
      toast.error("Error al generar la pantaloneta.");
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
      <h2 className="text-xl font-bold mb-4">Opciones estructurales de la pantaloneta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Largo */}
        <div>
          <h3 className="font-semibold mb-2">Largo</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "corto", label: "Corto", desc: "Atletismo", img: "/img/patrones/Atletismo.png" },
              { key: "medio", label: "Medio", desc: "Fútbol", img: "/img/patrones/Futbol.png" },
              { key: "largo", label: "Largo", desc: "Básquet", img: "/img/patrones/Basquet.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setLargo(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  largo === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-20 h-20 object-cover mb-2" />
                <p className="font-semibold">{opt.label}</p>
                <p className="text-sm text-gray-500">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bolsillos */}
        <div>
          <h3 className="font-semibold mb-2">Bolsillos</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "laterales_zip", label: "Con cierre", img: "/img/patrones/CierreP.png" },
              { key: "laterales_sin_zip", label: "Sin cierre", img: "/img/patrones/SinCierreP.png" },
              { key: "sin_bolsillos", label: "Sin bolsillos", img: "/img/patrones/SinBolsillos.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setBolsillos(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  bolsillos === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-40 h-10 object-cover mb-2" />
                <p className="font-semibold">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cordón */}
        <div>
          <h3 className="font-semibold mb-2">Cordón de cintura</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "visible", label: "Visible", img: "/img/patrones/CordonP.png" },
              { key: "interno", label: "Oculto", img: "/img/patrones/SinCordonP.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setCordon(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  cordon === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-40 h-10 object-cover mb-2" />
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
            img: "/img/patrones/SolidoAcentoP.png"
          },
          { 
            key: "paneles", 
            label: "Paneles y Rayas", 
            img: "/img/patrones/PanelP.png"
          },
          { 
            key: "sublimacion", 
            label: "Diseño Sublimado", 
            img: "/img/patrones/CompletoP.png"
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
      <p className="text-sm text-gray-500 mb-6">Este será el color principal de la pantaloneta</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            key: "rayas_finas",
            label: "Rayas Finas",
            img: "/img/patrones/RayaFinaP.png"
          },
          {
            key: "panel_ancho",
            label: "Panel Ancho",
            img: "/img/patrones/RayaAnchaP.png"
          },
          {
            key: "panel_curvo",
            label: "Panel Curvo ",
            img: "/img/patrones/RayaCurvaP.png"
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
          </div>
        ))}
      </div>
    </div>
  );

  const pasosPanelesColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base</h2>
      <p className="text-sm text-gray-500 mb-6">Este será el color principal del cuerpo</p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorBasePanel(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorBasePanel === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorBasePanel && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorBasePanel}</p>
      )}
    </div>
  );

  const pasosPanelesColorPanel = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color del panel/rayas</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se usará en los paneles o rayas laterales
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorPanel(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorPanel === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorPanel && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorPanel}</p>
      )}
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
            img: "/img/patrones/CompletoPantaloneta.png"
          },
          {
            key: "paneles_laterales",
            label: "Paneles Laterales",
            img: "/img/patrones/PanelesPantaloneta.png",
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
          { key: "artistico", label: "Artístico", img: "/img/patrones/PinceladaPant.png" },
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
            <p className="font-bold text-lg">{opt.label}</p>
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

  // ARTÍSTICO (solo pinceladas y humo)
  const pasoSublimacionArtisticoEstilo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo artístico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "pinceladas", label: "Pinceladas", img: "/img/patrones/PinceladaPant.png" },
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
            <p className="font-bold text-lg">{opt.label}</p>
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
              { key: "Poliéster", label: "Poliéster", img: "/img/patrones/Poliester.png" },
              { key: "Microfibra", label: "Algodón", img: "/img/patrones/Algodon.png" },
              { key: "Mesh", label: "Impermeable", img: "/img/patrones/Impermeable.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setTela(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  tela === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
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
              { key: "Hombre", label: "Hombre", img: "/img/patrones/Atletismo.png" },
              { key: "Mujer", label: "Mujer", img: "/img/patrones/MujerPantaloneta.png" },
              { key: "Unisex", label: "Unisex", img: "/img/patrones/UnisexPantaloneta.png" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setGenero(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  genero === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
                <p className="font-semibold text-lg mt-2">{opt.label}</p>
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
          {loading ? "Generando..." : "Generar Pantaloneta"}
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
      pasosPanelesColorBase,
      pasosPanelesColorPanel,
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
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {imagen ? (
          <div className="text-center space-y-6">
            <p className="text-blue-600 font-bold mb-4 text-2xl">
              ¡Pantaloneta generada con éxito!
            </p>
            <img
              src={imagen}
              alt="Pantaloneta generada"
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
                  setLargo("");
                  setBolsillos("");
                  setCordon("");
                  setColorBase("");
                  setColorAcentos("");
                  setTipoPanelCorte("");
                  setColorBasePanel("");
                  setColorPanel("");
                  setAreaDisenoIA("");
                  setColorBaseMixto("");
                  setTipoDisenoIA("");
                  setColoresGradiente(["", "", ""]);
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
