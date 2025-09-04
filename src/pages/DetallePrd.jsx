// src/pages/DetallePrd.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";


export default function DetallePrd() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
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
    const precioUnitario = cantidad >= 12 ? producto.preciomayor : producto.preciomenor;
    setSubtotal((precioUnitario * cantidad));
  }, [cantidad, producto]);

  if (!producto) return <div className="p-6">Cargando producto...</div>;

  const tallas = ["S", "M", "L", "XL", "XXL"];

const handleAgregarCarrito = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (!tallaSeleccionada || !colorSeleccionado ) {
    setError("Selecciona talla, color y cantidad válida");
    return;
  }

    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }
    if (cantidad >= 120) {
      setError("La cantidad no puede ser mayor a 120");
      return;
    }

  const productoCarrito = {
    userId: user.id,
    productoId: producto._id,
    nombre: producto.nombre,
    imageUrl: producto.imageUrl,
    precio: subtotal,
    cantidad,
    talla: tallaSeleccionada,
    color: colorSeleccionado.nombre,
    estado: "pendiente",
  };

  try {
    const res = await fetch(`${API_URL}/carrito/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoCarrito),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Producto añadido al carrito");
      setCantidad(1);
      setTallaSeleccionada("");
      setColorSeleccionado(null);
      setError("");
      navigate("/");
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
          <img src={producto.imageUrl} alt={producto.nombre} className="w-96 h-auto rounded-xl shadow" />
        </div>

        {/* Info del producto */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-blue-900">{producto.nombre}</h1>
          <p className="text-gray-700"><strong>Categoría:</strong> {producto.categoria}</p>
          <p className="text-gray-700"><strong>Material:</strong> {producto.tela}</p>
          <p className="text-gray-700"><strong>Diseño:</strong> {producto.namediseno} (${producto.diseno})</p>
          <p className="text-gray-700"><strong>Colores disponibles:</strong></p>
          <div className="flex gap-3">
            {producto.color.map((c, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${colorSeleccionado?.nombre === c.nombre ? "border-blue-700" : "border-gray-300"}`}
                style={{ backgroundColor: c.codigo }}
                title={c.nombre}
                onClick={() => setColorSeleccionado(c)}
              ></div>
            ))}
          </div>

          <div>
            <label className="font-bold text-gray-700">Selecciona una talla:</label>
            <select
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              value={tallaSeleccionada}
              onChange={(e) => setTallaSeleccionada(e.target.value)}
            >
              <option value="">Selecciona una talla</option>
              {tallas.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Cantidad:</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Precio unitario: ${cantidad >= 12 ? producto.preciomayor : producto.preciomenor}
            </div>
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Subtotal: ${subtotal}
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
