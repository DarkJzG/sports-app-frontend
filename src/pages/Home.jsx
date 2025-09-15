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
    <div>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO principal */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-200 py-12">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          <img src="/img/img_inicio_costura.png" alt="Johan Sports" className="w-28 mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Diseña, crea y experimenta</h1>
          <span className="text-lg text-blue-900 mb-2">Usa nuestra herramienta SplArt para diseñar tu propia prenda deportiva</span>
          <p className="text-gray-500 mb-6">-</p>
          <div className="flex gap-4 justify-center">
            <Link to="/gen-img" className="btn bg-blue-900 text-white rounded-lg px-6 py-3 hover:bg-blue-700">
              Probar SplArt
            </Link>
            <Link to="/gen-img-form" className="btn btn--outline border border-blue-900 text-blue-900 rounded-lg px-6 py-3 hover:bg-blue-900 hover:text-white">
              Ver Productos
            </Link>
            <Link to="/gen-img-stable" className="btn btn--outline border border-blue-900 text-blue-900 rounded-lg px-6 py-3 hover:bg-blue-900 hover:text-white">
              Ver Stable
            </Link>
            <Link to="/modeloia" className="btn btn--outline border border-blue-900 text-blue-900 rounded-lg px-6 py-3 hover:bg-blue-900 hover:text-white">
              Crear Prenda
            </Link>
            <Link to="/listar-prendasIA" className="btn btn--outline border border-blue-900 text-blue-900 rounded-lg px-6 py-3 hover:bg-blue-900 hover:text-white">
              Ver Prenda
            </Link>
            <Link to="/modelo3d/camiseta3d" className="btn btn--outline border border-blue-900 text-blue-900 rounded-lg px-6 py-3 hover:bg-blue-900 hover:text-white">
              Diseñar
            </Link>
          </div>
        </div>
      </section>

      {/* Carrusel de categorías */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3">Compra por <span className="text-blue-900">Categoría</span></h2>
          <p className="text-gray-600 mb-6">Conoce los diseños de los productos que tenemos actualmente</p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[
              { img: "/img/category-1.jpg", label: "Camisetas" },
              { img: "/img/category-2.jpg", label: "Pantalones" },
              { img: "/img/category-3.jpg", label: "Zapatos" },
              { img: "/img/category-4.jpg", label: "Accesorios" }
            ].map((cat, idx) => (
              <div key={idx} className="min-w-[180px] bg-gray-100 rounded-xl shadow p-2 flex flex-col items-center">
                <img src={cat.img} alt={cat.label} className="h-24 rounded mb-2" />
                <h3 className="font-medium">{cat.label}</h3>
              </div>
            ))}
          </div>
          <Link to="/catalogo" className="btn mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Ver Catálogo</Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-4">
            <span className="tab__btn active-tab">Destacados</span>
            <span className="tab__btn">Popular</span>
            <span className="tab__btn">Recién Agregados</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {productos.length === 0 ? (
              <p className="text-gray-500">Cargando productos...</p>
            ) : (
              productos.map((prod) => (
                <div key={prod._id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
                  <img src={prod.imageUrl} alt={prod.nombre} className="h-28 rounded mb-2 object-contain" />
                  <h3 className="font-semibold text-lg mb-1 text-center">{prod.nombre}</h3>
                  <span className="text-blue-900 font-bold text-xl mb-1">
                    ${prod.preciomenor?.toFixed(2) || "0.00"}
                  </span>
                  <Link
                    to={`/producto/${prod._id}`}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 text-center w-full"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter y Redes */}
      <section className="bg-blue-50 py-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h3 className="flex items-center gap-3 text-xl font-semibold">
            <img src="/img/icon-youtube.svg" alt="YouTube" className="w-7" />
            <img src="/img/icon-instagram.svg" alt="Instagram" className="w-7" />
            <img src="/img/icon-facebook.svg" alt="Facebook" className="w-7" />
            Johan Sports
          </h3>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
