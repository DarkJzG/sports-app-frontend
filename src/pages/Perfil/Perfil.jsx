// src/pages/Perfil.jsx
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SidebarPerfil from "../Perfil/SlidebarPerfil";
import PanelDatos from "../Perfil/PanelDatos";
import PanelDirecciones from "../Perfil/PanelDirecciones";

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
        </div>
      </div>
      <Footer />
    </div>
  );
}
