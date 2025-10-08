import React from "react";
import { useLocation } from "react-router-dom";

// Importa todos los formularios
import FormCamiseta from "./FormCamiseta";
import FormCamiseta_V2 from "./FormCamiseta_V2";
import FormPantalon from "./FormPantalon";
import FormChompa from "./FormChompa";
import FormConjuntoInterno from "./FormConjuntoInterno";
import FormConjuntoExterno from "./FormConjuntoExterno";



export default function FormSelector() {
  const location = useLocation();
  const categoria_prd = (location.state?.categoria_prd || "").toLowerCase();

  switch (categoria_prd) {
    case "camiseta":
      return <FormCamiseta_V2 />;
    case "pantalón":
    case "pantalon":
       return <FormPantalon />;
    case "chompas":
      return <FormChompa />;
    case "conjunto interno":
      return <FormConjuntoInterno />;
    case "conjunto externo":
      return <FormConjuntoExterno />;
    default:
      return (
        <div className="p-6 text-center text-red-600 font-bold">
          ❌ No hay formulario configurado para la categoría: {categoria_prd}
        </div>
      );
  }
}
