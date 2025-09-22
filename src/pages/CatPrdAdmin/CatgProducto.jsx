// src/pages/CatgProductoAdmin/CatgProducto.jsx
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

// Modal de confirmación de eliminación
function ModalEliminarCategoria({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Categoría</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta categoría de producto?</p>
        <div className="flex gap-4">
          <button
            className="bg-blue-900 text-white font-bold rounded px-6 py-2"
            onClick={onClose}
          >
            NO
          </button>
          <button
            className="bg-gray-200 font-bold rounded px-6 py-2"
            onClick={onConfirm}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}

// Tarjeta de categoría
function CategoriaCard({ nombre, descripcion, imagen_url, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition cursor-pointer">
      <div className="h-40 w-full bg-[#f4f4f4] flex items-center justify-center">
        <img
          src={imagen_url || "/img/categoria.png"}
          alt={nombre}
          className="h-full object-contain"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{nombre}</h3>
        <p className="text-gray-600 text-sm flex-1">{descripcion}</p>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 bg-blue-900 text-white font-bold px-3 py-2 rounded hover:bg-blue-700 transition"
            onClick={onEditar}
          >
            Editar
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-800 font-bold px-3 py-2 rounded hover:bg-gray-300 transition"
            onClick={onEliminar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriasProductos() {
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaIdEliminar, setCategoriaIdEliminar] = useState(null);
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    fetch(`${API_URL}/catg_prod/all`)
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  async function eliminarCategoria() {
    if (!categoriaIdEliminar) return;
    const res = await fetch(`${API_URL}/catg_prod/delete/${categoriaIdEliminar}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) setCategorias(categorias.filter(cat => cat._id !== categoriaIdEliminar));
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* NAVBAR */}
      <NavbarA />

      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-4xl font-semibold flex-1">Categorías de Productos</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <img className="h-10" src="/img/catg.png" alt="icono categoría" />
        </div>
      </section>

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Categorías</h2>
            <p className="text-gray-600 mt-1">Lista de categorías de producto registradas</p>
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/catgPrd/agregar")}
          >
            Agregar Categoría
          </button>
        </div>

        {/* Grid de categorías */}
        {categorias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categorias.map((cat) => (
              <CategoriaCard
                key={cat._id}
                nombre={cat.nombre}
                descripcion={cat.descripcion}
                imagen_url={cat.imagen_url}
                onEditar={() => navigate(`/catgPrd/editar/${cat._id}`)}
                onEliminar={() => {
                  setShowModal(true);
                  setCategoriaIdEliminar(cat._id);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No hay categorías registradas aún</p>
        )}
      </main>

      {/* Modal */}
      <ModalEliminarCategoria
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={eliminarCategoria}
      />

      {/* Footer */}
      <FooterA />
    </div>
  );
}
