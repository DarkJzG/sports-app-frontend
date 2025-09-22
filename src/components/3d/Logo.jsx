// src/components/3d/Logo.jsx
import React from "react";
import { useTexture } from "@react-three/drei";

export default function Logo({ url, position, scale, rotation, onSelect }) {
  const texture = useTexture(url);

  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(); // ✅ llamar al seleccionar
      }}
    >
      <planeGeometry args={[scale, scale * (texture.image?.height / texture.image?.width || 1)]} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  );
}
