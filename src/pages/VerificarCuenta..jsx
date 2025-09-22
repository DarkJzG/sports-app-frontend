// src/pages/VerificarCuenta.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";


export default function VerificarCuenta() {
  const [msg, setMsg] = useState("Verificando tu cuenta...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMsg("Token de verificación inválido o faltante");
      return;
    }

    const verificar = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/verificar/${token}`);
        const data = await res.json();
        setMsg(data.msg);

        if (data.ok) {
          setTimeout(() => navigate("/login?verificado=true"), 2000);
        }
      } catch {
        setMsg("Error de conexión con el servidor");
      }
    };

    verificar();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Verificación de Cuenta</h1>
        <p className="text-gray-700">{msg}</p>
      </div>
    </div>
  );
}
