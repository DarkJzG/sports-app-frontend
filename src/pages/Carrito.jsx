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
        if (data.ok) {
          setCarrito(data.carrito || []);
        } else {
          setError("No se pudo obtener el carrito");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión");
      } finally {
        setCargando(false);
      }
    };

    cargarCarrito();
  }, [user, navigate]);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio, 0).toFixed(2);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) return;
    try {
      const res = await fetch(`${API_URL}/carrito/delete/${id}`, {
        method: "DELETE",
      });
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

                console.log("ID del item:", item._id);

                return (
                  <div
                    key={item._id}
                  className="border rounded-lg p-4 flex gap-4 items-center bg-white shadow"
                >
                <img
                    src={item.imageUrl}
                    alt={item.nombre}
                    className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                    <p className="font-bold text-blue-900 hover:underline cursor-pointer"
                    onClick={() => {
                      const id = typeof item._id === "object" && item._id.$oid 
                      ? item._id.$oid 
                      : item._id?.toString();
                      navigate(`/carrito/detalle/${id}`)
                    }}
                    >
                    {item.nombre}
                    </p>
                    <p>Talla: {item.talla} | Color: {item.color}</p>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>Subtotal: ${parseFloat(item.precio).toFixed(2)}</p>
                </div>
                  <button
                    onClick={() => eliminarProducto(item._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              )

          
            })}
            </div>

            <div className="mt-8 text-right">
              <h2 className="text-xl font-semibold">Total: ${calcularTotal()}</h2>
              <button
                onClick={() => navigate("/transferencia")}
                className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                Realizar Transferencia
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
