import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Html, Decal, useGLTF, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { API_URL } from "../../config";
import { useAuth } from "../../components/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PantallaCarga from "../../components/PantallaCarga";
import NavPanelesRGB from "../../components/Prenda3D/NavPanelesRGB";
import PanelColoresRGB from "../../components/Prenda3D/PanelColoresRGB";
import PanelTexturasRGB from "../../components/Prenda3D/PanelTexturasRGB";
import PanelTextoRGB from "../../components/Prenda3D/PanelTextoRGB";
import PanelLogosRGB from "../../components/Prenda3D/PanelLogosRGB";
import PanelEstilosRGB from "../../components/Prenda3D/PanelEstilosRGB";
import { useChannelMaskTexture } from "../../components/useChannelMaskTexture";

/* ========= Configuración de catálogos ========= */
const CATALOG = {
  camiseta: {
    glb: "/prendas3d/camiseta.glb",
    estilos: {
      base: {
        nombre_estilo: "Base",
        mascara: "/prendas3d/mask_base_rgb.png",
        zonas: {
          neck: { label: "Cuello", channel: "R", default: "#ffffff" },
          sleeves: { label: "Mangas", channel: "G", default: "#7a2f9a" },
          torso: { label: "Torso", channel: "B", default: "#1c9d70" },
        },
      },
      rayo: {
        nombre_estilo: "Rayo",
        mascara: "/prendas3d/rayo_rgb.png",
        zonas: {
          torso: { label: "Torso", channel: "R", default: "#d32f2f" },
          stripe: { label: "Franja", channel: "G", default: "#21c521" },
          neck: { label: "Cuello", channel: "B", default: "#0d47a1" },
        },
      },
    },
  },
};

/* ========= 3D Scene ========= */
function Scene({ product, design, colors, textures, decals, textDecals, setDecals, setTextDecals, activeElement, setActiveElement }) {
  const gltf = useGLTF(product.glb);

  const zonesSpec = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(design.zonas).map(([k, z]) => [
          k,
          { channel: z.channel, color: colors[k], textureUrl: textures[k] },
        ])
      ),
    [design, colors, textures]
  );

  const colorMap = useChannelMaskTexture(design.mascara, zonesSpec);

  const [meshes, setMeshes] = useState([]);
  useEffect(() => {
    if (!gltf?.scene) return;
    const list = [];
    gltf.scene.traverse((o) => {
      if (o.isMesh)
        list.push({
          geometry: o.geometry,
          position: o.position.clone(),
          rotation: o.rotation.clone(),
          scale: o.scale.clone(),
        });
    });
    setMeshes(list);
  }, [gltf]);

  const toDecalScale = (s, t = 2) => (Array.isArray(s) ? s : [s, s, t]);

  return (
    <group>
      {meshes.map((m, i) => (
        <mesh key={i} geometry={m.geometry} position={m.position} rotation={m.rotation} scale={m.scale}>
          <meshStandardMaterial color="white" roughness={0.7} metalness={0.1} map={colorMap || null} />
          {decals
            .filter((d) => d.texture && d.meshIndex === i)
            .map((d, k) => (
              <Decal
                key={`logo-${k}`}
                position={d.position}
                rotation={d.rotation}
                scale={toDecalScale(d.scale)}
                map={d.texture}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
              />
            ))}
        </mesh>
      ))}
      <Environment preset="studio" />
    </group>
  );
}

