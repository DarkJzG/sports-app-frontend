import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ListarPrendasIA() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://localhost:5000/api/ia/prendas/listar?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrendas(data.prendas || []);
      })
      .catch((err) => console.error("Error cargando prendas:", err));
  }, [user, navigate]);

  // 🔹 Función para eliminar prenda
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta prenda?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/ia/prendas/eliminar/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.ok) {
        setPrendas((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Error al eliminar la prenda.");
      }
    } catch (err) {
      console.error("Error eliminando prenda:", err);
    }
  };

  return (
    <div>
      <Navbar />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Mis Prendas Generadas con IA
          </h1>

          {prendas.length === 0 ? (
            <p className="text-center text-gray-500">
              Aún no has generado ninguna prenda.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {prendas.map((prenda) => (
                <div
                  key={prenda._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={prenda.imageUrl}
                    alt={prenda.tipo_prenda}
                    className="h-40 object-contain mb-3 rounded"
                  />
                  <h3 className="font-semibold text-lg text-center">
                    {prenda.categoria_prd}
                  </h3>
                  <p className="text-gray-500 text-sm text-center">
                    {prenda.atributos_es?.tela || "Sin tela"}
                  </p>
                  <span className="text-blue-900 font-bold text-xl mb-2">
                    ${prenda.precio_venta || prenda.ficha_tecnica?.costo || "N/A"}
                  </span>

                  <div className="flex gap-2 w-full">
                    <Link
                      to={`/prendaIA/${prenda._id}`}
                      className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 text-center flex-1"
                    >
                      Detalles
                    </Link>
                    <button
                      onClick={() => handleEliminar(prenda._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
