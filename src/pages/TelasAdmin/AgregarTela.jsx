import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AgregarTela() {
  const [nombre, setNombre] = useState("");
  const [precioMetro, setPrecioMetro] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const [colorNombre, setColorNombre] = useState("");
  const [colorCodigo, setColorCodigo] = useState("#000000");
  const [colores, setColores] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCargando(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "telas_folder");
    data.append("folder", "telas");

    const res = await fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST",
      body: data,
    });
    const img = await res.json();
    setImagenUrl(img.secure_url);
    setCargando(false);
  };

  const agregarColor = () => {
    if (colorNombre.trim() === "") return;
    if (colores.length >= 10) return;
    setColores([...colores, { nombre: colorNombre, codigo: colorCodigo }]);
    setColorNombre("");
    setColorCodigo("#000000");
  };

  const eliminarColor = (index) => {
    setColores(colores.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precioMetro || !cantidad || colores.length === 0 || !imagenUrl) {
      setMsg("Todos los campos son obligatorios, incluyendo colores e imagen");
      return;
    }

    const data = {
      nombre,
      precio_metro: parseFloat(precioMetro),
      cantidad: parseFloat(cantidad),
      colores,
      imagen_url: imagenUrl
    };

    const res = await fetch("http://localhost:5000/tela/add", {
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
      <p className="mb-8 text-gray-600">Complete los campos solicitados para agregar una nueva tela</p>
      <form className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8" onSubmit={handleSubmit}>
        {/* Imagen */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
            {imagenUrl
              ? <img src={imagenUrl} alt="img-tela" className="h-36 w-36 object-contain" />
              : <span className="text-4xl">📷</span>}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={cargando} />
          {cargando && <div className="text-blue-800 mt-2 font-semibold">Subiendo imagen...</div>}
        </div>

        {/* Datos */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Nombre Tela</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Escribe el nombre..." />
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Precio x metro</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              type="number" step="0.01" min={0}
              value={precioMetro} onChange={e => setPrecioMetro(e.target.value)} placeholder="$0.00" />
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Cantidad disponible</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              type="number" min={0}
              value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Metros..." />
          </div>

          {/* Selección de colores */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Colores disponibles</label>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                placeholder="Nombre del color"
                className="bg-white border rounded px-3 py-1 w-1/2"
                value={colorNombre}
                onChange={e => setColorNombre(e.target.value)}
              />
              <input
                type="color"
                value={colorCodigo}
                onChange={e => setColorCodigo(e.target.value)}
                className="w-10 h-10"
              />
              <button
                type="button"
                onClick={agregarColor}
                className="bg-blue-900 text-white px-4 py-2 rounded"
              >
                Agregar
              </button>
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              {colores.map((c, i) => (
                <div key={i} className="flex flex-col items-center text-sm">
                  <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: c.codigo }} title={c.nombre}></div>
                  <span>{c.nombre}</span>
                  <button onClick={() => eliminarColor(i)} className="text-red-500 text-xs">Eliminar</button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full"
            disabled={cargando}
          >
            Agregar Tela
          </button>

          {msg && <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
