// src/pages/ModeloIA/FormConjuntoExterno.jsx
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
export default function FormConjuntoExterno() {
  const { user } = useAuth();

  // Estados generales
  const [paso, setPaso] = useState(1);
  const [caminoSeleccionado, setCaminoSeleccionado] = useState(""); // 'solido_coordinado', 'bloques_coordinados', 'sublimado_ia'

  // ========== PASO 1: OPCIONES ESTRUCTURALES (CONJUNTO) ==========
  // Chaqueta
  const [capucha, setCapucha] = useState(""); // 'si' o 'no'
  const [bolsillosChaqueta, setBolsillosChaqueta] = useState(""); // 'canguro', 'laterales', 'sin_bolsillos'
  
  // Pantalón
  const [tipoCortePantalon, setTipoCortePantalon] = useState(""); // 'jogger' o 'recto'
  const [tipoTobillo, setTipoTobillo] = useState(""); // 'elastico' o 'suelto'
  const [bolsillosPantalon, setBolsillosPantalon] = useState(""); // 'laterales', 'traseros', 'sin_bolsillos'

  // ========== CAMINO 1: SÓLIDO COORDINADO ==========
  const [colorBase, setColorBase] = useState("");
  const [colorAcentos, setColorAcentos] = useState("");

  // ========== CAMINO 2: BLOQUES COORDINADOS ==========
  const [tipoBloque, setTipoBloque] = useState(""); // 'rayas_laterales', 'bloque_superior_chaqueta', 'paneles_mixtos'
  const [colorBaseBloque, setColorBaseBloque] = useState("");
  const [colorPanelBloque, setColorPanelBloque] = useState("");

  // ========== CAMINO 3: SUBLIMADO IA ==========
  const [areaSublimacion, setAreaSublimacion] = useState(""); // 'completo_ambas' o 'hibrido'
  const [colorBaseSublimado, setColorBaseSublimado] = useState("");
  
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
  const [imagenChaqueta, setImagenChaqueta] = useState(null);
  const [imagenPantalon, setImagenPantalon] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     VALIDACIÓN DE PASOS
     =============================== */
  const validarPasoActual = () => {
    // Paso 1: Opciones estructurales
    if (paso === 1 && (!capucha || !bolsillosChaqueta || !tipoCortePantalon || !tipoTobillo || !bolsillosPantalon)) {
      toast.warning("Completa todas las opciones estructurales del conjunto.");
      return false;
    }

    // Paso 2: Selección de camino
    if (paso === 2 && !caminoSeleccionado) {
      toast.warning("Selecciona un tipo de diseño.");
      return false;
    }

    // CAMINO 1: SÓLIDO COORDINADO
    if (caminoSeleccionado === "solido_coordinado") {
      if (paso === 3 && !colorBase) {
        toast.warning("Selecciona el color base.");
        return false;
      }
      if (paso === 4 && !colorAcentos) {
        toast.warning("Selecciona el color de acentos.");
        return false;
      }
    }

    // CAMINO 2: BLOQUES COORDINADOS
    if (caminoSeleccionado === "bloques_coordinados") {
      if (paso === 3 && !tipoBloque) {
        toast.warning("Selecciona un tipo de bloque.");
        return false;
      }
      if (paso === 4 && !colorBaseBloque) {
        toast.warning("Selecciona el color base.");
        return false;
      }
      if (paso === 5 && !colorPanelBloque) {
        toast.warning("Selecciona el color del panel.");
        return false;
      }
    }

    // CAMINO 3: SUBLIMADO IA
    if (caminoSeleccionado === "sublimado_ia") {
      if (paso === 3 && !areaSublimacion) {
        toast.warning("Selecciona el área de sublimación.");
        return false;
      }
      
      // Paso 4 condicional: solo si areaSublimacion es 'hibrido'
      if (areaSublimacion === "hibrido" && paso === 4 && !colorBaseSublimado) {
        toast.warning("Selecciona el color base sólido.");
        return false;
      }

      // Validar tipo de diseño IA
      const pasoTipoDisenoIA = areaSublimacion === "completo_ambas" ? 4 : 5;
      if (paso === pasoTipoDisenoIA && !tipoDisenoIA) {
        toast.warning("Selecciona el tipo de diseño IA.");
        return false;
      }

      // Validaciones específicas según tipo de diseño IA
      if (tipoDisenoIA === "degradado") {
        const pasoColores = areaSublimacion === "completo_ambas" ? 5 : 6;
        if (paso === pasoColores && coloresGradiente.slice(0, numColoresGradiente).some(c => !c)) {
          toast.warning("Selecciona todos los colores del degradado.");
          return false;
        }
      }

      if (tipoDisenoIA === "artistico") {
        const pasoEstilo = areaSublimacion === "completo_ambas" ? 5 : 6;
        const pasoColores = areaSublimacion === "completo_ambas" ? 6 : 7;
        
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
    setTipoBloque("");
    setColorBaseBloque("");
    setColorPanelBloque("");
    setAreaSublimacion("");
    setColorBaseSublimado("");
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
    setImagenChaqueta(null);
    setImagenPantalon(null);

    let payload = {
      userId: user?.id,
      categoria_id: "conjunto_externo_ia_v1",
      capucha,
      bolsillosChaqueta,
      tipoCortePantalon,
      tipoTobillo,
      bolsillosPantalon,
      caminoSeleccionado,
      tela,
      genero,
    };

    // Datos específicos según el camino
    if (caminoSeleccionado === "solido_coordinado") {
      payload = {
        ...payload,
        colorBase,
        colorAcentos,
      };
    } else if (caminoSeleccionado === "bloques_coordinados") {
      payload = {
        ...payload,
        tipoBloque,
        colorBaseBloque,
        colorPanelBloque,
      };
    } else if (caminoSeleccionado === "sublimado_ia") {
      payload = {
        ...payload,
        areaSublimacion,
        tipoDisenoIA,
      };

      // Solo agregar colorBaseSublimado si el área es híbrida
      if (areaSublimacion === "hibrido") {
        payload.colorBaseSublimado = colorBaseSublimado;
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
      : `${API_URL}/api/ia/generar_conjunto_externo_v1`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.imageUrlChaqueta && data.imageUrlPantalon) {
        setImagenChaqueta(data.imageUrlChaqueta);
        setImagenPantalon(data.imageUrlPantalon);
      }
    } catch (e) {
      console.error("Error:", e);
      toast.error("Error al generar el conjunto deportivo.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     BLOQUES DE INTERFAZ
     =============================== */

  // ========== PASO 1: OPCIONES ESTRUCTURALES ==========
  const paso1Estructural = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-8">
      <h2 className="text-xl font-bold mb-4">Opciones estructurales del conjunto</h2>
      
      {/* CHAQUETA */}
      <div className="border-t-4 border-blue-500 pt-6">
        <h3 className="text-lg font-bold mb-4 text-blue-600">🧥 CHAQUETA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capucha */}
          <div>
            <h4 className="font-semibold mb-2">Capucha</h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "si", label: "Con capucha" },
                { key: "no", label: "Sin capucha" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setCapucha(opt.key)}
                  className={`cursor-pointer p-3 rounded-lg border-4 ${
                    capucha === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bolsillos Chaqueta */}
          <div>
            <h4 className="font-semibold mb-2">Bolsillos</h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "canguro", label: "Canguro", desc: "Bolsillo frontal grande" },
                { key: "laterales", label: "Laterales", desc: "Bolsillos a los costados" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setBolsillosChaqueta(opt.key)}
                  className={`cursor-pointer p-3 rounded-lg border-4 ${
                    bolsillosChaqueta === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  {opt.desc && <p className="text-sm text-gray-500">{opt.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PANTALÓN */}
      <div className="border-t-4 border-green-500 pt-6">
        <h3 className="text-lg font-bold mb-4 text-green-600">👖 PANTALÓN</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tipo de corte */}
          <div>
            <h4 className="font-semibold mb-2">Tipo de corte</h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "jogger", label: "Jogger", desc: "Ajustado deportivo" },
                { key: "recto", label: "Recto", desc: "Corte clásico" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setTipoCortePantalon(opt.key)}
                  className={`cursor-pointer p-3 rounded-lg border-4 ${
                    tipoCortePantalon === opt.key ? "border-green-600 bg-green-50" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de tobillo */}
          <div>
            <h4 className="font-semibold mb-2">Tipo de tobillo</h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "elastico", label: "Elástico", desc: "Con rib ajustado" },
                { key: "suelto", label: "Suelto", desc: "Con basta libre" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setTipoTobillo(opt.key)}
                  className={`cursor-pointer p-3 rounded-lg border-4 ${
                    tipoTobillo === opt.key ? "border-green-600 bg-green-50" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bolsillos Pantalón */}
          <div>
            <h4 className="font-semibold mb-2">Bolsillos</h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "laterales", label: "Laterales", desc: "Bolsillos a los lados" },
                { key: "traseros", label: "Traseros", desc: "Bolsillos en la parte trasera" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setBolsillosPantalon(opt.key)}
                  className={`cursor-pointer p-3 rounded-lg border-4 ${
                    bolsillosPantalon === opt.key ? "border-green-600 bg-green-50" : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ========== PASO 2: SELECCIÓN DE CAMINO ==========
  const paso2SeleccionCamino = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo de diseño del conjunto</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            key: "solido_coordinado", 
            label: "Sólido Coordinado", 
            desc: "Mismo color base + mismo color de acentos en ambas piezas",
            ejemplo: "Ej: Negro con detalles amarillos"
          },
          { 
            key: "bloques_coordinados", 
            label: "Bloques Coordinados", 
            desc: "Mismos colores en diferentes arreglos de paneles",
            ejemplo: "Ej: Rayas laterales coordinadas"
          },
          { 
            key: "sublimado_ia", 
            label: "Sublimado IA", 
            desc: "Diseño generado por IA aplicado coordinadamente",
            ejemplo: "Ej: Degradado o diseño artístico"
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
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
            <p className="text-xs text-gray-400 mt-1 italic">{opt.ejemplo}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== CAMINO 1: SÓLIDO COORDINADO ==========
  const pasoSolidoColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base del conjunto</h2>
      <p className="text-sm text-gray-500 mb-6">Este será el color principal de la chaqueta y el pantalón</p>
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
      <h2 className="text-xl font-bold mb-4">Selecciona el color de acentos del conjunto</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se usará en cremalleras, cordones, logos y detalles de ambas piezas
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

  // ========== CAMINO 2: BLOQUES COORDINADOS ==========
  const pasoBloquesTipo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de bloque coordinado</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            key: "rayas_laterales",
            label: "Rayas Laterales",
            desc: "3 rayas en mangas de chaqueta y piernas de pantalón",
            ejemplo: "Estilo Adidas clásico"
          },
          {
            key: "bloque_superior_chaqueta",
            label: "Bloque Superior",
            desc: "Pecho de chaqueta + pantalón sólido coordinado",
            ejemplo: "Combinación elegante"
          },
          {
            key: "paneles_mixtos",
            label: "Paneles Mixtos",
            desc: "Paneles en hombros de chaqueta + panel lateral en pantalón",
            ejemplo: "Estilo deportivo moderno"
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
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
            <p className="text-xs text-gray-400 mt-1 italic">{opt.ejemplo}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasosBloquesColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base</h2>
      <p className="text-sm text-gray-500 mb-6">Este será el color principal de ambas piezas</p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorBaseBloque(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorBaseBloque === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorBaseBloque && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorBaseBloque}</p>
      )}
    </div>
  );

  const pasosBloquesColorPanel = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color del panel/rayas</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se usará en los paneles, rayas o bloques de diseño
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorPanelBloque(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorPanelBloque === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorPanelBloque && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorPanelBloque}</p>
      )}
    </div>
  );

  // ========== CAMINO 3: SUBLIMADO IA ==========
  const pasoSublimadoArea = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el área de sublimación</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "completo_ambas",
            label: "Completo (Ambas piezas)",
            desc: "Diseño IA cubre 100% de chaqueta y pantalón",
            ejemplo: "Full print coordinado"
          },
          {
            key: "hibrido",
            label: "Híbrido (Paneles)",
            desc: "Combina sólido + paneles sublimados en ambas piezas",
            ejemplo: "Estilo Windrunner moderno"
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setAreaSublimacion(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 transition ${
              areaSublimacion === opt.key
                ? "border-blue-600 ring-2 ring-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
            <p className="text-xs text-gray-400 mt-1 italic">{opt.ejemplo}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoSublimadoColorBase = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el color base sólido</h2>
      <p className="text-sm text-gray-500 mb-6">
        Este color se aplicará en las partes NO sublimadas de ambas piezas
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {coloresBase.map((c) => (
          <div
            key={c.es}
            onClick={() => setColorBaseSublimado(c.es)}
            className={`w-12 h-12 rounded-full border-4 cursor-pointer ${
              colorBaseSublimado === c.es ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.es}
          />
        ))}
      </div>
      {colorBaseSublimado && (
        <p className="mt-4 font-semibold text-lg">Color seleccionado: {colorBaseSublimado}</p>
      )}
    </div>
  );

  const pasoSublimadoTipoDisenoIA = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el tipo de diseño IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "degradado", label: "Degradado", desc: "Transición suave de colores" },
          { key: "artistico", label: "Artístico", desc: "Pinceladas o efecto humo" },
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
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-600 mt-2">{opt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Sub-pasos para diseños IA

  // DEGRADADO
  const pasoSublimadoDegradadoColores = (
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
  const pasoSublimadoArtisticoEstilo = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Selecciona el estilo artístico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "pinceladas", label: "Pinceladas", desc: "Efecto de pintura expresiva" },
          { key: "humo", label: "Humo", desc: "Efecto etéreo y difuminado" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setEstiloArtistico(opt.key)}
            className={`cursor-pointer border-4 rounded-xl p-4 ${
              estiloArtistico === opt.key ? "border-blue-600" : "border-gray-300"
            }`}
          >
            <p className="font-bold text-lg">{opt.label}</p>
            <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const pasoSublimadoArtisticoColores = (
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
      <h2 className="text-xl font-bold mb-4">Opciones generales del conjunto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tela */}
        <div>
          <h3 className="font-semibold mb-2">Tela</h3>
          <div className="flex flex-col gap-3">
            {[
              { key: "Algodón", label: "Algodón" },
              { key: "Poliéster", label: "Poliéster" },
              { key: "Fleece", label: "Fleece (Polar)" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setTela(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  tela === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <p className="font-semibold">{opt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Género */}
        <div>
          <h3 className="font-semibold mb-2">Género</h3>
          <div className="flex flex-col gap-3">
            {[
              { key: "Hombre", label: "Hombre" },
              { key: "Mujer", label: "Mujer" },
              { key: "Unisex", label: "Unisex" },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => setGenero(opt.key)}
                className={`cursor-pointer p-3 rounded-lg border-4 ${
                  genero === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
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
          {loading ? "Generando conjunto..." : "Generar Conjunto Deportivo"}
        </button>
      </div>
    </div>
  );

  /* ===============================
     CONTROL DE FLUJO DE PASOS
     =============================== */
  let pasosActuales = [paso1Estructural, paso2SeleccionCamino];

  if (caminoSeleccionado === "solido_coordinado") {
    pasosActuales = [
      ...pasosActuales,
      pasoSolidoColorBase,
      pasoSolidoColorAcentos,
      pasoOpcionesGenerales,
    ];
  } else if (caminoSeleccionado === "bloques_coordinados") {
    pasosActuales = [
      ...pasosActuales,
      pasoBloquesTipo,
      pasosBloquesColorBase,
      pasosBloquesColorPanel,
      pasoOpcionesGenerales,
    ];
  } else if (caminoSeleccionado === "sublimado_ia") {
    pasosActuales = [
      ...pasosActuales,
      pasoSublimadoArea,
    ];

    // Solo agregar paso de color base si el área es híbrida
    if (areaSublimacion === "hibrido") {
      pasosActuales.push(pasoSublimadoColorBase);
    }

    pasosActuales.push(pasoSublimadoTipoDisenoIA);

    // Agregar sub-pasos según el tipo de diseño IA
    if (tipoDisenoIA === "degradado") {
      pasosActuales.push(pasoSublimadoDegradadoColores);
    } else if (tipoDisenoIA === "artistico") {
      pasosActuales.push(pasoSublimadoArtisticoEstilo, pasoSublimadoArtisticoColores);
    }

    pasosActuales.push(pasoOpcionesGenerales);
  }

  /* ===============================
     RENDER PRINCIPAL
     =============================== */
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-6 space-y-8">
        {imagenChaqueta && imagenPantalon ? (
          <div className="text-center space-y-6">
            <p className="text-blue-600 font-bold mb-4 text-2xl">
              ¡Conjunto deportivo generado con éxito!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">🧥 Chaqueta</h3>
                <img
                  src={imagenChaqueta}
                  alt="Chaqueta generada"
                  className="mx-auto rounded-lg shadow-lg w-80"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">👖 Pantalón</h3>
                <img
                  src={imagenPantalon}
                  alt="Pantalón generado"
                  className="mx-auto rounded-lg shadow-lg w-80"
                />
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => (window.location.href = "/listar-prendasIA")}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
              >
                Ir a mi colección
              </button>
              <button
                onClick={() => {
                  setImagenChaqueta(null);
                  setImagenPantalon(null);
                  setPaso(1);
                  setCaminoSeleccionado("");
                  setCapucha("");
                  setBolsillosChaqueta("");
                  setTipoCortePantalon("");
                  setTipoTobillo("");
                  setBolsillosPantalon("");
                  setColorBase("");
                  setColorAcentos("");
                  setTipoBloque("");
                  setColorBaseBloque("");
                  setColorPanelBloque("");
                  setAreaSublimacion("");
                  setColorBaseSublimado("");
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
