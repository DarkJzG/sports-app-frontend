import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/registroServicio";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", correo: "", password: "" });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await registerUser(form);
      if (res.ok) {
        setMsg({ text: "¡Registro exitoso! Redirigiendo...", color: "green" });
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setMsg({ text: res.msg || "Error al registrar", color: "red" });
      }
    } catch (error) {
      setMsg({ text: "Error de conexión con el servidor", color: "red" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral IZQUIERDA */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-l-3xl p-8 transition-all duration-700 order-1">
          <h1 className="text-2xl font-bold font-rubik mb-2">¡Bienvenido de nuevo!</h1>
          <p className="mb-6 text-center">Introduce tus credenciales para utilizar todas las funciones del sitio</p>
          <button
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition pointer-events-auto"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </div>
        {/* Formulario de Registro (DERECHA) */}
        <div className="w-1/2 flex items-center justify-center order-2">
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-2 bg-white px-10 py-14 rounded-3xl shadow-md w-full max-w-md"
          >
            <h2 className="text-center text-3xl font-bold font-rubik mb-3 text-blue-900">Crear Cuenta</h2>
            <div className="mb-4 w-10 h-10 border rounded-full flex items-center justify-center bg-blue-800 shadow hover:bg-black cursor-pointer mx-auto">
              <i className="fab fa-google text-xl text-white"></i>
            </div>
            <span className="text-gray-500 text-center text-sm mb-3">o utiliza tu correo electrónico para registrarte</span>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              name="correo"
              type="email"
              placeholder="Correo"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={form.correo}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={form.password}
              onChange={handleChange}
            />
            {msg && (
              <span className={`text-sm text-${msg.color}-600 mb-2 text-center`}>{msg.text}</span>
            )}
            <button
              className="w-full py-3 bg-blue-800 text-white font-bold font-rubik rounded-lg hover:bg-blue-600 transition mt-5"
              type="submit"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
