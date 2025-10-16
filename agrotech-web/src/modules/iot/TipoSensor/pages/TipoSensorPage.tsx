import React, { useState } from "react";
import { TipoSensorTable } from "../ui/TipoSensorTable";
import { TipoSensorModalForm } from "../ui/TipoSensorModalForm";
import type { TipoSensor } from "../model/types";

export const TipoSensorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<TipoSensor | null>(null);

  const handleAdd = () => {
    setSelectedSensor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tipo: TipoSensor) => {
    setSelectedSensor(tipo);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSensor(null), 300);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Tipos de Sensor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Crea, edita y elimina los tipos de sensores para tu sistema IoT.
            </p>
          </div>
          {/* El botón de añadir ahora está dentro de la tabla, 
              así que este de aquí puede ser opcional o eliminarse si prefieres.
              Lo dejaré por si quieres tenerlo, pero la tabla ya tiene su propio botón. */}
        </div>

        {/* CORRECCIÓN 1: Añadir la prop 'onAdd' requerida por la tabla */}
        <TipoSensorTable onEdit={handleEdit} onAdd={handleAdd} />

        <TipoSensorModalForm
          open={isModalOpen}
          tipoSensor={selectedSensor}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default TipoSensorPage;