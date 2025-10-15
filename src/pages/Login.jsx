// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
import PantallaCarga from "../components/PantallaCarga";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [mensajeVerificado, setMensajeVerificado] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Si llega ?verificado=true desde el link de verificación
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verificado = queryParams.get("verificado");
    if (verificado === "true") {
      setMensajeVerificado("✅ Tu cuenta ha sido verificada con éxito. Ya puedes iniciar sesión.");
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (data.ok) {
        // Guardar en contexto global
        login(data.usuario, data.token);
        navigate(data.usuario.rol === "admin" ? "/admin" : "/");
      } else if (data.msg === "Cuenta no verificada") {
        // Cuenta no verificada → mostrar opción para reenviar correo
        setMsg(
          <div className="text-red-600 text-sm">
            Tu cuenta aún no está verificada.
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const resp = await fetch(`${API_URL}/auth/resend-verification`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ correo }),
                  });
                  const result = await resp.json();
                  setMsg(
                    <span className="text-green-600 text-sm">
                      {result.msg || "Correo de verificación reenviado"}
                    </span>
                  );
                } catch {
                  setMsg("Error al reenviar verificación.");
                } finally {
                  setLoading(false);
                }
              }}
              className="ml-2 text-blue-700 underline hover:text-blue-900"
            >
              Reenviar verificación
            </button>
          </div>
        );
      } else {
        setMsg(data.msg || "Correo o contraseña incorrectos");
      }
    } catch {
      setMsg("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <PantallaCarga show={loading} message="Verificando tus credenciales..." />

      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral DERECHO */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-r-3xl p-8 order-2">
          <h1 className="text-2xl font-bold mb-2">¡Hola!</h1>
          <p className="mb-6 text-center">¿No tienes una cuenta? Regístrate para utilizar todas las funciones.</p>
          <button
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
            onClick={() => navigate("/registro")}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Formulario de Login */}
        <div className="w-1/2 flex items-center justify-center order-1">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-2 bg-white px-10 py-14 rounded-3xl shadow-md w-full max-w-md"
          >
            <h2 className="text-center text-3xl font-bold mb-4 text-blue-900">Iniciar Sesión</h2>

            <input
              type="email"
              placeholder="Correo electrónico"
              className="px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full px-4 py-2 pr-10 rounded bg-gray-100 border outline-blue-300"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/olvido-contrasena")}
              className="text-xs text-blue-700 mb-2 hover:underline w-fit"
            >
              ¿Olvidaste tu contraseña?
            </button>

            {mensajeVerificado && (
              <div className="text-green-600 text-sm mb-2 text-center">{mensajeVerificado}</div>
            )}

            {msg && <div className="text-sm mb-2 text-center">{msg}</div>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-700 transition mt-2"
              disabled={loading}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
