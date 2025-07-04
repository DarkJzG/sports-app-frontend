import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 to-blue-300">
      {/* Navbar superior */}
      <nav className="w-full flex items-center justify-between px-8 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo aquí */}
          <img
            src="/LogoP.png"
            alt="Logo"
            className="w-10 h-10 rounded-full object-contain"
          />
          <span className="font-bold text-xl tracking-wide text-blue-900">JOHAN <span className="font-light">SPORT</span></span>
        </div>
        <ul className="flex gap-7 text-blue-900 font-medium">
          <li><a href="#">Productos</a></li>
          <li><a href="#">Telas</a></li>
          <li><a href="#">Obra</a></li>
          <li><a href="#">Categorías</a></li>
        </ul>
        <button className="bg-blue-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 transition">Iniciar Sesión</button>
      </nav>

      {/* Contenido principal */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-3xl flex shadow-2xl rounded-3xl bg-white/70 backdrop-blur-sm my-10">
          {/* Lado Izquierdo: Login */}
          <div className="flex-1 p-10 flex flex-col justify-center bg-white rounded-l-3xl">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Iniciar Sesión</h2>
            <button className="mb-4 w-10 h-10 border rounded-full flex items-center justify-center bg-white shadow hover:bg-gray-100">
              <span className="text-xl">G+</span>
            </button>
            <span className="text-gray-500 text-sm mb-3">o usa tu contraseña de correo electrónico</span>
            <input
              type="email"
              placeholder="Correo"
              className="mb-3 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
            />
            <a href="#" className="text-xs text-blue-700 mb-3 hover:underline">¿Olvidaste tu contraseña?</a>
            <button className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition">INICIAR SESIÓN</button>
          </div>
          {/* Lado Derecho: Registro */}
          <div className="flex-1 p-10 flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-blue-400 text-white rounded-r-3xl">
            <h2 className="text-2xl font-bold mb-2">Hola!</h2>
            <p className="text-center text-white mb-7">¿No tienes una cuenta? Regístrate para utilizar todas las funciones del sitio.</p>
            <button className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition">CREAR CUENTA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
