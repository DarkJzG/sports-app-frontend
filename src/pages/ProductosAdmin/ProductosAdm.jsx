import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function ListarProducto() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/producto/all`)
      .then(res => res.json())
      .then(setProductos);
  }, []);

  function handleEliminar() {
    fetch(`${API_URL}/producto/delete/${idEliminar}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setProductos(productos.filter(p => p._id !== idEliminar));
        setShowModal(false);
      });
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Productos</h1>
      <p className="mb-8 text-gray-600">Lista de productos/prendas agregadas</p>
      <div className="flex justify-between items-center mb-8">
        <input
          className="rounded-lg px-4 py-2 shadow-inner border border-gray-200"
          placeholder="Buscar por nombre o categoría..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <button
          className="bg-blue-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 shadow"
          onClick={() => navigate("/producto/agregar")}
        >
          Agregar Producto
        </button>
      </div>

      <div>
        {productos
          .filter(p =>
            p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
            (p.categoria && p.categoria.toLowerCase().includes(buscar.toLowerCase()))
          )
          .map(p => (
            <div key={p._id} className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm">
              <img src={p.imageUrl || "/img/prod.png"} alt="img-prod" className="h-20 w-20 object-contain rounded-xl" />
              <div className="flex-1">
                <div className="font-bold text-xl">{p.nombre}</div>
                <div className="text-sm text-gray-700">
                  <b>Categoría:</b> {p.categoria}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Tela:</b> {p.tela} <b>Color:</b> {p.color?.[0]?.nombre || "N/A"}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Mano de Obra:</b> ${p.manoobra} <b>Diseño:</b> {p.namediseno} (${p.diseno || 0})
                </div>
                <div className="text-sm text-gray-700">
                  <b>Costo Unitario:</b> ${p.costounitario || 0} <b>Mayor:</b> ${p.costoxmayor || 0}
                </div>
                <div className="text-sm text-gray-700">
                  <b>Venta Menor:</b> ${p.preciomenor || 0} <b>Mayor:</b> ${p.preciomayor || 0}
                </div>

              </div>
              <button className="bg-blue-900 text-white font-bold px-5 py-2 rounded mr-2"
                onClick={() => navigate(`/producto/editar/${p._id}`)}>
                Editar
              </button>
              <button className="text-gray-700 font-bold flex items-center gap-1"
                onClick={() => { setIdEliminar(p._id); setShowModal(true); }}>
                Eliminar <i className="fas fa-trash" />
              </button>
            </div>
          ))}
      </div>

      {/* Modal Eliminar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
            <h3 className="font-bold text-lg mb-2">Eliminar Producto</h3>
            <p className="mb-6">¿Estás seguro de eliminar este producto?</p>
            <div className="flex gap-4">
              <button className="bg-blue-900 text-white font-bold rounded px-6 py-2" onClick={() => setShowModal(false)}>NO</button>
              <button className="bg-gray-200 font-bold rounded px-6 py-2" onClick={handleEliminar}>Sí</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
