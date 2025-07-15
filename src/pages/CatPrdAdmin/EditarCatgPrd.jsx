import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(""); // URL actual
  const [nuevaImagen, setNuevaImagen] = useState(null); // File para nueva imagen
  const [cargandoImg, setCargandoImg] = useState(false);
  const [msg, setMsg] = useState("");

  // Cargar la categoría al montar
  useEffect(() => {
    fetch(`http://localhost:5000/catg/get/${id}`)
      .then(res => res.json())
      .then(cat => {
        setNombre(cat.nombre);
        setDescripcion(cat.descripcion);
        setImagen(cat.imagen_url);
      });
  }, [id]);

  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    setCargandoImg(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'categoria_prd_preset'); // pon tu upload_preset real aquí
    // Opcional: poner en carpeta específica
    data.append('folder', 'categoria_prd');
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", // reemplaza tu cloud name
      { method: "POST", body: data }
    );
    const img = await res.json();
    setCargandoImg(false);
    return img.secure_url;
  };

  // Manejar el envío del formulario
  const handleActualizar = async (e) => {
    e.preventDefault();
    let imagen_url = imagen;
    if (nuevaImagen) {
      imagen_url = await uploadImageToCloudinary(nuevaImagen);
    }
    const res = await fetch(`http://localhost:5000/catg/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, descripcion, imagen_url }),
    });
    const data = await res.json();
    setMsg(data.msg);
    if (data.ok) setTimeout(() => navigate("/catgPrd"), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ...tu header/navbar... */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Editar Categoría de Producto</h2>
        <form onSubmit={handleActualizar} className="flex flex-col md:flex-row gap-10 items-start">
          {/* Imagen actual y subir nueva */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
              <img
                src={nuevaImagen ? URL.createObjectURL(nuevaImagen) : imagen}
                alt="img-cat"
                className="h-20 w-20 object-contain"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={e => setNuevaImagen(e.target.files[0])}
            />
            {cargandoImg && <span className="text-blue-700">Subiendo imagen...</span>}
          </div>
          {/* Formulario */}
          <div className="flex flex-col gap-7 flex-1">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Nombre Categoría</label>
              <input
                className="w-full bg-transparent outline-none mt-1 border-none"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Descripción</label>
              <textarea
                className="w-full bg-transparent outline-none mt-1 border-none"
                rows={3}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={cargandoImg}
              className="bg-blue-900 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-blue-700 w-full max-w-xs mx-auto"
            >
              Actualizar Cambios
            </button>
            {msg && <p className="text-center text-blue-900 font-bold">{msg}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}
