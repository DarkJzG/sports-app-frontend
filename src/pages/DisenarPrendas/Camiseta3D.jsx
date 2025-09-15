// src/pages/DisenarPrendas/Camiseta3DViewer.jsx
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// 🟢 Modelo con partes separadas
function CamisetaModel({ colors }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v5.glb");

  return (
    <group scale={2} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 10]}>
      {/* Cuello */}
      <mesh geometry={nodes.cuello.geometry}>
        <meshStandardMaterial color={colors.cuello} />
      </mesh>

      {/* Manga derecha */}
      <mesh geometry={nodes.manga_derecha.geometry}>
        <meshStandardMaterial color={colors.manga_derecha} />
      </mesh>

      {/* Manga izquierda */}
      <mesh geometry={nodes.manga_izquierda.geometry}>
        <meshStandardMaterial color={colors.manga_izquierda} />
      </mesh>

      {/* Cintura */}
      <mesh geometry={nodes.cintura.geometry}>
        <meshStandardMaterial color={colors.cintura} />
      </mesh>

      {/* Delantera */}
      <mesh geometry={nodes.delantera.geometry}>
        <meshStandardMaterial color={colors.delantera} />
      </mesh>

      {/* Trasera */}
      <mesh geometry={nodes.trasera.geometry}>
        <meshStandardMaterial color={colors.trasera} />
      </mesh>

      {/* Puño izquierdo */}
      <mesh geometry={nodes.puno_izq.geometry}>
        <meshStandardMaterial color={colors.puno_izq} />
      </mesh>

      {/* Puño derecho */}
      <mesh geometry={nodes.puno_der.geometry}>
        <meshStandardMaterial color={colors.puno_der} />
      </mesh>
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

  const handleColorChange = (parte, color) => {
    setColors((prev) => ({ ...prev, [parte]: color }));
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* 🎨 Panel de colores */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
      </div>

      {/* 🟢 Canvas 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        style={{ width: "600px", height: "600px", background: "#bfbfbfff" }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <CamisetaModel colors={colors} />
          </Stage>
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          rotateSpeed={1} // Velocidad de rotación
          minPolarAngle={0} // Límite inferior de rotación vertical
          maxPolarAngle={Math.PI} // Límite superior de rotación vertical
        />
      </Canvas>
    </div>
  );
}
