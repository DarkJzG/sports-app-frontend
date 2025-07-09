import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; 

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();   // <-- dentro del componente

  // Estado para los campos y mensaje
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  // Lógica de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();

      if (data.ok) {
        setUser(data.usuario);  
        if (data.usuario.rol === "admin") {

          navigate("/admin");
        } else {

          navigate("/");
        }
      } else {
        setMsg(data.msg || "Correo o contraseña incorrectos");
      }
    } catch (err) {
      setMsg("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral DERECHO */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-r-3xl p-8 transition-all duration-700 order-2">
          <h1 className="text-2xl font-bold font-rubik mb-2">¡Hola!</h1>
          <p className="mb-6 text-center">¿No tienes una cuenta? Regístrate para utilizar todas las funciones del sitio.</p>
          <button
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition pointer-events-auto"
            onClick={() => navigate("/registro")}
          >
            Crear Cuenta
          </button>
        </div>
        {/* Formulario de Login (IZQUIERDA) */}
        <div className="w-1/2 flex items-center justify-center order-1">
          <form
            className="flex flex-col gap-2 bg-white px-10 py-14 rounded-3xl shadow-md w-full max-w-md"
            onSubmit={handleLogin}
          >
            <h2 className="text-center text-3xl font-bold font-rubik mb-3 text-blue-900">Iniciar Sesión</h2>
            <div className="mb-4 w-10 h-10 border rounded-full flex items-center justify-center bg-blue-800 shadow hover:bg-black cursor-pointer mx-auto">
              <i className="fab fa-google text-xl text-white"></i>
            </div>
            <span className="text-gray-500 text-center text-sm mb-3">o usa tu contraseña de correo electrónico</span>
            <input
              type="email"
              placeholder="Correo"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={correo}
              onChange={e => setCorreo(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-xs text-blue-700 mb-2 hover:underline w-fit"
            >
              ¿Olvidaste tu contraseña?
            </button>
            {msg && <span className="text-red-600 text-sm mb-2 text-center">{msg}</span>}
            <button
              className="w-full py-3 bg-blue-900 text-white font-bold font-rubik rounded-lg hover:bg-blue-700 transition mt-2"
              type="submit"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
