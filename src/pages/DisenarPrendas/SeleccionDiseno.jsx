
import React, { useEffect} from "react";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function SeleccionDiseno() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

    // Redirigir si no está logueado
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Verificando sesión...</div>;
  }

  const prendas = [
    { id: "camiseta3d", nombre: "Camiseta" },
    { id: "pantalon3d", nombre: "Pantalón" },
    { id: "conjunto_interno3d", nombre: "Conjunto Interno" },

  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Selecciona el tipo de prenda
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {prendas.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/modeloia/${p.id}`)}
              className="bg-blue-900 hover:bg-blue-700 text-white py-6 px-4 rounded-xl shadow-lg font-bold text-xl text-center"
            >
              {p.nombre}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
