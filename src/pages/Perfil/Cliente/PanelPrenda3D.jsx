// src/components/Paneles/PanelPrenda3D.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { useAuth } from "../../../components/AuthContext";
import { toast } from "react-toastify";

export default function PanelPrenda3D({ userId: propUserId, onVer, onEditar, onEliminar }) {
  const { user } = useAuth();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = propUserId || user?.id;

  // 🔹 Cargar prendas 3D del usuario
  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    fetch(`${API_URL}/api/3d/prenda/listar?user_id=${currentUserId}`)
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
  }, [currentUserId]);

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
        onEliminar?.(id);
      } else {
        toast.error("No se pudo eliminar la prenda");
      }
    } catch (err) {
      console.error("Error eliminando prenda:", err);
      toast.error("Error de conexión con el servidor");
    }
  };

  if (!currentUserId) {
    return (
      <div className="p-6 text-center text-gray-500">
        Debes iniciar sesión para ver tus diseños.
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Cargando tus prendas 3D...
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
        Mis Diseños 3D
      </h2>

      {prendas.length === 0 ? (
        <p className="text-center text-gray-500">
          Aún no has guardado ningún diseño 3D.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prendas.map((p) => (
            <div
              key={p._id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-200 flex flex-col"
            >
              <img
                src={
                  p.renders?.render_frente ||
                  p.renders?.render_espalda ||
                  p.renders?.render_lado_izq ||
                  p.renders?.render_lado_der
                }
                alt={p.modelo}
                className="object-cover h-48 w-full"
              />
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 text-base mb-1">
                  {p.modelo}
                </h3>
                <p className="text-sm text-gray-500 mb-3 capitalize">
                  {p.categoria} · Diseño {p.design_id}
                </p>

                <div className="mt-auto flex justify-between items-center gap-2">
                  <button
                    onClick={() => onVer?.(p)}
                    className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex-1 text-center"
                  >
                    Detalles
                  </button>


                  <button
                    onClick={() => handleEliminar(p._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 flex-1 text-center"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
