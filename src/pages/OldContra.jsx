import React, { useState } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";


export default function OlvidoContrasena() {
  const [correo, setCorreo] = useState("");
  const [msg, setMsg] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/auth/olvidar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
      });

      const data = await res.json();
      setMsg(data.msg);
      setEnviado(data.ok);
    } catch (err) {
      setMsg("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">¿Olvidaste tu contraseña?</h1>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        {msg && <div className={`mb-4 text-sm text-center font-semibold ${enviado ? "text-green-600" : "text-red-600"}`}>{msg}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Tu correo"
            className="px-4 py-2 rounded bg-gray-100 border outline-blue-300"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
}
