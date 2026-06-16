// src/components/Perfil/PanelPedidos.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Componente para badge de estado
const EstadoBadge = ({ estado }) => {
  const estadosMap = {
    en_revision: { label: "En Revisión", color: "bg-yellow-100 text-yellow-800" },
    pendiente_pago: { label: "Pendiente Pago", color: "bg-red-100 text-red-800" },
    pagado_parcial: { label: "Pago Parcial", color: "bg-orange-100 text-orange-800" },
    pagado_total: { label: "Pagado", color: "bg-green-100 text-green-800" },
    en_produccion: { label: "En Producción", color: "bg-indigo-100 text-indigo-800" },
    listo: { label: "Listo", color: "bg-purple-100 text-purple-800" },
    enviado: { label: "En Camino", color: "bg-cyan-100 text-cyan-800" },
    retiro: { label: "Para Retiro", color: "bg-blue-100 text-blue-800" },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-800" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" }
  };

  const config = estadosMap[estado] || { label: estado, color: "bg-gray-100 text-gray-800" };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function PanelPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (data.ok) {
          // Ordenar por fecha más reciente y limitar a los últimos 5
          const pedidosOrdenados = data.pedidos
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setPedidos(pedidosOrdenados);
        }
      } catch (error) {
        toast.error("Error al cargar pedidos");
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, [user]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mis Pedidos</h2>
        <Link
          to="/mis-pedidos"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver todos →
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-600 mb-4">Aún no has realizado pedidos</p>
          <Link
            to="/catalogo"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const infoPago = pedido.infoPago || {};
            const saldoPendiente = infoPago.saldo_pendiente || 0;
            const hayPagosPendientes = pedido.pagos?.some(p => p.estado === 'pendiente') || false;

            return (
              <div key={pedido._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Pedido #{pedido._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {formatDate(pedido.createdAt)}
                    </p>
                  </div>
                  <EstadoBadge estado={pedido.estado} />
                </div>

                {/* Información financiera */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="font-semibold text-sm">
                      {formatCurrency(infoPago.total_pedido || pedido.costos?.total || 0)}
                    </p>
                  </div>
                  <div className={`rounded p-2 ${saldoPendiente > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                    <p className="text-xs text-gray-600">Saldo</p>
                    <p className={`font-semibold text-sm ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(saldoPendiente)}
                    </p>
                  </div>
                </div>

                {/* Progreso de pago */}
                {infoPago.porcentaje_pagado !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Pagado</span>
                      <span>{Math.round(infoPago.porcentaje_pagado)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          infoPago.porcentaje_pagado >= 100 ? 'bg-green-600' :
                          infoPago.porcentaje_pagado >= 50 ? 'bg-blue-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(infoPago.porcentaje_pagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Alerta de pagos pendientes */}
                {hayPagosPendientes && (
                  <div className="mb-3 bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded-r text-xs text-yellow-800">
                    ⏳ Pago en revisión
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    to={`/pedido/${pedido._id}`}
                    className="flex-1 text-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  {saldoPendiente > 0 && !hayPagosPendientes && pedido.estado !== 'cancelado' && (
                    <Link
                      to={`/agregar-pago/${pedido._id}`}
                      className="flex-1 text-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      💳 Pagar
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Botón Ver todos al final */}
          <Link
            to="/mis-pedidos"
            className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Ver todos mis pedidos
          </Link>
        </div>
      )}
    </div>
  );
}
