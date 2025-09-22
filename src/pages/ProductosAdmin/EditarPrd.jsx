// src/pages/Productos/EditarProducto.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(null);

  const [telas, setTelas] = useState([]);
  const [tela, setTela] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [color, setColor] = useState(null);

  const [manoObra, setManoObra] = useState(null);
  const [insumos, setInsumos] = useState([]);

  const [metros, setMetros] = useState(1);
  const [precioVenta, setPrecioVenta] = useState(0);

  const [costos, setCostos] = useState({
    tela: 0,
    manoObra: 0,
    insumos: 0,
    disenos: 0,
    total: 0,
  });

  const [cantDisenos, setCantDisenos] = useState({
    logo_bordado_grande: 0,
    logo_bordado_pequeno: 0,
    logo_estampado_grande: 0,
    logo_estampado_pequeno: 0,
    sublimado: 0,
  });

  const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);
  const opcionesTallas = ["S", "M", "L", "XL", "XXL"];

  const [imagen, setImagen] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [msg, setMsg] = useState("");

  const [gananciaMenor, setGananciaMenor] = useState(0);
  const [gananciaMayor, setGananciaMayor] = useState(0);

  // -------------------------------
  // Cargar datos iniciales
  // -------------------------------
  useEffect(() => {
    // cargar catg y telas
    fetch(`${API_URL}/catg_prod/all`).then(res => res.json()).then(setCategorias);
    fetch(`${API_URL}/tela/all`).then(res => res.json()).then(setTelas);

    // cargar producto existente
    fetch(`${API_URL}/producto/get/${id}`)
      .then(res => res.json())
      .then(prod => {
        setNombre(prod.nombre || "");
        setObservaciones(prod.observaciones || "");
        setCategoria({ _id: prod.categoria_id, nombre: prod.categoria_nombre });
        setTela({ _id: prod.tela_id, nombre: prod.tela_nombre });
        setColor(prod.color || null);
        setTallasSeleccionadas(prod.tallas_disponibles || []);
        setMetros(prod.costos?.metros || 1);
        setPrecioVenta(prod.precio_venta || 0);
        setCostos(prod.costos || {});
        setCantDisenos(prod.cantDisenos || {
          logo_bordado_grande: 0,
          logo_bordado_pequeno: 0,
          logo_estampado_grande: 0,
          logo_estampado_pequeno: 0,
          sublimado: 0,
        });
        setImageUrl(prod.imagen_url || "");
      });
  }, [id]);

  // -------------------------------
  // Al seleccionar categoría → cargar mano de obra
  // -------------------------------
  useEffect(() => {
    if (!categoria) return;
    fetch(`${API_URL}/mano/all`)
      .then(res => res.json())
      .then(data => {
        const mo = data.find(m => m.categoria_id === categoria._id);
        setManoObra(mo || null);
      });
  }, [categoria]);

  // -------------------------------
  // Al seleccionar tela → cargar lotes
  // -------------------------------
  useEffect(() => {
    if (!tela) return;
    fetch(`${API_URL}/tela/get/${tela._id}`)
      .then(res => res.json())
      .then(data => setLotes(data.lotes || []));
  }, [tela]);

  // -------------------------------
  // Subir nueva imagen
  // -------------------------------
  useEffect(() => {
    if (!imagen) return;
    const data = new FormData();
    data.append("file", imagen);
    data.append("upload_preset", "productos_preset");
    data.append("folder", "productos");

    fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST",
      body: data,
    })
      .then(res => res.json())
      .then(img => setImageUrl(img.secure_url));
  }, [imagen]);

  // -------------------------------
  // Calcular costos
  // -------------------------------
  useEffect(() => {
    const costoTela = color ? parseFloat(color.precio_unitario) * metros : 0;
    const costoManoObra = manoObra ? manoObra.mano_obra_prenda : 0;
    const costoInsumos = manoObra?.insumos?.reduce((acc, ins) => acc + parseFloat(ins.costo || 0), 0) || 0;



    let costoDisenos = 0;
    if (manoObra?.disenos) {
      for (let key of Object.keys(cantDisenos)) {
        const tarifa = parseFloat(manoObra.disenos[key] || 0);
        const cantidad = parseInt(cantDisenos[key] || 0);
        costoDisenos += tarifa * cantidad;
      }
    }

    const total = costoTela + costoManoObra + costoDisenos + costoInsumos;

    setCostos({ tela: costoTela, manoObra: costoManoObra, disenos: costoDisenos, insumos: costoInsumos, total });

    // Ganancias
    const ganMenor = precioVenta - total;
    const precioMayor = precioVenta * 0.9;
    const ganMayor = precioMayor - total;

    setGananciaMenor(ganMenor);
    setGananciaMayor(ganMayor);
  }, [color, metros, manoObra, cantDisenos, precioVenta, insumos]);

  // -------------------------------
  // Toggle tallas
  // -------------------------------
  function toggleTalla(talla) {
    if (tallasSeleccionadas.includes(talla)) {
      setTallasSeleccionadas(tallasSeleccionadas.filter(t => t !== talla));
    } else {
      setTallasSeleccionadas([...tallasSeleccionadas, talla]);
    }
  }

  // -------------------------------
  // Guardar cambios
  // -------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !categoria || !tela || !color || !cantDisenos || !imageUrl) {
      setMsg("Completa todos los campos");
      return;
    }

    const data = {
      nombre,
      observaciones,
      categoria_id: categoria._id,
      categoria_nombre: categoria.nombre,
      tela_id: tela._id,
      tela_nombre: tela.nombre,
      color,
      tallas_disponibles: tallasSeleccionadas,
      mano_obra_id: manoObra?._id || null,
      mano_obra_prenda: manoObra?.mano_obra_prenda || 0,
      insumos: manoObra?.insumos || [],
      cantDisenos,
      costos,
      precio_venta: precioVenta,
      ganancia_menor: gananciaMenor,
      ganancia_mayor: gananciaMayor,
      imagen_url: imageUrl,
    };

    const res = await fetch(`${API_URL}/producto/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/producto"), 1200);
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Editar Producto</h1>
      <p className="mb-8 text-gray-600">Modifica los campos de la prenda</p>

      <form className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8" onSubmit={handleSubmit}>
        {/* Imagen */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
            {imageUrl ? <img src={imageUrl} alt="img-prod" className="h-44 w-44 object-contain" /> : <span className="text-4xl">📷</span>}
          </div>
          <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
        </div>

        {/* Datos */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Nombre */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Nombre</label>
            <input className="w-full bg-transparent outline-none mt-1" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          {/* Observaciones */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Observaciones</label>
            <textarea className="w-full bg-transparent outline-none mt-1" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>

          {/* Categoría */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Categoría</label>
            <select className="w-full bg-transparent mt-1" value={categoria?._id || ""} onChange={e => setCategoria(categorias.find(c => c._id === e.target.value))}>
              <option value="">Selecciona...</option>
              {categorias.map(c => (
                <option value={c._id} key={c._id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Tela y color */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Tela</label>
            <select className="w-full bg-transparent mt-1" value={tela?._id || ""} onChange={e => setTela(telas.find(t => t._id === e.target.value))}>
              <option value="">Selecciona...</option>
              {telas.map(t => <option value={t._id} key={t._id}>{t.nombre}</option>)}
            </select>
          </div>

          {lotes.length > 0 && (
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="font-bold">Color</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {lotes.map(l => (
                  <div key={l.lote_id} className={`px-3 py-2 rounded-lg cursor-pointer border shadow-sm ${color?.lote_id === l.lote_id ? "border-blue-700 bg-blue-100" : "border-gray-300"}`} onClick={() => setColor(l)}>
                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: l.color.split("(")[1]?.replace(")", "") }} />
                    <span className="ml-2">{l.color}</span>
                    <span className="ml-2 text-sm text-gray-600">${l.precio_unitario}/m</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diseños */}
          {manoObra?.disenos && (
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
              <label className="font-bold">Diseños (cantidades)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                {Object.keys(manoObra.disenos).map(key => (
                  <div key={key}>
                    <label className="font-semibold">{key.replace(/_/g, " ")} (${manoObra.disenos[key]})</label>
                    <input type="number" min={0} className="w-full bg-gray-100 rounded-lg px-4 py-2 mt-1" value={cantDisenos[key]} onChange={e => setCantDisenos({ ...cantDisenos, [key]: parseInt(e.target.value) || 0 })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tallas */}
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold mb-2">Tallas disponibles</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {opcionesTallas.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tallasSeleccionadas.includes(t)}
                    onChange={() => toggleTalla(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Metros y precio venta */}
          <div className="flex gap-3">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Metros de tela</label>
              <input type="number" step="0.01" className="w-full bg-transparent outline-none mt-1" value={metros} min={0} onChange={e => setMetros(parseFloat(e.target.value))} />
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Precio Venta (unidad)</label>
              <input type="number" step="0.01" className="w-full bg-transparent outline-none mt-1" value={precioVenta} min={0} onChange={e => setPrecioVenta(parseFloat(e.target.value))} />
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-100 rounded-xl px-6 py-4 shadow mt-3">
            <h3 className="font-bold text-lg mb-2">Resumen de costos</h3>
            <p>Tela: ${costos.tela?.toFixed(2) || 0}</p>
            <p>Mano de obra: ${costos.manoObra?.toFixed(2) || 0}</p>
            <p>Insumos: ${costos.insumos?.toFixed(2) || 0}</p>
            <p>Diseños: ${costos.disenos?.toFixed(2) || 0}</p>
            <hr className="my-2" />
            <p className="font-bold">Costo Total: ${costos.total?.toFixed(2) || 0}</p>
            <p>Ganancia al por menor: ${gananciaMenor.toFixed(2)}</p>
            <p>Ganancia al por mayor (≥ 12): ${gananciaMayor.toFixed(2)}</p>
          </div>

          <button type="submit" className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full">Guardar Cambios</button>
          {msg && <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
