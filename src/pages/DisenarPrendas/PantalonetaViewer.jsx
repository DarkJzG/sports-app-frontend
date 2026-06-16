import React, { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Decal, useGLTF } from "@react-three/drei";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { useAuth } from "../../components/AuthContext";
import PantallaCarga from "../../components/PantallaCarga";
import { useNavigate } from "react-router-dom";
import { Palette, Type, Image, Layers, Sparkles, Save } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PanelColoresRGB from "../../components/Prenda3D/PanelColoresRGB";
import PanelTexturasRGB from "../../components/Prenda3D/PanelTexturasRGB";
import PanelTextoRGB from "../../components/Prenda3D/PanelTextoRGB";
import PanelLogosRGB from "../../components/Prenda3D/PanelLogosRGB";
import NavPanelesRGB from "../../components/Prenda3D/NavPanelesRGB";
import PanelEstilosRGB from "../../components/Prenda3D/PanelEstilosRGB";
import { useChannelMaskTexture } from "../../components/useChannelMaskTexture";
import { PerformanceMonitor } from "@react-three/drei";
import { Matrix4, Vector2, Vector3 } from "three";

const toDecalScale = (s, thickness = 1) => (Array.isArray(s) ? s : [s, s, thickness]);

const CATALOG = {
  pantaloneta: {
    name: "Pantaloneta",
    glb: "/prendas3d/pantaloneta_v1.glb",
    designs: {
      base: {
        name: "Base",
        mask: "/prendas3d/mask_rgb_pantaloneta_base.png",
        zones: {
          cintura: { label: "Pantaloneta", channel: "R", default: "#1e3a8a" },
          pierna_der: { label: "Laterales", channel: "B", default: "#dc2626" },
        },
      },
      estilo1: {
        name: "Estilo 1",
        mask: "/prendas3d/mask_rgb_pantaloneta_1.png",
        zones: {
          cintura: { label: "Pantaloneta", channel: "R", default: "#f59e0b" },
          cuerpo: { label: "Cintura y Franajas", channel: "B", default: "#10b981" },
        },
      },
    },
  },
};

function worldScaleToUvScale(e, worldSize) {
  const obj = e.object;
  const geom = obj.geometry;
  const idx = geom.index;
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  const faceIndex = e.faceIndex ?? 0;
  if (!uv || !pos || !idx) return worldSize * 0.001;
  const ia = idx.array[faceIndex * 3 + 0];
  const ib = idx.array[faceIndex * 3 + 1];
  const ic = idx.array[faceIndex * 3 + 2];
  const va = new Vector3().fromBufferAttribute(pos, ia);
  const vb = new Vector3().fromBufferAttribute(pos, ib);
  const vc = new Vector3().fromBufferAttribute(pos, ic);
  const m = new Matrix4().copy(obj.matrixWorld);
  va.applyMatrix4(m);
  vb.applyMatrix4(m);
  vc.applyMatrix4(m);
  const ab = new Vector3().subVectors(vb, va);
  const ac = new Vector3().subVectors(vc, va);
  const areaWorld = ab.clone().cross(ac).length() * 0.5;
  const uva = new Vector2().fromBufferAttribute(uv, ia);
  const uvb = new Vector2().fromBufferAttribute(uv, ib);
  const uvc = new Vector2().fromBufferAttribute(uv, ic);
  const e1 = uvb.clone().sub(uva);
  const e2 = uvc.clone().sub(uva);
  const areaUV = Math.abs(e1.x * e2.y - e1.y * e2.x) * 0.5;
  if (areaWorld <= 1e-8 || areaUV <= 1e-8) return worldSize * 0.001;
  const ratio = Math.sqrt(areaUV / areaWorld);
  return worldSize * ratio;
}

function makeTextTexture(txt, { font = "900 128px Inter", fill = "#000000", outline = "#000", outlineW = 10 } = {}) {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = font;
  if (outlineW > 0) {
    g.lineWidth = outlineW;
    g.strokeStyle = outline;
    g.strokeText(txt, 512, 512);
  }
  g.fillStyle = fill;
  g.fillText(txt, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.anisotropy = 1;
  return t;
}

function TextDecal({ d }) {
  const font = `${d.fontWeight} ${d.fontSize}px ${d.fontFamily}`;
  const texture = React.useMemo(
    () => makeTextTexture(d.text, { font, fill: d.fill, outline: d.outline, outlineW: d.outlineWidth }),
    [d.text, font, d.fill, d.outline, d.outlineWidth]
  );
  React.useEffect(() => () => texture?.dispose(), [texture]);
  return (
    <Decal
      position={d.position}
      rotation={d.rotation}
      scale={toDecalScale(d.scale)}
      map={texture}
      transparent
      depthTest
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-1}
    />
  );
}

