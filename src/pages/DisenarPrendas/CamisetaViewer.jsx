// src/pages/DisenarPrendas/CamisetaViewer.jsx
import React, { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Decal, useGLTF } from "@react-three/drei";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { useAuth } from "../../components/AuthContext";
import PantallaCarga from "../../components/PantallaCarga";
import {useNavigate} from "react-router-dom";

import PanelColoresRGB from "../../components/Prenda3D/PanelColoresRGB";
import PanelTexturasRGB from "../../components/Prenda3D/PanelTexturasRGB";
import PanelTextoRGB from "../../components/Prenda3D/PanelTextoRGB";
import PanelLogosRGB from "../../components/Prenda3D/PanelLogosRGB";
import NavPanelesRGB from "../../components/Prenda3D/NavPanelesRGB";
import PanelEstilosRGB from "../../components/Prenda3D/PanelEstilosRGB";
import { useChannelMaskTexture } from "../../components/useChannelMaskTexture";
import { PerformanceMonitor } from "@react-three/drei";

import { Matrix4, Vector2, Vector3 } from "three";

/* Cambia la profundidad a la que agrego el texto y los logos */
const toDecalScale = (s, thickness = 1) =>
  Array.isArray(s) ? s : [s, s, thickness];

/* ========= 1) Catálogo de diseños ========= */
const CATALOG = {
  camiseta: {
    name: "Camiseta",
    glb:  "/prendas3d/camiseta.glb",
    designs: {
      base: {
        name: "Base",
        mask: "/prendas3d/mask_base_rgb.png",
        zones: {
          cuello:    { label: "Cuello",  channel: "R", default: "#ffffff" },
          mangas: { label: "Mangas",  channel: "G", default: "#7a2f9a" },
          torso:   { label: "Torso",   channel: "B", default: "#1c9d70" },
        },
      },
      rayo: {
        name: "Rayo",
        mask: "/prendas3d/rayo_rgb.png",
        zones: {
          torso:  { label: "Torso",  channel: "R", default: "#d32f2f" },
          franja: { label: "Franja", channel: "G", default: "#21c521" },
          cuello:   { label: "Cuello", channel: "B", default: "#0d47a1" },
        },
      },
    },
  },
};

// Devuelve tamaño en UV (0-1) equivalente a un tamaño en mundo "worldSize"
function worldScaleToUvScale(e, worldSize) {
  const obj = e.object;
  const geom = obj.geometry;
  const idx = geom.index;
  const pos = geom.attributes.position;
  const uv  = geom.attributes.uv;
  const faceIndex = e.faceIndex ?? 0;

  if (!uv || !pos || !idx) return worldSize * 0.001; // fallback

  // Índices del triángulo impactado
  const ia = idx.array[faceIndex * 3 + 0];
  const ib = idx.array[faceIndex * 3 + 1];
  const ic = idx.array[faceIndex * 3 + 2];

  // Vértices del triángulo en local
  const va = new Vector3().fromBufferAttribute(pos, ia);
  const vb = new Vector3().fromBufferAttribute(pos, ib);
  const vc = new Vector3().fromBufferAttribute(pos, ic);

  // Llevar a mundo
  const m = new Matrix4().copy(obj.matrixWorld);
  va.applyMatrix4(m); vb.applyMatrix4(m); vc.applyMatrix4(m);

  // Área del triángulo en mundo
  const ab = new Vector3().subVectors(vb, va);
  const ac = new Vector3().subVectors(vc, va);
  const areaWorld = ab.clone().cross(ac).length() * 0.5;

  // UVs del triángulo
  const uva = new Vector2().fromBufferAttribute(uv, ia);
  const uvb = new Vector2().fromBufferAttribute(uv, ib);
  const uvc = new Vector2().fromBufferAttribute(uv, ic);

  // Área del triángulo en UV (2D)
  const e1 = uvb.clone().sub(uva);
  const e2 = uvc.clone().sub(uva);
  const areaUV = Math.abs(e1.x * e2.y - e1.y * e2.x) * 0.5;

  if (areaWorld <= 1e-8 || areaUV <= 1e-8) return worldSize * 0.001;

  // Ratio local: (unidades UV / unidades Mundo)
  const ratio = Math.sqrt(areaUV / areaWorld);

  // "worldSize" (tu scale en 3D) → tamaño en UV (0–1)
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
  t.anisotropy = 1
  return t;
}

