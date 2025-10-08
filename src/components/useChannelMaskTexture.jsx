import { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";


export function useChannelMaskTexture(maskURL, zonesSpec) {
  const mask = useTexture(maskURL);
  const [tex, setTex] = useState(null);

  const zonesKey = useMemo(() => JSON.stringify(zonesSpec), [zonesSpec]);

  useEffect(() => {
    if (!mask.image) return;

    const w = mask.image.width;
    const h = mask.image.height;

    // Lee máscara una sola vez
    const mCnv = document.createElement("canvas");
    mCnv.width = w; mCnv.height = h;
    const mCtx = mCnv.getContext("2d", { willReadFrequently: true });
    mCtx.drawImage(mask.image, 0, 0, w, h);
    const maskData = mCtx.getImageData(0, 0, w, h).data;

    // Prepara promesas para cargar texturas de zonas
    const loads = Object.entries(zonesSpec).map(async ([id, z]) => {
      if (!z.textureUrl) {
        return { id, channel: z.channel, color: new THREE.Color(z.color || "#fff") };
      }
      const img = await new Promise((resolve) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.src = z.textureUrl;
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
      });
      if (!img) return { id, channel: z.channel, color: new THREE.Color(z.color || "#fff") };

      // Lee ImageData de la textura UNA vez
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const cx = c.getContext("2d", { willReadFrequently: true });
      cx.drawImage(img, 0, 0);
      const data = cx.getImageData(0, 0, img.width, img.height).data;
      return {
        id, channel: z.channel,
        texData: data, tw: img.width, th: img.height,
      };
    });

    Promise.all(loads).then((zonesReady) => {
      const outCnv = document.createElement("canvas");
      outCnv.width = w; outCnv.height = h;
      const outCtx = outCnv.getContext("2d");
      const output = outCtx.createImageData(w, h);
      const dst = output.data;

      // Recorre píxeles de la máscara
      for (let i = 0, p = 0; i < dst.length; i += 4, p++) {
        const px = p % w;
        const py = (p / w) | 0;

        const R = maskData[i]     / 255;
        const G = maskData[i + 1] / 255;
        const B = maskData[i + 2] / 255;
        const A = maskData[i + 3] / 255;

        let r = 0, g = 0, b = 0;

        for (const z of zonesReady) {
          const weight =
            z.channel === "R" ? R :
            z.channel === "G" ? G :
            z.channel === "B" ? B : A;

          if (weight <= 0) continue;

          if (z.texData) {
            const tx = px % z.tw;
            const ty = py % z.th;
            const idx = (ty * z.tw + tx) * 4;
            r += weight * z.texData[idx];
            g += weight * z.texData[idx + 1];
            b += weight * z.texData[idx + 2];
          } else {
            r += weight * z.color.r * 255;
            g += weight * z.color.g * 255;
            b += weight * z.color.b * 255;
          }
        }

        dst[i]     = r > 255 ? 255 : r;
        dst[i + 1] = g > 255 ? 255 : g;
        dst[i + 2] = b > 255 ? 255 : b;
        dst[i + 3] = 255;
      }

      outCtx.putImageData(output, 0, 0);

      const texture = new THREE.CanvasTexture(outCnv);
      texture.colorSpace     = THREE.SRGBColorSpace;
      texture.flipY          = false;
      texture.generateMipmaps = false;
      texture.minFilter      = THREE.LinearFilter;
      texture.magFilter      = THREE.LinearFilter;
      texture.anisotropy     = 1;

      setTex(texture);
      return () => texture.dispose();
    });
  // 👇 solo se recalcula si cambia realmente el spec
  }, [mask.image, zonesKey]);

  return tex;
}
