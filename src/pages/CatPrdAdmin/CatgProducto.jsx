
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import React, { useEffect, useState } from "react";

import { API_URL } from "../../config";


// Componente para el modal de confirmación de eliminación
function ModalEliminarCategoria({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Categoría</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta categoría de producto?</p>
        <div className="flex gap-4">
          <button className="bg-blue-900 text-white font-bold rounded px-6 py-2" onClick={onClose}>NO</button>
          <button className="bg-gray-200 font-bold rounded px-6 py-2" onClick={onConfirm}>sí</button>
        </div>
      </div>
    </div>
  );
}

function CategoriaCard({ nombre, descripcion, imagen_url, onEditar, onEliminar }) {
  return (
    <div className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm">
      <img src={imagen_url || "/img/categoria.png"} alt="icono-categoria" className="h-16 w-16 object-contain" />
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-900">{nombre}</div>
        <div className="text-sm text-gray-500 mb-1"><b>Descripción</b><br />{descripcion}</div>
      </div>
      <button className="bg-blue-900 text-white font-bold px-5 py-2 rounded mr-2 flex items-center gap-2" onClick={onEditar}>
        <span>EDITAR</span>
        <i className="fas fa-pen" />
      </button>
      <button className="text-gray-700 font-bold flex items-center gap-1" onClick={onEliminar}>
        <span>ELIMINAR</span>
        <i className="fas fa-trash" />
      </button>
    </div>
  );
}

export default function CategoriasProductos() {
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaIdEliminar, setCategoriaIdEliminar] = useState(null);
  const navigate = useNavigate();

  // Cargar categorías de la API
  useEffect(() => {
    fetch(`${API_URL}/catg/all`)
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  async function eliminarCategoria() {
  if (!categoriaIdEliminar) return;
  const res = await fetch(`${API_URL}/catg/delete/${categoriaIdEliminar}`, {
    method: "DELETE",
  });
  const data = await res.json();
  // Quita la categoría eliminada de la lista sin recargar
  if (data.ok) setCategorias(categorias.filter(cat => cat._id !== categoriaIdEliminar));
  setShowModal(false);
}

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <NavbarA />


      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-4xl font-semibold flex-5">Categorías Productos</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <img
            className="h-10"
            src="/img/catg.png"
            alt="website logo"
          />
        </div>
      </section>


      {/* Título y botón agregar */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-8 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Categorías Productos</h2>
            <p className="text-gray-600 mt-1">Lista de categorías agregadas recientemente</p>
            <input className="rounded-lg px-4 py-2 mt-3 w-[220px] shadow-inner border border-gray-200 focus:outline-blue-900" placeholder="Buscar..." />
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/catgPrd/agregar")}
          >
            Agregar Categoría
          </button>
        </div>
        {/* Lista de categorías */}
        <div>
          {categorias.map((cat) => (
          <CategoriaCard
          key={cat._id}
          nombre={cat.nombre}
          descripcion={cat.descripcion}
          imagen_url={cat.imagen_url}
          onEditar={() => navigate(`/catgPrd/editar/${cat._id}`)}
          onEliminar={() => { setShowModal(true); setCategoriaIdEliminar(cat._id); }}
        />
      ))}
      </div>

      </main>

      <ModalEliminarCategoria
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={eliminarCategoria}
      />
      

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-10 px-8 py-6 flex flex-col md:flex-row justify-between items-center">
        <span className="font-bold text-xl">Johan Sports</span>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="/"><i className="fab fa-facebook text-2xl"></i></a>
          <a href="/"><i className="fab fa-instagram text-2xl"></i></a>
          <a href="/"><i className="fab fa-youtube text-2xl"></i></a>
        </div>
      </footer>
    </div>
  );
}
