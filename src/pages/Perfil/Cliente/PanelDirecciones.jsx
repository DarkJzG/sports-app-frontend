// src/components/Perfil/PanelDirecciones.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import { useAuth } from "../../../components/AuthContext";
import { Plus, Trash2, Star, PencilIcon } from "lucide-react";


export default function PanelDirecciones() {
  const { user } = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editarDir, setEditarDir] = useState(null);
  const [form, setForm] = useState({
    etiqueta: "",
    direccion_principal: "",
    referencia: "",
    ciudad: "",
    provincia: "",
    pais: "Ecuador",
    codigo_postal: "",
    telefono: "",
    es_predeterminada: false,
  });


  // Cargar direcciones
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/usuario/${user.id}/direcciones`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setDirecciones(data.direcciones);
      });
  }, [user]);

  const fetchDirecciones = async () => {
        const res = await fetch(`${API_URL}/usuario/${user.id}/direcciones`);
        const data = await res.json();
        if (data.ok) setDirecciones(data.direcciones);
    };

    useEffect(() => {
        if (user) fetchDirecciones();
    }, [user]);

  const handleGuardar = async () => {
        let endpoint = `${API_URL}/usuario/${user.id}/direcciones`;
        let method = "POST";
        let payload = form;

        if (editarDir) {
            // Modo Edición: Usamos PATCH y el ID de la dirección
            endpoint = `${API_URL}/usuario/direcciones/${editarDir._id}`;
            method = "PATCH";
            // Es crucial enviar el user_id para la verificación en el backend
            payload = { ...form, user_id: user.id }; 
        }

        const res = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        
        if (data.ok) {
            setShowModal(false);
            setForm({
                etiqueta: "",
                direccion_principal: "",
                referencia: "",
                ciudad: "",
                provincia: "",
                pais: "Ecuador",
                codigo_postal: "",
                telefono: "",
                es_predeterminada: false,
            });
            setEditarDir(null); // Limpiar modo edición
            fetchDirecciones(); // Recargar
        } else {
            // Mostrar mensaje de error (ej: "Máximo de 3 direcciones")
            alert(data.msg); 
        }
    };

  const handleOpenEdit = (dir) => {
        setEditarDir(dir);
        // Llenar el formulario con los datos de la dirección existente
        setForm({
            etiqueta: dir.etiqueta,
            direccion_principal: dir.direccion_principal,
            referencia: dir.referencia,
            ciudad: dir.ciudad,
            provincia: dir.provincia,
            pais: dir.pais,
            codigo_postal: dir.codigo_postal,
            telefono: dir.telefono,
            es_predeterminada: dir.es_predeterminada,
        });
        setShowModal(true);
    };

const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`${API_URL}/usuario/direcciones/${id}`, { method: "DELETE" });
    const data = await res.json();
    
    if(data.ok) {
        // En lugar de filtrar localmente, recargamos el estado completo del servidor
        // Esto es más seguro, especialmente si la dirección eliminada era la predeterminada.
        fetchDirecciones(); 
    } else {
        alert(data.msg || "Error al eliminar la dirección.");
    }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Direcciones</h2>
          <button
              onClick={() => {
                  setEditarDir(null); // Modo Creación
                  setForm({
                    etiqueta: "",
                    direccion_principal: "",
                    referencia: "",
                    ciudad: "",
                    provincia: "",
                    pais: "Ecuador",
                    codigo_postal: "",
                    telefono: "",
                    es_predeterminada: false,
                });
                  setShowModal(true);
              }}
              className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
              <Plus size={18} /> Agregar dirección
          </button>
      </div>

      {direcciones.length === 0 ? (
        <p className="text-gray-500">No has agregado ninguna dirección aún.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {direcciones.map((dir) => (
            <div
              key={dir._id}
              className="border rounded-xl p-4 bg-white shadow-sm relative"
            >
              {dir.es_predeterminada && (
                <div className="absolute top-3 right-3 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                </div>
              )}
              <h3 className="font-semibold text-gray-800 mb-1">
                {dir.etiqueta}
              </h3>
              <p className="text-sm text-gray-600">{dir.direccion_principal}</p>
              {dir.referencia && (
                <p className="text-sm text-gray-600">{dir.referencia}</p>
              )}
              <p className="text-sm text-gray-600">
                {dir.ciudad}, {dir.provincia}, {dir.pais}
              </p>
              <p className="text-sm text-gray-600">Tel: {dir.telefono}</p>
              <div className="flex justify-end mt-3 gap-3">
                {/* 🎯 Botón de Editar */}
                <button
                    onClick={() => handleOpenEdit(dir)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                    <PencilIcon size={14} /> Editar
                </button>
                
                <button
                  onClick={() => handleEliminar(dir._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <h3 className="text-xl font-semibold mb-4">
              {editarDir ? "Editar dirección" : "Agregar nueva dirección"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Etiqueta"
                value={form.etiqueta}
                onChange={(e) => setForm({ ...form, etiqueta: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Dirección de calle"
                value={form.direccion_principal}
                onChange={(e) =>
                  setForm({ ...form, direccion_principal: e.target.value })
                }
                className="col-span-full border rounded px-3 py-2"
              />
              <input
                placeholder="Apartamento, suite, etc."
                value={form.referencia}
                onChange={(e) =>
                  setForm({ ...form, referencia: e.target.value })
                }
                className="col-span-full border rounded px-3 py-2"
              />
              <input
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Provincia/Estado"
                value={form.provincia}
                onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Código postal"
                value={form.codigo_postal}
                onChange={(e) =>
                  setForm({ ...form, codigo_postal: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>

            <label className="flex items-center mt-4 text-sm">
              <input
                type="checkbox"
                checked={form.es_predeterminada}
                onChange={(e) =>
                  setForm({ ...form, es_predeterminada: e.target.checked })
                }
                className="mr-2"
              />
              Establecer como método de envío preferido
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
                <button
                    onClick={handleGuardar}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                    {editarDir ? "Guardar cambios" : "Guardar"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
