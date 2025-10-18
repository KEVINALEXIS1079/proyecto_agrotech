import { Input, Select, SelectItem } from "@heroui/react";
import type { Cultivo } from "../../../cultivo/cultivo/model/types";
import type { TipoSensor } from "../../TipoSensor/model/types";

interface SensorFieldsProps {
  nombre: string;
  valorMinimo: string;
  valorMaximo: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoSensor: string;
  cultivos: Cultivo[];
  tiposSensor: TipoSensor[];
  onChange: (field: string, value: string) => void;
}

export function SensorFields({
  nombre,
  valorMinimo,
  valorMaximo,
  fechaInicio,
  fechaFin,
  idCultivo,
  idTipoSensor,
  cultivos,
  tiposSensor,
  onChange,
}: SensorFieldsProps) {
  return (
    <>
      <Input label="Nombre del sensor" value={nombre} onChange={(e) => onChange("nombre", e.target.value)} isRequired />
      <Input label="Valor mínimo" type="number" value={valorMinimo} onChange={(e) => onChange("valorMinimo", e.target.value)} isRequired />
      <Input label="Valor máximo" type="number" value={valorMaximo} onChange={(e) => onChange("valorMaximo", e.target.value)} isRequired />
      <Input label="Fecha inicio" type="date" value={fechaInicio} onChange={(e) => onChange("fechaInicio", e.target.value)} isRequired />
      <Input label="Fecha fin" type="date" value={fechaFin} onChange={(e) => onChange("fechaFin", e.target.value)} isRequired />

      <Select label="Cultivo" value={idCultivo} onChange={(e) => onChange("idCultivo", e.target.value)} isRequired>
        {cultivos.map((c) => (
          <SelectItem key={c.id_cultivo_pk}>{c.nombre_cultivo}</SelectItem>
        ))}
      </Select>

      <Select label="Tipo de Sensor" value={idTipoSensor} onChange={(e) => onChange("idTipoSensor", e.target.value)} isRequired>
        {tiposSensor.map((t) => (
          <SelectItem key={t.id_tipo_sensor}>{t.nombre}</SelectItem>
        ))}
      </Select>
    </>
  );
}
