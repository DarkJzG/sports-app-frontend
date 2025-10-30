// src/pages/DetallePrd.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetallePrd() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [tipoTalla, setTipoTalla] = useState("general"); // 🔹 general | personalizada
  const [medidasPersonalizadas, setMedidasPersonalizadas] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 Cargar producto
  useEffect(() => {
    fetch(`${API_URL}/producto/get/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error("Error cargando el producto:", err));
  }, [id]);

  // 🔹 Actualizar precios
  useEffect(() => {
    if (!producto) return;

    const precioMenor = producto.precio_venta || 0;
    const precioMayor = producto.precio_venta ? producto.precio_venta * 0.9 : 0;
    const unitario = cantidad >= 12 ? precioMayor : precioMenor;

    setPrecioUnitario(unitario);
    setSubtotal(unitario * cantidad);
  }, [cantidad, producto]);

  if (!producto) return <div className="p-6">Cargando producto...</div>;

  // 🔹 Agregar al carrito
  const handleAgregarCarrito = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Validaciones
    if (!colorSeleccionado) {
      setError("Selecciona un color disponible");
      return;
    }
    if (tipoTalla === "general" && !tallaSeleccionada) {
      setError("Selecciona una talla estándar");
      return;
    }
    if (tipoTalla === "personalizada" && !medidasPersonalizadas.trim()) {
      setError("Especifica tus medidas o elige acercarte al taller");
      return;
    }
    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }

    const tallaFinal =
      tipoTalla === "general"
        ? tallaSeleccionada
        : `${medidasPersonalizadas}`;

    const productoCarrito = {
      userId: user.id,
      productoId: producto._id,
      tipo: "producto",
      nombre: producto.nombre,
      categoria_nombre: producto.categoria_nombre,
      tela_nombre: producto.tela_nombre,
      color: colorSeleccionado.color || "N/A",
      talla: tallaFinal,
      cantidad,
      precio_unitario: parseFloat(precioUnitario.toFixed(2)),
      precio: parseFloat(subtotal.toFixed(2)),
      imagen_url: producto.imagen_url,
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
        toast.success(`🛒 ${producto.nombre} añadido al carrito`, {
          position: "top-center",
          autoClose: 2500,
        });
        setTimeout(() => navigate("/carrito"), 2800);
        setCantidad(1);
        setTallaSeleccionada("");
        setColorSeleccionado(null);
        setMedidasPersonalizadas("");
        setError("");
      } else {
        toast.error("❌ Error al añadir al carrito: " + (data.msg || ""), {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("❌ Error de conexión con el servidor", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="flex justify-center items-center">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-96 h-auto rounded-xl shadow"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-blue-900">{producto.nombre}</h1>
          <p>
            <strong>Categoría:</strong> {producto.categoria_nombre}
          </p>
          <p>
            <strong>Tela:</strong> {producto.tela_nombre}
          </p>
          <p>
            <strong>Observaciones:</strong> {producto.observaciones || "-"}
          </p>

          {/* Colores */}
          <div>
            <label className="font-bold text-gray-700">Colores disponibles:</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {[producto.color].flat().map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => setColorSeleccionado(c)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border shadow-sm transition ${
                    colorSeleccionado?.lote_id === c.lote_id
                      ? "border-blue-700 bg-blue-100"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border"
                    style={{
                      backgroundColor:
                        c.color?.includes("(")
                          ? c.color.split("(")[1]?.replace(")", "")
                          : c.color || "#ccc",
                    }}
                  />
                  <span>{c.color}</span>
                  {c.precio_unitario && (
                    <span className="text-sm text-gray-600">
                      ${c.precio_unitario}/m
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Selección tipo de talla */}
          <div>
            <h3 className="font-semibold mb-2 mt-4">Selecciona el tipo de talla</h3>
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
          </div>

          {/* 🔹 Si elige tallas generales */}
          {tipoTalla === "general" && (
            <div>
              <label className="font-bold text-gray-700 mt-2 block">
                Selecciona tu talla:
              </label>
              <select
                className="w-full bg-white border mt-1 rounded px-3 py-2"
                value={tallaSeleccionada}
                onChange={(e) => setTallaSeleccionada(e.target.value)}
              >
                <option value="">Selecciona una talla</option>
                {producto.tallas_disponibles?.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 🔹 Si elige talla personalizada */}
          {tipoTalla === "personalizada" && (
            <div>
              <h3 className="font-semibold mb-2 mt-3">Talla Personal</h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  {medidasPersonalizadas.includes("taller")
                    ? "Acercarse al taller"
                    : "Ingresar medidas manualmente"}
                </span>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    name="tallerToggle"
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
                    className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="tallerToggle"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      medidasPersonalizadas.includes("taller")
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  ></label>
                </div>
              </div>

              {!medidasPersonalizadas.includes("taller") && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ingresa tus medidas manualmente:
                  </p>
                  <textarea
                    placeholder="Ejemplo: Pecho 100cm, Cintura 85cm, Largo 70cm..."
                    value={medidasPersonalizadas}
                    onChange={(e) => setMedidasPersonalizadas(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              )}
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="font-bold text-gray-700">Cantidad:</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            />
          </div>

          {/* Precios */}
          <div className="flex flex-col gap-3 mt-3">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
