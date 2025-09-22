// src/pages/Pedidos/Cliente/MisPedidos.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";

export default function MisPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");

  // Estado para completar pago
  const [pagoPedidoId, setPagoPedidoId] = useState(null);
  const [montoPago, setMontoPago] = useState(0);
  const [referenciaPago, setReferenciaPago] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`);
        const data = await res.json();
        if (data.ok) {
          setPedidos(data.pedidos || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, [user, navigate]);

  const handleAbrirPago = (pedido) => {
    setPagoPedidoId(pedido._id);
    setMontoPago(pedido.saldoPendiente || 0);
    setReferenciaPago("");
  };

  const handleRegistrarPago = async () => {
    if (!montoPago || !referenciaPago) {
      setMsg("Completa los datos del pago");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/pedido/${pagoPedidoId}/pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: montoPago,
          referencia: referenciaPago,
          presencial: false,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("✅ Pago registrado con éxito");
        // refrescar pedidos
        const res2 = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`);
        const data2 = await res2.json();
        if (data2.ok) setPedidos(data2.pedidos);
        setPagoPedidoId(null);
      } else {
        setMsg("❌ " + (data.msg || "Error al registrar pago"));
      }
    } catch (e) {
      setMsg("Error de conexión con el servidor");
    }
  };

  if (cargando) return <div className="p-10">Cargando pedidos...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-gray-600">Aún no has realizado pedidos.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center">
                    <h2
                    onClick={() => navigate(`/mis-pedidos/${p._id}`)}
                    className="text-xl font-semibold text-blue-900 hover:underline cursor-pointer"
                    >
                    Pedido #{p._id.slice(-6)}
                    </h2>
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-900">
                    {p.estado}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  Fecha: {new Date(p.createdAt).toLocaleDateString()}
                </p>

                {/* Items */}
                <div className="mt-4 space-y-2">
                  {p.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {it.nombre} ({it.talla} - {it.color?.color}) × {it.cantidad}
                      </span>
                      <span>${(it.precioUnitario * it.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-3" />

                <p>Subtotal: ${p.costos.subtotal.toFixed(2)}</p>
                <p>Total: ${p.costos.total.toFixed(2)}</p>
                <p className="font-bold text-blue-900">
                  Pagado: ${p.montoPagado?.toFixed(2)} | Pendiente: $
                  {p.saldoPendiente?.toFixed(2)}
                </p>

                {/* Referencias de pago */}
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-700">Pagos registrados:</h3>
                  <ul className="list-disc ml-5 text-sm">
                    {p.referenciasPago?.map((ref, i) => (
                      <li key={i}>
                        ${ref.monto} - Ref: {ref.referencia}{" "}
                        ({new Date(ref.fecha).toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botón completar pago */}
                {p.saldoPendiente > 0 && (
                  <button
                    onClick={() => handleAbrirPago(p)}
                    className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    Completar Pago (${p.saldoPendiente.toFixed(2)})
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal completar pago */}
        {pagoPedidoId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl shadow w-96">
              <h2 className="text-lg font-bold mb-4 text-blue-900">
                Completar Pago
              </h2>
              <label className="block text-sm font-semibold">Monto</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-3"
                value={montoPago}
                onChange={(e) => setMontoPago(parseFloat(e.target.value))}
              />
              <label className="block text-sm font-semibold">
                Referencia de Transferencia
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-3"
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPagoPedidoId(null)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegistrarPago}
                  className="px-4 py-2 rounded bg-blue-900 text-white font-bold"
                >
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {msg && <div className="mt-6 text-center text-blue-900 font-bold">{msg}</div>}
      </main>
      <Footer />
    </div>
  );
}
