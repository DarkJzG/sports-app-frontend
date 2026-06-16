// src/pages/TerminosC.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TerminosC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Al utilizar la plataforma de Johan Sports aceptas las condiciones
              descritas en esta página para el uso del sistema y la compra de
              prendas deportivas personalizadas.
            </p>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-10 text-gray-700">
            {/* 1. Uso de la plataforma */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                1. Uso de la plataforma
              </h2>
              <p className="mb-2">
                La aplicación está destinada a la personalización y
                comercialización de ropa deportiva para uso personal o de tu
                organización. Te comprometes a utilizarla de manera responsable
                y a no realizar actividades que afecten la seguridad o el
                funcionamiento del sistema.
              </p>
              <p>
                Es responsabilidad del usuario mantener la confidencialidad de
                sus credenciales de acceso y notificar a Johan Sports ante
                cualquier uso no autorizado de su cuenta.
              </p>
            </div>

            {/* 2. Registro y cuenta */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                2. Registro y verificación de cuenta
              </h2>
              <p className="mb-2">
                Para acceder a ciertas funcionalidades (como historial de
                pedidos o diseños guardados) es necesario crear una cuenta y
                verificar el correo electrónico de registro.
              </p>
              <p>
                La información que proporciones deberá ser real, actual y
                completa. Johan Sports se reserva el derecho de suspender cuentas
                que presenten uso fraudulento o incumplan estos términos.
              </p>
            </div>

            {/* 3. Pedidos y personalización */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                3. Pedidos y diseños personalizados
              </h2>
              <p className="mb-2">
                Antes de producir una prenda, el sistema genera una vista previa
                del diseño. Al confirmar tu pedido, aceptas que esta vista previa
                representa de forma aproximada el resultado final, considerando
                posibles variaciones mínimas de color o posición.
              </p>
              <p>
                El tiempo de producción puede variar según la complejidad del
                diseño y la cantidad de prendas. Estas fechas estimadas se
                mostrarán durante el proceso de compra.
              </p>
            </div>

            {/* 4. Precios y pagos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                4. Precios y formas de pago
              </h2>
              <p className="mb-2">
                Los precios mostrados en la aplicación pueden variar según el
                tipo de prenda, materiales seleccionados y cantidad solicitada.
                Cualquier cambio de precio se mostrará antes de confirmar el
                pedido.
              </p>
              <p>
                Actualmente los pagos se realizan mediante transferencia
                bancaria a la cuenta indicada por Johan Sports. La confirmación
                del pedido se efectúa una vez verificado el pago correspondiente.
              </p>
            </div>

            {/* 5. Envíos y entregas */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                5. Envíos y entregas
              </h2>
              <p className="mb-2">
                Realizamos envíos dentro del territorio nacional a la dirección
                proporcionada por el cliente. Es importante que revises que los
                datos de entrega sean correctos para evitar retrasos.
              </p>
              <p>
                Los tiempos de entrega son estimados y pueden verse afectados por
                factores externos como disponibilidad de transporte o
                condiciones climáticas.
              </p>
            </div>

            {/* 6. Cambios y reclamos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                6. Cambios, devoluciones y reclamos
              </h2>
              <p className="mb-2">
                Debido a la naturaleza personalizada de las prendas, los cambios
                y devoluciones se gestionan caso por caso, principalmente cuando
                exista un defecto de fabricación o un error en la producción
                respecto al diseño aprobado.
              </p>
              <p>
                Si detectas algún problema con tu pedido, debes contactarnos en
                un plazo razonable a través del correo{" "}
                <span className="font-semibold">
                  confecciones.johan.sport@gmail.com
                </span>{" "}
                adjuntando la información y evidencias necesarias.
              </p>
            </div>

            {/* 7. Propiedad de los diseños */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                7. Propiedad de los diseños y contenido
              </h2>
              <p className="mb-2">
                Los elementos gráficos, plantillas, modelos 3D y herramientas de
                IA utilizados dentro de la plataforma son propiedad de Johan
                Sports o de sus proveedores tecnológicos.
              </p>
              <p>
                Los diseños personalizados creados por el usuario pueden ser
                utilizados por Johan Sports únicamente para la producción de las
                prendas solicitadas y, con tu autorización, como muestra o
                referencia en catálogos y materiales promocionales.
              </p>
            </div>

            {/* 8. Modificaciones de los términos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                8. Modificaciones de estos términos
              </h2>
              <p className="mb-2">
                Johan Sports puede actualizar estos términos y condiciones para
                adaptarlos a cambios legales, operativos o tecnológicos.
              </p>
              <p>
                La versión vigente estará siempre disponible en la aplicación. El
                uso continuado de la plataforma después de una actualización
                implica la aceptación de las nuevas condiciones.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TerminosC;
