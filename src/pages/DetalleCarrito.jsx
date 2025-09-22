// src/pages/DetalleCarrito.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DetalleCarrito() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/carrito/detalle/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItem(data.item))
      .catch((error) => console.error("Error en fetch:", error));
  }, [itemId]);

  if (!item) return <div className="p-6 text-black">Cargando detalle del producto...</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <img src={item.imagen_url} alt={item.nombre} className="w-80 h-auto rounded-xl shadow" />
        </div>

        <div className="flex flex-col gap-4 text-gray-800">
          <h1 className="text-3xl font-bold text-blue-900">{item.nombre}</h1>
          <p><strong>Categoría:</strong> {item.categoria_nombre}</p>
          <p><strong>Tela:</strong> {item.tela_nombre}</p>
          <p><strong>Color:</strong> {item.color?.color}</p>
          <p><strong>Talla:</strong> {item.talla}</p>
          <p><strong>Cantidad:</strong> {item.cantidad}</p>
          <p><strong>Precio total:</strong> ${Number(item.precio || 0).toFixed(2)}</p>
          <button
            className="mt-4 w-40 bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => navigate("/carrito")}
          >
            Volver al carrito
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
