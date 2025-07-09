import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";


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

function CategoriaCard({ nombre, descripcion, onEditar, onEliminar }) {
  return (
    <div className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm">
      <img src="/img/categoria.png" alt="icono-categoria" className="h-16 w-16" />
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-900">Nombre</div>
        <div className="text-gray-700 mb-1">{nombre}</div>
        <div className="text-sm text-gray-500"><b>Descripción</b><br />{descripcion}</div>
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
  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate();

  // Dummy data
  const categorias = [
    { nombre: "Copa", descripcion: "Esta categoría es para copas de deportes..." },
    { nombre: "Uniformes", descripcion: "Uniformes para diferentes deportes." },
    { nombre: "Accesorios", descripcion: "Incluye todo tipo de accesorios deportivos." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <NavbarA />


      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-3xl font-semibold flex-1">Categorías Productos</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Icono de herramienta */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17.25l1.5 1.5M16.5 13.5a4.5 4.5 0 11-6.364-6.364A4.5 4.5 0 0116.5 13.5z" />
          </svg>
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
          {categorias.map((cat, idx) => (
            <CategoriaCard
              key={idx}
              nombre={cat.nombre}
              descripcion={cat.descripcion}
              onEditar={() => alert('Editar categoría')}
              onEliminar={() => setShowModal(true)}
            />
          ))}
        </div>
      </main>

      <ModalEliminarCategoria
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => { setShowModal(false); alert('Categoría eliminada'); }}
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
