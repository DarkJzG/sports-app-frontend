// src/pages/DisenarPrendas/Camiseta3DViewer.jsx
import React, { useState, Suspense, useRef } from "react";
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
      position: [0, -2.7, -2.39],
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

// 🟢 Componente Logo con rotación y capacidad de selección
function Logo({ url, position, scale, rotation, isSelected  }) {
  const texture = useTexture(url);
  
  return (
    <mesh 
      position={position} 
      rotation={rotation}
      
    >
      <planeGeometry args={[scale, scale * (texture.image.height / texture.image.width)]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        opacity={1}
        alphaTest={0.1}
      />
      {/* Resaltado cuando está seleccionado */}
      {isSelected && (
        <mesh>
          <planeGeometry args={[scale * 1.1, scale * 1.1 * (texture.image.height / texture.image.width)]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent={true}
            opacity={0.3}
            wireframe={true}
          />
        </mesh>
      )}
    </mesh>
  );
}

// 🟢 Componente Texto con capacidad de selección
function SelectableText({ content, position, fontSize, color, rotation, isSelected, ...props }) {
  return (
    <group 
      position={position}
    >
      <Text
        fontSize={fontSize}
        color={color}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        {...props}
      >
        {content}
      </Text>
      {/* Resaltado cuando está seleccionado */}
      {isSelected && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[content.length * fontSize * 0.5, fontSize * 1.2]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent={true}
            opacity={0.3}
            wireframe={true}
          />
        </mesh>
      )}
    </group>
  );
}

// 🟢 Modelo base CON ESCALA CORREGIDA
function CamisetaModel({ colors, textures }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v12.glb");
  
  const delanteraTexture = useTexture(textures.delantera || WHITE_PIXEL);
  const traseraTexture = useTexture(textures.trasera || WHITE_PIXEL);

  return (
    <group scale={0.02} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 0]}>
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

// 🟢 Viewer Principal CON MOVIMIENTO DE ELEMENTOS
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
    type: "text",
    content: "",
    color: "#000000",
    fontSize: 0.3,
    scale: 0.4,
    position: "centro",
    side: "delantera"
  });

  const [selectedElement, setSelectedElement] = useState(null); // {type: "text"|"logo", id: number}

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
        rotation: posData.rotation,
        side: currentElement.side
      };
      setLogos(prev => [...prev, newLogo]);
      setSelectedElement({ type: "logo", id: newLogo.id });
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
        rotation: posData.rotation,
        side: currentElement.side
      };
      setTexts(prev => [...prev, newText]);
      setCurrentElement(prev => ({ ...prev, content: "" }));
      setSelectedElement({ type: "text", id: newText.id });
    }
  };

  // 🎯 ELIMINAR ELEMENTO
  const handleRemoveElement = (id, type) => {
    if (type === "text") {
      setTexts(prev => prev.filter(text => text.id !== id));
    } else {
      setLogos(prev => prev.filter(logo => logo.id !== id));
    }
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
  };

  // 🎯 MOVER ELEMENTO SELECCIONADO
  const moveSelectedElement = (direction) => {
    if (!selectedElement) return;
    
    const amount = 0.1; // Cantidad de movimiento
    
    if (selectedElement.type === "text") {
      setTexts(prev => prev.map(text => {
        if (text.id === selectedElement.id) {
          return {
            ...text,
            position: [text.position[0], text.position[1] + (direction === 'up' ? amount : -amount), text.position[2]]
          };
        }
        return text;
      }));
    } else {
      setLogos(prev => prev.map(logo => {
        if (logo.id === selectedElement.id) {
          return {
            ...logo,
            position: [logo.position[0], logo.position[1] + (direction === 'up' ? amount : -amount), logo.position[2]]
          };
        }
        return logo;
      }));
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

        {/* 🎯 CONTROLES DE MOVIMIENTO */}
        {selectedElement && (
          <>
            <h3>🎯 Ajustar Posición</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={() => moveSelectedElement('up')}
                style={{ padding: "8px 12px", flex: 1 }}
              >
                ↑ Subir
              </button>
              <button 
                onClick={() => moveSelectedElement('down')}
                style={{ padding: "8px 12px", flex: 1 }}
              >
                ↓ Bajar
              </button>
            </div>
            <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
              Elemento seleccionado: {selectedElement.type} #{selectedElement.id}
            </div>
          </>
        )}

        {/* 📋 LISTA DE ELEMENTOS AGREGADOS */}
        <h3>📋 Elementos</h3>
        {texts.map(text => (
          <div 
            key={text.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: selectedElement && selectedElement.type === "text" && selectedElement.id === text.id ? '#e6f7ff' : 'transparent',
              padding: '5px',
              borderRadius: '4px'
            }}
          >
            <span>📝 "{text.content}" ({text.side})</span>
            <div>
              <button 
                onClick={() => setSelectedElement({ type: "text", id: text.id })}
                style={{ marginRight: '5px' }}
              >
                ✏️
              </button>
              <button onClick={() => handleRemoveElement(text.id, "text")}>❌</button>
            </div>
          </div>
        ))}
        
        {logos.map(logo => (
          <div 
            key={logo.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: selectedElement && selectedElement.type === "logo" && selectedElement.id === logo.id ? '#e6f7ff' : 'transparent',
              padding: '5px',
              borderRadius: '4px'
            }}
          >
            <span>🖼️ Logo ({logo.side})</span>
            <div>
              <button 
                onClick={() => setSelectedElement({ type: "logo", id: logo.id })}
                style={{ marginRight: '5px' }}
              >
                ✏️
              </button>
              <button onClick={() => handleRemoveElement(logo.id, "logo")}>❌</button>
            </div>
          </div>
        ))}

      </div>

      {/* 🟢 CANVAS 3D */}
      <div style={{ position: "relative" }}>
        <Canvas
          shadows
          camera={{ position: [0, 2, 5], fov: 45 }}
          style={{ width: "600px", height: "600px", background: "#bfbfbfff" }}
          onClick={() => setSelectedElement(null)} // Deseleccionar al hacer clic en el canvas
        >
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              {/* Camiseta base */}
              <CamisetaModel colors={colors} textures={textures} />
              
              {/* 📝 Textos agregados CON ROTACIÓN */}
              {texts.map(text => (
                <SelectableText
                  key={text.id}
                  content={text.content}
                  position={text.position}
                  fontSize={text.fontSize}
                  color={text.color}
                  rotation={text.rotation}
                  isSelected={selectedElement && selectedElement.type === "text" && selectedElement.id === text.id}
                  onClick={() => setSelectedElement({ type: "text", id: text.id })}
                />
              ))}
              
              {/* 🖼️ Logos agregados CON ROTACIÓN */}
              {logos.map(logo => (
                <Logo
                  key={logo.id}
                  url={logo.url}
                  position={logo.position}
                  scale={logo.scale}
                  rotation={logo.rotation}
                  isSelected={selectedElement && selectedElement.type === "logo" && selectedElement.id === logo.id}
                  onClick={() => setSelectedElement({ type: "logo", id: logo.id })}
                />
              ))}
            </Stage>
          </Suspense>
          
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>

        {/* Indicador de instrucciones */}
        {!selectedElement && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "12px"
          }}>
            💡 Haz clic en un texto o logo para seleccionarlo y ajustar su posición
          </div>
        )}
      </div>
    </div>
  );
}