// src/pages/Pedidos/Admin/DetallePedidoAdmin.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import { API_URL } from "../../../config";

// Componente para las tarjetas de información
const InfoCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

// Componente para los badges de estado
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pendiente_pago: "bg-yellow-100 text-yellow-800",
    pagado_parcial: "bg-blue-100 text-blue-800",
    pagado_total: "bg-green-100 text-green-800",
    en_produccion: "bg-indigo-100 text-indigo-800",
    listo: "bg-purple-100 text-purple-800",
    enviado: "bg-cyan-100 text-cyan-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    pendiente_pago: "Pendiente de Pago",
    pagado_parcial: "Pago Parcial",
    pagado_total: "Pagado",
    en_produccion: "En Producción",
    listo: "Listo para Envío",
    enviado: "En Camino",
    entregado: "Entregado",
    cancelado: "Cancelado"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusLabels[status] || status}
    </span>
  );
};

// Función segura para formatear fechas
const formatDateSafe = (dateString) => {
  try {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Fecha inválida' 
      : format(date, "PPpp", { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
};

// Componente para la línea de tiempo
const TimelineItem = ({ status, date, event, isLast }) => {
  // Verificar si la fecha es válida
  const isValidDate = date && !isNaN(new Date(date).getTime());
  
  return (
    <div className="relative pb-6">
      {!isLast && (
        <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200"></div>
      )}
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {status}
            </span>
            <span className="text-xs text-gray-500">
              {isValidDate ? formatDateSafe(date) : 'Fecha no disponible'}
            </span>
          </div>
          {event && (
            <p className="text-sm text-gray-600 mt-1">{event}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DetallePedidoAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estados para gestión
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [nota, setNota] = useState("");
  const [msg, setMsg] = useState("");

  // Función para cargar datos del usuario
  const cargarUsuario = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/usuario/perfil/${userId}`);
      const data = await res.json();
      if (data.ok) {
        setUsuario(data.usuario);  // Nota: La respuesta del backend usa 'usuario' no 'user'
      } else {
        console.error('Error al cargar datos del usuario:', data.msg);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

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
          // Cargar datos del usuario
          if (data.pedido.userId) {
            await cargarUsuario(data.pedido.userId);
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

  if (cargando) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    </div>
  );

  if (!pedido) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-6">El pedido solicitado no existe o no tienes permiso para verlo.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );

  // Calcular totales
  const totalProductos = pedido.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
  const envio = pedido.costos?.envio || 0;
  const impuestos = pedido.costos?.impuestos || 0;
  const total = pedido.costos?.total || (totalProductos + envio + impuestos);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a pedidos
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              Pedido #{pedido._id.slice(-6).toUpperCase()}
            </h1>
            <div className="flex items-center mt-2">
              <StatusBadge status={pedido.estado} />
              <span className="ml-3 text-sm text-gray-500">
                Creado el {formatDateSafe(pedido.createdAt)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total del pedido</div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {msg && (
          <div className={`p-4 mb-6 rounded-lg ${msg.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Cliente */}
            <InfoCard title="Información del Cliente">
              {usuario ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{usuario.nombre || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo</p>
                    <p className="font-medium">{usuario.correo  || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{usuario.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID de Usuario</p>
                    <p className="font-mono text-sm">{usuario._id || pedido.userId}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Cargando información del cliente...</p>
                </div>
              )}
            </InfoCard>

            {/* Resumen del Pedido */}
            <InfoCard title="Resumen del Pedido">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estado Actual</p>
                  <div className="mt-1">
                    <StatusBadge status={pedido.estado} />
                  </div>
                </div>
                {pedido.fechaEntrega && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Entrega</p>
                    <p className="font-medium">
                      {formatDateSafe(pedido.fechaEntrega)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Método de Pago</p>
                  <p className="font-medium capitalize">
                    {pedido.metodoPago || 'No especificado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Pago</p>
                  <p className="font-medium capitalize">
                    {pedido.tipoPago === 'completo' ? 'Pago Completo' : 'Anticipo'}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Dirección de Envío */}
            <InfoCard title="Dirección de Envío">
              {typeof pedido.direccionEnvio === "string" ? (
                <p className="text-gray-600">{pedido.direccionEnvio}</p>
              ) : (
                <React.Fragment>
                  <p className="text-sm text-gray-500">Calle Principal y Secundaria</p>
                  <p>{pedido.direccionEnvio.direccion_principal} y {pedido.direccionEnvio.direccion_secundaria} </p>
                  <p className="text-sm text-gray-500">Ciudad, Provincia</p>
                  <p>{pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.provincia}</p>
                  <p className="text-sm text-gray-500">País</p>
                  <p>{pedido.direccionEnvio.pais}</p>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-blue-600">{pedido.direccionEnvio.telefono}</p>
                  {pedido.direccionEnvio.codigo_postal && (
                    <p className="text-sm text-gray-500">C.P. {pedido.direccionEnvio.codigo_postal}</p>
                  )}
                </React.Fragment>
              )}
            </InfoCard>

            {/* Productos */}
            <InfoCard title="Productos">
              <div className="space-y-4">
                {pedido.items.map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.imagen ? (
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">Cantidad: {item.cantidad}</span>
                        {item.talla && <span className="mr-3">Talla: {item.talla}</span>}
                        {item.color?.color && (
                          <div className="flex items-center">
                            <span className="mr-1">Color:</span>
                            {item.color.codigo ? (
                              <span 
                                className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                                style={{ backgroundColor: item.color.codigo }}
                                title={item.color.color}
                              ></span>
                            ) : (
                              <span>{item.color.color}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.precioUnitario * item.cantidad).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.precioUnitario.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${totalProductos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">${envio.toFixed(2)}</span>
                </div>
                {impuestos > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Impuestos:</span>
                    <span className="font-medium">${impuestos.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-lg font-bold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </InfoCard>

            {/* Historial de Pagos */}
            <InfoCard title="Historial de Pagos">
              <div className="space-y-4">
                {pedido.pagos?.length > 0 ? (
                  pedido.pagos.map((pago, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">
                            ${pago.monto?.toFixed(2) || '0.00'}
                            <span className="ml-2 text-sm font-normal text-gray-500">
                              ({pago.tipo === 'anticipo' ? 'Anticipo' : pago.tipo === 'completo' ? 'Pago Completo' : 'Pago Parcial'})
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDateSafe(pago.fecha)}
                          </p>
                          {pago.referencia && (
                            <p className="text-sm text-gray-600">
                              Referencia: {pago.referencia}
                            </p>
                          )}
                          {pago.estado && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              pago.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                              pago.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {pago.estado.charAt(0).toUpperCase() + pago.estado.slice(1)}
                            </span>
                          )}
                        </div>
                        
                        {pago.comprobante && (
                          <div className="flex flex-col items-end">
                            <div className="w-20 h-20 border rounded-md overflow-hidden">
                              <img 
                                src={pago.comprobante} 
                                alt={`Comprobante ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                onClick={() => window.open(pago.comprobante, '_blank')}
                              />
                            </div>
                            <button
                              onClick={() => window.open(pago.comprobante, '_blank')}
                              className="mt-1 text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Ver comprobante
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {pago.nota && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <p className="font-medium text-xs text-gray-500">Nota:</p>
                          <p>{pago.nota}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay pagos registrados</p>
                )}
              </div>
            </InfoCard>

            {/* Historial */}
            <InfoCard title="Historial del Pedido">
              {pedido.timeline?.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {pedido.timeline.map((evento, index) => (
                      <TimelineItem 
                        key={index}
                        status={evento.estado}
                        date={evento.ts}
                        event={evento.evento}
                        isLast={index === pedido.timeline.length - 1}
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
            {/* Gestión de estado */}
            <InfoCard className="w-1/2" title="Gestión de Estado">
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
            </InfoCard>
          </div>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}
