// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cart count when user is authenticated
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated()) {
        setCartCount(0);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/carrito/count/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.count || 0);
        } else {
          console.error('Error fetching cart count:', await response.text());
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartCount();
  }, [isAuthenticated, user?.id]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo and navigation links */}
        <div className="flex justify-center items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-900">
          <img
            className="h-8"
            src="/img/Logopeque.png"
            alt="website logo"
          />
          <span className="font-bold text-xl text-blue-900 sm:block">Johan Sports</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-gray-700 hover:text-blue-900 transition-colors">
              Catálogo
            </Link>
            <Link to="/sobre-nosotros" className="text-gray-700 hover:text-blue-900 transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/contacto" className="text-gray-700 hover:text-blue-900 transition-colors">
              Contacto
            </Link>
          </div>
        </div>

        {/* User actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated() ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Link to="/carrito" className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Carrito">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1">
                  <span className="text-gray-700">{user.nombre || user.email}</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-1 py-1">
                    <Link 
                      to="/perfil" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/mis-pedidos" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-900 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-900 focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/catalogo"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Catálogo
            </Link>
            {isAuthenticated() ? (
              <>
                <Link
                  to="/carrito"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Carrito
                  {cartCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}