// src/components/Prenda3D/TextoFuentes.jsx
import React, { useEffect, useRef } from 'react';
import { extend } from '@react-three/fiber';
import { Text } from 'troika-three-text';

// Extender Three.js con troika-three-text
extend({ Text });

export default function TextoFuentes({
  text = "",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#ffffff",
  fontSize = 0.1,
  fontFamily = "Inter",
  outlineWidth = 0,
  outlineColor = "#000000",
  depthOffset = -5,
  ...props
}) {
  const textRef = useRef();

  // Mapeo de nombres de fuente a rutas de archivos
  const fontPaths = {
    'Inter': null, // Fuente por defecto de troika
    'Rubik': '/fonts/Rubik-SemiBold.ttf',
    'Rock3D': '/fonts/Rock3D-Regular.ttf',
    'Anta': '/fonts/Anta-Regular.ttf',
    'Tourney': '/fonts/Tourney_Condensed-ExtraLight.ttf',
    'Fascinate': '/fonts/Fascinate-Regular.ttf',
    'Limelight': '/fonts/Limelight-Regular.ttf',
    'MoiraiOne': '/fonts/MoiraiOne-Regular.ttf'
  };

  useEffect(() => {
    if (!textRef.current) return;

    const mesh = textRef.current;
    
    // Configurar propiedades del texto
    mesh.text = text;
    mesh.fontSize = fontSize;
    mesh.color = color;
    mesh.anchorX = 'center';
    mesh.anchorY = 'middle';
    mesh.depthOffset = depthOffset;
    
    // Configurar fuente personalizada
    const fontPath = fontPaths[fontFamily];
    if (fontPath) {
      mesh.font = fontPath;
    }
    
    // Configurar outline (stroke)
    if (outlineWidth > 0) {
      mesh.outlineWidth = `${outlineWidth}%`;
      mesh.outlineColor = outlineColor;
    }
    
    // Sincronizar cambios
    mesh.sync();
    
  }, [text, fontSize, color, fontFamily, outlineWidth, outlineColor, depthOffset]);

  return (
    <text
      ref={textRef}
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
    />
  );
}
