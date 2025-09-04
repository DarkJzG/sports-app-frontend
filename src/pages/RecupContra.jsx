import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function RestablecerContrasena() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setMsg("Token inválido o faltante");
    } else {
      setToken(t);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmar) {
      setMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/restablecer-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      setMsg(data.msg);

      if (data.ok) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMsg("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Restablecer Contraseña</h1>
        {msg && <div className="mb-4 text-center text-sm font-semibold text-red-600">{msg}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="px-4 py-2 rounded bg-gray-100 border outline-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="px-4 py-2 rounded bg-gray-100 border outline-blue-300"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
