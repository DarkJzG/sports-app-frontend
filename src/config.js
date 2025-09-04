// src/config.js
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Si usabas API_URL en otras partes, puedes apuntarlo al mismo:
export const API_URL = BACKEND_URL;
