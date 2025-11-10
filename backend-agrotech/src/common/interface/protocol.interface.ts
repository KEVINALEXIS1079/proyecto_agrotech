export interface IProtocolService {
  registerSensor(id_sensor_pk: number): Promise<void>;
  connectSensor(id_sensor_pk: number): Promise<void>;
  disconnectSensor(id_sensor_pk: number): Promise<void>;
  publishData(id_sensor_pk: number, data: any): Promise<void>;
}
