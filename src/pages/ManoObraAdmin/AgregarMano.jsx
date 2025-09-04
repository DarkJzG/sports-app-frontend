import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

// Modal simple para seleccionar la categoría (puedes mejorarlo luego)
function ModalCategorias({ show, categorias, onSelect, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Seleccionar Categoría</h3>
        <ul>
          {categorias.map(cat => (
            <li key={cat._id}
              className="cursor-pointer py-2 px-3 rounded hover:bg-blue-100"
              onClick={() => onSelect(cat)}
            >
              {cat.nombre}
            </li>
          ))}
        </ul>
        <button
          className="bg-gray-300 rounded px-4 py-1 mt-4 float-right"
          onClick={onClose}
        >Cerrar</button>
      </div>
    </div>
  );
}

export default function AgregarManoObra() {
  const navigate = useNavigate();

  // Estados
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalCat, setModalCat] = useState(false);

  const [insumoHilo, setInsumoHilo] = useState(0);
  const [insumoManoObra, setInsumoManoObra] = useState(0);
  const [insumoElastico, setInsumoElastico] = useState(0);
  const [insumoCierre, setInsumoCierre] = useState(0);
  const [bordado, setBordado] = useState(0);
  const [estampado, setEstampado] = useState(0);
  const [sublimado, setSublimado] = useState(0);
  const [total, setTotal] = useState(0);

  const [msg, setMsg] = useState("");

  // Traer las categorías de producto
  useEffect(() => {
    fetch(`${API_URL}/catg/all`)
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  // Recalcular total cuando cambian insumos
  useEffect(() => {
    setTotal(
      parseFloat(insumoHilo || 0) +
      parseFloat(insumoManoObra || 0) +
      parseFloat(insumoElastico || 0) +
      parseFloat(insumoCierre || 0)
    );
  }, [insumoHilo, insumoManoObra, insumoElastico, insumoCierre]);

  // Enviar formulario
  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoriaSeleccionada) {
      setMsg("Selecciona una categoría.");
      return;
    }
    const data = {
      categoria_id: categoriaSeleccionada._id,
      categoria_nombre: categoriaSeleccionada.nombre,
      insumo_hilo: insumoHilo,
      insumo_mano_obra: insumoManoObra,
      insumo_elastico: insumoElastico,
      insumo_cierre: insumoCierre,
      bordado: bordado,
      estampado: estampado,
      sublimado: sublimado,
      total: total,
    };
    const res = await fetch(`${API_URL}/mano/add`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/manObra"), 1200);
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      {/* HEADER Y NAVBAR AQUÍ */}
      <h1 className="text-4xl font-bold mb-2">Agregar Mano de Obra</h1>
      <p className="mb-8 text-gray-600">
        Complete los campos solicitados para agregar una nueva mano de obra
      </p>

      <form className="max-w-2xl mx-auto flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* Selección categoría */}
        <div>
          <label className="block text-lg font-bold mb-1">Seleccionar categoría</label>
          <span className="text-gray-500 text-sm">Selecciona la categoría del producto a la que pertenecerá esta mano de obra</span>
          <div className="flex gap-3 mt-2 items-center">
            <input
              className="bg-gray-100 w-full rounded-xl px-4 py-2 shadow-inner outline-none font-semibold text-gray-700"
              value={categoriaSeleccionada ? categoriaSeleccionada.nombre : "CATEGORÍA SELECCIONADA"}
              readOnly
            />
            <button
              type="button"
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-xl shadow hover:bg-blue-700"
              onClick={() => setModalCat(true)}
            >Seleccionar Categoría</button>
          </div>
        </div>

        {/* Insumos */}
        <div>
          <div className="font-bold text-xl mb-2">Insumos</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-bold">Costo x hilos</label>
              <input
                type="number"
                step="0.01"
                className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                value={insumoHilo}
                min={0}
                onChange={e => setInsumoHilo(e.target.value)}
                placeholder="$0.00"
              />
            </div>
            <div>
              <label className="font-bold">Costo x mano de obra</label>
              <input
                type="number"
                step="0.01"
                className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                value={insumoManoObra}
                min={0}
                onChange={e => setInsumoManoObra(e.target.value)}
                placeholder="$0.00"
              />
            </div>
            <div>
              <label className="font-bold">Costo x elástico</label>
              <input
                type="number"
                step="0.01"
                className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                value={insumoElastico}
                min={0}
                onChange={e => setInsumoElastico(e.target.value)}
                placeholder="$0.00"
              />
            </div>
            <div>
              <label className="font-bold">Costo x cierre</label>
              <input
                type="number"
                step="0.01"
                className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                value={insumoCierre}
                min={0}
                onChange={e => setInsumoCierre(e.target.value)}
                placeholder="$0.00"
              />
            </div>
          </div>
            
            <div className="font-bold text-xl mb-2">Diseño</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="font-bold">Costo bordado</label>
                        <input
                        type="number"
                        step="0.01"
                        className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                        value={bordado}
                        min={0}
                        onChange={e => setBordado(e.target.value)}
                        placeholder="$0.00"
                        />
                    </div>
                    <div>
                        <label className="font-bold">Costo estampado</label>
                        <input
                        type="number"
                        step="0.01"
                        className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                        value={estampado}
                        min={0}
                        onChange={e => setEstampado(e.target.value)}
                        placeholder="$0.00"
                        />
                    </div>
                    <div>
                        <label className="font-bold">Costo sublimado</label>
                        <input
                        type="number"
                        step="0.01"
                        className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                        value={sublimado}
                        min={0}
                        onChange={e => setSublimado(e.target.value)}
                        placeholder="$0.00"
                        />
                    </div>
                </div>
            </div>

        {/* Total */}
        <div>
          <label className="font-bold text-xl block mb-2">Costo Total</label>
          <input
            className="bg-gray-100 text-2xl font-bold px-4 py-3 rounded-xl shadow w-full"
            value={`$${total.toFixed(2)}`}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700"
        >Agregar Mano de Obra</button>

        {msg && (
          <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>
        )}
      </form>

      <ModalCategorias
        show={modalCat}
        categorias={categorias}
        onSelect={cat => {
          setCategoriaSeleccionada(cat);
          setModalCat(false);
        }}
        onClose={() => setModalCat(false)}
      />
    </div>
  );
}
