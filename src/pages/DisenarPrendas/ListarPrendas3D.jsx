import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

export default function ListarPrendas3D() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar prendas 3D del usuario
  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/3d/prenda/listar?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrendas(data.prendas || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error cargando prendas 3D:", err);
        toast.error("Error al cargar las prendas 3D");
        setLoading(false);
      });
  }, [user]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta prenda 3D?")) return;
    try {
      const res = await fetch(`${API_URL}/api/3d/prenda/eliminar/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success("Prenda eliminada correctamente");
        setPrendas((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error("No se pudo eliminar la prenda");
      }
    } catch (err) {
      console.error("Error eliminando prenda:", err);
      toast.error("Error de conexión con el servidor");
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p>Debes iniciar sesión para ver tus diseños.</p>
      </div>
    );
  }

  if (loading)
    return <div className="p-10 text-center text-gray-600">Cargando tus prendas 3D...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Mis Diseños 3D Guardados
        </h1>

        {prendas.length === 0 ? (
          <div className="text-center text-gray-600">
            Aún no has guardado ningún diseño 3D.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {prendas.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
              >
                <img
                  src={p.renders?.render_frente || p.renders?.render_espalda || p.renders?.render_lado_izq || p.renders?.render_lado_der}
                  alt={p.modelo}
                  className="rounded-lg object-cover h-56 w-full"
                />
                <h2 className="mt-3 text-lg font-semibold text-gray-800">
                  {p.modelo}
                </h2>
                <p className="text-sm text-gray-500 mb-3 capitalize">
                  {p.categoria} - Diseño {p.design_id}
                </p>

                <div className="mt-auto flex justify-between">
                  <button
                    onClick={() => navigate(`/prenda3d/${p._id}`)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm"
                  >
                    🔍 Detalles
                  </button>

                  <button
                    onClick={() =>
                      navigate("/disenar3d", { state: { prendaId: p._id } })
                    }
                    className="bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 text-sm"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => handleEliminar(p._id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