/* ========= Editor principal ========= */
export default function EditarPrendas3D() {
  const { state } = useLocation();
  const prendaId = state?.prendaId;
  const { user } = useAuth();
  const navigate = useNavigate();
  const glRef = useRef();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [productId, setProductId] = useState("camiseta");
  const [designId, setDesignId] = useState("base");
  const [colors, setColors] = useState({});
  const [textures, setTextures] = useState({});
  const [decals, setDecals] = useState([]);
  const [textDecals, setTextDecals] = useState([]);
  const [activeElement, setActiveElement] = useState(null);
  const [activeSection, setActiveSection] = useState("colores");
  const [dpr, setDpr] = useState(1.5);

  /* 🔹 Cargar prenda seleccionada */
  useEffect(() => {
    if (!prendaId) {
      toast.error("No se encontró el ID de la prenda para editar");
      navigate("/modelo3d/listar-prendas3d");
      return;
    }
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/3d/prenda/${prendaId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al cargar la prenda");
        setDesignId(data.design_id);
        setColors(data.colors || {});
        setTextures(data.textures || {});
        setDecals(data.decals || []);
        setTextDecals(data.textDecals || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la prenda 3D");
        setLoading(false);
      }
    };
    loadData();
  }, [prendaId, navigate]);

  /* 🔹 Guardar cambios actualizados */
  const handleActualizarDiseno = async () => {
    if (!user) return toast.error("Debes iniciar sesión");

    setSaving(true);
    try {
      const gl = glRef.current;
      const dataURL = gl.domElement.toDataURL("image/png");
      const blob = await (await fetch(dataURL)).blob();
      const formData = new FormData();
      formData.append("file", blob, "render_actualizado.png");
      formData.append("user_id", user.id);
      formData.append("categoria", productId);
      formData.append("modelo", `CA-${Date.now()}`);
      formData.append("design_id", designId);
      formData.append("colors", JSON.stringify(colors));
      formData.append("textures", JSON.stringify(textures));
      formData.append("decals", JSON.stringify(decals));
      formData.append("textDecals", JSON.stringify(textDecals));

      const res = await fetch(`${API_URL}/api/3d/prenda/guardar`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Diseño actualizado correctamente 🎨");
        navigate("/modelo3d/listar-prendas3d");
      } else {
        toast.error("Error al actualizar el diseño");
        console.warn(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error guardando los cambios");
    } finally {
      setSaving(false);
    }
  };

  const product = CATALOG[productId];
  const design = product.estilos[designId];

  /* 🔹 Render lateral de paneles */
  const renderPanel = () => {
    switch (activeSection) {
      case "estilos":
        return <PanelEstilosRGB designs={product.estilos} designId={designId} onPick={setDesignId} />;
      case "colores":
        return <PanelColoresRGB designZones={design.zonas} colors={colors} setColors={setColors} />;
      case "logos":
        return <PanelLogosRGB logos={decals} handleLogoUpload={() => {}} />;
      case "texturas":
        return <PanelTexturasRGB designZones={design.zonas} colors={colors} setColors={setColors} setTextures={setTextures} />;
      case "texto":
        return <PanelTextoRGB texts={textDecals} />;
      default:
        return null;
    }
  };

  if (loading) return <PantallaCarga show={true} message="Cargando prenda 3D..." />;

  return (
    <div className="flex h-[90vh] bg-gray-100">
      {/* Menú lateral */}
      <div className="p-4">
        <NavPanelesRGB
          items={[
            { id: "estilos", label: "Estilos" },
            { id: "colores", label: "Colores" },
            { id: "logos", label: "Logos" },
            { id: "texto", label: "Texto" },
            { id: "texturas", label: "Texturas" },
          ]}
          activeId={activeSection}
          onChange={setActiveSection}
        />
      </div>

      {/* Panel central */}
      <div className="w-[560px] p-4 overflow-y-auto bg-white rounded-lg shadow-md">{renderPanel()}</div>

      {/* Canvas derecha */}
      <div className="flex-1 bg-white rounded-lg shadow-lg relative">
        <PantallaCarga show={saving} message="Guardando cambios..." />
        <Canvas
          dpr={dpr}
          gl={{ antialias: true }}
          camera={{ position: [0, 5, 2], fov: 70 }}
          onCreated={({ gl }) => (glRef.current = gl)}
        >
          <Suspense fallback={<Html><span style={{ color: "#fff" }}>Cargando...</span></Html>}>
            <Scene
              product={product}
              design={design}
              colors={colors}
              textures={textures}
              decals={decals}
              textDecals={textDecals}
              setDecals={setDecals}
              setTextDecals={setTextDecals}
              activeElement={activeElement}
              setActiveElement={setActiveElement}
            />
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
            <OrbitControls enablePan={false} />
          </Suspense>
        </Canvas>

        <button
          onClick={handleActualizarDiseno}
          disabled={saving}
          className="absolute bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md font-semibold"
        >
          💾 Guardar Cambios
        </button>
      </div>
    </div>
  );
}

useGLTF.preload("/prendas3d/camiseta.glb");
