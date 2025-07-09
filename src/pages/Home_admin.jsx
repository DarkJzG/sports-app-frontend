
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import NavbarA from "../components/NavbarAdmin";
import FooterA from "../components/FooterAdmin";


const tools = [
  {
    title: "Telas",
    desc: "Agregar, ver, eliminar y editar las telas de tu local",
    img: "/img/telas.png"
  },
  {
    title: "Categoría de Productos",
    desc: "Agregar, ver, eliminar y editar las categorías de tus productos",
    img: "/img/categoria.png"
  },
  {
    title: "Mano de Obra",
    desc: "Agregar, ver, eliminar y editar el costo de mano de obra o insumos que intervienen en el proceso.",
    img: "/img/manodeobra.png"
  },
  {
    title: "Producto",
    desc: "Agregar, ver, eliminar y editar el producto final para mostrar al cliente.",
    img: "/img/producto.png"
  },
  {
    title: "Pedidos",
    desc: "Mira los estados de pedidos solicitados por tus clientes",
    img: "/img/pedidos.png"
  },
  {
    title: "Facturas",
    desc: "Mira el historial de ventas y facturas emitidas",
    img: "/img/facturas.png"
  },
];

export default function HomeAdmin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
    setUser(null); // Borra usuario del contexto y localStorage
    navigate("/"); // Redirige al home o a la ruta que prefieras
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
            {/* Icono de herramienta */}
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
      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10">Herramientas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl cursor-pointer">
              <img
                src={tool.img}
                alt={tool.title}
                className="h-24 mb-5 rounded-xl border border-dashed border-gray-300"
                style={{ background: "repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, #fff 10px, #fff 20px)" }}
              />
              <h4 className="text-lg font-bold mb-2 text-gray-900">{tool.title}</h4>
              <p className="text-gray-600 text-center">{tool.desc}</p>
            </div>
          ))}
        </div>
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
