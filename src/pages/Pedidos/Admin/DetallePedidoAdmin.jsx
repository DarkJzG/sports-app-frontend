// src/pages/Pedidos/Admin/DetallePedidoAdmin.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import { API_URL } from "../../../config";

export default function DetallePedidoAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
  const cargar = async () => {
    try {
      const res = await fetch(`${API_URL}/pedido/get/${id}`);
      const data = await res.json();
      if (data.ok) {
        setPedido(data.pedido);
      } else {
        setPedido(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };
  cargar();
}, [id]);


  if (cargando) return <div className="p-10">Cargando pedido...</div>;
  if (!pedido) return <div className="p-10">Pedido no encontrado</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Detalle Pedido #{pedido._id.slice(-6)}
        </h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <p><b>Cliente:</b> {pedido.userId}</p>
          <p><b>Fecha:</b> {new Date(pedido.createdAt).toLocaleString()}</p>
          <p><b>Estado:</b> {pedido.estado}</p>

          <h2 className="text-xl font-semibold mt-4">Dirección de Envío</h2>
          <pre className="bg-gray-100 p-3 rounded">
            {JSON.stringify(pedido.direccionEnvio, null, 2)}
          </pre>

          <h2 className="text-xl font-semibold mt-4">Items</h2>
          <ul className="list-disc ml-6">
            {pedido.items.map((it, idx) => (
              <li key={idx}>
                {it.nombre} ({it.talla} - {it.color?.color}) × {it.cantidad} = $
                {(it.precioUnitario * it.cantidad).toFixed(2)}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Pagos</h2>
          <ul className="list-disc ml-6">
            {pedido.referenciasPago?.map((p, i) => (
              <li key={i}>
                ${p.monto} - Ref: {p.referencia}{" "}
                ({new Date(p.fecha).toLocaleDateString()})
              </li>
            ))}
          </ul>
          <p className="font-bold mt-2">
            Pagado: ${pedido.montoPagado.toFixed(2)} | Pendiente: $
            {pedido.saldoPendiente.toFixed(2)}
          </p>

          <h2 className="text-xl font-semibold mt-4">Historial (Timeline)</h2>
          <ul className="ml-6 text-sm text-gray-700">
            {pedido.timeline?.map((t, i) => (
              <li key={i}>
                {new Date(t.ts).toLocaleString()} → {t.estado} ({t.evento})
              </li>
            ))}
          </ul>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}
