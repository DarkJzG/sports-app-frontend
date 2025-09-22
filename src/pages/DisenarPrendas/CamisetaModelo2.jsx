// src/pages/DisenarPrendas/Camiseta3DViewer.jsx
import React, { useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useTexture, Text } from "@react-three/drei";


// 🟢 Imagen blanca de 1x1 pixel en base64
const WHITE_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// 🟢 Componente Decal para logos
function Decal({ url, position, scale, rotation }) {
  const texture = useTexture(url);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[scale, scale * (texture.image.height / texture.image.width)]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// 🟢 Modelo con partes separadas y texturas
function CamisetaModel({ colors, textures, decals, texts }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v5.glb");
  const groupRef = useRef();

  // Cargar texturas SIEMPRE 
  const delanteraTexture = useTexture(textures.delantera || WHITE_PIXEL);
  const traseraTexture = useTexture(textures.trasera || WHITE_PIXEL);

  return (
    <group ref={groupRef} scale={2} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 10]}>
      
      {/* Cuello */}
      <mesh geometry={nodes.cuello.geometry}>
        <meshStandardMaterial color={colors.cuello} />
      </mesh>

      {/* Mangas */}
      <mesh geometry={nodes.manga_derecha.geometry}>
        <meshStandardMaterial color={colors.manga_derecha} />
      </mesh>
      <mesh geometry={nodes.manga_izquierda.geometry}>
        <meshStandardMaterial color={colors.manga_izquierda} />
      </mesh>

      {/* Cintura */}
      <mesh geometry={nodes.cintura.geometry}>
        <meshStandardMaterial color={colors.cintura} />
      </mesh>

      {/* Puños */}
      <mesh geometry={nodes.puno_izq.geometry}>
        <meshStandardMaterial color={colors.puno_izq} />
      </mesh>
      <mesh geometry={nodes.puno_der.geometry}>
        <meshStandardMaterial color={colors.puno_der} />
      </mesh>

      {/* DELANTERA con textura o color */}
      <mesh geometry={nodes.delantera.geometry}>
        <meshStandardMaterial 
          color={colors.delantera} 
          map={textures.delantera ? delanteraTexture : null}
        />
      </mesh>

      {/* TRASERA con textura o color */}
      <mesh geometry={nodes.trasera.geometry}>
        <meshStandardMaterial 
          color={colors.trasera} 
          map={textures.trasera ? traseraTexture : null}
        />
      </mesh>

      {/* TEXTO en la delantera */}
      {texts.delantera && texts.delantera.map((text, index) => (
        <Text
          key={index}
          position={text.position || [0, 1.8, 278]}
          fontSize={text.fontSize || 270}
          color={text.color || "#000000"}
          anchorX="center"
          anchorY="middle"
        >
          {text.content}
        </Text>
      ))}

      {/* TEXTO en la trasera */}
      {texts.trasera && texts.trasera.map((text, index) => (
        <Text
          key={index}
          position={text.position || [0, 1.5, -0.1]}
          fontSize={text.fontSize || 0.2}
          color={text.color || "#000000"}
          rotation={[0, Math.PI, 0]}
          anchorX="center"
          anchorY="middle"
        >
          {text.content}
        </Text>
      ))}

      {/* DECAL/LOGOS en la delantera */}
      {decals.delantera && decals.delantera.map((decal, index) => (
        <Decal
          key={index}
          position={decal.position || [0, 1.2, 0.1]}
          scale={decal.scale || 0.3}
          url={decal.image}
        />
      ))}

      {/* DECAL/LOGOS en la trasera */}
      {decals.trasera && decals.trasera.map((decal, index) => (
        <Decal
          key={index}
          position={decal.position || [0, 1.2, -0.1]}
          scale={decal.scale || 0.3}
          url={decal.image}
          rotation={[0, Math.PI, 0]}
        />
      ))}

    </group>
  );
}

