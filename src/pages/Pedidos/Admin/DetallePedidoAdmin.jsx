// src/pages/Pedidos/Admin/DetallePedidoAdmin.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from "react-toastify";
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

const TimelineItem = ({ status, date, event, isLast }) => {
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

const PaymentStatusBadge = ({ estadoPago }) => {
  const styles = {
    pago_pendiente: "bg-red-100 text-red-800 border-red-300",
    pago_parcial: "bg-blue-100 text-blue-800 border-blue-300",
    pago_completo: "bg-green-100 text-green-800 border-green-300"
  };

  const labels = {
    pago_pendiente: "Pago Pendiente",
    pago_parcial: "Pago Parcial",
    pago_completo: "Pago Completo"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[estadoPago] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {labels[estadoPago] || estadoPago}
    </span>
  );
};

// Transiciones válidas del pedido
const obtenerEstadosDisponibles = (estadoActual, infoPago, tipoEntrega) => {
  const transiciones = {
    en_revision: [
      { 
        value: "en_produccion",  // ✅ Ahora va primero a producción
        label: "Iniciar Producción",
        color: "indigo",
        requiere: "pago_50",  // Requiere mínimo 50%
        requireFecha: true,  
        requireNota: false,
      },
      { 
        value: "cancelado", 
        label: "Cancelar Pedido", 
        color: "red",
        requireFecha: false,
        requireNota: true
      }
    ],
    en_produccion: [
      {
        value: "listo",
        label: "Marcar como Listo",
        color: "purple",
        requiere: "pago_completo",  
        requireFecha: false,  
        requireNota: false,
      },
    ],
    listo: [
      { 
        value: "enviado", 
        label: "Preparar para Envío", 
        color: "cyan", 
        requiere: "pago_completo",
        requireFecha: true, // ✅ Fecha estimada de entrega
        requireNota: true, // ✅ Datos del envío obligatorios
        onlyForEntrega: "domicilio"
      },
      { 
        value: "retiro", 
        label: "Preparar para Retiro", 
        color: "blue", 
        requiere: "pago_completo",
        requireFecha: false,
        requireNota: false, // ✅ Nota automática
        onlyForEntrega: "retiro"
      }
    ],
    enviado: [
      { 
        value: "entregado", 
        label: "Marcar como Entregado", 
        color: "green", 
        requiere: "pago_completo",
        requireFecha: false, // ✅ Se marca automáticamente
        requireNota: false
      }
    ],
    retiro: [
      { 
        value: "entregado", 
        label: "Marcar como Entregado", 
        color: "green", 
        requiere: "pago_completo",
        requireFecha: false, // ✅ Se marca automáticamente
        requireNota: false
      }
    ],
    entregado: [],
    cancelado: []
  };

  const disponibles = transiciones[estadoActual] || [];
  
  // Filtrar por tipo de entrega
  const filtradosPorEntrega = disponibles.filter(estado => {
    if (!estado.onlyForEntrega) return true;
    return estado.onlyForEntrega === tipoEntrega;
  });

  if (!infoPago) return filtradosPorEntrega;

  // Filtrar según requisitos de pago
  return filtradosPorEntrega.filter(estado => {
    if (!estado.requiere) return true;
    
    if (estado.requiere === "pago_50") {
      return infoPago.porcentaje_pagado >= 50;
    }
    
    if (estado.requiere === "pago_completo") {
      return infoPago.estado_pago === "pago_completo";
    }
    
    return true;
  });
};

function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}



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

  // Función para cargar datos del usuario
  const cargarUsuario = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/usuario/perfil/${userId}`);
      const data = await res.json();
      if (data.ok) {
        setUsuario(data.usuario);
      } else {
        console.error('Error al cargar datos del usuario:', data.msg);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  // Función para recargar pedido
  const recargarPedido = async () => {
    try {
      const res = await fetch(`${API_URL}/pedido/get/${id}`);
      const data = await res.json();
      if (data.ok) {
        setPedido(data.pedido);
        setNuevoEstado("");
        setNota("");
      } else {
        toast.error("No se pudo recargar el pedido");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al recargar el pedido");
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
          if (data.pedido.userId) {
            await cargarUsuario(data.pedido.userId);
          }
        } else {
          setPedido(null);
          toast.error("Pedido no encontrado");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error al cargar el pedido");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  // ✅ Información de pago del backend
  const infoPago = pedido?.infoPago || null;

const pagosPendientesConIndice = useMemo(() => {
  if (!pedido || !pedido.pagos) return [];
  
  return pedido.pagos
    .map((pago, indiceOriginal) => ({ ...pago, indiceOriginal }))
    .filter(p => p.estado === 'pendiente');
}, [pedido]);

const pagosAprobadosConIndice = useMemo(() => {
  if (!pedido || !pedido.pagos) return [];
  
  return pedido.pagos
    .map((pago, indiceOriginal) => ({ ...pago, indiceOriginal }))
    .filter(p => p.estado === 'aprobado');
}, [pedido]);

// Estados disponibles
const estadosDisponibles = useMemo(() => {
  if (!pedido || !infoPago) return [];
  
  // Determinar tipo de entrega
  const tipoEntrega = pedido.tipoEntrega || "domicilio"; // Por defecto domicilio
  
  return obtenerEstadosDisponibles(pedido.estado, infoPago, tipoEntrega);
}, [pedido, infoPago]);


  
  // Cálculo del estado de pago usando useMemo para evitar recálculos innecesarios
  const estadoPago = useMemo(() => {
  if (!pedido) return null;

  const totalPedido = pedido.costos?.total || 0;
  const pagosAprobados = (pedido.pagos || []).filter(p => p.estado === 'aprobado');
  const pagosPendientes = (pedido.pagos || []).filter(p => p.estado === 'pendiente');
  const totalPagado = pagosAprobados.reduce((sum, p) => sum + (p.monto || 0), 0);
  const porcentajePagado = totalPedido > 0 ? (totalPagado / totalPedido) * 100 : 0;
  const montoRestante = totalPedido - totalPagado;

  let tipoPago = 'sin_pago';
  if (porcentajePagado >= 100) {
    tipoPago = 'completo';
  } else if (porcentajePagado >= 50) {
    tipoPago = 'parcial';
  } else if (porcentajePagado > 0) {
    tipoPago = 'parcial';
  }

  const esAnticipo = porcentajePagado >= 45 && porcentajePagado < 55;

  return {
    totalPedido,
    totalPagado,
    porcentajePagado: porcentajePagado.toFixed(2),
    montoRestante: montoRestante.toFixed(2),
    tipoPago,
    esAnticipo,
    pagosAprobados,
    pagosPendientes,
    hayPagosPendientes: pagosPendientes.length > 0,
    pagoCompleto: porcentajePagado >= 100
  };
}, [pedido]);

const validarTransicion = (estadoDestino) => {
  if (!estadoPago) {
    return { valido: false, mensaje: "Cargando información de pago..." };
  }

  const { pagoCompleto, hayPagosPendientes, porcentajePagado } = estadoPago;

  // ✅ VALIDACIÓN CORREGIDA: en_revision → en_produccion
  if (pedido.estado === "en_revision" && estadoDestino === "en_produccion") {
    if (hayPagosPendientes) {
      return {
        valido: false,
        mensaje: "Debes aprobar o rechazar todos los comprobantes de pago antes de iniciar producción.",
      };
    }

    if (porcentajePagado < 50) {
      return {
        valido: false,
        mensaje: `Se requiere al menos el 50% del pago aprobado para iniciar producción. Actual: ${porcentajePagado}%`,
      };
    }

    // Advertencia si es justo 50%
    if (porcentajePagado >= 45 && porcentajePagado <= 55) {
      return {
        valido: true,
        advertencia: `⚠️ IMPORTANTE: Iniciando producción con anticipo del ${porcentajePagado}%. El cliente debe completar el pago restante antes de que el pedido esté listo.`,
      };
    }

    return { valido: true };
  }

  // ✅ en_produccion → listo (requiere 100% pagado)
  if (pedido.estado === "en_produccion" && estadoDestino === "listo") {
    if (hayPagosPendientes) {
      return {
        valido: true,
        advertencia: "⚠️ Hay comprobantes de pago pendientes de aprobación. Revsalos antes de marcar como listo.",
      };
    }

    if (!pagoCompleto) {
      return {
        valido: false,
        mensaje: `❌ No se puede marcar como Listo. El pago no está completo (${porcentajePagado}%). Falta: $${infoPago.saldo_pendiente?.toFixed(2)}. El cliente debe pagar el 100% antes de pasar a estado Listo.`,
      };
    }

    return { valido: true };
  }

  // listo → enviado/retiro
  if (pedido.estado === "listo" && (estadoDestino === "enviado" || estadoDestino === "retiro")) {
    if (hayPagosPendientes) {
      return {
        valido: false,
        mensaje: "No se puede enviar/entregar el pedido. Hay comprobantes de pago pendientes de aprobación.",
      };
    }

    if (!pagoCompleto) {
      return {
        valido: false,
        mensaje: `No se puede enviar/entregar sin pago completo. Pagado: ${porcentajePagado}%`,
      };
    }

    return { valido: true };
  }

  // enviado/retiro → entregado
  if ((pedido.estado === "enviado" || pedido.estado === "retiro") && estadoDestino === "entregado") {
    if (!pagoCompleto) {
      return {
        valido: false,
        mensaje: "No se puede marcar como entregado sin pago completo al 100%.",
      };
    }

    return { valido: true };
  }

  // Cancelación siempre permitida
  if (estadoDestino === "cancelado") {
    return { valido: true };
  }

  return { valido: true };
};


const handleActualizarEstado = async (estadoDestino) => {
  const validacion = validarTransicion(estadoDestino);
  if (!validacion.valido) {
    toast.error(validacion.mensaje);
    return;
  }

  // Confirmación para acciones críticas
  if (estadoDestino === "cancelado") {
    if (!window.confirm("¿Estás seguro de cancelar este pedido? Esta acción no se puede deshacer.")) {
      return;
    }
  }

  try {
    let fechaEntregaFinal = null;
    let notaFinal = nota;

    // ✅ Lógica de fechas según el estado destino
    if (estadoDestino === "en_produccion") {
      // Requiere fecha estimada de producción
      if (!fechaEntrega) {
        toast.error("Debes seleccionar una fecha estimada de producción");
        return;
      }
      const fecha = new Date(fechaEntrega);
      fecha.setHours(16, 0, 0, 0);
      fechaEntregaFinal = fecha.toISOString();
    } 
    else if (estadoDestino === "listo") {
      // ✅ Marcar con fecha actual (no seleccionable)
      fechaEntregaFinal = new Date().toISOString();
      if (!notaFinal) {
        notaFinal = `Producto listo el ${new Date().toLocaleDateString('es-ES')}`;
      }
    } 
    else if (estadoDestino === "enviado") {
      // ✅ Requiere fecha estimada de entrega y datos obligatorios
      if (!fechaEntrega) {
        toast.error("Debes seleccionar una fecha estimada de entrega");
        return;
      }
      if (!nota || nota.trim().length < 10) {
        toast.error("Debes ingresar los datos del envío (transportista, guía, etc.) y recordatorio de llamada");
        return;
      }
      const fecha = new Date(fechaEntrega);
      fecha.setHours(18, 0, 0, 0); // Hora estimada de entrega
      fechaEntregaFinal = fecha.toISOString();
      
      // Agregar recordatorio si no está incluido
      if (!notaFinal.toLowerCase().includes("llam") && !notaFinal.toLowerCase().includes("contact")) {
        notaFinal += "\n\nIMPORTANTE: Estaremos en contacto telefónico para coordinar la entrega. Por favor, mantente atento a tu celular.";
      }
      } 
      else if (estadoDestino === "retiro") {
        // ✅ Nota automática para retiro en local
        fechaEntregaFinal = new Date().toISOString();
        notaFinal = `Tu pedido está listo para retiro en nuestro local.\n\n📍 Puedes acercarte a retirar tu producto dentro de nuestro horario de atención:\nLunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM\n\n¡Te esperamos!`;
      } 
      else if (estadoDestino === "entregado") {
        // ✅ Marcar con fecha y hora actual
        fechaEntregaFinal = new Date().toISOString();
        if (!notaFinal) {
          notaFinal = `Pedido entregado exitosamente el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        }
      }

    

    const res = await fetch(`${API_URL}/pedido/${pedido._id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: estadoDestino,
        nota: notaFinal,
        ...(fechaEntregaFinal && { fechaEntrega: fechaEntregaFinal }),
      }),
    });

    const data = await res.json();

    if (data.ok) {
      toast.success("Estado actualizado correctamente");

      if (data.facturaUrl) {
        toast.success("✅ Estado actualizado y factura generada", {
          autoClose: 3000,
        });
        
        // Mostrar notificación adicional con opción de descargar
        setTimeout(() => {
          toast.info(
            <div>
              <p className="font-semibold">📄 Factura Disponible</p>
              <button
                onClick={() => {
                  const downloadUrl = data.facturaUrl.replace('/upload/', '/upload/fl_attachment/');
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `Factura_${id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-2 text-blue-600 underline text-sm hover:text-blue-800"
              >
                Descargar Factura
              </button>
            </div>,
            {
              autoClose: 8000,
              closeButton: true,
            }
          );
        }, 500);
      } else {
        toast.success(data.msg || "Estado actualizado correctamente");
      }
      
      if (validacion.advertencia) {
        setTimeout(() => toast.warning(validacion.advertencia, { autoClose: 8000 }), 500);
      }

      // Recargar el pedido
      await recargarPedido();
      } else {
        toast.error(data.msg || "Error al actualizar el estado");
      }
  } catch (e) {
    console.error(e);
    toast.error("Error de conexión con el servidor");
  }
};


