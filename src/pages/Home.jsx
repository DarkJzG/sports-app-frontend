// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";
import { Cpu, Check, Box } from "lucide-react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const designSectionRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/catg_prod/all")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  const scrollToDesignSection = () => {
    designSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* BANNER PRINCIPAL - HERO SECTION */}
      <section className="relative flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-24 md:py-32">
        <img
          src="/img/banner_sport.svg"
          alt="Banner deportivo"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Lado izquierdo: texto */}
          <div className="text-center md:text-left md:w-1/2 space-y-6 animate-fadeIn">
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-2xl">
              Crea tu prenda deportiva <span className="text-blue-400">perfecta</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-lg">
              Diseña camisetas únicas con <span className="font-bold text-blue-400">Inteligencia Artificial</span> o personalízalas en <span className="font-bold text-blue-400">3D</span>. Tú eliges cómo crear.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6">
              <button
                onClick={scrollToDesignSection}
                className="bg-white text-blue-900 font-bold rounded-xl px-10 py-4 text-lg shadow-2xl hover:bg-blue-400 transition-all duration-300"
              >
                Conocer Más
              </button>

              <Link
                to="/form-camiseta-v3"
                className="border-2 border-white text-white font-semibold rounded-xl px-10 py-4 text-lg shadow-xl hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Empezar Ahora
              </Link>
            </div>
          </div>

          {/* Lado derecho: imagen con animación */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-20"></div>
            <img
              src="/img/CamisetJ.png"
              alt="Diseño deportivo IA"
              className="relative w-full max-w-md md:max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Wave SVG decorativo */}
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

      {/* SECCIÓN DE MÉTODOS DE DISEÑO */}
      <section ref={designSectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Elige tu <span className="text-blue-900">Método de Diseño</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dos formas innovadoras de crear tu prenda ideal. Selecciona la que mejor se adapte a tu estilo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* OPCIÓN 1: DISEÑO CON IA POR IMAGEN */}
            <div className="group relative bg-gradient-to-br from-red-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              
              <div className="relative z-10 p-8 md:p-10 text-white h-full flex flex-col">
                {/* Badge */}
                <div className="inline-flex items-center bg-white text-red-900 px-4 py-2 rounded-full text-sm font-bold mb-6 self-start">
                  <Cpu className="w-5 h-5 mr-2" />
                  IA 
                </div>

                {/* Contenido */}
                <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                  Diseña con Inteligencia Artificial
                </h3>
                
                <p className="text-lg text-purple-100 mb-6 flex-grow">
                  Nuestra IA generará diseños únicos y profesionales para tu prenda en segundos.
                </p>

                {/* Características */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Selecciona tu camiseta</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Escoge el diseño</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Resultados variados en segundos</span>
                  </li>
                </ul>

                {/* Botón CTA */}
                <Link
                  to="/modeloia"
                  className="block text-center bg-white text-red-700 font-bold rounded-xl px-8 py-4 text-lg shadow-xl hover:bg-red-600 hover:text-white transition-all duration-300 transform group-hover:scale-105"
                >
                  Disenar con IA
                </Link>
              </div>

              {/* Decoración */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* OPCIÓN 2: DISEÑO CON MODELO 3D */}
            <div className="group relative bg-gradient-to-br from-blue-900 to-cyan-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              
              <div className="relative z-10 p-8 md:p-10 text-white h-full flex flex-col">
                {/* Badge */}
                <div className="inline-flex items-center bg-white text-blue-900 px-4 py-2 rounded-full text-sm font-bold mb-6 self-start">
                  <Box className="w-5 h-5 mr-2" />
                  3D
                </div>

                {/* Contenido */}
                <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                  Personaliza en 3D Interactivo
                </h3>
                
                <p className="text-lg text-blue-100 mb-6 flex-grow">
                  Visualiza y edita tu prenda en tiempo real con nuestro editor 3D. Controla cada detalle: colores, texturas y posiciones.
                </p>

                {/* Características */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Vista 360° de tu diseño</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Editor interactivo y preciso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Control total de colores y texturas</span>
                  </li>
                </ul>

                {/* Botón CTA */}
                <Link
                  to="/modelo3d/"
                  className="block text-center bg-white text-blue-900 font-bold rounded-xl px-8 py-4 text-lg shadow-xl hover:bg-blue-600 hover:text-white transition-all duration-300 transform group-hover:scale-105"
                >
                  Diseñar en 3D
                </Link>
              </div>

              {/* Decoración */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          {/* Indicador de comparación rápida */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
              ¿Aún no decides? Aquí te ayudamos
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-center mb-8">
              <div className="p-6 bg-red-50 rounded-xl">
                <h4 className="font-bold text-red-900 mb-2">Elige IA si...</h4>
                <p className="text-gray-700">Quieres explorar ideas creativas rápidamente y necesitas inspiración automática</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">Elige 3D si...</h4>
                <p className="text-gray-700">Ya tienes una idea clara y quieres control preciso sobre cada elemento del diseño</p>
              </div>
            </div>
            <div className="grid md:grid-cols-1 mb-2 gap-6 text-center">
              <div className="p-6 bg-yellow-50 rounded-xl">
                <h4 className="font-bold text-yellow-900 mb-2">O compra por categoría</h4>
                <p className="text-gray-700">Si no tienes una idea clara, puedes explorar los diseños de prendas deportivas que tenemos disponibles</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compra por <span className="text-blue-900">Categoría</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora los diseños de prendas deportivas que tenemos disponibles.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {categorias.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalogo/${cat._id}`}
                className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <img 
                  src={cat.imagen_url} 
                  alt={cat.nombre} 
                  className="h-32 w-full object-cover group-hover:scale-110 transition-transform" 
                />
                <h3 className="font-semibold text-center py-3 text-blue-900">
                  {cat.nombre}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
