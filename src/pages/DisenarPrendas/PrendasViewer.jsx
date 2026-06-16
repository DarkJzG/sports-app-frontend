// src/pages/DisenarPrendas/PrendasViewer.jsx
import React, { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Decal, useGLTF, PerformanceMonitor } from "@react-three/drei";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { useAuth } from "../../components/AuthContext";
import PantallaCarga from "../../components/PantallaCarga";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import PanelColoresRGB from "../../components/Prenda3D/PanelColoresRGB";
import PanelTexturasRGB from "../../components/Prenda3D/PanelTexturasRGB";
import PanelTextoRGB from "../../components/Prenda3D/PanelTextoRGB";
import PanelLogosRGB from "../../components/Prenda3D/PanelLogosRGB";
import NavPanelesRGB from "../../components/Prenda3D/NavPanelesRGB";
import PanelEstilosRGB from "../../components/Prenda3D/PanelEstilosRGB";

import { useChannelMaskTexture } from "../../components/useChannelMaskTexture";
import { Palette, Type, Image, Layers, Sparkles, Save } from "lucide-react";
import { Matrix4, Vector2, Vector3 } from "three";

// ------------------ 1) Catálogo unificado ------------------

const CATALOG = {
  camiseta: {
    name: "Camiseta",
    glb: "/prendas3d/CamisetaFinal.glb",
    designs: {
      basefinal: {
        name: "Base Final",
        mask: "/prendas3d/mask_rgb_camiseta_basefinal.png",
        zones: {
          cuello: { label: "Cuello", channel: "R", default: "#0000FF" },
          mangas: { label: "Mangas", channel: "G", default: "#00FF00" },
          torso:  { label: "Torso",  channel: "B", default: "#FF0000" },
        },
      },
      estilo2: {
        name: "Estilo 2",
        mask: "/prendas3d/mask_camiseta_base_2.png",
        zones: {
          cuello: { label: "Cuello", channel: "R", default: "#0000FF" },
          mangas: { label: "Mangas", channel: "G", default: "#00FF00" },
          torso:  { label: "Torso",  channel: "B", default: "#FF0000" },
        },
      },
    },
  },

  pantalon: {
    name: "Pantalón",
    glb: "/prendas3d/pantalon_v1.glb",
    designs: {
      base: {
        name: "Base",
        mask: "/prendas3d/mask_rgb_pantalon_base.png",
        zones: {
          cintura:    { label: "Cintura y Bastas", channel: "R", default: "#1e3a8a" },
          pierna_izq: { label: "Laterales",        channel: "G", default: "#059669" },
          pierna_der: { label: "Piernas",          channel: "B", default: "#dc2626" },
        },
      },
      estilo1: {
        name: "Estilo 1",
        mask: "/prendas3d/mask_rgb_pantalon_1.png",
        zones: {
          cintura: { label: "Cintura y Bastas", channel: "R", default: "#f59e0b" },
          bajos:   { label: "Laterales",        channel: "G", default: "#8b5cf6" },
          cuerpo:  { label: "Piernas",          channel: "B", default: "#10b981" },
        },
      },
    },
  },

  pantaloneta: {
    name: "Pantaloneta",
    glb: "/prendas3d/pantaloneta_v1.glb",
    designs: {
      base: {
        name: "Base",
        mask: "/prendas3d/mask_rgb_pantaloneta_base.png",
        zones: {
          cintura:   { label: "Pantaloneta", channel: "R", default: "#1e3a8a" },
          pierna_der:{ label: "Laterales",   channel: "B", default: "#dc2626" },
        },
      },
      estilo1: {
        name: "Estilo 1",
        mask: "/prendas3d/mask_rgb_pantaloneta_1.png",
        zones: {
          cintura: { label: "Pantaloneta",            channel: "R", default: "#f59e0b" },
          cuerpo:  { label: "Cintura y Franjas",      channel: "B", default: "#10b981" },
        },
      },
    },
  },

  chompa: {
    name: "Chompa",
    glb: "/prendas3d/chompa_v1.glb",
    designs: {
      base: {
        name: "Base",
        mask: "/prendas3d/mask_rgb_chompa_base.png",
        zones: {
          torso:   { label: "Torso",   channel: "R", default: "#1e3a8a" },
          mangas:  { label: "Mangas",  channel: "G", default: "#059669" },
          detalles:{ label: "Detalles",channel: "B", default: "#dc2626" },
        },
      },
      estilo1: {
        name: "Estilo 1",
        mask: "/prendas3d/mask_rgb_chompa_1.png",
        zones: {
          torso:   { label: "Torso",   channel: "R", default: "#f59e0b" },
          mangas:  { label: "Mangas",  channel: "G", default: "#8b5cf6" },
          detalles:{ label: "Detalles",channel: "B", default: "#10b981" },
        },
      },
    },
  },
};

