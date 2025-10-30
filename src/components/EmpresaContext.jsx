// src/contexts/EmpresaContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

const EmpresaContext = createContext();

export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresa debe usarse dentro de EmpresaProvider");
  }
  return context;
};

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEmpresa = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/empresa/`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.ok) {
        setEmpresa(data.empresa);
      } else {
        throw new Error(data.msg || "Error al cargar información de la empresa");
      }
    } catch (error) {
      console.error("Error al cargar empresa:", error);
      setError(error.message);
      
      // Establecer datos por defecto si falla la carga
      setEmpresa({
        nombre: "Johan Sports",
        logo: "/img/Logopeque.png",
        direccion: "Pedro Moncayo y Gaspar de Villarroel",
        telefono: "+593 0992088286",
        email: "contacto@johansports.com",
        horarioAtencion: {
          lunes: "09:00 - 18:00",
          viernes: "09:00 - 18:00"
        },
        redesSociales: {
          facebook: "#",
          instagram: "#",
          twitter: "#"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const value = {
    empresa,
    loading,
    error,
    recargarEmpresa: cargarEmpresa
  };

  return (
    <EmpresaContext.Provider value={value}>
      {children}
    </EmpresaContext.Provider>
  );
};
