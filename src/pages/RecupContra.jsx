// src/pages/RecupContra.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import PantallaCarga from "../components/PantallaCarga";
import { Eye, EyeOff } from "lucide-react";

export default function RestablecerContrasena() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmar: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setMsg("❌ Token de verificación inválido o faltante");
    } else {
      setToken(t);
    }
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setOk(false);
    setLoading(true);

    const reglas =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password);

    if (!reglas) {
      setMsg("La contraseña debe tener 8+ caracteres, una mayúscula, un número y un símbolo especial.");
      setLoading(false);
      return;
    }

    if (password !== confirmar) {
      setMsg("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMsg(data.msg);
      setOk(data.ok);

      if (data.ok) {
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch {
      setMsg("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Validadores visuales
  const cumpleLongitud = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /\d/.test(password);
  const tieneEspecial = /[!@#$%^&*]/.test(password);
  const coincide = password && password === confirmar;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <PantallaCarga show={loading} message="Actualizando contraseña..." />
      
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral IZQUIERDO */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-l-3xl p-8 order-1">
          <h1 className="text-2xl font-bold mb-2">Restablecer Contraseña</h1>
          <p className="mb-6 text-center">
            Crea una nueva contraseña segura para tu cuenta.
          </p>
        </div>

        {/* Formulario de recuperación */}
        <div className="w-1/2 flex items-center justify-center order-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md px-10 py-14"
          >
            <h2 className="text-center text-3xl font-bold mb-6 text-blue-900">
              Nueva Contraseña
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword.password ? "text" : "password"}
                    placeholder="Ingresa tu nueva contraseña"
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                  >
                    {showPassword.password ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirmar ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmar")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                  >
                    {showPassword.confirmar ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Validadores de contraseña */}
              <div className="text-xs text-gray-600 space-y-1">
                <p className={cumpleLongitud ? "text-green-600" : "text-gray-500"}>
                  - Mínimo 8 caracteres
                </p>
                <p className={tieneMayuscula ? "text-green-600" : "text-gray-500"}>
                  - Al menos una letra mayúscula
                </p>
                <p className={tieneNumero ? "text-green-600" : "text-gray-500"}>
                  - Al menos un número
                </p>
                <p className={tieneEspecial ? "text-green-600" : "text-gray-500"}>
                  - Un carácter especial (!@#$%^&*)
                </p>
                <p className={coincide ? "text-green-600" : "text-gray-500"}>
                  - Coincidencia
                </p>
              </div>

              {msg && (
                <div
                  className={`text-sm text-center font-medium p-2 rounded ${
                    ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !(cumpleLongitud && tieneMayuscula && tieneNumero && tieneEspecial && coincide)}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  loading || !(cumpleLongitud && tieneMayuscula && tieneNumero && tieneEspecial && coincide)
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }`}
              >
                {loading ? "Actualizando..." : "Guardar nueva contraseña"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}