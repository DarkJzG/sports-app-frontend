// src/pages/TelasAdmin/AgregarLotes.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AgregarLotes() {
  const { id } = useParams(); // ID de la tela
  const navigate = useNavigate();

  const [colorHex, setColorHex] = useState("#000000"); // hex del color
  const [colorNombre, setColorNombre] = useState(""); // nombre del color
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colorHex || !colorNombre || !cantidad || !precioUnitario) {
      setMsg("Todos los campos son obligatorios");
      return;
    }

    const data = {
      color: `${colorNombre} (${colorHex})`, // guardamos nombre + hex
      cantidad: parseFloat(cantidad),
      precio_unitario: parseFloat(precioUnitario),
      fecha_compra: fechaCompra || new Date().toISOString(),
    };

    const res = await fetch(`${API_URL}/tela/add_lote/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();

    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate(`/telas/gestionar_lotes/${id}`), 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Agregar Lote</h1>
      <p className="mb-8 text-gray-600">Complete los datos del nuevo lote para esta tela</p>

      <form className="max-w-3xl mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
        
        {/* Color con paleta + nombre */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 flex flex-col gap-3">
          <label className="font-bold">Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-12 h-12 rounded border cursor-pointer"
            />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none border-b border-gray-400"
              placeholder="Ejemplo: Azul Marino"
              value={colorNombre}
              onChange={(e) => setColorNombre(e.target.value)}
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
            placeholder="Ejemplo: 150"
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
            placeholder="Ejemplo: 12.50"
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
            Agregar Lote
          </button>
          <button
            type="button"
            onClick={() => navigate(`/telas`)}
            className="bg-gray-300 text-gray-800 font-bold text-xl px-8 py-4 rounded-xl shadow hover:bg-gray-400 w-full"
          >
            Cancelar
          </button>
        </div>

        {/* Mensajes */}
        {msg && (
          <div
            className={`text-center text-lg mt-2 font-bold ${
              msg.toLowerCase().includes("error") ? "text-red-600" : "text-blue-900"
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
