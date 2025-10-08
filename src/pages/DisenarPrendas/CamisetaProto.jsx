// src/pages/DisenarPrendas/CamisetaViewer.jsx
import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Decal, useGLTF, useTexture } from "@react-three/drei";

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
    mask: "/prendas3d/rayo_rgb.png",
    zones: {
      torso:  { label: "Torso",  channel: "R", default: "#d32f2f" },
      stripe: { label: "Franja", channel: "G", default: "#21c521" },
      neck:   { label: "Cuello", channel: "B", default: "#0d47a1" },
      // cuffs: { label: "Puños", channel: "A", default: "#ffffff" }, // 4ª zona opcional
    },
  },
};

/* ========= 2) Mezcla por canales (R/G/B/A) ========= */
// zones: { [zoneId]: { channel: 'R'|'G'|'B'|'A', color: '#rrggbb' } }
function useChannelMaskTexture(maskURL, zones) {
  const mask = useTexture(maskURL);
  const [tex, setTex] = useState(null);

  useEffect(() => {
    if (!mask.image) return;
    const w = mask.image.width, h = mask.image.height;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(mask.image, 0, 0, w, h);

    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;

    const zonesRGB = Object.fromEntries(
      Object.entries(zones).map(([id, z]) => {
        const c = new THREE.Color(z.color);
        return [id, { channel: z.channel, r: Math.round(c.r*255), g: Math.round(c.g*255), b: Math.round(c.b*255) }];
      })
    );

    for (let i = 0; i < data.length; i += 4) {
      const R = data[i]   / 255;
      const G = data[i+1] / 255;
      const B = data[i+2] / 255;
      const A = data[i+3] / 255;
      const wBy = (ch) => ch === "R" ? R : ch === "G" ? G : ch === "B" ? B : A;

      let outR = 0, outG = 0, outB = 0;
      for (const z of Object.values(zonesRGB)) {
        const wCh = wBy(z.channel);
        if (wCh > 0) { outR += wCh*z.r; outG += wCh*z.g; outB += wCh*z.b; }
      }
      data[i]   = Math.min(255, Math.round(outR));
      data[i+1] = Math.min(255, Math.round(outG));
      data[i+2] = Math.min(255, Math.round(outB));
      data[i+3] = 255;
    }

    ctx.putImageData(img, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;
    setTex(texture);

    return () => texture.dispose();
  }, [mask.image, JSON.stringify(zones)]);

  return tex;
}

function makeTextTexture(txt, {font='900 128px Inter', fill='#fff', outline='#000', outlineW=8}={}) {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
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

/* ——— TextDecal: cachea la textura y la libera ——— */
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
function Scene({
  designId, colors,
  decals, setDecals, active,
  textDecals = [], setTextDecals = () => {}, activeText = -1
}) {
  const gltf = useGLTF("/prendas3d/camiseta.glb");

  const colorMap = useChannelMaskTexture(
    DESIGNS[designId].mask,
    Object.fromEntries(
      Object.entries(DESIGNS[designId].zones).map(([k, z]) => [k, { channel: z.channel, color: colors[k] }])
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
    const n = (e.face?.normal || new THREE.Vector3(0,0,1))
      .clone()
      .transformDirection(e.object.matrixWorld);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), n);
    const eul = new THREE.Euler().setFromQuaternion(q);
    const idxMesh = e.object.userData.meshIndex ?? 0;

    // Texto activo
    if (activeText >= 0 && textDecals[activeText]) {
      const arr = [...textDecals];
      arr[activeText] = {
        ...arr[activeText],
        position: p.toArray(),
        rotation: [eul.x, eul.y, eul.z],
        meshIndex: idxMesh
      };
      setTextDecals(arr);
      return;
    }

    // Logo activo
    if (active >= 0 && decals[active]) {
      setDecals(ds => {
        const copy = ds.slice();
        copy[active] = {
          ...copy[active],
          position: p.toArray(),
          rotation: [eul.x, eul.y, eul.z],
          meshIndex: idxMesh
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
          <meshStandardMaterial
            color="white"
            metalness={0.1}
            roughness={0.7}
            map={colorMap || null}
          />

          {/* Logos */}
          {decals.map((d, k) =>
            d.texture && d.meshIndex === i ? (
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
            ) : null
          )}

          {/* Textos (filtrado por mesh aquí) */}
          {textDecals
            .filter(d => d.meshIndex === i)
            .map((d, k) => (
              <TextDecal key={`text-${i}-${k}`} d={d} />
            ))}
        </mesh>
      ))}
      <Environment preset="studio" />
    </group>
  );
}

/* ========= 4) UI principal ========= */
export default function CamisetaViewer() {
  const [designId, setDesignId] = useState("base");
  const [colors, setColors] = useState(() =>
    Object.fromEntries(Object.entries(DESIGNS.base.zones).map(([k, z]) => [k, z.default]))
  );
  useEffect(() => {
    setColors(Object.fromEntries(Object.entries(DESIGNS[designId].zones).map(([k, z]) => [k, z.default])));
  }, [designId]);

  // LOGOS
  const [decals, setDecals] = useState([]);         // {texture, position, rotation, scale, meshIndex}
  const [active, setActive] = useState(-1);         // índice del logo activo

  // TEXTOS
  const [textDecals, setTextDecals] = useState([]); // {text, fontFamily, fontWeight, fontSize, ...}
  const [activeText, setActiveText] = useState(-1); // índice del texto activo

  // subir logo -> añade decal y lo deja activo
  const onLogoUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const nextIndex = decals.length;
    new THREE.TextureLoader().load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setDecals((ds) => [...ds, {
        texture: t, position: [0, 0.8, 0.25], rotation: [0, 0, 0], scale: 0.45, meshIndex: 0
      }]);
      setActive(nextIndex);
    });
  };

  const removeActiveDecal = () => {
    if (active < 0) return;
    setDecals(ds => ds.filter((_, i) => i !== active));
    setActive(-1);
  };

  const handleAddText = () => {
    const idx = textDecals.length;
    const newText = {
      text: "Nuevo texto",
      fontFamily: "Inter",
      fontWeight: "900",
      fontSize: 128,
      fill: "#ffffff",
      outline: "#000000",
      outlineWidth: 8,
      position: [0, 0.8, 0.25],
      rotation: [0, 0, 0],
      scale: 0.2,
      meshIndex: 0
    };
    setTextDecals(prev => [...prev, newText]);
    setActiveText(idx);
  };

  const activeDecal = decals[active];

  const updateActive = (patch) =>
    setDecals((ds) => {
      if (active < 0 || !ds[active]) return ds;
      const copy = ds.slice();
      copy[active] = { ...copy[active], ...patch };
      return copy;
    });

  return (
    <div className="w-full h-[80vh]" style={{ position: "relative" }}>
      {/* Panel UI */}
      <div
        style={{
          position: "absolute",
          top: 12, left: 12,
          padding: 12,
          background: "rgba(0,0,0,.55)",
          color: "#fff",
          borderRadius: 10,
          display: "grid",
          gap: 8,
          zIndex: 2,
          minWidth: 260,
        }}
      >
        <label>Diseño:&nbsp;
          <select value={designId} onChange={(e) => setDesignId(e.target.value)}>
            {Object.entries(DESIGNS).map(([id, d]) => (
              <option key={id} value={id}>{d.name}</option>
            ))}
          </select>
        </label>

        {Object.entries(DESIGNS[designId].zones).map(([key, z]) => (
          <label key={key}>
            {z.label}&nbsp;
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
            />
          </label>
        ))}

        <div style={{ borderTop: "1px solid #777", marginTop: 6, paddingTop: 6 }}>
          <b>Texto</b>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "6px 0" }}>
            {textDecals.map((_, i) => (
              <button
                key={`text-${i}`}
                onClick={() => setActiveText(i)}
                style={{
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: i === activeText ? "2px solid #4fc3f7" : "1px solid #888",
                  background: "#222",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                T{i + 1}
              </button>
            ))}
            <button onClick={handleAddText}>+ Texto</button>
          </div>

          {activeText >= 0 && textDecals[activeText] && (
            <>
              <label>Texto
                <input
                  type="text"
                  value={textDecals[activeText].text}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].text = e.target.value;
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Familia
                <select
                  value={textDecals[activeText].fontFamily}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].fontFamily = e.target.value;
                    setTextDecals(arr);
                  }}
                >
                  <option>Inter</option>
                  <option>Oswald</option>
                  <option>Bebas Neue</option>
                  <option>Roboto</option>
                </select>
              </label>

              <label>Peso
                <select
                  value={textDecals[activeText].fontWeight}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].fontWeight = e.target.value;
                    setTextDecals(arr);
                  }}
                >
                  <option value="400">Regular</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </label>

              <label>Tamaño (px)
                <input
                  type="number" min={24} max={256} step={2}
                  value={textDecals[activeText].fontSize}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].fontSize = parseInt(e.target.value || 128, 10);
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Relleno
                <input
                  type="color"
                  value={textDecals[activeText].fill}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].fill = e.target.value;
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Contorno
                <input
                  type="color"
                  value={textDecals[activeText].outline}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].outline = e.target.value;
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Grosor contorno
                <input
                  type="range" min="0" max="24" step="1"
                  value={textDecals[activeText].outlineWidth}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].outlineWidth = parseInt(e.target.value, 10);
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Escala texto
                <input
                  type="range" min="0.05" max="1.5" step="0.01"
                  value={textDecals[activeText].scale}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    arr[activeText].scale = parseFloat(e.target.value);
                    setTextDecals(arr);
                  }}
                />
              </label>

              <label>Rotación Z texto
                <input
                  type="range" min={-Math.PI} max={Math.PI} step="0.01"
                  value={textDecals[activeText].rotation[2]}
                  onChange={(e) => {
                    const arr = [...textDecals];
                    const rot = [...arr[activeText].rotation];
                    rot[2] = parseFloat(e.target.value);
                    arr[activeText].rotation = rot;
                    setTextDecals(arr);
                  }}
                />
              </label>
            </>
          )}
        </div>

        <div style={{ borderTop: "1px solid #777", marginTop: 6, paddingTop: 6 }}>
          <b>Logos</b>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "6px 0" }}>
            {decals.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: i === active ? "2px solid #4fc3f7" : "1px solid #888",
                  background: "#222",
                  color: "#fff",
                  cursor: "pointer",
                }}
                title={`Logo ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <input type="file" accept="image/png" onChange={onLogoUpload} />
          </div>

          <label>Escala
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.01"
              value={activeDecal?.scale ?? 0.45}
              onChange={(e) => updateActive({ scale: parseFloat(e.target.value) })}
              disabled={activeDecal == null}
            />
          </label>

          <label>Rotación Z
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step="0.01"
              value={activeDecal?.rotation?.[2] ?? 0}
              onChange={(e) => {
                const z = parseFloat(e.target.value);
                const rot = activeDecal?.rotation ? [...activeDecal.rotation] : [0, 0, 0];
                rot[2] = z;
                updateActive({ rotation: rot });
              }}
              disabled={activeDecal == null}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={activeDecal == null} onClick={removeActiveDecal}>
              Eliminar logo activo
            </button>
            <small style={{ opacity: 0.8 }}>
              Tip: haz clic en la camiseta para colocar el logo o texto activo.
            </small>
          </div>
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 1.2, 2.2], fov: 40 }}>
        <Suspense fallback={<Html><span style={{ color: "#fff" }}>cargando…</span></Html>}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 3, 2]} intensity={1} castShadow />
          <Scene
            designId={designId}
            colors={colors}
            decals={decals}
            setDecals={setDecals}
            active={active}
            textDecals={textDecals}
            setTextDecals={setTextDecals}
            activeText={activeText}
          />
          <OrbitControls enablePan={false} minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.65} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/prendas3d/camiseta.glb");
