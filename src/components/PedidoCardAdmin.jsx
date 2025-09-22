// src/components/pedidos/PedidoCardAdmin.jsx
import React from "react";

export default function PedidoCardAdmin({ pedido, onCambiarEstado, showActions = true }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-900">
          Pedido #{pedido._id.slice(-6)}
        </h2>
        <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-900">
          {pedido.estado}
        </span>
      </div>
      <p className="text-gray-600 text-sm">
        Fecha: {new Date(pedido.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 text-sm">Cliente: {pedido.userId}</p>

      <div className="mt-3 text-sm">
        <p><b>Total:</b> ${pedido.costos.total.toFixed(2)}</p>
        <p><b>Pagado:</b> ${pedido.montoPagado.toFixed(2)}</p>
        <p><b>Pendiente:</b> ${pedido.saldoPendiente.toFixed(2)}</p>
      </div>

      <div className="mt-3">
        <h3 className="font-semibold">Pagos registrados:</h3>
        <ul className="ml-6 list-disc text-sm">
          {pedido.referenciasPago?.map((ref, i) => (
            <li key={i}>
              ${ref.monto} - Ref: {ref.referencia} -{" "}
              {new Date(ref.fecha).toLocaleString()}
              {ref.presencial && " (Presencial)"}
            </li>
          ))}
        </ul>
      </div>

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
