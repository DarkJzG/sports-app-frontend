// src/pages/DisenarPrendas/Camiseta3DViewer.jsx
import React, { useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useTexture, Text } from "@react-three/drei";

// 🟢 Imagen blanca de 1x1 pixel
const WHITE_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// 🟢 POSICIONES PREDEFINIDAS (coordenadas 3D)
const POSICIONES = {
  delantera: {
    pecho_izquierdo: [170, 180, 260],   // x, y, z
    pecho_derecho: [-170, 180, 260],      // x, y, z
    centro: [0, 1.8, 278],               // x, y, z
  },
  trasera: {
    centro: [0, -90, -245],              // x, y, z
    superior: [0, 320, -245],            // x, y, z
    inferior: [0, -520, -245],            // x, y, z
  }
};

// 🟢 Componente Logo como plano independiente
function Logo({ url, position, scale, rotation }) {
  const texture = useTexture(url);
  
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[scale, scale * (texture.image.height / texture.image.width)]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        opacity={1}
        alphaTest={0.5}
      />
    </mesh>
  );
}

// 🟢 Modelo base SIN modificaciones
function CamisetaModel({ colors, textures }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v5.glb");
  
  const delanteraTexture = useTexture(textures.delantera || WHITE_PIXEL);
  const traseraTexture = useTexture(textures.trasera || WHITE_PIXEL);

  return (
    <group scale={2} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 10]}>
      
      {/* Partes básicas de la camiseta */}
      <mesh geometry={nodes.cuello.geometry}>
        <meshStandardMaterial color={colors.cuello} />
      </mesh>

      <mesh geometry={nodes.manga_derecha.geometry}>
        <meshStandardMaterial color={colors.manga_derecha} />
      </mesh>

      <mesh geometry={nodes.manga_izquierda.geometry}>
        <meshStandardMaterial color={colors.manga_izquierda} />
      </mesh>

      <mesh geometry={nodes.cintura.geometry}>
        <meshStandardMaterial color={colors.cintura} />
      </mesh>

      <mesh geometry={nodes.puno_izq.geometry}>
        <meshStandardMaterial color={colors.puno_izq} />
      </mesh>

      <mesh geometry={nodes.puno_der.geometry}>
        <meshStandardMaterial color={colors.puno_der} />
      </mesh>

      {/* Delantera y trasera base */}
      <mesh geometry={nodes.delantera.geometry}>
        <meshStandardMaterial 
          color={colors.delantera} 
          map={textures.delantera ? delanteraTexture : null}
        />
      </mesh>

      <mesh geometry={nodes.trasera.geometry}>
        <meshStandardMaterial 
          color={colors.trasera} 
          map={textures.trasera ? traseraTexture : null}
        />
      </mesh>
    </group>
  );
}

