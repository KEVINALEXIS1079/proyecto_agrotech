import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TipoSensorTable } from "../ui/TipoSensorTable";
import { TipoSensorModalForm } from "../ui/TipoSensorModalForm";
import type { TipoSensor } from "../model/types";
import { EyeIcon, EyeSlashIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { tipoSensorService } from "../api/tipoSensor.service";
import { TIPO_SENSOR_QUERY_KEY } from "../hooks/useTipoSensorList";

export const TipoSensorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<TipoSensor | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const handleChanges = () => {
      console.log("WebSocket: Cambios detectados en tipos de sensor, actualizando UI...");
      queryClient.invalidateQueries({ queryKey: [TIPO_SENSOR_QUERY_KEY] });
    };

    tipoSensorService.on("tipo-sensor:changes-detected", handleChanges);

    return () => {
      console.log("Desconectando listener de WebSocket para tipos de sensor.");
      tipoSensorService.off("tipo-sensor:changes-detected");
    };
  }, [queryClient]);

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

  const handleNavigateToIot = () => {
    navigate("/iot");
  };

  return (
    <div className="bg-white-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showDeleted ? "Sensores Eliminados" : "Gestión de Tipos de Sensor"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {showDeleted
                ? "Aquí puedes restaurar los sensores eliminados."
                : "Crea, edita y elimina los tipos de sensores."}
            </p>
          </div>

          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors"
          >
            {showDeleted ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
            {showDeleted ? "Ver Activos" : "Ver Eliminados"}
          </button>
        </div>

        {/* Botones principales */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Botón para ir a Sensores */}
            <button
              onClick={handleNavigateToIot}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-gray-700 transition-colors"
            >
              <CpuChipIcon className="h-5 w-5" />
              Ir a Sensores
            </button>

            {/* Botón para añadir nuevo */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 transition-colors"
            >
              Añadir Nuevo
            </button>
          </div>
        </div>

        {/* Tabla de tipos de sensor */}
        <TipoSensorTable
          onEdit={handleEdit}
          onAdd={handleAdd}
          showDeleted={showDeleted}
        />

        {/* Modal */}
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