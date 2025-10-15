// src/pages/Registro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
import PantallaCarga from "../components/PantallaCarga";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [msg, setMsg] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmar: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validadores de contraseña
  const cumpleLongitud = form.password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(form.password);
  const tieneNumero = /\d/.test(form.password);
  const tieneEspecial = /[!@#$%^&*]/.test(form.password);
  const coincide = form.password && form.password === form.confirmar;
  const puedeRegistrar = cumpleLongitud && tieneMayuscula && tieneNumero && tieneEspecial && coincide;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!puedeRegistrar) {
      setMsg({ text: "La contraseña no cumple los requisitos", color: "red" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (res.status === 400) {
        setMsg({ text: data.msg || "Error al registrar", color: "red" });
      } else if (data.ok) {
        setMsg({
          text: `✅ Registro exitoso. Se ha enviado un correo de verificación a ${form.correo}.`,
          color: "green",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMsg({ text: "Error al registrar", color: "red" });
      }
    } catch {
      setMsg({ text: "Error de conexión con el servidor", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <PantallaCarga show={loading} message="Creando cuenta..." />
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral IZQUIERDA */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-l-3xl p-8 order-1">
          <h1 className="text-2xl font-bold font-rubik mb-2">¡Bienvenido de nuevo!</h1>
          <p className="mb-6 text-center">Introduce tus credenciales para utilizar todas las funciones del sitio.</p>
          <button
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Formulario de Registro (DERECHA) */}
        <div className="w-1/2 flex items-center justify-center order-2">
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-3 bg-white px-10 py-14 rounded-3xl shadow-md w-full max-w-md"
          >
            <h2 className="text-center text-3xl font-bold font-rubik mb-3 text-blue-900">
              Crear Cuenta
            </h2>

            <input
              name="nombre"
              type="text"
              placeholder="Nombre completo"
              className="px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              className="px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={form.correo}
              onChange={handleChange}
            />

            {/* Campo contraseña */}
            <div className="relative">
              <input
                name="password"
                type={showPasswords.password ? "text" : "password"}
                placeholder="Contraseña"
                className="px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300 pr-10"
                required
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((p) => ({ ...p, password: !p.password }))
                }
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
              >
                {showPasswords.password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <input
                name="confirmar"
                type={showPasswords.confirmar ? "text" : "password"}
                placeholder="Confirmar contraseña"
                className="px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300 pr-10"
                required
                value={form.confirmar}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((p) => ({ ...p, confirmar: !p.confirmar }))
                }
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
              >
                {showPasswords.confirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Validadores visuales */}
            <div className="text-xs text-gray-600 mb-2 space-y-1">
              <p className={cumpleLongitud ? "text-green-600" : "text-gray-500"}>• Mínimo 8 caracteres</p>
              <p className={tieneMayuscula ? "text-green-600" : "text-gray-500"}>• Al menos una letra mayúscula</p>
              <p className={tieneNumero ? "text-green-600" : "text-gray-500"}>• Al menos un número</p>
              <p className={tieneEspecial ? "text-green-600" : "text-gray-500"}>• Un carácter especial (!@#$%^&*)</p>
            </div>

            {/* Confirmación */}
            {form.confirmar && (
              <p
                className={`text-sm font-medium text-center ${
                  coincide ? "text-green-600" : "text-red-500"
                }`}
              >
                {coincide ? "Contraseña confirmada" : "Las contraseñas no coinciden"}
              </p>
            )}

            {msg && (
              <span className={`text-sm text-${msg.color}-600 mb-2 text-center`}>
                {msg.text}
              </span>
            )}

            <button
              className={`w-full py-3 font-bold rounded-lg mt-3 transition ${
                puedeRegistrar
                  ? "bg-blue-900 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
              type="submit"
              disabled={!puedeRegistrar}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