// 🟢 Viewer Principal MEJORADO
export default function Camiseta3DViewer() {
  const [colors, setColors] = useState({
    cuello: "#ffffff", manga_derecha: "#ffffff", manga_izquierda: "#ffffff",
    cintura: "#ffffff", delantera: "#ffffff", trasera: "#ffffff",
    puno_izq: "#ffffff", puno_der: "#ffffff",
  });

  const [textures, setTextures] = useState({
    delantera: null, trasera: null
  });

  const [texts, setTexts] = useState([]);
  const [logos, setLogos] = useState([]);
  const [currentElement, setCurrentElement] = useState({
    type: "text", // "text" or "logo"
    content: "",
    color: "#000000",
    fontSize: 250,
    scale: 7,
    position: "centro",
    side: "delantera"
  });

  // 🎯 MANEJAR SUBIDA DE LOGO
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newLogo = {
        id: Date.now(),
        type: "logo",
        url: url,
        position: POSICIONES[currentElement.side][currentElement.position],
        scale: currentElement.scale,
        rotation: currentElement.side === "trasera" ? [0, Math.PI, 0] : [0, 0, 0],
        side: currentElement.side
      };
      setLogos(prev => [...prev, newLogo]);
    }
  };

  // 🎯 AGREGAR TEXTO
  const handleAddText = () => {
    if (currentElement.content.trim()) {
      const newText = {
        id: Date.now(),
        type: "text",
        content: currentElement.content,
        color: currentElement.color,
        fontSize: currentElement.fontSize,
        position: POSICIONES[currentElement.side][currentElement.position],
        rotation: currentElement.side === "trasera" ? [0, Math.PI, 0] : [0, 0, 0],
        side: currentElement.side
      };
      setTexts(prev => [...prev, newText]);
      setCurrentElement(prev => ({ ...prev, content: "" }));
    }
  };

  // 🎯 ELIMINAR ELEMENTO
  const handleRemoveElement = (id, type) => {
    if (type === "text") {
      setTexts(prev => prev.filter(text => text.id !== id));
    } else {
      setLogos(prev => prev.filter(logo => logo.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* 🎨 PANEL DE CONTROL MEJORADO */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "350px" }}>
        
        <h3>📍 Posicionamiento</h3>
        <div>
          <label>Lado: </label>
          <select 
            value={currentElement.side} 
            onChange={(e) => setCurrentElement(prev => ({ ...prev, side: e.target.value }))}
          >
            <option value="delantera">Delantera</option>
            <option value="trasera">Trasera</option>
          </select>
        </div>

        <div>
          <label>Posición: </label>
          <select 
            value={currentElement.position} 
            onChange={(e) => setCurrentElement(prev => ({ ...prev, position: e.target.value }))}
          >
            {Object.keys(POSICIONES[currentElement.side]).map(pos => (
              <option key={pos} value={pos}>{pos.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo: </label>
          <select 
            value={currentElement.type} 
            onChange={(e) => setCurrentElement(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="text">Texto</option>
            <option value="logo">Logo</option>
          </select>
        </div>

        {currentElement.type === "text" ? (
          <>
            <h3>📝 Texto</h3>
            <input
              type="text"
              value={currentElement.content}
              onChange={(e) => setCurrentElement(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Escribe tu texto"
            />
            <input
              type="color"
              value={currentElement.color}
              onChange={(e) => setCurrentElement(prev => ({ ...prev, color: e.target.value }))}
            />
            <label>Tamaño: {currentElement.fontSize}</label>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={currentElement.fontSize}
              onChange={(e) => setCurrentElement(prev => ({ ...prev, fontSize: parseFloat(e.target.value) }))}
            />
            <button onClick={handleAddText}>Agregar Texto</button>
          </>
        ) : (
          <>
            <h3>🖼️ Logo</h3>
            <label>Escala: {currentElement.scale}</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={currentElement.scale}
              onChange={(e) => setCurrentElement(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
            />
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </>
        )}

        {/* 📋 LISTA DE ELEMENTOS AGREGADOS */}
        <h3>📋 Elementos</h3>
        {texts.map(text => (
          <div key={text.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📝 "{text.content}" ({text.side})</span>
            <button onClick={() => handleRemoveElement(text.id, "text")}>❌</button>
          </div>
        ))}
        
        {logos.map(logo => (
          <div key={logo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🖼️ Logo ({logo.side})</span>
            <button onClick={() => handleRemoveElement(logo.id, "logo")}>❌</button>
          </div>
        ))}

      </div>

      {/* 🟢 CANVAS 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        style={{ width: "600px", height: "600px", background: "#bfbfbfff" }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {/* Camiseta base */}
            <CamisetaModel colors={colors} textures={textures} />
            
            {/* 📝 Textos agregados */}
            {texts.map(text => (
              <Text
                key={text.id}
                position={text.position}
                fontSize={text.fontSize}
                color={text.color}
                rotation={text.rotation}
                anchorX="center"
                anchorY="middle"
              >
                {text.content}
              </Text>
            ))}
            
            {/* 🖼️ Logos agregados */}
            {logos.map(logo => (
              <Logo
                key={logo.id}
                url={logo.url}
                position={logo.position}
                scale={logo.scale}
                rotation={logo.rotation}
              />
            ))}
          </Stage>
        </Suspense>
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} rotateSpeed={1} />
      </Canvas>
    </div>
  );
}