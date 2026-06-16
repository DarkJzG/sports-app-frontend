import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useEmpresa } from "../../../components/EmpresaContext"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";

export default function Checkout() {
  const { user } = useAuth();
  const { empresa } = useEmpresa(); 
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);
  const [direccion, setDireccion] = useState({
    nombre: "",
    direccion_principal: "",
    referencia: "",
    ciudad: "",
    provincia: "",
    pais: "Ecuador",
    telefono: "",
    codigo_postal: "",
    tipoEnvio: "domicilio",
    detalle: ""
  });
  const [tipoPago, setTipoPago] = useState("completo");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [previewImagen, setPreviewImagen] = useState(null);
  const [archivoComprobante, setArchivoComprobante] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Estados de costos
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [total, setTotal] = useState(0);

  // ✅ Obtener configuración de empresa
  const ivaEmpresa = empresa?.configuracion?.iva || 15;
  const costoEnvio = 3.00; // Puedes hacer esto dinámico también si quieres

  // Cargar carrito y perfil del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        // Cargar carrito
        const resCarrito = await fetch(`${API_URL}/carrito/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        const dataCarrito = await resCarrito.json();
        
        if (dataCarrito.ok) {
          const carritoItems = dataCarrito.carrito || [];
          setCarrito(carritoItems);
          
          if (carritoItems.length === 0) {
            toast.info("Tu carrito está vacío");
            navigate("/carrito");
            return;
          }
        }

        // Cargar perfil del usuario
        const resPerfil = await fetch(`${API_URL}/usuario/perfil/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        if (resPerfil.ok) {
          const dataPerfil = await resPerfil.json();
          if (dataPerfil.ok && dataPerfil.usuario) {
            const userName = `${dataPerfil.usuario.nombre || ""} ${dataPerfil.usuario.apellido || ""}`.trim();
            setDireccion(prev => ({ ...prev, nombre: userName }));
          }
        }

        // Cargar direcciones guardadas
        const resDirecciones = await fetch(`${API_URL}/usuario/${user.id}/direcciones`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }); 
        
        const dataDirecciones = await resDirecciones.json();

        if (dataDirecciones.ok) {
          const addresses = dataDirecciones.direcciones || [];
          setDireccionesGuardadas(addresses);

          let defaultAddress = addresses.find(dir => dir.es_predeterminada);
          if (!defaultAddress && addresses.length > 0) {
            defaultAddress = addresses[0]; 
          }
          
          if (defaultAddress) {
            setDireccion(prev => ({
              ...prev,
              direccion_principal: defaultAddress.direccion_principal || "",
              referencia: defaultAddress.referencia || "",
              ciudad: defaultAddress.ciudad || "",
              provincia: defaultAddress.provincia || "",
              pais: defaultAddress.pais || "Ecuador",
              telefono: defaultAddress.telefono || "",
              codigo_postal: defaultAddress.codigo_postal || "",
              detalle: defaultAddress.detalle || ""
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

  // ✅ Calcular totales usando IVA de la empresa
  useEffect(() => {
    if (carrito.length === 0) return;

    // Calcular subtotal
    const sub = carrito.reduce((sum, item) => {
      const precioUnitario = parseFloat(item.precio_unitario) || 0;
      const cantidad = parseInt(item.cantidad) || 1;
      return sum + (precioUnitario * cantidad);
    }, 0);
    
    // Calcular envío
    const envioCalculado = direccion.tipoEnvio === "domicilio" ? costoEnvio : 0;
    
    // ✅ Calcular impuestos usando IVA de la empresa
    const impuestosCalculados = sub * (ivaEmpresa / 100);
    
    // Calcular total
    const totalCalculado = sub + envioCalculado + impuestosCalculados;
    
    setSubtotal(parseFloat(sub.toFixed(2)));
    setEnvio(parseFloat(envioCalculado.toFixed(2)));
    setImpuestos(parseFloat(impuestosCalculados.toFixed(2)));
    setTotal(parseFloat(totalCalculado.toFixed(2)));
  }, [carrito, direccion.tipoEnvio, ivaEmpresa]);

  // Manejar cambio de archivo
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona una imagen válida (PNG, JPG, JPEG)");
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }
    
    // Guardar archivo
    setArchivoComprobante(file);
    setNombreArchivo(file.name);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImagen(reader.result);
    };
    reader.readAsDataURL(file);
    
    toast.success("Imagen cargada correctamente");
  }
};

// Agregar después de handleFileChange:
const handleEliminarImagen = () => {
  setArchivoComprobante(null);
  setNombreArchivo("");
  setPreviewImagen(null);
  
  // Resetear input file
  const fileInput = document.getElementById("comprobante");
  if (fileInput) {
    fileInput.value = "";
  }
  
  toast.info("Imagen eliminada");
};


  // Seleccionar dirección guardada
  const handleSelectDireccion = (dir) => {
    setDireccion(prev => ({
      ...prev,
      direccion_principal: dir.direccion_principal,
      referencia: dir.referencia || "",
      ciudad: dir.ciudad,
      provincia: dir.provincia,
      pais: dir.pais,
      telefono: dir.telefono, 
      codigo_postal: dir.codigo_postal || "",
      detalle: dir.detalle || ""
    }));
  };

  // Manejar envío del formulario
  const handleConfirmar = async (e) => {
    e.preventDefault();
    
    if (procesando) return;
    
    setProcesando(true);
    setMsg("");

    try {
      // ✅ Validaciones

      console.log("🔍 Valores al confirmar:");
      console.log("- archivoComprobante:", archivoComprobante);
      console.log("- previewImagen:", previewImagen);
      console.log("- nombreArchivo:", nombreArchivo);
      console.log("- referenciaPago:", referenciaPago);

      if (!archivoComprobante || !previewImagen) {
        console.log("❌ Falta comprobante");
        toast.error("Por favor, sube el comprobante de pago");
        setProcesando(false);
        return;
      }

      if (!referenciaPago.trim()) {
        console.log("❌ Falta referencia");
        toast.error("Por favor, ingresa una referencia de pago");
        setProcesando(false);
        return;
      }

      console.log("✅ Validaciones completadas");

      // Validar campos de dirección solo si es envío a domicilio
      if (direccion.tipoEnvio === "domicilio") {
        const camposRequeridos = {
          'direccion_principal': 'Dirección principal',
          'referencia': 'Referencia',
          'ciudad': 'Ciudad',
          'provincia': 'Provincia',
          'telefono': 'Teléfono',
          'codigo_postal': 'Código postal',
          
        };

        for (const [campo, nombre] of Object.entries(camposRequeridos)) {
          if (!direccion[campo]?.trim()) {
            console.log(`❌ Falta campo: ${nombre}`);
            toast.error(`Por favor, completa el campo: ${nombre}`);
            setProcesando(false);
            return;
          }
        }
      }

      // ✅ Crear FormData
      const formData = new FormData();
      formData.append("imagen", archivoComprobante);

      // ✅ Calcular montos correctamente
      const montoTotal = parseFloat(total.toFixed(2));
      const montoPago = tipoPago === "anticipo" 
        ? parseFloat((montoTotal * 0.5).toFixed(2))
        : montoTotal;

      console.log("Montos calculados:", {
        subtotal,
        envio,
        impuestos,
        total: montoTotal,
        montoPago,
        tipoPago,
        ivaAplicado: ivaEmpresa
      });

      // ✅ Preparar items del pedido
      const items = carrito.map((item) => ({
        productId: item._id || item.productId,
        tipo: item.tipo || "producto",
        nombre: item.nombre,
        cantidad: parseInt(item.cantidad) || 1,
        precioUnitario: parseFloat(item.precio_unitario) || parseFloat(item.precio) || 0,
        precioTotal: parseFloat(item.precio_total) || (parseFloat(item.precio_unitario) * parseInt(item.cantidad)),
        talla: item.talla || null,
        color: typeof item.color === "string" ? item.color : (item.color?.color || "N/A"),
        imagen: item.imagen_url || item.imagen || "",
        categoria_nombre: item.categoria_nombre || "",
        tela_nombre: item.tela_nombre || "",
        ficha_id: item.ficha_id || null,
        estado: "pendiente"
      }));

      // ✅ Preparar dirección de envío
      const direccionEnvio = direccion.tipoEnvio === "domicilio" ? {
        tipoEnvio: "domicilio",
        nombre: direccion.nombre,
        direccion_principal: direccion.direccion_principal,
        referencia: direccion.referencia || "",
        ciudad: direccion.ciudad,
        provincia: direccion.provincia,
        pais: direccion.pais,
        telefono: direccion.telefono,
        codigo_postal: direccion.codigo_postal || "",
        detalle: direccion.detalle || ""
      } : {
        tipoEnvio: "retiro",
        nombre: direccion.nombre,
        telefono: user.telefono || "",
        detalle: "Retiro en local"
      };

      // ✅ Datos del pedido
      const pedidoData = {
        items,
        direccionEnvio,
        metodoPago: "transferencia",
        tipoPago: tipoPago,
        tipoEntrega: direccion.tipoEnvio,
        referenciaPago: referenciaPago.trim(),
        costos: {
          subtotal: subtotal,
          envio: envio,
          impuestos: impuestos,
          total: montoTotal
        },
        montoPago: montoPago
      };

      console.log("Datos del pedido a enviar:", pedidoData);

      formData.append("data", JSON.stringify(pedidoData));

      // ✅ Enviar al servidor
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

      console.log("Respuesta del servidor:", data);

      if (!response.ok || !data.ok) {
        throw new Error(data.msg || data.message || 'Error al procesar el pedido');
      }
  
      // ✅ Vaciar carrito
      try {
        await fetch(`${API_URL}/carrito/vaciar/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      } catch (error) {
        console.error('Error al vaciar el carrito:', error);
      }

      setArchivoComprobante(null);
      setNombreArchivo("");
      setPreviewImagen(null);
      setReferenciaPago("");
  
      toast.success("¡Pedido creado exitosamente!");
      
      // ✅ Redirigir a mis pedidos
      setTimeout(() => {
        navigate('/mis-pedidos');
      }, 1500);
  
    } catch (error) {
      console.error('Error en handleConfirmar:', error);
      const errorMsg = error.message || 'Ocurrió un error al procesar tu pedido';
      setMsg(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcesando(false);
    }
  };

  // Mostrar loading
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

  // ✅ Obtener datos bancarios de la empresa
  const datosBancarios = empresa?.datosBancarios || {
    banco: "Pichincha",
    tipoCuenta: "Ahorros",
    numeroCuenta: "2206100668",
    titular: "Johan Alexander Burbano España"
  };


  const simboloMoneda = empresa?.configuracion?.simboloMoneda || "$";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
        
        <form onSubmit={handleConfirmar} className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Columna izquierda - Datos de envío y pago */}
          <div className="space-y-6">
            
            {/* 1. SECCIÓN DE ELECCIÓN DE ENVÍO/RETIRO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Opciones de Entrega</h2>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setDireccion(prev => ({...prev, tipoEnvio: "domicilio"}))}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    direccion.tipoEnvio === "domicilio"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-800">Envío a Domicilio</div>
                  <div className="text-sm text-gray-600">
                    Recibe el pedido en tu casa o trabajo (+{simboloMoneda}{envio.toFixed(2)})
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setDireccion(prev => ({...prev, tipoEnvio: "retiro"}))}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    direccion.tipoEnvio === "retiro"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-gray-800">Recoger en Tienda</div>
                  <div className="text-sm text-gray-600">Sin costo de envío. Recogerás en nuestra ubicación.</div>
                </button>
              </div>
            </div>
            
            {/* 2. SECCIÓN CONDICIONAL DE DIRECCIÓN DE ENVÍO */}
            {direccion.tipoEnvio === "domicilio" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Detalles de Envío</h2>

                {/* Selección de direcciones guardadas */}
                {direccionesGuardadas.length > 0 && (
                  <div className="mb-6 border-b pb-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Elige una dirección guardada:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {direccionesGuardadas.map((dir) => (
                        <div
                          key={dir._id}
                          onClick={() => handleSelectDireccion(dir)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                            direccion.direccion_principal === dir.direccion_principal && 
                            direccion.ciudad === dir.ciudad
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {dir.es_predeterminada && (
                            <span className="absolute top-2 right-2 text-xs font-semibold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                              Predet.
                            </span>
                          )}
                          <h4 className="font-semibold">{dir.etiqueta}</h4>
                          <p className="text-sm text-gray-600">{dir.direccion_principal}</p>
                          <p className="text-sm text-gray-600">{dir.ciudad}, {dir.provincia}</p>
                          <p className="text-sm text-gray-600">Tel: {dir.telefono}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Formulario de dirección */}
                <h3 className="font-semibold text-gray-700 mb-4">
                  {direccionesGuardadas.length > 0 ? "O editar la dirección seleccionada:" : "Ingresa tu dirección de envío:"}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={direccion.nombre}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección Principal *
                    </label>
                    <input
                      type="text"
                      value={direccion.direccion_principal}
                      onChange={(e) => setDireccion({...direccion, direccion_principal: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"

                      placeholder="Calle principal, número de casa"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia
                    </label>
                    <input
                      type="text"
                      value={direccion.referencia}
                      onChange={(e) => setDireccion({...direccion, referencia: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Cerca del parque central"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                      <input
                        type="text"
                        value={direccion.ciudad}
                        onChange={(e) => setDireccion({...direccion, ciudad: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"

                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                      <input
                        type="text"
                        value={direccion.provincia}
                        onChange={(e) => setDireccion({...direccion, provincia: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"

                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        value={direccion.telefono}
                        onChange={(e) => setDireccion({...direccion, telefono: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"

                        placeholder="0999999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                      <input
                        type="text"
                        value={direccion.codigo_postal}
                        onChange={(e) => setDireccion({...direccion, codigo_postal: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="170150"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instrucciones adicionales (opcional)
                    </label>
                    <textarea
                      value={direccion.detalle}
                      onChange={(e) => setDireccion({...direccion, detalle: e.target.value})}
                      rows="3"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Casa blanca con portón negro, timbre a la derecha"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
            
            {/* 3. SECCIÓN DE MÉTODO DE PAGO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>

              {/* ✅ Información bancaria dinámica desde empresa */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                  </svg>
                  Datos para transferencia bancaria
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Banco:</span> {datosBancarios.banco}</p>
                  <p><span className="font-medium">Tipo de cuenta:</span> {datosBancarios.tipoCuenta}</p>
                  <p><span className="font-medium">Número de cuenta:</span> {datosBancarios.numeroCuenta}</p>
                  <p><span className="font-medium">Titular:</span> {datosBancarios.titular}</p>
                  {empresa?.ruc && (
                    <p><span className="font-medium">RUC:</span> {empresa.ruc}</p>
                  )}
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded">
                  <p className="text-sm text-blue-800 font-medium">
                    💡 Por favor realiza la transferencia y adjunta el comprobante de pago.
                  </p>
                </div>
              </div>
              
              {/* Tipo de pago */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTipoPago("completo")}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      tipoPago === "completo"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium text-gray-800">Pago Completo</div>
                    <div className="text-sm text-gray-600">Paga el 100% del total</div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      Total: {simboloMoneda}{total.toFixed(2)}
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipoPago("anticipo")}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      tipoPago === "anticipo"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium text-gray-800">Pago con Anticipo</div>
                    <div className="text-sm text-gray-600">Paga el 50% ahora</div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      Anticipo: {simboloMoneda}{(total * 0.5).toFixed(2)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Referencia de pago */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia de Pago *
                </label>
                <input
                  type="text"
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                  placeholder={`Ej: Transferencia ${datosBancarios.banco} #123456`}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"

                />
                <p className="text-xs text-gray-500 mt-1">
                  Indica el número de referencia o voucher de tu transferencia
                </p>
              </div>

              {/* Comprobante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprobante de Pago *
                </label>
                
                {!previewImagen ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="comprobante"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="comprobante"
                      className="flex flex-col items-center cursor-pointer"
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
                      <span className="font-medium text-blue-600">
                        Haz clic para seleccionar una imagen
                      </span>
                      <span className="text-gray-500 text-sm mt-1">
                        PNG, JPG o JPEG (máx. 5MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <img
                          src={previewImagen}
                          alt="Preview comprobante"
                          className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                        />
                        {/* Overlay para ver imagen completa */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-md flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => window.open(previewImagen, '_blank')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium"
                          >
                            Ver completa
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Comprobante seleccionado
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {archivoComprobante?.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Tamaño: {(archivoComprobante?.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Listo
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleEliminarImagen}
                          className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar imagen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2 flex items-start">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    Asegúrate de que la imagen sea clara y legible. Debe mostrar claramente el comprobante de transferencia con todos los detalles visibles.
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Resumen del pedido */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              {/* Items del carrito */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {carrito.map((item) => {
                  const tallaEstandar = ["S", "M", "L", "XL", "XXL"];
                  const precioTotal = (parseFloat(item.precio_unitario) || 0) * (parseInt(item.cantidad) || 1);
                  
                  return (
                    <div key={item._id || item.productId} className="flex gap-3 border-b pb-3">
                      <img
                        src={item.imagen_url || item.imagen}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.nombre}</h3>
                        <p className="text-xs text-gray-600">
                          Cantidad: {item.cantidad}
                          {item.talla && ` • Talla: ${
                            item.talla.toLowerCase().includes("taller")
                              ? "Medidas en taller"
                              : tallaEstandar.some(s => s.toLowerCase() === item.talla.toLowerCase())
                              ? item.talla
                              : "Personalizada"
                          }`}
                        </p>
                        <p className="text-sm font-semibold mt-1">{simboloMoneda}{precioTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ✅ Totales con IVA dinámico */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{simboloMoneda}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Envío ({direccion.tipoEnvio === "retiro" ? "Retiro en tienda" : "A domicilio"}):
                  </span>
                  <span className="font-medium">{simboloMoneda}{envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA ({ivaEmpresa}%):</span>
                  <span className="font-medium">{simboloMoneda}{impuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t mt-2 pt-3">
                  <span className="font-bold text-lg">Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg">{simboloMoneda}{total.toFixed(2)}</div>
                    {tipoPago === "anticipo" && (
                      <div className="text-sm text-blue-600 font-medium">
                        Pago inicial (50%): {simboloMoneda}{(total * 0.5).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de confirmar */}
              <button
                type="submit"
                disabled={procesando || carrito.length === 0}
                className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  procesando || carrito.length === 0
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {procesando ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar Pedido"
                )}
              </button>

              {msg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {msg}
                </div>
              )}

              {/* Información adicional */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p className="font-medium mb-1">📝 Nota importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tu pedido será revisado en 24-48 horas</li>
                  <li>Recibirás confirmación por correo</li>
                  <li>El tiempo de producción es de 3-7 días hábiles</li>
                  {direccion.tipoEnvio === "retiro" && (
                    <li className="font-medium text-blue-600">
                      Recoge tu pedido en: {empresa?.direccion || "Nuestra tienda"}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}
