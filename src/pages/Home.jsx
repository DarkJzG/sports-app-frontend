// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/catg_prod/all")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  return (
    <div className="bg-white text-gray-800">

      <Navbar />

      {/*BANNER*/}
        <section className="flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-blue-900 via-white-700 to-white-500 text-white py-20 md:py-28">

          <img
            src="/img/banner_sport.svg"
            alt="Banner deportivo"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
            {/* Lado izquierdo: texto */}
            <div className="text-center md:text-left md:w-1/2 space-y-6 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                Diseña tu <span className="text-blue-900">prenda deportiva</span><br />
                con estilo y tecnología
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-md mx-auto md:mx-0">
                Personaliza camisetas con ayuda de la IA
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <Link
                  to="/form-camiseta-v3"
                  className="bg-white text-blue-900 font-semibold rounded-xl px-8 py-3 shadow hover:scale-105 hover:bg-blue-300 transition-all"
                >
                  Probar V3
                </Link>

                <Link
                  to="/modelo3d/camiseta3d/vista/:id"
                  className="bg-blue-900 text-white-900 font-semibold rounded-xl px-8 py-3 shadow hover:scale-105 hover:bg-white-100 transition-all"
                >
                  Probar Modelo
                </Link>
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <img
                src="/img/CamisetJ.png"
                alt="Diseño deportivo IA"
                className="w-120 md:w-[400px] drop-shadow-2xl animate-bounce-slow"
              />
            </div>
          </div>


          <svg
            className="absolute bottom-0 left-0 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,288L80,272C160,256,320,224,480,213.3C640,203,800,213,960,208C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </section>


      {/* <section className="relative bg-gradient-to-br from-blue-50 to-blue-200 py-16 md:py-24">
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
              Probar SplArt
            </Link>
            <Link
              to="/guia_generar_img"
              className="border border-blue-900 text-blue-900 font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-900 hover:text-white transition-all"
            >
              Ver Catálogo
            </Link>
            <Link
              to="/modelo3d/camiseta3d/vista"
              className="border border-blue-900 text-blue-900 font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-900 hover:text-white transition-all"
            >
              Diseñar en 3D
            </Link>
            <Link
              to="/form-camiseta-v2"
              className="bg-blue-900 text-white font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-700 transition-all"
            >
              Probar V2
            </Link>
            <Link
              to="/modelo3d/camiseta3d/vista/:id"
              className="bg-blue-900 text-white font-semibold rounded-xl px-6 py-3 shadow hover:scale-105 hover:bg-blue-700 transition-all"
            >
              Probar Prototipo
            </Link>
          </div>
        </div>
      </section>  */}

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
            {categorias.map((cat) => (
              <Link
              key={cat._id}
              to={`/catalogo/${cat._id}`}
              className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <img src={cat.imagen_url} alt={cat.nombre} className="h-32 w-center object-cover group-hover:scale-210 transition-transform" />
                              <h3 className="font-semibold text-center py-3 text-blue-900">{cat.nombre}</h3>
              </Link>

            ))}
          </div>
        </div>
      </section>

      { /* PRODUCTOS DESTACADOS 
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2 text-center">
            Productos <span className="text-blue-900">Destacados</span>
          </h2>
          <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
            Descubre nuestras prendas más populares y mejor valoradas.
          </p>
          
          <div className="flex gap-6 mb-8 justify-center">
            {['Destacados', 'Popular', 'Recién llegados'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  index === 0 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {productos.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {productos.map((prod) => (
                <div
                  key={prod._id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden bg-gray-50">
                    <img
                      src={prod.imagen_url}
                      alt={prod.nombre}
                      className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/img/placeholder-product.png';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-1">
                      {prod.nombre}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-blue-700 font-bold text-xl">
                        ${prod.precio_venta?.toFixed(2) || "0.00"}
                      </span>
                      <Link
                        to={`/producto/${prod._id}`}
                        className="text-blue-900 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        Ver más <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* BENEFICIOS */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 py-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "",
                title: "Diseño Personalizado",
                description: "Crea tu propia prenda única con nuestro diseñador 3D."
              },
              {
                icon: "",
                title: "Tecnología de Vanguardia",
                description: "Utilizamos IA para ofrecerte los mejores diseños."
              },
              {
                icon: "",
                title: "Variedad de Estilos",
                description: "Amplia gama de colores, telas y diseños disponibles."
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* <section className="bg-gradient-to-r from-blue-800 to-blue-900 py-16 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">¡Mantente actualizado!</h3>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Suscríbete a nuestro boletín para recibir ofertas exclusivas y novedades.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Suscribirse
            </button>
          </form>
          <p className="text-sm text-blue-200 mt-4">
            Respetamos tu privacidad. Nunca compartiremos tu correo electrónico.
          </p>
        </div>
      </section> */}


      <Footer />
    </div>
  );
}
