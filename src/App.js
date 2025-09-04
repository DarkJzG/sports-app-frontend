import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeAdmin from "./pages/Home_admin";
import CategoriaPrd from "./pages/CatPrdAdmin/CatgProducto"; 
import AgrCatPrd from "./pages/CatPrdAdmin/AgregarCatgPrd"; 
import EditCatPrd from "./pages/CatPrdAdmin/EditarCatgPrd"; 
import ManoObra from "./pages/ManoObraAdmin/ManoObra";
import AgrManO from "./pages/ManoObraAdmin/AgregarMano";
import EditManO from "./pages/ManoObraAdmin/EditarMano";
import Telas from "./pages/TelasAdmin/Telas";
import EditarTela from "./pages/TelasAdmin/EditarTela";
import AgrTela from "./pages/TelasAdmin/AgregarTela";
import ProductoF from "./pages/ProductosAdmin/ProductosAdm";
import AgregarProducto from "./pages/ProductosAdmin/AgregarPrd";
import EditarProducto from "./pages/ProductosAdmin/EditarPrd";

import RestContra from "./pages/RecupContra";
import OldContra from "./pages/OldContra"; 


import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import DetallePrd from "./pages/DetallePrd";
import DetalleCarrito from "./pages/DetalleCarrito";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Modelo from "./pages/Modelo";
import Carrito from "./pages/Carrito";


import GenerarImagen from "./pages/ModeloIA/GenerarImagen";
import GenerarImagenForm from "./pages/ModeloIA/GenerarImagenForm";
import GenerarImagenStable from "./pages/ModeloIA/GenerarImagenStable";

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/catgPrd" element={<CategoriaPrd />} />
          <Route path="/catgPrd/agregar" element={<AgrCatPrd />} />
          <Route path="/catgPrd/editar/:id" element={<EditCatPrd />} />
          <Route path="/manObra" element={<ManoObra />} />
          <Route path="/mano/agregar" element={<AgrManO />} />
          <Route path="/mano/editar/:id" element={<EditManO />} />
          <Route path="/telas" element={<Telas />} />
          <Route path="/telas/editar/:id" element={<EditarTela />} />
          <Route path="/telas/agregar" element={<AgrTela />} />
          <Route path="/producto" element={<ProductoF />} />
          <Route path="/producto/agregar" element={<AgregarProducto />} />
          <Route path="/producto/editar/:id" element={<EditarProducto />} />
          <Route path="/restablecer-contrasena" element={<RestContra />} />
          <Route path="/olvido-contrasena" element={<OldContra />} />
          
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetallePrd />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/carrito/detalle/:itemId" element={<DetalleCarrito />} />

          {/* Rutas de usuario */} 
          
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/personalizar" element={<Modelo />} />


          <Route path="/gen-img" element={<GenerarImagen />} />
          <Route path="/gen-img-form" element={<GenerarImagenForm />} />
          <Route path="/gen-img-stable" element={<GenerarImagenStable />} />

        </Routes>
      </Router>
    
  );
}

export default App;