// Utilidades comunes (copiadas de tus viewers)
const toDecalScale = (s, thickness = 1) => (Array.isArray(s) ? s : [s, s, thickness]);

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

function makeTextTexture(
  txt,
  { font = "900 128px Inter", fill = "#000000", outline = "#000", outlineW = 10 } = {}
) {
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
    () =>
      makeTextTexture(d.text, {
        font,
        fill: d.fill,
        outline: d.outline,
        outlineW: d.outlineWidth,
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
      depthTest={true}
      depthWrite={false}
    />
  );
}

// --------------- Viewer genérico ---------------

export default function PrendasViewer() {
  const { id } = useParams(); // camiseta | pantalon | pantaloneta | chompa
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const configPrenda = CATALOG[id];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (!configPrenda) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-600 font-semibold">
            Prenda no encontrada. Verifica la URL.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // estado y lógica de personalización: colores, texturas, logos, texto, etc.
  // reutiliza exactamente el mismo patrón que CamisetaViewer (paneles, Canvas, botón guardar).
  // Por brevedad, aquí solo se indica la estructura general:

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
          Diseñar {configPrenda.name} en 3D
        </h1>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          {/* Lado izquierdo: Canvas 3D */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <Canvas
              camera={{ position: [0, 2, 5], fov: 55 }}
              gl={{ antialias: true }}
            >
              <Suspense
                fallback={
                  <Html center>
                    <div className="bg-white/80 px-4 py-2 rounded-lg shadow">
                      Cargando modelo...
                    </div>
                  </Html>
                }
              >
                <PerformanceMonitor>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[4, 6, 3]} intensity={1.0} />
                  {/* Cargar GLB según la prenda */}
                  <Model3D glbPath={configPrenda.glb} />
                  {/* aquí tus Decals, materiales, etc. */}
                  <OrbitControls enablePan enableZoom enableRotate />
                  <Environment preset="studio" />
                </PerformanceMonitor>
              </Suspense>
            </Canvas>
          </div>

          {/* Lado derecho: paneles de edición */}
          <div className="space-y-4">
            <NavPanelesRGB
              // mismo uso que en tus viewers, manejando pestañas: color, textura, texto, logos, estilos
            />
            <PanelColoresRGB
              // pasa configPrenda.designs[designActual].zones, estado de colores, etc.
            />
            <PanelTexturasRGB />
            <PanelTextoRGB />
            <PanelLogosRGB />
            <PanelEstilosRGB
              designs={configPrenda.designs}
              // manejar cambio de diseño
            />

            <button
              className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              // onClick => guardar/prender en backend como ya haces
            >
              <Save className="w-5 h-5" />
              Guardar diseño
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <PantallaCarga show={loading} message="Cargando prenda..." />
    </div>
  );
}

// Componente para cargar el modelo (lo puedes extraer de tus viewers actuales)
function Model3D({ glbPath }) {
  const { scene } = useGLTF(glbPath);
  return <primitive object={scene} dispose={null} />;
}
