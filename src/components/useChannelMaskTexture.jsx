import { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

// 👇 nuevo parámetro rotation (en radianes)
export function useChannelMaskTexture(maskURL, zonesSpec, rotation = 0) {
  const mask = useTexture(maskURL);
  const [tex, setTex] = useState(null);

  const zonesKey = useMemo(() => JSON.stringify(zonesSpec), [zonesSpec]);

  useEffect(() => {
    if (!mask.image) return;

    const w = mask.image.width;
    const h = mask.image.height;

    // Leer máscara una sola vez
    const mCnv = document.createElement("canvas");
    mCnv.width = w;
    mCnv.height = h;
    const mCtx = mCnv.getContext("2d", { willReadFrequently: true });
    mCtx.drawImage(mask.image, 0, 0, w, h);
    const maskData = mCtx.getImageData(0, 0, w, h).data;

    // Cargar texturas (si existen) por zona
    const loads = Object.entries(zonesSpec).map(async ([id, z]) => {
      if (!z.textureUrl) {
        return {
          id,
          channel: z.channel,
          color: new THREE.Color(z.color || "#ffffff"),
        };
      }

      const img = await new Promise((resolve) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.src = z.textureUrl;
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
      });

      if (!img) {
        return {
          id,
          channel: z.channel,
          color: new THREE.Color(z.color || "#ffffff"),
        };
      }

      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const cx = c.getContext("2d", { willReadFrequently: true });
      cx.drawImage(img, 0, 0);
      const data = cx.getImageData(0, 0, img.width, img.height).data;

      return {
        id,
        channel: z.channel,
        texData: data,
        tw: img.width,
        th: img.height,
      };
    });

    let disposed = false;

    Promise.all(loads).then((zonesReady) => {
      if (disposed) return;

      const outCnv = document.createElement("canvas");
      outCnv.width = w;
      outCnv.height = h;
      const outCtx = outCnv.getContext("2d");
      const output = outCtx.createImageData(w, h);
      const dst = output.data;

      const EPS = 0.01; // umbral para ignorar ruido muy pequeño

      // Recorremos píxel a píxel
      for (let i = 0, p = 0; i < dst.length; i += 4, p++) {
        const px = p % w;
        const py = (p / w) | 0;

        const R = maskData[i] / 255;
        const G = maskData[i + 1] / 255;
        const B = maskData[i + 2] / 255;
        const A = maskData[i + 3] / 255;

        let outR = 0,
          outG = 0,
          outB = 0;

        // 1️⃣ Elegir canal dominante (solo uno)
        const maxChannelVal = Math.max(R, G, B);

        let dominantChannel = null;
        if (maxChannelVal >= EPS && A > 0) {
          if (maxChannelVal === R) dominantChannel = "R";
          else if (maxChannelVal === G) dominantChannel = "G";
          else if (maxChannelVal === B) dominantChannel = "B";
        }

        if (!dominantChannel) {
          // Sin zona: color de fondo (gris claro)
          outR = 230;
          outG = 230;
          outB = 230;
        } else {
          // 2️⃣ Aplicar SOLO la zona cuyo canal coincide con el dominante
          const weight = maxChannelVal; // pon 1 si quieres borde ultra duro

          for (const z of zonesReady) {
            if (z.channel !== dominantChannel) continue;

            if (z.texData) {
              const tx = ((px % z.tw) + z.tw) % z.tw;
              const ty = ((py % z.th) + z.th) % z.th;
              const idx = (ty * z.tw + tx) * 4;

              outR += weight * z.texData[idx];
              outG += weight * z.texData[idx + 1];
              outB += weight * z.texData[idx + 2];
            } else {
              outR += weight * z.color.r * 255;
              outG += weight * z.color.g * 255;
              outB += weight * z.color.b * 255;
            }
          }
        }

        // Clamp
        dst[i] = outR > 255 ? 255 : outR;
        dst[i + 1] = outG > 255 ? 255 : outG;
        dst[i + 2] = outB > 255 ? 255 : outB;
        dst[i + 3] = 255;
      }

      outCtx.putImageData(output, 0, 0);

      const texture = new THREE.CanvasTexture(outCnv);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 1;

      // 👇 para patrones repetibles y poder rotar
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.center.set(0.5, 0.5);
      texture.rotation = rotation; // 🔁 usamos el parámetro

      setTex((prev) => {
        if (prev) prev.dispose();
        return texture;
      });
    });

    return () => {
      disposed = true;
      setTex((prev) => {
        if (prev) prev.dispose();
        return null;
      });
    };
  }, [mask.image, zonesKey, rotation]);

  return tex;
}
