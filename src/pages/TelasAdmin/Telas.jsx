import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";

function ModalEliminarTela({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Tela</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta tela?</p>
        <div className="flex gap-4">
          <button className="bg-blue-900 text-white font-bold rounded px-6 py-2" onClick={onClose}>NO</button>
          <button className="bg-gray-200 font-bold rounded px-6 py-2" onClick={onConfirm}>sí</button>
        </div>
      </div>
    </div>
  );
}

function TelaCard({ nombre, colores, cantidad, precio_metro, imagen_url, onEditar, onEliminar }) {
  return (
    <div className="bg-[#f4f4f4] flex items-center gap-6 p-6 mb-5 rounded-xl shadow-sm">
      <img src={imagen_url || "/img/tela.png"} alt="icono-tela" className="h-16 w-16 object-contain" />
      <div className="flex-1">
        <div className="font-bold text-lg text-gray-900">{nombre}</div>
        <div className="text-sm text-gray-500 mb-1">
          <b>Colores:</b><br />
          <div className="flex gap-3 mt-1 flex-wrap">
            {colores.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: c.codigo }}></div>
                <span>{c.nombre}</span>
              </div>
            ))}
          </div>
          <b>Cantidad:</b> {cantidad} metros<br />
          <b>Precio x metro:</b> ${Number(precio_metro).toFixed(2)}
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


export default function Telas() {
  const [telas, setTelas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [telaIdEliminar, setTelaIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/tela/all")
      .then(res => res.json())
      .then(data => setTelas(data));
  }, []);

  async function eliminarTela() {
    if (!telaIdEliminar) return;
    const res = await fetch(`http://localhost:5000/tela/delete/${telaIdEliminar}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data.ok) setTelas(telas.filter(tela => tela._id !== telaIdEliminar));
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarA />
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-4xl font-semibold flex-1">Telas</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <img className="h-10" src="/img/tela.png" alt="logo tela" />
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full py-8 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Telas</h2>
            <p className="text-gray-600 mt-1">Lista de telas agregadas recientemente</p>
            <input className="rounded-lg px-4 py-2 mt-3 w-[220px] shadow-inner border border-gray-200 focus:outline-blue-900" placeholder="Buscar..." />
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/telas/agregar")}
          >
            Agregar Tela
          </button>
        </div>
        <div>
          {telas.map(tela => (
            <TelaCard
              key={tela._id}
              nombre={tela.nombre}
              colores={tela.colores}
              cantidad={tela.cantidad}
              precio_metro={tela.precio_metro}
              imagen_url={tela.imagen_url}
              onEditar={() => navigate(`/telas/editar/${tela._id}`)}
              onEliminar={() => { setShowModal(true); setTelaIdEliminar(tela._id); }}
            />

          ))}
        </div>
      </main>

      <ModalEliminarTela
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={eliminarTela}
      />

      <FooterA />
    </div>
  );
}
