import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function SeleccionPrenda() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetch(`${API_URL}/catg_prod/all`)
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Verificando sesión...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Selecciona el tipo de prenda
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categorias.map((c) => (
            <div
              key={c._id}
              onClick={() =>
                navigate(`/modeloia/${c._id}`, {
                  state: {
                    categoria_id: c._id,
                    categoria_prd: c.nombre,
                  },
                })
              }
              className="cursor-pointer bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden border hover:border-blue-600 transition"
            >
              <img
                src={c.imagen_url}
                alt={c.nombre}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold text-xl text-blue-900">{c.nombre}</h2>
                <p className="text-gray-600 text-sm mt-2">{c.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}
