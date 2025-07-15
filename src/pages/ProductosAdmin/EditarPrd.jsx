import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [telas, setTelas] = useState([]);
  const [tela, setTela] = useState("");
  const [colores, setColores] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [namediseno, setNamediseno] = useState("Ninguno");
  const [diseno, setDiseno] = useState(0);
  const [manoObra, setManoObra] = useState(0);
  const [metrocantidad, setMetrocantidad] = useState(0);
  const [costounitario, setCostounitario] = useState(0);
  const [costoxmayor, setCostoxmayor] = useState(0);
  const [preciomenor, setPreciomenor] = useState(0);
  const [preciomayor, setPreciomayor] = useState(0);
  const [ganamenor, setGanamenor] = useState(0);
  const [ganamayor, setGanamayor] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imagen, setImagen] = useState(null);
  const [msg, setMsg] = useState("");
  const [talla, setTalla] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/catg/all").then(res => res.json()).then(setCategorias);
    fetch("http://localhost:5000/tela/all").then(res => res.json()).then(setTelas);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/producto/get/${id}`)
      .then(res => res.json())
      .then(producto => {
        setNombre(producto.nombre);
        setCategoria(producto.categoria);
        setTela(telas.find(t => t.nombre === producto.tela)?._id || "");
        setColoresSeleccionados(producto.color || []);
        setNamediseno(producto.namediseno);
        setDiseno(producto.diseno);
        setManoObra(producto.manoobra);
        setMetrocantidad(producto.metrocantidad);
        setCostounitario(producto.costounitario);
        setCostoxmayor(producto.costoxmayor);
        setPreciomenor(producto.preciomenor);
        setPreciomayor(producto.preciomayor);
        setGanamenor(producto.ganamenor);
        setGanamayor(producto.ganamayor);
        setImageUrl(producto.imageUrl);
        setTalla(producto.talla);
      });
  }, [id, telas]);

  useEffect(() => {
    if (tela) {
      fetch(`http://localhost:5000/tela/get/${tela}`)
        .then(res => res.json())
        .then(data => setColores(data.colores || []));
    } else {
      setColores([]);
    }
  }, [tela]);

  useEffect(() => {
    const objTela = telas.find(t => t._id === tela);
    const precioMetro = objTela ? parseFloat(objTela.precio_metro) : 0;
    const costo = (precioMetro * metrocantidad) + Number(manoObra) + Number(diseno);
    setCostounitario(costo);
    const costoxmayor = costo * 0.9;
    setCostoxmayor(costoxmayor);

    setGanamenor(preciomenor - costo);
    setGanamayor(preciomayor - costoxmayor);
  }, [tela, metrocantidad, manoObra, diseno, telas, preciomenor, preciomayor]);

  useEffect(() => {
    if (!imagen) return;
    const data = new FormData();
    data.append('file', imagen);
    data.append('upload_preset', 'telas_folder');
    data.append('folder', 'productos');
    fetch("https://api.cloudinary.com/v1_1/dcn5d4wbo/image/upload", {
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then(img => setImageUrl(img.secure_url));
  }, [imagen]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nombre || !categoria || !tela || coloresSeleccionados.length === 0 || !imageUrl) {
      setMsg("Completa todos los campos obligatorios.");
      return;
    }
    const data = {
      nombre, categoria,
      tela: telas.find(t => t._id === tela)?.nombre,
      color: coloresSeleccionados,
      namediseno, diseno, manoobra: manoObra,
      metrocantidad, costounitario, costoxmayor,
      preciomenor, preciomayor, ganamenor, ganamayor,
      imageUrl, talla
    };
    const res = await fetch(`http://localhost:5000/producto/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    setMsg(resData.msg);
    if (resData.ok) setTimeout(() => navigate("/productos"), 1500);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
      <p className="mb-6 text-gray-600">Modifica los datos de la prenda</p>
      <form onSubmit={handleUpdate} className="flex flex-wrap gap-6">
        <div>
          <img src={imageUrl} alt="producto" className="w-48 h-48 object-contain" />
          <input type="file" onChange={e => setImagen(e.target.files[0])} />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="border p-2 rounded" placeholder="Nombre" />
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border p-2 rounded">
            <option value="">Selecciona categoría</option>
            {categorias.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
          <select value={tela} onChange={e => setTela(e.target.value)} className="border p-2 rounded">
            <option value="">Selecciona tela</option>
            {telas.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
          </select>
          <select value={talla} onChange={e => setTalla(e.target.value)} className="border p-2 rounded">
            <option value="">Selecciona talla</option>
            {["S", "M", "L", "XL", "XXL"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="col-span-2">
            <label className="font-bold">Colores:</label>
            <div className="flex gap-2 mt-1">
              {colores.map((c, i) => {
                const selected = coloresSeleccionados.some(col => col.codigo === c.codigo);
                return (
                  <div key={i} className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selected ? 'border-blue-700' : 'border-gray-300'}`} style={{ backgroundColor: c.codigo }}
                    onClick={() => {
                      if (selected) {
                        setColoresSeleccionados(coloresSeleccionados.filter(col => col.codigo !== c.codigo));
                      } else if (coloresSeleccionados.length < 5) {
                        setColoresSeleccionados([...coloresSeleccionados, c]);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
          <select value={namediseno} onChange={e => setNamediseno(e.target.value)} className="border p-2 rounded">
            {['Ninguno', 'Bordado', 'Estampado', 'Sublimado'].map(op => <option key={op}>{op}</option>)}
          </select>
          <input type="number" step="0.01" value={metrocantidad} onChange={e => setMetrocantidad(parseFloat(e.target.value))} className="border p-2 rounded" placeholder="Metros de tela" />
          <input value={costounitario.toFixed(2)} readOnly className="border p-2 rounded" placeholder="Costo unitario" />
          <input type="number" step="0.01" value={preciomenor} onChange={e => setPreciomenor(parseFloat(e.target.value))} className="border p-2 rounded" placeholder="Precio menor" />
          <input type="number" step="0.01" value={preciomayor} onChange={e => setPreciomayor(parseFloat(e.target.value))} className="border p-2 rounded" placeholder="Precio mayor" />
        </div>
        <button type="submit" className="bg-blue-900 text-white font-bold py-3 px-6 rounded hover:bg-blue-700">Actualizar Cambios</button>
        {msg && <div className="w-full text-center text-blue-800 font-bold mt-2">{msg}</div>}
      </form>
    </div>
  );
}