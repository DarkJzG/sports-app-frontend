// src/pages/PerfilEmpresa/PerfilEmpresa.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NavbarAdmin from "../../../components/NavbarAdmin";
import FooterAdmin from "../../../components/FooterAdmin";
import { API_URL } from "../../../config";

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">{title}</h3>
    {children}
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const ImageUpload = ({ label, campo, currentUrl, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);

  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('imagen', file);

      const response = await fetch(`${API_URL}/empresa/imagen/${campo}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        toast.success(data.msg);
        setPreview(data.empresa[campo]);
        if (onUpload) onUpload(data.empresa);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-start gap-4">
        {preview && (
          <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formatos: JPG, PNG, GIF. Máximo 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PerfilEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [datosGenerales, setDatosGenerales] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    pais: "",
    telefono: "",
    celular: "",
    email: "",
    sitioWeb: "",
    descripcion: ""
  });

  const [redesSociales, setRedesSociales] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    whatsapp: "",
    tiktok: ""
  });

  const [datosBancarios, setDatosBancarios] = useState({
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    titular: ""
  });

  const [horarioAtencion, setHorarioAtencion] = useState({
    lunes: "",
    martes: "",
    miercoles: "",
    jueves: "",
    viernes: "",
    sabado: "",
    domingo: ""
  });

  const [configuracion, setConfiguracion] = useState({
    iva: 15,
    moneda: "USD",
    simboloMoneda: "$"
  });

  useEffect(() => {
    cargarEmpresa();
  }, []);

  const cargarEmpresa = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/empresa/`);
      const data = await response.json();

      if (data.ok) {
        setEmpresa(data.empresa);
        
        // Cargar datos generales
        setDatosGenerales({
          nombre: data.empresa.nombre || "",
          ruc: data.empresa.ruc || "",
          direccion: data.empresa.direccion || "",
          ciudad: data.empresa.ciudad || "",
          provincia: data.empresa.provincia || "",
          pais: data.empresa.pais || "",
          telefono: data.empresa.telefono || "",
          celular: data.empresa.celular || "",
          email: data.empresa.email || "",
          sitioWeb: data.empresa.sitioWeb || "",
          descripcion: data.empresa.descripcion || ""
        });

        // Cargar redes sociales
        if (data.empresa.redesSociales) {
          setRedesSociales(data.empresa.redesSociales);
        }

        // Cargar datos bancarios
        if (data.empresa.datosBancarios) {
          setDatosBancarios(data.empresa.datosBancarios);
        }

        // Cargar horarios
        if (data.empresa.horarioAtencion) {
          setHorarioAtencion(data.empresa.horarioAtencion);
        }

        // Cargar configuración
        if (data.empresa.configuracion) {
          setConfiguracion(data.empresa.configuracion);
        }
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar información de la empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const dataToSend = {
        ...datosGenerales,
        redesSociales,
        datosBancarios,
        horarioAtencion,
        configuracion
      };

      const response = await fetch(`${API_URL}/empresa/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.ok) {
        toast.success(data.msg);
        setEmpresa(data.empresa);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavbarAdmin />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
        <FooterAdmin />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarAdmin />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Perfil de la Empresa</h1>
          <p className="text-gray-600 mt-2">Configura la información general de tu empresa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imágenes de la Empresa */}
          <InfoCard title="🖼️ Imágenes de la Empresa">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Logo de la Empresa"
                campo="logo"
                currentUrl={empresa?.logo}
                onUpload={(updatedEmpresa) => setEmpresa(updatedEmpresa)}
              />
              <ImageUpload
                label="Banner Principal"
                campo="banner"
                currentUrl={empresa?.banner}
                onUpload={(updatedEmpresa) => setEmpresa(updatedEmpresa)}
              />
              <ImageUpload
                label="Favicon (Icono del Navegador)"
                campo="favicon"
                currentUrl={empresa?.favicon}
                onUpload={(updatedEmpresa) => setEmpresa(updatedEmpresa)}
              />
              <ImageUpload
                label="Imagen para PDFs"
                campo="imagenPdf"
                currentUrl={empresa?.imagenPdf}
                onUpload={(updatedEmpresa) => setEmpresa(updatedEmpresa)}
              />
            </div>
          </InfoCard>

          {/* Datos Generales */}
          <InfoCard title="📋 Información General">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nombre de la Empresa"
                name="nombre"
                value={datosGenerales.nombre}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: Tu Empresa S.A."
                required
              />
              <InputField
                label="RUC"
                name="ruc"
                value={datosGenerales.ruc}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: 1234567890001"
                required
              />
              <InputField
                label="Dirección"
                name="direccion"
                value={datosGenerales.direccion}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: Calle Principal #123"
                required
              />
              <InputField
                label="Ciudad"
                name="ciudad"
                value={datosGenerales.ciudad}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: Quito"
                required
              />
              <InputField
                label="Provincia"
                name="provincia"
                value={datosGenerales.provincia}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: Pichincha"
              />
              <InputField
                label="País"
                name="pais"
                value={datosGenerales.pais}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: Ecuador"
              />
              <InputField
                label="Teléfono"
                name="telefono"
                value={datosGenerales.telefono}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: (593) 2-123-4567"
              />
              <InputField
                label="Celular"
                name="celular"
                value={datosGenerales.celular}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: 0999999999"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={datosGenerales.email}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: ventas@tuempresa.com"
                required
              />
              <InputField
                label="Sitio Web"
                name="sitioWeb"
                value={datosGenerales.sitioWeb}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Ej: www.tuempresa.com"
              />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Descripción de la Empresa"
                name="descripcion"
                value={datosGenerales.descripcion}
                onChange={(e) => handleInputChange(e, setDatosGenerales)}
                placeholder="Describe brevemente tu empresa..."
                rows={4}
              />
            </div>
          </InfoCard>

          {/* Redes Sociales */}
          <InfoCard title="📱 Redes Sociales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Facebook"
                name="facebook"
                value={redesSociales.facebook}
                onChange={(e) => handleInputChange(e, setRedesSociales)}
                placeholder="https://facebook.com/tuempresa"
              />
              <InputField
                label="Instagram"
                name="instagram"
                value={redesSociales.instagram}
                onChange={(e) => handleInputChange(e, setRedesSociales)}
                placeholder="https://instagram.com/tuempresa"
              />
              <InputField
                label="Twitter"
                name="twitter"
                value={redesSociales.twitter}
                onChange={(e) => handleInputChange(e, setRedesSociales)}
                placeholder="https://twitter.com/tuempresa"
              />
              <InputField
                label="WhatsApp"
                name="whatsapp"
                value={redesSociales.whatsapp}
                onChange={(e) => handleInputChange(e, setRedesSociales)}
                placeholder="593999999999"
              />
              <InputField
                label="TikTok"
                name="tiktok"
                value={redesSociales.tiktok}
                onChange={(e) => handleInputChange(e, setRedesSociales)}
                placeholder="https://tiktok.com/@tuempresa"
              />
            </div>
          </InfoCard>

          {/* Datos Bancarios */}
          <InfoCard title="🏦 Datos Bancarios">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Banco"
                name="banco"
                value={datosBancarios.banco}
                onChange={(e) => handleInputChange(e, setDatosBancarios)}
                placeholder="Ej: Banco del País"
              />
              <InputField
                label="Tipo de Cuenta"
                name="tipoCuenta"
                value={datosBancarios.tipoCuenta}
                onChange={(e) => handleInputChange(e, setDatosBancarios)}
                placeholder="Ej: Corriente"
              />
              <InputField
                label="Número de Cuenta"
                name="numeroCuenta"
                value={datosBancarios.numeroCuenta}
                onChange={(e) => handleInputChange(e, setDatosBancarios)}
                placeholder="Ej: 1234567890"
              />
              <InputField
                label="Titular"
                name="titular"
                value={datosBancarios.titular}
                onChange={(e) => handleInputChange(e, setDatosBancarios)}
                placeholder="Ej: Tu Empresa S.A."
              />
            </div>
          </InfoCard>

          {/* Horario de Atención */}
          <InfoCard title="🕒 Horario de Atención">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(horarioAtencion).map((dia) => (
                <InputField
                  key={dia}
                  label={dia.charAt(0).toUpperCase() + dia.slice(1)}
                  name={dia}
                  value={horarioAtencion[dia]}
                  onChange={(e) => handleInputChange(e, setHorarioAtencion)}
                  placeholder="Ej: 08:00 - 18:00"
                />
              ))}
            </div>
          </InfoCard>

          {/* Configuración */}
          <InfoCard title="⚙️ Configuración">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="IVA (%)"
                name="iva"
                type="number"
                value={configuracion.iva}
                onChange={(e) => handleInputChange(e, setConfiguracion)}
                placeholder="15"
              />
              <InputField
                label="Moneda"
                name="moneda"
                value={configuracion.moneda}
                onChange={(e) => handleInputChange(e, setConfiguracion)}
                placeholder="USD"
              />
              <InputField
                label="Símbolo de Moneda"
                name="simboloMoneda"
                value={configuracion.simboloMoneda}
                onChange={(e) => handleInputChange(e, setConfiguracion)}
                placeholder="$"
              />
            </div>
          </InfoCard>

          {/* Botón de Guardar */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={cargarEmpresa}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {guardando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
      <FooterAdmin />
    </div>
  );
}
