// src/pages/Productos/ProductosAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const navigate = useNavigate();

  // Cargar productos
  useEffect(() => {
    fetch(`${API_URL}/producto/all`)
      .then(res => res.json())
      .then(setProductos);
  }, []);

  // Eliminar producto
  async function handleEliminar() {
    const res = await fetch(`${API_URL}/producto/delete/${idEliminar}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) setProductos(productos.filter(p => p._id !== idEliminar));
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarA />

      {/* Header */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center justify-between">
        <h2 className="text-4xl font-semibold">Administrar Productos</h2>
        <button
          className="bg-white text-blue-900 font-bold px-8 py-3 rounded-xl shadow hover:bg-gray-200"
          onClick={() => navigate("/producto/agregar")}
        >
          + Agregar Producto
        </button>
      </section>

      {/* Buscador */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <input
            className="rounded-lg px-4 py-2 w-80 shadow-inner border border-gray-200 focus:outline-blue-900"
            placeholder="Buscar por nombre o categoría..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />
        </div>

        {/* Lista de productos */}
        <div>
          {productos
            .filter(p =>
              p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
              (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(buscar.toLowerCase()))
            )
            .map(p => (
              <div
                key={p._id}
                className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm"
              >
                <img
                  src={p.imagen_url || "/img/prod.png"}
                  alt="img-prod"
                  className="h-20 w-20 object-contain rounded-xl"
                />
                <div className="flex-1">
                  <div className="font-bold text-xl">{p.nombre}</div>
                  <div className="text-sm text-gray-700">
                    <b>Categoría:</b> {p.categoria_nombre}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Tela:</b> {p.tela_nombre}{" "}
                    <b>Color:</b> {p.color?.color || "N/A"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Género:</b> {p.genero || "N/A"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Mano de Obra:</b> ${p.mano_obra_prenda}{" "}
                    <b>Diseños:</b>{" "}
                    {Object.entries(p.cantDisenos || {}).map(([k, v]) =>
                      v > 0 ? `${k}: ${v} ` : ""
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Insumos:</b> ${p.costos?.insumos?.toFixed(2) || 0}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Costo Total:</b> ${p.costos?.total?.toFixed(2) || 0}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Venta Menor:</b> ${p.precio_venta || 0}{" "}
                    <b>Ganancia:</b> ${p.ganancia_menor?.toFixed(2) || 0}
                  </div>
                  <div className="text-sm text-gray-700">
                    <b>Venta Mayor (≥12):</b> ${(p.precio_venta * 0.9).toFixed(2)}{" "}
                    <b>Ganancia:</b> ${p.ganancia_mayor?.toFixed(2) || 0}
                  </div>
                </div>

                <button
                  className="bg-blue-900 text-white font-bold px-5 py-2 rounded mr-2"
                  onClick={() => navigate(`/producto/editar/${p._id}`)}
                >
                  Editar
                </button>
                <button
                  className="text-gray-700 font-bold flex items-center gap-1"
                  onClick={() => {
                    setIdEliminar(p._id);
                    setShowModal(true);
                  }}
                >
                  Eliminar <i className="fas fa-trash" />
                </button>
              </div>
            ))}
        </div>
      </main>

      <FooterA />

      {/* Modal Eliminar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
            <h3 className="font-bold text-lg mb-2">Eliminar Producto</h3>
            <p className="mb-6">¿Estás seguro de eliminar este producto?</p>
            <div className="flex gap-4">
              <button
                className="bg-blue-900 text-white font-bold rounded px-6 py-2"
                onClick={() => setShowModal(false)}
              >
                NO
              </button>
              <button
                className="bg-gray-200 font-bold rounded px-6 py-2"
                onClick={handleEliminar}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
