// src/components/Prenda3D/ModeloPrenda.jsx
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { useGLTF, useTexture, Decal, Environment } from "@react-three/drei";
import { useChannelMaskTexture } from "../useChannelMaskTexture"; // luego lo extraemos de tu Viewer

export default function ModeloPrenda({ designId, colors, decals, textDecals }) {
  const gltf = useGLTF("/prendas3d/camiseta_v2.glb");
  const colorMap = useChannelMaskTexture(
    `/prendas3d/${designId}_rgb.png`,
    Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, { channel: k[0].toUpperCase(), color: v }]))
  );

  return (
    <group>
      <mesh geometry={gltf.scene.children[0].geometry}>
        <meshStandardMaterial map={colorMap} roughness={0.6} metalness={0.1} />
        {decals.map((d, i) => (
          <Decal key={i} {...d} />
        ))}
        {textDecals.map((t, i) => (
          <Decal key={`txt-${i}`} {...t} />
        ))}
      </mesh>
      <Environment preset="studio" />
    </group>
  );
}
