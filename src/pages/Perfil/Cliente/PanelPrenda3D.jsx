// src/components/Paneles/PanelPrenda3D.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { useAuth } from "../../../components/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PanelPrenda3D({ userId: propUserId, onVer, onEditar, onEliminar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4); // cuántas se muestran

  const currentUserId = propUserId || user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    fetch(`${API_URL}/api/3d/prenda/listar?user_id=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        const lista = data.prendas || [];

        // Ordenar de más reciente a más antigua usando createdAt o _id
        const ordenadas = [...lista].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (b._id || "").localeCompare(a._id || "");
        });

        setPrendas(ordenadas);
        setVisibleCount(4); // empezar mostrando 4
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando prendas 3D:", err);
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

  const prendasVisibles = prendas.slice(0, visibleCount);
  const hayMas = visibleCount < prendas.length;

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prendasVisibles.map((p) => (
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
                      onClick={() => navigate(`/prenda3d/${p._id}`)}
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

          {hayMas && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Mostrar más
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
