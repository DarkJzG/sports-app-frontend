import React from "react";
import { useLocation } from "react-router-dom";

// Importa todos los formularios
import FormCamiseta from "./FormCamiseta";
import FormPantalon from "./FormPantalon";


export default function FormSelector() {
  const location = useLocation();
  const categoria_prd = (location.state?.categoria_prd || "").toLowerCase();

  switch (categoria_prd) {
    case "camiseta":
      return <FormCamiseta />;
    case "pantalón":
    case "pantalon":
       return <FormPantalon />;
    // case "chompa":
    //   return <FormChompa />;
    // case "conjunto interno":
    //   return <FormConjuntoInterno />;
    // case "conjunto externo":
    //   return <FormConjuntoExterno />;
    default:
      return (
        <div className="p-6 text-center text-red-600 font-bold">
          ❌ No hay formulario configurado para la categoría: {categoria_prd}
        </div>
      );
  }
}
