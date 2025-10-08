// src/pages/Pedidos/Admin/PedidosAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import PedidoCardAdmin from "../../../components/PedidoCardAdmin";

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const navigate = useNavigate();

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError("");

      const url = estadoFiltro
        ? `${API_URL}/pedido/all?estado=${estadoFiltro}`
        : `${API_URL}/pedido/all`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.ok) {
        setPedidos(data.pedidos || []);
      } else {
        setError(data.msg || "Error cargando pedidos");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [estadoFiltro]);

  const handleCambiarEstado = (pedido) => {
    navigate(`/admin/pedidos/${pedido._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Gestión de Pedidos
          </h1>

          {/* Filtro por estado */}
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="pendiente_pago">Pendiente Pago</option>
            <option value="pagado_parcial">Pagado Parcial</option>
            <option value="pagado_total">Pagado Total</option>
            <option value="en_produccion">En Producción</option>
            <option value="listo">Listo</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
            <option value="fallido">Fallido</option>
          </select>
        </div>

        {loading ? (
          <p>Cargando pedidos...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : pedidos.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          <div className="space-y-4">
            {pedidos.map((p) => (
              <PedidoCardAdmin
                key={p._id}
                pedido={p}
                onCambiarEstado={handleCambiarEstado}
                showActions={true}
              />
            ))}
          </div>
        )}
      </main>
      <FooterAdmin />
    </div>
  );
}
