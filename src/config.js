// src/config.js
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


export const API_URL = BACKEND_URL;
export const API_URL_GEMINI = `${BACKEND_URL}/api/ia/generar_camiseta_gemini_v3`;
