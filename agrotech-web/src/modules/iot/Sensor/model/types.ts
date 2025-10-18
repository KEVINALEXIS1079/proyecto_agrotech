export interface Sensor {
  id_sensor_pk: number;
  nombre_sensor: string;
  valor_minimo: number;
  valor_maximo: number;
  fecha_inicio_sensor: string;
  fecha_fin_sensor: string;
  imagen_sensor: string | null;
  activo: boolean;
  cultivo: {
    id_cultivo_pk: number;
    nombre_cultivo: string;
    descripcion_cultivo: string;
    img_cultivo: string;
    estado_cultivo: string;
    fecha_inicio_cultivo: string;
    fecha_fin_cultivo: string;
    delete_at: string | null;
  };
  tipo_sensor: {
    id_tipo_sensor_pk: number;
    nombre_tipo_sensor: string;
    delete_at: string | null;
  };
  delete_at: string | null;
}

export type SensorDTO = {
  nombre_sensor: string;
  valor_minimo: number;
  valor_maximo: number;
  fecha_inicio_sensor: string;
  fecha_fin_sensor: string;
  id_cultivo_fk: number;
  id_tipo_sensor_fk: number;
  imagen_sensor?: string;
  activo?: boolean;
};

