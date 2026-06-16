// src/pages/Facturas/FacturasAdmin.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import { FileText, Download, Eye, Search, Calendar, DollarSign, User, Filter, TrendingUp, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

export default function FacturasAdmin() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("reciente");
  const navigate = useNavigate();

  const parseFechaMongoDB = (fecha) => {
    if (!fecha) return null;

    try {
      if (typeof fecha === 'string') {
        const parsedDate = new Date(fecha);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
      
      if (typeof fecha === 'object' && fecha.$date) {
        const parsedDate = new Date(fecha.$date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
      
      if (fecha instanceof Date) {
        return isNaN(fecha.getTime()) ? null : fecha;
      }
      
      const parsedDate = new Date(fecha);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    } catch (err) {
      console.error('Error al parsear fecha:', fecha, err);
      return null;
    }
  };

  // Función para formatear fecha de forma segura
  const formatearFecha = (fecha) => {
    const fechaParseada = parseFechaMongoDB(fecha);
    if (!fechaParseada) return 'Fecha no disponible';
    
    return fechaParseada.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear hora de forma segura
  const formatearHora = (fecha) => {
    const fechaParseada = parseFechaMongoDB(fecha);
    if (!fechaParseada) return '';
    
    return fechaParseada.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cargar facturas
  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`${API_URL}/pedido/all`);
      const data = await res.json();

      if (data.ok) {
        const pedidosConFactura = (data.pedidos || []).filter(
          p => p.facturaUrl && p.facturaGenerada
        );
        setFacturas(pedidosConFactura);
      } else {
        setError(data.msg || "Error cargando facturas");
        setFacturas([]);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y búsqueda CON PARSEO SEGURO
  const facturasFiltradas = useMemo(() => {
    let resultado = [...facturas];

    // Búsqueda por texto
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(f => 
        f._id.toLowerCase().includes(termino) ||
        f.clienteNombre?.toLowerCase().includes(termino) ||
        f.clienteCorreo?.toLowerCase().includes(termino)
      );
    }

    // Filtro por fecha CON PARSEO SEGURO
    const ahora = new Date();
    if (filtroFecha === "hoy") {
      resultado = resultado.filter(f => {
        const fechaFactura = parseFechaMongoDB(f.facturaGenerada);
        return fechaFactura ? fechaFactura.toDateString() === ahora.toDateString() : false;
      });
    } else if (filtroFecha === "semana") {
      const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(f => {
        const fechaFactura = parseFechaMongoDB(f.facturaGenerada);
        return fechaFactura ? fechaFactura >= hace7Dias : false;
      });
    } else if (filtroFecha === "mes") {
      const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(f => {
        const fechaFactura = parseFechaMongoDB(f.facturaGenerada);
        return fechaFactura ? fechaFactura >= hace30Dias : false;
      });
    }

    // Ordenamiento CON PARSEO SEGURO
    if (ordenamiento === "reciente") {
      resultado.sort((a, b) => {
        const fechaA = parseFechaMongoDB(a.facturaGenerada);
        const fechaB = parseFechaMongoDB(b.facturaGenerada);
        if (!fechaA || !fechaB) return 0;
        return fechaB.getTime() - fechaA.getTime();
      });
    } else if (ordenamiento === "antiguo") {
      resultado.sort((a, b) => {
        const fechaA = parseFechaMongoDB(a.facturaGenerada);
        const fechaB = parseFechaMongoDB(b.facturaGenerada);
        if (!fechaA || !fechaB) return 0;
        return fechaA.getTime() - fechaB.getTime();
      });
    } else if (ordenamiento === "monto_mayor") {
      resultado.sort((a, b) => (b.costos?.total || 0) - (a.costos?.total || 0));
    } else if (ordenamiento === "monto_menor") {
      resultado.sort((a, b) => (a.costos?.total || 0) - (b.costos?.total || 0));
    }

    return resultado;
  }, [facturas, busqueda, filtroFecha, ordenamiento]);

  // Calcular estadísticas CON PARSEO SEGURO
  const estadisticas = useMemo(() => {
    const total = facturas.length;
    const totalVentas = facturas.reduce((sum, f) => sum + (f.costos?.total || 0), 0);
    
    // Facturas de hoy CON PARSEO SEGURO
    const hoy = new Date().toDateString();
    const facturasHoy = facturas.filter(f => {
      const fecha = parseFechaMongoDB(f.facturaGenerada);
      return fecha ? fecha.toDateString() === hoy : false;
    }).length;
    
    // Facturas del mes actual CON PARSEO SEGURO
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    const facturasMes = facturas.filter(f => {
      const fecha = parseFechaMongoDB(f.facturaGenerada);
      if (!fecha) return false;
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });
    
    const totalMes = facturasMes.reduce((sum, f) => sum + (f.costos?.total || 0), 0);

    return {
      total,
      totalVentas,
      facturasHoy,
      facturasMes: facturasMes.length,
      totalMes
    };
  }, [facturas]);

  // ===== DESCARGA DIRECTA DEL ARCHIVO PDF =====
  const descargarFactura = async (factura) => {
    try {
      if (!factura.facturaUrl) {
        toast.error("Esta factura no tiene URL disponible");
        return;
      }

      toast.info("Iniciando descarga...");

      // Crear un enlace temporal para forzar la descarga
      const link = document.createElement('a');
      link.href = factura.facturaUrl;
      
      // Nombre del archivo
      const numFactura = `FAC-${factura._id.slice(-10).toUpperCase()}`;
      link.download = `${numFactura}.pdf`;
      
      // Agregar atributo para forzar descarga
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Simular clic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Factura descargada exitosamente");
    } catch (err) {
      console.error("Error al descargar:", err);
      toast.error("Error al descargar la factura");
    }
  };

  // Ver detalles del pedido
  const verDetallesPedido = (factura) => {
    navigate(`/admin/pedidos/${factura._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <NavbarAdmin />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header con título */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-800 p-3 rounded-xl">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Gestión de Facturas
                </h1>
                <p className="text-gray-600">Historial completo de facturación</p>
              </div>
            </div>
            <button
              onClick={cargarFacturas}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Facturas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${estadisticas.totalVentas.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.facturasHoy}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Este Mes</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.facturasMes}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-cyan-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Mes</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    ${estadisticas.totalMes.toFixed(2)}
                  </p>
                </div>
                <div className="bg-cyan-100 p-3 rounded-full">
                  <CheckCircle size={24} className="text-cyan-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por ID, cliente o correo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <select
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todas las fechas</option>
                  <option value="hoy">Hoy</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mes</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={ordenamiento}
                  onChange={(e) => setOrdenamiento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="reciente">Más reciente</option>
                  <option value="antiguo">Más antiguo</option>
                  <option value="monto_mayor">Monto mayor</option>
                  <option value="monto_menor">Monto menor</option>
                </select>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{facturasFiltradas.length}</span> de{" "}
                <span className="font-semibold">{facturas.length}</span> facturas
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando facturas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-700 text-lg font-semibold">{error}</p>
          </div>
        ) : facturasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {busqueda || filtroFecha !== "todos" 
                ? "No se encontraron facturas con los filtros aplicados" 
                : "No hay facturas generadas aún"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-800 to-blue-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Nº Factura
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Fecha Emisión
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Estado Pedido
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturasFiltradas.map((factura) => {
                    const numFactura = `FAC-${factura._id.slice(-10).toUpperCase()}`;
                    
                    return (
                      <tr key={factura._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" />
                            <span className="text-sm font-bold text-gray-900">
                              {numFactura}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={18} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {factura.clienteNombre || 'Sin nombre'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {factura.clienteCorreo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatearFecha(factura.facturaGenerada)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatearHora(factura.facturaGenerada)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">
                            ${factura.costos?.total?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            factura.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                            factura.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                            factura.estado === 'listo' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factura.estado === 'entregado' ? 'Entregado' :
                             factura.estado === 'enviado' ? 'Enviado' :
                             factura.estado === 'listo' ? 'Listo' :
                             factura.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {/* ✅ BOTÓN: VER EN LÍNEA */}
                            <button
                              onClick={() => {
                                window.open(factura.facturaUrl, '_blank');
                                toast.info("Abriendo factura en nueva pestaña");
                              }}
                              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2 shadow-sm"
                              title="Ver factura en línea"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">Ver</span>
                            </button>

                            {/* ✅ BOTÓN: DESCARGAR */}
                            <button
                              onClick={async () => {
                                try {
                                  toast.info("Descargando factura...");
                                  
                                  // Agregar fl_attachment para forzar descarga
                                  const urlDescarga = factura.facturaUrl.replace('/upload/', '/upload/fl_attachment/');
                                  
                                  const response = await fetch(urlDescarga);
                                  const blob = await response.blob();
                                  const blobUrl = window.URL.createObjectURL(blob);
                                  
                                  const link = document.createElement('a');
                                  link.href = blobUrl;
                                  const numFactura = `FAC-${factura._id.slice(-10).toUpperCase()}`;
                                  link.download = `${numFactura}.pdf`;
                                  
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(blobUrl);
                                  
                                  toast.success("Factura descargada exitosamente");
                                } catch (err) {
                                  console.error("Error al descargar:", err);
                                  toast.error("Error al descargar la factura");
                                }
                              }}
                              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors gap-2 shadow-sm"
                              title="Descargar factura"
                            >
                              <Download size={16} />
                              <span className="hidden sm:inline">Descargar</span>
                            </button>

                            {/* BOTÓN EXISTENTE: VER DETALLES DEL PEDIDO */}
                            <button
                              onClick={() => verDetallesPedido(factura)}
                              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors gap-2 shadow-sm"
                              title="Ver detalles del pedido"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">Pedido</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <FooterAdmin />
    </div>
  );
}
