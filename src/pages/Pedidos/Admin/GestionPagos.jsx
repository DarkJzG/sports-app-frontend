// src/pages/Pedidos/Admin/GestionPagos.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import PedidoCardAdmin from "../../../components/PedidoCardAdmin";

export default function GestionPagos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/pedido/all?estado=pendiente_pago`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPedidos(data.pedidos || []);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Gestión de Pagos</h1>

        {pedidos.length === 0 ? (
          <p>No hay pedidos pendientes de pago.</p>
        ) : (
          pedidos.map(p => (
            <PedidoCardAdmin
              key={p._id}
              pedido={p}
              showActions={false}  // aquí solo revisas pagos, no cambias estado
            />
          ))
        )}
      </main>
      <FooterAdmin />
    </div>
  );
}
