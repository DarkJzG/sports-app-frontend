// src/components/pedidos/PedidoCardAdmin.jsx
import React, { useState } from "react";
import { API_URL } from "../config";

export default function PedidoCardAdmin({ pedido, onCambiarEstado, showActions = true }) {
  const fechaCreacion = pedido.createdAt
    ? new Date(pedido.createdAt.replace("+00:00", "Z"))
    : null;

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "pendiente_pago":
        return { label: "Pago sin completar", color: "bg-red-100 text-red-700" };
      case "pagado_total":
        return { label: "Pago completado", color: "bg-green-100 text-green-700" };
      case "pagado_parcial":
        return { label: "Pago parcial", color: "bg-yellow-100 text-yellow-700" };
      default:
        return { label: estado, color: "bg-blue-100 text-blue-900" };
    }
  };

  const estadoInfo = getEstadoLabel(pedido.estado);

  // Tiempo restante para entrega
  let tiempoRestante = "";
  if (pedido.fechaEntrega) {
    const fin = new Date(pedido.fechaEntrega);
    const diff = fin - new Date();
    if (diff > 0) {
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      tiempoRestante = `Faltan ${dias} días y ${horas} horas para la entrega`;
    } else {
      tiempoRestante = "Fecha de entrega vencida";
    }
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 border-l-4 border-blue-900">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-900">
          Pedido #{pedido._id.slice(-6)}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${estadoInfo.color}`}
        >
          {estadoInfo.label}
        </span>
      </div>

      <p className="text-gray-600 text-sm">
        Fecha:{" "}
        {fechaCreacion
          ? fechaCreacion.toLocaleDateString("es-EC", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Sin fecha"}
      </p>

      <p className="text-gray-600 text-sm">
        Cliente:{" "}
        {pedido.clienteNombre ? pedido.clienteNombre : `ID: ${pedido.userId}`}
      </p>

      {/* Totales */}
      <div className="mt-3 text-sm">
        <p>
          <b>Total:</b> ${pedido.costos?.total?.toFixed(2)}
        </p>
        <p>
          <b>Pagado:</b> ${pedido.montoPagado?.toFixed(2)}
        </p>
        <p>
          <b>Pendiente:</b> ${pedido.saldoPendiente?.toFixed(2)}
        </p>
      </div>

      {/* Tiempo restante */}
      {pedido.fechaEntrega && (
        <p className="mt-2 text-sm text-blue-700 font-medium">
          {tiempoRestante}
        </p>
      )}

      {/* Pagos */}
      {pedido.pagos && pedido.pagos.length > 0 && (
        <div className="mt-3">
          <h3 className="font-semibold">Pagos registrados:</h3>
          <ul className="ml-6 list-disc text-sm">
            {pedido.pagos.map((ref, i) => (
              <li key={i}>
                ${ref.monto?.toFixed(2)} - Ref: {ref.referencia || "N/A"} -{" "}
                {ref.fecha
                  ? new Date(ref.fecha).toLocaleString("es-EC")
                  : "Sin fecha"}
                {ref.presencial && " (Presencial)"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      {pedido.timeline && pedido.timeline.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Historial</h3>
          <ol className="border-l-2 border-blue-300 pl-4 space-y-2 text-sm relative">
            {pedido.timeline.map((ev, idx) => (
              <li key={idx} className="ml-2">
                <div className="absolute -left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                <p>
                  <span className="font-bold">{ev.evento}</span> →{" "}
                  <span className="italic">{ev.estado}</span>
                </p>
                <p className="text-gray-500 text-xs">
                  {ev.ts
                    ? new Date(ev.ts).toLocaleString("es-EC")
                    : "Sin fecha"}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Botón acción */}
      {showActions && (
        <div className="mt-4">
          <button
            onClick={() => onCambiarEstado && onCambiarEstado(pedido)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
          >
            Cambiar estado
          </button>
        </div>
      )}
    </div>
  );
}
