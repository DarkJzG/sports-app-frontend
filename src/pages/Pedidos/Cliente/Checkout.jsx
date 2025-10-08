// src/pages/Pedidos/Cliente/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [direccion, setDireccion] = useState({
    nombre: "",
    direccion_principal: "",
    direccion_secundaria: "",
    ciudad: "",
    provincia: "",
    pais: "Ecuador",
    telefono: "",
    codigo_postal: "",
    tipoEnvio: "domicilio",
    detalle: ""
  });
  const [tipoPago, setTipoPago] = useState("completo"); // 'completo' o 'anticipo'
  const [referenciaPago, setReferenciaPago] = useState("");
  const [archivoComprobante, setArchivoComprobante] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [total, setTotal] = useState(0);

  // Cargar carrito y perfil del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const cargarDatos = async () => {
      try {
        // Cargar carrito
        const resCarrito = await fetch(`${API_URL}/carrito/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const dataCarrito = await resCarrito.json();
        if (dataCarrito.ok) {
          const carritoItems = dataCarrito.carrito || [];
          setCarrito(carritoItems);
          
          // Si el carrito está vacío, redirigir al carrito
          if (carritoItems.length === 0) {
            navigate("/carrito");
          }
        }

        // Cargar perfil del usuario
        const resPerfil = await fetch(`${API_URL}/usuario/perfil/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (resPerfil.ok) {
          const dataPerfil = await resPerfil.json();
          if (dataPerfil.ok) {
            setDireccion(prev => ({
              ...prev,
              nombre: `${dataPerfil.usuario.nombre || ""} ${dataPerfil.usuario.apellido || ""}`.trim(),
              direccion_principal: dataPerfil.usuario.direccion_principal || "",
              direccion_secundaria: dataPerfil.usuario.direccion_secundaria || "",
              ciudad: dataPerfil.usuario.ciudad || "",
              provincia: dataPerfil.usuario.provincia || "",
              pais: dataPerfil.usuario.pais || "Ecuador",
              telefono: dataPerfil.usuario.telefono || "",
              codigo_postal: dataPerfil.usuario.codigo_postal || "",
              detalle: dataPerfil.usuario.detalle_direccion || ""
            }));
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos del usuario");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [user, navigate]);

  // Calcular totales cuando cambia el carrito o el tipo de envío
  useEffect(() => {
    // Calcular subtotal
    const sub = carrito.reduce((sum, item) => {
      const precioUnitario = Number(item.precio_unitario) || 0;
      const cantidad = Math.max(1, Math.floor(Number(item.cantidad) || 1));
      return sum + (precioUnitario * cantidad);
    }, 0);
    setSubtotal(Number(sub.toFixed(2)));
    
    // Calcular envío
    const envioCalculado = direccion.tipoEnvio === "domicilio" ? 3 : 0;
    setEnvio(envioCalculado);
    
    // Calcular impuestos (12% del subtotal)
    const impuestosCalculados = sub * 0.12;
    setImpuestos(impuestosCalculados);
    
    // Calcular total
    setTotal(Number((sub + envioCalculado + impuestosCalculados).toFixed(2)));
  }, [carrito, direccion.tipoEnvio]);

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoComprobante(file);
      setNombreArchivo(file.name);
    }
  };

  // Manejar envío del formulario
  const handleConfirmar = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMsg("");

    // Validar que se haya subido un comprobante
    if (!archivoComprobante) {
      setMsg("Por favor, sube el comprobante de pago");
      setCargando(false);
      return;
    }

    // Validar referencia de pago
    if (!referenciaPago.trim()) {
      setMsg("Por favor, ingresa una referencia de pago");
      setCargando(false);
      return;
    }

    const camposRequeridos = {
      'nombre': 'Nombre completo',
      'direccion_principal': 'Dirección principal',
      'ciudad': 'Ciudad',
      'provincia': 'Provincia',
      'telefono': 'Teléfono'
    };

    for (const [campo, nombre] of Object.entries(camposRequeridos)) {
      if (!direccion[campo]?.trim()) {
        setMsg(`Por favor, completa el campo: ${nombre}`);
        setCargando(false);
        return;
      }
    }

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append("imagen", archivoComprobante);

      // Calcular montos
      const montoTotal = parseFloat(total.toFixed(2));
      const montoPago = tipoPago === "anticipo" ? montoTotal * 0.5 : montoTotal;

      // Datos del pedido
      const pedidoData = {
        items: carrito.map((item) => ({
          productId: item._id || item.productId,
          tipo: item.tipo,
          nombre: item.nombre,
          cantidad: item.cantidad || 1,
          precioUnitario: item.precio_unitario || item.precio,
          precioTotal: item.precio_total || item.precio,
          talla: item.talla,
          color: typeof item.color === "string" ? item.color : (item.color?.color || "N/A"),
          imagen: item.imagen_url || item.imagen || "",
          categoria_nombre: item.categoria_nombre,
          tela_nombre: item.tela_nombre,
          ficha_id: item.ficha_id || null,
          estado: "pendiente"
        })),
        direccionEnvio: {
          tipoEnvio: direccion.tipoEnvio,
          nombre: direccion.nombre,
          direccion_principal: direccion.direccion_principal,
          direccion_secundaria: direccion.direccion_secundaria || "",
          ciudad: direccion.ciudad,
          provincia: direccion.provincia,
          pais: direccion.pais,
          telefono: direccion.telefono,
          codigo_postal: direccion.codigo_postal,
          detalle: direccion.detalle || "",
        },
        metodoPago: "transferencia",
        tipoPago: tipoPago,
        referenciaPago: referenciaPago,
        costos: {
          subtotal: subtotal,
          envio: envio,
          impuestos: impuestos,
          total: montoTotal,
        },
      };

      formData.append("data", JSON.stringify(pedidoData));

      // Enviar la solicitud al servidor
      const response = await fetch(
        `${API_URL}/pedido/confirmar-transferencia/${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pedido');
      }
  
      // Limpiar carrito
      try {
        await fetch(`${API_URL}/carrito/vaciar/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        // Continuar aunque falle el vaciado del carrito
      }
  
      // Mostrar mensaje de éxito
      toast.success("¡Pedido creado exitosamente!");
      
      // Redirigir a la página de confirmación o historial de pedidos
      navigate('/mis-pedidos');
  
    } catch (error) {
      console.error('Error en handleConfirmar:', error);
      setMsg(error.message || 'Ocurrió un error al procesar tu pedido');
      toast.error(error.message || 'Error al procesar el pedido');
    } finally {
      setCargando(false);
    }
  };

  // Mostrar carga mientras se cargan los datos
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
        
        <form onSubmit={handleConfirmar} className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Columna izquierda - Datos de envío y pago */}
          <div className="space-y-6">
            {/* Sección de dirección de envío */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={direccion.nombre}
                  onChange={(e) => setDireccion({...direccion, nombre: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección principal
                </label>
                <input
                  type="text"
                  value={direccion.direccion_principal}
                  onChange={(e) => setDireccion({...direccion, direccion_principal: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección secundaria (opcional)
                </label>
                <input
                  type="text"
                  value={direccion.direccion_secundaria}
                  onChange={(e) => setDireccion({...direccion, direccion_secundaria: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={direccion.ciudad}
                    onChange={(e) => setDireccion({...direccion, ciudad: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                  <input
                    type="text"
                    value={direccion.provincia}
                    onChange={(e) => setDireccion({...direccion, provincia: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={direccion.telefono}
                    onChange={(e) => setDireccion({...direccion, telefono: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={direccion.codigo_postal}
                    onChange={(e) => setDireccion({...direccion, codigo_postal: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Envío
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoEnvio"
                      checked={direccion.tipoEnvio === "domicilio"}
                      onChange={() => setDireccion({...direccion, tipoEnvio: "domicilio"})}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Envío a domicilio (+$3.00)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoEnvio"
                      checked={direccion.tipoEnvio === "retiro"}
                      onChange={() => setDireccion({...direccion, tipoEnvio: "retiro"})}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Recoger en tienda</span>
                  </label>
                </div>
              </div>
              
              {direccion.tipoEnvio === "domicilio" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones adicionales (opcional)
                  </label>
                  <textarea
                    value={direccion.detalle}
                    onChange={(e) => setDireccion({...direccion, detalle: e.target.value})}
                    rows="3"
                    className="w-full p-2 border rounded"
                    placeholder="Ej: Casa blanca con portón negro, timbre a la derecha"
                  ></textarea>
                </div>
              )}
            </div>
            
            {/* Sección de método de pago */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>

                {/* Agregar información de la cuenta bancaria */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Datos para transferencia bancaria</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Banco:</span> Pichincha</p>
                    <p><span className="font-medium">Tipo de cuenta:</span> Ahorros</p>
                    <p><span className="font-medium">Número de cuenta:</span> 2206100668</p>
                    <p><span className="font-medium">Titular:</span> Johan Alexander Burbano España</p>
                    <p><span className="font-medium">C.I.:</span> 0450059960</p>
                  </div>
                  <p className="mt-2 text-sm text-blue-600">
                    Por favor realiza la transferencia y adjunta el comprobante de pago.
                  </p>
                </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTipoPago("completo")}
                    className={`p-4 border rounded-lg text-left cursor-pointer transition-colors ${
                      tipoPago === "completo"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Pago Completo</div>
                    <div className="text-sm text-gray-600">Paga el 100% del total</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipoPago("anticipo")}
                    className={`p-4 border rounded-lg text-left cursor-pointer transition-colors ${
                      tipoPago === "anticipo"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Pago con Anticipo</div>
                    <div className="text-sm text-gray-600">Paga el 50% ahora y el resto después</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Total a pagar ahora: ${tipoPago === "anticipo" ? (total * 0.5).toFixed(2) : total.toFixed(2)}
                    </div>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia de Pago
                </label>
                <input
                  type="text"
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                  placeholder="Ej: Transferencia B. Pichincha #123"
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Indica la referencia de tu transferencia bancaria
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprobante de Pago
                </label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                    <span>Seleccionar archivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {nombreArchivo || "Ningún archivo seleccionado"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sube una imagen del comprobante de transferencia
                </p>
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Resumen del pedido */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {carrito.length > 0 ? (
                  carrito.map((item) => {
                    const precioUnitario = Number(item.precio_unitario) || 0;
                    const cantidad = Number(item.cantidad) || 1;
                    const subtotal = (precioUnitario * cantidad).toFixed(2);
                    
                    return (
                    
                    <div key={item._id || item.productId} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center">
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">{item.nombre}</h3>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.cantidad || 1}
                            {item.talla && ` • Talla: ${item.talla}`}
                
                          </p>
                          <p className="text-sm font-medium">${(item.precio_unitario * (item.cantidad || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No hay productos en el carrito</p>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Envío:</span>
                  <span>${envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Impuestos (12%):</span>
                  <span>${impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t mt-2 pt-3 font-bold">
                  <span>Total:</span>
                  <div className="text-right">
                    <div>${total.toFixed(2)}</div>
                    {tipoPago === "anticipo" && (
                      <div className="text-sm font-normal text-blue-600">
                        Pago inicial (50%): ${(total * 0.5).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando || carrito.length === 0}
                className={`w-full mt-4 py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  cargando || carrito.length === 0
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {cargando ? "Procesando..." : "Confirmar Pedido"}
              </button>

              {msg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {msg}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}