// 🟢 Viewer principal
export default function Camiseta3DViewer() {
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

  const [textures, setTextures] = useState({
    delantera: null,
    trasera: null
  });

  const [texts, setTexts] = useState({
    delantera: [],
    trasera: []
  });

  const [decals, setDecals] = useState({
    delantera: [],
    trasera: []
  });

  const [currentText, setCurrentText] = useState("");
  const [currentTextColor, setCurrentTextColor] = useState("#000000");
  const [currentTextSize, setCurrentTextSize] = useState(0.2);
  const [currentTextPosition, setCurrentTextPosition] = useState("delantera");

  // Manejar cambio de color
  const handleColorChange = (parte, color) => {
    setColors((prev) => ({ ...prev, [parte]: color }));
  };

  // Manejar subida de imagen como textura
  const handleImageUpload = (parte, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTextures(prev => ({ ...prev, [parte]: url }));
    }
  };

  // Remover textura
  const handleRemoveTexture = (parte) => {
    setTextures(prev => ({ ...prev, [parte]: null }));
  };

  // Manejar subida de logo/escudo
  const handleDecalUpload = (parte, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDecals(prev => ({
        ...prev,
        [parte]: [...prev[parte], { 
          image: url, 
          position: [0, 1.2, parte === 'delantera' ? 0.1 : -0.1],
          scale: 0.3 
        }]
      }));
    }
  };

  // Remover decal
  const handleRemoveDecal = (parte, index) => {
    setDecals(prev => ({
      ...prev,
      [parte]: prev[parte].filter((_, i) => i !== index)
    }));
  };

  // Agregar texto
  const handleAddText = () => {
    if (currentText.trim()) {
      setTexts(prev => ({
        ...prev,
        [currentTextPosition]: [...prev[currentTextPosition], {
          content: currentText,
          color: currentTextColor,
          fontSize: currentTextSize,
          position: [0, 1.5, currentTextPosition === 'delantera' ? 0.1 : -0.1]
        }]
      }));
      setCurrentText("");
    }
  };

  // Remover texto
  const handleRemoveText = (parte, index) => {
    setTexts(prev => ({
      ...prev,
      [parte]: prev[parte].filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* 🎨 Panel de controles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "300px" }}>
        
        {/* Colores básicos */}
        <h3>Colores</h3>
        {Object.keys(colors).map((parte) => (
          <div key={parte}>
            <label>{parte}: </label>
            <input
              type="color"
              value={colors[parte]}
              onChange={(e) => handleColorChange(parte, e.target.value)}
            />
          </div>
        ))}

        {/* Texturas para delantera/trasera */}
        <h3>Texturas</h3>
        <div>
          <label>Delantera (imagen): </label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('delantera', e)} />
          {textures.delantera && (
            <button onClick={() => handleRemoveTexture('delantera')}>Quitar</button>
          )}
        </div>
        <div>
          <label>Trasera (imagen): </label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('trasera', e)} />
          {textures.trasera && (
            <button onClick={() => handleRemoveTexture('trasera')}>Quitar</button>
          )}
        </div>

        {/* Agregar texto */}
        <h3>Texto</h3>
        <div>
          <label>Texto: </label>
          <input
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Escribe tu texto"
          />
        </div>
        <div>
          <label>Color texto: </label>
          <input
            type="color"
            value={currentTextColor}
            onChange={(e) => setCurrentTextColor(e.target.value)}
          />
        </div>
        <div>
          <label>Tamaño: </label>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            value={currentTextSize}
            onChange={(e) => setCurrentTextSize(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Posición: </label>
          <select value={currentTextPosition} onChange={(e) => setCurrentTextPosition(e.target.value)}>
            <option value="delantera">Delantera</option>
            <option value="trasera">Trasera</option>
          </select>
        </div>
        <button onClick={handleAddText}>Agregar Texto</button>

        {/* Lista de textos agregados */}
        {(['delantera', 'trasera']).map(parte => (
          texts[parte].map((text, index) => (
            <div key={`${parte}-${index}`}>
              <span>{text.content} ({parte})</span>
              <button onClick={() => handleRemoveText(parte, index)}>X</button>
            </div>
          ))
        ))}

        {/* Logos/escudos */}
        <h3>Logos/Escudos</h3>
        <div>
          <label>Logo Delantera: </label>
          <input type="file" accept="image/*" onChange={(e) => handleDecalUpload('delantera', e)} />
        </div>
        <div>
          <label>Logo Trasera: </label>
          <input type="file" accept="image/*" onChange={(e) => handleDecalUpload('trasera', e)} />
        </div>

      </div>

      {/* 🟢 Canvas 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        style={{ width: "600px", height: "600px", background: "#bfbfbfff" }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <CamisetaModel 
              colors={colors} 
              textures={textures}
              texts={texts}
              decals={decals}
            />
          </Stage>
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          rotateSpeed={1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
}