function TextDecal({ d }) {
  const font = `${d.fontWeight} ${d.fontSize}px ${d.fontFamily}`;
  const texture = React.useMemo(
    () => makeTextTexture(d.text, {
      font,
      fill: d.fill,
      outline: d.outline,
      outlineW: d.outlineWidth
    }),
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


/* ========= 3) Escena ========= */
function Scene({ product, design, colors, decals, textDecals, textures, setDecals, setTextDecals, activeElement, setActiveElement  }) {
  const gltf = useGLTF(product.glb);

  const zonesSpec = React.useMemo(
    () => Object.fromEntries(
      Object.entries(design.zones).map(([k, z]) => [
        k,
        { channel: z.channel, color: colors[k], textureUrl: textures[k] }
      ])
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
        list.push({
          geometry: o.geometry,
          position: o.position.clone(),
          rotation: o.rotation.clone(),
          scale: o.scale.clone(),
        });
      }
    });
    setMeshes(list);
  }, [gltf]);

  const handlePointerDown = (e) => {
    e.stopPropagation();

    const p = e.point.clone();
    const n = (e.face?.normal || new THREE.Vector3(0, 0, 1))
      .clone()
      .transformDirection(e.object.matrixWorld);
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
        const uvSize = worldScaleToUvScale(e, worldScale);

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
        const uvSize = worldScaleToUvScale(e, worldScale);

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

          {/* Logos */}
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

          {/* Textos */}
          {textDecals.filter((d) => d.meshIndex === i).map((d, k) => (
            <TextDecal key={`text-${i}-${k}`} d={d} />
          ))}
        </mesh>
      ))}
      <Environment preset="studio" />
    </group>
  );
}



