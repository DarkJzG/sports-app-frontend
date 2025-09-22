// src/pages/DisenarPrendas/Camiseta3DViewer.jsx
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useTexture, Text } from "@react-three/drei";

// 🟢 Imagen blanca de 1x1 pixel
const WHITE_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// 🟢 POSICIONES CON ROTACIÓN (coordenadas 3D + rotación)
const POSICIONES = {
  delantera: {
    pecho_izquierdo: {
      position: [-1.7, 0.7, 2.30],
      rotation: [-0.55, 0, 0] // Frente
    },
    pecho_derecho: {
      position: [1.7, 0.7, 2.30],
      rotation: [-0.55, 0, 0] // Frente
    },
    centro: {
      position: [0, 0.7, 2.30],
      rotation: [-0.55, 0, 0] // Frente
    },
  },
  trasera: {
    centro: {
      position: [0, 0.2, -2.47],
      rotation: [0, Math.PI, 0] // Atrás (180°)
    },
    superior: {
      position: [0, 2.1, -2.37],
      rotation: [0.30, Math.PI, 0] // Atrás (180°)
    },
    inferior: {
      position: [0, -6.2, -2.18],
      rotation: [-0.17, Math.PI, 0] // Atrás (180°)
    }
  }
};

// 🟢 Componente Logo con rotación
function Logo({ url, position, scale, rotation }) {
  const texture = useTexture(url);
  
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[scale, scale * (texture.image.height / texture.image.width)]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        opacity={1}
        alphaTest={0.1}
      />
    </mesh>
  );
}

// 🟢 Modelo base CON ESCALA CORREGIDA
function CamisetaModel({ colors, textures }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v12.glb");
  
  const delanteraTexture = useTexture(textures.delantera || WHITE_PIXEL);
  const traseraTexture = useTexture(textures.trasera || WHITE_PIXEL);

  return (
    <group scale={0.02} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 0]}>
      {/* ✅ CORREGIDO: scale={0.02} en lugar de scale={2} */}
      
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

// 🟢 Viewer Principal COMPLETAMENTE CORREGIDO
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
    fontSize: 0.3,        // ✅ CORREGIDO: tamaño normalizado
    scale: 0.4,           // ✅ CORREGIDO: escala normalizada
    position: "centro",
    side: "delantera"
  });

  // 🎯 MANEJAR SUBIDA DE LOGO
  const handleLogoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const posData = POSICIONES[currentElement.side][currentElement.position];
        const newLogo = {
          id: Date.now(),
          type: "logo",
          url: url,
          position: posData.position,
          scale: currentElement.scale,
          rotation: posData.rotation, // 👈 Rotación automática
          side: currentElement.side
        };
        setLogos(prev => [...prev, newLogo]);
      }
    };

  // 🎯 AGREGAR TEXTO
  const handleAddText = () => {
    if (currentElement.content.trim()) {
      const posData = POSICIONES[currentElement.side][currentElement.position];
      const newText = {
        id: Date.now(),
        type: "text",
        content: currentElement.content,
        color: currentElement.color,
        fontSize: currentElement.fontSize,
        position: posData.position,
        rotation: posData.rotation, // 👈 Rotación automática
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
              min="0.1"
              max="0.5"
              step="0.05"
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
        camera={{ position: [0, 2, 5], fov: 45 }}
        style={{ width: "600px", height: "600px", background: "#bfbfbfff" }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {/* Camiseta base */}
            <CamisetaModel colors={colors} textures={textures} />
            
            {/* 📝 Textos agregados CON ROTACIÓN */}
            {texts.map(text => (
              <Text
                key={text.id}
                position={text.position}
                fontSize={text.fontSize}
                color={text.color}
                rotation={text.rotation} // 👈 Rotación aplicada
                anchorX="center"
                anchorY="middle"
              >
                {text.content}
              </Text>
            ))}
            
            {/* 🖼️ Logos agregados CON ROTACIÓN */}
            {logos.map(logo => (
              <Logo
                key={logo.id}
                url={logo.url}
                position={logo.position}
                scale={logo.scale}
                rotation={logo.rotation} // 👈 Rotación aplicada
              />
            ))}
          </Stage>
        </Suspense>
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}