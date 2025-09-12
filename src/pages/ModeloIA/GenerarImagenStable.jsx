// src/pages/GenerarImagenStable.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";

export default function GenerarImagenStable() {
  const [form, setForm] = useState({
    categoria: "camiseta",
    estilo: "deportivo",
    tela: "poliéster",
    color_principal: "",
    color_secundario: "ninguno",
    color_terciario: "ninguno",
    mangas: "cortas",
    cuello: "redondo",
    patron: "ninguno",
    talla: "M",
    genero: "unisex",
  });

  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerar = async () => {
    setLoading(true);
    setImagen(null);
    try {
      const res = await fetch(`${API_URL}/ia/generar_stable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setImagen(`data:image/jpeg;base64,${data.image_base64}`);
        setDescripcion(data.meta.descripcion);
      } else {
        alert("Error: " + (data.error?.detail || "No se pudo generar la imagen"));
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen generada */}
        <div className="flex justify-center items-center">
          {loading ? (
            <div className="text-blue-900 font-bold text-lg animate-pulse">
              Generando imagen...
            </div>
          ) : imagen ? (
            <img
              src={imagen}
              alt="Resultado"
              className="w-96 h-auto rounded-xl shadow"
            />
          ) : (
            <div className="text-gray-500">Aquí aparecerá la prenda generada</div>
          )}
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-blue-900">
            Diseña tu prenda
          </h1>

          {/* Campos */}
          <div>
            <label className="font-bold text-gray-700">Categoría:</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="camiseta">Camiseta</option>
              <option value="pantalon">Pantalón</option>
              <option value="sudadera">Camiseta y pantaloneta</option>
              <option value="sudadera">Chaqueta y pantalón</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Estilo:</label>
            <select
              name="estilo"
              value={form.estilo}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="deportivo">Deportiva</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </div>

                    <div>
            <label className="font-bold text-gray-700">Diseño:</label>
            <select
              name="diseno"
              value={form.diseno}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="deportivo">Sublimado</option>
              <option value="casual">Costura</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Tela:</label>
            <input
              type="text"
              name="tela"
              value={form.tela}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Color principal:</label>
            <input
              type="text"
              name="color_principal"
              value={form.color_principal}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              placeholder="Ej. blanco, azul, rojo"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Color secundario:</label>
            <input
              type="text"
              name="color_secundario"
              value={form.color_secundario}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              placeholder="ninguno"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Color terciario:</label>
            <input
              type="text"
              name="color_terciario"
              value={form.color_terciario}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              placeholder="ninguno"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Mangas:</label>
            <select
              name="mangas"
              value={form.mangas}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="cortas">Cortas</option>
              <option value="largas">Largas</option>
              <option value="sin mangas">Sin mangas</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Cuello:</label>
            <select
              name="cuello"
              value={form.cuello}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="redondo">Redondo</option>
              <option value="v">En V</option>
              <option value="polo">Tipo polo</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Patrón:</label>
            <input
              type="text"
              name="patron"
              value={form.patron}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
              placeholder="ninguno, rayas, cuadros..."
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Talla:</label>
            <select
              name="talla"
              value={form.talla}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Género:</label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            >
              <option value="unisex">Unisex</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
            </select>
          </div>

          {/* Botón */}
          <button
            onClick={handleGenerar}
            className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar prenda"}
          </button>

          {descripcion && (
            <p className="mt-2 text-gray-600">
              <strong>Descripción:</strong> {descripcion}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
