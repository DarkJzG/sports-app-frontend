// src/pages/CatgTelaAdmin/CatgTelas.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";

// Modal de confirmación
function ModalEliminarCatgTela({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Categoría</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta categoría de tela?</p>
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

// Tarjeta de categoría de tela
function CatgTelaCard({ nombre, abreviatura, descripcion, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition cursor-pointer">
      <div className="h-32 w-full bg-[#f4f4f4] flex items-center justify-center">
        <span className="text-4xl font-bold text-blue-900">{abreviatura}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{nombre}</h3>
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

export default function CatgTelas() {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [catgIdEliminar, setCatgIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/catg_tela/all")
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  async function eliminarCatgTela() {
    if (!catgIdEliminar) return;
    const res = await fetch(`http://localhost:5000/catg_tela/delete/${catgIdEliminar}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) setCategorias(categorias.filter(cat => cat._id !== catgIdEliminar));
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <NavbarA />

      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-4xl font-semibold flex-1">Categorías de Tela</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <img className="h-10" src="/img/tela.png" alt="logo tela" />
        </div>
      </section>

      {/* Contenido */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Categorías</h2>
            <p className="text-gray-600 mt-1">Lista de categorías de tela registradas</p>
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/catg_tela/agregar")}
          >
            Agregar Categoría
          </button>
        </div>

        {/* Grid */}
        {categorias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categorias.map(cat => (
              <CatgTelaCard
                key={cat._id}
                nombre={cat.nombre}
                abreviatura={cat.abreviatura}
                descripcion={cat.descripcion}
                onEditar={() => navigate(`/catg_tela/editar/${cat._id}`)}
                onEliminar={() => {
                  setShowModal(true);
                  setCatgIdEliminar(cat._id);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No hay categorías registradas aún</p>
        )}
      </main>

      <ModalEliminarCatgTela
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={eliminarCatgTela}
      />

      <FooterA />
    </div>
  );
}
