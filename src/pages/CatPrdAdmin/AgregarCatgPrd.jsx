import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AgregarCategoria() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // 1. Subir imagen a Cloudinary (frontend)
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "categoria_prd_preset"); // <- pon aquí tu preset
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
      setMsg("Completa todos los campos e imagen");
      return;
    }
    setCargando(true);

    // 2. Subir imagen a Cloudinary primero
    let imagen_url = "";
    try {
      imagen_url = await uploadImageToCloudinary(imagen);
    } catch {
      setMsg("Error subiendo la imagen a Cloudinary");
      setCargando(false);
      return;
    }

    // 3. Enviar datos a backend
    try {
      const res = await fetch(`${API_URL}/catg/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, imagen_url }),
      });
      const data = await res.json();
      setMsg(data.msg);
      setCargando(false);
      if (data.ok) setTimeout(() => navigate("/admin"), 1200);
    } catch {
      setMsg("Error al conectar con el servidor");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Agregar Categoría de Producto</h2>
        <p className="text-gray-600 mb-10">Complete los campos solicitados para agregar una nueva categoría</p>
        <form className="flex flex-col md:flex-row gap-10 items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
              {imagen ? (
                <img src={URL.createObjectURL(imagen)} alt="preview" className="h-32 w-32 object-contain" />
              ) : (
                <svg className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              )}
            </div>
            <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
          </div>
          <div className="flex flex-col gap-7 flex-1">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Nombre Categoría</label>
              <input
                className="w-full bg-transparent outline-none mt-1 border-none"
                placeholder="Escribe el nombre..."
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Descripción</label>
              <textarea
                className="w-full bg-transparent outline-none mt-1 border-none"
                rows={3}
                placeholder="Escribe la descripción de la categoría"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="bg-blue-900 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-blue-700 w-full max-w-xs mx-auto"
            >
              {cargando ? "Agregando..." : "Agregar Categoría"}
            </button>
            {msg && <p className="text-center text-red-500">{msg}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}
