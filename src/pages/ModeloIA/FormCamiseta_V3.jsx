// src/pages/ModeloIA/FormCamiseta_V3.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  /* 🎨 Paleta base */
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
  ];

/* ===============================
   ⚙️ CONFIGURACIÓN DE PATRONES
   =============================== */
const CONFIG_PATRONES = {
  gradient: {label: "Degradado"},
  geometric: {label: "Geométrico"},
  abstract: {label: "Artístico"},
  stripes: {label: "Rayas"},
  camouflage: {label: "Camuflaje"},
  two_tone: {label: "Dos tonos"},
  solid: {label: "Sólido"},
  full_print: {label: "Personalizado"},
};



// 🔹 Paso 1: Tipo de diseño
const BloqueTipoDiseno = ({ tipoFullPrint, setTipoFullPrint }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-4">Tipo de diseño completo</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { key: "objects", label: "Por objetos o elementos", img: "/img/patrones/FullAnimado.png" },
        { key: "textures", label: "Por texturas o patrones", img: "/img/patrones/FullRealista.png" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setTipoFullPrint(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            tipoFullPrint === opt.key
              ? "border-blue-600 ring-2 ring-blue-400"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">{opt.label}</p>
        </div>
      ))}
    </div>
    <p className="text-sm text-gray-500 mt-4">
      Selecciona si tu diseño se basa en <b>figuras u objetos</b> o en una <b>textura/patrón completo</b>.
    </p>
  </div>
);

