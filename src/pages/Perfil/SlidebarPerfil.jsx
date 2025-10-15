// src/components/Perfil/SidebarPerfil.jsx
import React from "react";
import { MapPin, User, Box, LogOut } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SidebarPerfil({ active, setActive }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { id: "pedidos", label: "Órdenes", icon: <Box size={20} /> },
    { id: "datos", label: "Datos personales", icon: <User size={20} /> },
    { id: "direcciones", label: "Direcciones", icon: <MapPin size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white rounded-2xl shadow-md p-6 h-fit">
      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left font-medium transition
              ${
                active === item.id
                  ? "bg-blue-100 text-blue-900 border-l-4 border-blue-900"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <hr className="my-4" />
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="flex items-center gap-3 text-red-600 font-semibold hover:text-red-700"
      >
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
}
