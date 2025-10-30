// src/components/PedidoUtils.jsx
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importar localización en español

// ==========================================
// Componente para Tarjetas de Información
// ==========================================
export const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
        {/* Título opcional con borde inferior */}
        {title && (
             <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">{title}</h3>
        )}
        {/* Contenido de la tarjeta */}
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

// ==========================================
// Componente para Etiquetas de Estado (Badges)
// ==========================================
// Mapeo de claves de estado a clases de Tailwind CSS para estilo
const estilosEstado = {
    pendiente_pago: "bg-yellow-100 text-yellow-800",
    pagado_parcial: "bg-blue-100 text-blue-800",
    pagado_total: "bg-green-100 text-green-800",
    en_produccion: "bg-indigo-100 text-indigo-800",
    listo: "bg-purple-100 text-purple-800",
    enviado: "bg-cyan-100 text-cyan-800", // Puede representar "Enviado" o "Listo para Retiro"
    entregado: "bg-emerald-100 text-emerald-800", // Usar un verde diferente para Entregado
    cancelado: "bg-red-100 text-red-800",
    fallido: "bg-rose-100 text-rose-800" // Añadido estado 'fallido' si existe
};

// Mapeo de claves de estado a etiquetas legibles en español
const etiquetasEstado = {
    pendiente_pago: "Pendiente de Pago",
    pagado_parcial: "Pago Parcial",
    pagado_total: "Pagado Total",
    en_produccion: "En Producción",
    listo: "Listo para Envío/Retiro",
    enviado: "Enviado / Listo Retiro", // Etiqueta combinada
    entregado: "Entregado",
    cancelado: "Cancelado",
    fallido: "Fallido"
};

export const StatusBadge = ({ status }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${estilosEstado[status] || 'bg-gray-100 text-gray-800'}`}>
            {etiquetasEstado[status] || status.replace('_', ' ').toUpperCase()} {/* Muestra etiqueta o formatea la clave */}
        </span>
    );
};
// Adjuntar las etiquetas como propiedad estática para poder usarlas fuera (ej. en TimelineItem)
StatusBadge.etiquetasEstado = etiquetasEstado;


// ==========================================
// Función Segura para Formatear Fechas
// ==========================================
export const formatDateSafe = (dateString, formatString = "PPpp") => { // 'PPpp' -> '10 oct 2025, 16:30:00'
    try {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        // Verificar si la fecha es inválida
        if (isNaN(date.getTime())) {
            console.warn("Fecha inválida recibida:", dateString);
            return 'Fecha inválida';
        }
        // Formatear usando date-fns con localización en español
        return format(date, formatString, { locale: es });
    } catch (error) {
        console.error('Error al formatear fecha:', dateString, error);
        return 'Error en fecha';
    }
};

// ==========================================
// Componente para Item de Línea de Tiempo
// ==========================================
export const TimelineItem = ({ statusKey, date, event, isLast }) => {
    // Verificar si la fecha es válida
    const isValidDate = date && !isNaN(new Date(date).getTime());
    // Obtener la etiqueta legible del estado usando el mapa
    const statusLabel = StatusBadge.etiquetasEstado[statusKey] || statusKey.replace('_', ' ').toUpperCase();

    return (
        <li className="relative pb-6"> {/* Cambiado a <li> para semántica */}
            {/* Línea vertical (excepto en el último) */}
            {!isLast && (
                <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
            )}
            <div className="relative flex items-start space-x-3">
                 {/* Círculo indicador */}
                 <div className="relative">
                     <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-white">
                          {/* Punto interior */}
                          <span className="h-2.5 w-2.5 bg-blue-600 rounded-full"></span>
                     </span>
                 </div>
                 {/* Contenido del evento */}
                <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex justify-between items-center text-sm">
                         {/* Etiqueta del estado */}
                         <span className="font-medium text-gray-900">
                            {statusLabel}
                         </span>
                         {/* Fecha del evento */}
                         <span className="whitespace-nowrap text-gray-500">
                             {isValidDate ? formatDateSafe(date, 'P p') : 'Fecha no disponible'} {/* Formato más corto: 10/10/2025, 4:30 PM */}
                         </span>
                    </div>
                     {/* Descripción/Nota del evento (si existe) */}
                     {event && (
                        <p className="mt-1 text-sm text-gray-600">{event}</p>
                    )}
                </div>
            </div>
        </li>
    );
};