import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

export default function DetallePrd3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/3d/prenda/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando prenda 3D:", err);
        toast.error("No se pudo cargar la prenda 3D");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-center">Cargando prenda...</div>;
  if (!prenda) return <div className="p-6 text-center">No se encontró la prenda.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen principal */}
        <div className="flex justify-center items-center">
          <img
            src={prenda.renders?.render_frente || prenda.renders?.render_espalda || prenda.renders?.render_lado_izq || prenda.renders?.render_lado_der}
            alt={prenda.modelo}
            className="rounded-xl shadow-xl w-96 h-auto"
          />
        </div>

        {/* Información */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-blue-900">{prenda.modelo}</h1>
          <p className="text-gray-700 capitalize">
            <strong>Categoría:</strong> {prenda.categoria}
          </p>
          <p>
            <strong>Diseño base:</strong> {prenda.design_id}
          </p>

          <h3 className="mt-3 font-semibold text-blue-700">🎨 Colores aplicados</h3>
          <ul className="list-disc list-inside">
            {Object.entries(prenda.colors || {}).map(([zona, color]) => (
              <li key={zona}>
                <strong>{zona}:</strong> <span style={{ color }}>{color}</span>
              </li>
            ))}
          </ul>

          {Object.keys(prenda.textures || {}).length > 0 && (
            <>
              <h3 className="mt-3 font-semibold text-blue-700">🧵 Texturas</h3>
              <ul className="list-disc list-inside">
                {Object.entries(prenda.textures).map(([zona, tex]) => (
                  <li key={zona}>
                    <strong>{zona}:</strong>{" "}
                    <a href={tex} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      Ver textura
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {Array.isArray(prenda.decals) && prenda.decals.length > 0 && (
            <>
              <h3 className="mt-3 font-semibold text-blue-700">🏷️ Logos</h3>
              <div className="grid grid-cols-2 gap-2">
                {prenda.decals.map((d, i) => (
                  <img
                    key={i}
                    src={d.url}
                    alt={`logo-${i}`}
                    className="w-16 h-16 object-contain rounded-md border shadow"
                  />
                ))}
              </div>
            </>
          )}

          {Array.isArray(prenda.textDecals) && prenda.textDecals.length > 0 && (
            <>
              <h3 className="mt-3 font-semibold text-blue-700">🖋️ Textos agregados</h3>
              <ul className="list-disc list-inside">
                {prenda.textDecals.map((t, i) => (
                  <li key={i}>
                    <strong>{t.text}</strong> ({t.fontFamily}, {t.fill})
                  </li>
                ))}
              </ul>
            </>
          )}

          {prenda.ficha_pdf_url && (
            <a
              href={prenda.ficha_pdf_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 bg-blue-900 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              📄 Ver Ficha Técnica
            </a>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
