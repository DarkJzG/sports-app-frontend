// src/pages/Pedidos/Cliente/AgregarPago.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function AgregarPago() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estados del formulario
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [imagenComprobante, setImagenComprobante] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);

  // ✅ Verificar si hay pagos pendientes
  const hayPagosPendientes = pedido?.pagos?.some(p => p.estado === 'pendiente') || false;
  const pagosPendientes = pedido?.pagos?.filter(p => p.estado === 'pendiente') || [];


  // Cargar información del pedido
  useEffect(() => {
    const cargarPedido = async () => {
      try {
        setCargando(true);
        const res = await fetch(`${API_URL}/pedido/get/${pedidoId}`);
        const data = await res.json();

        if (!data.ok) {
          toast.error(data.msg || "No se pudo cargar el pedido");
          navigate("/mis-pedidos");
          return;
        }

        setPedido(data.pedido);

        // Si el pedido ya está completamente pagado, redirigir
        if (data.pedido.infoPago?.estado_pago === "pago_completo") {
          toast.info("Este pedido ya está completamente pagado");
          navigate(`/mis-pedidos`);
          return;
        }

        // ✅ Si hay pagos pendientes de aprobación, no permitir nuevos pagos
        const tienePagosPendientes = data.pedido.pagos?.some(p => p.estado === 'pendiente');
        if (tienePagosPendientes) {
          toast.warning("Tienes pagos pendientes de aprobación. Espera a que sean revisados antes de enviar otro.");
          // No redirigir, solo mostrar advertencia
        }
      } catch (error) {
        console.error("Error al cargar pedido:", error);
        toast.error("Error al cargar el pedido");
        navigate("/mis-pedidos");
      } finally {
        setCargando(false);
      }
    };

    cargarPedido();
  }, [pedidoId, navigate]);

  // Manejar selección de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setImagenComprobante(file);

    // Generar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImagen(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Eliminar imagen seleccionada
  const handleEliminarImagen = () => {
    setImagenComprobante(null);
    setPreviewImagen(null);
    const fileInput = document.getElementById("comprobante");
    if (fileInput) fileInput.value = "";
  };

// Validar monto - VERSIÓN MEJORADA FINAL
const validarMonto = () => {
  const montoNum = parseFloat(monto);
  const saldoPendiente = pedido.infoPago?.saldo_pendiente || 0;

  // Validar que sea un número válido
  if (!monto || isNaN(montoNum) || montoNum <= 0) {
    toast.error("Por favor ingresa un monto válido");
    return false;
  }

  // Validar monto mínimo
  if (montoNum < 0.01) {
    toast.error("El monto mínimo es de $0.01");
    return false;
  }

  // Calcular diferencia con mayor tolerancia para problemas de redondeo
  const diferencia = Math.abs(montoNum - saldoPendiente);
  
  // Si la diferencia es muy pequeña (≤ 0.02), considerarlo válido
  if (diferencia <= 0.02 && montoNum >= saldoPendiente) {
    // Ajustar silenciosamente al valor exacto si está muy cerca
    if (diferencia > 0) {
      setMonto(saldoPendiente.toFixed(2));
    }
    return true;
  }

  // Si excede significativamente, mostrar error
  if (montoNum > saldoPendiente + 0.02) {
    toast.error(
      `El monto ingresado (${formatCurrency(montoNum)}) supera el saldo pendiente (${formatCurrency(saldoPendiente)})`
    );
    return false;
  }

  return true;
};



