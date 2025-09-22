// src/pages/TelasAdmin/GestionarLotes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

function ModalAccion({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[350px] max-w-md w-full">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        {children}
        <div className="mt-4 text-right">
          <button
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded font-bold hover:bg-gray-400"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Función auxiliar para separar nombre y hex
function parseColor(colorStr) {
  const match = colorStr.match(/^(.*)\s\((#[0-9A-Fa-f]{6})\)$/);
  if (match) {
    return { name: match[1], hex: match[2] };
  }
  return { name: colorStr, hex: "#cccccc" }; // fallback
}

function LoteCard({ lote, onEditar, onConsumir, onEliminar }) {
  const { name, hex } = parseColor(lote.color);

  return (
    <div className="bg-[#f7f7f7] flex flex-col md:flex-row md:items-center gap-6 p-6 mb-5 rounded-xl shadow">
      {/* Info lote */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {/* Recuadro de color */}
          <div
            className="w-8 h-8 rounded border shadow"
            style={{ backgroundColor: hex }}
            title={hex}
          ></div>
          <div className="font-bold text-lg text-gray-900">
            {name} ({lote.cantidad} m)
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-1">
          <b>Precio:</b> ${lote.precio_unitario} <br />
          <b>Fecha compra:</b> {new Date(lote.fecha_compra).toLocaleDateString()} <br />
          <b>ID Lote:</b> {lote.lote_id}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          className="bg-blue-900 text-white font-bold px-4 py-2 rounded hover:bg-blue-700"
          onClick={onEditar}
        >
          Editar
        </button>
        <button
          className="bg-yellow-500 text-white font-bold px-4 py-2 rounded hover:bg-yellow-400"
          onClick={onConsumir}
        >
          Consumir
        </button>
        <button
          className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-500"
          onClick={onEliminar}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default function GestionarLotes() {
  const { id } = useParams(); // ID de la tela
  const navigate = useNavigate();
  const [tela, setTela] = useState(null);
  const [msg, setMsg] = useState("");
  const [showConsumir, setShowConsumir] = useState(false);
  const [loteConsumir, setLoteConsumir] = useState(null);
  const [cantidadConsumir, setCantidadConsumir] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/tela/get/${id}`)
      .then((res) => res.json())
      .then((data) => setTela(data));
  }, [id]);

    const eliminarLote = async (loteId) => {
      const res = await fetch(`${API_URL}/tela/delete_lote/${id}/${encodeURIComponent(loteId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMsg(data.msg);

      if (data.ok) {
        // refrescar datos
        fetch(`${API_URL}/tela/get/${id}`)
          .then((res) => res.json())
          .then((data) => setTela(data));
      }
    };


  const consumirStock = async () => {
    if (!cantidadConsumir || cantidadConsumir <= 0) return;
    const res = await fetch(
      `${API_URL}/tela/consumir_lote_especifico/${id}/${loteConsumir.lote_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: parseFloat(cantidadConsumir) }),
      }
    );
    const data = await res.json();
    setMsg(data.msg);
    setShowConsumir(false);

    // Refrescar datos
    fetch(`${API_URL}/tela/get/${id}`)
      .then((res) => res.json())
      .then((data) => setTela(data));
  };

  if (!tela) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Gestionar Lotes</h1>
      <p className="mb-6 text-gray-600">
        Tela: <b>{tela.nombre}</b> | Código: {tela.codigo_tela}
      </p>

      <div className="mb-4 flex justify-between">
        <button
          onClick={() => navigate(`/telas/agregar_lotes/${id}`)}
          className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-blue-700"
        >
          + Agregar Lote
        </button>
        <button
          onClick={() => navigate("/telas")}
          className="bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-400"
        >
          Volver a Telas
        </button>
      </div>

      {tela.lotes && tela.lotes.length > 0 ? (
        tela.lotes.map((lote) => (
          <LoteCard
            key={lote.lote_id}
            lote={lote}
            onEditar={() => navigate(`/telas/${id}/editar_lotes/${lote.lote_id}`)}
            onConsumir={() => {
              setLoteConsumir(lote);
              setShowConsumir(true);
            }}
            onEliminar={() => eliminarLote(encodeURIComponent(lote.lote_id))}

          />
        ))
      ) : (
        <p className="text-gray-600">No hay lotes registrados.</p>
      )}

      {msg && (
        <div className="text-center text-lg mt-4 font-bold text-blue-900">
          {msg}
        </div>
      )}

      {/* Modal consumir */}
      <ModalAccion
        show={showConsumir}
        title={`Consumir stock del lote ${loteConsumir?.color}`}
        onClose={() => setShowConsumir(false)}
      >
        <input
          type="number"
          step="0.01"
          placeholder="Cantidad a consumir"
          className="w-full border rounded px-3 py-2 mb-4"
          value={cantidadConsumir}
          onChange={(e) => setCantidadConsumir(e.target.value)}
        />
        <button
          onClick={consumirStock}
          className="bg-yellow-500 text-white font-bold px-6 py-2 rounded hover:bg-yellow-400"
        >
          Consumir
        </button>
      </ModalAccion>
    </div>
  );
}
