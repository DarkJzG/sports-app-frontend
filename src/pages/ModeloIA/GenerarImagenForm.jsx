// src/pages/ModeloIA/GenerarImagenForm.jsx
import React, { useState } from "react";
import { BACKEND_URL } from "../../config";

export default function GenerarImagenForm() {
  const [form, setForm] = useState({
    categoria: "camiseta",
    estilo: "deportivo",
    tela: "algodón",
    color_principal: "blanco",
    color_secundario: "ninguno",
    color_terciario: "ninguno",
    mangas: "cortas",
    cuello: "redondo",
    patron: "ninguno",
    talla: "M",
    genero: "unisex",
  });

  const [img64, setImg64] = useState(null);
  const [msg, setMsg] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const generate = async () => {
    setMsg("Generando imagen...");
    setImg64(null);
    setDescripcion("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/ia/generar_v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.detail || "Fallo en generación");
      setImg64(`data:image/jpeg;base64,${json.image_base64}`);
      setDescripcion(json.meta?.descripcion || "");
      setMsg("✅ Imagen generada con éxito");
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Generador de Prendas Deportivas</h1>

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow">
        <label>
          Categoría
          <select name="categoria" value={form.categoria} onChange={onChange} className="w-full p-2 border rounded">
            <option>camiseta</option>
            <option>pantalón</option>
            <option>pantaloneta</option>
            <option>chompa</option>
            <option>conjunto interno</option>
            <option>conjunto externo</option>
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
            <option>poliester</option>
            <option>licra</option>
            <option>nailon</option>
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
          Color terciario
          <input name="color_terciario" value={form.color_terciario} onChange={onChange} className="w-full p-2 border rounded" />
        </label>

        <label>
          Mangas
          <select name="mangas" value={form.mangas} onChange={onChange} className="w-full p-2 border rounded">
            <option>cortas</option>
            <option>largas</option>
          </select>
        </label>

        <label>
          Cuello
          <select name="cuello" value={form.cuello} onChange={onChange} className="w-full p-2 border rounded">
            <option>redondo</option>
            <option>v</option>
            <option>polo</option>
          </select>
        </label>

        <label>
          Patrón
          <select name="patron" value={form.patron} onChange={onChange} className="w-full p-2 border rounded">
            <option>ninguno</option>
            <option>cuadros</option>
            <option>rayas</option>
            <option>circulos</option>
            <option>lineas</option>
          </select>
        </label>

        <label>
          Talla
          <select name="talla" value={form.talla} onChange={onChange} className="w-full p-2 border rounded">
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>
        </label>

        <label>
          Género
          <select name="genero" value={form.genero} onChange={onChange} className="w-full p-2 border rounded">
            <option>masculino</option>
            <option>femenino</option>
            <option>unisex</option>
          </select>
        </label>
      </div>

      <button
        onClick={generate}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generar Imagen
      </button>

      <p className="mt-3 text-sm text-gray-700">{msg}</p>

      {descripcion && (
        <p className="mt-2 text-md font-medium text-gray-900">Descripción: {descripcion}</p>
      )}

      <div className="mt-6 bg-white rounded shadow p-4 min-h-[300px] flex items-center justify-center">
        {img64 ? (
          <img src={img64} alt="Resultado" className="max-h-[400px] rounded" />
        ) : (
          <span className="text-gray-500">Aquí verás tu prenda generada</span>
        )}
      </div>
    </div>
  );
}
