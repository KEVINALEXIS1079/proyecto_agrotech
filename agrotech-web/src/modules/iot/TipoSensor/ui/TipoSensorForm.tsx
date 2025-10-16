// src/modules/iot/TipoSensor/ui/TipoSensorForm.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateTipoSensor } from "../hooks/useCreateTipoSensor";
import { useUpdateTipoSensor } from "../hooks/useUpdateTipoSensor";
import type { TipoSensor } from "../model/types";

interface Props {
  tipoSensor: TipoSensor | null;
  onSuccess: () => void;
  onCancel: () => void; // Añadimos prop para cancelar
}

export const TipoSensorForm: React.FC<Props> = ({ tipoSensor, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState("");

  // MEJORA: Sincronizar el estado del formulario cuando cambia el prop `tipoSensor`
  useEffect(() => {
    setNombre(tipoSensor?.nombre || "");
  }, [tipoSensor]);
  
  const { create, loading: creating } = useCreateTipoSensor();
  const { update, loading: updating } = useUpdateTipoSensor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.warn("El nombre no puede estar vacío.");
      return;
    }
    
    const payload = { nombre };

    try {
      if (tipoSensor) {
        await update({ id: tipoSensor.id_tipo_sensor, data: payload });
        toast.success("Tipo de sensor actualizado correctamente");
      } else {
        await create(payload);
        toast.success("Tipo de sensor creado correctamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el tipo de sensor");
    }
  };
  
  const isLoading = creating || updating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        {/* MEJORA: Label asociado con el input para accesibilidad */}
        <label htmlFor="nombre-sensor" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Tipo de Sensor
        </label>
        <input
          id="nombre-sensor"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          // MEJORA: Estilos modernos para el input con foco visible
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          placeholder="Ej: Temperatura, Humedad, pH..."
          required
        />
      </div>

      {/* MEJORA: Contenedor para los botones de acción */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : (tipoSensor ? "Actualizar" : "Guardar")}
        </button>
      </div>
    </form>
  );
};