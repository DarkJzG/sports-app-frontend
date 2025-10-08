// src/pages/DisenarPrendas/CamisetaViewer.jsx
import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Decal, useGLTF } from "@react-three/drei";

import PanelColoresRGB from "../../components/Prenda3D/PanelColoresRGB";
import PanelTexturasRGB from "../../components/Prenda3D/PanelTexturasRGB";
import PanelTextoRGB from "../../components/Prenda3D/PanelTextoRGB";
import PanelLogosRGB from "../../components/Prenda3D/PanelLogosRGB";
import PanelAcordeonRGB from "../../components/Prenda3D/PanelAcordeonRGB";
import { useChannelMaskTexture } from "../../components/useChannelMaskTexture";


/* ========= 1) Catálogo de diseños ========= */
const DESIGNS = {
  base: {
    name: "Base",
    mask: "/prendas3d/mask_base_rgb.png",
    zones: {
      neck:    { label: "Cuello",  channel: "R", default: "#ffffff" },
      sleeves: { label: "Mangas",  channel: "G", default: "#7a2f9a" },
      torso:   { label: "Torso",   channel: "B", default: "#1c9d70" },
    },
  },
  rayo: {
    name: "Rayo",
    mask: "/prendas3d/rayo_rgb.png", // si algún día usas 4ª zona, será el canal A
    zones: {
      torso:  { label: "Torso",  channel: "R", default: "#d32f2f" },
      stripe: { label: "Franja", channel: "G", default: "#21c521" },
      neck:   { label: "Cuello", channel: "B", default: "#0d47a1" },
      // cuffs:  { label: "Puños", channel: "A", default: "#ffffff" }, // opcional 4ª zona
    },
  },
};


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
  t.anisotropy = 8;
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
      scale={d.scale}
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
function Scene({ designId, colors, decals, textDecals, textures, setDecals, setTextDecals, activeElement, setActiveElement  }) {
  const gltf = useGLTF("/prendas3d/camiseta_v2.glb");

  const colorMap = useChannelMaskTexture(
    DESIGNS[designId].mask,
    Object.fromEntries(
      Object.entries(DESIGNS[designId].zones).map(([k, z]) => [
        k,
        { channel: z.channel, color: colors[k], textureUrl: textures[k] },
      ])
    )
  );

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
    const n = (e.face?.normal || new THREE.Vector3(0, 0, 1)).clone().transformDirection(e.object.matrixWorld);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    const eul = new THREE.Euler().setFromQuaternion(q);
    const idxMesh = e.object.userData.meshIndex ?? 0;
  
    if (!activeElement) return;
  
    if (activeElement.type === "text") {
      setTextDecals((prev) => {
        const copy = [...prev];
        const item = { ...copy[activeElement.index] };
        item.position = p.toArray();
        item.rotation = [eul.x, eul.y, eul.z];
        item.meshIndex = idxMesh;
        copy[activeElement.index] = item;
        return copy;
      });
    }
  
    if (activeElement.type === "logo") {
      setDecals((prev) => {
        const copy = [...prev];
        const item = { ...copy[activeElement.index] };
        item.position = p.toArray();
        item.rotation = [eul.x, eul.y, eul.z];
        item.meshIndex = idxMesh;
        copy[activeElement.index] = item;
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
                  scale={d.scale}
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
  const [designId] = useState("base");
  const [colors, setColors] = useState(() =>
    Object.fromEntries(Object.entries(DESIGNS.base.zones).map(([k, z]) => [k, z.default]))
  );
  const [textures, setTextures] = useState({});
  const [decals, setDecals] = useState([]);
  const [textDecals, setTextDecals] = useState([]);
  const [activeElement, setActiveElement] = useState(null); 

  const [currentLogo, setCurrentLogo] = useState({
    scale: 0.5,
    position: "centro",
  });
  
  const [currentText, setCurrentText] = useState({
    content: "",
    color: "#000000",
    font: "Inter",
    fontSize: 0.5,
    position: "centro",
  });
  
  const [selectedElement, setSelectedElement] = useState(null);

  // subir logo
  const handleLogoUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setActiveElement(null);

  
    if (decals.length >= 5) {
      alert("Solo puedes subir hasta 5 logos.");
      return;
    }
  
    const url = URL.createObjectURL(f);
    const nextIndex = decals.length;
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setDecals((ds) => [
        ...ds,
        { 
          texture: t, 
          url,
          position: [0, 0.8, 0.25], 
          rotation: [0, 0, 0], 
          scale: 0.45, 
          meshIndex: 0 
        },
      ]);
      // ✅ Activar modo colocación
      setActiveElement({ type: "logo", index: nextIndex });
    });
  };
  

  const handleAddText = () => {
    if (textDecals.length >= 5) {
      alert("Solo puedes añadir hasta 5 textos.");
      return;
      
    }
  
    const newText = {
      id: textDecals.length,
      text: currentText.content || "Texto",
      fill: currentText.color,
      fontFamily: currentText.font,
      fontWeight: "900",
      fontSize: currentText.fontSize * 100,
      outline: "#000000",
      outlineWidth: 0,
      position: [0, 0.8, 0.25],
      rotation: [0, 0, 0],
      scale: 0.3,
      meshIndex: 0,
    };
    setTextDecals((prev) => [...prev, newText]);
    setActiveElement({ type: "text", index: newText.id }); // ✅ activar modo colocación
  };
  

  const handleRemoveElement = (id, type) => {
    if (type === "logo") setDecals((d) => d.filter((_, i) => i !== id));
    if (type === "text") setTextDecals((t) => t.filter((_, i) => i !== id));
  };

  const moveSelectedElement = (direction) => {
    // placeholder para movimiento (futuro)
    console.log("Mover:", direction);
  };

  return (
    <div className="flex flex-row h-[90vh] bg-gray-100">
      {/* Panel lateral */}
      <div className="w-[450px] overflow-y-auto p-4 flex flex-col gap-4">
        <PanelAcordeonRGB title="🎨 Colores">
          <PanelColoresRGB designZones={
            DESIGNS[designId].zones} 
            colors={colors} 
            setColors={setColors} />
        </PanelAcordeonRGB>

        {/* ✍️ Textos */}
        <PanelAcordeonRGB title="✍️ Texto Personalizado">
          <PanelTextoRGB
            currentElement={currentText}
            setCurrentElement={setCurrentText}
            handleAddText={() => {
              const newText = {
                id: textDecals.length,
                text: currentText.content || "Texto",
                fill: currentText.color,
                fontFamily: currentText.font,
                fontWeight: "900",
                fontSize: currentText.fontSize * 100,
                outline: "#000000",
                outlineWidth: 0,
                position: [0, 0.8, 0.25],
                rotation: [0, 0, 0],
                scale: 0.3,
                meshIndex: 0,
              };
              setTextDecals([...textDecals, newText]);
            }}
            selectedElement={selectedElement}
            moveSelectedElement={moveSelectedElement}
            handleRemoveElement={handleRemoveElement}
            texts={textDecals}
            setSelectedElement={setSelectedElement}
          />
        </PanelAcordeonRGB>



          {/* 🖼️ Logos */}
          <PanelAcordeonRGB title="🖼️ Logos Personalizados">
            <PanelLogosRGB
              handleLogoUpload={handleLogoUpload}
              logos={decals}
              selectedElement={selectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              setSelectedElement={setSelectedElement}
              currentElement={currentLogo}
              setCurrentElement={setCurrentLogo}
              setActiveElement={setActiveElement}   
            />
          </PanelAcordeonRGB>

        <PanelAcordeonRGB title="🧵 Texturas IA">
          <PanelTexturasRGB designZones={DESIGNS[designId].zones} colors={colors} setColors={setColors} setTextures={setTextures} />
        </PanelAcordeonRGB>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white rounded-lg shadow-lg relative">
        <Canvas shadows camera={{ position: [0, 1.2, 2.2], fov: 40 }}>
          <Suspense fallback={<Html><span style={{ color: "#fff" }}>Cargando...</span></Html>}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 3, 2]} intensity={1} castShadow />
            <Scene
              designId={designId}
              colors={colors}
              decals={decals}
              setDecals={setDecals}
              textDecals={textDecals}
              setTextDecals={setTextDecals}
              activeElement={activeElement}
              setActiveElement={setActiveElement}
              textures={textures}
            />
            <OrbitControls enablePan={false} minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.65} />
          </Suspense>
        </Canvas>

        {/* Controles flotantes */}
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

useGLTF.preload("/prendas3d/camiseta.glb");