export default function CamisetaViewer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const { user } = useAuth();
  const glRef = useRef();

  const [productId, setProductId] = useState("camiseta");
  const product = CATALOG[productId];

  const [designId, setDesignId] = useState("base");
  const designs = product.designs;
  const design  = designs[designId];

  const [dpr, setDpr] = useState(1.5);

  const [colors, setColors] = useState(() =>
    Object.fromEntries(Object.entries(design.zones).map(([k, z]) => [k, z.default]))
  );

  useEffect(() => {
    setColors(Object.fromEntries(
      Object.entries(design.zones).map(([k, z]) => [k, z.default])
    ));
    setTextures({});
    setDecals([]);
    setTextDecals([]);
    setActiveElement(null);
    setSelectedElement(null);
  }, [productId, designId]);

  const [textures, setTextures] = useState({});
  const [decals, setDecals] = useState([]);
  const [textDecals, setTextDecals] = useState([]);
  const [activeElement, setActiveElement] = useState(null); 
  const [currentLogo, setCurrentLogo] = useState({ scale: 0.5, position: "centro" });
  const [currentText, setCurrentText] = useState({ scale: 0.5, position: "centro" });
  const [selectedElement, setSelectedElement] = useState(null);
  const [initialText, setInitialText] = useState("Ingrese su texto");


  const [activeSection, setActiveSection] = useState("colores");
  useEffect(() => {
    setActiveElement(null);
    setSelectedElement(null);
  }, [activeSection]);

  const navItems = [
    { id: "prenda",   label: "Prenda" },
    { id: "estilos",  label: "Estilos" },
    { id: "colores",  label: "Colores" },
    { id: "texto",    label: "Texto" },
    { id: "logos",    label: "Logos" },
    { id: "texturas", label: "Texturas IA" },
  ];

  // ---- mutadores
  const updateActiveElement = (patch) => {
    if (!activeElement) return;
    const { type, index } = activeElement;
  
    const update = (arrSetter) => {
      arrSetter(arr => {
        const copy = [...arr];
        const current = copy[index];
        if (!current) return arr;
  
        const merged = { ...current, ...patch };
  
        // ⚙️ recalcular uvSize si se cambia scale
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
  

  // Reset TOTAL al cambiar de PRENDA
  useEffect(() => {
    
    if (!CATALOG[productId].designs[designId]) {
      setDesignId(Object.keys(CATALOG[productId].designs)[0]);
    }
    const zones = CATALOG[productId].designs[designId].zones;
    setColors(Object.fromEntries(Object.entries(zones).map(([k, z]) => [k, z.default])));
    setTextures({});
    setDecals([]);
    setTextDecals([]);
    setActiveElement(null);
    setSelectedElement(null);
  }, [productId]);

  
  useEffect(() => {
    const zones = CATALOG[productId].designs[designId].zones;

    
    setColors(prev => {
      const next = {};
      for (const [k, z] of Object.entries(zones)) {
        next[k] = prev?.[k] ?? z.default;
      }
      return next;
    });

  
    setTextures(prev => {
      const next = {};
      for (const k of Object.keys(zones)) {
        if (prev?.[k]) next[k] = prev[k];
      }
      return next;
    });

    
  }, [designId, productId]);

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
      position: [0, 0.8, 0.25],
      rotation: [0, 0, 0],
      scale: 2,
      meshIndex: 0,
    };
    setTextDecals(prev => {
      const idx = prev.length;
      const next = [...prev, newText];
      setSelectedElement({ type: "text", id: idx });
      setActiveElement({ type: "text", index: idx });
      return next;
    });
  };

  const handleRemoveElement = (id, type) => {
    if (type === "logo")  setDecals(d => d.filter((_, i) => i !== id));
    if (type === "text")  setTextDecals(t => t.filter((_, i) => i !== id));
    if (activeElement && activeElement.type === type && activeElement.index === id) {
      setActiveElement(null);
    }
  };

  const moveSelectedElement = (direction) => {
    console.log("Mover:", direction);
  };

  const renderPanel = () => {
    switch (activeSection) {
      case "prenda":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <label className="block text-sm font-semibold mb-2">Elegir prenda</label>
            <select
              className="w-full border rounded p-2"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {Object.entries(CATALOG).map(([id, p]) => (
                <option key={id} value={id}>{p.name}</option>
              ))}
            </select>
          </div>
        );
      case "estilos":
        return (
          <div className="bg-white rounded-2xl shadow p-4">
            <PanelEstilosRGB
              designs={designs}
              designId={designId}
              onPick={setDesignId}
            />
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
  
      // 1️⃣ Asegurar que la escena se haya renderizado antes de capturar
      await new Promise((resolve) => requestAnimationFrame(resolve));


      gl.render(scene, camera);

      // 3️⃣ Capturar versión normal (con fondo gris)
      const angles = [
        { name: "espalda", rotationY: Math.PI },
        { name: "lado_izq", rotationY: Math.PI / 2 },
        { name: "lado_der", rotationY: -Math.PI / 2 },
        { name: "frente", rotationY: 0 },
      ];
      
      const renders = {};
      
      for (const a of angles) {
        camera.position.set(Math.sin(a.rotationY) * 5, -0.5, Math.cos(a.rotationY) * 5);
        camera.lookAt(0, 1, 0);
        gl.render(scene, camera);
        await new Promise((r) => requestAnimationFrame(r));
      
        const dataURL = gl.domElement.toDataURL("image/png");
        renders[a.name] = await (await fetch(dataURL)).blob();
      }

      // 2️⃣ Crear el FormData DESPUÉS de tener el blob
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("categoria", productId || "camiseta");
      formData.append("modelo", `CA-${Date.now()}`);
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
  
      // 3️⃣ Enviar al backend
      const res = await fetch(`${API_URL}/api/3d/prenda/guardar`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log("Respuesta backend:", data);
  
      if (res.ok) {
        toast.success("Diseño guardado correctamente 🎨");
        console.log("Ficha técnica:", data.ficha_pdf_url);
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
    <div className="flex h-[90vh] bg-gray-100">
      {/* izquierda: navegación vertical */}
      <div className="p-4">
        <NavPanelesRGB items={[
          { id: "prenda",   label: "Prenda" },
          { id: "estilos",  label: "Estilos" },
          { id: "colores",  label: "Colores" },
          { id: "texto",    label: "Texto" },
          { id: "logos",    label: "Logos" },
          { id: "texturas", label: "Texturas IA" },
        ]} activeId={activeSection} onChange={setActiveSection} />
      </div>

      {/* centro: panel con scroll */}
      <div className="w-[560px] p-4 overflow-y-auto">
        {renderPanel()}
      </div>

      {/* derecha: canvas */}
      <div className="flex-1 bg-white rounded-lg shadow-lg relative">
      <PantallaCarga
        show={loading || loadingLogo}
        message={
          loadingLogo
            ? "Subiendo logo a Cloudinary..."
            : "Guardando tu diseño 3D..."
        }
      />
      <Canvas
        dpr={dpr}
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 5, 2], fov: 70 }}
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
            <OrbitControls enablePan={false} minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.65} />
          </Suspense>
        </Canvas>
        <button
          onClick={handleGuardarDiseno}
          disabled={!glRef.current}
          className={`bg-blue-600 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-700 ${
            !glRef.current ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          💾 Guardar Diseño
        </button>
        <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-lg text-white text-sm">
          <h3 className="font-bold mb-1">Controles</h3>
          <p>• Click izquierdo: Colocar elemento</p>
          <p>• Rueda del ratón: Zoom</p>
          <p>• Click derecho + arrastrar: Rotar vista</p>
        </div>
      </div>
    </div>
  );
}

// precarga de modelos (opcional)
useGLTF.preload("/prendas3d/camiseta.glb");




