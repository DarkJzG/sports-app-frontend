// src/pages/Home_admin.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavbarA from "../components/NavbarAdmin";
import FooterA from "../components/FooterAdmin";

const tools = [
  {
    title: "Telas",
    desc: "Gestiona las telas disponibles en tu local",
    img: "/img/telas.png",
    route: "/telas"
  },
  {
    title: "Categoría de Telas",
    desc: "Clasifica las telas en categorías específicas",
    img: "/img/catg_tela.png",
    route: "/catg_tela"
  },
  {
    title: "Categoría de Productos",
    desc: "Organiza tus productos en diferentes categorías",
    img: "/img/categoria.png",
    route: "/catg_prod"
  },
  {
    title: "Mano de Obra",
    desc: "Gestiona los costos de mano de obra e insumos",
    img: "/img/manodeobra.png",
    route: "/manodeobra"
  },
  {
    title: "Productos",
    desc: "Administra el catálogo de productos finales",
    img: "/img/producto.png",
    route: "/productos"
  },
  {
    title: "Pedidos",
    desc: "Monitorea los estados de los pedidos de clientes",
    img: "/img/pedidos.png",
    route: "/admin/pedidos"
  },
  {
    title: "Facturas",
    desc: "Consulta el historial de ventas y facturación",
    img: "/img/facturas.png",
    route: "/facturas"
  },
];

export default function HomeAdmin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // usamos la función del AuthContext
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* NAVBAR */}
      <NavbarA />

      {/* Banner */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-3xl font-semibold flex-1">Administrador</h2>
        <div className="rounded-full bg-blue-200 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17.25l1.5 1.5M16.5 13.5a4.5 4.5 0 11-6.364-6.364A4.5 4.5 0 0116.5 13.5z" />
          </svg>
        </div>
        <button
          onClick={handleLogout}
          className="ml-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
        >
          Cerrar Sesión
        </button>
      </section>

      {/* Herramientas */}
      <main className="flex-1 px-8 py-10 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10">Panel de Administración</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => navigate(tool.route)}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-200"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-5">
                <img
                  src={tool.img}
                  alt={tool.title}
                  className="h-16 object-contain"
                />
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-900 text-center">{tool.title}</h4>
              <p className="text-gray-600 text-center text-sm">{tool.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <FooterA />
    </div>
  );
}
