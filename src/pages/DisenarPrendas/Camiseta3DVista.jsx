// src/pages/DisenarPrendas/Camiseta3DVista.jsx
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import ModeloCamiseta from "../../components/3d/ModeloCamiseta";
import Texto from "../../components/3d/Texto";
import Logo from "../../components/3d/Logo";
import PanelColores from "../../components/3d/PanelColores";
import PanelTexturas from "../../components/3d/PanelTexturas";
import PanelTexto from "../../components/3d/PanelTexto";
import PanelLogos from "../../components/3d/PanelLogos";
import PanelNumero from "../../components/3d/PanelNumero";
import PanelAcordeon from "../../components/3d/PanelAcordeon";

// 🟢 Posiciones base
const POSICIONES = {
  delantera: {
    centro: { position: [0, 0.7, 2.3], rotation: [-0.55, 0, 0] },
    pecho_izquierdo: { position: [-1.7, 0.7, 2.3], rotation: [-0.55, 0, 0] },
    pecho_derecho: { position: [1.7, 0.7, 2.3], rotation: [-0.55, 0, 0] },
    superior: { position: [0, 2.1, -2.37], rotation: [0.3, Math.PI, 0] },
    inferior: { position: [0, -6.2, -2.18], rotation: [-0.17, Math.PI, 0] },
    espalda_centro: { position: [0, -2.7, -2.39], rotation: [0, Math.PI, 0] },
  },
  trasera: {
    centro: { position: [0, -2.7, -2.39], rotation: [0, Math.PI, 0] },
    superior: { position: [0, 2.1, -2.37], rotation: [0.3, Math.PI, 0] },
    inferior: { position: [0, -6.2, -2.18], rotation: [-0.17, Math.PI, 0] },
    numero: { position: [0, 0.0, -2.53], rotation: [-0.08, Math.PI, 0] }, // ✅ Número
    logo_centro: { position: [0, -2.7, -2.39], rotation: [0, Math.PI, 0] },
  },
};

