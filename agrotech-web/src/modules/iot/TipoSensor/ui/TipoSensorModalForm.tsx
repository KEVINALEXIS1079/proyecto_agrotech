import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { TipoSensorForm } from "./TipoSensorForm";
import type { TipoSensor } from "../model/types";

interface Props {
  open: boolean;
  onClose: () => void;
  tipoSensor: TipoSensor | null;
}

export const TipoSensorModalForm: React.FC<Props> = ({ open, onClose, tipoSensor }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        open ? "bg-black/60 opacity-100" : "bg-transparent opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* MEJORA: Cabecera del modal con título y botón de cierre */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {tipoSensor ? "Editar Tipo de Sensor" : "Nuevo Tipo de Sensor"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* MEJORA: Padding para el contenido del formulario */}
        <div className="p-6">
            <TipoSensorForm tipoSensor={tipoSensor} onSuccess={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};