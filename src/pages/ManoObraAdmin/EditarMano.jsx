// src/pages/ManoObra/EditarMano.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

function ModalCategorias({ show, categorias, onSelect, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl min-w-[300px]">
        <h3 className="font-bold text-lg mb-2">Seleccionar Categoría</h3>
        <ul>
          {categorias.map((cat) => (
            <li
              key={cat._id}
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
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function EditarManoObra() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalCat, setModalCat] = useState(false);

  const [insumos, setInsumos] = useState([]);
  const [disenos, setDisenos] = useState({
    logo_bordado_grande: 0,
    logo_bordado_pequeno: 0,
    logo_estampado_grande: 0,
    logo_estampado_pequeno: 0,
    sublimado: 0,
  });
  const [manoObraPrenda, setManoObraPrenda] = useState(0);
  const [total, setTotal] = useState(0);

  const [msg, setMsg] = useState("");

  // 🔹 Cargar categorías y la mano de obra actual
  useEffect(() => {
    fetch(`${API_URL}/catg_prod/all`)
      .then((res) => res.json())
      .then((data) => setCategorias(data));

    fetch(`${API_URL}/mano/get/${id}`)
      .then((res) => res.json())
      .then((mano) => {
        setCategoriaSeleccionada({
          _id: mano.categoria_id,
          nombre: mano.categoria_nombre,
        });
        setInsumos(mano.insumos || []);
        setDisenos({
          logo_bordado_grande: mano.disenos?.logo_bordado_grande || 0,
          logo_bordado_pequeno: mano.disenos?.logo_bordado_pequeno || 0,
          logo_estampado_grande: mano.disenos?.logo_estampado_grande || 0,
          logo_estampado_pequeno: mano.disenos?.logo_estampado_pequeno || 0,
          sublimado: mano.disenos?.sublimado || 0,
        });
        setManoObraPrenda(mano.mano_obra_prenda || 0);
        setTotal(mano.total || 0);
      });
  }, [id]);

  // 🔹 Recalcular total
  useEffect(() => {
    const insumosTotal = insumos.reduce(
      (acc, ins) => acc + parseFloat(ins.costo || 0),
      0
    );
    const mano = parseFloat(manoObraPrenda || 0);
    setTotal(insumosTotal + mano);
  }, [insumos, manoObraPrenda]);

  // 🔹 Guardar cambios
  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoriaSeleccionada) {
      setMsg("Selecciona una categoría.");
      return;
    }
    const data = {
      categoria_id: categoriaSeleccionada._id,
      categoria_nombre: categoriaSeleccionada.nombre,
      insumos,
      disenos,
      mano_obra_prenda: manoObraPrenda,
      total,
    };
    const res = await fetch(`${API_URL}/mano/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/manObra"), 1200);
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Mano de Obra</h1>
      <p className="mb-8 text-gray-600">
        Modifica los valores de insumos, diseño y mano de obra por prenda
      </p>

      <form
        className="max-w-2xl mx-auto flex flex-col gap-8"
        onSubmit={handleSubmit}
      >
        {/* Categoría */}
        <div>
          <label className="block text-lg font-bold mb-1">
            Categoría seleccionada
          </label>
          <div className="flex gap-3 mt-2 items-center">
            <input
              className="bg-gray-100 w-full rounded-xl px-4 py-2 shadow-inner outline-none font-semibold text-gray-700"
              value={
                categoriaSeleccionada
                  ? categoriaSeleccionada.nombre
                  : "Ninguna seleccionada"
              }
              readOnly
            />
            <button
              type="button"
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded-xl shadow hover:bg-blue-700"
              onClick={() => setModalCat(true)}
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Insumos dinámicos */}
        {insumos.length > 0 && (
          <div>
            <div className="font-bold text-xl mb-2">Insumos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {insumos.map((ins, idx) => (
                <div key={idx}>
                  <label className="font-bold">Costo {ins.nombre}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                    value={ins.costo}
                    min={0}
                    onChange={(e) => {
                      const updated = [...insumos];
                      updated[idx].costo = parseFloat(e.target.value);
                      setInsumos(updated);
                    }}
                    placeholder="$0.00"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diseños */}
        <div>
          <div className="font-bold text-xl mb-2">Diseño</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.keys(disenos).map((tipo) => (
              <div key={tipo}>
                <label className="font-bold">
                  Costo {tipo.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="block w-full bg-gray-100 rounded-lg px-4 py-2 mt-1 font-semibold shadow"
                  value={disenos[tipo]}
                  min={0}
                  onChange={(e) =>
                    setDisenos({ ...disenos, [tipo]: parseFloat(e.target.value) })
                  }
                  placeholder="$0.00"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mano de obra por prenda */}
        <div>
          <label className="font-bold text-xl mb-2">
            Mano de Obra por Prenda
          </label>
          <input
            type="number"
            step="0.01"
            className="block w-full bg-gray-100 rounded-lg px-4 py-2 font-semibold shadow"
            value={manoObraPrenda}
            min={0}
            onChange={(e) => setManoObraPrenda(parseFloat(e.target.value))}
            placeholder="$0.00"
          />
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
        >
          Guardar Cambios
        </button>

        {msg && (
          <div className="text-center text-lg mt-2 font-bold text-blue-900">
            {msg}
          </div>
        )}
      </form>

      <ModalCategorias
        show={modalCat}
        categorias={categorias}
        onSelect={(cat) => {
          setCategoriaSeleccionada(cat);
          setInsumos(cat.insumos_posibles.map((i) => ({ nombre: i, costo: 0 })));
          setModalCat(false);
        }}
        onClose={() => setModalCat(false)}
      />
    </div>
  );
}
