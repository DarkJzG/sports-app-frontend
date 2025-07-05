import React from "react";

export default function Catalogo() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Prendas</h1>
      {/* Aquí irá el listado de productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Producto ficticio */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="h-40 w-40 bg-gray-200 mb-4" />
          <h2 className="font-semibold text-lg">Camiseta Deportiva</h2>
          <p className="text-gray-500">Precio: $20</p>
          <button className="mt-2 bg-blue-900 text-white px-4 py-2 rounded">Comprar</button>
        </div>
        {/* ... más productos */}
      </div>
    </div>
  );
}
