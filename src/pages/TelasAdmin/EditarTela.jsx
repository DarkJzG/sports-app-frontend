import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarTela() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [colores, setColores] = useState([{ nombre: "", codigo: "#000000" }]);
  const [cantidad, setCantidad] = useState("");
  const [precioMetro, setPrecioMetro] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/tela/get/${id}`)
      .then(res => res.json())
      .then(tela => {
        setNombre(tela.nombre);
        setColores(tela.colores || [{ nombre: "", codigo: "#000000" }]);
        setCantidad(tela.cantidad);
        setPrecioMetro(tela.precio_metro);
        setImagenUrl(tela.imagen_url);
      });
  }, [id]);

  // Subir imagen automáticamente al seleccionar archivo
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCargando(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'telas_folder'); // TU UPLOAD PRESET
    data.append('folder', 'telas');
    const res = await fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST",
      body: data
    });
    const img = await res.json();
    setImagenUrl(img.secure_url);
    setCargando(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre || !colores || !cantidad || !precioMetro || !imagenUrl) {
      setMsg("Todos los campos e imagen son requeridos");
      return;
    }
    const data = {
      nombre,
      colores,
      cantidad,
      precio_metro: precioMetro,
      imagen_url: imagenUrl
    };
    const res = await fetch(`http://localhost:5000/tela/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/telas"), 1200);
  };

  const actualizarColor = (index, campo, valor) => {
    const nuevosColores = [...colores];
    nuevosColores[index][campo] = valor;
    setColores(nuevosColores);
  };

  const agregarColor = () => {
    setColores([...colores, { nombre: "", codigo: "#000000" }]);
  };

  const eliminarColor = (index) => {
    const nuevosColores = colores.filter((_, i) => i !== index);
    setColores(nuevosColores);
  };


  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Tela</h1>
      <p className="mb-8 text-gray-600">Complete los campos solicitados para modificar la tela</p>
      <form className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
            {imagenUrl
              ? <img src={imagenUrl} alt="img-tela" className="h-36 w-36 object-contain" />
              : <span className="text-4xl">📷</span>
            }
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={cargando}
          />
          {cargando && <div className="text-blue-800 mt-2 font-semibold">Subiendo imagen...</div>}
        </div>
        {/* Campos */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Nombre Tela</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              value={nombre}
              onChange={e => setNombre(e.target.value)} />
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Colores</label>
            {colores.map((c, i) => (
              <div key={i} className="flex gap-2 items-center mt-2">
                <input
                  type="text"
                  placeholder="Nombre del color"
                  value={c.nombre}
                  onChange={e => actualizarColor(i, "nombre", e.target.value)}
                  className="flex-1 bg-white border px-2 py-1 rounded"
                />
                <input
                  type="color"
                  value={c.codigo}
                  onChange={e => actualizarColor(i, "codigo", e.target.value)}
                  className="w-10 h-10 rounded"
                />
                {colores.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarColor(i)}
                    className="text-red-500 font-bold"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={agregarColor}
              className="mt-3 text-sm text-blue-900 font-semibold"
            >
              + Agregar otro color
            </button>
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Cantidad en metros</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
              type="number"
              min={0} />
          </div>
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Precio x metro</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              value={precioMetro}
              onChange={e => setPrecioMetro(e.target.value)}
              type="number"
              min={0} />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full"
            disabled={cargando}
          >Actualizar Cambios</button>
          {msg && (
            <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>
          )}
        </div>
      </form>
    </div>
  );
}
