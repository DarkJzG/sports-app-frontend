// src/pages/OldContra.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import PantallaCarga from "../components/PantallaCarga";

export default function OlvidoContrasena() {
  const [correo, setCorreo] = useState("");
  const [msg, setMsg] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setEnviado(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();
      setMsg(data.msg);
      setEnviado(data.ok);
    } catch {
      setMsg("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <PantallaCarga show={loading} message="Procesando solicitud..." />
      
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral IZQUIERDO */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-l-3xl p-8 order-1">
          <h1 className="text-2xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="mb-6 text-center">
            Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
          >
            Volver al inicio
          </button>
        </div>

        {/* Formulario de recuperación */}
        <div className="w-1/2 flex items-center justify-center order-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md px-10 py-14"
          >
            <h2 className="text-center text-3xl font-bold mb-6 text-blue-900">
              Recuperar Contraseña
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {msg && (
                <div
                  className={`text-sm text-center font-medium p-2 rounded ${
                    enviado
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }`}
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}