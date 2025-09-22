// src/components/3d/ModeloCamiseta.jsx
import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Un pixel blanco como fallback visual
const WHITE_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


export default function ModeloCamiseta({ colors, textures, texOpts }) {
  const { nodes } = useGLTF("/prendas3d/camiseta_v12.glb");

    // ⚡ Siempre se llaman los hooks
  const delanteraTexture = useTexture(textures.delantera || WHITE_PIXEL);
  const traseraTexture = useTexture(textures.trasera || WHITE_PIXEL);
  const mangaIzqTex = useTexture(textures.manga_izquierda || WHITE_PIXEL);
  const mangaDerTex = useTexture(textures.manga_derecha || WHITE_PIXEL);

    // Configurador común
    const applyTexOpts = (tex, opts) => {
        if (!tex || !opts) return;
        tex.wrapS = opts.mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        tex.wrapT = opts.mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        tex.repeat.set(opts.repeatX, opts.repeatY);
        tex.offset.set(opts.offsetX, opts.offsetY);
        tex.rotation = (opts.rotationDeg * Math.PI) / 180;
        tex.center.set(0.5, 0.5); // rotar alrededor del centro
        tex.needsUpdate = true;
    };

    applyTexOpts(delanteraTexture, texOpts.delantera);
    applyTexOpts(traseraTexture,   texOpts.trasera);
    applyTexOpts(mangaIzqTex,     texOpts.manga_izquierda);
    applyTexOpts(mangaDerTex,     texOpts.manga_derecha);


  return (
    <group scale={0.02} rotation={[-Math.PI / -2, 0, 0]} position={[0, -1.5, 0]}>
      {/* Partes sólidas */}
      <mesh geometry={nodes.cuello.geometry}>
        <meshStandardMaterial color={colors.cuello} />
      </mesh>
      <mesh geometry={nodes.cintura.geometry}>
        <meshStandardMaterial color={colors.cintura} />
      </mesh>
      <mesh geometry={nodes.puno_izq.geometry}>
        <meshStandardMaterial color={colors.puno_izq} />
      </mesh >
      <mesh geometry={nodes.puno_der.geometry}>
        <meshStandardMaterial color={colors.puno_der} />
      </mesh>

      {/* Caras con textura */}
      <mesh geometry={nodes.delantera.geometry}>
        <meshStandardMaterial
          key={`front-${textures.delantera}-${JSON.stringify(texOpts.delantera)}`}
          color={colors.delantera}
          map={delanteraTexture}
        />
      </mesh>

      <mesh geometry={nodes.trasera.geometry}>
        <meshStandardMaterial
          key={`back-${textures.trasera}-${JSON.stringify(texOpts.trasera)}`}
          color={colors.trasera}
          map={traseraTexture}
        />
      </mesh>
        <mesh geometry={nodes.manga_izquierda.geometry}>
        <meshStandardMaterial
          key={`manga-izq-${textures.manga_izquierda}-${JSON.stringify(texOpts.manga_izquierda)}`}
          color={colors.manga_izquierda}
          map={mangaIzqTex}
        />
      </mesh>
        <mesh geometry={nodes.manga_derecha.geometry}>
        <meshStandardMaterial
          key={`manga-der-${textures.manga_derecha}-${JSON.stringify(texOpts.manga_derecha)}`}
          color={colors.manga_derecha}
          map={mangaDerTex}
        />
      </mesh>
    </group>
  );
}
