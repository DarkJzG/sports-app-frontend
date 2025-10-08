// src/pages/ModeloIA/FormConjuntoExterno.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function FormConjuntoExterno() {
  const { user } = useAuth();
  const location = useLocation();
  const categoria_id = location.state?.categoria_id;
  const categoria_prd = location.state?.categoria_prd || "conjunto_externo";

  // Campos principales
  const [estilo, setEstilo] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [diseno, setDiseno] = useState("");
  const [disenoOtro, setDisenoOtro] = useState("");
  const [tela, setTela] = useState("");
  const [genero, setGenero] = useState("");
  const [estiloAvanzado, setEstiloAvanzado] = useState("");
  const [acabado, setAcabado] = useState("");

  // Chompa
  const [capucha, setCapucha] = useState("");
  const [cierre, setCierre] = useState("");
  const [bolsillosChompa, setBolsillosChompa] = useState("");
  const [detallesChompa, setDetallesChompa] = useState([]);

  // Pantalón
  const [ajustePantalon, setAjustePantalon] = useState("");
  const [cinturaPantalon, setCinturaPantalon] = useState("");
  const [bolsillosPantalon, setBolsillosPantalon] = useState("");
  const [detallesPantalon, setDetallesPantalon] = useState([]);

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

  // Opciones Chompa
  const opcionesCapucha = [
    { es: "Con capucha", en: "with hood" },
    { es: "Sin capucha", en: "without hood" },
  ];

  const opcionesCierre = [
    { es: "Con cierre", en: "with zipper" },
    { es: "Sin cierre", en: "no zipper" },
  ];

  const opcionesBolsillosChompa = [
    { es: "Ninguno", en: "no pockets" },
    { es: "Laterales", en: "side pockets" },
    { es: "Canguro", en: "kangaroo pocket" },
  ];

  const detallesChompaExtras = [
    { es: "Franjas laterales", en: "side stripes" },
    { es: "Costuras visibles", en: "visible seams" },
    { es: "Franjas reflectivas", en: "reflective stripes" },
  ];

  // Opciones Pantalón
  const opcionesAjuste = [
    { es: "Ajuste estrecho", en: "slim fit" },
    { es: "Ajuste regular", en: "regular fit" },
    { es: "Ajuste suelto", en: "loose fit" },
  ];

  const opcionesCintura = [
    { es: "Elástica", en: "elastic waistband" },
    { es: "Con cordón", en: "drawstring waistband" },
  ];

  const opcionesBolsillosPantalon = [
    { es: "Ninguno", en: "no pockets" },
    { es: "Laterales", en: "side pockets" },
    { es: "Traseros", en: "back pockets" },
  ];

  const detallesPantalonExtras = [
    { es: "Franjas laterales", en: "side stripes" },
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
        tela,
        genero,
        estiloAvanzado,
        acabado,
        // Chompa
        capucha,
        cierre,
        bolsillosChompa,
        detallesChompa,
        // Pantalón
        ajustePantalon,
        cinturaPantalon,
        bolsillosPantalon,
        detallesPantalon,
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
            <p className="text-blue-900 font-bold text-lg">Generando tu conjunto...</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center">
          Diseña tu Conjunto Externo (Chompa + Pantalón)
        </h1>

        {/* Estilo */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Estilo</h2>
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

        {/* Colores */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Color principal</h2>
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

          <h2 className="font-bold text-lg mt-6 mb-4">Color secundario</h2>
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

        {/* Diseño */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Diseño</h2>
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

        {/* Estilo avanzado */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Estilo Avanzado</h2>
          <div className="flex flex-wrap gap-3">
            {estilosAvanzados.map((p) => (
              <button
                key={p.en}
                onClick={() => setEstiloAvanzado(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  estiloAvanzado === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* Acabado */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Acabado</h2>
          <div className="flex flex-wrap gap-3">
            {acabados.map((p) => (
              <button
                key={p.en}
                onClick={() => setAcabado(p.en)}
                className={`px-4 py-2 rounded-lg border ${
                  acabado === p.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* Tela y género */}
        {[{ label: "Tela", options: telas, state: tela, setState: setTela },
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

        {/* Sección Chompa */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Chompa (Superior)</h2>
          <div className="flex gap-3 flex-wrap">
            {opcionesCapucha.map((o) => (
              <button
                key={o.en}
                onClick={() => setCapucha(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  capucha === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
            {opcionesCierre.map((o) => (
              <button
                key={o.en}
                onClick={() => setCierre(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  cierre === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
            {opcionesBolsillosChompa.map((o) => (
              <button
                key={o.en}
                onClick={() => setBolsillosChompa(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  bolsillosChompa === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
          </div>

          <h3 className="mt-4 font-semibold">Detalles adicionales</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            {detallesChompaExtras.map((p) => (
              <button
                key={p.en}
                onClick={() =>
                  setDetallesChompa((prev) =>
                    prev.includes(p.en)
                      ? prev.filter((x) => x !== p.en)
                      : [...prev, p.en]
                  )
                }
                className={`px-4 py-2 rounded-lg border ${
                  detallesChompa.includes(p.en) ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {p.es}
              </button>
            ))}
          </div>
        </div>

        {/* Sección Pantalón */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h2 className="font-bold text-lg mb-4">Pantalón (Inferior)</h2>
          <div className="flex gap-3 flex-wrap">
            {opcionesAjuste.map((o) => (
              <button
                key={o.en}
                onClick={() => setAjustePantalon(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  ajustePantalon === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
            {opcionesCintura.map((o) => (
              <button
                key={o.en}
                onClick={() => setCinturaPantalon(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  cinturaPantalon === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
            {opcionesBolsillosPantalon.map((o) => (
              <button
                key={o.en}
                onClick={() => setBolsillosPantalon(o.en)}
                className={`px-4 py-2 rounded-lg border ${
                  bolsillosPantalon === o.en ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.es}
              </button>
            ))}
          </div>

          <h3 className="mt-4 font-semibold">Detalles adicionales</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            {detallesPantalonExtras.map((p) => (
              <button
                key={p.en}
                onClick={() =>
                  setDetallesPantalon((prev) =>
                    prev.includes(p.en)
                      ? prev.filter((x) => x !== p.en)
                      : [...prev, p.en]
                  )
                }
                className={`px-4 py-2 rounded-lg border ${
                  detallesPantalon.includes(p.en) ? "bg-blue-600 text-white" : "bg-gray-100"
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
              ✅ Conjunto externo agregado a tu colección
            </p>
            <img
              src={imagen}
              alt="Conjunto externo generado"
              className="mx-auto rounded-lg shadow-lg w-80"
            />
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
