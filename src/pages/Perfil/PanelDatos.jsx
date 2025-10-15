// src/pages/Perfil/PanelDatos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import PantallaCarga from "../../components/PantallaCarga";

export default function PanelDatos() {
  const { user, token } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "" });
  const [pass, setPass] = useState({ actual: "", nueva: "", confirmar: "" });
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

  // Cargar perfil del usuario
  useEffect(() => {
    if (!user) return;
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/usuario/perfil/${user.id}`);
        const data = await res.json();
        if (data.ok) {
          setUsuario(data.usuario);
          setForm({
            nombre: data.usuario.nombre || "",
            apellido: data.usuario.apellido || "",
            telefono: data.usuario.telefono || "",
          });
        }
      } catch (err) {
        toast.error("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [user]);

  // Guardar datos personales
  const handleGuardarDatos = async () => {
    setShowLoader(true);
    try {
      const res = await fetch(`${API_URL}/usuario/perfil/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Perfil actualizado correctamente");
        setUsuario((prev) => ({ ...prev, ...form }));
        setModalEditar(false);
      } else {
        toast.error(data.msg);
      }
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setShowLoader(false);
    }
  };

  // Cambiar contraseña
  const handleCambiarPassword = async () => {
    if (!pass.actual || !pass.nueva || !pass.confirmar) {
      toast.error("Completa todos los campos");
      return;
    }
    if (pass.nueva !== pass.confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setShowLoader(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify(pass),
      });
      const data = await res.json();

      if (data.ok) {
        toast.success("Contraseña actualizada correctamente");
        setModalPassword(false);
        setPass({ actual: "", nueva: "", confirmar: "" });
      } else {
        toast.error(data.msg);
      }
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setShowLoader(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Cargando perfil...</p>;
  if (!usuario) return <p className="text-center py-10 text-gray-500">No se encontró el usuario</p>;

  return (
    <div className="space-y-6 relative">
      <PantallaCarga show={showLoader} message="Procesando solicitud..." />

      {/* ====================== DATOS PERSONALES ====================== */}
      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Detalles</h2>
        <p className="text-gray-700">
          {usuario.nombre} {usuario.apellido}
        </p>
        {usuario.telefono && <p className="text-gray-600 text-sm">{usuario.telefono}</p>}
        <button
          onClick={() => setModalEditar(true)}
          className="mt-3 px-4 py-2 border rounded text-sm font-medium hover:bg-gray-100 transition"
        >
          Editar
        </button>
      </div>

      {/* ====================== CORREO ELECTRÓNICO ====================== */}
      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Iniciar sesión correo electrónico</h2>
        <p className="text-gray-700">{usuario.correo}</p>
        <button
          disabled
          className="mt-3 px-4 py-2 border rounded text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          No editable
        </button>
      </div>

      {/* ====================== CONTRASEÑA ====================== */}
      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Contraseña</h2>
        <p className="text-gray-600 text-lg tracking-widest">••••••••</p>
        <button
          onClick={() => setModalPassword(true)}
          className="mt-3 px-4 py-2 border rounded text-sm font-medium hover:bg-gray-100 transition"
        >
          Editar
        </button>
      </div>

      {/* ====================== MODAL EDITAR DATOS ====================== */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Editar detalles</h3>
            <button
              onClick={() => setModalEditar(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="space-y-4">
              {["nombre", "apellido", "telefono"].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field === "telefono" ? "Número de teléfono (opcional)" : `${field} *`}
                  </label>
                  <input
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setModalEditar(false)}
                className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarDatos}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-medium transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL CAMBIAR CONTRASEÑA ====================== */}
      {modalPassword && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
            <h3 className="text-xl font-semibold mb-5 text-blue-900 text-center">
              Cambiar contraseña
            </h3>
            <button
              onClick={() => setModalPassword(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>

            {/* Campos */}
            {["actual", "nueva", "confirmar"].map((campo) => {
              const labels = {
                actual: "Contraseña actual *",
                nueva: "Nueva contraseña *",
                confirmar: "Confirmar nueva contraseña *",
              };
              const value = pass[campo];
              const handleChange = (e) => setPass({ ...pass, [campo]: e.target.value });
              const togglePasswordVisibility = () =>
                setShowPasswords((prev) => ({ ...prev, [campo]: !prev[campo] }));

              return (
                <div key={campo} className="mb-4 relative">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {labels[campo]}
                  </label>
                  <input
                    type={showPasswords[campo] ? "text" : "password"}
                    value={value}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-8 text-gray-500 hover:text-blue-700 transition"
                  >
                    {showPasswords[campo] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Validadores */}
            <div className="text-xs text-gray-600 mb-3 space-y-1">
              <p className={pass.nueva.length >= 8 ? "text-green-600" : "text-gray-500"}>
                • Mínimo 8 caracteres
              </p>
              <p className={/[A-Z]/.test(pass.nueva) ? "text-green-600" : "text-gray-500"}>
                • Al menos una letra mayúscula
              </p>
              <p className={/\d/.test(pass.nueva) ? "text-green-600" : "text-gray-500"}>
                • Al menos un número
              </p>
              <p className={/[!@#$%^&*]/.test(pass.nueva) ? "text-green-600" : "text-gray-500"}>
                • Un carácter especial (!@#$%^&*)
              </p>
            </div>

            {/* Confirmación */}
            {pass.nueva && pass.confirmar && (
              <div
                className={`text-sm font-medium mb-4 text-center ${
                  pass.nueva === pass.confirmar ? "text-green-600" : "text-red-500"
                }`}
              >
                {pass.nueva === pass.confirmar
                  ? "✔ Contraseña confirmada"
                  : "✖ Las contraseñas no coinciden"}
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setModalPassword(false)}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarPassword}
                disabled={
                  !pass.actual ||
                  !pass.nueva ||
                  !pass.confirmar ||
                  pass.nueva !== pass.confirmar ||
                  pass.nueva.length < 8 ||
                  !/[A-Z]/.test(pass.nueva) ||
                  !/\d/.test(pass.nueva) ||
                  !/[!@#$%^&*]/.test(pass.nueva)
                }
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition ${
                  pass.nueva === pass.confirmar &&
                  pass.nueva.length >= 8 &&
                  /[A-Z]/.test(pass.nueva) &&
                  /\d/.test(pass.nueva) &&
                  /[!@#$%^&*]/.test(pass.nueva)
                    ? "bg-blue-900 hover:bg-blue-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
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
