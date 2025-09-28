// src/pages/Pedidos/Cliente/MisPedidos.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

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



export default function MisPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [msg, setMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState(0);
  const [referenciaPago, setReferenciaPago] = useState('');
  const [imagenComprobante, setImagenComprobante] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState('');

  // Estado para completar pago
  const [pagoPedidoId, setPagoPedidoId] = useState(null);


  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cargarPedidos = async () => {
      try {
        const res = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (data.ok) {
          setPedidos(data.pedidos);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        toast.error('Error al cargar los pedidos');
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, [user, navigate]);



  const handleSubmitPago = async (e) => {
    e.preventDefault();

    
    if (!montoPago || !referenciaPago || !imagenComprobante) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (montoPago > pedidoSeleccionado?.saldoPendiente) {
      toast.error('El monto no puede ser mayor al saldo pendiente');
      return;
    }

    if (imagenComprobante.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }
  
    const formData = new FormData();
    formData.append('imagen', imagenComprobante);
    formData.append('data', JSON.stringify({
      monto: parseFloat(montoPago),
      referencia: referenciaPago,
      nota: `Pago registrado el ${new Date().toLocaleDateString()}`,
    }));

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_URL}/pedido/${pedidoSeleccionado._id}/pago`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${user.token}`},
        body: formData
      });


  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Error al procesar el pago');
      }
  
      toast.success('Pago registrado exitosamente');
      setShowPagoModal(false);
      
      // Recargar los pedidos
      const resPedidos = await fetch(`${API_URL}/pedido/mis-pedidos/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}` 
        }
      });
      
      const dataPedidos = await resPedidos.json();
      if (dataPedidos.ok) {
        setPedidos(dataPedidos.pedidos);
      }
  
      // Limpiar el formulario
      setMontoPago(0);
      setReferenciaPago('');
      setImagenComprobante(null);
      setNombreArchivo('');
  
    } catch (error) {
      console.error('Error al registrar pago:', error);
      toast.error(error.message || 'Error al procesar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cargando) return <div className="p-10">Cargando pedidos...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-gray-600">Aún no has realizado pedidos.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Pedido #{pedido._id.slice(-6).toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pedido.estado === 'pagado_total' ? 'bg-green-100 text-green-800' :
                      pedido.estado === 'pagado_parcial' ? 'bg-blue-100 text-blue-800' :
                      pedido.estado === 'pendiente_pago' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pedido.estado.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <Link 
                      to={`/mis-pedidos/${pedido._id}`}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-sm font-medium transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Fecha:</span> {formatDate(pedido.createdAt)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Total:</span> {formatCurrency(pedido.costos.total)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Pagado:</span> {formatCurrency(pedido.montoPagado || 0)}
                    </p>
                    {pedido.saldoPendiente > 0 && (
                      <p className="text-red-600 font-semibold">
                        Saldo pendiente: {formatCurrency(pedido.saldoPendiente)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Método de pago:</p>
                    <p className="capitalize">{pedido.metodoPago}</p>
                    {pedido.referenciaPago && (
                      <p className="text-sm text-gray-600">
                        Ref: {pedido.referenciaPago}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón de pago si hay saldo pendiente */}
                {pedido.saldoPendiente > 0 && (
                  <button
                    onClick={() => {
                      setPedidoSeleccionado(pedido);
                      setMontoPago(pedido.saldoPendiente);
                      setShowPagoModal(true);
                    }}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Pagar saldo pendiente
                  </button>
                )}

                {/* Modal de pago */}
                {showPagoModal && pedidoSeleccionado?._id === pedido._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-bold mb-4">Registrar pago</h3>
                      
                      <form onSubmit={handleSubmitPago}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto a pagar
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={pedidoSeleccionado?.saldoPendiente}
                            value={montoPago}
                            onChange={(e) => setMontoPago(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Saldo pendiente: {formatCurrency(pedidoSeleccionado?.saldoPendiente || 0)}
                          </p>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Referencia de pago
                          </label>
                          <input
                            type="text"
                            value={referenciaPago}
                            onChange={(e) => setReferenciaPago(e.target.value)}
                            placeholder="Ej: TRANSF-123"
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comprobante de pago
                          </label>
                          <div className="flex items-center">
                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                              {nombreArchivo || 'Seleccionar archivo'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setImagenComprobante(file);
                                    setNombreArchivo(file.name);
                                  }
                                }}
                                required
                              />
                            </label>
                            {nombreArchivo && (
                              <span className="ml-2 text-sm text-gray-600">
                                {nombreArchivo}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPagoModal(false);
                              setPedidoSeleccionado(null);
                              setMontoPago(0);
                              setReferenciaPago('');
                              setImagenComprobante(null);
                              setNombreArchivo('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isSubmitting ? 'Procesando...' : 'Registrar pago'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Detalles del pedido */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold mb-2">Productos:</h3>
                  <div className="space-y-3">
                    {pedido.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          {item.imagen && (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="w-16 h-16 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.nombre}</p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.cantidad} • {formatCurrency(item.precioUnitario)} c/u
                              {item.talla && ` • Talla: ${item.talla}`}

                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(item.precioUnitario * item.cantidad)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historial de pagos */}
                {pedido.pagos && pedido.pagos.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Historial de pagos:</h3>
                    <div className="space-y-2">
                      {pedido.pagos.map((pago, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded border">
                          <div className="flex justify-between">
                            <span className="font-medium">{formatCurrency(pago.monto)}</span>
                            <span className="text-sm text-gray-500">
                              {formatDate(pago.fecha)}
                            </span>
                          </div>
                          {pago.referencia && (
                            <p className="text-sm text-gray-600 mt-1">
                              Referencia: {pago.referencia}
                            </p>
                          )}
                          {pago.nota && (
                            <p className="text-sm text-gray-600 mt-1">Nota: {pago.nota}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal completar pago */}
        {pagoPedidoId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl shadow w-96">
              <h2 className="text-lg font-bold mb-4 text-blue-900">
                Completar Pago
              </h2>
              <label className="block text-sm font-semibold">Monto</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 mb-3"
                value={montoPago}
                onChange={(e) => setMontoPago(parseFloat(e.target.value))}
              />
              <label className="block text-sm font-semibold">
                Referencia de Transferencia
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-3"
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
                placeholder="Ej: BANCO-123-XYZ"
              />
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprobante de Transferencia
                </label>
                <div className="flex items-center">
                  <label className="cursor-pointer bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    {nombreArchivo || 'Seleccionar archivo'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImagenComprobante(file);
                          setNombreArchivo(file.name);
                        }
                      }}
                    />
                  </label>
                  {nombreArchivo && (
                    <button 
                      type="button"
                      onClick={() => {
                        setImagenComprobante(null);
                        setNombreArchivo("");
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Eliminar archivo"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sube una imagen del comprobante de transferencia (JPG, PNG, etc.)
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPagoPedidoId(null)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitPago}
                  className="px-4 py-2 rounded bg-blue-900 text-white font-bold"
                >
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {msg && <div className="mt-6 text-center text-blue-900 font-bold">{msg}</div>}
      </main>
      <Footer />
    </div>
  );
}
