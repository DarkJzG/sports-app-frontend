// src/pages/TelasAdmin/EditarLotes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function EditarLote() {
  const { id, loteId } = useParams(); // ID de la tela y del lote
  const navigate = useNavigate();

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // 🔹 Obtener tela y buscar lote
    fetch(`${API_URL}/tela/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const lote = data.lotes.find((l) => l.lote_id === loteId);
        if (lote) {
          // Parsear color (Nombre (HEX))
          const match = lote.color.match(/^(.*)\s\((#[0-9A-Fa-f]{6})\)$/);
          if (match) {
            setColorName(match[1]);
            setColorHex(match[2]);
          } else {
            setColorName(lote.color);
          }

          setCantidad(lote.cantidad);
          setPrecioUnitario(lote.precio_unitario);
          setFechaCompra(lote.fecha_compra?.split("T")[0] || "");
        }
      });
  }, [id, loteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colorName || !cantidad || !precioUnitario) {
      setMsg("Todos los campos son obligatorios");
      return;
    }

    const data = {
      color: `${colorName} (${colorHex})`,
      cantidad: parseFloat(cantidad),
      precio_unitario: parseFloat(precioUnitario),
      fecha_compra: fechaCompra || new Date().toISOString(),
    };

    const res = await fetch(`${API_URL}/tela/update_lote/${id}/${loteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate(`/telas/gestionar_lotes/${id}`), 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Lote</h1>
      <p className="mb-8 text-gray-600">
        Modifica los datos del lote seleccionado
      </p>

      <form
        className="max-w-3xl mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        {/* Color */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Color</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-12 h-12 border rounded cursor-pointer"
            />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none border-b-2 border-gray-300"
              placeholder="Ejemplo: Azul Marino"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
          </div>
        </div>

        {/* Cantidad */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Cantidad (metros)</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        {/* Precio Unitario */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Precio Unitario ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
          />
        </div>

        {/* Fecha de compra */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Fecha de Compra</label>
          <input
            type="date"
            className="w-full bg-white border rounded px-3 py-2 mt-1"
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl shadow hover:bg-blue-700 w-full"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate(`/telas/gestionar_lotes`)}
            className="bg-gray-300 text-gray-800 font-bold text-xl px-8 py-4 rounded-xl shadow hover:bg-gray-400 w-full"
          >
            Cancelar
          </button>
        </div>

        {/* Mensajes */}
        {msg && (
          <div
            className={`text-center text-lg mt-2 font-bold ${
              msg.toLowerCase().includes("error")
                ? "text-red-600"
                : "text-blue-900"
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
