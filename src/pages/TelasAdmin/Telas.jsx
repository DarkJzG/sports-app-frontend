// src/pages/TelasAdmin/Telas.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "../../components/NavbarAdmin";
import FooterA from "../../components/FooterAdmin";
import { API_URL } from "../../config";

function ModalEliminarTela({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Eliminar Tela</h3>
        <p className="mb-6">¿Estás seguro de querer eliminar esta tela?</p>
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

function TelaCard({ tela, categoriaNombre, onEditar, onEliminar, onAgregarLote, onGestionarLotes }) {
  // Función auxiliar para separar nombre y hex
  const parseColor = (colorStr) => {
    const match = colorStr.match(/^(.*)\s\((#[0-9A-Fa-f]{6})\)$/);
    if (match) {
      return { name: match[1], hex: match[2] };
    }
    return { name: colorStr, hex: "#cccccc" }; // fallback
  };

  return (
    <div className="bg-[#f4f4f4] flex flex-col gap-4 md:flex-row md:items-center p-6 mb-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Info */}
      <div className="flex-1">
        <div className="font-bold text-xl text-gray-900">{tela.nombre}</div>
        <div className="text-sm text-gray-600 mb-2">
          <b>Código:</b> {tela.codigo_tela} <br />
          <b>Categoría:</b> {categoriaNombre} <br />
          <b>Estado:</b>{" "}
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              tela.estado === "activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {tela.estado}
          </span>
        </div>

        {/* Mostrar lotes */}
        {tela.lotes && tela.lotes.length > 0 && (
          <div className="text-sm mt-3">
            <b>Lotes:</b>
            <ul className="mt-2 space-y-2">
              {tela.lotes.map((l) => {
                const { name, hex } = parseColor(l.color);
                return (
                  <li key={l.lote_id} className="flex items-center gap-3">
                    {/* Recuadro de color */}
                    <div
                      className="w-6 h-6 rounded border shadow"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    ></div>
                    <div>
                      <span className="font-semibold">{name}</span>{" "}
                      <span className="text-gray-500">
                        → {l.cantidad}m @ ${l.precio_unitario}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 md:flex-col md:gap-3">
        <button
          className="bg-blue-900 text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          onClick={onEditar}
        >
          <i className="fas fa-pen" />
          <span>Editar</span>
        </button>

        <button
          className="bg-green-700 text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition"
          onClick={onAgregarLote}
        >
          <i className="fas fa-plus" />
          <span>Añadir Lote</span>
        </button>

        <button
          className="bg-yellow-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-400 transition"
          onClick={onGestionarLotes}
        >
          <i className="fas fa-box" />
          <span>Gestionar Lotes</span>
        </button>

        <button
          className="bg-red-600 text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-red-500 transition"
          onClick={onEliminar}
        >
          <i className="fas fa-trash" />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}


export default function Telas() {
  const [telas, setTelas] = useState([]);
  const [catgTelas, setCatgTelas] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [telaIdEliminar, setTelaIdEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/tela/all`).then((res) => res.json()).then(setTelas);
    fetch(`${API_URL}/catg_tela/all`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((c) => {
          map[c._id] = c.nombre;
        });
        setCatgTelas(map);
      });
  }, []);

  async function eliminarTela() {
    if (!telaIdEliminar) return;
    const res = await fetch(`${API_URL}/tela/delete/${telaIdEliminar}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) setTelas(telas.filter((t) => t._id !== telaIdEliminar));
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

      <main className="flex-1 max-w-6xl mx-auto w-full py-8 px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Telas</h2>
            <p className="text-gray-600 mt-1">
              Lista de telas registradas con sus lotes
            </p>
          </div>
          <button
            className="bg-blue-900 text-white text-lg font-bold px-8 py-3 rounded-xl mt-6 md:mt-0 hover:bg-blue-700 shadow"
            onClick={() => navigate("/telas/agregar")}
          >
            Agregar Tela
          </button>
        </div>

        <div>
          {telas.map((tela) => (
            <TelaCard
              key={tela._id}
              tela={tela}
              categoriaNombre={catgTelas[tela.categoria_tela] || "Sin categoría"}
              onEditar={() => navigate(`/telas/editar/${tela._id}`)}
              onAgregarLote={() => navigate(`/telas/agregar_lotes/${tela._id}`)}
              onGestionarLotes={() => navigate(`/telas/gestionar_lotes/${tela._id}`)}
              onEliminar={() => {
                setShowModal(true);
                setTelaIdEliminar(tela._id);
              }}
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
