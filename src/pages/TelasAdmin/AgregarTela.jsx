// src/pages/TelasAdmin/AgregarTela.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AgregarTela() {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("activo");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [relacionProd, setRelacionProd] = useState([]);
  const [catgProd, setCatgProd] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Cargar categorías de tela
    fetch(`${API_URL}/catg_tela/all`)
      .then(res => res.json())
      .then(data => setCategorias(data));

    // 🔹 Cargar categorías de producto
    fetch(`${API_URL}/catg_prod/all`)
      .then(res => res.json())
      .then(data => setCatgProd(data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre || !categoria) {
      setMsg("Nombre y categoría son obligatorios");
      return;
    }

    const data = {
      nombre,
      categoria_tela: categoria,
      estado,
      relacion_catg_prod: relacionProd,
    };

    // 🔹 Aquí estaba el error: ahora usamos API_URL
    const res = await fetch(`${API_URL}/tela/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/telas"), 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Agregar Tela</h1>
      <p className="mb-8 text-gray-600">Complete los campos solicitados</p>
      <form className="max-w-3xl mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
        
        {/* Nombre */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Nombre Tela</label>
          <input
            className="w-full bg-transparent outline-none mt-1 border-none"
            placeholder="Ejemplo: Jersey algodón"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        {/* Categoría de Tela */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Categoría de Tela</label>
          <select
            className="w-full bg-white border rounded px-3 py-2 mt-1"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Seleccione categoría...</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Relación con categorías de producto */}
      <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
        <label className="font-bold">Relación con Categorías de Producto</label>
        <div className="flex flex-wrap gap-3 mt-3">
          {catgProd.map(cat => {
            const seleccionado = relacionProd.includes(cat._id);
            return (
              <div
                key={cat._id}
                className={`flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer shadow-sm 
                  ${seleccionado ? "border-blue-700 bg-blue-100" : "border-gray-300"}`}
                onClick={() => {
                  if (seleccionado) {
                    setRelacionProd(relacionProd.filter(id => id !== cat._id));
                  } else {
                    setRelacionProd([...relacionProd, cat._id]);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={seleccionado}
                  readOnly
                  className="w-4 h-4"
                />
                <span className="text-sm">{cat.nombre}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Selecciona una o varias categorías relacionadas.
        </p>
      </div>


        {/* Estado */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Estado</label>
          <select
            className="w-full bg-white border rounded px-3 py-2 mt-1"
            value={estado}
            onChange={e => setEstado(e.target.value)}
          >
            <option value="activo">Activo</option>
            <option value="descontinuado">Descontinuado</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl shadow hover:bg-blue-700 w-full"
          >
            Agregar Tela
          </button>
          <button
            type="button"
            onClick={() => navigate("/telas")}
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
