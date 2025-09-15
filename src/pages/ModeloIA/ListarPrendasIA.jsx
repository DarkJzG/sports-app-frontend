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

    fetch(`http://localhost:5000/prendas_ia/listar?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrendas(data.prendas || []);
      })
      .catch((err) => console.error("Error cargando prendas:", err));
  }, [user, navigate]);


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
                  {/* ✅ Ahora usamos la URL de Cloudinary */}
                  <img
                    src={prenda.imageUrl}
                    alt={prenda.tipo_prenda}
                    className="h-40 object-contain mb-3 rounded"
                  />
                  <h3 className="font-semibold text-lg text-center">
                    {prenda.tipo_prenda}
                  </h3>
                  <p className="text-gray-500 text-sm text-center">
                    {prenda.atributos?.tela || "Sin tela"}
                  </p>
                  <span className="text-blue-900 font-bold text-xl mb-2">
                  ${prenda.costo || prenda.ficha_tecnica?.costo || "N/A"}
                  </span>

                  <Link
                    to={`/prendaIA/${prenda._id}`}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 text-center w-full"
                  >
                    Ver Detalles
                  </Link>
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