const handleAprobarPago = async (indiceOriginal) => {
  try {
    const res = await fetch(`${API_URL}/pedido/${pedido._id}/pago/${indiceOriginal}/aprobar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.ok) {
      toast.success("✅ Pago aprobado correctamente");
      setPedido(data.pedido);
    } else {
      toast.error(data.msg || "Error al aprobar pago");
    }
  } catch (e) {
    console.error(e);
    toast.error("Error al aprobar pago");
  }
};

const handleRechazarPago = async (indiceOriginal) => {
  const motivo = prompt("Ingresa el motivo del rechazo:");
  if (!motivo) return;

  try {
    const res = await fetch(`${API_URL}/pedido/${pedido._id}/pago/${indiceOriginal}/rechazar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo })
    });

    const data = await res.json();
    if (data.ok) {
      toast.success("✅ Pago rechazado");
      setPedido(data.pedido);
    } else {
      toast.error(data.msg || "Error al rechazar pago");
    }
  } catch (e) {
    console.error(e);
    toast.error("Error al rechazar pago");
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
                    <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                      {/* ... SVG icon ... */}
                      Volver a pedidos
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                      Pedido #{pedido._id.slice(-6).toUpperCase()}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={pedido.estado} />
                      <PaymentStatusBadge estadoPago={pedido.estadoPago} />
                      <span className="text-sm text-gray-500">
                        Creado el {formatDateSafe(pedido.createdAt)}
                      </span>
                    </div>
                      {pedido?.proformaUrl && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => window.open(pedido.proformaUrl, "_blank", "noopener,noreferrer")}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                          >
                            Ver proforma
                          </button>
                        </div>
                      )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Total del pedido</div>
                  </div>
                </div>

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
                    <p className="text-sm text-gray-500">C.I.</p>
                    <p className="font-medium">{usuario.cedula || 'No especificado'}</p>
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
                    <p className="text-xs text-blue-700 mt-1">
                      {(() => {
                        const fin = new Date(pedido.fechaEntrega);
                        const diff = fin - new Date();
                        if (diff > 0) {
                          const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
                          return `Faltan ${dias} días y ${horas} horas para la entrega`;
                        }
                        return "Fecha de entrega vencida";
                      })()}
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


            {/* Dirección de Envío Condicional */}
            <InfoCard title="Dirección de Envío">
              {pedido.tipoEntrega === "retiro" || pedido.direccionEnvio?.tipoEnvio === "retiro" ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-blue-900">Retiro en Local</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    El cliente ha seleccionado retirar el pedido personalmente en las instalaciones de <strong>Johan Sport</strong>. 
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {typeof pedido.direccionEnvio === "string" ? (
                    <p className="text-gray-600">{pedido.direccionEnvio}</p>
                  ) : (
                    <React.Fragment>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Destinatario</p>
                          <p className="font-semibold">{pedido.direccionEnvio.nombre || usuario?.nombre}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Teléfono de Contacto</p>
                          <p className="text-blue-600 font-bold">{pedido.direccionEnvio.telefono}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Dirección Principal</p>
                        <p className="text-gray-900">{pedido.direccionEnvio.direccion_principal}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Referencias / Secundaria</p>
                        <p className="text-gray-700">
                          {pedido.direccionEnvio.direccion_secundaria || "N/A"} 
                          {pedido.direccionEnvio.referencia && ` — Ref: ${pedido.direccionEnvio.referencia}`}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Ciudad</p>
                          <p>{pedido.direccionEnvio.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Provincia</p>
                          <p>{pedido.direccionEnvio.provincia}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">C.P.</p>
                          <p>{pedido.direccionEnvio.codigo_postal || "N/A"}</p>
                        </div>
                      </div>
                      
                      {pedido.direccionEnvio.detalle && (
                        <div className="bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                          <p className="text-xs font-medium text-gray-500 uppercase italic">Instrucciones del Cliente:</p>
                          <p className="text-sm text-gray-700">{pedido.direccionEnvio.detalle}</p>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              )}
            </InfoCard>

            {/* Productos */}
            <InfoCard title="Productos">
              <div className="space-y-4">
                {pedido.items.map((item, index) => (
                  <div key={item._id || index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.imagen ? (
                        <img 
                          src={item.imagen || item.imagen_url}
                          alt={item.nombre} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Historial */}
            <InfoCard title="Historial del Pedido">
              {pedido.timeline?.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {pedido.timeline.map((evento, index) => (
                      <TimelineItem 
                        key={evento._id || index}
                        status={evento.estado}
                        date={evento.ts}
                        event={evento.nota || evento.evento}
                        isLast={index === pedido.timeline.length - 1}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay historial disponible</p>
              )}
            </InfoCard>
              {pedido.facturaUrl && (
                <InfoCard title="📄 Factura">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Factura del Pedido</p>
                          <p className="text-xs text-gray-600">
                            Generada el {pedido.facturaGenerada 
                              ? formatDateSafe(pedido.facturaGenerada) 
                              : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      {/* ✅ BOTÓN 1: VER EN LÍNEA */}
                      <button
                        onClick={() => {
                          window.open(pedido.facturaUrl, '_blank');
                          toast.info("Abriendo factura en nueva pestaña");
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Factura
                      </button>

                      {/* ✅ BOTÓN 2: DESCARGAR */}
                      <button
                        onClick={async () => {
                          try {
                            toast.info("Descargando factura...");
                            
                            // Agregar fl_attachment a la URL para forzar descarga
                            const urlDescarga = pedido.facturaUrl.replace('/upload/', '/upload/fl_attachment/');
                            
                            const response = await fetch(urlDescarga);
                            const blob = await response.blob();
                            
                            const blobUrl = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = `Factura-${pedido._id}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(blobUrl);
                            
                            toast.success("Factura descargada exitosamente");
                          } catch (error) {
                            console.error("Error al descargar:", error);
                            toast.error("Error al descargar la factura");
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar
                      </button>
                    </div>
                  </div>
                </InfoCard>
              )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {infoPago && infoPago.estado_pago === "pago_completo" && (
              <div className="p-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-green-800">Pago Completo al 100%</p>
                  <p className="text-xs text-green-700">El pedido puede pasar a estado "Listo" y se generará factura automáticamente</p>
                </div>
              </div>
            )}
            
            {/* ✅ AGREGAR: Advertencia si falta pago */}
            {infoPago && infoPago.estado_pago !== "pago_completo" && infoPago.saldo_pendiente > 0 && (
              <div className="p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-yellow-800">Pago Incompleto</p>
                  <p className="text-xs text-yellow-700">
                    Falta ${infoPago.saldo_pendiente.toFixed(2)} para completar el pago. 
                    No se puede marcar como "Listo" hasta que el pago esté al 100%.
                  </p>
                </div>
              </div>
            )}
            {/* ✅ Estado de Pago mejorado */}
            {infoPago && (
              <InfoCard title="Estado de Pago">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total del pedido:</span>
                    <span className="font-bold text-lg">${infoPago.total_pedido.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total pagado:</span>
                    <span className="font-bold text-lg text-green-600">${infoPago.total_pagado.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saldo pendiente:</span>
                    <span className="font-bold text-lg text-red-600">${infoPago.saldo_pendiente.toFixed(2)}</span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Progreso de pago</span>
                      <span className="text-xs font-semibold text-gray-900">{infoPago.porcentaje_pagado}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${
                          infoPago.estado_pago === 'pago_completo' ? 'bg-green-600' : 
                          infoPago.estado_pago === 'pago_parcial' ? 'bg-blue-600' : 
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(infoPago.porcentaje_pagado, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Estado de pago:</p>
                    <PaymentStatusBadge estadoPago={infoPago.estado_pago} />
                  </div>

                  {pedido.estado === 'en_produccion' && infoPago.estado_pago !== 'pago_completo' && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                      <p className="text-xs font-semibold text-orange-800">
                        ⚠️ En producción con pago {infoPago.estado_pago === 'pago_parcial' ? 'parcial' : 'pendiente'}
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Faltan ${infoPago.saldo_pendiente.toFixed(2)} por pagar
                      </p>
                    </div>
                  )}
                </div>
              </InfoCard>
            )}

            {/* Comprobantes de Pago Pendientes */}
           {pagosPendientesConIndice.length > 0 && (
              <InfoCard title="Comprobantes Pendientes">
                <div className="space-y-3">
                  {pagosPendientesConIndice.map((pago) => (
                    <div key={pago._id || pago.indiceOriginal} className="border border-yellow-300 rounded-lg p-3 bg-yellow-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm">${pago.monto?.toFixed(2)}</p>
                          <p className="text-xs text-gray-600">{formatDateSafe(pago.fecha)}</p>
                          {pago.referencia && (
                            <p className="text-xs text-gray-600">Ref: {pago.referencia}</p>
                          )}
                        </div>
                        {pago.comprobante && (
                          <div className="w-16 h-16 border rounded overflow-hidden">
                            <img 
                              src={pago.comprobante} 
                              alt="Comprobante"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => window.open(pago.comprobante, '_blank')}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAprobarPago(pago.indiceOriginal)}
                          className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazarPago(pago.indiceOriginal)}
                          className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}

            {/* Historial de Pagos Aprobados */}
            {pagosAprobadosConIndice.length > 0 && (
              <InfoCard title="Pagos Aprobados">
                <div className="space-y-3">
                  {pagosAprobadosConIndice.map((pago) => (
                    <div key={pago._id || pago.indiceOriginal} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">${pago.monto?.toFixed(2)}</p>
                          <p className="text-xs text-gray-600">{formatDateSafe(pago.fecha)}</p>
                          {pago.referencia && (
                            <p className="text-xs text-gray-600">Ref: {pago.referencia}</p>
                          )}
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Aprobado
                          </span>
                        </div>
                        {pago.comprobante && (
                          <button
                            onClick={() => window.open(pago.comprobante, '_blank')}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Ver comprobante
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}

              <InfoCard title="Acciones Disponibles">
                <div className="space-y-3">
                  {estadosDisponibles.length > 0 ? (
                    estadosDisponibles.map((accion) => {
                      const validacion = validarTransicion(accion.value);
                      const estaSeleccionado = nuevoEstado === accion.value;
                      
                      // Clases de color para Tailwind
                      const colorClasses = {
                        red: 'bg-red-600 hover:bg-red-700',
                        indigo: 'bg-indigo-600 hover:bg-indigo-700',
                        purple: 'bg-purple-600 hover:bg-purple-700',
                        cyan: 'bg-cyan-600 hover:bg-cyan-700',
                        green: 'bg-green-600 hover:bg-green-700',
                        blue: 'bg-blue-600 hover:bg-blue-700',
                        yellow: 'bg-yellow-600 hover:bg-yellow-700',
                        orange: 'bg-orange-600 hover:bg-orange-700',
                        black: 'bg-black hover:bg-black',
                      };
                      
                      return (
                        <div key={accion.value} className="border rounded-lg p-3">
                          {/* Botón de selección de acción */}
                          <button
                            onClick={() => {
                              if (estaSeleccionado) {
                                // Si ya está seleccionado, deseleccionar
                                setNuevoEstado("");
                                setFechaEntrega(pedido.fechaEntrega ? pedido.fechaEntrega.split("T")[0] : "");
                              } else {
                                // Seleccionar nuevo estado
                                setNuevoEstado(accion.value);
                              }
                            }}
                            disabled={!validacion.valido}
                            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                              estaSeleccionado
                                ? 'bg-gray-200 border-2 border-blue-600 text-gray-900'
                                : validacion.valido
                                ? `${colorClasses[accion.color]} text-white`
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{accion.label}</span>
                              {estaSeleccionado ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                          
                          {/* Mensajes de validación */}
                          {!validacion.valido && validacion.mensaje && (
                            <p className="mt-2 text-xs text-red-600">{validacion.mensaje}</p>
                          )}
                          
                          {validacion.valido && validacion.advertencia && (
                            <p className="mt-2 text-xs text-orange-600">{validacion.advertencia}</p>
                          )}

                          {/* Mostrar campos adicionales cuando el estado está seleccionado */}
                         {estaSeleccionado && validacion.valido && (
                          <div className="mt-3 space-y-3 border-t pt-3">
                            {/* ✅ Campo de fecha SOLO para estados que lo requieren */}
                            {accion.requireFecha && (
                              <div>
                                <label className="block mb-2 font-medium text-sm">
                                  {accion.value === "en_produccion" 
                                    ? "📅 Fecha estimada de producción *" 
                                    : "📅 Fecha estimada de entrega *"}
                                </label>
                                <input
                                  type="date"
                                  value={fechaEntrega}
                                  onChange={(e) => setFechaEntrega(e.target.value)}
                                  className="border px-3 py-2 rounded w-full"
                                  min={new Date().toISOString().split("T")[0]}
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {accion.value === "en_produccion" 
                                    ? "Fecha aproximada en la que el producto estará listo" 
                                    : "Fecha aproximada de entrega al cliente"}
                                </p>
                              </div>
                            )}

                            {/* ✅ Campos que NO requieren fecha (se marca automáticamente) */}
                            {(accion.value === "listo" || accion.value === "entregado") && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-xs text-blue-800 flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  Se registrará con fecha y hora actual
                                </p>
                              </div>
                            )}

                            {/* ✅ Campo de nota */}
                            {accion.value === "retiro" ? (
                              // Nota automática para retiro
                              <div className="p-3 bg-green-50 border border-green-200 rounded">
                                <p className="text-xs font-semibold text-green-800 mb-2">
                                  📝 Nota automática para el cliente:
                                </p>
                                <p className="text-xs text-green-700">
                                  "Tu pedido está listo para retiro en nuestro local. Puedes acercarte dentro de nuestro horario de atención: Lunes a Viernes 9:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM"
                                </p>
                              </div>
                            ) : accion.requireNota ? (
                              // Nota obligatoria
                              <div>
                                <label className="block mb-2 font-medium text-sm text-red-600">
                                  📝 Nota para el cliente {accion.value === "enviado" ? "(OBLIGATORIA)" : "*"}
                                </label>
                                {accion.value === "enviado" && (
                                  <p className="text-xs text-gray-600 mb-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <strong>Debe incluir:</strong> Transportista, número de guía, fecha estimada y recordatorio de que se contactarán telefónicamente
                                  </p>
                                )}
                                <textarea
                                  className="w-full border rounded px-3 py-2"
                                  placeholder={
                                    accion.value === "enviado" 
                                      ? "Ej: Enviado con ServiEntrega, guía #123456789. Entrega estimada: [fecha]. Estaremos llamándote para coordinar la entrega, por favor mantente atento a tu celular." 
                                      : "Agregar nota sobre el cambio de estado..."
                                  }
                                  value={nota}
                                  onChange={(e) => setNota(e.target.value)}
                                  rows={accion.value === "enviado" ? 5 : 3}
                                  required={accion.requireNota}
                                />
                              </div>
                            ) : (
                              // Nota opcional
                              <div>
                                <label className="block mb-2 font-medium text-sm">
                                  📝 Nota para el cliente (opcional)
                                </label>
                                <textarea
                                  className="w-full border rounded px-3 py-2"
                                  placeholder="Agregar nota sobre el cambio de estado..."
                                  value={nota}
                                  onChange={(e) => setNota(e.target.value)}
                                  rows={3}
                                />
                              </div>
                            )}

                            {/* Botón de confirmar cambio */}
                            <button
                              onClick={() => handleActualizarEstado(accion.value)}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                              ✓ Confirmar {accion.label}
                            </button>
                          </div>
                        )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No hay acciones disponibles para este estado.</p>
                      {pedido.estado === 'entregado' && (
                        <p className="text-xs mt-2">✓ El pedido ha sido completado</p>
                      )}
                      {pedido.estado === 'cancelado' && (
                        <p className="text-xs mt-2">✗ El pedido ha sido cancelado</p>
                      )}
                    </div>
                  )}
                </div>
              </InfoCard>

          </div>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
}
