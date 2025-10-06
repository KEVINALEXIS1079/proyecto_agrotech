export type TipoSensor = {
  id_tipo_sensor_pk: number;
  nombre_tipo_sensor: string;
  deletedAt?: string | null;
};

export type TipoSensorPayload = {
  nombre_tipo_sensor: string;
};
