import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EditarCategoria() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      {/* ... igual que el anterior ... */}

      <main className="flex-1 max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Editar Categoría de Producto</h2>
        <p className="text-gray-600 mb-10">Complete los campos solicitados para modificar la categoría</p>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Imagen existente */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
              <img src="/img/categoria.png" alt="img-cat" className="h-20 w-20" />
            </div>
            <button className="bg-blue-900 text-white font-bold px-8 py-2 rounded-xl shadow hover:bg-blue-700">Cambiar Imagen</button>
          </div>
          {/* Formulario */}
          <div className="flex flex-col gap-7 flex-1">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Nombre Categoría</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none" placeholder="Escribe el nombre..." defaultValue="Copa" />
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="text-sm font-bold">Descripción</label>
              <textarea className="w-full bg-transparent outline-none mt-1 border-none" rows={3} placeholder="Escribe la descripción de la categoría" defaultValue="Esta categoría es para copas de deportes..." />
            </div>
            <button className="bg-blue-900 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-blue-700 w-full max-w-xs mx-auto">Actualizar Cambios</button>
          </div>
        </div>
      </main>

      {/* Footer igual que anterior */}
    </div>
  );
}
