// src/pages/DetallePrd_IA.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";

export default function DetallePrdIA() {
  const { id } = useParams();
  const [prenda, setPrenda] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/ia/prendas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        // inicializar precio unitario y subtotal
        const precioMenor = data.precio_venta || 0;
        const precioMayor = data.precio_mayor || 0;
        const unitario = cantidad >= 12 ? precioMayor : precioMenor;
        setPrecioUnitario(unitario);
        setSubtotal(unitario * cantidad);
      })
      .catch((err) => console.error("Error cargando prenda IA:", err));
  }, [id]);

  useEffect(() => {
    if (!prenda) return;
    const precioMenor = prenda.precio_venta || 0;
    const precioMayor = prenda.precio_mayor || 0;
    const unitario = cantidad >= 12 ? precioMayor : precioMenor;
    setPrecioUnitario(unitario);
    setSubtotal(unitario * cantidad);
  }, [cantidad, prenda]);

  if (!prenda) return <div className="p-6">Cargando prenda generada...</div>;

  const handleAgregarCarrito = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!tallaSeleccionada) {
      setError("Selecciona una talla");
      return;
    }

    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }

    const productoCarrito = {
      userId: user.id,
      productoId: prenda._id,
      tipo: "ia_prenda",              
      nombre: prenda.descripcion || "Prenda IA",
      categoria_nombre: prenda.categoria_prd || "Prenda IA",
      tela_nombre: prenda.atributos_es?.tela || "N/A",
      color: prenda.atributos_es?.color2 
              ? `${prenda.atributos_es.color1}, ${prenda.atributos_es.color2}`
              : prenda.atributos_es?.color1 || "N/A",
      talla: tallaSeleccionada,
      cantidad,
      precio_unitario: parseFloat(precioUnitario.toFixed(2)),
      precio: parseFloat(subtotal.toFixed(2)),
      imagen_url: prenda.imageUrl,
      ficha_id: prenda.ficha_id,
      estado: "pendiente",
    };

    try {
      const res = await fetch(`${API_URL}/carrito/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoCarrito),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Prenda añadida al carrito");
        setCantidad(1);
        setTallaSeleccionada("");
        setError("");
        navigate("/carrito");
      } else {
        alert("Error al añadir al carrito: " + data.msg);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="flex justify-center items-center">
          <img
            src={prenda.imageUrl}
            alt={prenda.descripcion}
            className="w-96 h-auto rounded-xl shadow"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-blue-900">
            {prenda.descripcion}
          </h1>

          <p>
            <strong>Tela:</strong> {prenda.atributos_es?.tela || "N/A"}
          </p>
          <p>
            <strong>Color principal:</strong> {prenda.atributos_es?.color1 || "N/A"}
          </p>
          {prenda.atributos_es?.color2 && (
            <p>
              <strong>Color secundario:</strong> {prenda.atributos_es?.color2}
            </p>
          )}
          <p>
            <strong>Género:</strong> {prenda.atributos_es?.genero || "Unisex"}
          </p>

          {/* Tallas */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selecciona tu talla</h3>
            {["S", "M", "L", "XL"].map((t) => (
              <button
                key={t}
                onClick={() => setTallaSeleccionada(t)}
                className={`px-3 py-2 rounded-lg border mr-2 ${
                  tallaSeleccionada === t
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>


          {/* Cantidad */}
          <div>
            <label className="font-bold text-gray-700">Cantidad:</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              className="w-full bg-white border mt-1 rounded px-3 py-2"
            />
          </div>

          {/* Precios */}
          <div className="flex flex-col gap-3">
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Precio unitario: ${precioUnitario.toFixed(2)}
            </div>
            <div className="bg-blue-900 text-white rounded-lg px-4 py-3 font-bold text-center">
              Subtotal: ${subtotal.toFixed(2)}
            </div>
            <div className="text-gray-600 text-sm text-center">
              <p>
                <strong>Precio al por menor:</strong> ${prenda.precio_venta?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Precio al por mayor (≥ 12):</strong> ${prenda.precio_mayor?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button
            onClick={handleAgregarCarrito}
            className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
