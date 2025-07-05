import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Auth from "./pages/Auth";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Modelo from "./pages/Modelo";
import Carrito from "./pages/Carrito";

function App() {
  return (
    <AuthProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/personalizar" element={<Modelo />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
