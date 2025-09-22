// src/pages/Pedidos/Cliente/DetallePedido.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";

export default function DetallePedido() {
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
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Pedido #{pedido._id.slice(-6)}
        </h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <p><b>Fecha:</b> {new Date(pedido.createdAt).toLocaleString()}</p>
          <p>
            <b>Estado:</b>{" "}
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-900">
              {pedido.estado}
            </span>
          </p>

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
                ${p.monto} - Ref: {p.referencia || "N/A"}{" "}
                ({new Date(p.fecha).toLocaleDateString()})
              </li>
            ))}
          </ul>
          <p className="font-bold mt-2">
            Pagado: ${pedido.montoPagado.toFixed(2)} | Pendiente: $
            {pedido.saldoPendiente.toFixed(2)}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
