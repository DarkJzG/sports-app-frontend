// src/pages/Pedidos/Cliente/MisPedidos.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-EC', options);
};

// Componente para badge de estado
const EstadoBadge = ({ estado }) => {
  const estadosMap = {
    en_revision: { label: "En Revisión", color: "bg-yellow-100 text-yellow-800" },
    pendiente_pago: { label: "Pendiente de Pago", color: "bg-red-100 text-red-800" },
    pagado_parcial: { label: "Pago Parcial", color: "bg-orange-100 text-orange-800" },
    pagado_total: { label: "Pagado", color: "bg-green-100 text-green-800" },
    en_produccion: { label: "En Producción", color: "bg-indigo-100 text-indigo-800" },
    listo: { label: "Listo para Envío", color: "bg-purple-100 text-purple-800" },
    enviado: { label: "En Camino", color: "bg-cyan-100 text-cyan-800" },
    retiro: { label: "Listo para Retiro", color: "bg-blue-100 text-blue-800" },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-800" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" }
  };

  const config = estadosMap[estado] || { label: estado, color: "bg-gray-100 text-gray-800" };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

// Componente para badge de estado de pago
const EstadoPagoBadge = ({ estadoPago, porcentaje }) => {
  const estadosMap = {
    pago_pendiente: { label: "Sin Pago", color: "bg-red-100 text-red-800" },
    pago_parcial: { label: `Pago Parcial (${porcentaje}%)`, color: "bg-orange-100 text-orange-800" },
    pago_completo: { label: "Pagado", color: "bg-green-100 text-green-800" }
  };

  const config = estadosMap[estadoPago] || { label: "Sin pago", color: "bg-gray-100 text-gray-800" };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function MisPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    cargarPedidos();
  }, [user, navigate]);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (data.ok) {
        // Ordenar por fecha más reciente
        const pedidosOrdenados = data.pedidos.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPedidos(pedidosOrdenados);
      } else {
        toast.error(data.msg || 'Error al cargar pedidos');
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setCargando(false);
    }
  };

  // Filtrar pedidos según el filtro seleccionado
  const pedidosFiltrados = filtroEstado === "todos" 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  // Estadísticas
  const estadisticas = {
    total: pedidos.length,
    activos: pedidos.filter(p => !['entregado', 'cancelado'].includes(p.estado)).length,
    enProduccion: pedidos.filter(p => p.estado === 'en_produccion').length,
    entregados: pedidos.filter(p => p.estado === 'entregado').length,
    conSaldoPendiente: pedidos.filter(p => p.infoPago?.saldo_pendiente > 0).length
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Mis Pedidos</h1>
        </div>

      

        {pedidos.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por estado:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroEstado("todos")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "todos"
                    ? "bg-blue-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Todos ({pedidos.length})
              </button>
              <button
                onClick={() => setFiltroEstado("en_revision")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "en_revision"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                En Revisión ({pedidos.filter(p => p.estado === 'en_revision').length})
              </button>
              <button
                onClick={() => setFiltroEstado("en_produccion")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "en_produccion"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                En Producción ({pedidos.filter(p => p.estado === 'en_produccion').length})
              </button>
              <button
                onClick={() => setFiltroEstado("listo")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "listo"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Listos ({pedidos.filter(p => p.estado === 'listo').length})
              </button>
              <button
                onClick={() => setFiltroEstado("enviado")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "enviado"
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                En Camino ({pedidos.filter(p => p.estado === 'enviado').length})
              </button>
              <button
                onClick={() => setFiltroEstado("retiro")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "retiro"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Para Retiro ({pedidos.filter(p => p.estado === 'retiro').length})
              </button>
              <button
                onClick={() => setFiltroEstado("entregado")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === "entregado"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Entregados ({pedidos.filter(p => p.estado === 'entregado').length})
              </button>
            </div>
          </div>
        )}

        {/* Lista de pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filtroEstado === "todos" ? "No tienes pedidos aún" : "No hay pedidos con este estado"}
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroEstado === "todos" 
                ? "Comienza a explorar nuestros productos y realiza tu primer pedido"
                : "Prueba con otro filtro o revisa todos tus pedidos"}
            </p>
            {filtroEstado === "todos" ? (
              <Link
                to="/productos"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver Productos
              </Link>
            ) : (
              <button
                onClick={() => setFiltroEstado("todos")}
                className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Ver Todos
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {pedidosFiltrados.map((pedido) => {
              const infoPago = pedido.infoPago || {};
              const saldoPendiente = infoPago.saldo_pendiente || 0;
              const hayPagosPendientes = pedido.pagos?.some(p => p.estado === 'pendiente') || false;

              return (
                <div key={pedido._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  {/* Header del pedido */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Pedido #{pedido._id.slice(-6).toUpperCase()}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Realizado el {formatDate(pedido.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <EstadoBadge estado={pedido.estado} />
                      <EstadoPagoBadge 
                        estadoPago={infoPago.estado_pago || 'pago_pendiente'} 
                        porcentaje={Math.round(infoPago.porcentaje_pagado || 0)}
                      />
                      <Link 
                        to={`/mis-pedidos/${pedido._id}`}
                        className="px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>

                  {/* Información financiera */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total del Pedido</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(infoPago.total_pedido || pedido.costos?.total || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Pagado</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(infoPago.total_pagado || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Saldo Pendiente</p>
                      <p className={`text-lg font-bold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(saldoPendiente)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de progreso de pago */}
                  {infoPago.porcentaje_pagado !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso de Pago</span>
                        <span>{Math.round(infoPago.porcentaje_pagado)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            infoPago.porcentaje_pagado >= 100 ? 'bg-green-600' :
                            infoPago.porcentaje_pagado >= 50 ? 'bg-blue-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(infoPago.porcentaje_pagado, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Alerta de pagos pendientes de aprobación */}
                  {hayPagosPendientes && (
                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-yellow-800 font-medium">
                          Tienes pagos pendientes de aprobación. No podrás enviar nuevos hasta que sean revisados.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botón para agregar pago */}
                  {saldoPendiente > 0 && !hayPagosPendientes && pedido.estado !== 'cancelado' && (
                    <div className="mb-4">
                      <Link
                        to={`/agregar-pago/${pedido._id}`}
                        className="inline-block w-full md:w-auto px-6 py-3 bg-green-700 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-center"
                      >
                        Realizar Pago de ${formatCurrency(saldoPendiente).replace('$', '')}
                      </Link>
                    </div>
                  )}

                  {/* Productos del pedido (preview) */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3 text-gray-800">
                      Productos ({pedido.items?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {pedido.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center flex-1">
                            {item.imagen && (
                              <img
                                src={item.imagen}
                                alt={item.nombre}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.nombre}</p>
                              <p className="text-xs text-gray-600">
                                Cant: {item.cantidad} • {formatCurrency(item.precioUnitario)} c/u
                                {item.talla && ` • Talla: ${item.talla}`}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-sm">
                            {formatCurrency(item.precioUnitario * item.cantidad)}
                          </p>
                        </div>
                      ))}
                      {pedido.items?.length > 3 && (
                        <p className="text-sm text-gray-600 text-center pt-2">
                          + {pedido.items.length - 3} producto(s) más
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
