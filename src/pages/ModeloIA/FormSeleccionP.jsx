import React from "react";
import { useLocation } from "react-router-dom";


import FormCamiseta from "./FormCamiseta";
import FormCamiseta_V2 from "./FormCamiseta_V2";
import FormCamiseta_V3 from "./FormCamiseta_V3";
import FormPantalon from "./FormPantalon";
import FormChompa from "./FormChompa";
import FormConjuntoInterno from "./FormConjuntoInterno";
import FormConjuntoExterno from "./FormConjuntoExterno";
import FormPantaloneta from "./FormPantaloneta";



export default function FormSelector() {
  const location = useLocation();
  const categoria_prd = (location.state?.categoria_prd || "").toLowerCase();

  switch (categoria_prd) {
    case "camiseta":
      return <FormCamiseta_V3 />;
    case "pantalón":
    case "pantalon":
       return <FormPantalon />;
    case "chompas":
      return <FormChompa />;
    case "conjunto interno":
      return <FormConjuntoInterno />;
    case "conjunto externo":
      return <FormConjuntoExterno />;
    case "pantaloneta":
      return <FormPantaloneta />;
    default:
      return (
        <div className="p-6 text-center text-red-600 font-bold">
           No hay formulario configurado para la categoría: {categoria_prd}
        </div>
      );
  }
}
