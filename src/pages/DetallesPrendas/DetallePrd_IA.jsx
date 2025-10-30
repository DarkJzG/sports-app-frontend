// src/pages/DetallePrd_IA.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetallePrdIA() {
  const { id } = useParams();
  const [prenda, setPrenda] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [tipoTalla, setTipoTalla] = useState("general");
  const [medidasPersonalizadas, setMedidasPersonalizadas] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 Cargar prenda IA
  useEffect(() => {
    fetch(`${API_URL}/api/ia/prendas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        const precioMenor = data.costo?.precio_venta || 0;
        const precioMayor = data.costo?.precio_mayor || 0;
        const unitario = cantidad >= 12 ? precioMayor : precioMenor;
        setPrecioUnitario(unitario);
        setSubtotal(unitario * cantidad);
      })
      .catch((err) => console.error("Error cargando prenda IA:", err));
  }, [id]);

  // 🔹 Actualizar precio según cantidad
  useEffect(() => {
    if (!prenda) return;
    const precioMenor = prenda.costo?.precio_venta || 0;
    const precioMayor = prenda.costo?.precio_mayor || 0;
    const unitario = cantidad >= 12 ? precioMayor : precioMenor;
    setPrecioUnitario(unitario);
    setSubtotal(unitario * cantidad);
  }, [cantidad, prenda]);

  if (!prenda) return <div className="p-6">Cargando prenda generada...</div>;

  // 🔹 Determinar colores con distintas estructuras posibles
  const getColoresTexto = () => {
    const atr = prenda.atributos_es || {};
    const lista = [];

    // Caso 1: array o string en "colores"
    if (Array.isArray(atr.colores)) {
      lista.push(...atr.colores.filter(Boolean));
    } else if (typeof atr.colores === "string" && atr.colores.trim() !== "") {
      lista.push(atr.colores.trim());
    }

    // Caso 2: propiedades individuales
    if (atr.color1) lista.push(atr.color1);
    if (atr.color2) lista.push(atr.color2);
    if (atr.colorBase) lista.push(atr.colorBase);
    if (atr.colorCuello) lista.push(`Cuello: ${atr.colorCuello}`);
    if (atr.colorMangas) lista.push(`Mangas: ${atr.colorMangas}`);

    return lista.length ? [...new Set(lista)].join(", ") : "No especificado";
  };

  // 🔹 Acción al agregar al carrito
  const handleAgregarCarrito = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (tipoTalla === "general" && !tallaSeleccionada) {
      setError("Selecciona una talla estándar");
      return;
    }
    if (tipoTalla === "personalizada" && !medidasPersonalizadas.trim()) {
      setError("Especifica tus medidas o elige una opción personalizada");
      return;
    }
    if (cantidad <= 0) {
      setError("La cantidad debe ser al menos 1");
      return;
    }

    const tallaFinal =
      tipoTalla === "general"
        ? tallaSeleccionada
        : `Talla personalizada: ${medidasPersonalizadas}`;

    const productoCarrito = {
      userId: user.id,
      productoId: prenda._id,
      tipo: "ia_prenda",
      nombre: prenda.descripcion || "Prenda IA",
      categoria_nombre: prenda.categoria_prd || "Prenda IA",
      tela_nombre: prenda.atributos_es?.tela || "N/A",
      color: getColoresTexto(),
      talla: tallaFinal,
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
        toast.success("✅ Prenda añadida al carrito correctamente", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => navigate("/carrito"), 2800);
        setCantidad(1);
        setTallaSeleccionada("");
        setMedidasPersonalizadas("");
        setError("");
      } else {
        toast.error("❌ Error al añadir al carrito: " + (data.msg || ""), {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("❌ Error de conexión con el servidor", {
        position: "top-center",
      });
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
            <strong>Colores:</strong> {getColoresTexto()}
          </p>
          <p>
            <strong>Género:</strong> {prenda.atributos_es?.genero || "Unisex"}
          </p>

          {/* 🔹 Selección tipo de talla */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selecciona el tipo de talla</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoTalla"
                  value="general"
                  checked={tipoTalla === "general"}
                  onChange={() => setTipoTalla("general")}
                />
                Tallas Generales
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoTalla"
                  value="personalizada"
                  checked={tipoTalla === "personalizada"}
                  onChange={() => setTipoTalla("personalizada")}
                />
                Talla Personal
              </label>
            </div>
          </div>

          {/* 🔹 Tallas generales */}
          {tipoTalla === "general" && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Selecciona tu talla</h3>
              {["S", "M", "L", "XL", "XXL"].map((t) => (
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
          )}

          {/* 🔹 Talla personalizada */}
          {tipoTalla === "personalizada" && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Talla Personal</h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  {medidasPersonalizadas.includes("taller")
                    ? "Acercarse al taller"
                    : "Ingresar medidas manualmente"}
                </span>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    name="tallerToggle"
                    id="tallerToggle"
                    checked={medidasPersonalizadas.includes("taller")}
                    onChange={() => {
                      if (medidasPersonalizadas.includes("taller")) {
                        setMedidasPersonalizadas("");
                      } else {
                        setMedidasPersonalizadas(
                          "Acercarse al taller para tomarse las medidas"
                        );
                      }
                    }}
                    className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="tallerToggle"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      medidasPersonalizadas.includes("taller")
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  ></label>
                </div>
              </div>

              {!medidasPersonalizadas.includes("taller") && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ingresa tus medidas manualmente:
                  </p>
                  <textarea
                    placeholder="Ejemplo: Pecho 100cm, Cintura 85cm, Largo 70cm..."
                    value={medidasPersonalizadas}
                    onChange={(e) => setMedidasPersonalizadas(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              )}
            </div>
          )}

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
                <strong>Precio al por menor:</strong>{" "}
                ${prenda.costo?.precio_venta?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Precio al por mayor (≥ 12):</strong>{" "}
                ${prenda.costo?.precio_mayor?.toFixed(2) || "0.00"}
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
