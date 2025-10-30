// src/pages/DetallePrd_3D.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

export default function DetallePrd3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cantidad, setCantidad] = useState(1);
  const [tipoTalla, setTipoTalla] = useState("general"); // general | personalizada
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [medidasPersonalizadas, setMedidasPersonalizadas] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/3d/prenda/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        setLoading(false);
        const unitario =
          cantidad >= 12
            ? data.precio_mayor || data.costo?.precio_mayor || 0
            : data.precio_venta || data.costo?.precio_venta || 0;
        setPrecioUnitario(unitario);
        setSubtotal(unitario * cantidad);
      })
      .catch((err) => {
        console.error("Error cargando prenda 3D:", err);
        toast.error("No se pudo cargar la prenda 3D");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!prenda) return;
    const unitario =
      cantidad >= 12
        ? prenda.precio_mayor || prenda.costo?.precio_mayor || 0
        : prenda.precio_venta || prenda.costo?.precio_venta || 0;
    setPrecioUnitario(unitario);
    setSubtotal(unitario * cantidad);
  }, [cantidad, prenda]);

  if (loading)
    return <div className="p-6 text-center">Cargando prenda...</div>;
  if (!prenda)
    return <div className="p-6 text-center">No se encontró la prenda.</div>;

  // 🛒 Agregar al carrito
  const handleAgregarCarrito = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Validaciones
    if (tipoTalla === "general" && !tallaSeleccionada) {
      setError("Selecciona una talla estándar");
      return;
    }
    if (tipoTalla === "personalizada" && !medidasPersonalizadas.trim()) {
      setError("Especifica tus medidas o elige una opción personalizada");
      return;
    }
    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }

    const tallaFinal =
      tipoTalla === "general"
        ? tallaSeleccionada
        : `Talla personalizada: ${medidasPersonalizadas}`;

    const productoCarrito = {
      userId: user.id,
      productoId: prenda._id,
      tipo: "prenda_3d",
      nombre: prenda.modelo || "Prenda 3D",
      categoria_nombre: prenda.categoria || "Prenda 3D",
      tela_nombre: prenda.tela_nombre || "N/A",
      color:
        Object.values(prenda.colors || {}).join(", ") || "Color personalizado",
      talla: tallaFinal,
      cantidad,
      precio_unitario: parseFloat(precioUnitario.toFixed(2)),
      precio: parseFloat(subtotal.toFixed(2)),
      imagen_url:
        prenda.renders?.render_frente ||
        prenda.renders?.render_espalda ||
        prenda.renders?.render_lado_izq ||
        prenda.renders?.render_lado_der,
      ficha_id: prenda.ficha_id,
      estado: "pendiente",
    };

    try {
      const res = await fetch(`${API_URL}/carrito/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoCarrito),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success("Prenda añadida al carrito");
        navigate("/carrito");
      } else {
        toast.error(data.msg || "Error al añadir al carrito");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div className="flex justify-center items-center">
          <img
            src={
              prenda.renders?.render_frente ||
              prenda.renders?.render_espalda ||
              prenda.renders?.render_lado_izq ||
              prenda.renders?.render_lado_der
            }
            alt={prenda.modelo}
            className="rounded-xl shadow-xl w-96 h-auto"
          />
        </div>

        {/* Información */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-blue-900">{prenda.modelo}</h1>
          <p className="text-gray-700 capitalize">
            <strong>Categoría:</strong> {prenda.categoria}
          </p>
          <p>
            <strong>Diseño base:</strong> {prenda.design_id}
          </p>

          <h3 className="mt-3 font-semibold text-blue-700">🎨 Colores aplicados</h3>
          <ul className="list-disc list-inside">
            {Object.entries(prenda.colors || {}).map(([zona, color]) => (
              <li key={zona}>
                <strong>{zona}:</strong> <span style={{ color }}>{color}</span>
              </li>
            ))}
          </ul>

          {/* --- Tallas --- */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Selecciona el tipo de talla</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoTalla"
                  value="general"
                  checked={tipoTalla === "general"}
                  onChange={() => setTipoTalla("general")}
                />
                Tallas Generales
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoTalla"
                  value="personalizada"
                  checked={tipoTalla === "personalizada"}
                  onChange={() => setTipoTalla("personalizada")}
                />
                Talla Personal
              </label>
            </div>

            {/* Tallas generales */}
            {tipoTalla === "general" && (
              <div className="mt-3">
                {["S", "M", "L", "XL", "XXL"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTallaSeleccionada(t)}
                    className={`px-3 py-2 rounded-lg border mr-2 ${
                      tallaSeleccionada === t
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Talla personalizada */}
            {tipoTalla === "personalizada" && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Talla Personal</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {medidasPersonalizadas.includes("taller")
                      ? "Acercarse al taller"
                      : "Manualmente"}
                  </span>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id="tallerToggle"
                      checked={medidasPersonalizadas.includes("taller")}
                      onChange={() => {
                        if (medidasPersonalizadas.includes("taller")) {
                          setMedidasPersonalizadas("");
                        } else {
                          setMedidasPersonalizadas(
                            "Acercarse al taller para tomarse las medidas"
                          );
                        }
                      }}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    />
                    <label
                      htmlFor="tallerToggle"
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                        medidasPersonalizadas.includes("taller")
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></label>
                  </div>
                </div>

                {!medidasPersonalizadas.includes("taller") && (
                  <textarea
                    placeholder="Ejemplo: Pecho 100cm, Cintura 85cm, Largo 70cm..."
                    value={medidasPersonalizadas}
                    onChange={(e) =>
                      setMedidasPersonalizadas(e.target.value)
                    }
                    className="w-full border rounded-lg p-2"
                  />
                )}
              </div>
            )}
          </div>

          {/* --- Cantidad --- */}
          <div className="mt-4">
            <label className="font-bold text-gray-700">Cantidad:</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            />
          </div>

          {/* --- Precios --- */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Precio unitario: ${precioUnitario.toFixed(2)}
            </div>
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Subtotal: ${subtotal.toFixed(2)}
            </div>
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            onClick={handleAgregarCarrito}
            className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Agregar al carrito
          </button>

          {/* 🔒 Botón de ficha técnica oculto temporalmente */}
          {/*
          {prenda.ficha_pdf_url && (
            <a
              href={prenda.ficha_pdf_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 bg-blue-900 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              📄 Ver Ficha Técnica
            </a>
          )}
          */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
