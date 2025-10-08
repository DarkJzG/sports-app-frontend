import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Acordeón accesible:
 * - Solo el header es clickable (button)
 * - El contenido vive fuera del button → no se cierra al interactuar
 * - Transición suave y scroll interno del contenido (como Canva)
 */
export default function PanelAcordeonRGB({
  id,
  title,
  isOpen,
  onToggle,
  children,
  // puedes ajustar la altura máxima del área scrolleable:
  contentMaxHeight = "max-h-[420px]",
  className = "",
}) {
  return (
    <section
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        className="w-auto flex items-center justify-between px-5 py-4 text-left
                   bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50
                   transition-colors"
      >
        <span className="text-base font-semibold text-blue-900">{title}</span>
        <ChevronDown
          className={`shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Contenido con transición y scroll interno */}
      <div
        id={`${id}-panel`}
        // truco de CSS Grid para animar altura sin medir contenido
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* Scroll interno tipo Canva */}
          <div
            className={`px-4 pb-4 ${contentMaxHeight} overflow-y-auto`}
            // Defensa extra por si el header ocupa más de lo debido
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