export default function Camiseta3DVista() {
  // 🎨 Estado de colores
  const [colors, setColors] = useState({
    cuello: "#ffffff",
    manga_derecha: "#ffffff",
    manga_izquierda: "#ffffff",
    cintura: "#ffffff",
    delantera: "#ffffff",
    trasera: "#ffffff",
    puno_izq: "#ffffff",
    puno_der: "#ffffff",
  });

  // 🖼️ Estado de texturas
  const [textures, setTextures] = useState({
    delantera: "/texturas/textura_delantera.png",
    trasera: "/texturas/textura_trasera.png",
    manga_izquierda: "/texturas/textura_manga_izq.png",
    manga_derecha: "/texturas/textura_manga_der.png",
  });

  // ⚙️ Estado de texturas (opciones)
  const [texOpts, setTexOpts] = useState({
    delantera: { repeatX: 1, repeatY: 1, rotationDeg: 0, offsetX: 0, offsetY: 0, mirrored: false },
    trasera: { repeatX: 1, repeatY: 1, rotationDeg: 0, offsetX: 0, offsetY: 0, mirrored: false },
    manga_izquierda: { repeatX: 1, repeatY: 1, rotationDeg: 0, offsetX: 0, offsetY: 0, mirrored: false },
    manga_derecha: { repeatX: 1, repeatY: 1, rotationDeg: 0, offsetX: 0, offsetY: 0, mirrored: false },
  });

  // 📝 Estado de textos y logos
  const [texts, setTexts] = useState([]);
  const [logos, setLogos] = useState([]);

  const [currentElement, setCurrentElement] = useState({
    type: "text",
    content: "",
    color: "#000000",
    fontSize: 0.3,
    scale: 0.4,
    position: "centro",
    side: "delantera",
    rotationZ: 0,
    font:"/fonts/Anta-Regular.ttf",
  });

  const [selectedElement, setSelectedElement] = useState(null);

  // 🖼️ Subir textura
  const handleTextureUpload = (event, side) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTextures((prev) => ({ ...prev, [side]: url }));
    }
  };

  // 📝 Agregar texto o número
  const handleAddText = () => {
    if (currentElement.content.trim()) {
      let posData =
        currentElement.type === "numero"
          ? POSICIONES.trasera.numero // ✅ números siempre en la espalda
          : POSICIONES[currentElement.side][currentElement.position];

      const newText = {
        id: Date.now(),
        type: currentElement.type, // puede ser "text" o "numero"
        content: currentElement.content,
        color: currentElement.color,
        fontSize: currentElement.fontSize,
        font: currentElement.font,
        position: posData.position,
        rotation: [
          posData.rotation[0],
          posData.rotation[1],
          (currentElement.rotationZ || 0) * (Math.PI / 180),
        ],
        side: currentElement.type === "numero" ? "trasera" : currentElement.side,
      };

      setTexts((prev) => [...prev, newText]);
      setSelectedElement({ type: "text", id: newText.id });
      setCurrentElement((prev) => ({ ...prev, content: "" }));
    }
  };

  // 🖼️ Subir logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const posData = POSICIONES[currentElement.side][currentElement.position];
      const newLogo = {
        id: Date.now(),
        type: "logo",
        url,
        position: posData.position,
        scale: currentElement.scale,
        rotation: [
          posData.rotation[0],
          posData.rotation[1],
          (currentElement.rotationZ || 0) * (Math.PI / 180),
        ],
        side: currentElement.side,
      };
      setLogos((prev) => [...prev, newLogo]);
      setSelectedElement({ type: "logo", id: newLogo.id });
    }
  };

  // ❌ Eliminar elemento
  const handleRemoveElement = (id, type) => {
    if (type === "text") setTexts((prev) => prev.filter((t) => t.id !== id));
    else setLogos((prev) => prev.filter((l) => l.id !== id));
    if (selectedElement?.id === id) setSelectedElement(null);
  };

  // 🔼🔽 Mover elemento seleccionado
  const moveSelectedElement = (direction) => {
    if (!selectedElement) return;
    const amount = 0.1;

    if (selectedElement.type === "text") {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === selectedElement.id
            ? { ...t, position: [t.position[0], t.position[1] + (direction === "up" ? amount : -amount), t.position[2]] }
            : t
        )
      );
    } else {
      setLogos((prev) =>
        prev.map((l) =>
          l.id === selectedElement.id
            ? { ...l, position: [l.position[0], l.position[1] + (direction === "up" ? amount : -amount), l.position[2]] }
            : l
        )
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-blue-50 p-6 flex gap-6">
        {/* Columna izquierda con scroll */}
        <div className="w-[550px] bg-gray-50 rounded-xl shadow p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)]">
          <PanelAcordeon title="🎨 Colores de camiseta" defaultOpen={true}>
            <PanelColores
              colors={colors}
              setColors={setColors}
              handleTextureUpload={handleTextureUpload}
              setTextures={setTextures}
            />
          </PanelAcordeon>

          <PanelAcordeon title="🖼️ Texturas">
            <PanelTexturas
              textures={textures}
              texOpts={texOpts}
              setTextures={setTextures}
              setTexOpts={setTexOpts}
            />
          </PanelAcordeon>

          <PanelAcordeon title="✍️ Texto">
            <PanelTexto
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
              handleAddText={handleAddText}
              selectedElement={selectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              texts={texts}
              setSelectedElement={setSelectedElement}
            />
          </PanelAcordeon>

          <PanelAcordeon title="🏞️ Logos">
            <PanelLogos
              handleLogoUpload={handleLogoUpload}
              logos={logos}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
            />
          </PanelAcordeon>

          <PanelAcordeon title="🔢 Número">
            <PanelNumero
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
              handleAddText={handleAddText}
              selectedElement={selectedElement}
              moveSelectedElement={moveSelectedElement}
              handleRemoveElement={handleRemoveElement}
              texts={texts}
              setSelectedElement={setSelectedElement}
            />
          </PanelAcordeon>
        </div>

        {/* Vista central fija */}
        <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow">
          <Canvas
            shadows
            camera={{ position: [0, 2, 5], fov: 45 }}
            style={{ width: "100%", height: "600px" }}
            onClick={() => setSelectedElement(null)}
          >
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <ModeloCamiseta colors={colors} textures={textures} texOpts={texOpts} />

                {texts.map((t) => (
                  <Texto
                    key={t.id}
                    {...t}
                    onSelect={() => setSelectedElement({ type: "text", id: t.id })}
                  />
                ))}

                {logos.map((l) => (
                  <Logo
                    key={l.id}
                    {...l}
                    onSelect={() => setSelectedElement({ type: "logo", id: l.id })}
                  />
                ))}
              </Stage>
            </Suspense>
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>
      </main>

      <Footer />
    </div>
  );
}
