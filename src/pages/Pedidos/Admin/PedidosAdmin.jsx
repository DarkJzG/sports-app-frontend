// src/pages/Pedidos/Admin/PedidosAdmin.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import PedidoCardAdmin from "../../../components/PedidoCardAdmin";
import { Grid2x2, Rows2, Search, Settings, Spool, Truck, ClipboardCheck, UserCheck, PackageCheck, Ban, BanknoteX, CircleDollarSign, BanknoteArrowUp } from "lucide-react";


// ✅ Estados actualizados según nueva estructura
const ESTADOS_PEDIDO = [
  { key: "en_revision", label: "En Revisión", color: "bg-yellow-600", icon: <Search size={20} /> },
  { key: "en_produccion", label: "En Producción", color: "bg-indigo-600", icon: <Spool size={20} /> },
  { key: "listo", label: "Listo", color: "bg-purple-600", icon: <ClipboardCheck size={20} /> },
  { key: "enviado", label: "Enviado", color: "bg-cyan-600", icon: <Truck size={20} /> },
  { key: "retiro", label: "Para Retiro", color: "bg-blue-600", icon: <PackageCheck size={20} /> },
  { key: "entregado", label: "Entregado", color: "bg-green-600", icon: <UserCheck size={20} /> },
  { key: "cancelado", label: "Cancelado", color: "bg-red-600", icon: <Ban size={20} /> },
];

// ✅ Estados de pago para filtros adicionales
const ESTADOS_PAGO = [
  { key: "pago_pendiente", label: "Sin Pago", color: "bg-red-500", icon: <BanknoteX size={20} /> },
  { key: "pago_parcial", label: "Pago Parcial", color: "bg-orange-500", icon: <BanknoteArrowUp size={20} /> },
  { key: "pago_completo", label: "Pago Completo", color: "bg-green-500", icon: <CircleDollarSign size={20} /> },
];

