// src/pages/CatgProductoAdmin/EditarCatgPrd.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { set } from "@cloudinary/url-gen/actions/variable";

export default function EditarCatgPrd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
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
  const [imagenUrl, setImagenUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar datos actuales de la categoría
  useEffect(() => {
    fetch(`${API_URL}/catg_prod/get/${id}`)
      .then(res => res.json())
      .then(cat => {
        setNombre(cat.nombre || "");
        setDescripcion(cat.descripcion || "");
        setImagenUrl(cat.imagen_url || "");
        setInsumos(cat.insumos_posibles || []);
      })
      .catch(err => console.error("Error cargando categoría:", err));
  }, [id]);

  // Subir nueva imagen a Cloudinary
  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setCargando(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "categoria_prd_preset"); // tu preset de Cloudinary
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
        method: "POST",
        body: data,
      });
      const img = await res.json();
      setImagenUrl(img.secure_url);
    } catch {
      setMsg("Error subiendo la imagen");
    }
    setCargando(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre || !descripcion || !imagenUrl) {
      setMsg("Todos los campos son obligatorios");
      return;
    }

    const data = { nombre, descripcion, insumos_posibles: insumos, imagen_url: imagenUrl };

    const res = await fetch(`${API_URL}/catg_prod/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/catgPrd"), 1200);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Categoría de Producto</h1>
      <p className="mb-8 text-gray-600">Modifique los campos de la categoría seleccionada</p>

      <form className="max-w-3xl mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
          <label className="font-bold">Nombre</label>
          <input
            className="w-full bg-transparent outline-none mt-1 border-none"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
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

        {/* Imagen */}
        <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 flex flex-col items-center">
          <label className="font-bold mb-2">Imagen</label>
          <div className="w-40 h-40 bg-[#eaeaea] rounded-lg flex items-center justify-center mb-3">
            {imagenUrl ? (
              <img src={imagenUrl} alt="preview" className="h-24 w-24 object-contain" />
            ) : (
              <span className="text-3xl">📷</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={cargando} />
          {cargando && <div className="text-blue-900 font-semibold mt-2">Subiendo imagen...</div>}
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
          className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full"
          disabled={cargando}
        >
          Actualizar Cambios
        </button>

        {msg && <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>}
      </form>
    </div>
  );
}
