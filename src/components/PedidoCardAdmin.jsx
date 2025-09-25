// src/components/pedidos/PedidoCardAdmin.jsx
import React from "react";

export default function PedidoCardAdmin({ pedido, onCambiarEstado, showActions = true }) {
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
        Fecha: {new Date(pedido.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 text-sm">
        Cliente:{" "}
        {pedido.clienteNombre
          ? pedido.clienteNombre
          : `ID: ${pedido.userId}`}
      </p>

      {/* Totales */}
      <div className="mt-3 text-sm">
        <p><b>Total:</b> ${pedido.costos?.total?.toFixed(2)}</p>
        <p><b>Pagado:</b> ${pedido.montoPagado?.toFixed(2)}</p>
        <p><b>Pendiente:</b> ${pedido.saldoPendiente?.toFixed(2)}</p>
      </div>

      {/* Pagos */}
      {pedido.referenciasPago && pedido.referenciasPago.length > 0 && (
        <div className="mt-3">
          <h3 className="font-semibold">Pagos registrados:</h3>
          <ul className="ml-6 list-disc text-sm">
            {pedido.referenciasPago.map((ref, i) => (
              <li key={i}>
                ${ref.monto} - Ref: {ref.referencia || "N/A"} -{" "}
                {new Date(ref.fecha).toLocaleString()}
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
          <ol className="border-l-2 border-blue-300 pl-4 space-y-2 text-sm">
            {pedido.timeline.map((ev, idx) => (
              <li key={idx} className="flex">
                <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                <p>
              
                  <span className="font-bold">{ev.evento}</span> → {" "}
                  <span className="italic">{ev.estado}</span>
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(ev.ts).toLocaleString()}
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