// 🔸 Objetos
const BloqueObjetosPaso1 = ({ numObjetos, setNumObjetos, motif1, setMotif1, motif2, setMotif2 }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
    <h2 className="text-xl font-bold mb-4">1️⃣ Objetos o elementos principales</h2>
    <div className="flex justify-center gap-4 mb-6">
      {[{ key: 1, label: "Un solo objeto" }, { key: 2, label: "Dos objetos" }].map((opt) => (
        <button
          key={opt.key}
          onClick={() => setNumObjetos(opt.key)}
          className={`px-4 py-2 rounded-lg border ${
            numObjetos === opt.key ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>

    <div className="flex flex-col md:flex-row justify-center gap-6">
      <div>
        <p className="font-semibold mb-2">Objeto 1</p>
        <input
          type="text"
          maxLength={10}
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
            maxLength={10}
            value={motif2}
            onChange={(e) => setMotif2(e.target.value)}
            placeholder="Ej: burbujas"
            className="border p-2 rounded-lg w-40 text-center"
          />
        </div>
      )}
    </div>
  </div>
);

const BloqueObjetosPaso2 = ({ numObjetos, coloresObjetos, setColoresObjetos, coloresBase }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-3">2️⃣ Colores del diseño</h2>
    <p className="text-sm text-gray-500 mb-6">
      {numObjetos === 1
        ? "Color 1 = base de la camiseta · Color 2 = objetos"
        : "Color 1 = base · Color 2 = primer objeto · Color 3 = segundo objeto"}
    </p>
    {[...Array(numObjetos + 1)].map((_, i) => (
      <div key={i} className="mb-4">
        <p className="font-semibold mb-1">Color {i + 1}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {coloresBase.map((c) => (
            <div
              key={c.en}
              onClick={() =>
                setColoresObjetos((prev) => {
                  const next = [...prev];
                  next[i] = c.en;
                  return next;
                })
              }
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                coloresObjetos[i] === c.en ? "border-blue-600" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const BloqueObjetosPaso3 = ({ styleFP, setStyleFP, distributionFP, setDistributionFP }) => (
  <div className="bg-white p-6 rounded-xl shadow-md space-y-6 text-center">
    <h2 className="text-xl font-bold mb-4">3️⃣ Estilo visual y distribución</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Estilo visual */}
      <div className="p-4 rounded-lg border bg-gray-50">
        <h3 className="font-semibold mb-2">Estilo visual</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "cartoon style", label: "Animado", img: "/img/patrones/FullAnime.png" },
            { key: "realistic style", label: "Realista", img: "/img/patrones/FullReal.png" },
            { key: "futuristic style", label: "Futurista", img: "/img/patrones/FullRealista.png" },
            { key: "minimalist style", label: "Minimalista", img: "/img/patrones/FullFuturista.png" },
            { key: "abstract artistic style", label: "Abstracto", img: "/img/patrones/FullAbstracto.png" },
          ].map((opt) => (
            <div
              key={opt.key}
              onClick={() => setStyleFP(opt.key)}
              className={`cursor-pointer border-4 rounded-xl overflow-hidden ${
                styleFP === opt.key ? "border-blue-600" : "border-gray-300"
              }`}
            >
              <img src={opt.img} alt={opt.label} className="w-full h-20 object-cover" />
              <p className="text-sm font-semibold bg-white py-1">{opt.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución */}
      <div className="p-4 rounded-lg border bg-gray-50">
        <h3 className="font-semibold mb-2">Distribución</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { val: "random scattered", label: "Aleatoria", img: "/img/patrones/FullRandom.png" },
            { val: "spaced layout", label: "Dispersos", img: "/img/patrones/FullMinimalista.png" },
            { val: "no repetition", label: "Sin repetición", img: "/img/patrones/FullSinRepeticiones.png" },
          ].map((opt) => (
            <div
              key={opt.val}
              onClick={() => setDistributionFP(opt.val)}
              className={`cursor-pointer border-4 rounded-xl overflow-hidden ${
                distributionFP === opt.val ? "border-blue-600" : "border-gray-300"
              }`}
            >
              <img src={opt.img} alt={opt.label} className="w-full h-20 object-cover" />
              <p className="text-sm font-semibold bg-white py-1">{opt.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 🔸 Texturas
const BloqueTexturasPaso1 = ({
  numColoresFP,
  setNumColoresFP,
  coloresExtraFP,
  setColoresExtraFP,
  coloresBase,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
    <h2 className="text-xl font-bold mb-4">1️⃣ Colores del diseño</h2>
    <p className="text-sm text-gray-500 mb-2">
      Color 1 = base · Color 2 = textura principal · Color 3 (opcional) = detalles
    </p>
    <div className="flex justify-center gap-4 mb-4">
      {[2, 3].map((n) => (
        <button
          key={n}
          onClick={() => setNumColoresFP(n)}
          className={`px-4 py-2 rounded-lg border ${
            numColoresFP === n ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          {n} Colores
        </button>
      ))}
    </div>
    {[...Array(numColoresFP)].map((_, i) => (
      <div key={i} className="mb-4">
        <p className="font-semibold mb-1">Color {i + 1}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {coloresBase.map((c) => (
            <div
              key={c.en}
              onClick={() =>
                setColoresExtraFP((prev) => {
                  const next = [...prev];
                  next[i] = c.en;
                  return next;
                })
              }
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                coloresExtraFP[i] === c.en ? "border-blue-600" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const BloqueTexturasPaso2 = ({
  textureType,
  setTextureType,
  customTexture,
  setCustomTexture,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-4">2️⃣ Tipo de textura o patrón</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[ 
        { key: "speckled texture", label: "Moteado", img: "/img/patrones/TextMoteado.png" }, 
        { key: "striped linear pattern", label: "Líneas o franjas", img: "/img/patrones/TextLineas.png" }, 
        { key: "tech circuit pattern", label: "Circuitos", img: "/img/patrones/TextCircuito.png" }, 
        { key: "wave pattern", label: "Olas o flujo", img: "/img/patrones/TextFlujo.png" }, 
        { key: "floral organic pattern", label: "Flores u orgánico", img: "/img/patrones/TextOrganico.png" }, 
        { key: "custom", label: "Otro (escribir idea)", img: "/img/patrones/TextCustom.png" }, 
        
    ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setTextureType(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden ${
            textureType === opt.key ? "border-blue-600" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-24 object-cover" />
          <p className="font-semibold bg-white py-1">{opt.label}</p>
        </div>
      ))}
    </div>

    {textureType === "custom" && (
      <div className="mt-6">
        <input
          type="text"
          maxLength={10}
          value={customTexture}
          onChange={(e) => setCustomTexture(e.target.value)}
          placeholder="Describe tu textura (máx. 10 letras)"
          className="w-full md:w-3/4 mx-auto border p-2 rounded-lg"
        />
      </div>
    )}
  </div>
);


/* ===============================
   ⚙️ COMPONENTE AUXILIAR FIGURA GEOMÉTRICA
   =============================== */
function PasoGeometricFigura({ figura, setFigura }) {
  const figuras = [
    { key: "triangulos", label: "Triángulos", img: "/img/patrones/GeoT.png" },
    { key: "cuadrados", label: "Cuadrados", img: "/img/patrones/GeoC.png" },
    { key: "hexagonos", label: "Hexágonos", img: "/img/patrones/GeoH.png" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {figuras.map((f) => (
        <div
          key={f.key}
          onClick={() => setFigura(f.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden ${
            figura === f.key ? "border-blue-600" : "border-gray-300"
          }`}
        >
          <img src={f.img} alt={f.label} className="w-full h-24 object-cover" />
          <p className="text-center py-2 bg-white font-semibold">{f.label}</p>
        </div>
      ))}
    </div>
  );
}

// En el componente principal FormCamiseta_V3


/* ===============================
   🧩 COMPONENTE PRINCIPAL
   =============================== */
export default function FormCamiseta_V3() {
  const { user } = useAuth();

  // Paso actual y patrón
  const [paso, setPaso] = useState(1);
  const [diseno, setDiseno] = useState("");

  // Colores y propiedades comunes
  const [numColores, setNumColores] = useState(4);
  const [colores, setColores] = useState(["", "", "", "", ""]);
  const [tipoGradiente, setTipoGradiente] = useState("");

  // Propiedades geométrico
  const [figura, setFigura] = useState("");
  const [escala, setEscala] = useState("");
  const [espaciado, setEspaciado] = useState("");
  const [superposicion, setSuperposicion] = useState("");

  // Propiedades para patrón artístico
  const [estiloArtistico, setEstiloArtistico] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [cobertura, setCobertura] = useState("");

  // Propiedades para patrón Rayas
  const [direccion, setDireccion] = useState("");
  const [grosor, setGrosor] = useState("");
  const [numRayas, setNumRayas] = useState("");
  const [coberturaRayas, setCoberturaRayas] = useState("");

  // Propiedades para patrón Camuflaje
  const [paletaCamuflaje, setPaletaCamuflaje] = useState("");
  const [coloresPersonalizados, setColoresPersonalizados] = useState(false);
  const [tamanoCamo, setTamanoCamo] = useState("");
  const [estiloCamo, setEstiloCamo] = useState("");

    // Propiedades para patrón Dos Tonos
  const [division, setDivision] = useState("");
  const [color1TwoTone, setColor1TwoTone] = useState("white");
  const [color2TwoTone, setColor2TwoTone] = useState("black");

  // Sólido
  const [color1, setColor1] = useState("white");
  const [usarColorUnicoCuello, setUsarColorUnicoCuello] = useState(true);
  const [colorCuello, setColorCuello] = useState("black");

  // Patrón Personalizado (Diseño Completo)
  const [tipoFullPrint, setTipoFullPrint] = useState("objects"); // 'objects', 'textures', 'reference'
  const [motifs, setMotifs] = useState("");
  const [colorBaseFP, setColorBaseFP] = useState("");
  const [colorSecFP, setColorSecFP] = useState("");
  const [coloresExtraFP, setColoresExtraFP] = useState(["", ""]);
  const [styleFP, setStyleFP] = useState("");
  const [distributionFP, setDistributionFP] = useState("");
  const [textureType, setTextureType] = useState("");
  const [customTexture, setCustomTexture] = useState("");
  const [descripcionLibreFP, setDescripcionLibreFP] = useState("");
  const [numObjetos, setNumObjetos] = useState(1);
  const [motif1, setMotif1] = useState("");
  const [motif2, setMotif2] = useState("");
  const [coloresObjetos, setColoresObjetos] = useState(["", "", ""]);
  const [numColoresFP, setNumColoresFP] = useState(2);
  
const validarPasoActual = () => {
  const pasoActual = pasosActuales[paso - 1];

  // Validar según el tipo de diseño
  switch (diseno) {
    case "gradient":
      if (paso === 2 && !numColores) {
        toast.warning("Selecciona el número de colores para el degradado.");
        return false;
      }
      if (paso === 3 && colores.some((c, i) => i < numColores && !c)) {
        toast.warning("Selecciona todos los colores requeridos.");
        return false;
      }
      if (paso === 4 && !tipoGradiente) {
        toast.warning("Selecciona un tipo de degradado.");
        return false;
      }
      break;

    case "geometric":
      if (paso === 2 && !numColores) {
        toast.warning("Selecciona el número de colores para el patrón.");
        return false;
      }
      if (paso === 3 && colores.some((c, i) => i < numColores && !c)) {
        toast.warning("Selecciona todos los colores requeridos.");
        return false;
      }
      if (paso === 4 && !figura) {
        toast.warning("Selecciona una figura principal.");
        return false;
      }
      if (paso === 5 && (!escala || !espaciado)) {
        toast.warning("Selecciona una escala y espaciado.");
        return false;
      }
      if (paso === 6 && !superposicion) {
        toast.warning("Selecciona una superposicion.");
        return false;
      }

      break;

    case "abstract":
      if (paso === 2 && !estiloArtistico) {
        toast.warning("Selecciona un estilo artístico.");
        return false;
      }
      if (paso === 3 && !numColores) {
        toast.warning("Selecciona el número de colores para el patrón.");
        return false;
      }
      if (paso === 4 && colores.some((c, i) => i < numColores && !c)) {
        toast.warning("Selecciona todos los colores requeridos.");
        return false;
      }
      if (paso === 5 && !intensidad) {
        toast.warning("Selecciona la intensidad del patrón.");
        return false;
      }
      if (paso === 6 && !cobertura) {
        toast.warning("Selecciona la cobertura del patrón.");
        return false;
      }
      break;

    case "stripes":
      if (paso === 2 && !direccion) {
        toast.warning("Selecciona la dirección de las rayas.");
        return false;
      }
      if (paso === 3 && !grosor) {
        toast.warning("Selecciona el grosor de las rayas.");
        return false;
      }
      if (paso === 4 && !numRayas) {
        toast.warning("Selecciona el número de rayas.");
        return false;
      }
      if (paso === 5 && !coberturaRayas) {
        toast.warning("Selecciona la cobertura de las rayas.");
        return false;
      }
      if (paso === 6 && (!colores[0] || !colores[1])) {
        toast.warning("Selecciona ambos colores para las rayas.");
        return false;
      }
      break;

      case "camouflage":
        // Paso 2: Selección de paleta
        if (paso === 2 && !paletaCamuflaje) {
          toast.warning("Selecciona una paleta de camuflaje.");
          return false;
        }

        // 🔹 Si la paleta es personalizada
        if (paletaCamuflaje === "custom") {
          if (paso === 3) {
            // Validar que los dos primeros colores sean obligatorios
            if (!colores[0] || !colores[1]) {
              toast.warning("Debes seleccionar al menos los colores 1 y 2 (base y manchas principales).");
              return false;
            }

            // Validar que si el usuario selecciona color 4 sin seleccionar el 3, no lo permita
            if (colores[3] && !colores[2]) {
              toast.warning("Completa los colores en orden, no dejes huecos intermedios.");
              return false;
            }
          }

          if (paso === 4 && !tamanoCamo) {
            toast.warning("Selecciona el tamaño del camuflaje.");
            return false;
          }

          if (paso === 5 && !estiloCamo) {
            toast.warning("Selecciona el estilo del camuflaje.");
            return false;
          }
        } 
        // 🔹 Si la paleta es predefinida (forest, desert, urban)
        else {
          if (paso === 3 && !tamanoCamo) {
            toast.warning("Selecciona el tamaño del camuflaje.");
            return false;
          }
          if (paso === 4 && !estiloCamo) {
            toast.warning("Selecciona el estilo del camuflaje.");
            return false;
          }
        }
        break;


    case "two_tone":
      if (paso === 2 && !division) {
        toast.warning("Selecciona un tipo de división.");
        return false;
      }
      if (paso === 3 && (!color1TwoTone || !color2TwoTone)) {
        toast.warning("Selecciona ambos colores.");
        return false;
      }
        break;

    case "solid":
      if (paso === 2 && !color1) {
        toast.warning("Selecciona un color base para la camiseta.");
        return false;
      }
      if (paso === 2 && !usarColorUnicoCuello && !colorCuello) {
        toast.warning("Selecciona un color para el cuello y puños.");
        return false;
      }
      break;

    case "full_print":
      if (tipoFullPrint === "objects") {
        if (paso === 2 && !tipoFullPrint) {
          toast.warning("Selecciona un tipo de diseño completo.");
          return false;
        }
        if (paso === 3 && (!motif1 || (numObjetos === 2 && !motif2))) {
          toast.warning("Completa los campos de objetos.");
          return false;
        }
        if (paso === 4) {
          if (!coloresObjetos[0] || !coloresObjetos[1] || (numObjetos === 2 && !coloresObjetos[2])) {
            toast.warning("Selecciona los colores requeridos.");
            return false;
          }
        }
        if (paso === 5 && (!styleFP || !distributionFP)) {
          toast.warning("Selecciona el estilo y la distribución del diseño completo.");
          return false;
        }
      } else if (tipoFullPrint === "textures") {
        if (paso === 3) {
          if (numColoresFP === 2 && (!coloresExtraFP[0] || !coloresExtraFP[1])) {
            toast.warning("Selecciona el número de colores.");
            return false;
          }
          if (numColoresFP === 3 && (!coloresExtraFP[0] || !coloresExtraFP[1] || !coloresExtraFP[2])) {
            toast.warning("Selecciona el número de colores.");
            return false;
          }
        }
        if (paso === 4) {
          if (!textureType) {
            toast.warning("Selecciona un tipo de textura.");
            return false;
          }
          if (textureType === "custom" && !customTexture) {
            toast.warning("Describe la textura personalizada.");
            return false;
          }
        }
      }
      break;
  }

  // Validar opciones generales (último paso)
  if (pasoActual === pasoOpciones) {
    if (!cuello || !manga || !tela || !genero) {
      toast.warning("Completa todas las opciones generales antes de continuar.");
      return false;
    }
  }

  return true;
};



 useEffect(() => {
  // Al cambiar de diseño, limpiar colores específicos de los demás patrones
  if (diseno !== "two_tone") {
    setColor1TwoTone("");
    setColor2TwoTone("");
  }
  if (diseno !== "solid") {
    setColor1("white");
    setColorCuello("black");
  }
  if (diseno !== "full_print") {
    setTextureType("");
    setCustomTexture("");
  }
}, [diseno]);


  // Actualizar motifs automáticamente cuando cambian los motivos individuales
  useEffect(() => {
    if (numObjetos === 1) {
      setMotifs(motif1);
    } else if (numObjetos === 2) {
      setMotifs(`${motif1} ${motif2}`.trim());
    }
  }, [motif1, motif2, numObjetos]);

  // Opciones generales
  const [cuello, setCuello] = useState("");
  const [manga, setManga] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");

  // Imagen y estado
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);


  // Reset de pasos/estados cuando cambia de patrón
  useEffect(() => {
    if (!diseno) return;
    setPaso(2);
    setColorCuello("");
    setTipoGradiente("");
    setColores(["", "", "", "", ""]);
    setFigura("");
    setEscala("");
    setEspaciado("");
    setSuperposicion("");
    setTipoFullPrint("objects");
    setMotif1("");
    setMotif2("");
    setStyleFP("");
    setDistributionFP("");
    setTextureType("");
    setCustomTexture("");
    setColoresObjetos(["", "", ""]);
    setColoresExtraFP(["", ""]);
    setCuello("");
    setManga("");
    setTela("");
    setGenero("");
    if (diseno === "gradient") setNumColores(2);
    if (diseno === "geometric") setNumColores(3);
    if (diseno === "abstract") setNumColores(2);
    if (diseno === "stripes") setNumColores(2);
    if (diseno === "camouflage") setNumColores(5);
    if (diseno === "two_tone") setNumColores(2);
      }, [diseno]);

  const handleColorChange = (index, color) => {
    setColores((prev) => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  /* ===============================
     📤 Envío de datos al backend
     =============================== */
  const handleGenerar = async () => {
    setLoading(true);
    setImagen(null);

    const validColors = coloresBase.map(c => c.en);
    if (!validColors.includes(color1)) setColor1("white");
    if (!validColors.includes(colorCuello)) setColorCuello("black");
    if (!validColors.includes(color1TwoTone)) setColor1TwoTone("white");
    if (!validColors.includes(color2TwoTone)) setColor2TwoTone("black");

    let payload = {
      userId: user?.id,
      categoria_id: "camiseta_ia_v3",
      diseno,
      colorCuello,
      numColores,
      colores: colores.slice(0, numColores),
      tipoGradiente: diseno === "gradient" ? tipoGradiente : undefined,
      figura: diseno === "geometric" ? figura : undefined,
      escala: diseno === "geometric" ? escala : undefined,
      espaciado: diseno === "geometric" ? espaciado : undefined,
      superposicion: diseno === "geometric" ? superposicion : undefined,
      estiloArtistico: diseno === "abstract" ? estiloArtistico : undefined,
      intensidad: diseno === "abstract" ? intensidad : undefined,
      cobertura: diseno === "abstract" ? cobertura : undefined,
      direccion: diseno === "stripes" ? direccion : undefined,
      grosor: diseno === "stripes" ? grosor : undefined,
      numRayas: diseno === "stripes" ? numRayas : undefined,
      coberturaRayas: diseno === "stripes" ? coberturaRayas : undefined,
      tamanoCamo: diseno === "camouflage" ? tamanoCamo : undefined,
      estiloCamo: diseno === "camouflage" ? estiloCamo : undefined,
      paletaCamuflaje: diseno === "camouflage" ? paletaCamuflaje : undefined,
      division: diseno === "two_tone" ? division : undefined,
      color1TwoTone: diseno === "two_tone" ? color1TwoTone : undefined,
      color2TwoTone: diseno === "two_tone" ? color2TwoTone : undefined,
      color1: diseno === "solid" ? color1 : undefined,
      usarColorUnicoCuello: diseno === "solid" ? usarColorUnicoCuello : undefined,
      colorCuello: diseno === "solid" ? colorCuello : undefined,
      tipoFullPrint: diseno === "full_print" ? tipoFullPrint : undefined,
      motifs: diseno === "full_print" ? motifs : undefined,
      colorBaseFP: diseno === "full_print" ? colorBaseFP : undefined,
      colorSecFP: diseno === "full_print" ? colorSecFP : undefined,
      coloresExtraFP:
        diseno === "full_print"
          ? tipoFullPrint === "objects"
            ? coloresObjetos
            : coloresExtraFP
          : undefined,
      styleFP: diseno === "full_print" ? styleFP : undefined,
      distributionFP: diseno === "full_print" ? distributionFP : undefined,
      textureType: diseno === "full_print" ? textureType : undefined,
      customTexture: diseno === "full_print" ? customTexture : undefined,
      descripcionLibreFP: diseno === "full_print" ? descripcionLibreFP : undefined,
      cuello,
      manga,
      tela,
      genero,
    };
    
    Object.keys(payload).forEach(
      (k) => (payload[k] === "" || payload[k] === undefined) && delete payload[k]
    );

    try {
      const res = await fetch(`${API_URL}/api/ia/generar_camiseta_v3`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Estado del servidor:", res.status);
      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      if (data.imageUrl) setImagen(data.imageUrl);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     🧱 PASOS COMUNES
     =============================== */
  const paso1 = (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">1. Selecciona el patrón base</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
        {/* Degradado */}
        <div
          onClick={() => setDiseno("gradient")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "gradient" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/Degradado.png" alt="Degradado" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Degradado</p>
        </div>

        {/* Geométrico */}
        <div
          onClick={() => setDiseno("geometric")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "geometric" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/Geométrico.png" alt="Geométrico" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Geométrico</p>
        </div>

        {/* Artístico */}
        <div
          onClick={() => setDiseno("abstract")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "abstract" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/Abstracto.png" alt="Artístico" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Artístico</p>
        </div>

        {/* Rayas */}
        <div
          onClick={() => setDiseno("stripes")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "stripes" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/RayasVerticales.png" alt="Rayas" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Rayas</p>
        </div>
        
        {/* Camuflaje */}
        <div
          onClick={() => setDiseno("camouflage")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "camouflage" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/Camuflaje.png" alt="Camuflaje" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Camuflaje</p>
        </div>

        {/* Dos Tonos */}
        <div
          onClick={() => setDiseno("two_tone")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "two_tone" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/DosTonos.png" alt="Dos Tonos" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Dos Tonos</p>
        </div>
        
        {/* Sólido */}
        <div
          onClick={() => setDiseno("solid")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "solid" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/Liso.png" alt="Sólido" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Sólido</p>
        </div>
        
        {/* Full Print */}
        <div
          onClick={() => setDiseno("full_print")}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            diseno === "full_print" ? "border-blue-600" : "border-transparent hover:border-gray-300"
          }`}
        >
          <img src="/img/patrones/DiseñoCompleto.png" alt="Full Print" className="w-full h-32 object-cover" />
          <p className="py-2 bg-white font-semibold">Personalizado</p>
        </div>
      </div>
    </div>
  );
  /* ===============================
     🧩 BLOQUE: DEGRADADO
     =============================== */
  const pasosGradient = [
    paso1,
    <div key="ncol" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">¿Cuántos colores tendrá el degradado?</h2>
      <div className="grid grid-cols-3 gap-6 justify-center">
        {[2, 3, 4].map((n) => (
          <div
            key={n}
            onClick={() => setNumColores(n)}
            className={`cursor-pointer p-4 rounded-lg shadow-md border-4 ${
              numColores === n ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={`/img/patrones/Color${n}.png`} alt={`${n} colores`} className="w-full h-24 object-cover rounded-md mb-2" />
            <p className="font-semibold">{n} colores</p>
          </div>
        ))}
      </div>
    </div>,
    <div key="col" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">Selecciona los colores del degradado</h2>
      {[...Array(numColores)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-semibold">Color {i + 1}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {coloresBase.map((c) => (
              <div
                key={c.en}
                onClick={() => handleColorChange(i, c.en)}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  colores[i] === c.en ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>,
    <div key="tipo" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">Selecciona el tipo de degradado</h2>
      <div className="grid grid-cols-2 gap-6 justify-center">
        {[
          { key: "linear", label: "Lineal", img: "/img/patrones/Degradado2.png" },
          { key: "radial", label: "Radial", img: "/img/patrones/DegradadoRadial.png" },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setTipoGradiente(opt.key)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
              tipoGradiente === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
            }`}
          >
            <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="py-2 bg-white font-semibold">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>,
  ];

  /* ===============================
     🧩 BLOQUE: GEOMÉTRICO
     =============================== */
  const pasosGeometric = [
    paso1,
    <div key="ncol" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">¿Cuántos colores tendrá el patrón?</h2>
      <div className="grid grid-cols-3 gap-6 justify-center">
        {[3, 4, 5].map((n) => (
          <div
            key={n}
            onClick={() => setNumColores(n)}
            className={`cursor-pointer p-4 rounded-lg shadow-md border-4 ${
              numColores === n ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={`/img/patrones/Color${n}.png`} alt={`${n} colores`} className="w-full h-24 object-cover rounded-md mb-2" />
            <p className="font-semibold">{n} colores</p>
          </div>
        ))}
      </div>
    </div>,
    <div key="col" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">Selecciona los colores del patrón</h2>
      <p className="text-sm text-gray-500 mb-6">
        <strong>Color 1</strong> = base de la camiseta. <strong>Color 2</strong> = color principal de las figuras.
        <br /> <strong>Color 3–5</strong> = colores de apoyo que se mezclan con las figuras.
      </p>
      {[...Array(numColores)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-semibold">
            {i === 0 ? "Color 1 (Base)" : i === 1 ? "Color 2 (Figuras principales)" : `Color ${i + 1} (Figuras apoyo)`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {coloresBase.map((c) => (
              <div
                key={c.en}
                onClick={() => handleColorChange(i, c.en)}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  colores[i] === c.en ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>,
    <div key="fig" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">Selecciona la figura principal</h2>
      <PasoGeometricFigura figura={figura} setFigura={setFigura} />
    </div>,
    <div key="esc" className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl font-bold">Ajusta escala y espaciado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Escala</h3>
          <p className="text-sm text-gray-500 mb-6">
            <strong>Baja</strong> = Figuras pequeñas
            <br /> <strong>Alta</strong> = Figuras grandes
          </p>
          {["Pequeña", "Grande"].map((opt) => (
            <button
              key={opt}
              onClick={() => setEscala(opt.toLowerCase())}
              className={`px-4 py-2 m-1 rounded-lg border ${
                escala === opt.toLowerCase() ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {opt === "Pequeña" ? "🔹 Baja" : "🔸 Alta"}
            </button>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Espaciado</h3>
          <p className="text-sm text-gray-500 mb-6">
            <strong>Ajustado</strong> = Figuras unidas
            <br /> <strong>Amplio</strong> = Espacio entre figuras
          </p>
          {["Ajustado", "Amplio"].map((opt) => (
            <button
              key={opt}
              onClick={() => setEspaciado(opt.toLowerCase())}
              className={`px-4 py-2 m-1 rounded-lg border ${
                espaciado === opt.toLowerCase() ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {opt === "Ajustado" ? "🔹 Ajustado" : "🔸 Amplio"}
            </button>
          ))}
        </div>
      </div>
    </div>,

    <div key="sup" className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
      <h2 className="text-xl mb-6 font-bold">Superposición de figuras</h2>
       <div className="grid grid-cols-2 gap-6 justify-center">
      {[
        { key: "flat", label: "Sin superposición", img: "/img/patrones/Geometrico3.png" },
        { key: "layered", label: "Ligeramente superpuestas", img: "/img/patrones/Geometrico4.png" },
        { key: "fragmented", label: "Fragmentado", img: "/img/patrones/Geometrico5.png" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setSuperposicion(opt.key)}
          className={`cursor-pointer rounded-xl overflow-hidden border-4 transition ${
            superposicion === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
            <p className="py-2 bg-white font-semibold">{opt.label}</p>
        </div>
      ))}
      </div>
    </div>,
  ];

  /* ===============================
   🧩 BLOQUE: ARTÍSTICO / ABSTRACTO
   =============================== */
const pasosAbstract = [paso1,
  // Paso 2: Seleccionar estilo artístico
  <div key="estilo" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Selecciona el estilo artístico</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: "brush strokes", label: "Pinceladas", desc: "Trazos suaves o expresivos", img: "/img/patrones/Pinceladas.png" },
        { key: "paint splatter", label: "Salpicaduras", desc: "Transmite energía o dinamismo", img: "/img/patrones/Salpicaduras.png" },
        { key: "fluid art", label: "Fluido", desc: "Tipo acuarela, transiciones suaves", img: "/img/patrones/Fluidos.png" },
        { key: "smoke effect", label: "Humo", desc: "Aspecto etéreo o difuminado", img: "/img/patrones/Humo.png" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setEstiloArtistico(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            estiloArtistico === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <div className="p-2 bg-white">
            <p className="font-semibold">{opt.label}</p>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>,
      <div key="ncol" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">¿Cuántos colores tendrá el patrón?</h2>
      <div className="grid grid-cols-3 gap-6 justify-center">
        {[2, 3, 4,].map((n) => (
          <div
            key={n}
            onClick={() => setNumColores(n)}
            className={`cursor-pointer p-4 rounded-lg shadow-md border-4 ${
              numColores === n ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={`/img/patrones/Color${n}.png`} alt={`${n} colores`} className="w-full h-24 object-cover rounded-md mb-2" />
            <p className="font-semibold">{n} colores</p>
          </div>
        ))}
      </div>
    </div>,

    <div key="col" className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">Selecciona los colores del patrón</h2>
      <p className="text-sm text-gray-500 mb-6">
        <strong>Color 1</strong> = base de la camiseta. <strong>Color 2</strong> = color principal de las figuras.
        <br /> <strong>Color 3–5</strong> = colores de apoyo que se mezclan con las figuras.
      </p>
      {[...Array(numColores)].map((_, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-semibold">
            {i === 0 ? "Color 1 (Base)" : i === 1 ? "Color 2 (Figuras principales)" : `Color ${i + 1} (Figuras apoyo)`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {coloresBase.map((c) => (
              <div
                key={c.en}
                onClick={() => handleColorChange(i, c.en)}
                className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                  colores[i] === c.en ? "border-blue-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>,


  <div key="intensidad" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">¿Qué tan marcado quieres el diseño?</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { key: "subtle", label: "Sutil", desc: "Apenas visible, casi difuminado" },
        { key: "bold", label: "Marcado", desc: "Fuerte contraste, detalles nítidos" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setIntensidad(opt.key)}
          className={`p-4 w-56 border-4 rounded-xl cursor-pointer ${
            intensidad === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <p className="font-semibold">{opt.label}</p>
          <p className="text-sm text-gray-500">{opt.desc}</p>
        </div>
      ))}
    </div>
  </div>,


  <div key="cobertura" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">¿Dónde se aplica el diseño?</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { key: "full", label: "Completa", desc: "Cubre toda la camiseta (torso y mangas)" },
        { key: "partial", label: "Difusa", desc: "Solo algunas zonas dispersas" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setCobertura(opt.key)}
          className={`p-4 w-56 border-4 rounded-xl cursor-pointer ${
            cobertura === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <p className="font-semibold">{opt.label}</p>
          <p className="text-sm text-gray-500">{opt.desc}</p>
        </div>
      ))}
    </div>
  </div>,
];

/* ===============================
   🧩 BLOQUE: RAYAS
   =============================== */
const pasosStripes = [paso1,
  // Paso 2: Dirección de las rayas
  <div key="direccion" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Dirección de las rayas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          key: "horizontal",
          label: "Horizontal",
          desc: "Estilo clásico tipo fútbol, transmite estabilidad.",
          img: "/img/patrones/Horizontal.png",
        },
        {
          key: "vertical",
          label: "Vertical",
          desc: "Diseño moderno tipo básquet, sensación de elongación.",
          img: "/img/patrones/Vertical.png",
        },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setDireccion(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            direccion === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <div className="p-2 bg-white">
            <p className="font-semibold">{opt.label}</p>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>,

  // Paso 4: Grosor de las rayas
  <div key="grosor" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Selecciona el grosor de las rayas</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { key: "thin", label: "Delgadas", desc: "Estilo clásico o minimalista." },
        { key: "thick", label: "Gruesas", desc: "Diseño llamativo o moderno." },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setGrosor(opt.key)}
          className={`p-4 w-56 border-4 rounded-xl cursor-pointer ${
            grosor === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <p className="font-semibold">{opt.label}</p>
          <p className="text-sm text-gray-500">{opt.desc}</p>
        </div>
      ))}
    </div>
  </div>,

  // Paso 5: Número de rayas
  <div key="numRayas" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Número de rayas visibles</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[3, 5, 7, "random"].map((opt) => (
        <button
          key={opt}
          onClick={() => setNumRayas(opt)}
          className={`px-6 py-3 rounded-lg border ${
            numRayas === opt ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          {opt === "random" ? "Aleatorio" : `${opt} rayas`}
        </button>
      ))}
    </div>
  </div>,

  // Paso 6: Cobertura
  <div key="cobertura" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Cobertura del diseño</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { key: "full", label: "Toda la camiseta", desc: "Aplica en torso y mangas.",  img: "/img/patrones/RayaTodos.png" },
        { key: "chest", label: "Solo pecho", desc: "Diseño frontal.", img: "/img/patrones/RayaPecho.png" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setCoberturaRayas(opt.key)}
          className={`p-4 w-56 border-4 rounded-xl cursor-pointer ${
            coberturaRayas === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <p className="font-semibold">{opt.label}</p>
          <p className="text-sm text-gray-500">{opt.desc}</p>
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
        </div>
      ))}
    </div>
  </div>,

  // Paso 7: Colores
  <div key="colores" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-2">Selecciona los colores</h2>
    <p className="text-sm text-gray-500 mb-6">
      Color 1 = fondo base de la camiseta. <br /> Color 2 = color principal de las rayas.
    </p>
    {[...Array(2)].map((_, i) => (
      <div key={i} className="mb-4">
        <p className="mb-2 font-semibold">{i === 0 ? "Color 1 (Base)" : "Color 2 (Rayas)"}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {coloresBase.map((c) => (
            <div
              key={c.en}
              onClick={() => handleColorChange(i, c.en)}
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                colores[i] === c.en ? "border-blue-600" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>,
];

/* ===============================
   🧩 BLOQUE: CAMUFLAJE
   =============================== */
const pasosCamouflage = [paso1,
  // Paso 2: Paleta predefinida o personalizada
  <div key="paleta" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Selecciona la paleta de camuflaje</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: "forest", label: "Bosque", desc: "Verde oliva + marrón + negro", img: "/img/patrones/CamuflajeBosque.png" },
        { key: "desert", label: "Desierto", desc: "Beige + marrón claro", img: "/img/patrones/CamuflajeDesierto.png" },
        { key: "urban", label: "Urbano", desc: "Gris + blanco + negro", img: "/img/patrones/CamuflajeUrbano.png" },
        { key: "custom", label: "Personalizado", desc: "Elige tus propios colores", img: "/img/patrones/CamuflajePersonalizado.png" },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => {
            setPaletaCamuflaje(opt.key);
            setColoresPersonalizados(opt.key === "custom");
          }}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            paletaCamuflaje === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <div className="p-2 bg-white">
            <p className="font-semibold">{opt.label}</p>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>,

  // Paso 4: Colores personalizados (solo si selecciona “custom”)
  coloresPersonalizados
    ? <div key="colores" className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-2">Selecciona los colores del camuflaje</h2>
        <p className="text-sm text-gray-500 mb-6">
          Color 1 = base general · Color 2 = manchas principales · Color 3–4 = colores complementarios.
        </p>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-4">
            <p className="mb-2 font-semibold">
              {i === 0
                ? "Color 1 (Base)"
                : i === 1
                ? "Color 2 (Manchas principales)"
                : `Color ${i + 1} (Complementario opcional)`}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {coloresBase.map((c) => (
                <div
                  key={c.en}
                  onClick={() => handleColorChange(i, c.en)}
                  className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                    colores[i] === c.en ? "border-blue-600" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    : null,

  // Paso 5: Tamaño o escala del patrón
  <div key="tamano" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Tamaño del patrón</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { key: "small", label: "Pequeño", desc: "Manchas finas, estilo micro camo o texturizado." },
        { key: "large", label: "Grande", desc: "Manchas amplias, estilo militar clásico o moderno." },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setTamanoCamo(opt.key)}
          className={`p-4 w-56 border-4 rounded-xl cursor-pointer ${
            tamanoCamo === opt.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <p className="font-semibold">{opt.label}</p>
          <p className="text-sm text-gray-500">{opt.desc}</p>
        </div>
      ))}
    </div>
  </div>,

  // Paso 6: Estilo del camuflaje
  <div key="estilo" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Estilo del camuflaje</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          key: "classic",
          label: "Clásico",
          desc: "Manchas redondeadas, bordes suaves, estilo militar estándar.",
          img: "/img/patrones/CamuflajeBosque.png",
        },
        {
          key: "digital",
          label: "Digital / Pixelado",
          desc: "Hecho con cuadrados o píxeles, estilo uniforme moderno.",
          img: "/img/patrones/CamuflajePixel.png",
        },
        {
          key: "fragmented",
          label: "Fragmentado moderno",
          desc: "Formas angulares y geométricas, aspecto futurista.",
          img: "/img/patrones/CamuflajeFragmentado.png",
        },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setEstiloCamo(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            estiloCamo === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <div className="p-2 bg-white">
            <p className="font-semibold">{opt.label}</p>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>,
];


/* ===============================
   🧩 BLOQUE: DOS TONOS
   =============================== */
const pasosTwoTone = [
  paso1, // Selección de patrón

  // Paso 2: Tipo de división
  <div key="division" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-6">Tipo de división de color</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {[
        {
          key: "horizontal",
          label: "Horizontal",
          desc: "Color 1 parte superior (cuello, hombros) · Color 2 parte inferior.",
          img: "/img/patrones/DosTonosHorizontal.png",
        },
        {
          key: "vertical",
          label: "Vertical",
          desc: "Color 1 lado izquierdo · Color 2 lado derecho.",
          img: "/img/patrones/DosTonosVertical.png",
        },
        {
          key: "diagonal",
          label: "Diagonal",
          desc: "Color 1 arriba-izquierda · Color 2 abajo-derecha.",
          img: "/img/patrones/DosTonosDiagonal.png",
        },
        {
          key: "sleeves_torso",
          label: "Mangas y torso",
          desc: "Torso color 1 · mangas y cuello color 2.",
          img: "/img/patrones/DosTonosMangas.png",
        },
      ].map((opt) => (
        <div
          key={opt.key}
          onClick={() => setDivision(opt.key)}
          className={`cursor-pointer border-4 rounded-xl overflow-hidden transition ${
            division === opt.key ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"
          }`}
        >
          <img src={opt.img} alt={opt.label} className="w-full h-32 object-cover" />
          <div className="p-2 bg-white">
            <p className="font-semibold">{opt.label}</p>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>,

  // Paso 3: Selección de colores principales
  <div key="colores" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-4">Selecciona los dos colores</h2>
    <p className="text-gray-500 text-sm mb-6">
      Color 1 y Color 2 se aplican según el tipo de división seleccionado.
    </p>
    {[1, 2].map((n) => (
      <div key={n} className="mb-4">
        <p className="mb-2 font-semibold">Color {n}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {coloresBase.map((c) => (
            <div
              key={c.en}
              onClick={() => {
                if (n === 1) {
                  setColor1TwoTone(c.en);
                } else {
                  setColor2TwoTone(c.en);
                }
              }}
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                (n === 1 ? color1TwoTone : color2TwoTone) === c.en
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>,
];

/* ===============================
   🧩 BLOQUE: SÓLIDO
   =============================== */
const pasosSolid = [
  paso1,

  // Paso 2: Color base general
  <div key="colorBase" className="bg-white p-6 rounded-xl shadow-md text-center">
    <h2 className="text-xl font-bold mb-4">Color base de la camiseta</h2>
    <p className="text-gray-500 text-sm mb-6">
      Este color se aplicará al torso y mangas.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      {coloresBase.map((c) => (
        <div
          key={c.en}
          onClick={() => setColor1(c.en)}
          className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
            color1 === c.en ? "border-blue-600" : "border-gray-300"
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
    <label className="flex items-center justify-center gap-2 mb-4 mt-6">
      <input
        type="checkbox"
        checked={usarColorUnicoCuello}
        onChange={() => setUsarColorUnicoCuello(!usarColorUnicoCuello)}
      />
      <span className="font-medium">
        Cuello puños del mismo color
      </span>
    </label>
    {!usarColorUnicoCuello && (
      <div>
        <h3 className="font-semibold mb-2">Selecciona color para cuello y puños</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {coloresBase.map((c) => (
            <div
              key={c.en}
              onClick={() => setColorCuello(c.en)}
              className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                colorCuello === c.en ? "border-blue-600" : "border-gray-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    )}
  </div>,
];

/* ===============================
   🧩 BLOQUE: FULL PRINT (Personalizado)
   =============================== */
const pasosFullPrint = useMemo(() => {
  return [
    paso1,
    <BloqueTipoDiseno 
      key="tipo" 
      tipoFullPrint={tipoFullPrint} 
      setTipoFullPrint={setTipoFullPrint} 
    />,
    ...(tipoFullPrint === "objects"
      ? [
          <BloqueObjetosPaso1
            key="obj1"
            numObjetos={numObjetos}
            setNumObjetos={setNumObjetos}
            motif1={motif1}
            setMotif1={setMotif1}
            motif2={motif2}
            setMotif2={setMotif2}
          />,
          <BloqueObjetosPaso2 
            key="obj2"
            numObjetos={numObjetos}
            coloresObjetos={coloresObjetos}
            setColoresObjetos={setColoresObjetos}
            coloresBase={coloresBase}
          />,
          <BloqueObjetosPaso3 
            key="obj3"
            styleFP={styleFP}
            setStyleFP={setStyleFP}
            distributionFP={distributionFP}
            setDistributionFP={setDistributionFP}
          />
        ]
      : tipoFullPrint === "textures"
      ? [
          <BloqueTexturasPaso1 
            key="tex1"
            numColoresFP={numColoresFP}
            setNumColoresFP={setNumColoresFP}
            coloresExtraFP={coloresExtraFP}
            setColoresExtraFP={setColoresExtraFP}
            coloresBase={coloresBase}
          />,
          <BloqueTexturasPaso2 
            key="tex2"
            textureType={textureType}
            setTextureType={setTextureType}
            customTexture={customTexture}
            setCustomTexture={setCustomTexture}
          />
        ]
      : [])
  ];
}, [
  tipoFullPrint, 
  numObjetos, 
  motif1, 
  motif2, 
  coloresObjetos, 
  styleFP, 
  distributionFP, 
  numColoresFP, 
  coloresExtraFP, 
  textureType, 
  customTexture,
  coloresBase,
  setTipoFullPrint,
  setNumObjetos,
  setMotif1,
  setMotif2,
  setColoresObjetos,
  setStyleFP,
  setDistributionFP,
  setNumColoresFP,
  setColoresExtraFP,
  setTextureType,
  setCustomTexture
]);

/* ===============================
   🧩 OPCIONES GENERALES (COMÚN)
   =============================== */
const pasoOpciones = (
  <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-6">
    <h2 className="text-xl font-bold mb-4">Opciones generales</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      {/* Cuello */}
      <div>
        <h3 className="font-semibold mb-2 text-center">Cuello</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { key: "Redondo", img: "/img/patrones/CuelloRedondo.png" },
            { key: "En V", img: "/img/patrones/CuelloV.png" },
            { key: "Polo", img: "/img/patrones/CuelloPolo.png" },
          ].map((op) => (
            <div
              key={op.key}
              onClick={() => setCuello(op.key)}
              className={`cursor-pointer p-2 rounded-lg border-4 w-28 ${
                cuello === op.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={op.img}
                alt={op.key}
                className="w-full h-20 object-cover rounded-md mb-1"
              />
              <p className="text-center font-medium">{op.key}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manga */}
      <div>
        <h3 className="font-semibold mb-2 text-center">Manga</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { key: "Corta", img: "/img/patrones/MangaCorta.png" },
            { key: "Larga", img: "/img/patrones/MangaLarga.png" },
          ].map((op) => (
            <div
              key={op.key}
              onClick={() => setManga(op.key)}
              className={`cursor-pointer p-2 rounded-lg border-4 w-28 ${
                manga === op.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={op.img}
                alt={op.key}
                className="w-full h-20 object-cover rounded-md mb-1"
              />
              <p className="text-center font-medium">{op.key}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tela */}
      <div>
        <h3 className="font-semibold mb-2 text-center">Tela</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { key: "Algodón", img: "/img/patrones/Algodon.png" },
            { key: "Poliéster", img: "/img/patrones/Poliester.png" },
            { key: "Mezcla Algodón/Poliéster", img: "/img/patrones/Mezcla.png" },
          ].map((op) => (
            <div
              key={op.key}
              onClick={() => setTela(op.key)}
              className={`cursor-pointer p-2 rounded-lg border-4 w-36 ${
                tela === op.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={op.img}
                alt={op.key}
                className="w-full h-20 object-cover rounded-md mb-1"
              />
              <p className="text-center text-sm font-medium">{op.key}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Género */}
      <div>
        <h3 className="font-semibold mb-2 text-center">Género</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { key: "Hombre", img: "/img/patrones/Hombre.png" },
            { key: "Mujer", img: "/img/patrones/Mujer.png" },
            { key: "Unisex", img: "/img/patrones/Unisex.png" },
          ].map((op) => (
            <div
              key={op.key}
              onClick={() => setGenero(op.key)}
              className={`cursor-pointer p-2 rounded-lg border-4 w-28 ${
                genero === op.key ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img
                src={op.img}
                alt={op.key}
                className="w-full h-20 object-cover rounded-md mb-1"
              />
              <p className="text-center font-medium">{op.key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="pt-6">
      <button
        onClick={(e) => {
          e.preventDefault();
          if (!cuello || !manga || !tela || !genero) {
            toast.warning("Por favor completa todas las opciones generales antes de generar la camiseta.");
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
        {loading ? "Generando..." : "Generar Camiseta"}
      </button>
    </div>
  </div>
);


  /* ===============================
     🧭 CONTROL DE PASOS
     =============================== */
  let pasosActuales = [];
  if (diseno === "gradient") pasosActuales = [...pasosGradient, pasoOpciones];
  else if (diseno === "geometric") pasosActuales = [...pasosGeometric, pasoOpciones];
  else if (diseno === "abstract") pasosActuales = [...pasosAbstract, pasoOpciones];
  else if (diseno === "stripes") pasosActuales = [...pasosStripes, pasoOpciones];
  else if (diseno === "camouflage") pasosActuales = [...pasosCamouflage, pasoOpciones];
  else if (diseno === "two_tone") pasosActuales = [...pasosTwoTone, pasoOpciones];
  else if (diseno === "solid") pasosActuales = [...pasosSolid, pasoOpciones];
  else if (diseno === "full_print") pasosActuales = [...pasosFullPrint, pasoOpciones];
  else pasosActuales = [paso1];

  // Filtrar pasos nulos o undefined
  const pasosActualesSinVacios = pasosActuales.filter(Boolean);

  /* ===============================
     🧭 RENDER PRINCIPAL
     =============================== */
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {imagen ? (
          <div className="text-center">
            <p className="text-green-600 font-bold mb-4">✅ Camiseta generada con éxito</p>
            <img src={imagen} alt="Camiseta generada" className="mx-auto rounded-lg shadow-lg w-80" />
          </div>
        ) : (
          <>
            {pasosActualesSinVacios[paso - 1]}

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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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
