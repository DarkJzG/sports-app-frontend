import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { EmpresaProvider } from "./components/EmpresaContext";


import RutasPrivadas from "./components/RutasPrivadas.jsx";

import PerfilEmpresa from "./pages/Perfil/Admin/PerfilEmpresa.jsx";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import VerificarCuenta from "./pages/VerificarCuenta";
import Perfil from "./pages/Perfil/Cliente/Perfil.jsx";
import RestContra from "./pages/RecupContra";
import OldContra from "./pages/OldContra"; 

import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import TerminosC from "./pages/TerminosC";
import Politicas from "./pages/Politicas";

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
import AgregarPago from "./pages/Pedidos/Cliente/AgregarPago.jsx";
import DetallePedidoAdmin from "./pages/Pedidos/Admin/DetallePedidoAdmin.jsx";
import GestionarPagos from "./pages/Pedidos/Admin/GestionPagos.jsx";
import PedidosAdmin from "./pages/Pedidos/Admin/PedidosAdmin.jsx";
import FacturasAdmin from "./pages/Pedidos/Admin/FacturasAdmin.jsx";


import Modelo from "./pages/Modelo";

import GenerarImagen from "./pages/ModeloIA/GenerarImagen";
import GenerarImagenForm from "./pages/ModeloIA/GenerarImagenForm";
import GenerarImagenStable from "./pages/ModeloIA/GenerarImagenStable";


import SeleccionPrenda from "./pages/ModeloIA/SeleccionPrenda";
import FormSeleccionP from "./pages/ModeloIA/FormSeleccionP.jsx";




import PrendasIA from "./pages/PrendasIA";
import ListarPrendasIA from "./pages/ModeloIA/ListarPrendasIA";
import DetallePrdIA from "./pages/DetallesPrendas/DetallePrd_IA.jsx";

import SeleccionDiseno from "./pages/DisenarPrendas/SeleccionDiseno";
import Camiseta3D from "./pages/DisenarPrendas/Camiseta3D";
import Camiseta3DVista from "./pages/DisenarPrendas/Camiseta3DVista";

//Forms para la generación de prendas por imagen
import GuiaCamiseta from "./pages/ModeloIA/GuiaCamiseta.jsx"
import FormCamiseta_V2 from "./pages/ModeloIA/FormCamiseta_V2.jsx"
import FormCamiseta_V3 from "./pages/ModeloIA/FormCamiseta_V3.jsx"
import FormChompa from "./pages/ModeloIA/FormChompa.jsx"


//Viewers de las prendas para los modelos 3D 
import CamisetaViewer from "./pages/DisenarPrendas/CamisetaViewer";
import ListarPrendas3D from "./pages/DisenarPrendas/ListarPrendas3D.jsx"
import DetallePrd3D from "./pages/DetallesPrendas/DetallePrd_3D.jsx";
import PantalonViewer from "./pages/DisenarPrendas/PantalonViewer";
import PantalonetaViewer from "./pages/DisenarPrendas/PantalonetaViewer";
import ChompaViewer from "./pages/DisenarPrendas/ChompaViewer";
import PrendasViewer from "./pages/DisenarPrendas/PrendasViewer";






function App() {
  return (
    <>
      <EmpresaProvider>
      <Router>
        <Routes>

          <Route path="/admin/perfil-empresa" element={
            <RutasPrivadas roles={["admin"]}>
              <PerfilEmpresa />
            </RutasPrivadas>} />
          
          {/* Rutas publicas */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificar" element={<VerificarCuenta />} />
          <Route path="/restablecer-contrasena" element={<RestContra />} />
          <Route path="/olvido-contrasena" element={<OldContra />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:categoriaId" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetallePrd />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/carrito/detalle/:itemId" element={<DetalleCarrito />} />


          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/terminos" element={<TerminosC />} />
          <Route path="/politicas" element={<Politicas />} />



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

          <Route path="/agregar-pago/:pedidoId" element={
            <RutasPrivadas roles={["cliente"]}>
              <AgregarPago />
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

          <Route path="/admin/facturas" element={
            <RutasPrivadas roles={["admin"]}>
              <FacturasAdmin />
            </RutasPrivadas>} />



          {/* Rutas Generar Imagen IA*/}
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
              <FormSeleccionP />
            </RutasPrivadas>} />

          <Route path="/form-camiseta-v2" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <FormCamiseta_V2 />
            </RutasPrivadas>} />
          
          <Route path="/form-camiseta-v3" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <FormCamiseta_V3 />
            </RutasPrivadas>} />

          <Route path="/form-chompa" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <FormChompa />
            </RutasPrivadas>} />

          <Route path="/modeloia/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <FormSeleccionP />
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
            
          <Route path="/modelo3d/camiseta3d/vista/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <CamisetaViewer />
            </RutasPrivadas>} />
          
          <Route path="/modelo3d/listar-prendas3d" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <ListarPrendas3D />
            </RutasPrivadas>} />
          
          <Route path="/prenda3d/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <DetallePrd3D />
            </RutasPrivadas>} />
            
          <Route path="/modelo3d/pantalon3d/vista/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <PantalonViewer />
            </RutasPrivadas>} />
            
          <Route path="/modelo3d/pantaloneta3d/vista/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <PantalonetaViewer />
            </RutasPrivadas>} />

          <Route path="/modelo3d/chompa3d/vista/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <ChompaViewer />
            </RutasPrivadas>} />

          <Route path="/modelo3d/prendas3d/vista/:id" element={
            <RutasPrivadas roles={["cliente", "admin"]}>
              <PrendasViewer />
            </RutasPrivadas>} />

        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      </EmpresaProvider>
    </>
  );
}

export default App;
