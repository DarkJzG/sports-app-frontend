import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import RutasPrivadas from "./components/RutasPrivadas.jsx";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import VerificarCuenta from "./pages/VerificarCuenta..jsx";
import Perfil from "./pages/Perfil";
import RestContra from "./pages/RecupContra";
import OldContra from "./pages/OldContra"; 

import HomeAdmin from "./pages/Home_admin";

import CategoriaPrd from "./pages/CatPrdAdmin/CatgProducto"; 
import AgrCatPrd from "./pages/CatPrdAdmin/AgregarCatgPrd"; 
import EditCatPrd from "./pages/CatPrdAdmin/EditarCatgPrd"; 

import ManoObra from "./pages/ManoObraAdmin/ManoObra";
import AgrManO from "./pages/ManoObraAdmin/AgregarMano";
import EditManO from "./pages/ManoObraAdmin/EditarMano";

import CatgTelas from "./pages/CatTelasAdmin/CatgTelas";
import EditarCatgTela from "./pages/CatTelasAdmin/EditarCatgTela";
import AgregarCatgTela from "./pages/CatTelasAdmin/AgregarCatgTela";
import Telas from "./pages/TelasAdmin/Telas";
import EditarTela from "./pages/TelasAdmin/EditarTela";
import AgrTela from "./pages/TelasAdmin/AgregarTela";
import AgregarLotes from "./pages/TelasAdmin/AgregarLotes";
import GestionarLote from "./pages/TelasAdmin/GestionarLotes";
import EditarLotes from "./pages/TelasAdmin/EditarLotes";

import ProductoF from "./pages/ProductosAdmin/ProductosAdm";
import AgregarProducto from "./pages/ProductosAdmin/AgregarPrd";
import EditarProducto from "./pages/ProductosAdmin/EditarPrd";


import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import DetallePrd from "./pages/DetallePrd";


import Carrito from "./pages/Carrito";
import DetalleCarrito from "./pages/DetalleCarrito";
import Checkout from "./pages/Pedidos/Cliente/Checkout.jsx";
import MisPedidos from "./pages/Pedidos/Cliente/MisPedidos.jsx";
import DetallePedido from "./pages/Pedidos/Cliente/DetallePedido.jsx";
import DetallePedidoAdmin from "./pages/Pedidos/Admin/DetallePedidoAdmin.jsx";
import GestionarPagos from "./pages/Pedidos/Admin/GestionPagos.jsx";
import PedidosAdmin from "./pages/Pedidos/Admin/PedidosAdmin.jsx";



import Modelo from "./pages/Modelo";

import GenerarImagen from "./pages/ModeloIA/GenerarImagen";
import GenerarImagenForm from "./pages/ModeloIA/GenerarImagenForm";
import GenerarImagenStable from "./pages/ModeloIA/GenerarImagenStable";

import SeleccionPrenda from "./pages/ModeloIA/SeleccionPrenda";
import FormCamiseta from "./pages/ModeloIA/FormCamiseta";
import PrendasIA from "./pages/PrendasIA";
import ListarPrendasIA from "./pages/ModeloIA/ListarPrendasIA";
import DetallePrdIA from "./pages/DetallesPrendas/DetallePrd_IA.jsx";

import SeleccionDiseno from "./pages/DisenarPrendas/SeleccionDiseno";
import Camiseta3D from "./pages/DisenarPrendas/Camiseta3D";
import Camiseta3DVista from "./pages/DisenarPrendas/Camiseta3DVista";

import GuiaCamiseta from "./pages/ModeloIA/GuiaCamiseta.jsx"



