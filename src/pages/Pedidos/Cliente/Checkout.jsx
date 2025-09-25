// src/pages/Pedidos/Cliente/Checkout.jsx
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
    direccion_principal: "",
    direccion_secundaria: "",
    ciudad: "",
    provincia: "",
    pais: "",
    telefono: "",
    codigo_postal: "",
    tipoEnvio: "domicilio", // default domicilio
  });
  const [tipoPago, setTipoPago] = useState("completo"); // completo | anticipo
  const [referenciaPago, setReferenciaPago] = useState("");
  const [guardarDatos, setGuardarDatos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState("");

  // Cargar carrito y perfil del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const cargar = async () => {
      try {
        // carrito
        const resCarrito = await fetch(`${API_URL}/carrito/${user.id}`);
        const dataCarrito = await resCarrito.json();
        if (dataCarrito.ok) setCarrito(dataCarrito.carrito || []);

        // perfil
        const resPerfil = await fetch(`${API_URL}/usuario/perfil/${user.id}`);
        const dataPerfil = await resPerfil.json();
        if (dataPerfil.ok) {
          setDireccion((prev) => ({
            ...prev,
            nombre: `${dataPerfil.usuario.nombre || ""} ${dataPerfil.usuario.apellido || ""}`,
            direccion_principal: dataPerfil.usuario.direccion_principal || "",
            direccion_secundaria: dataPerfil.usuario.direccion_secundaria || "",
            ciudad: dataPerfil.usuario.ciudad || "",
            provincia: dataPerfil.usuario.provincia || "",
            pais: dataPerfil.usuario.pais || "",
            telefono: dataPerfil.usuario.telefono || "",
            codigo_postal: dataPerfil.usuario.codigo_postal || "",
          }));
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
  const envio = direccion.tipoEnvio === "domicilio" ? 3 : 0;
  const impuestos = 0;
  const total = subtotal + envio + impuestos;
  const anticipo = (total * 0.5).toFixed(2);

  // Confirmar pedido
  const handleConfirmar = async () => {
    if (!referenciaPago) {
      setMsg("Por favor ingresa la referencia de la transferencia");
      return;
    }

    // Validar dirección solo si es envío a domicilio
    if (direccion.tipoEnvio === "domicilio") {
      if (
        !direccion.nombre ||
        !direccion.direccion_principal ||
        !direccion.ciudad
      ) {
        setMsg("Completa la dirección de envío");
        return;
      }
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
      direccionEnvio: direccion.tipoEnvio === "domicilio" 
        ? direccion 
        : { tipoEnvio: "retiro", detalle: "Retiro en Tienda" },
      metodoPago: "transferencia",
      tipoPago,
      costos: { subtotal, envio, total, impuestos },
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

        // Guardar dirección si el usuario lo marcó y eligió domicilio
        if (guardarDatos && direccion.tipoEnvio === "domicilio") {
          await fetch(`${API_URL}/usuario/perfil/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              telefono: direccion.telefono,
              direccion_principal: direccion.direccion_principal,
              direccion_secundaria: direccion.direccion_secundaria,
              ciudad: direccion.ciudad,
              provincia: direccion.provincia,
              pais: direccion.pais,
              codigo_postal: direccion.codigo_postal,
            }),
          });
        }

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
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        
        {/* Formulario de envío y pago */}
        <div className="md:col-span-2 space-y-8">

          {/* Método de envío */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Método de Envío</h2>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={direccion.tipoEnvio === "domicilio"}
                onChange={() => setDireccion({ ...direccion, tipoEnvio: "domicilio" })}
              />
              Envío a domicilio (+$3)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={direccion.tipoEnvio === "retiro"}
                onChange={() => setDireccion({ ...direccion, tipoEnvio: "retiro" })}
              />
              Retiro en tienda (Sin costo adicional)
            </label>
          </div>

          {/* Dirección de envío - solo si es domicilio */}
          {direccion.tipoEnvio === "domicilio" && (
            <div className="bg-white rounded-xl shadow p-6">
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
                  placeholder="Dirección Principal"
                  className="px-4 py-2 border rounded col-span-2"
                  value={direccion.direccion_principal}
                  onChange={(e) => setDireccion({ ...direccion, direccion_principal: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Dirección Secundaria"
                  className="px-4 py-2 border rounded col-span-2"
                  value={direccion.direccion_secundaria}
                  onChange={(e) => setDireccion({ ...direccion, direccion_secundaria: e.target.value })}
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
                  onChange={(e) => setDireccion({ ...direccion, provincia: e.target.value })}
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
                  value={direccion.codigo_postal}
                  onChange={(e) => setDireccion({ ...direccion, codigo_postal: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={guardarDatos}
                  onChange={() => setGuardarDatos(!guardarDatos)}
                />
                Guardar esta dirección para futuras compras
              </label>
            </div>
          )}

          {/* Método de Pago */}
          <div className="bg-white rounded-xl shadow p-6">
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
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          <div className="space-y-4">
            {carrito.map((item) => (
              <div key={item._id} className="flex gap-4 border-b pb-4">
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-bold text-blue-900">{item.nombre}</p>
                  <p className="text-sm">Talla: {item.talla} | Color: {item.color?.color}</p>
                  <p className="text-sm">Cantidad: {item.cantidad}</p>
                </div>
                <p className="font-semibold text-blue-900">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-right">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Envío: ${envio.toFixed(2)}</p>
            <p>Impuestos: ${impuestos.toFixed(2)}</p> 
            <p className="font-bold text-lg text-blue-900">
              Total: ${total.toFixed(2)}
            </p>
          </div>

          {msg && (
            <div className="mb-4 text-center font-bold text-blue-900">{msg}</div>
          )}

          <button
            onClick={handleConfirmar}
            className="w-full mt-6 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-700 shadow"
          >
            Confirmar Pedido
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
