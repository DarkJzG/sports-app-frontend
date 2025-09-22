// src/pages/CatgTelaAdmin/EditarCatgTela.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarCatgTela() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/catg_tela/get/${id}`)
      .then(res => res.json())
      .then(cat => {
        setNombre(cat.nombre || "");
        setAbreviatura(cat.abreviatura || "");
        setDescripcion(cat.descripcion || "");
      })
      .catch(err => console.error("Error cargando categoría:", err));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre || !abreviatura || !descripcion) {
      setMsg("Todos los campos son obligatorios");
      return;
    }

    const data = { nombre, abreviatura, descripcion };

    const res = await fetch(`http://localhost:5000/catg_tela/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/catg_tela"), 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Categoría de Tela</h1>
      <p className="mb-8 text-gray-600">
        Modifique los campos de la categoría seleccionada
      </p>

      <form
        className="max-w-3xl mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        {/* Nombre */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Nombre</label>
          <input
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        {/* Abreviatura */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Abreviatura</label>
          <input
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={abreviatura}
            onChange={e => setAbreviatura(e.target.value)}
            maxLength={5}
          />
        </div>

        {/* Descripción */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Descripción</label>
          <textarea
            className="w-full bg-transparent outline-none mt-1 border-none resize-none"
            rows="3"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full"
        >
          Actualizar Cambios
        </button>

        {msg && (
          <div className="text-center text-lg mt-2 font-bold text-blue-900">
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
