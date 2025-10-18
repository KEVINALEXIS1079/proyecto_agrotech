import React from 'react';
import type { Sensor } from '../model/types';
import { SensorCard } from './SensorCard';

interface Props {
  sensors: Sensor[];
  onEdit: (sensor: Sensor) => void;
  onDelete: (sensor: Sensor) => void;
  onRestore: (sensor: Sensor) => void;
}

export const SensorList: React.FC<Props> = ({ sensors, onEdit, onDelete, onRestore }) => {
  if (sensors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron sensores.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sensors.map((sensor) => (
        <SensorCard
          key={sensor.id_sensor_pk}
          sensor={sensor}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
};