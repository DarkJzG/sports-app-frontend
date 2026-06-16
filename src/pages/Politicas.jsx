// src/pages/Politicas.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Politicas = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Políticas de Privacidad
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              En Johan Sports protegemos tu información personal y la utilizamos
              únicamente para brindarte una mejor experiencia en la
              comercialización de ropa deportiva.
            </p>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-10 text-gray-700">
            {/* 1. Información recopilada */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                1. Información que recopilamos
              </h2>
              <p className="mb-2">
                Recopilamos los datos que tú nos proporcionas al registrarte,
                realizar un pedido o contactar con nosotros, tales como:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nombre y apellidos.</li>
                <li>Correo electrónico y número de teléfono.</li>
                <li>
                  Dirección de envío y datos necesarios para la facturación.
                </li>
                <li>
                  Preferencias de diseño, historial de pedidos y configuraciones
                  de tu cuenta.
                </li>
              </ul>
            </div>

            {/* 2. Uso de la información */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2. Cómo usamos tu información
              </h2>
              <p className="mb-2">
                Utilizamos tus datos personales exclusivamente para fines
                relacionados con nuestros servicios:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Procesar pedidos y gestionar envíos.</li>
                <li>
                  Generar diseños personalizados con nuestras herramientas de IA
                  y modelo 3D.
                </li>
                <li>
                  Enviarte notificaciones sobre el estado de tu cuenta o de tus
                  compras.
                </li>
                <li>
                  Mejorar la experiencia de usuario dentro de la plataforma.
                </li>
              </ul>
            </div>

            {/* 3. Almacenamiento y seguridad */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                3. Almacenamiento y seguridad de datos
              </h2>
              <p className="mb-2">
                La información se almacena en sistemas protegidos y solo es
                accesible por el personal autorizado de Johan Sports para las
                actividades necesarias del negocio.
              </p>
              <p>
                No vendemos ni intercambiamos tus datos personales con terceros.
                Únicamente compartimos información con proveedores de servicios
                (como pasarelas de pago o logística) cuando es indispensable
                para completar tus pedidos.
              </p>
            </div>

            {/* 4. Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                4. Uso de cookies
              </h2>
              <p className="mb-2">
                Nuestro sitio puede utilizar cookies para recordar tus
                preferencias, mantener tu sesión iniciada y analizar el uso de
                la plataforma.
              </p>
              <p>
                Puedes desactivar las cookies desde la configuración de tu
                navegador, aunque esto podría limitar algunas funciones del
                sistema.
              </p>
            </div>

            {/* 5. Derechos del usuario */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                5. Tus derechos sobre los datos
              </h2>
              <p className="mb-2">
                Puedes solicitar en cualquier momento la actualización
                de tu información personal registrada
                en nuestra plataforma.
              </p>
              <p>
                Para ejercer estos derechos, puedes escribirnos al correo{" "}
                <span className="font-semibold">
                  confecciones.johan.sport@gmail.com
                </span>{" "}
                indicando tu solicitud y los datos que deseas gestionar.
              </p>
            </div>

            {/* 6. Actualizaciones */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                6. Actualizaciones de estas políticas
              </h2>
              <p>
                Podemos actualizar estas políticas de privacidad para reflejar
                mejoras en nuestros procesos o cambios legales. Siempre
                publicaremos la versión vigente dentro de la aplicación y
                señalaremos la fecha de última actualización.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Politicas;