function App() {
  return (
    
      <Router>
        <Routes>
          
          {/* Rutas publicas */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificar/:token" element={<VerificarCuenta />} />
          <Route path="/restablecer-contrasena" element={<RestContra />} />
          <Route path="/olvido-contrasena" element={<OldContra />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetallePrd />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/carrito/detalle/:itemId" element={<DetalleCarrito />} />


          {/* Cliente Iniciado Sesión */}


          <Route path="/perfil" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <Perfil />
            </RutasPrivadas>} />

          <Route path="/personalizar" element={
            <RutasPrivadas roles={["cliente"]}>
              <Modelo />
            </RutasPrivadas>} />

          <Route path="/checkout" element={
            <RutasPrivadas roles={["cliente"]}>
              <Checkout />
            </RutasPrivadas>} />

          <Route path="/mis-pedidos" element={
            <RutasPrivadas roles={["cliente"]}>
              <MisPedidos />
            </RutasPrivadas>} />

          <Route path="/mis-pedidos/:id" element={
            <RutasPrivadas roles={["cliente"]}>
              <DetallePedido />
            </RutasPrivadas>} />

          {/* Rutas Admin */}

          <Route path="/admin" element={
            <RutasPrivadas roles={["admin"]}>
              <HomeAdmin />
            </RutasPrivadas>} />

          <Route path="/catgPrd" element={
            <RutasPrivadas roles={["admin"]}>
              <CategoriaPrd />
            </RutasPrivadas>} />
          <Route path="/catgPrd/agregar" element={
            <RutasPrivadas roles={["admin"]}>
              <AgrCatPrd />
            </RutasPrivadas>} />
          <Route path="/catgPrd/editar/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <EditCatPrd />
            </RutasPrivadas>} />

          <Route path="/manObra" element={
            <RutasPrivadas roles={["admin"]}>
              <ManoObra />
            </RutasPrivadas>} />
          <Route path="/mano/agregar" element={
            <RutasPrivadas roles={["admin"]}>
              <AgrManO />
            </RutasPrivadas>} />
          <Route path="/mano/editar/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <EditManO />
            </RutasPrivadas>} />

          <Route path="/catg_tela" element={
            <RutasPrivadas roles={["admin"]}>
              <CatgTelas />
            </RutasPrivadas>} />
          <Route path="/catg_tela/editar/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <EditarCatgTela />
            </RutasPrivadas>} />
          <Route path="/catg_tela/agregar" element={
            <RutasPrivadas roles={["admin"]}>
              <AgregarCatgTela />
            </RutasPrivadas>} />
          <Route path="/telas" element={
            <RutasPrivadas roles={["admin"]}>
              <Telas />
            </RutasPrivadas>} />
          <Route path="/telas/editar/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <EditarTela />
            </RutasPrivadas>} />
          <Route path="/telas/agregar" element={
            <RutasPrivadas roles={["admin"]}>
              <AgrTela />
            </RutasPrivadas>} />
          <Route path="/telas/agregar_lotes/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <AgregarLotes />
            </RutasPrivadas>} />
          <Route path="/telas/gestionar_lotes/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <GestionarLote />
            </RutasPrivadas>} />
          <Route path="/telas/:id/editar_lotes/:loteId" element={
            <RutasPrivadas roles={["admin"]}>
              <EditarLotes />
            </RutasPrivadas>} />


          <Route path="/producto" element={
            <RutasPrivadas roles={["admin"]}>
              <ProductoF />
            </RutasPrivadas>} />
          <Route path="/producto/agregar" element={
            <RutasPrivadas roles={["admin"]}>
              <AgregarProducto />
            </RutasPrivadas>} />
          <Route path="/producto/editar/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <EditarProducto />
            </RutasPrivadas>} />

          <Route path="/admin/pedidos" element={
            <RutasPrivadas roles={["admin"]}>
              <PedidosAdmin />
            </RutasPrivadas>} />

          <Route path="/admin/pedidos/:id" element={
            <RutasPrivadas roles={["admin"]}>
              <DetallePedidoAdmin />
            </RutasPrivadas>} />

          <Route path="/admin/gestion-pagos" element={
            <RutasPrivadas roles={["admin"]}>
              <GestionarPagos />
            </RutasPrivadas>} />



          {/* Rutas de IA Genera Imagen*/}
          <Route path="/gen-img" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <GenerarImagen />
            </RutasPrivadas>} />
          <Route path="/gen-img-form" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <GenerarImagenForm />
            </RutasPrivadas>} />
          <Route path="/gen-img-stable" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <GenerarImagenStable />
            </RutasPrivadas>} />

          <Route path="/guia_generar_img" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <GuiaCamiseta />
            </RutasPrivadas>} />


          {/* Rutas Generar Prendas Imagen */} 
          <Route path="/modeloia" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <SeleccionPrenda />
            </RutasPrivadas>} />
          <Route path="/modeloia/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <FormCamiseta />
            </RutasPrivadas>} />
          <Route path="/ver-prendaIA" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <PrendasIA />
            </RutasPrivadas>} />
          <Route path="/listar-prendasIA" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <ListarPrendasIA />
            </RutasPrivadas>} />

          <Route path="/prendaIA/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <DetallePrdIA />
            </RutasPrivadas>} />

          {/* Rutas Modelo 3D Camiseta */} 
          <Route path="/modelo3d" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <SeleccionDiseno />
            </RutasPrivadas>} />
          <Route path="/modelo3d/camiseta3d" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <Camiseta3D />
            </RutasPrivadas>} />
          <Route path="/modelo3d/camiseta3d/vista" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <Camiseta3DVista />
            </RutasPrivadas>} />

        </Routes>
      </Router>
    
  );
}

export default App;
