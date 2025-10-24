export type TipoSensor = {
id_tipo_sensor_pk: number;
nombre_tipo_sensor: string;
unidades_tipo_sensor?: string | null;
decimales_tipo_sensor?: number | null;
imagen_tipo_sensor?: string | null; // puede venir relativa o absoluta
delete_at?: string | null; // cuando viene conDeleted
};


export type CreateTipoSensorInput = {
nombre_tipo_sensor: string;
unidades_tipo_sensor?: string;
decimales_tipo_sensor?: number;
imagen_tipo_sensor?: File | string | null; // en front usamos File para upload
};


export type UpdateTipoSensorInput = Partial<CreateTipoSensorInput>;