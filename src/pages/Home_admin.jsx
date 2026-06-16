// src/pages/Home_admin.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavbarA from "../components/NavbarAdmin";
import FooterA from "../components/FooterAdmin";
import { API_URL } from "../config";
import { Spool, Shirt, Layers2, Layers, Truck, FileTerminal, UsersRound, Building2   } from "lucide-react";


const tools = [
  {
    title: "Telas",
    desc: "Gestiona las telas disponibles en tu local",
    icon: <Spool size={60} />,
    route: "/telas"
  },
  {
    title: "Categoría de Telas",
    desc: "Clasifica las telas en categorías específicas",
    icon: <Layers2 size={60} />,
    route: "/catg_tela"
  },
  {
    title: "Categoría de Productos",
    desc: "Organiza tus productos en diferentes categorías",
    icon: <Layers size={60} />,
    route: "/catgPrd"
  },
  {
    title: "Mano de Obra",
    desc: "Gestiona los costos de mano de obra e insumos",
    icon: <UsersRound size={60} />,
    route: "/manObra"
  },
  {
    title: "Productos",
    desc: "Administra el catálogo de productos finales",
    icon: <Shirt size={60} />,
    route: "/producto"
  },
  {
    title: "Pedidos",
    desc: "Monitorea los estados de los pedidos de clientes",
    icon: <Truck size={60} />,
    route: "/admin/pedidos"
  },
  {
    title: "Facturas",
    desc: "Consulta el historial de ventas y facturación",
    icon: <FileTerminal size={60} />,
    route: "/admin/facturas"
  },
    {
    title: "Perfil",
    desc: "Configura la información general de tu empresa",
    icon: <Building2 size={60} />,
    route: "/admin/perfil-empresa"
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
        <button
          onClick={handleLogout}
          className="ml-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
        >
          Cerrar Sesión
        </button>
      </section>

      {/* Herramientas */}
      <main className="flex-1 px-8 py-10 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-blue-900 text-center mb-10">Panel de Administración</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => navigate(tool.route)}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-200"
            >
              <div className="w-24 h-24 flex text-blue-900 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-5">
                {tool.icon}
              </div>
              <h4 className="text-lg font-bold mb-2 text-black text-center">{tool.title}</h4>
              <p className="text-gray-600 text-center text-sm">{tool.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}

    </div>
  );
}
