// src/pages/Perfil.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";

export default function PerfilUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({});
  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState("");

  // cargar datos del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cargarPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/usuario/perfil/${user.id}`);
        const data = await res.json();
        if (data.ok) setPerfil(data.usuario);
      } catch (e) {
        console.error(e);
      }
    };
    cargarPerfil();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API_URL}/usuario/perfil/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("✅ Perfil actualizado");
        setEditando(false);
      } else {
        setMsg("❌ " + (data.msg || "Error al guardar"));
      }
    } catch (e) {
      setMsg("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <Navbar />

      {/* Banner Perfil */}
      <section className="bg-blue-900 text-white px-8 py-8 flex items-center gap-4">
        <h2 className="text-3xl font-semibold flex-1">Perfil</h2>
        <button
          onClick={handleLogout}
          className="ml-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
        >
          Cerrar Sesión
        </button>
      </section>

      <main className="flex-1 px-8 py-10 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Información</h3>

        {editando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {["nombre","apellido","correo","telefono","codigo_postal","direccion_principal","direccion_secundaria","ciudad","provincia","pais"].map((campo) => (
              <div key={campo} className="bg-white rounded-xl shadow p-4">
                <span className="text-xs text-gray-500 capitalize">{campo}</span>
                <input
                  className="w-full mt-1 border px-3 py-2 rounded"
                  value={perfil[campo] || ""}
                  onChange={(e) => setPerfil({ ...perfil, [campo]: e.target.value })}
                  disabled={campo === "correo"} // no permitir editar correo
                />
              </div>
            ))}
            <button
              onClick={handleGuardar}
              className="col-span-full bg-blue-900 text-white font-bold px-6 py-3 rounded-lg"
            >
              Guardar Cambios
            </button>
          </div>
        ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {Object.entries(perfil)
            .filter(([k, v]) => !["_id", "__v", "token_verificacion", "rol"].includes(k))
            .map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl shadow p-4">
                <span className="text-xs text-gray-500 capitalize">{k}</span>
                <div className="font-semibold text-gray-900">{v === true ? 'Sí' :v === false ? 'No' : v || "-"}</div>
              </div>
            ))}
          <button
            onClick={() => setEditando(true)}
            className="col-span-full bg-blue-900 text-white font-bold px-6 py-3 rounded-lg"
          >
            Editar Perfil
          </button>
        </div>

        )}

        {msg && <div className="mt-4 text-blue-900 font-semibold">{msg}</div>}
      </main>

      <Footer />
    </div>
  );
}
