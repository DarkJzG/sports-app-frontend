import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeAdmin from "./pages/Home_admin";
import CategoriaPrd from "./pages/CatPrdAdmin/CatgProducto"; 
import AgrCatPrd from "./pages/CatPrdAdmin/AgregarCatgPrd"; 
import EditCatPrd from "./pages/CatPrdAdmin/EditarCatgPrd"; 
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Modelo from "./pages/Modelo";
import Carrito from "./pages/Carrito";

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catgPrd" element={<CategoriaPrd />} />
          <Route path="/catgPrd/agregar" element={<AgrCatPrd />} />
          <Route path="/catgPrd/editar/:id" element={<EditCatPrd />} />
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/personalizar" element={<Modelo />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </Router>
    
  );
}

export default App;
