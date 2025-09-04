// src/pages/ModeloIA/GenerarImagenStable.jsx
import React, { useState } from "react";
import { BACKEND_URL } from "../../config";

export default function GenerarImagenStable() {
  const [form, setForm] = useState({
    categoria: "camiseta",
    estilo: "deportivo",
    tela: "poliéster",
    color_principal: "blanco",
    color_secundario: "ninguno",
    patron: "liso",
  });

  const [imagenes, setImagenes] = useState([]);
  const [imgSeleccionada, setImgSeleccionada] = useState(null);
  const [msg, setMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const generate = async () => {
    setMsg("Generando imágenes...");
    setImagenes([]);
    setImgSeleccionada(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/stable/generar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, num_imgs: 3 })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error en generación");

      setImagenes(json.images_base64);
      setMsg("✅ Imágenes generadas, selecciona tu favorita");
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Generador SD de Ropa Deportiva</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <label>
          Categoría
          <select name="categoria" value={form.categoria} onChange={onChange} className="w-full p-2 border rounded">
            <option>camiseta</option>
            <option>pantalón</option>
            <option>pantaloneta</option>
            <option>chompa</option>
          </select>
        </label>
        <label>
          Estilo
          <select name="estilo" value={form.estilo} onChange={onChange} className="w-full p-2 border rounded">
            <option>deportivo</option>
            <option>casual</option>
            <option>urbano</option>
          </select>
        </label>
        <label>
          Tela
          <select name="tela" value={form.tela} onChange={onChange} className="w-full p-2 border rounded">
            <option>algodón</option>
            <option>poliéster</option>
            <option>licra</option>
          </select>
        </label>
        <label>
          Color principal
          <input name="color_principal" value={form.color_principal} onChange={onChange} className="w-full p-2 border rounded" />
        </label>
        <label>
          Color secundario
          <input name="color_secundario" value={form.color_secundario} onChange={onChange} className="w-full p-2 border rounded" />
        </label>
        <label>
          Patrón
          <input name="patron" value={form.patron} onChange={onChange} className="w-full p-2 border rounded" />
        </label>
      </div>

      <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Generar Imágenes
      </button>

      <p className="mt-3 text-gray-700">{msg}</p>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {imagenes.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Variante ${idx+1}`}
            className={`max-h-[200px] rounded cursor-pointer border-4 ${imgSeleccionada === img ? "border-blue-600" : "border-transparent"}`}
            onClick={() => setImgSeleccionada(img)}
          />
        ))}
      </div>

      {imgSeleccionada && (
        <div className="mt-4">
          <p className="font-medium">Has seleccionado esta prenda:</p>
          <img src={imgSeleccionada} alt="Seleccionada" className="max-h-[400px] rounded mt-2" />
        </div>
      )}
    </div>
  );
}