function Scene({ product, design, colors, decals, textDecals, setDecals, setTextDecals, activeElement, setActiveElement, textures }) {
  const gltf = useGLTF(product.glb);
  const zonesSpec = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(design.zones).map(([k, z]) => [k, { channel: z.channel, color: colors[k], textureUrl: textures[k] }])
      ),
    [design, colors, textures]
  );
  const colorMap = useChannelMaskTexture(design.mask, zonesSpec);
  const [meshes, setMeshes] = useState([]);
  useEffect(() => {
    if (!gltf?.scene) return;
    const list = [];
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        list.push({ geometry: o.geometry, position: o.position.clone(), rotation: o.rotation.clone(), scale: o.scale.clone() });
      }
    });
    setMeshes(list);
  }, [gltf]);
  const handlePointerDown = (e) => {
    e.stopPropagation();
    const p = e.point.clone();
    const n = (e.face?.normal || new THREE.Vector3(0, 0, 1)).clone().transformDirection(e.object.matrixWorld);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    const eul = new THREE.Euler().setFromQuaternion(q);
    const idxMesh = e.object.userData.meshIndex ?? 0;
    const uv = e.uv ? [e.uv.x, e.uv.y] : [0.5, 0.5];
    const faceIndex = e.faceIndex ?? 0;
    const worldScale = e.object.scale.clone().length();
    const uvSize = worldScaleToUvScale(e, worldScale);
    if (!activeElement) return;
    const { type, index } = activeElement;
    if (type === "text") {
      setTextDecals((prev) => {
        const copy = [...prev];
        const prevZ = copy[index]?.rotation?.[2] ?? 0;
        const worldScale = copy[index]?.scale ?? 1.0;
        copy[index] = {
          ...copy[index],
          position: p.toArray(),
          rotation: [eul.x, eul.y, prevZ],
          meshIndex: idxMesh,
          faceIndex,
          uv,
          uvSize,
          rotationZ: prevZ,
          scale: worldScale,
        };
        return copy;
      });
    } else if (type === "logo") {
      setDecals((prev) => {
        const copy = [...prev];
        const prevZ = copy[index]?.rotation?.[2] ?? 0;
        const worldScale = copy[index]?.scale ?? 1.0;
        copy[index] = {
          ...copy[index],
          position: p.toArray(),
          rotation: [eul.x, eul.y, prevZ],
          meshIndex: idxMesh,
          faceIndex,
          uv,
          uvSize,
          rotationZ: prevZ,
          scale: worldScale,
        };
        return copy;
      });
    }
  };
  return (
    <group>
      {meshes.map((m, i) => (
        <mesh
          key={i}
          geometry={m.geometry}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          onPointerDown={handlePointerDown}
          castShadow
          receiveShadow
          userData={{ meshIndex: i }}
        >
          <meshStandardMaterial color="white" metalness={0.1} roughness={0.7} map={colorMap || null} />
          {decals.map(
            (d, k) =>
              d.texture &&
              d.meshIndex === i && (
                <Decal
                  key={`logo-${k}`}
                  position={d.position}
                  rotation={d.rotation}
                  scale={toDecalScale(d.scale)}
                  map={d.texture}
                  transparent
                  depthTest
                  depthWrite={false}
                  polygonOffset
                  polygonOffsetFactor={-1}
                />
              )
          )}
          {textDecals.filter((d) => d.meshIndex === i).map((d, k) => (
            <TextDecal key={`text-${i}-${k}`} d={d} />
          ))}
        </mesh>
      ))}
      <Environment preset="studio" />
    </group>
  );
}

