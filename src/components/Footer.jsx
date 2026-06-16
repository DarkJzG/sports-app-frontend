// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useEmpresa } from "./EmpresaContext"; 

export default function Footer() {
  const { empresa, loading } = useEmpresa(); 

  // ✅ Valores por defecto o desde la base de datos
  const direccion = empresa?.direccion || "Pedro Moncayo y Gaspar de Villarroel";
  const telefono = empresa?.telefono || "+593 0992088186";
  const email = empresa?.email || "confecciones.johan.sport.com";
  const horario = empresa?.horarioAtencion 
    ? `${empresa.horarioAtencion.lunes || "09:00 - 18:00"}, Lunes - Viernes`
    : "09:00 - 18:00, Lunes - Viernes";
  
  const facebook = empresa?.redesSociales?.facebook || "#";
  const instagram = empresa?.redesSociales?.instagram || "#";
  const youtube = empresa?.redesSociales?.twitter || "#";
  const logoHorizontal = empresa?.banner || "/img/LogoHori.png";
  const nombreEmpresa = empresa?.nombre || "Johan Sports";
  const descripcion = empresa?.descripcion || "Dedicados a ofrecer ropa deportiva de alta calidad para satisfacer tus necesidades";

  if (loading) {
    return (
      <footer className="bg-blue-50 mt-12">
        <div className="container mx-auto py-10 px-4">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-28"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-36"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-blue-50 mt-12">
      <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contacto */}
        <div>
          <h4 className="font-bold text-lg mb-2">Contáctanos</h4>
          <p className="mb-1">
            <span className="font-semibold">Dirección:</span> {direccion}
          </p>
          {empresa?.celular && (
            <p className="mb-1">
              <span className="font-semibold">Celular:</span> {empresa.celular}
            </p>
          )}
          {email && (
            <p className="mb-1">
              <span className="font-semibold">Email:</span> {email}
            </p>
          )}
          <p className="mb-3">
            <span className="font-semibold">Hora:</span> {horario}
          </p>
          <div>
            <h4 className="font-semibold">Síguenos</h4>
            <div className="flex gap-3 mt-1">
              {facebook && facebook !== "#" && (
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity"
                >
                  <img src="/img/icon-facebook.svg" alt="Facebook" className="h-7" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Más */}
        <div>
          <h3 className="font-bold text-lg mb-2">Más</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/sobre-nosotros" className="hover:underline">
                Acerca de Nosotros
              </Link>
            </li>
            <li>
              <Link to="/politicas" className="hover:underline">
                Políticas de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/terminos" className="hover:underline">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:underline">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        {/* Mi cuenta */}
        <div>
          <h3 className="font-bold text-lg mb-2">Mi Cuenta</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/login" className="hover:underline">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/perfil" className="hover:underline">
                Mi perfil
              </Link>
            </li>
            <li>
              <Link to="/mis-pedidos" className="hover:underline">
                Ver mis Pedidos
              </Link>
            </li>
          </ul>
        </div>

        {/* Slogan + logo */}
        <div>
          <h3 className="font-bold text-lg mb-2">Diseña, inventa y crea</h3>
          <p className="mb-3">{descripcion}</p>
          <img 
            src={logoHorizontal} 
            alt={`${nombreEmpresa} logo`} 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.target.src = "/img/LogoHori.png";
            }}
          />
        </div>
      </div>

      <div className="border-t text-center py-4 text-gray-700 text-sm">
        <p>
          &copy; {new Date().getFullYear()} {nombreEmpresa}. Todos los derechos reservados | 
          Diseñado por JohanZg
        </p>
      </div>
    </footer>
  );
}
