// src/pages/CatgProductoAdmin/AgregarCatgPrd.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AgregarCatgPrd() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState([]);
  const posiblesInsumos = [
    "hilo",
    "cierre", 
    "elastico",
    "etiqueta",
    "rif",
    "cordones",
    "fajas"
  ];


  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "categoria_prd_preset"); // tu preset en Cloudinary
    const res = await fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST",
      body: data,
    });
    const img = await res.json();
    return img.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !imagen) {
      setMsg("Todos los campos son obligatorios");
      return;
    }
    setCargando(true);

    let imagen_url = "";
    try {
      imagen_url = await uploadImageToCloudinary(imagen);
    } catch {
      setMsg("Error subiendo la imagen");
      setCargando(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/catg_prod/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ nombre, descripcion, imagen_url, insumos_posibles: insumos })

      });
      const data = await res.json();
      setMsg(data.msg);
      setCargando(false);
      if (data.ok) setTimeout(() => navigate("/catgPrd"), 1200);
    } catch {
      setMsg("Error de conexión con el servidor");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Agregar Categoría de Producto</h1>
      <p className="mb-8 text-gray-600">Complete los campos solicitados para agregar una nueva categoría</p>
      <form className="max-w-3xl mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Nombre</label>
          <input
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Camisetas"
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
            placeholder="Ej: Prendas deportivas de manga corta"
          />
        </div>

        {/* Imagen */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 flex flex-col items-center">
          <label className="font-bold mb-2">Imagen</label>
          <div className="w-40 h-40 bg-[#eaeaea] rounded-lg flex items-center justify-center mb-3">
            {imagen ? (
              <img src={URL.createObjectURL(imagen)} alt="preview" className="h-24 w-24 object-contain" />
            ) : (
              <span className="text-3xl">📷</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
        </div>

        
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold mb-2">Insumos</label>
          <div className="flex flex-wrap gap-3">
            {posiblesInsumos.map((ins) => (
              <label key={ins} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={insumos.includes(ins)}
                  onChange={(e) => {
                    if (e.target.checked) setInsumos([...insumos, ins]);
                    else setInsumos(insumos.filter((i) => i !== ins));
                  }}
                />
                {ins}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full"
        >
          {cargando ? "Agregando..." : "Agregar Categoría"}
        </button>

        {msg && <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>}
      </form>
    </div>
  );
}
