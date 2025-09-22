// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { API_URL } from "../../../config";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [direccion, setDireccion] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    pais: "",
    telefono: "",
    zip: "",
  });
  const [tipoPago, setTipoPago] = useState("completo"); // completo | anticipo
  const [referenciaPago, setReferenciaPago] = useState("");
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");

  // Cargar carrito del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/carrito/${user.id}`);
        const data = await res.json();
        if (data.ok) {
          setCarrito(data.carrito || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [user, navigate]);

  // Calcular totales
  const subtotal = carrito.reduce((acc, it) => acc + (it.precio || 0), 0);
  const envio = 0; // opcional
  const impuestos = 0; // opcional
  const total = subtotal + envio + impuestos;

  const anticipo = (total * 0.5).toFixed(2);

  const handleConfirmar = async () => {
    if (!referenciaPago) {
      setMsg("Por favor ingresa la referencia de la transferencia");
      return;
    }
    if (!direccion.nombre || !direccion.direccion || !direccion.ciudad) {
      setMsg("Completa la dirección de envío");
      return;
    }

    const items = carrito.map((it) => ({
      productId: it.productoId,
      nombre: it.nombre,
      cantidad: it.cantidad,
      precioUnitario: it.precio_unitario,
      talla: it.talla,
      color: it.color,
      imagen: it.imagen_url,
    }));

    const payload = {
      items,
      direccionEnvio: direccion,
      metodoPago: "transferencia",
      tipoPago,
      costos: { subtotal, envio, impuestos, total },
      referenciaPago,
    };

    try {
      const res = await fetch(
        `${API_URL}/pedido/confirmar-transferencia/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setMsg("✅ Pedido confirmado con éxito");
        // Vaciar carrito del usuario
        await fetch(`${API_URL}/carrito/vaciar/${user.id}`, { method: "DELETE" });
        setTimeout(() => navigate("/mis-pedidos"), 1500);
      } else {
        setMsg("❌ " + (data.msg || "Error al confirmar pedido"));
      }
    } catch (e) {
      console.error(e);
      setMsg("Error de conexión con el servidor");
    }
  };

  if (cargando) return <div className="p-10">Cargando checkout...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Finalizar Pedido</h1>

        {/* Lista carrito */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Resumen del Carrito</h2>
          {carrito.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {carrito.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-bold text-blue-900">{item.nombre}</p>
                    <p className="text-sm">
                      {item.talla} - {item.color?.color}
                    </p>
                    <p className="text-sm">
                      Cantidad: {item.cantidad} × ${item.precio_unitario}
                    </p>
                  </div>
                  <p className="font-semibold text-blue-900">
                    ${parseFloat(item.precio).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="mt-4 text-right">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Envío: ${envio.toFixed(2)}</p>
                <p>Impuestos: ${impuestos.toFixed(2)}</p>
                <p className="font-bold text-lg text-blue-900">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dirección de envío */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="px-4 py-2 border rounded"
              value={direccion.nombre}
              onChange={(e) => setDireccion({ ...direccion, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="px-4 py-2 border rounded"
              value={direccion.telefono}
              onChange={(e) => setDireccion({ ...direccion, telefono: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dirección"
              className="px-4 py-2 border rounded col-span-2"
              value={direccion.direccion}
              onChange={(e) => setDireccion({ ...direccion, direccion: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="px-4 py-2 border rounded"
              value={direccion.ciudad}
              onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
            />
            <input
              type="text"
              placeholder="Provincia"
              className="px-4 py-2 border rounded"
              value={direccion.provincia}
              onChange={(e) =>
                setDireccion({ ...direccion, provincia: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="País"
              className="px-4 py-2 border rounded"
              value={direccion.pais}
              onChange={(e) => setDireccion({ ...direccion, pais: e.target.value })}
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="px-4 py-2 border rounded"
              value={direccion.zip}
              onChange={(e) => setDireccion({ ...direccion, zip: e.target.value })}
            />
          </div>
        </div>

        {/* Pago */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="completo"
                checked={tipoPago === "completo"}
                onChange={() => setTipoPago("completo")}
              />
              Pago Completo (${total.toFixed(2)})
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="anticipo"
                checked={tipoPago === "anticipo"}
                onChange={() => setTipoPago("anticipo")}
              />
              Anticipo 50% (${anticipo})
            </label>
          </div>

          <div>
            <label className="font-semibold">Referencia de Transferencia</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded mt-2"
              placeholder="Ej: BANCO-123-XYZ"
              value={referenciaPago}
              onChange={(e) => setReferenciaPago(e.target.value)}
            />
          </div>
        </div>

        {msg && (
          <div className="mb-4 text-center font-bold text-blue-900">{msg}</div>
        )}

        <button
          onClick={handleConfirmar}
          className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-700 shadow"
        >
          Confirmar Pedido
        </button>
      </main>
      <Footer />
    </div>
  );
}
