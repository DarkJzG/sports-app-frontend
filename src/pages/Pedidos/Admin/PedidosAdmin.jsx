// src/pages/Pedidos/Admin/PedidosAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import PedidoCardAdmin from "../../../components/PedidoCardAdmin";

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/pedido/all`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPedidos(data.pedidos || []);
      });
  }, []);

  const handleCambiarEstado = (pedido) => {
    navigate(`/admin/pedidos/${pedido._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Gestión de Pedidos</h1>

        {pedidos.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          pedidos.map(p => (
            <PedidoCardAdmin
              key={p._id}
              pedido={p}
              onCambiarEstado={handleCambiarEstado}
              showActions={true}
            />
          ))
        )}
      </main>
      <FooterAdmin />
    </div>
  );
}