export default function PedidosAdmin() {
  const [todosLosPedidos, setTodosLosPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(""); // Filtro de estado de pedido
  const [pagoFiltro, setPagoFiltro] = useState(""); // Filtro de estado de pago
  const [busqueda, setBusqueda] = useState(""); // Búsqueda por ID o cliente
  const [vistaActiva, setVistaActiva] = useState("lista"); // "kanban" o "lista"
  const navigate = useNavigate();

  // Cargar todos los pedidos
  const cargarTodosLosPedidos = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `${API_URL}/pedido/all`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok) {
        setTodosLosPedidos(data.pedidos || []);
      } else {
        setError(data.msg || "Error cargando pedidos");
        setTodosLosPedidos([]);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      setTodosLosPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodosLosPedidos();
  }, []);

  // ✅ Filtrado mejorado
  const pedidosFiltrados = useMemo(() => {
    let resultado = todosLosPedidos;

    // Filtro por estado de pedido
    if (estadoFiltro) {
      resultado = resultado.filter(p => p.estado === estadoFiltro);
    }

    // Filtro por estado de pago
    if (pagoFiltro) {
      resultado = resultado.filter(p => p.estadoPago === pagoFiltro || p.infoPago?.estado_pago === pagoFiltro);
    }

    // Búsqueda por texto
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(p => 
        p._id.toLowerCase().includes(termino) ||
        p.clienteNombre?.toLowerCase().includes(termino) ||
        p.clienteCorreo?.toLowerCase().includes(termino)
      );
    }

    return resultado;
  }, [todosLosPedidos, estadoFiltro, pagoFiltro, busqueda]);

  // Agrupar pedidos por estado
  const pedidosAgrupados = useMemo(() => {
    const grupos = {};
    ESTADOS_PEDIDO.forEach(estado => grupos[estado.key] = []);

    pedidosFiltrados.forEach(pedido => {
      if (grupos[pedido.estado]) {
        grupos[pedido.estado].push(pedido);
      } else {
        if (!grupos['otros']) grupos['otros'] = [];
        grupos['otros'].push(pedido);
      }
    });
    return grupos;
  }, [pedidosFiltrados]);

  // ✅ Estadísticas
  const estadisticas = useMemo(() => {
    const stats = {
      total: todosLosPedidos.length,
      enRevision: 0,
      pagosPendientes: 0,
      enProduccion: 0,
      listos: 0,
      porEntregar: 0,
      entregados: 0,
      cancelados: 0,
    };

    todosLosPedidos.forEach(p => {
      if (p.estado === 'en_revision') stats.enRevision++;
      if (p.estado === 'en_produccion') stats.enProduccion++;
      if (p.estado === 'listo') stats.listos++;
      if (p.estado === 'enviado' || p.estado === 'retiro') stats.porEntregar++;
      if (p.estado === 'entregado') stats.entregados++;
      if (p.estado === 'cancelado') stats.cancelados++;
      
      // Contar pagos pendientes de aprobación
      const tienePagosPendientes = p.pagos?.some(pago => pago.estado === 'pendiente');
      if (tienePagosPendientes) stats.pagosPendientes++;
    });

    return stats;
  }, [todosLosPedidos]);

  const handleCambiarEstado = (pedido) => {
    navigate(`/admin/pedidos/${pedido._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header con estadísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-blue-900">
              Tablero de Pedidos
            </h1>
            <button
              onClick={cargarTodosLosPedidos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          {/* ✅ Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 shadow border-l-4 border-yellow-500">
              <p className="text-xs text-yellow-700">En Revisión</p>
              <p className="text-2xl font-bold text-yellow-900">{estadisticas.enRevision}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 shadow border-l-4 border-red-500">
              <p className="text-xs text-red-700">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-red-900">{estadisticas.pagosPendientes}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 shadow border-l-4 border-indigo-500">
              <p className="text-xs text-indigo-700">Producción</p>
              <p className="text-2xl font-bold text-indigo-900">{estadisticas.enProduccion}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 shadow border-l-4 border-purple-500">
              <p className="text-xs text-purple-700">Listos</p>
              <p className="text-2xl font-bold text-purple-900">{estadisticas.listos}</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 shadow border-l-4 border-cyan-500">
              <p className="text-xs text-cyan-700">Por Entregar</p>
              <p className="text-2xl font-bold text-cyan-900">{estadisticas.porEntregar}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 shadow border-l-4 border-green-500">
              <p className="text-xs text-green-700">Entregados</p>
              <p className="text-2xl font-bold text-green-900">{estadisticas.entregados}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 shadow border-l-4 border-gray-500">
              <p className="text-xs text-gray-700">Cancelados</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.cancelados}</p>
            </div>
          </div>

          {/* ✅ Búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por ID de pedido, nombre o correo del cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* ✅ Filtros de Estado de Pedido */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Estado del Pedido:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEstadoFiltro("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex justify-center ${
                  estadoFiltro === ""
                    ? "bg-blue-800 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Todos
              </button>
              {ESTADOS_PEDIDO.map(estado => (
                <button
                  key={estado.key}
                  onClick={() => setEstadoFiltro(estado.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex justify-center ${
                    estadoFiltro === estado.key
                      ? `${estado.color} text-white shadow`
                      : "bg-white text-gray-700 hover:bg-gray-100 border"
                  }`}
                >
                  {estado.icon} {estado.label}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Filtros de Estado de Pago */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Estado de Pago:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPagoFiltro("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  pagoFiltro === ""
                    ? "bg-blue-800 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                Todos los Pagos
              </button>
              {ESTADOS_PAGO.map(pago => (
                <button
                  key={pago.key}
                  onClick={() => setPagoFiltro(pago.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pagoFiltro === pago.key
                      ? `${pago.color} text-white shadow`
                      : "bg-white text-gray-700 hover:bg-gray-100 border"
                  }`}
                >
                  {pago.icon} {pago.label}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Toggle Vista */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-gray-600">
              Mostrando {pedidosFiltrados.length} de {todosLosPedidos.length} pedidos
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setVistaActiva("kanban")}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  vistaActiva === "kanban"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
               <Grid2x2 size={18} />
                <span className="hidden md:inline">Tarjetas</span>
              </button>
              <button
                onClick={() => setVistaActiva("lista")}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  vistaActiva === "lista"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                <Rows2 size={18} />
                <span className="hidden md:inline">Lista</span>
              </button>
            </div>
        </div>
      </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center py-10">{error}</p>
        ) : vistaActiva === "kanban" ? (
          /* ✅ Vista Kanban */
          <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {ESTADOS_PEDIDO.map((estadoInfo) => {
              if (!estadoFiltro || estadoFiltro === estadoInfo.key) {
                const pedidosEnColumna = pedidosAgrupados[estadoInfo.key] || [];
                return (
                  <div key={estadoInfo.key} className="bg-gray-200 rounded-lg p-3 w-72 md:w-80 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-gray-200 py-2 z-10">
                      <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <span>{estadoInfo.icon}</span>
                        <span>{estadoInfo.label}</span>
                      </h2>
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                        {pedidosEnColumna.length}
                      </span>
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-400px)]">
                      {pedidosEnColumna.length === 0 ? (
                        <p className="text-sm text-gray-500 px-1 pt-2 text-center">
                          No hay pedidos aquí.
                        </p>
                      ) : (
                        pedidosEnColumna.map((p) => (
                          <PedidoCardAdmin
                            key={p._id}
                            pedido={p}
                            onCambiarEstado={handleCambiarEstado}
                            showActions={true}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          /* ✅ Vista Lista */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{pedido._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pedido.clienteNombre || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pedido.clienteCorreo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ESTADOS_PEDIDO.find(e => e.key === pedido.estado)?.color || 'bg-gray-600'
                      } text-white`}>
                        {ESTADOS_PEDIDO.find(e => e.key === pedido.estado)?.label || pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pedido.estadoPago === 'pago_completo' || pedido.infoPago?.estado_pago === 'pago_completo' ? 'bg-green-100 text-green-800' :
                        pedido.estadoPago === 'pago_parcial' || pedido.infoPago?.estado_pago === 'pago_parcial' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pedido.infoPago?.porcentaje_pagado || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pedido.costos?.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pedido.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCambiarEstado(pedido)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <FooterAdmin />
    </div>
    
  );
}