// Enviar pago
const handleEnviarPago = async (e) => {
  e.preventDefault();

  // ✅ Validar que no haya pagos pendientes
  if (hayPagosPendientes) {
    toast.error("No puedes enviar un nuevo pago mientras haya pagos pendientes de aprobación.");
    return;
  }

  // Validaciones
  if (!validarMonto()) return;

  if (!referencia.trim()) {
    toast.error("Por favor ingresa una referencia de pago");
    return;
  }

  if (!imagenComprobante) {
    toast.error("Por favor adjunta el comprobante de pago");
    return;
  }

  try {
    setEnviando(true);

    const formData = new FormData();
    formData.append("imagen", imagenComprobante);

    const montoFinal = Number(parseFloat(monto).toFixed(2));

    // Datos del pago
    const dataPago = {
      monto: montoFinal,  // ✅ Enviar como número
      referencia: referencia.trim(),
    };

    console.log("Enviando pago:", dataPago);  // ✅ Para debugging
    console.log("Datos a enviar:", {
      monto: montoFinal,
      tipo: typeof montoFinal,
      referencia: referencia.trim(),
      saldoPendiente: saldoPendiente,
    });

    formData.append("data", JSON.stringify(dataPago));

    // Enviar al backend
    const res = await fetch(`${API_URL}/pedido/${pedidoId}/pago`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.ok) {
      toast.error(data.msg || "Error al registrar el pago");
      console.error("Error del servidor:", data);  // ✅ Para debugging
      return;
    }

    toast.success("Pago registrado exitosamente. Será revisado por nuestro equipo.");
    
    // Redirigir al detalle del pedido
    setTimeout(() => {
      navigate(`/mis-pedidos/${pedidoId}`);
    }, 1500);
  } catch (error) {
    console.error("Error al enviar pago:", error);

    toast.error("Error al enviar el pago. Intenta nuevamente.");
  } finally {
    setEnviando(false);
  }
};


  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del pedido...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  const saldoPendiente = pedido.infoPago?.saldo_pendiente || 0;
  const totalPedido = pedido.infoPago?.total_pedido || 0;
  const totalPagado = pedido.infoPago?.total_pagado || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/mis-pedidos/${pedidoId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al pedido
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Agregar Pago - Pedido #{pedido._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-gray-600 mt-2">
            Completa el formulario para registrar un nuevo pago
          </p>
        </div>

        {/* ✅ Alerta de pagos pendientes */}
        {hayPagosPendientes && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Pagos Pendientes de Aprobación
                </h3>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p>Tienes {pagosPendientes.length} pago(s) en revisión:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {pagosPendientes.map((pago, index) => (
                      <li key={index}>
                        {formatCurrency(pago.monto)} - Ref: {pago.referencia}
                        {pago.fecha && (
                          <span className="text-xs ml-2">
                            ({new Date(pago.fecha).toLocaleDateString('es-ES')})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 font-medium">
                    ⏳ No podrás enviar nuevos pagos hasta que estos sean aprobados o rechazados.
                  </p>
                  <p className="mt-2 text-xs">
                    Tiempo estimado de revisión: 24-48 horas hábiles
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/mis-pedidos/${pedidoId}`)}
                  className="mt-3 text-sm text-yellow-800 font-medium underline hover:text-yellow-900"
                >
                  Ver detalles del pedido →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-lg shadow p-6 ${hayPagosPendientes ? 'opacity-60' : ''}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información del Pago
              </h2>

              <form onSubmit={handleEnviarPago} className="space-y-6">

               {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a Pagar *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      onBlur={() => {
                        // ✅ Solo validar si hay un valor ingresado
                        if (!monto || monto.trim() === '') return;
                        
                        const montoNum = parseFloat(monto);
                        
                        // ✅ Validar que sea un número válido
                        if (isNaN(montoNum)) return;
                        
                        // ✅ Calcular diferencia con tolerancia para redondeo
                        const diferencia = montoNum - saldoPendiente;
                        
                        // ✅ Solo mostrar alerta y ajustar si excede significativamente (más de 2 centavos)
                        if (diferencia > 0.02) {
                          toast.warning(
                            `El monto ingresado (${formatCurrency(montoNum)}) supera el saldo pendiente (${formatCurrency(saldoPendiente)}). Se ajustará automáticamente.`,
                            { autoClose: 3000 }
                          );
                          setMonto(saldoPendiente.toFixed(2));
                        }
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="0.00"
                      required
                      disabled={hayPagosPendientes}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Máximo: {formatCurrency(saldoPendiente)}
                  </p>

                  {/* Botones de monto rápido */}
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setMonto((saldoPendiente / 2).toFixed(2))}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={hayPagosPendientes}
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonto((saldoPendiente * 0.75).toFixed(2))}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={hayPagosPendientes}
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // ✅ Asegurar que el valor sea exactamente el saldo pendiente
                        setMonto(Number(saldoPendiente.toFixed(2)).toFixed(2));
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={hayPagosPendientes}
                    >
                      Pago Total
                    </button>
                  </div>
                </div>

                {/* Referencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia del Pago *
                  </label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Número de transferencia, depósito, etc."
                    required
                    disabled={hayPagosPendientes}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Ejemplo: TRANS-12345678, DEP-98765432
                  </p>
                </div>

                {/* Comprobante de pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprobante de Pago *
                  </label>
                  
                  {!previewImagen ? (
                    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors ${hayPagosPendientes ? 'pointer-events-none' : ''}`}>
                      <input
                        type="file"
                        id="comprobante"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="hidden"
                        required
                        disabled={hayPagosPendientes}
                      />
                      <label
                        htmlFor="comprobante"
                        className={`flex flex-col items-center ${hayPagosPendientes ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className={`font-medium ${hayPagosPendientes ? 'text-gray-400' : 'text-blue-600'}`}>
                          Haz clic para seleccionar una imagen
                        </span>
                        <span className="text-gray-500 text-sm mt-1">
                          PNG, JPG o JPEG (máx. 5MB)
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={previewImagen}
                          alt="Preview comprobante"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Comprobante seleccionado
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {imagenComprobante.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {(imagenComprobante.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={handleEliminarImagen}
                            className="mt-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={hayPagosPendientes}
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información importante */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Información importante:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Tu pago será revisado por nuestro equipo en las próximas 24 horas</li>
                        <li>Recibirás una notificación cuando el pago sea aprobado</li>
                        <li>Asegúrate de que el comprobante sea legible y contenga toda la información</li>
                        {hayPagosPendientes && (
                          <li className="text-yellow-700 font-medium">
                            No puedes enviar nuevos pagos mientras haya pagos pendientes de revisión
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/mis-pedidos/${pedidoId}`)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando || hayPagosPendientes}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {enviando ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : hayPagosPendientes ? (
                      "Esperando Aprobación"
                    ) : (
                      "Enviar Pago"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resumen del Pedido
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total del pedido:</span>
                  <span className="font-medium">{formatCurrency(totalPedido)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ya pagado:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(totalPagado)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Saldo pendiente:</span>
                    <span className="font-bold text-lg text-red-600">
                      {formatCurrency(saldoPendiente)}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progreso de pago</span>
                    <span>{pedido.infoPago?.porcentaje_pagado || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          pedido.infoPago?.porcentaje_pagado || 0,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Estado del pedido */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Estado del pedido:</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {pedido.estado?.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* ✅ Mostrar información de pagos pendientes */}
                {hayPagosPendientes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">
                      ⏳ Pagos en Revisión:
                    </p>
                    <p className="text-xs text-yellow-700">
                      {pagosPendientes.length} pago(s) pendiente(s)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow p-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Si tienes dudas sobre cómo realizar el pago, contáctanos:
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +593 123 456 789
                </p>
                <p className="flex items-center text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  soporte@tuempresa.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
