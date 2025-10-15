import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Range } from "react-range";
import { parseColor } from "../components/colorParser";

const PRECIO_MIN = 1;
const PRECIO_MAX = 100;

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [precioRango, setPrecioRango] = useState([PRECIO_MIN, PRECIO_MAX]);
  const [filtros, setFiltros] = useState({
    categoria: "",
    genero: "",
    talla: "",
    precioMin: PRECIO_MIN,
    precioMax: PRECIO_MAX,
    color: "",
    buscar: "",
  });

  const location = useLocation();

  useEffect(() => {
    fetch(`${API_URL}/producto/all`)
      .then(res => res.json())
      .then(setProductos)
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  // Si viene de Home con categoría preseleccionada
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoria = queryParams.get("categoria");
    if (categoria) setFiltros(f => ({ ...f, categoria }));
  }, [location]);

  // Filtrado dinámico
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const cumpleCategoria = !filtros.categoria || p.categoria_nombre === filtros.categoria;
      const cumpleGenero = !filtros.genero || p.genero === filtros.genero;
      const cumpleTalla = !filtros.talla || p.tallas_disponibles?.includes(filtros.talla);
      const cumpleColor = !filtros.color || p.color?.color?.toLowerCase().includes(filtros.color.toLowerCase());
      const cumplePrecio = (p.precio_venta >= filtros.precioMin && p.precio_venta <= filtros.precioMax);
      const cumpleBuscar = !filtros.buscar || p.nombre.toLowerCase().includes(filtros.buscar.toLowerCase());
      return cumpleCategoria && cumpleGenero && cumpleTalla && cumpleColor && cumplePrecio && cumpleBuscar;
    });
  }, [productos, filtros]);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />

      {/* Encabezado */}
      <section className="bg-blue-900 text-white py-10 text-center">
        <h1 className="text-4xl font-bold">Catálogo de Productos</h1>
        <p className="text-blue-100 mt-2">Explora nuestra colección completa de prendas deportivas</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        {/* Filtros laterales */}
        <aside className="w-full md:w-64 bg-gray-50 p-5 rounded-2xl shadow-md h-fit">
          <h2 className="font-bold text-lg mb-4 text-blue-900">Filtros</h2>

          {/* Buscar */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filtros.buscar}
              onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoría */}
          <div className="mb-5">
            <label className="font-semibold text-blue-900">Categoría</label>
            <select
              value={filtros.categoria}
              onChange={e => setFiltros(f => ({ ...f, categoria: e.target.value }))}
              className="w-full mt-1 border rounded-lg px-2 py-1"
            >
              <option value="">Todas</option>
              {[...new Set(productos.map(p => p.categoria_nombre))].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div className="mb-5">
            <label className="font-semibold text-blue-900">Género</label>
            <select
              value={filtros.genero}
              onChange={e => setFiltros(f => ({ ...f, genero: e.target.value }))}
              className="w-full mt-1 border rounded-lg px-2 py-1"
            >
              <option value="">Todos</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Niño">Niño</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Talla */}
          <div className="mb-5">
            <label className="font-semibold text-blue-900">Talla</label>
            <select
              value={filtros.talla}
              onChange={e => setFiltros(f => ({ ...f, talla: e.target.value }))}
              className="w-full mt-1 border rounded-lg px-2 py-1"
            >
              <option value="">Todas</option>
              {["S", "M", "L", "XL", "XXL"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="font-semibold text-blue-900">Color</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[...new Set(productos.map(p => p.color?.color))]
                .filter(Boolean)
                .map(raw => {
                  const { nombre, cssColor } = parseColor(raw);
                  return (
                    <div
                      key={nombre}
                      title={nombre}
                      className={`w-8 h-8 rounded-md cursor-pointer border-2 flex items-center justify-center ${
                        filtros.color === nombre ? "border-blue-900" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: cssColor }}
                      onClick={() =>
                        setFiltros(f =>
                          ({ ...f, color: f.color === nombre ? "" : nombre })
                        )
                      }
                    >
                      {filtros.color === nombre && (
                        <span className="text-white font-bold">✓</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>



          {/* Precio */}
          <div className="mb-5">
            <label className="font-semibold text-blue-900">Precio</label>
            <div className="mt-4">
              <Range
                step={1}
                min={PRECIO_MIN}
                max={PRECIO_MAX}
                values={precioRango}
                onChange={(values) => {
                  setPrecioRango(values);
                  setFiltros(f => ({ ...f, precioMin: values[0], precioMax: values[1] }));
                }}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 bg-gray-200 rounded-full cursor-pointer"
                  >
                    <div className="h-2 bg-blue-500 rounded-full"
                      style={{
                        marginLeft: `${((precioRango[0] - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100}%`,
                        width: `${((precioRango[1] - precioRango[0]) / (PRECIO_MAX - PRECIO_MIN)) * 100}%`
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-5 h-5 bg-blue-600 rounded-full shadow-md focus:outline-none"
                  />
                )}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-700">
                <span>${precioRango[0]}</span>
                <span>${precioRango[1]}</span>
              </div>
            </div>
          </div>


          {/* Botón limpiar */}
          <button
            onClick={() => setFiltros({ categoria: "", genero: "", talla: "", precioMin: 0, precioMax: 999, color: "", buscar: "" })}
            className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Lista de productos */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No hay productos disponibles.</div>
          ) : (
            productosFiltrados.map(prod => (
              <div
                key={prod._id}
                className="group bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden hover:-translate-y-2 transition-all"
              >
                <div className="h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
                  <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{prod.nombre}</h3>
                  <p className="text-sm text-gray-500">{prod.categoria_nombre} • {prod.genero}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-blue-900 text-xl">${prod.precio_venta?.toFixed(2)}</span>
                    <Link to={`/producto/${prod._id}`} className="text-blue-700 hover:text-blue-500 font-medium">
                      Ver más →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
