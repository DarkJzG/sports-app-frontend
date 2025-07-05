import React, { useState } from "react";

export default function Auth() {
  const [showRegister, setShowRegister] = useState(false);

    // Funcion para enviar el registro de usuario

    const handleRegister = async (e) => {
  e.preventDefault();
  // Obtiene los datos del formulario
  const nombre = e.target.nombre.value;
  const correo = e.target.correo.value;
  const password = e.target.password.value;

  // Puedes hacer validaciones aquí...

  try {
    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, password }),
    });
    const data = await res.json();
    if (data.ok) {
      alert("¡Usuario registrado! Ya puedes iniciar sesión.");
      setShowRegister(false); // Muestra el login
    } else {
      alert(data.msg || "Error en el registro");
    }
  } catch (err) {
    alert("Error de conexión con el servidor");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 py-10">
      <div className="relative w-full max-w-4xl min-h-[550px] flex rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Panel lateral, SIEMPRE visible */}
        <div className="flex flex-col w-1/2 justify-center items-center bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-l-3xl p-8 transition-all duration-700">
          {showRegister ? (
            <>
              <h1 className="text-2xl font-bold font-rubik mb-2">¡Bienvenido de nuevo!</h1>
              <p className="mb-6 text-center">Introduce tus credenciales para utilizar todas las funciones del sitio</p>
              <button
                className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition pointer-events-auto"
                onClick={() => setShowRegister(false)}
              >
                Iniciar Sesión
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-rubik mb-2">¡Hola!</h1>
              <p className="mb-6 text-center">¿No tienes una cuenta? Regístrate para utilizar todas las funciones del sitio.</p>
              <button
                className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition pointer-events-auto"
                onClick={() => setShowRegister(true)}
              >
                Crear Cuenta
              </button>
            </>
          )}
        </div>
        {/* Panel de formularios animado */}
        <div className="relative w-1/2 flex items-center justify-center">
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              showRegister
                ? "opacity-0 pointer-events-none translate-x-10 scale-95"
                : "opacity-100 pointer-events-auto translate-x-0 scale-100"
            }`}
          >
            {/* Formulario de Login */}
            <form className="flex flex-col gap-2 bg-white px-10 py-14 rounded-3xl shadow-md">
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
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
                required
              />
              <button
                type="button"
                className="text-xs text-blue-700 mb-2 hover:underline w-fit"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <button
                className="w-full py-3 bg-blue-900 text-white font-bold font-rubik rounded-lg hover:bg-blue-700 transition mt-2"
                type="button"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              showRegister
                ? "opacity-100 pointer-events-auto translate-x-0 scale-100"
                : "opacity-0 pointer-events-none -translate-x-10 scale-95"
            }`}
          >
            {/* Formulario de Registro */}
                <form
                className="flex flex-col gap-2 bg-white px-10 py-14 rounded-3xl shadow-md"
                onSubmit={handleRegister}
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
                />
                <input
                    name="correo"
                    type="email"
                    placeholder="Correo"
                    className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    className="mb-2 px-4 py-2 w-full rounded bg-gray-100 border outline-blue-300"
                    required
                />
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
    </div>
  );
}
