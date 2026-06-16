// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 mt-12">
      <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contacto */}
        <div>
          <h4 className="font-bold text-lg mb-2">Información del Empresa</h4>
          <p className="mb-1"><span className="font-semibold">Dirección:</span> Pedro Moncayo y Gaspar de Villarroel</p>
          <p className="mb-1"><span className="font-semibold">Teléfono:</span> +593 0992088286</p>
          <p className="mb-3"><span className="font-semibold">Hora:</span> 09:00 - 18:00, Lunes - Viernes</p>
        </div>
        {/* Más */}
        <div>
          <h3 className="font-bold text-lg mb-2">Agregar</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="/manObra" className="hover:underline">Mano de Obra</a></li>
            <li><a href="/telas" className="hover:underline">Telas</a></li>
            <li><a href="/producto" className="hover:underline">Prendas</a></li>
            <li><a href="/catgPrd" className="hover:underline">Categorías</a></li>
          </ul>
        </div>
        {/* Mi cuenta */}
        <div>
          <h3 className="font-bold text-lg mb-2">Revisar</h3>
          <ul className="flex flex-col gap-2">
            <li><a href="/admin/pedidos" className="hover:underline">Pedidos</a></li>
            <li><a href="/admin/facturas" className="hover:underline">Facturas</a></li>

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