export default function PantalonetaViewer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const { user } = useAuth();
  const glRef = useRef();
  const [productId] = useState("pantaloneta");
  const product = CATALOG[productId];
  const [designId, setDesignId] = useState("base");
  const designs = product.designs;
  const design = designs[designId];
  const [dpr, setDpr] = useState(1.5);
  const [colors, setColors] = useState(() =>
    Object.fromEntries(Object.entries(design.zones).map(([k, z]) => [k, z.default]))
  );
  const [textures, setTextures] = useState({});
  const [decals, setDecals] = useState([]);
  const [textDecals, setTextDecals] = useState([]);
  const [activeElement, setActiveElement] = useState(null);
  const [currentLogo, setCurrentLogo] = useState({ scale: 0.5, position: "centro" });
  const [currentText, setCurrentText] = useState({ scale: 0.5, position: "centro" });
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeSection, setActiveSection] = useState("colores");
  useEffect(() => {
    setColors(Object.fromEntries(
      Object.entries(design.zones).map(([k, z]) => [k, z.default])
    ));
    setTextures({});
    setDecals([]);
    setTextDecals([]);
    setActiveElement(null);
    setSelectedElement(null);
  }, [designId]);
  useEffect(() => {
    setActiveElement(null);
    setSelectedElement(null);
  }, [activeSection]);
  const updateActiveElement = (patch) => {
    if (!activeElement) return;
    const { type, index } = activeElement;
    const update = (arrSetter) => {
      arrSetter((arr) => {
        const copy = [...arr];
        const current = copy[index];
        if (!current) return arr;
        const merged = { ...current, ...patch };
        if (patch.scale !== undefined && current.uvSize && current.scale) {
          const ratio = current.uvSize / current.scale;
          merged.uvSize = patch.scale * ratio;
        }
        copy[index] = merged;
        return copy;
      });
    };
    if (type === "logo") update(setDecals);
    if (type === "text") update(setTextDecals);
  };
  const handleAddText = (initialText = "") => {
    if (textDecals.length >= 5) return alert("Solo puedes añadir hasta 5 textos.");
    const newText = {
      text: initialText,
      fontFamily: "Inter",
      fontWeight: "900",
      fontSize: 128,
      fill: "#ffffff",
      outline: "#000000",
      outlineWidth: 8,
      position: [0, 0.3, 0.25],
      rotation: [0, 0, 0],
      scale: 1.2,
      meshIndex: 0,
    };
    setTextDecals((prev) => {
      const idx = prev.length;
      const next = [...prev, newText];
      setSelectedElement({ type: "text", id: idx });
      setActiveElement({ type: "text", index: idx });
      return next;
    });
  };
  const handleRemoveElement = (id, type) => {
    if (type === "logo") setDecals((d) => d.filter((_, i) => i !== id));
    if (type === "text") setTextDecals((t) => t.filter((_, i) => i !== id));
    if (activeElement && activeElement.type === type && activeElement.index === id) {
      setActiveElement(null);
    }
  };
  const moveSelectedElement = (direction) => {
    console.log("Mover:", direction);
  };
  const renderPanel = () => {
    switch (activeSection) {
      case "estilos":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelEstilosRGB designs={designs} designId={designId} onPick={setDesignId} />
          </div>
        );
      case "colores":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelColoresRGB designZones={design.zones} colors={colors} setColors={setColors} />
          </div>
        );
      case "texto":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelTextoRGB
              currentElement={currentText}
              setCurrentElement={setCurrentText}
              handleAddText={handleAddText}
              selectedElement={selectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              texts={textDecals}
              setSelectedElement={setSelectedElement}
              updateActiveElement={updateActiveElement}
              setActiveElement={setActiveElement}
            />
          </div>
        );
      case "logos":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelLogosRGB
              logos={decals}
              selectedElement={selectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              setSelectedElement={setSelectedElement}
              currentElement={currentLogo}
              setCurrentElement={setCurrentLogo}
              setActiveElement={setActiveElement}
              updateActiveElement={updateActiveElement}
              setDecals={setDecals}
              userId={user?.id}
            />
          </div>
        );
      case "texturas":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelTexturasRGB
              designZones={design.zones}
              colors={colors}
              setColors={setColors}
              setTextures={setTextures}
            />
          </div>
        );
      default:
        return null;
    }
  };
  const handleGuardarDiseno = async () => {
    setLoading(true);
    try {
      const { gl, scene, camera } = glRef.current;
      if (!gl || !scene || !camera) {
        toast.error("No se detectó el canvas 3D. Intenta nuevamente.");
        return;
      }
      if (!user || !user.id) {
        toast.error("Debes iniciar sesión para guardar el diseño");
        return;
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
      gl.render(scene, camera);
      const angles = [
        { name: "espalda", rotationY: Math.PI },
        { name: "lado_izq", rotationY: Math.PI / 2 },
        { name: "lado_der", rotationY: -Math.PI / 2 },
        { name: "frente", rotationY: 0 },
      ];
      const renders = {};
      for (const a of angles) {
        camera.position.set(Math.sin(a.rotationY) * 2.5, 0.3, Math.cos(a.rotationY) * 2.5);
        camera.lookAt(0, 0.3, 0);
        gl.render(scene, camera);
        await new Promise((r) => requestAnimationFrame(r));
        const dataURL = gl.domElement.toDataURL("image/png");
        renders[a.name] = await (await fetch(dataURL)).blob();
      }
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("categoria", "pantaloneta");
      formData.append("modelo", `PT-${Date.now()}`);
      formData.append("design_id", designId);
      formData.append("colors", JSON.stringify(colors));
      formData.append("textures", JSON.stringify(textures));
      formData.append("decals", JSON.stringify(decals));
      formData.append("textDecals", JSON.stringify(textDecals));
      formData.append("render_frente", renders.frente, "frente.png");
      formData.append("render_espalda", renders.espalda, "espalda.png");
      formData.append("render_lado_izq", renders.lado_izq, "lado_izq.png");
      formData.append("render_lado_der", renders.lado_der, "lado_der.png");
      const UV_RES = [2048, 2048];
      formData.append("uv_resolution", JSON.stringify(UV_RES));
      console.log("📤 Enviando diseño al backend...");
      const res = await fetch(`${API_URL}/api/3d/prenda/guardar`, { method: "POST", body: formData });
      const data = await res.json();
      console.log("Respuesta backend:", data);
      if (res.ok) {
        toast.success("Diseño guardado correctamente 🎨");
        navigate(`/modelo3d/listar-prendas3d`);
      } else {
        toast.error("Error al guardar el diseño");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      toast.error("Error al guardar el diseño");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex h-[90vh] bg-gray-100">
        <div className="flex flex-col p-4">
          <NavPanelesRGB
            items={[
              { id: "estilos", label: "Estilos", icon: <Layers size={22} /> },
              { id: "colores", label: "Colores", icon: <Palette size={22} /> },
              { id: "texto", label: "Texto", icon: <Type size={22} /> },
              { id: "logos", label: "Logos", icon: <Image size={22} /> },
              { id: "texturas", label: "Texturas IA", icon: <Sparkles size={22} /> },
            ]}
            activeId={activeSection}
            onChange={setActiveSection}
          />
        </div>
        <div className="w-[560px] p-4 overflow-y-auto">{renderPanel()}</div>
        <div className="flex-1 bg-white rounded-lg shadow-lg relative">
          <PantallaCarga
            show={loading || loadingLogo}
            message={loadingLogo ? "Subiendo logo a Cloudinary..." : "Guardando tu diseño 3D..."}
          />
          <Canvas
            dpr={dpr}
            frameloop="demand"
            gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 2.5], fov: 65 }}
            onCreated={({ gl, scene, camera }) => {
              glRef.current = { gl, scene, camera };
              scene.background = new THREE.Color("#f2f2f2");
            }}
          >
            <Suspense fallback={<Html><span style={{ color: "#fff" }}>Cargando...</span></Html>}>
              <Scene
                product={product}
                design={design}
                colors={colors}
                decals={decals}
                setDecals={setDecals}
                textDecals={textDecals}
                setTextDecals={setTextDecals}
                activeElement={activeElement}
                setActiveElement={setActiveElement}
                textures={textures}
              />
              <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
              <OrbitControls enablePan={false} minPolarAngle={Math.PI * 0.3} maxPolarAngle={Math.PI * 0.7} />
            </Suspense>
          </Canvas>
          <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-lg text-white text-sm">
            <h3 className="font-bold mb-1">Controles</h3>
            <p>• Click izquierdo sobre la prenda: Colocar elemento</p>
            <p>• Rueda del ratón: Zoom</p>
            <p>• Click izquierdo + arrastrar: Rotar vista</p>
          </div>
          <div className="absolute top-2 right-2 bg-black/70 p-3 rounded-lg text-white text-sm">
            <h3 className="font-bold mb-1">Guardar Diseño</h3>
            <button
              onClick={handleGuardarDiseno}
              disabled={!glRef.current}
              className={`mt-4 w-full bg-blue-900 text-white rounded-lg py-2 px-2 font-semibold hover:bg-blue-600 transition-colors ${!glRef.current ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Save size={16} className="inline" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

useGLTF.preload("/prendas3d/pantaloneta_v1.glb");
