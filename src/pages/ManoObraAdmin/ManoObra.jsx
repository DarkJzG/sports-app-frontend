import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import React, { useEffect, useState } from "react";
import FooterA from "../../components/FooterAdmin";
import { API_URL } from "../../config";

// Modal para eliminar mano de obra
function ModalEliminarMano({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Mano de Obra</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta mano de obra?</p>
        <div className="flex gap-4">
          <button className="bg-blue-900 text-white font-bold rounded px-6 py-2" onClick={onClose}>NO</button>
          <button className="bg-gray-200 font-bold rounded px-6 py-2" onClick={onConfirm}>sí</button>
        </div>
      </div>
    </div>
  );
}

// Card para mostrar cada registro
function ManoCard({ mano, onEditar, onEliminar }) {
  return (
    <div className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm">
      <img src="/img/insumo.png" alt="icono-insumo" className="h-16 w-16 object-contain" />
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-900">Categoría pertenece</div>
        <div className="text-gray-700 mb-1">{mano.categoria_nombre}</div>
        <div className="text-sm text-gray-500">
          <b>Insumos:</b> ${parseFloat(mano.insumosTotal)}<br />
          <b>Mano de obra:</b> ${mano.total_mano_obra}<br />
          <b>Total:</b> ${mano.total}
        </div>
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

export default function ListarManoObra() {
  const [showModal, setShowModal] = useState(false);
  const [manos, setManos] = useState([]);
  const [manoIdEliminar, setManoIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/mano/all`)
      .then(res => res.json())
      .then(data => setManos(data));
  }, []);

  async function eliminarMano() {
    if (!manoIdEliminar) return;
    const res = await fetch(`${API_URL}/mano/delete/${manoIdEliminar}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) setManos(manos.filter(mano => mano._id !== manoIdEliminar));
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarA />
      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-4xl font-semibold flex-5">Mano de Obra</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <img
            className="h-10"
            src="/img/manobra.png"
            alt="logo mano obra"
          />
        </div>
      </section>
      {/* Título y botón agregar */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-8 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Mano de Obra</h2>
            <p className="text-gray-600 mt-1">Lista de mano de obra agregadas recientemente</p>
            <input className="rounded-lg px-4 py-2 mt-3 w-[220px] shadow-inner border border-gray-200 focus:outline-blue-900" placeholder="Buscar..." />
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/mano/agregar")}
          >
            Agregar Mano de Obra
          </button>
        </div>
        {/* Lista de mano de obra */}
        <div>
          {manos.map((mano) => (
            <ManoCard
              key={mano._id}
              mano={mano}
              onEditar={() => navigate(`/mano/editar/${mano._id}`)}
              onEliminar={() => { setShowModal(true); setManoIdEliminar(mano._id); }}
            />
          ))}
        </div>
      </main>
      <ModalEliminarMano
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={eliminarMano}
      />
      <FooterA />
    </div>
  );
}
