import { useState, useEffect } from "react";
import { Button, Card } from "@heroui/react";
import { toast } from "react-hot-toast";
import { SensorHeader } from "./SensorHeader";
import { SensorFields } from "./SensorFields";
import { sensorService } from "../api/sensor.service";
import { getCultivos } from "../../../cultivo/cultivo/api";
import { tipoSensorService } from "../../TipoSensor/api/tipoSensor.service";
import type { Cultivo } from "../../../cultivo/cultivo/model/types";
import type { TipoSensor } from "../../TipoSensor/model/types";

interface Props {
  onSuccess?: () => void;
}

export function SensorForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    valorMinimo: "",
    valorMaximo: "",
    fechaInicio: "",
    fechaFin: "",
    idCultivo: "",
    idTipoSensor: "",
  });

  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [tiposSensor, setTiposSensor] = useState<TipoSensor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  (async () => {
    try {
      const [cultivosData, tiposData] = await Promise.all([
        getCultivos(),
        tipoSensorService.list(),
      ]);
      setCultivos(cultivosData);
      setTiposSensor(tiposData);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error cargando datos iniciales");
    }
  })();
}, []);


  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast.promise(
      (async () => {
        await sensorService.create({
          nombre_sensor: form.nombre.trim(),
          valor_minimo: Number(form.valorMinimo),
          valor_maximo: Number(form.valorMaximo),
          fecha_inicio_sensor: form.fechaInicio,
          fecha_fin_sensor: form.fechaFin,
          id_cultivo_fk: Number(form.idCultivo),
          id_tipo_sensor_fk: Number(form.idTipoSensor),
        });

        // Reset form
        setForm({
          nombre: "",
          valorMinimo: "",
          valorMaximo: "",
          fechaInicio: "",
          fechaFin: "",
          idCultivo: "",
          idTipoSensor: "",
        });

        onSuccess?.();
      })(),
      {
        loading: "Guardando sensor...",
        success: "✅ Sensor creado correctamente",
        error: "❌ Error al crear el sensor",
      }
    ).finally(() => setIsLoading(false));
  };

  return (
    <Card className="p-8 shadow-sm border border-gray-200">
      <SensorHeader title="Registrar IoT" />
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <SensorFields
          {...form}
          cultivos={cultivos}
          tiposSensor={tiposSensor}
          onChange={handleChange}
        />
        <div className="sm:col-span-2 flex justify-center mt-6">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-medium shadow-sm transition"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
