// src/components/Perfil/PanelDirecciones.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { Plus, Trash2, Star } from "lucide-react";

export default function PanelDirecciones() {
  const { user } = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion_principal: "",
    direccion_secundaria: "",
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

  const handleGuardar = async () => {
    const res = await fetch(`${API_URL}/usuario/${user.id}/direcciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.ok) {
      setShowModal(false);
      setForm({
        nombre: "",
        apellido: "",
        direccion_principal: "",
        direccion_secundaria: "",
        ciudad: "",
        provincia: "",
        pais: "Ecuador",
        codigo_postal: "",
        telefono: "",
        es_predeterminada: false,
      });
      // recargar direcciones
      const res2 = await fetch(`${API_URL}/usuario/${user.id}/direcciones`);
      const data2 = await res2.json();
      if (data2.ok) setDirecciones(data2.direcciones);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta dirección?")) return;
    await fetch(`${API_URL}/usuario/direcciones/${id}`, { method: "DELETE" });
    setDirecciones((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Direcciones</h2>
        <button
          onClick={() => setShowModal(true)}
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
                {dir.nombre} {dir.apellido}
              </h3>
              <p className="text-sm text-gray-600">{dir.direccion_principal}</p>
              {dir.direccion_secundaria && (
                <p className="text-sm text-gray-600">{dir.direccion_secundaria}</p>
              )}
              <p className="text-sm text-gray-600">
                {dir.ciudad}, {dir.provincia}, {dir.pais}
              </p>
              <p className="text-sm text-gray-600">Tel: {dir.telefono}</p>
              <div className="flex justify-end mt-3">
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
            <h3 className="text-xl font-semibold mb-4">Agregar nueva dirección</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                placeholder="Apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
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
                placeholder="Apartamento, suite, etc. (opcional)"
                value={form.direccion_secundaria}
                onChange={(e) =>
                  setForm({ ...form, direccion_secundaria: e.target.value })
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
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
