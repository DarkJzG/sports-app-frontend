// src/pages/Carrito.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_URL } from "../config";

export default function Carrito() {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const cargarCarrito = async () => {
      try {
        const res = await fetch(`${API_URL}/carrito/${user.id}`);
        const data = await res.json();
        console.log('Datos del carrito recibidos:', JSON.parse(JSON.stringify(data.carrito))); // <-- AQUÍ
        
        if (data.ok) {
          const carritoValidado = data.carrito.map(item => {
            console.log('Procesando ítem:', { 
              id: item._id, 
              precio_unitario_original: item.precio_unitario, 
              cantidad_original: item.cantidad,
              tipo_precio: typeof item.precio_unitario,
              tipo_cantidad: typeof item.cantidad
            });
            
            return {
              ...item,
              precio_unitario: Number(item.precio_unitario) || 0,
              cantidad: Math.max(1, Math.floor(Number(item.cantidad) || 1)),
              precio: (Number(item.precio_unitario) || 0) * Math.max(1, Math.floor(Number(item.cantidad) || 1))
            };
          });
          
          console.log('Carrito validado:', JSON.parse(JSON.stringify(carritoValidado)));
          setCarrito(carritoValidado);
        } else {
          setError("No se pudo obtener el carrito");
        }
      } catch (err) {
        console.error('Error al cargar el carrito:', err);
        setError("Error de conexión");
      } finally {
        setCargando(false);
      }
    };

    cargarCarrito();
    
  }, [user, navigate]);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = Number(item.precio_unitario || 0);
      const cantidad = Number(item.cantidad || 0);
      return total + (precio * cantidad);
    }, 0).toFixed(2);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;
    try {
      const res = await fetch(`${API_URL}/carrito/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setCarrito(carrito.filter(p => p._id !== id));
      } else {
        alert("Error al eliminar producto");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  if (cargando) return <div className="p-10">Cargando carrito...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Tu Carrito</h1>

        {error && <p className="text-red-600">{error}</p>}

        {carrito.length === 0 ? (
          <p className="text-gray-600">El carrito está vacío</p>
        ) : (
          <>
            <div className="space-y-4">
              {carrito.map((item) => {
                const id = typeof item._id === "object" && item._id.$oid 
                  ? item._id.$oid 
                  : item._id?.toString();

                return (
                  <div key={id} className="border rounded-lg p-4 flex gap-4 items-center bg-white shadow">
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p
                        className="font-bold text-blue-900 hover:underline cursor-pointer"
                        onClick={() => navigate(`/carrito/detalle/${id}`)}
                      >
                        {item.nombre}
                      </p>
                      <p><b>Categoría:</b> {item.categoria_nombre}</p>
                      <p><b>Tela:</b> {item.tela_nombre}</p>
                      <p><b>Color:</b> {item.color}</p>
                      <p><b>Talla:</b> {item.talla}</p>
                      <p><b>Cantidad:</b> {item.cantidad}</p>
                      <p><b>Precio Unitario:</b> ${parseFloat(item.precio_unitario || 0).toFixed(2)}</p>
                      <p className="text-blue-900 font-semibold">
                        Subtotal: ${(Number(item.precio_unitario || 0) * Number(item.cantidad || 1)).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarProducto(id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-right">
              <h2 className="text-xl font-semibold">Total: ${calcularTotal()}</h2>
              
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Completar el Pago
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
