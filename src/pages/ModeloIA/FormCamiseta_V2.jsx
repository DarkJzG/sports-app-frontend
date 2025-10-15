// src/pages/ModeloIA/FormCamiseta_V2.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormCamiseta_V2() {
  const { user } = useAuth();
  const location = useLocation();

  const categoria_id = location.state?.categoria_id || "dummy"; // 🔹 ID categoría (dummy si no viene)
  const categoria_prd = "camiseta_v2";

  const [paso, setPaso] = useState(1);

  // Datos seleccionados
  const [diseno, setDiseno] = useState("");
  const [opcionesDiseno, setOpcionesDiseno] = useState({});
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [cuello, setCuello] = useState("");
  const [manga, setManga] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");

  // Resultado
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Opciones ---
  const patrones = [
    { key: "gradient", es: "Degradado", en: "gradient", img: "/img/patrones/Degradado.png" },
    { key: "heather", es: "Moteado", en: "heather", img: "/img/patrones/Moteado.png" },
    { key: "geometric", es: "Geométrico", en: "geometric", img: "/img/patrones/Geométrico.png" },
    { key: "abstract", es: "Abstracto", en: "abstract", img: "/img/patrones/Abstracto.png" },
    { key: "solid", es: "Liso", en: "solid", img: "/img/patrones/Liso.png" },
    { key: "stripes", es: "Rayas", en: "stripes", img: "/img/patrones/RayasHorizontales.png" },
    { key: "camouflage", es: "Camuflaje", en: "camouflage", img: "/img/patrones/Camuflaje.png" },
    { key: "two_tone", es: "Dos Tonos", en: "two_tone", img: "/img/patrones/DosTonos.png" },
    { key: "full_print", es: "Diseño Completo", en: "full_print", img: "/img/patrones/DiseñoCompleto.png" },
  ];

  // === Campos/controles reusables ===
    const PATTERN_SCHEMAS = {
        gradient: {
        requiresSecondaryColor: true,
        allowExtraColors: false,
        fields: [
            { key: 'style', label: 'Tipo de degradado', type: 'select', options: [
            { label: 'Lineal', value: 'linear' },
            { label: 'Radial', value: 'radial' }
            //Borrar lineas horizontales
            ], default: 'linear' },
            { key: 'direction', label: 'Dirección', type: 'select', options: [
            { label: 'Vertical', value: 'vertical' , img: '/img/opciones/degradado_vertical.png' },
            { label: 'Horizontal', value: 'horizontal' , img: '/img/opciones/degradado_horizontal.png' },
            { label: 'Diagonal', value: 'diagonal' , img: '/img/opciones/degradado_diagonal.png' }
            ], default: 'vertical' },
            { key: 'softness', label: 'Suavidad de transición', type: 'select', options: [
            { label: 'Suave', value: 'soft' },
            { label: 'Media', value: 'medium' },
            { label: 'Fuerte', value: 'hard' }
            ], default: 'medium' },
        ]
        },
    
        heather: {
        requiresSecondaryColor: true, 
        allowExtraColors: false,
        fields: [
            { key: 'density', label: 'Densidad', type: 'select', options: [
            { label: 'Ligera', value: 'light' },
            { label: 'Media', value: 'medium' },
            { label: 'Alta', value: 'heavy' }
            ], default: 'medium' },
            { key: 'contrast', label: 'Contraste', type: 'select', options: [
            { label: 'Bajo', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' }
            ], default: 'medium' },
            { key: 'grain', label: 'Grano/Trama', type: 'select', options: [
            { label: 'Fino', value: 'fine' },
            { label: 'Medio', value: 'regular' },
            { label: 'Grueso', value: 'coarse' }
            ], default: 'regular' },
        ]
        },
    
        geometric: {
        requiresSecondaryColor: true,
        allowExtraColors: true,
        fields: [
            { key: 'shape', label: 'Figura', type: 'select', options: [
            { label: 'Triángulos', value: 'triangles' },
            { label: 'Cuadrados', value: 'squares' },
            { label: 'Hexágonos', value: 'hexagons' },
            { label: 'Chevrons', value: 'chevrons' }
            ], default: 'triangles' },
            { key: 'scale', label: 'Escala', type: 'select', options: [
            { label: 'Pequeña', value: 'small' },
            { label: 'Media', value: 'medium' },
            { label: 'Grande', value: 'large' }
            ], default: 'medium' },
            { key: 'spacing', label: 'Espaciado', type: 'select', options: [
            { label: 'Ajustado', value: 'tight' },
            { label: 'Regular', value: 'regular' },
            { label: 'Amplio', value: 'loose' }
            ], default: 'regular' },
            { key: 'alignment', label: 'Alineación', type: 'select', options: [
            { label: 'Centrado', value: 'centered' },
            { label: 'Desfasado', value: 'offset' }
            ], default: 'centered' },
            { key: 'layering', label: 'Superposición', type: 'select', options: [
            { label: 'Sin superposición', value: 'flat, non-overlapping' },
            { label: 'Ligeramente superpuesto', value: 'slightly overlapping, layered' },
            { label: 'Fragmentado y roto', value: 'shattered, fragmented, dynamic' }
            ], default: 'flat, non-overlapping' },
        
        ]
        },
    
        abstract: {
        requiresSecondaryColor: true,
        allowExtraColors: true,
        fields: [
            { key: 'style', label: 'Estilo', type: 'select', options: [
            { label: 'Pinceladas', value: 'brush strokes' },
            { label: 'Salpicaduras', value: 'paint splatter' },
            { label: 'Fluido', value: 'fluid' },
            { label: 'Humo', value: 'smoke' },
            { label: 'Orgánico', value: 'organic' }
            ], default: 'paint splatter' },
            { key: 'intensity', label: 'Intensidad', type: 'select', options: [
            { label: 'Sutil', value: 'subtle' },
            { label: 'Equilibrado', value: 'balanced' },
            { label: 'Marcado', value: 'bold' }
            ], default: 'balanced' },
            { key: 'coverage', label: 'Cobertura', type: 'select', options: [
                { label: 'Completa', value: 'all-over full coverage' },
                { label: 'Parcial', value: 'partial central area' },
                { label: 'Distribución sutil', value: 'subtly dispersed elements' }
            ], default: 'all-over full coverage' },
            { key: 'flow_direction', label: 'Dirección/Flujo', type: 'select', options: [
                { label: 'Aleatorio', value: 'random' },
                { label: 'Vertical', value: 'flowing vertically' },
                { label: 'Diagonal', value: 'sweeping diagonally' }
            ], default: 'random' }
        ]
        },
    
        solid: {
        requiresSecondaryColor: false,
        allowExtraColors: false,
        fields: [] // sin opciones adicionales
        },

        stripes: {
            requiresSecondaryColor: true,
            allowExtraColors: true,
            fields: [
                { key: 'direction', label: 'Dirección', type: 'select', options: [ 
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' },
                    { label: 'Diagonal (45°)', value: 'diagonal' }
                ], default: 'horizontal' },
                { key: 'thickness', label: 'Grosor de raya', type: 'select', options: [
                    { label: 'Delgada', value: 'thin' },
                    { label: 'Media', value: 'medium' },
                    { label: 'Gruesa', value: 'thick' }
                ], default: 'medium' },
                { key: 'spacing', label: 'Espaciado', type: 'select', options: [
                    { label: 'Cerrado', value: 'tight' },
                    { label: 'Regular', value: 'regular' },
                    { label: 'Amplio', value: 'wide' }
                ], default: 'regular' },
                { key: 'edge', label: 'Borde de raya', type: 'select', options: [
                    { label: 'Definido', value: 'hard edge' },
                    { label: 'Difuminado', value: 'soft edge' }
                ], default: 'hard edge' },
                { key: 'style', label: 'Estilo de raya', type: 'select', options: [ 
                    { label: 'Uniforme', value: 'uniform and continuous' },
                    { label: 'Bloques', value: 'thick block segments' },
                    { label: 'Desfasado', value: 'staggered and offset' },
                    { label: 'Variado', value: 'varied thickness' }
                ], default: 'uniform and continuous' }
            ]
        },
    
        camouflage: {
        requiresSecondaryColor: false, 
        allowExtraColors: false,
        fields: [
            { key: 'palette', label: 'Paleta', type: 'select', options: [
            { label: 'Tonos tierra', value: 'earth tones' },
            { label: 'Bosque', value: 'forest' },
            { label: 'Desierto', value: 'desert' },
            { label: 'Urbano gris', value: 'urban gray' },
            { label: 'Vibrante', value: 'vibrant' }
            ], default: 'earth tones' },
            { key: 'scale', label: 'Escala', type: 'select', options: [
            { label: 'Pequeña', value: 'small' },
            { label: 'Media', value: 'medium' },
            { label: 'Grande', value: 'large' }
            ], default: 'medium' },
            { key: 'edge', label: 'Borde de manchas', type: 'select', options: [
            { label: 'Orgánico', value: 'organic shapes' },
            { label: 'Suave', value: 'soft edged' }
            ], default: 'organic shapes' },
            { key: 'style', label: 'Estilo de Camo', type: 'select', options: [ // ⬅️ NUEVO CAMPO
                { label: 'Digital/Pixelado', value: 'micro-pixelated' },
                { label: 'Fragmentado Moderno', value: 'splintered fragmented shapes' },
                { label: 'Superpuesto (Moderno)', value: 'layered and outlined' } // CLAVE para la imagen
            ], default: 'classic rounded blotches' }
        ]
        },
    
        two_tone: {
        requiresSecondaryColor: true,
        allowExtraColors: false,
        fields: [
            { key: 'division', label: 'División', type: 'select', options: [
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
                { label: 'Diagonal', value: 'diagonal' }
            ], default: 'horizontal' },
            { key: 'division_style', label: 'Estilo de Borde', type: 'select', options: [ // ⬅️ NUEVO
                { label: 'Recto', value: 'straight line' },
                { label: 'Curvo', value: 'curved line' },
                { label: 'En V', value: 'V-shaped' },
                { label: 'Ondulado', value: 'wavy line' }
            ], default: 'straight line' },
            { key: 'ratio', label: 'Relación de áreas', type: 'range',
            min: 30, max: 70, step: 5, default: 50 },
            { key: 'edge', label: 'Borde de división', type: 'select', options: [
                { label: 'Limpio', value: 'clean edge' },
                { label: 'Difuminado', value: 'soft transition' }
            ], default: 'clean edge' },
            { key: 'placement', label: 'Colocación', type: 'select', options: [ // ⬅️ NUEVO
                { label: 'Bloque completo', value: 'full color block' },
                { label: 'Panel descentrado', value: 'offset panel' },
                { label: 'Panel asimétrico', value: 'asymmetrical panel' },
                { label: 'Mangas/Cuerpo', value: 'sleeve and body split' }
            ], default: 'full color block' }
        ]
        },
    
        full_print: {
            requiresSecondaryColor: true,
            allowExtraColors: true, // 🔹 ahora puede tener colores
            fields: [
              { key: 'complexity', label: 'Complejidad', type: 'select', options: [
                { label: 'Simple', value: 'simple' },
                { label: 'Media', value: 'moderate' },
                { label: 'Alta', value: 'complex' }
              ], default: 'moderate' },
              { key: 'density', label: 'Densidad', type: 'select', options: [
                { label: 'Densa', value: 'dense' },
                { label: 'Repetición sin costuras', value: 'seamless repetition' },
                { label: 'Elementos dispersos', value: 'scatterred elements' },
                { label: 'Minimalista', value: 'sparse minimalist' },
                { label: 'Aleatorio', value: 'random' },
              ], default: 'random' },
              { key: 'texture', label: 'Textura', type: 'select', options: [
                { label: 'Digital glitch', value: 'digital glitch art' },
                { label: 'Textura de agua', value: 'watercolor texture' },
                { label: 'Arte vectorial', value: 'vector art' },
              ], default: 'digital glitch art' },
          
              // 🔹 Campos personalizados
              { key: 'motif', label: 'Objeto/Forma (ej: perros, rayos, burbujas)', type: 'text', placeholder: "ej. rayos" },
              { key: 'style', label: 'Arte/Estilo (ej: manga, pinceladas, animado)', type: 'text', placeholder: "ej. manga" },
            ]
          }
          
    };

    React.useEffect(() => {
        if (!diseno) return;
        const s = PATTERN_SCHEMAS[diseno];
        if (!s) return;
        const next = { ...opcionesDiseno };
        s.fields.forEach(f => {
          if (f.default !== undefined && next[f.key] === undefined) {
            next[f.key] = f.default;
          }
        });
        setOpcionesDiseno(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [diseno]);

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

  // --- Generar Imagen ---
  const handleGenerar = async () => {
    setLoading(true);
    setImagen(null);
    setDescripcion("");

    const payload = {
        categoria_id,
        categoria_prd: "camiseta_v2",
        userId: user?.id,
        atributos: {
          estilo: "sportswear",             
          diseno,                          
          color1,
          color2: (PATTERN_SCHEMAS[diseno]?.requiresSecondaryColor ? color2 : undefined),
          opcionesDiseno,                    
          cuello, manga, tela, genero
        },
      };
      

    try {
      const res = await fetch(`${API_URL}/api/ia/generar_camiseta_v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setImagen(data.imageUrl);
      setDescripcion(data.descripcion || "");
    } catch (e) {
      console.error("Error:", e);
      setDescripcion("❌ Error generando la camiseta.");
    } finally {
      setLoading(false);
    }
  };

  // Función para validar si se puede avanzar al siguiente paso
  const canGoNext = () => {
    if (paso === 1) return !!diseno;
    if (paso === 2) {
      const schema = PATTERN_SCHEMAS[diseno];
      if (!schema) return !!color1;
      return schema.requiresSecondaryColor ? (!!color1 && !!color2) : !!color1;
    }
    if (paso === 3) return true; // ya se setean defaults
    if (paso === 4) return !!(cuello && manga && tela && genero);
    return true;
  };

  // --- Render de pasos ---
  const renderPaso = () => {
    switch (paso) {
      case 1:
        return (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-bold text-center mb-6">1. Selecciona el patrón</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
              {patrones.map((p) => (
                <div
                  key={p.key}
                  onClick={() => setDiseno(p.key)}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-md transition ${
                    diseno === p.key ? "border-4 border-blue-600" : "border border-gray-300"
                  }`}
                >
                  <img src={p.img} alt={p.es} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-center text-blue-900">{p.es}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-bold text-center mb-6">2. Selecciona colores</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {colores.map((c) => (
                <div
                  key={c.en}
                  onClick={() => setColor1(c.en)}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                    color1 === c.en ? "border-blue-600" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            {(diseno !== "solid" && diseno !== "") && (
              <>
                <h3 className="mt-6 mb-3 text-center">Color secundario</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {colores.map((c) => (
                    <div
                      key={c.en}
                      onClick={() => setColor2(c.en)}
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                        color2 === c.en ? "border-blue-600" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                
                {/* Selector de colores para camuflaje vibrante */}
                {diseno === "camouflage" && opcionesDiseno.palette === "vibrant" && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-center font-semibold">Colores para Camuflaje Vibrante (máx. 2)</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {colores.map((c) => {
                        const alreadyPicked = (opcionesDiseno.extraColors || []).includes(c.en);
                        const limitReached = (opcionesDiseno.extraColors || []).length >= 2;

                        return (
                          <div
                            key={c.en}
                            onClick={() => {
                              if (!alreadyPicked && !limitReached) {
                                setOpcionesDiseno(prev => ({
                                  ...prev,
                                  extraColors: [...(prev.extraColors || []), c.en]
                                }));
                              }
                            }}
                            className={`w-12 h-12 rounded-full cursor-pointer border-2 transition ${
                              alreadyPicked ? "border-green-600 ring-2 ring-green-400" : "border-gray-300"
                            } ${limitReached && !alreadyPicked ? "opacity-40 cursor-not-allowed" : ""}`}
                            style={{ backgroundColor: c.hex }}
                          />
                        );
                      })}
                    </div>

                    {/* Mostrar selección */}
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                      {(opcionesDiseno.extraColors || []).map((col, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 rounded flex items-center gap-2">
                          {col}
                          <button
                            className="text-red-500 font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpcionesDiseno(prev => ({
                                ...prev,
                                extraColors: prev.extraColors.filter((x, idx) => idx !== i)
                              }));
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Selector de colores adicionales para otros patrones */}
                {PATTERN_SCHEMAS[diseno]?.allowExtraColors && diseno !== "camouflage" && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-center font-semibold">Color adicional</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                    {colores.map((c) => {
                        const alreadyPicked = (opcionesDiseno.extraColors || []).includes(c.en);
                        const limitReached = (opcionesDiseno.extraColors || []).length >= 2;

                        return (
                        <div
                            key={c.en}
                            onClick={() => {
                            if (!alreadyPicked && !limitReached) {
                                setOpcionesDiseno(prev => ({
                                ...prev,
                                extraColors: [...(prev.extraColors || []), c.en]
                                }));
                            }
                            }}
                            className={`w-12 h-12 rounded-full cursor-pointer border-2 transition ${
                            alreadyPicked ? "border-green-600 ring-2 ring-green-400" : "border-gray-300"
                            } ${limitReached && !alreadyPicked ? "opacity-40 cursor-not-allowed" : ""}`}
                            style={{ backgroundColor: c.hex }}
                        />
                        );
                    })}
                    </div>

                    {/* Mostrar selección */}
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                    {(opcionesDiseno.extraColors || []).map((col, i) => (
                        <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 rounded flex items-center gap-2"
                        >
                        {col}
                        <button
                            className="text-red-500 font-bold"
                            onClick={() => {
                            setOpcionesDiseno(prev => ({
                                ...prev,
                                extraColors: prev.extraColors.filter((x, idx) => idx !== i)
                            }));
                            }}
                        >
                            ✕
                        </button>
                        </span>
                    ))}
                    </div>
                </div>
                )}
              </>
            )}
          </div>
        );
      case 3:
        const schema = PATTERN_SCHEMAS[diseno] || { fields: [], requiresSecondaryColor: false };

        const setOpt = (key, value) => setOpcionesDiseno(prev => ({ ...prev, [key]: value }));

        const Field = ({ f }) => {
          if (f.type === 'select' && f.options[0]?.img) {
            return (
              <div className="flex flex-col gap-2">
                <label className="font-semibold">{f.label}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {f.options.map(o => (
                    <div
                      key={o.value}
                      onClick={() => setOpt(f.key, o.value)}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden shadow-md hover:scale-105 transition 
                        ${opcionesDiseno[f.key] === o.value ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'}`}
                    >
                      <img src={o.img} alt={o.label} className="w-center h-center object-cover" />
                      <p className="text-center py-1 font-medium">{o.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (f.type === 'range') {
            const v = opcionesDiseno[f.key] ?? f.default ?? f.min;
            return (
              <div className="flex flex-col gap-1">
                <label className="font-medium">{f.label}: <span className="text-blue-700">{v}%</span></label>
                <input
                  type="range"
                  min={f.min} max={f.max} step={f.step || 1}
                  value={v}
                  onChange={(e) => setOpt(f.key, Number(e.target.value))}
                />
              </div>
            );
          }

          if (f.type === 'text') {
            return (
              <div className="flex flex-col gap-1">
                <label className="font-medium">{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder || ''}
                  className="border p-2 rounded"
                  value={opcionesDiseno[f.key] ?? ''}
                  onChange={(e) => setOpt(f.key, e.target.value)}
                />
              </div>
            );
          }

          // fallback:
          return null;
        };

        // --- Render del Paso 3 ---
        return (
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-bold text-center mb-6">3. Opciones adicionales</h2>

            {!diseno && <p className="text-center text-gray-500">Primero elige un patrón en el paso 1.</p>}

            {diseno && schema.fields.length === 0 && (
              <p className="text-center text-gray-600">Este patrón no requiere opciones adicionales.</p>
            )}

            {diseno && schema.fields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schema.fields.map((f) => <Field key={f.key} f={f} />)}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-bold text-center">4. Opciones generales</h2>
            {[{ label: "Cuello", options: cuellos, state: cuello, setState: setCuello },
              { label: "Manga", options: mangas, state: manga, setState: setManga },
              { label: "Tela", options: telas, state: tela, setState: setTela },
              { label: "Género", options: generos, state: genero, setState: setGenero }].map((f) => (
              <div key={f.label}>
                <h3 className="font-semibold mb-2">{f.label}</h3>
                <div className="flex gap-2 flex-wrap">
                  {f.options.map((o) => (
                    <button
                      key={o.en}
                      onClick={() => f.setState(o.en)}
                      className={`px-3 py-2 rounded-lg border ${
                        f.state === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                      }`}
                    >
                      {o.es}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">5. Confirmación</h2>
            <p className="mb-6">Ya seleccionaste tu diseño. Genera la camiseta ahora:</p>
            <button
              onClick={handleGenerar}
              disabled={loading}
              className="bg-blue-900 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              {loading ? "Generando..." : "Generar Imagen"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {imagen ? (
          <div className="text-center">
            <p className="text-green-600 font-bold mb-4">✅ Camiseta generada con éxito</p>
            <img src={imagen} alt="Camiseta generada" className="mx-auto rounded-lg shadow-lg w-80" />
            <p className="mt-4">{descripcion}</p>
          </div>
        ) : (
          <>
            {renderPaso()}
            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
              {paso > 1 && (
                <button
                  onClick={() => setPaso(paso - 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg"
                >
                  Atrás
                </button>
              )}
              {paso < 5 && (
                <button
                  onClick={() => canGoNext() && setPaso(paso + 1)}
                  disabled={!canGoNext()}
                  className={`px-6 py-2 rounded-lg ${
                    canGoNext() 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
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
