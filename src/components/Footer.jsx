// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 mt-12">
      <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contacto */}
        <div>
          <h4 className="font-bold text-lg mb-2">Contáctanos</h4>
          <p className="mb-1"><span className="font-semibold">Dirección:</span> Pedro Moncayo y Gaspar de Villarroel</p>
          <p className="mb-1"><span className="font-semibold">Teléfono:</span> +593 0992088286</p>
          <p className="mb-3"><span className="font-semibold">Hora:</span> 09:00 - 18:00, Lunes - Viernes</p>
          <div>
            <h4 className="font-semibold">Síguenos</h4>
            <div className="flex gap-3 mt-1">
              <a href="#"><img src="/img/icon-facebook.svg" alt="Facebook" className="h-7" /></a>
              <a href="#"><img src="/img/icon-instagram.svg" alt="Instagram" className="h-7" /></a>
              <a href="#"><img src="/img/icon-youtube.svg" alt="YouTube" className="h-7" /></a>
            </div>
          </div>
        </div>
        {/* Más */}
        <div>
          <h3 className="font-bold text-lg mb-2">Más</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="hover:underline">Acerca de Nosotros</a></li>
            <li><a href="#" className="hover:underline">Políticas de Privacidad</a></li>
            <li><a href="#" className="hover:underline">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:underline">Contáctanos</a></li>
            <li><a href="#" className="hover:underline">Soporte</a></li>
          </ul>
        </div>
        {/* Mi cuenta */}
        <div>
          <h3 className="font-bold text-lg mb-2">Mi Cuenta</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="hover:underline">Iniciar Sesión</a></li>
            <li><a href="#" className="hover:underline">Lista de Deseados</a></li>
            <li><a href="#" className="hover:underline">Ver mis Pedidos</a></li>
            <li><a href="#" className="hover:underline">Ayuda</a></li>
          </ul>
        </div>
        {/* Slogan + logo */}
        <div>
          <h3 className="font-bold text-lg mb-2">Diseña, inventa y crea</h3>
          <p className="mb-3">Dedicados a ofrecer ropa deportiva de alta calidad para satisfacer tus necesidades</p>
          <img src="/img/LogoHori.png" alt="Logo" className="h-12" />
        </div>
      </div>
      <div className="border-t text-center py-4 text-gray-700 text-sm">
        <p>&copy; 2025 Johan Sports. Todos los derechos reservados | Diseñado por JohanZg</p>
      </div>
    </footer>
  );
}
