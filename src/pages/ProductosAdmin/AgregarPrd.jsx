
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AgregarProducto() {
  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [telas, setTelas] = useState([]);
  const [tela, setTela] = useState("");
  const [colores, setColores] = useState([]);
  const [manoObra, setManoObra] = useState(0);
  const [metrocantidad, setMetrocantidad] = useState(1);
  const [fijarprecio, setFijarprecio] = useState(0);
  const [costounitario, setCostounitario] = useState(0);
  const [costoxmayor, setCostoxmayor] = useState(0);
  const [precioMenor, setPrecioMenor] = useState(0);
  const [precioMayor, setPrecioMayor] = useState(0);
  const [ganamenor, setGanamenor] = useState(0);
  const [ganamayor, setGanamayor] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [namediseno, setNamediseno] = useState("Ninguno");
  const [diseno, setDiseno] = useState(0);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [talla, setTalla] = useState("");
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [observaciones, setObservaciones] = useState("");



  // Fetch categorías y telas
  useEffect(() => {
    fetch(`${API_URL}/catg/all`)
      .then(res => res.json()).then(setCategorias);
    fetch(`${API_URL}/tela/all`)
      .then(res => res.json()).then(setTelas);
  }, []);

  // Cargar mano de obra y valores de diseño
  useEffect(() => {
    if (categoria) {
      fetch(`${API_URL}/mano/all`)
        .then(res => res.json())
        .then(data => {
          const mano = data.find(m => m.categoria_id === categoria);
          setManoObra(mano ? mano.total : 0);
          setDiseno(mano ? mano[namediseno.toLowerCase()] || 0 : 0);
        });
    }
  }, [categoria, namediseno]);

  // Cargar colores cuando selecciona tela
  useEffect(() => {
    if (tela) {
      fetch(`${API_URL}/tela/get/${tela}`)
        .then(res => res.json())
        .then(data => setColores(data.colores || []));
    } else {
      setColores([]);
    }
  }, [tela]);

  // Cargar imagen a Cloudinary automáticamente
  useEffect(() => {
    if (!imagen) return;
    const data = new FormData();
    data.append('file', imagen);
    data.append('upload_preset', 'telas_folder'); // O tu upload preset
    data.append('folder', 'productos');
    fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST", body: data
    })
      .then(res => res.json())
      .then(img => setImageUrl(img.secure_url));
  }, [imagen]);

  // Calcular costos automáticamente
  useEffect(() => {
    // Buscar precio metro de tela
    const objTela = telas.find(t => t._id === tela);
    const precioMetro = objTela ? parseFloat(objTela.precio_metro) : 0;
    // Suma total: (precio tela * metros) + manoObra + diseño
    const costo = (precioMetro * metrocantidad) + Number(manoObra) + Number(diseno);
    setCostounitario(costo);
    const costoxmayor = ((precioMetro * metrocantidad) + Number(manoObra) + Number(diseno)) * 0.9;
    setCostoxmayor(costoxmayor);

    const precioMenor = fijarprecio;
    setPrecioMenor(precioMenor);
    setGanamenor(precioMenor - costo)
    const precioMayor = fijarprecio * 0.9; // Ejemplo: 20% más caro al por mayor
    setPrecioMayor(precioMayor);
    setGanamayor(precioMayor - costoxmayor);

    // Calcular ganancias


    
  }, [tela, metrocantidad, manoObra, diseno, telas, fijarprecio]);

  // Guardar producto
  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !categoria || !tela || coloresSeleccionados.length === 0 || !imageUrl) {
      setMsg("Completa todos los campos");
      return;
    }
    const data = {
      nombre,
      observaciones, 
      categoria: categorias.find(c => c._id === categoria)?.nombre, 
      tela: telas.find(t=>t._id===tela)?.nombre, 
      color: coloresSeleccionados,
      talla,
      manoobra: manoObra, 
      namediseno, 
      diseno,
      metrocantidad, 
      costounitario, 
      costoxmayor,
      preciomenor: precioMenor, 
      preciomayor: precioMayor,
      ganamenor, 
      ganamayor, 
      imageUrl
    };
    const res = await fetch(`${API_URL}/producto/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/producto"), 1200);
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-2">Agregar Producto</h1>
      <p className="mb-8 text-gray-600">Complete los campos para agregar una prenda</p>
      <form className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8" onSubmit={handleSubmit}>
        {/* Imagen */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-[#f4f4f4] rounded-xl flex items-center justify-center shadow mb-5">
            {imageUrl
              ? <img src={imageUrl} alt="img-prod" className="h-44 w-44 object-contain" />
              : <span className="text-4xl">📷</span>
            }
          </div>
          <input type="file" accept="image/*"
            onChange={e => setImagen(e.target.files[0])} />
        </div>
        {/* Datos */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Nombre</label>
            <input className="w-full bg-transparent outline-none mt-1 border-none"
              value={nombre} onChange={e=>setNombre(e.target.value)}
              placeholder="Nombre de la prenda..." />
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Observaciones</label>
            <textarea 
              className="w-full bg-transparent outline-none mt-1 border-none"
              value={observaciones} onChange={e=>setObservaciones(e.target.value)}
              placeholder="Observaciones sobre la prenda..." />
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Categoría</label>
            <select className="w-full bg-transparent mt-1" value={categoria}
              onChange={e=>setCategoria(e.target.value)}>
              <option value="">Selecciona...</option>
              {categorias.map(c => (
                <option value={c._id} key={c._id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Tela</label>
            <select className="w-full bg-transparent mt-1" value={tela}
              onChange={e=>setTela(e.target.value)}>
              <option value="">Selecciona...</option>
              {telas.map(t => (
                <option value={t._id} key={t._id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold mb-2">Colores disponibles (máx. 5)</label>
            <div className="flex flex-wrap gap-3">
              {colores.map((color, index) => {
                const seleccionado = coloresSeleccionados.find(c => c.nombre === color.nombre);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 border px-3 py-2 rounded-lg cursor-pointer shadow-sm 
                      ${seleccionado ? "border-blue-700 bg-blue-100" : "border-gray-300"}`}
                    onClick={() => {
                      if (seleccionado) {
                        setColoresSeleccionados(coloresSeleccionados.filter(c => c.nombre !== color.nombre));
                      } else if (coloresSeleccionados.length < 5) {
                        setColoresSeleccionados([...coloresSeleccionados, color]);
                      }
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-gray-400"
                      style={{ backgroundColor: color.codigo }}
                    />
                    <span className="text-sm">{color.nombre}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Tipo de diseño</label>
            <select className="w-full bg-transparent mt-1"
              value={namediseno} onChange={e=>setNamediseno(e.target.value)}>
              <option value="Ninguno">Ninguno</option>
              <option value="Bordado">Bordado</option>
              <option value="Estampado">Estampado</option>
              <option value="Sublimado">Sublimado</option>
            </select>
          </div>

          <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4">
            <label className="font-bold">Talla</label>
            <select className="w-full bg-transparent mt-1" value={talla} onChange={e => setTalla(e.target.value)}>
              <option value="">Selecciona...</option>
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          
          <div className="flex gap-3">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Metros de tela</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none"
                type="number" min={0} step="0.01" 
                value={metrocantidad} onChange={e=>setMetrocantidad(e.target.value)} />
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Costo unitario</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none"
                value={costounitario.toFixed(2)} readOnly />
            </div>
          </div>

          <div className="flex gap-">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Fijar Precio de Venta</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none"
                type="number" min={0} step="0.01" 
                value={fijarprecio} onChange={e => setFijarprecio(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Precio al por menor</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none"
                type="number" min={0} step="0.01" placeholder="$0.00"
                value={precioMenor.toFixed(2)} readOnly />
              <div className="text-sm mt-1 text-gray-600 font-bold">Ganancia: ${ganamenor.toFixed(2)}</div>
            </div>
            <div className="bg-[#f7f7f7] rounded-xl shadow px-6 py-4 w-1/2">
              <label className="font-bold">Precio al por mayor</label>
              <input className="w-full bg-transparent outline-none mt-1 border-none"
                type="number" min={0} step="0.01" placeholder="$0.00"
                value={precioMayor.toFixed(2)} readOnly />
              <div className="text-sm mt-1 text-gray-600 font-bold">Ganancia: ${ganamayor.toFixed(2)}</div>
            </div>
          </div>
          <button type="submit" className="bg-blue-900 text-white font-bold text-xl px-8 py-4 rounded-xl mt-6 shadow hover:bg-blue-700 w-full">
            Agregar Producto
          </button>
          {msg && <div className="text-center text-lg mt-2 font-bold text-blue-900">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
