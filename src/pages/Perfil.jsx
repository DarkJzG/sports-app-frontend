import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function PerfilUsuario() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
    setUser(null); // Borra usuario del contexto y localStorage
    navigate("/"); // Redirige al home o a la ruta que prefieras
    };

  return (
    
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* Header */}
      <header className="bg-white shadow flex items-center px-8 py-3 justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <span className="font-bold text-xl text-blue-800">Johan Sports</span>
        </div>
        <nav className="flex gap-6 text-gray-700 font-medium">
          <a href="/productos">Productos</a>
          <a href="/telas">Telas</a>
          <a href="/ofertas">Ofertas</a>
          <a href="/categorias">Categorías</a>
          <button className="ml-4 px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-700 transition">Iniciar Sesión</button>
        </nav>
      </header>

      {/* Banner Perfil */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-3xl font-semibold flex-1">Perfil</h2>
        <div className="rounded-full bg-blue-200 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="9" r="4" />
            <path d="M4 19c0-2.2 3.6-4 8-4s8 1.8 8 4" />
          </svg>
        </div>
         <button
        onClick={handleLogout}
        className="ml-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
      >
        Cerrar Sesión
      </button>
      </section>


      {/* Información */}
      <main className="flex-1 px-8 py-10 max-w-5xl mx-auto">
        <section>
          <h3 className="text-2xl font-bold mb-6">Información</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow p-4">
                
              <span className="text-xs text-gray-500">Nombre</span>
              <div className="font-semibold text-gray-900">Johan</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Apellido</span>
              <div className="font-semibold text-gray-900">Burbano España</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 col-span-1 sm:col-span-2">
              <span className="text-xs text-gray-500">Correo electrónico</span>
              <div className="font-semibold text-gray-900">johanburbano@gmail.com</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Localidad</span>
              <div className="font-semibold text-gray-900">Tulcán</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Código postal</span>
              <div className="font-semibold text-gray-900">xxxxxx</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Dirección principal</span>
              <div className="font-semibold text-gray-900">Pedro Moncayo</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Dirección secundaria</span>
              <div className="font-semibold text-gray-900">Gaspar de Villarroel</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">País</span>
              <div className="font-semibold text-gray-900">Ecuador</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <span className="text-xs text-gray-500">Teléfono</span>
              <div className="font-semibold text-gray-900">0959207677</div>
            </div>
          </div>
        </section>

        {/* Historial de compras */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Historial de compras</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-3 px-4 text-left font-semibold">Factura</th>
                  <th className="py-3 px-4 text-left font-semibold">Fecha</th>
                  <th className="py-3 px-4 text-left font-semibold">Descripción</th>
                  <th className="py-3 px-4 text-left font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">FACT0001</td>
                  <td className="py-2 px-4">01/07/2024</td>
                  <td className="py-2 px-4">Camiseta Azul XL</td>
                  <td className="py-2 px-4 text-green-600">Finalizado</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">FACT0002</td>
                  <td className="py-2 px-4">15/06/2024</td>
                  <td className="py-2 px-4">Pantaloneta</td>
                  <td className="py-2 px-4 text-yellow-500">Pendiente</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">FACT0003</td>
                  <td className="py-2 px-4">30/05/2024</td>
                  <td className="py-2 px-4">Conjunto Invierno</td>
                  <td className="py-2 px-4 text-green-600">Finalizado</td>
                </tr>
                {/* Agrega más filas de ejemplo si quieres */}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-10 px-8 py-6 flex flex-col md:flex-row justify-between items-center">
        <span className="font-bold text-xl">Johan Sports</span>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="/"><i className="fab fa-facebook text-2xl"></i></a>
          <a href="/"><i className="fab fa-instagram text-2xl"></i></a>
          <a href="/"><i className="fab fa-youtube text-2xl"></i></a>
        </div>
      </footer>
    </div>
  );
}

