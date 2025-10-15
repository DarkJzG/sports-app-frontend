// src/utils/colorParser.js
export function parseColor(rawColor) {
  if (!rawColor) return { nombre: "", cssColor: "#ccc" };

  // Formato "Nombre (#HEX)"
  const match = rawColor.match(/(.*)\((#[0-9A-Fa-f]{6})\)/);
  if (match) {
    const nombre = match[1].trim();
    const cssColor = match[2].trim();
    return { nombre, cssColor };
  }

  // Formato directo "#HEX" o "rgb(...)"
  if (rawColor.startsWith("#") || rawColor.startsWith("rgb")) {
    return { nombre: rawColor, cssColor: rawColor };
  }

  // Formato por nombre
  const mapa = {
    Negro: "#000000",
    Blanco: "#ffffff",
    Azul: "#0000ff",
    Rojo: "#ff0000",
    Verde: "#008000",
    Amarillo: "#ffff00",
    Gris: "#808080",
  };

  const cssColor = mapa[rawColor] || "#ccc";
  return { nombre: rawColor, cssColor };
}
