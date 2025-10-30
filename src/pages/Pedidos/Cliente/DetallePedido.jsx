// src/pages/Pedidos/Cliente/DetallePedido.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";

// Utilidad: formateo seguro de fechas
const formatDateSafe = (dateString, pattern = "PPpp") => {
  try {
    if (!dateString) return "Fecha no disponible";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "Fecha inválida" : format(d, pattern, { locale: es });
  } catch {
    return "Error en fecha";
  }
};

// Utilidad: formateo de moneda
const money = new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" });

const StatusBadge = ({ status }) => {
  const map = {
    pago_pendiente: { label: "Pago Pendiente", cls: "bg-red-100 text-red-800" },
    pago_parcial: { label: "Pago Parcial", cls: "bg-orange-100 text-orange-800" },
    pago_completo: { label: "Pago Completo", cls: "bg-green-100 text-green-800" },
    en_produccion: { label: "En Producción", cls: "bg-indigo-100 text-indigo-800" },
    en_revision: { label: "En Revisión", cls: "bg-yellow-100 text-yellow-800" },
    listo: { label: "Listo para Envío", cls: "bg-purple-100 text-purple-800" },
    enviado: { label: "En Camino", cls: "bg-cyan-100 text-cyan-800" },
    retiro: { label: "Listo para Retiro", cls: "bg-blue-100 text-blue-800" },
    entregado: { label: "Entregado", cls: "bg-green-100 text-green-800" },
    cancelado: { label: "Cancelado", cls: "bg-red-100 text-red-800" }
  };
  const meta = map[status] || { label: status, cls: "bg-gray-100 text-gray-800" };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${meta.cls}`}>{meta.label}</span>;
};

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const TimelineItem = ({ evento, estado, nota, date, isLast }) => {
  const isValidDate = date && !isNaN(new Date(date).getTime());
  
  // Mapeo de eventos a íconos y colores
  const eventoConfig = {
    pedido_creado: { icon: "📦", color: "bg-blue-500", label: "Pedido Creado" },
    pago_registrado: { icon: "💰", color: "bg-yellow-500", label: "Pago Registrado" },
    pago_aprobado: { icon: "✅", color: "bg-green-500", label: "Pago Aprobado" },
    pago_rechazado: { icon: "❌", color: "bg-red-500", label: "Pago Rechazado" },
    cambio_estado_pedido: { icon: "🔄", color: "bg-purple-500", label: "Cambio de Estado" },
    en_revision: { icon: "🔍", color: "bg-yellow-500", label: "En Revisión" },
    en_produccion: { icon: "⚙️", color: "bg-indigo-500", label: "En Producción" },
    listo: { icon: "✨", color: "bg-purple-500", label: "Listo" },
    enviado: { icon: "🚚", color: "bg-cyan-500", label: "Enviado" },
    retiro: { icon: "🏪", color: "bg-blue-500", label: "Listo para Retiro" },
    entregado: { icon: "🎉", color: "bg-green-600", label: "Entregado" },
    cancelado: { icon: "🚫", color: "bg-red-600", label: "Cancelado" }
  };

  const config = eventoConfig[evento] || eventoConfig[estado] || { 
    icon: "📌", 
    color: "bg-gray-500", 
    label: evento || estado 
  };

  return (
    <div className="relative pb-6">
      {!isLast && <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200" />}
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white text-sm`}>
          {config.icon}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-900">{config.label}</span>
            <span className="text-xs text-gray-500">
              {isValidDate ? formatDateSafe(date, "PPp") : "Fecha no disponible"}
            </span>
          </div>
          {nota && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">{nota}</p>
            </div>
          )}
          {estado && evento === "cambio_estado_pedido" && (
            <div className="mt-1">
              <StatusBadge status={estado} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    const cargar = async () => {
      try {
        setCargando(true);
        setError("");
        const res = await fetch(`${API_URL}/pedido/get/${id}`, { signal: ac.signal });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Error HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!data.ok) throw new Error(data.msg || "No se pudo cargar el pedido");
        setPedido(data.pedido);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error al cargar el pedido");
      } finally {
        setCargando(false);
      }
    };

    cargar();
    return () => ac.abort();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tu pedido...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No se pudo cargar el pedido</h2>
            <p className="text-gray-600 mb-6">{error || "Intenta nuevamente en unos minutos."}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalProductos = pedido.items.reduce((sum, it) => sum + it.precioUnitario * it.cantidad, 0);
  const envio = pedido.costos?.envio || 0;
  const impuestos = pedido.costos?.impuestos || 0;
  const total = pedido.costos?.total || totalProductos + envio + impuestos;

  // ✅ Verificar si hay pagos pendientes para mostrar "En Revisión"
  const haypagoPendiente = pedido.pagos?.some(p => p.estado === 'pendiente');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a mis pedidos
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              Pedido #{pedido._id.slice(-6).toUpperCase()}
            </h1>
            <div className="flex items-center mt-2 flex-wrap gap-2">
              <StatusBadge status={pedido.estado} />
              {haypagoPendiente && pedido.estado === 'en_revision' && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🔍 Revisando pagos
                </span>
              )}
              <span className="text-sm text-gray-500">Creado el {formatDateSafe(pedido.createdAt, "PPp")}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{money.format(total)}</div>
            <div className="text-sm text-gray-500">Total del pedido</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Resumen">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estado del Pedido</p>
                  <div className="mt-1"><StatusBadge status={pedido.estado} /></div>
                </div>
                {pedido.infoPago?.estado_pago && (
                  <div>
                    <p className="text-sm text-gray-500">Estado de Pago</p>
                    <div className="mt-1"><StatusBadge status={pedido.infoPago.estado_pago} /></div>
                  </div>
                )}
                {pedido.fechaEntrega && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha de entrega estimada</p>
                    <p className="font-medium">{formatDateSafe(pedido.fechaEntrega, "PPP")}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {(() => {
                        const fin = new Date(pedido.fechaEntrega);
                        const diff = fin - new Date();
                        if (diff > 0) {
                          const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
                          return dias > 0 ? `Faltan ${dias} día${dias > 1 ? 's' : ''} y ${horas} hora${horas > 1 ? 's' : ''}` : `Faltan ${horas} hora${horas > 1 ? 's' : ''}`;
                        }
                        return "Fecha de entrega alcanzada";
                      })()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Método de pago</p>
                  <p className="font-medium capitalize">{pedido.metodoPago || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de pago</p>
                  <p className="font-medium capitalize">
                    {pedido.tipoPago === "completo" ? "Pago Completo" : "Anticipo (50%)"}
                  </p>
                </div>
                {pedido.tipoEntrega && (
                  <div>
                    <p className="text-sm text-gray-500">Tipo de entrega</p>
                    <p className="font-medium capitalize">
                      {pedido.tipoEntrega === "domicilio" ? "📦 Envío a domicilio" : "🏪 Retiro en tienda"}
                    </p>
                  </div>
                )}
              </div>
            </InfoCard>

            <InfoCard title="Dirección de envío">
              {typeof pedido.direccionEnvio === "string" ? (
                <p className="text-gray-600">{pedido.direccionEnvio}</p>
              ) : pedido.direccionEnvio.tipoEnvio === "retiro" ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2">🏪 Retiro en Tienda</p>
                  <p className="text-sm text-blue-700">
                    El pedido será recogido en nuestras instalaciones. Te notificaremos cuando esté listo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Destinatario</p>
                    <p className="font-medium">{pedido.direccionEnvio.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Dirección</p>
                    <p>{pedido.direccionEnvio.direccion_principal}</p>
                    {pedido.direccionEnvio.referencia && (
                      <p className="text-sm text-gray-600">Referencia: {pedido.direccionEnvio.referencia}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Ciudad</p>
                      <p>{pedido.direccionEnvio.ciudad}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Provincia</p>
                      <p>{pedido.direccionEnvio.provincia}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">País</p>
                    <p>{pedido.direccionEnvio.pais}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Teléfono</p>
                    <p className="text-blue-600 font-medium">{pedido.direccionEnvio.telefono}</p>
                  </div>
                  {pedido.direccionEnvio.codigo_postal && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Código Postal</p>
                      <p>{pedido.direccionEnvio.codigo_postal}</p>
                    </div>
                  )}
                  {pedido.direccionEnvio.detalle && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Instrucciones</p>
                      <p className="text-sm text-gray-700">{pedido.direccionEnvio.detalle}</p>
                    </div>
                  )}
                </div>
              )}
            </InfoCard>

            <InfoCard title="Productos">
              <div className="space-y-4">
                {pedido.items.map((item, idx) => (
                  <div key={item._id || idx}
                       className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.imagen || item.imagen_url ? (
                        <img
                          src={item.imagen || item.imagen_url}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-3">
                        <span>Cantidad: {item.cantidad}</span>
                        {item.talla && <span>Talla: {item.talla}</span>}
                        {item.color && (
                          <div className="flex items-center gap-1">
                            <span>Color:</span>
                            {typeof item.color === 'object' && item.color.codigo ? (
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color.codigo }}
                                title={item.color.color}
                              />
                            ) : (
                              <span>{typeof item.color === 'string' ? item.color : item.color?.color || 'N/A'}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium">
                        {money.format(item.precioUnitario * item.cantidad)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {money.format(item.precioUnitario)} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{money.format(totalProductos)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">{money.format(envio)}</span>
                </div>
                {impuestos > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">IVA (15%):</span>
                    <span className="font-medium">{money.format(impuestos)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-lg font-bold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{money.format(total)}</span>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Historial del pedido">
              {pedido.timeline?.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {pedido.timeline.map((ev, idx) => (
                      <TimelineItem
                        key={ev.ts || idx}
                        evento={ev.evento}
                        estado={ev.estado}
                        nota={ev.nota}
                        date={ev.ts}
                        isLast={idx === pedido.timeline.length - 1}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay historial disponible</p>
              )}
            </InfoCard>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {pedido.infoPago && (
              <InfoCard title="Estado de Pago">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total del pedido:</span>
                    <span className="font-bold text-lg">{money.format(pedido.infoPago.total_pedido)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total pagado:</span>
                    <span className="font-bold text-lg text-green-600">{money.format(pedido.infoPago.total_pagado)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saldo pendiente:</span>
                    <span className="font-bold text-lg text-red-600">{money.format(pedido.infoPago.saldo_pendiente)}</span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Progreso de pago</span>
                      <span className="text-xs font-semibold text-gray-900">{pedido.infoPago.porcentaje_pagado}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${
                          pedido.infoPago.estado_pago === 'pago_completo' ? 'bg-green-600' : 
                          pedido.infoPago.estado_pago === 'pago_parcial' ? 'bg-blue-600' : 
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(pedido.infoPago.porcentaje_pagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Botón para realizar pago adicional */}
                  {pedido.infoPago.saldo_pendiente > 0 && pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                    <button
                      onClick={() => navigate(`/agregar-pago/${pedido._id}`)}
                      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💳</span>
                      <span>Realizar Pago Adicional</span>
                    </button>
                  )}
                </div>
              </InfoCard>
            )}
                        {pedido.facturaUrl && ['listo', 'enviado', 'retiro', 'entregado'].includes(pedido.estado) && (
              <InfoCard title="📄 Factura" className="border-2 border-green-200">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">Factura Disponible</p>
                        <p className="text-sm text-green-700 mt-1">
                          Tu factura está lista para descargar
                        </p>
                        {pedido.facturaGenerada && (
                          <p className="text-xs text-green-600 mt-1">
                            Generada el {formatDateSafe(pedido.facturaGenerada, "PPp")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Forzar descarga del PDF
                      const downloadUrl = pedido.facturaUrl.replace('/upload/', '/upload/fl_attachment/');
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `Factura_${pedido._id}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Factura
                  </button>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Tip:</strong> Guarda tu factura para futuras referencias. Este documento es válido para reclamos y garantías.
                    </p>
                  </div>
                </div>
              </InfoCard>
            )}

            <InfoCard title="Pagos">
              <div className="space-y-4">
                {/* Pagos aprobados */}
                {pedido.pagos?.filter(p => p.estado === 'aprobado').length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <span>✓</span>
                      <span>Pagos Aprobados</span>
                    </h4>
                    {pedido.pagos.filter(p => p.estado === 'aprobado').map((pago, idx) => (
                      <div key={pago._id || `${pago.fecha}-${pago.monto}-${idx}`} className="border border-green-200 rounded-lg p-4 mb-3 bg-green-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-lg">
                              {money.format(Number(pago.monto) || 0)}
                              <span className="ml-2 text-sm font-normal text-gray-600">
                                ({pago.tipo === "anticipo" ? "Anticipo" : pago.tipo === "completo" ? "Pago Completo" : "Pago Parcial"})
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{formatDateSafe(pago.fecha, "PPp")}</p>
                            {pago.referencia && (
                              <p className="text-sm text-gray-600">Ref: {pago.referencia}</p>
                            )}
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Aprobado
                            </span>
                          </div>
                          {pago.comprobante && (
                            <div className="flex flex-col items-end">
                              <div className="w-20 h-20 border rounded-md overflow-hidden">
                                <img
                                  src={pago.comprobante}
                                  alt="Comprobante"
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(pago.comprobante, "_blank")}
                                />
                              </div>
                              <button
                                onClick={() => window.open(pago.comprobante, "_blank")}
                                className="mt-1 text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Ver
                              </button>
                            </div>
                          )}
                        </div>
                        {pago.nota && (
                          <div className="mt-2 p-2 bg-white rounded text-sm text-gray-600">
                            <p className="font-medium text-xs text-gray-500">Nota:</p>
                            <p>{pago.nota}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagos pendientes */}
                {pedido.pagos?.filter(p => p.estado === 'pendiente').length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                      <span>⏳</span>
                      <span>Pagos en Revisión</span>
                    </h4>
                    {pedido.pagos.filter(p => p.estado === 'pendiente').map((pago, idx) => (
                      <div key={pago._id || `${pago.fecha}-${pago.monto}-${idx}`} className="border border-yellow-300 rounded-lg p-4 mb-3 bg-yellow-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-lg">
                              {money.format(Number(pago.monto) || 0)}
                              <span className="ml-2 text-sm font-normal text-gray-600">
                                ({pago.tipo === "anticipo" ? "Anticipo" : pago.tipo === "completo" ? "Pago Completo" : "Pago Parcial"})
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{formatDateSafe(pago.fecha, "PPp")}</p>
                            {pago.referencia && (
                              <p className="text-sm text-gray-600">Ref: {pago.referencia}</p>
                            )}
                            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              En revisión
                            </span>
                          </div>
                          {pago.comprobante && (
                            <div className="flex flex-col items-end">
                              <div className="w-20 h-20 border rounded-md overflow-hidden">
                                <img
                                  src={pago.comprobante}
                                  alt="Comprobante"
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(pago.comprobante, "_blank")}
                                />
                              </div>
                              <button
                                onClick={() => window.open(pago.comprobante, "_blank")}
                                className="mt-1 text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Ver
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 p-2 bg-white rounded text-sm text-gray-700">
                          <p className="font-medium text-xs text-gray-500">Estado:</p>
                          <p>Tu comprobante está siendo revisado. Te notificaremos cuando sea aprobado.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagos rechazados */}
                {pedido.pagos?.filter(p => p.estado === 'rechazado').length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <span>❌</span>
                      <span>Pagos Rechazados</span>
                    </h4>
                    {pedido.pagos.filter(p => p.estado === 'rechazado').map((pago, idx) => (
                      <div key={pago._id || `${pago.fecha}-${pago.monto}-${idx}`} className="border border-red-300 rounded-lg p-4 mb-3 bg-red-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-lg">
                              {money.format(Number(pago.monto) || 0)}
                              <span className="ml-2 text-sm font-normal text-gray-600">
                                ({pago.tipo === "anticipo" ? "Anticipo" : pago.tipo === "completo" ? "Pago Completo" : "Pago Parcial"})
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{formatDateSafe(pago.fecha, "PPp")}</p>
                            {pago.referencia && (
                              <p className="text-sm text-gray-600">Ref: {pago.referencia}</p>
                            )}
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Rechazado
                            </span>

                            {pago.motivoRechazo && (
                              <div className="mt-2 p-2 bg-white rounded text-sm text-red-700 border border-red-200">
                                <p className="font-medium text-xs text-red-600">Motivo del rechazo:</p>
                                <p className="mt-1">{pago.motivoRechazo}</p>
                              </div>
                            )}
                          </div>
                          
                          {pago.comprobante && (
                            <div className="flex flex-col items-end ml-3">
                              <div className="w-20 h-20 border rounded-md overflow-hidden opacity-50">
                                <img
                                  src={pago.comprobante}
                                  alt="Comprobante rechazado"
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(pago.comprobante, "_blank")}
                                />
                              </div>
                              <button
                                onClick={() => window.open(pago.comprobante, "_blank")}
                                className="mt-1 text-gray-600 hover:text-gray-800 text-xs"
                              >
                                Ver
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Nota:</strong> Los pagos rechazados no se toman en cuenta. 
                        Puedes enviar un nuevo comprobante usando el botón "Realizar Pago Adicional".
                      </p>
                    </div>
                  </div>
                )}

                {(!pedido.pagos || pedido.pagos.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No hay pagos registrados</p>
                )}
              </div>
            </InfoCard>

            {/* ✅ NUEVO BLOQUE: Notas del Administrador */}
            {pedido.timeline?.some(ev => ev.nota && ev.nota.trim() !== '') && (
              <InfoCard title="📝 Notas del Administrador" className="border-2 border-blue-200">
                <div className="space-y-3">
                  {pedido.timeline
                    .filter(ev => ev.nota && ev.nota.trim() !== '')
                    .reverse() // Mostrar las más recientes primero
                    .map((ev, idx) => (
                      <div key={ev.ts || idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            📌
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              {formatDateSafe(ev.ts, "PPp")}
                              {ev.estado && <span className="ml-2 font-medium">• Estado: {ev.estado}</span>}
                            </p>
                            <p className="text-sm text-gray-800">{ev.nota}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </InfoCard>
            )}


            <InfoCard title="❓ Ayuda">
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Si tienes dudas sobre tu pedido o necesitas realizar algún cambio, contáctanos indicando tu número de pedido.
                </p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">Número de Pedido:</p>
                  <p className="font-mono font-bold text-gray-900 select-all">
                    #{pedido._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <a 
                  href="mailto:soporte@tuempresa.com" 
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>📧</span>
                  <span>Contactar Soporte</span>
                </a>
              </div>
            </InfoCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
