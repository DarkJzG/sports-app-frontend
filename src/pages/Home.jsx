// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/producto/all")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO principal */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-200 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <img
            src="/img/img_inicio_costura.png"
            alt="Johan Sports"
            className="w-32 mb-6 animate-bounce"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4 leading-tight">
            Diseña, crea y experimenta
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
            Usa nuestra herramienta <span className="font-semibold">SplArt</span>{" "}
            y personaliza tu propia prenda deportiva con un estilo único.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/modeloia"
              className="bg-blue-900 text-white font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-700 transition-all"
            >
              🚀 Probar SplArt
            </Link>
            <Link
              to="/guia_generar_img"
              className="border border-blue-900 text-blue-900 font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-900 hover:text-white transition-all"
            >
              📖 Ver Catálogo
            </Link>
            <Link
              to="/modelo3d/camiseta3d/vista"
              className="border border-blue-900 text-blue-900 font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-900 hover:text-white transition-all"
            >
              🎨 Diseñar en 3D
            </Link>
            <Link
              to="/form-camiseta-v2"
              className="bg-blue-900 text-white font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-700 transition-all"
            >
              🚀 Probar V2
            </Link>
            <Link
              to="/modelo3d/camiseta3d/vista/:id"
              className="bg-blue-900 text-white font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-700 transition-all"
            >
              🚀 Probar Prototipo
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Compra por <span className="text-blue-900">Categoría</span>
          </h2>
          <p className="text-gray-600 mb-10">
            Explora los diseños de prendas deportivas que tenemos disponibles.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { img: "/img/category-1.jpg", label: "Camisetas" },
              { img: "/img/category-2.jpg", label: "Pantalones" },
              { img: "/img/category-3.jpg", label: "Zapatos" },
              { img: "/img/category-4.jpg", label: "Accesorios" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="h-32 w-full object-cover group-hover:scale-110 transition-transform"
                />
                <h3 className="font-semibold text-center py-3 text-blue-900">
                  {cat.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-6 mb-8 justify-center">
            <span className="tab__btn active-tab text-blue-900 font-bold cursor-pointer border-b-2 border-blue-900 pb-1">
              ⭐ Destacados
            </span>
            <span className="tab__btn text-gray-500 hover:text-blue-900 cursor-pointer">
              🔥 Popular
            </span>
            <span className="tab__btn text-gray-500 hover:text-blue-900 cursor-pointer">
              🆕 Recién Agregados
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {productos.length === 0 ? (
              <p className="text-gray-500">Cargando productos...</p>
            ) : (
              productos.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all"
                >
                  <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="h-32 object-contain mb-3"
                  />
                  <h3 className="font-semibold text-lg mb-1 text-center text-blue-900">
                    {prod.nombre}
                  </h3>
                  <span className="text-blue-700 font-bold text-xl mb-3">
                    ${prod.precio_venta?.toFixed(2) || "0.00"}
                  </span>
                  <Link
                    to={`/producto/${prod._id}`}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:scale-105 hover:bg-blue-700 transition w-full text-center font-medium"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER / REDES */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 py-14 text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-6">
            Síguenos y mantente actualizado
          </h3>
          <div className="flex gap-8">
            <button className="hover:scale-125 transition">
              <img src="/img/icon-youtube.svg" alt="YouTube" className="w-8" />
            </button>
            <button className="hover:scale-125 transition">
              <img
                src="/img/icon-instagram.svg"
                alt="Instagram"
                className="w-8"
              />
            </button>
            <button className="hover:scale-125 transition">
              <img
                src="/img/icon-facebook.svg"
                alt="Facebook"
                className="w-8"
              />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
