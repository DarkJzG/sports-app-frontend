// src/pages/DetallePrd.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function DetallePrd() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/producto/get/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error("Error cargando el producto:", err));
  }, [id]);

    useEffect(() => {
      if (!producto) return;

      // precio base unitario
      const precioMenor = producto.precio_venta || 0;

      // precio con descuento (ejemplo: 10% menos si >=12)
      const precioMayor = producto.precio_venta ? producto.precio_venta * 0.9 : 0;

      
      const unitario = cantidad >= 12 ? precioMayor : precioMenor;

      setPrecioUnitario(unitario);
      setSubtotal(unitario * cantidad);
    }, [cantidad, producto]);

  if (!producto) return <div className="p-6">Cargando producto...</div>;

  const handleAgregarCarrito = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!tallaSeleccionada || !colorSeleccionado) {
      setError("Selecciona talla y color");
      return;
    }

    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }

    const productoCarrito = {
      userId: user.id,
      productoId: producto._id,
      tipo: "producto",
      nombre: producto.nombre,
      categoria_nombre: producto.categoria_nombre,
      tela_nombre: producto.tela_nombre,
      color: colorSeleccionado,
      talla: tallaSeleccionada,
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
        alert("Producto añadido al carrito");
        setCantidad(1);
        setTallaSeleccionada("");
        setColorSeleccionado(null);
        setError("");
        navigate("/carrito");
      } else {
        alert("Error al añadir al carrito: " + data.msg);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="flex justify-center items-center">
          <img src={producto.imagen_url} alt={producto.nombre} className="w-96 h-auto rounded-xl shadow" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-blue-900">{producto.nombre}</h1>
          <p><strong>Categoría:</strong> {producto.categoria_nombre}</p>
          <p><strong>Tela:</strong> {producto.tela_nombre}</p>
          <p><strong>Observaciones:</strong> {producto.observaciones || "-"}</p>

          {/* Colores */}
          <div>
            <label className="font-bold text-gray-700">Colores disponibles:</label>
            <div className="flex gap-3 mt-2">
              {[producto.color].map((c, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg cursor-pointer border shadow-sm ${colorSeleccionado?.lote_id === c.lote_id ? "border-blue-700 bg-blue-100" : "border-gray-300"}`}
                  onClick={() => setColorSeleccionado(c)}
                >
                  <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: c.color.split("(")[1]?.replace(")", "") }} />
                  <span className="ml-2">{c.color}</span>
                  <span className="ml-2 text-sm text-gray-600">${c.precio_unitario}/m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tallas */}
          <div>
            <label className="font-bold text-gray-700">Selecciona una talla:</label>
            <select
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              value={tallaSeleccionada}
              onChange={(e) => setTallaSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una talla</option>
              {producto.tallas_disponibles?.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

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
          <div className="flex gap-4">
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Precio unitario: $
              {cantidad >= 12 
                ? (producto.precio_venta * 0.9).toFixed(2) 
                : producto.precio_venta.toFixed(2)}
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
