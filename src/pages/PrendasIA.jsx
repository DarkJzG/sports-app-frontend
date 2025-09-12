// src/pages/ModeloIA/PrendasIA.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



export default function PrendasIA() {
  const { user } = useAuth();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleAgregarCarrito = async (prenda) => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!prenda.tallaSeleccionada || !prenda.colorSeleccionado || !prenda.cantidadSeleccionada) {
      alert("Selecciona talla, color y cantidad");
      return;
    }

    const itemCarrito = {
      userId: user.id,
      prendaId: prenda._id,
      talla: prenda.tallaSeleccionada,
      color: prenda.colorSeleccionado,
      cantidad: prenda.cantidadSeleccionada,
    };

    try {
      const res = await fetch(`${API_URL}/carrito/add_prenda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemCarrito),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Prenda añadida al carrito");
      } else {
        alert("Error: " + data.msg);
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };


  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/prendas_ia?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setPrendas(data.prendas || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="text-center mt-10">Cargando prendas...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Mis Prendas IA</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prendas.map(prenda => (
              <div key={prenda._id} className="border rounded-lg p-4 shadow-lg">
                <img
                  src={`data:image/png;base64,${prenda.imagen_b64}`}
                  alt={prenda.tipo_prenda}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p><strong>Tipo:</strong> {prenda.tipo_prenda}</p>
                <p><strong>Estilo:</strong> {prenda.atributos.estilo}</p>
                <p><strong>Talla:</strong> {prenda.atributos.talla}</p>
                <p><strong>Tela:</strong> {prenda.atributos.tela}</p>
                <p><strong>Costo:</strong> ${prenda.costo}</p>

                {/* Inputs */}
                <div className="mt-3">
                  <label className="block text-sm font-bold">Selecciona talla:</label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => prenda.tallaSeleccionada = e.target.value}
                  >
                    <option value="">Seleccione...</option>
                    {["S","M","L","XL","XXL"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-bold">Color:</label>
                  <input
                    type="text"
                    placeholder="Ej: Azul"
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => prenda.colorSeleccionado = e.target.value}
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-bold">Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => prenda.cantidadSeleccionada = parseInt(e.target.value)}
                  />
                </div>

                {/* Botón */}
                <button
                  onClick={() => handleAgregarCarrito(prenda)}
                  className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
