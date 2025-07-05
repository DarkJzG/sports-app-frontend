// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="shadow bg-white sticky top-0 z-30">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            className="h-10"
            src="/img/Logopeque.png"
            alt="website logo"
          />
          <span className="font-bold text-xl text-blue-900 hidden sm:block">Johan Sports</span>
        </Link>
        {/* Burger mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 focus:outline-none"
        >
          <img src="/img/menu-burger.svg" alt="menu" className="h-6 w-6" />
        </button>
        {/* Menu */}
        <div
          className={`fixed sm:static top-0 right-0 h-full w-2/3 max-w-xs bg-white sm:bg-transparent z-50 sm:flex sm:w-auto transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full sm:translate-x-0"
          }`}
        >
          <div className="sm:flex items-center gap-7 p-8 sm:p-0">
            <Link to="/" className="block py-2 sm:py-0 hover:text-blue-900 font-medium">Inicio</Link>
            <Link to="/catalogo" className="block py-2 sm:py-0 hover:text-blue-900 font-medium">Shop</Link>
            <Link to="/perfil" className="block py-2 sm:py-0 hover:text-blue-900 font-medium">Perfil</Link>
            <Link to="/compartir" className="block py-2 sm:py-0 hover:text-blue-900 font-medium">Compartir</Link>
            <Link to="/login" className="block py-2 sm:py-0 bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-700 font-semibold transition sm:ml-4">Login</Link>
            {/* Search input */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="border rounded-lg px-2 py-1 outline-blue-700 text-sm"
              />
              <button className="p-2">
                <img src="/img/search.png" alt="search" className="h-4 w-4" />
              </button>
            </div>
            {/* Cerrar menu mobile */}
            <button
              className="absolute top-3 right-4 sm:hidden"
              onClick={() => setOpen(false)}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
        {/* Iconos de acciones */}
        <div className="hidden sm:flex gap-3 items-center">
          <Link to="/wishlist" className="relative" title="Wishlist">
            <img src="/img/icon-heart.svg" alt="" className="h-6" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">3</span>
          </Link>
          <Link to="/cart" className="relative" title="Cart">
            <img src="/img/icon-cart.svg" alt="" className="h-6" />
            <span className="absolute -top-2 -right-2 bg-green-600 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">3</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
