// src/components/Prenda3D/PanelLogosRGB.jsx
import React, { useEffect, useState } from "react";
import { ImagePlus, Upload, Trash2, ArrowUp, ArrowDown, Cloud } from "lucide-react";
import { API_URL } from "../../config";
import * as THREE from "three";
import { useAuth } from "../../components/AuthContext";
import PantallaCarga from "../../components/PantallaCarga";
import { toast } from "react-toastify";

export default function PanelLogosRGB({
  logos,
  selectedElement,
  setSelectedElement,
  moveSelectedElement,
  handleRemoveElement,
  currentElement,
  setCurrentElement,
  updateActiveElement,
  setActiveElement,
  setDecals, // 🔹 Necesario para colocar logos del backend
}) {
  const [logoLoading, setLogoLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const selIsLogo = selectedElement?.type === "logo" && Number.isInteger(selectedElement?.id);
  const selLogo = selIsLogo ? logos[selectedElement.id] : null;
  const degFromRad = (r = 0) => Math.round((r * 180) / Math.PI);
  const radFromDeg = (d = 0) => (d * Math.PI) / 180;

  const [uiScale, setUiScale] = useState(currentElement.scale ?? 0.5);
  useEffect(() => setUiScale(currentElement.scale ?? 0.5), [currentElement.scale]);

  // 🔹 Logos del usuario en Cloudinary
  const [userLogos, setUserLogos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/3d/logos/listar?user_id=${userId}`);
        const data = await res.json();
        if (data?.ok && data?.logos) setUserLogos(data.logos);
      } catch (e) {
        console.error("❌ Error listando logos:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);
  
  const handleDeleteLogo = async (logoId) => {
    if (!window.confirm("¿Deseas eliminar este logo?")) return;
    try {
      const res = await fetch(`${API_URL}/api/3d/logos/eliminar/${logoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setUserLogos((prev) => prev.filter((l) => l._id !== logoId));
        toast.success("Logo eliminado correctamente");
      } else {
        toast.error("No se pudo eliminar el logo");
      }
    } catch (err) {
      console.error("❌ Error eliminando logo:", err);
      toast.error("Error al eliminar el logo");
    }
  };

  const handleUploadNewLogo = async (e) => {

    if (userLogos.length >= 5) {
      alert("Solo puedes subir hasta 5 logos.");
      return;
    }
    
    const f = e.target.files?.[0];
    if (!f || !userId) return;
    setLogoLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("user_id", userId);
  
      const res = await fetch(`${API_URL}/api/3d/logos/subir`, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "No se pudo subir");
  
      // Agregar el nuevo logo a la parrilla
      setUserLogos((prev) => [{ url: data.logo.url, nombre: f.name, _id: data.logo._id }, ...prev]);
      toast.success("Logo subido correctamente");
  
    } catch (err) {
      console.error("❌ Error subiendo logo:", err);
      toast.error("Error al subir el logo");
    } finally {
      setLogoLoading(false);
    }
  };

  // ✅ Aplicar un logo existente a la prenda
  const handleApplyLogo = (logoUrl) => {
    new THREE.TextureLoader().load(logoUrl, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = 2;

      setDecals((ds) => [
        ...ds,
        {
          texture: t,
          url: logoUrl,
          position: [0, 0.8, 0.25],
          rotation: [0, 0, 0],
          scale: 0.45,
          meshIndex: 0,
        },
      ]);

      setActiveElement({ type: "logo", index: logos.length });
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5">
            <PantallaCarga 
              show={logoLoading} 
              message="Subiendo logo, por favor espera..." 
            />
      {/* 📍 Instrucción */}
      <div className="bg-blue-50 text-blue-800 text-sm rounded-lg p-2 border border-blue-200">
        <p>
          👉 Haz <strong>clic en la camiseta</strong> para colocar o mover el logo.
        </p>
      </div>

      {/* 🖼️ Subida de logo nuevo */}
      <div className="flex flex-col gap-2">
        <label className="block font-semibold text-sm text-blue-900 mb-1">
          Subir nuevo logo
        </label>
        <label
          htmlFor="logo-upload"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg cursor-pointer font-semibold transition-all"
        >
          <Upload size={18} /> Seleccionar imagen
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleUploadNewLogo}
          className="hidden"
        />
      </div>

      {/* 📋 Logos del usuario */}
      <div>
        <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
          <Cloud size={18} /> Logos disponibles
        </h4>

        {loading && <p className="text-gray-500 text-sm">Cargando logos...</p>}

        {userLogos.length === 0 && !loading && (
          <p className="text-gray-500 text-sm">Aún no has subido logos.</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-2">
          {userLogos.map((l, i) => (
            <div
              key={i}
              className="relative border rounded-lg p-1 hover:shadow-md cursor-pointer bg-gray-50"
              onClick={() => handleApplyLogo(l.url)}
            >
              <img
                src={l.url}
                alt={l.nombre}
                className="w-full h-20 object-contain rounded"
              />
              <p className="text-xs text-center mt-1 truncate">{l.nombre}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLogo(l._id);
                }}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                title="Eliminar logo"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Escala */}
      <div>
        <label className="block font-semibold text-sm text-blue-900 mb-1">
          Escala: {uiScale.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.50"
          max="2.00"
          step="0.25"
          value={uiScale}
          onChange={(e) => setUiScale(parseFloat(e.target.value))}
          onMouseUp={() => updateActiveElement({ scale: uiScale })}
          onTouchEnd={() => updateActiveElement({ scale: uiScale })}
        />
      </div>

      {/* 🔁 Rotación Z */}
      <div>
        <label className="block font-semibold text-sm text-blue-900 mb-1">
          Rotación Z: {degFromRad(selLogo?.rotation?.[2] ?? 0)}°
        </label>
        <input
          type="range"
          min="-180"
          max="180"
          step="10"
          value={degFromRad(selLogo?.rotation?.[2] ?? 0)}
          disabled={!selIsLogo}
          onChange={(e) => {
            if (!selIsLogo) return;
            const deg = parseInt(e.target.value, 10);
            const z = radFromDeg(deg);
            const x = selLogo?.rotation?.[0] ?? 0;
            const y = selLogo?.rotation?.[1] ?? 0;
            updateActiveElement({ rotation: [x, y, z] });
          }}
          className="w-full"
        />
      </div>

      {/* 📋 Lista de logos aplicados a la prenda */}
      <div className="mt-2">
        <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-1">
          <ImagePlus size={18} /> Logos en la prenda
        </h4>

        {logos.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay logos en la prenda.
          </p>
        )}

        <ul className="flex flex-col gap-2 mt-2">
          {logos.map((l, i) => (
            <li
              key={i}
              className={`flex justify-between items-center px-3 py-2 border rounded-lg transition-all cursor-pointer ${
                selectedElement?.id === i
                  ? "bg-blue-50 border-blue-400"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedElement({ type: "logo", id: i });
                setActiveElement({ type: "logo", index: i });
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={l.url || ""}
                  alt="logo-preview"
                  className="w-10 h-10 object-contain border rounded bg-gray-50"
                />
                <span className="text-sm text-gray-700 truncate max-w-[100px]">
                  {l.url ? l.url.split("/").pop() : "Logo"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSelectedElement("up");
                  }}
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                  title="Mover arriba"
                >
                  <ArrowUp size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSelectedElement("down");
                  }}
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                  title="Mover abajo"
                >
                  <ArrowDown size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveElement(i, "logo");
                  }}
                  className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded"
                  title="Eliminar logo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
