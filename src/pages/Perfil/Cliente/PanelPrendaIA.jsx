import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function PanelPrendaIA({ userId: propUserId, onVer, onEditar, onEliminar }) {
  const { user } = useAuth();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = propUserId || user?.id;

  // Cargar prendas IA del usuario
  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/ia/prendas/listar?user_id=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setPrendas(data.prendas || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando prendas IA:", err);
        toast.error("Error al cargar las prendas generadas con IA");
        setLoading(false);
      });
  }, [currentUserId]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta prenda generada con IA?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/ia/prendas/eliminar/${id}`, {
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
      console.error("Error eliminando prenda IA:", err);
      toast.error("Error de conexión con el servidor");
    }
  };

  if (!currentUserId) {
    return (
      <div className="p-6 text-center text-gray-500">
        Debes iniciar sesión para ver tus diseños generados con IA.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Cargando tus prendas generadas con IA...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Mis Prendas Generadas con IA
      </h2>

      {prendas.length === 0 ? (
        <p className="text-center text-gray-500">
          Aún no has generado ninguna prenda con IA.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prendas.map((prenda) => (
            <div
              key={prenda._id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-200 flex flex-col"
            >
              <img
                src={prenda.imageUrl}
                alt={prenda.categoria_prd}
                className="object-cover h-48 w-full"
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">
                  {prenda.categoria_prd}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {prenda.atributos_es?.tela || "Sin tela especificada"}
                </p>
                <p className="text-blue-900 font-bold text-lg mb-3">
                  ${prenda.costo?.precio_venta || prenda.costo?.precio_costo || "N/A"}
                </p>

                <div className="mt-auto flex justify-between items-center gap-2">
                  <Link
                    to={`/prendaIA/${prenda._id}`}
                    className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 flex-1 text-center"
                  >
                    Detalles 
                  </Link>
                  <button
                    onClick={() => handleEliminar(prenda._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 flex-1"
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