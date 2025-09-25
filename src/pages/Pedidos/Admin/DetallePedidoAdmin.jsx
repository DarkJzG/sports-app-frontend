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

  // Estados para gestión
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [nota, setNota] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/pedido/get/${id}`);
        const data = await res.json();
        if (data.ok) {
          setPedido(data.pedido);
          setNuevoEstado(data.pedido.estado);
          if (data.pedido.fechaEntrega) {
            setFechaEntrega(data.pedido.fechaEntrega.split("T")[0]);
          }
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

  const handleActualizarEstado = async () => {
    try {
      const res = await fetch(`${API_URL}/pedido/${pedido._id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevoEstado,
          nota,
          fechaEntrega: fechaEntrega || null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg("✅ Estado actualizado correctamente");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setMsg("❌ " + (data.msg || "Error al actualizar"));
      }
    } catch (e) {
      console.error(e);
      setMsg("Error de conexión con el servidor");
    }
  };

  if (cargando) return <div className="p-10">Cargando pedido...</div>;
  if (!pedido) return <div className="p-10">Pedido no encontrado</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Detalle Pedido #{pedido._id.slice(-6)}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Info general */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p><b>Cliente:</b> {pedido.usuario?.nombre || pedido.userId}</p>
              <p><b>Fecha:</b> {new Date(pedido.createdAt).toLocaleString()}</p>
              <p>
                <b>Estado actual:</b>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    pedido.estado === "pendiente_pago"
                      ? "bg-red-100 text-red-700"
                      : pedido.estado === "pagado_total"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {pedido.estado}
                </span>
              </p>
            </div>
            <div>
              <p><b>Total:</b> ${pedido.costos?.total.toFixed(2)}</p>
              <p><b>Pagado:</b> ${pedido.montoPagado.toFixed(2)}</p>
              <p><b>Pendiente:</b> ${pedido.saldoPendiente.toFixed(2)}</p>
              {pedido.fechaEntrega && (
                <p><b>Fecha de entrega:</b> {new Date(pedido.fechaEntrega).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Dirección de envío */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Dirección de Envío</h2>
            {typeof pedido.direccionEnvio === "string" ? (
              <p className="mt-2 italic">{pedido.direccionEnvio}</p>
            ) : (
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {JSON.stringify(pedido.direccionEnvio, null, 2)}
              </pre>
            )}
          </div>

          {/* Items */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Items</h2>
            <ul className="divide-y">
              {pedido.items.map((it, idx) => (
                <li key={idx} className="py-2 flex justify-between items-center">
                  <span>
                    {it.nombre} ({it.talla} - {it.color?.color}) × {it.cantidad}
                  </span>
                  <b>${(it.precioUnitario * it.cantidad).toFixed(2)}</b>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagos */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Pagos</h2>
            <ul className="list-disc ml-6 text-sm">
              {pedido.referenciasPago?.map((p, i) => (
                <li key={i}>
                  ${p.monto} - Ref: {p.referencia}{" "}
                  ({new Date(p.fecha).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Historial</h2>
            <ul className="relative border-l border-gray-300 ml-4 pl-4">
              {pedido.timeline?.map((t, i) => (
                <li key={i} className="mb-4">
                  <div className="absolute -left-2.5 w-4 h-4 bg-blue-600 rounded-full border border-white"></div>
                  <p className="text-sm text-gray-600">
                    {new Date(t.ts).toLocaleString()}
                  </p>
                  <p className="font-medium">{t.estado}</p>
                  <p className="text-xs italic text-gray-500">{t.evento}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Gestión de estado */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Gestión de Estado</h2>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-4"
            >
              <option value="pendiente_pago">Pago Pendiente</option>
              <option value="pagado_total">Pago Completado</option>
              <option value="en_produccion">En Producción</option>
              <option value="listo">Listo</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            {nuevoEstado === "pagado_total" && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Fecha de entrega</label>
                <input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            )}

            <textarea
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Nota administrativa (opcional)"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />

            <button
              onClick={handleActualizarEstado}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
            {msg && <p className="mt-3 font-semibold text-blue-800">{msg}</p>}
          </div>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}
