// src/pages/Pedidos/Admin/GestionPagos.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import PedidoCardAdmin from "../../../components/PedidoCardAdmin";

export default function GestionPagos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API_URL}/pedido/all`);
        const data = await res.json();
        if (data.ok) {
          const filtrados = (data.pedidos || []).filter(p =>
            ["pendiente_pago", "pagado_parcial"].includes(p.estado)
          );
          setPedidos(filtrados);
        }
      } catch (e) {
        setError("Error cargando pedidos");
      } finally {
        setCargando(false);
      }
    };
  
    cargarPedidos();
  }, []);
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Gestión de Pagos</h1>

        {/* Loader */}
        {cargando && (
          <div className="text-center text-gray-600">
            Cargando pedidos pendientes de pago...
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Lista de pedidos */}
        {!cargando && !error && (
          pedidos.length === 0 ? (
            <p className="text-gray-600">No hay pedidos pendientes de pago.</p>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p) => (
                <PedidoCardAdmin
                  key={p._id}
                  pedido={p}
                  showActions={false} // 🔒 solo revisión de pagos, no cambiar estado
                />
              ))}
            </div>
          )
        )}
      </main>
      <FooterAdmin />
    </div>
  );
}
