// src/components/3d/Texto.jsx
import React from "react";
import { Text } from "@react-three/drei";

export default function Texto({ content, position, fontSize, color, rotation, font, onSelect }) {
  return (
    <group position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        font={font}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect(); // ✅ llamar al seleccionar
        }}
      >
        {content}
      </Text>
    </group>
  );
}
