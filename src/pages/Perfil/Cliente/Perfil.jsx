// src/pages/Perfil.jsx
import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SidebarPerfil from "./SlidebarPerfil";
import PanelDatos from "./PanelDatos";
import PanelDirecciones from "./PanelDirecciones";
import PanelPedidos from "./PanelPedidos";
import PanelPrendaIA from "./PanelPrendaIA";
import PanelPrenda3D from "./PanelPrenda3D";

export default function Perfil() {
  const [activePanel, setActivePanel] = useState("datos"); // valores: datos | direcciones | pedidos

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full py-8 px-6 gap-8">
        {/* Panel lateral */}
        <SidebarPerfil active={activePanel} setActive={setActivePanel} />

        {/* Contenido dinámico */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8">

          {activePanel === "direcciones" && <PanelDirecciones />}
          {activePanel === "datos" && <PanelDatos />}
          {activePanel === "pedidos" && <PanelPedidos />}
          {activePanel === "prendasIA" && <PanelPrendaIA />}
          {activePanel === "prendas3D" && <PanelPrenda3D />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
