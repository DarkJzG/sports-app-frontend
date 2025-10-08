import React from "react";
import { Loader2 } from "lucide-react"; 

export default function PantallaCarga({ show = false, message = "Cargando..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center animate-fade-in">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
        <p className="text-gray-800 font-semibold">{message}</p>
      </div>
    </div>
  );
}
