import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Select, SelectItem, Button, Card } from "@heroui/react";
import { Cpu } from "lucide-react";
import { getiotById } from "../api";
import { updateSensor, type SensorPayload } from "../api/update";
import type { Sensor } from "../model/types";
import type { TipoSensor } from "../../TipoSensor/model/types";
import { getTiposSensor } from "../../TipoSensor/api/list";
import type { Cultivo } from "../../../cultivo/cultivo/model/types";
import { getCultivos } from "../../../cultivo/cultivo/api/list";

export default function EditarPageIot() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- Estados del sensor ---
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [nombre, setNombre] = useState("");
  const [valorMinimo, setValorMinimo] = useState<number | null>(null);
  const [valorMaximo, setValorMaximo] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState<number | null>(null);
  const [cultivo, setCultivo] = useState<number | null>(null);

  // --- Lista de opciones ---
  const [tiposSensor, setTiposSensor] = useState<TipoSensor[]>([]);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Cargar sensor y opciones dinámicas ---
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Cargar sensor
        const sensorData = await getiotById(Number(id));
        setSensor(sensorData);
        setNombre(sensorData.nombre_sensor);
        setValorMinimo(sensorData.valor_minimo ?? null);
        setValorMaximo(sensorData.valor_maximo ?? null);
        setFechaInicio(sensorData.fecha_inicio_sensor || "");
        setFechaFin(sensorData.fecha_fin_sensor || "");
        setTipo(sensorData.tipo_sensor?.id_tipo_sensor_pk ?? null);
        setCultivo(sensorData.cultivo?.id_cultivo_pk ?? null);

        // Cargar tipos de sensor dinámicamente
        const tiposData = await getTiposSensor();
        setTiposSensor(tiposData);

        // Cargar cultivos dinámicamente
        const cultivosData = await getCultivos();
        setCultivos(cultivosData);
      } catch (err) {
        console.error("Error cargando sensor, tipos de sensor o cultivos:", err);
      }
    };
    fetchData();
  }, [id]);

  // --- Submit del formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    try {
      const payload: SensorPayload = {
        nombre_sensor: nombre,
        valor_minimo: valorMinimo ?? 0,
        valor_maximo: valorMaximo ?? 0,
        fecha_inicio_sensor: fechaInicio,
        fecha_fin_sensor: fechaFin,
        id_cultivo_fk: cultivo ?? 0,
        id_tipo_sensor_fk: tipo ?? 0,
      };

      await updateSensor(Number(id), payload);
      alert("✅ Sensor actualizado con éxito");
      navigate("/iot");
    } catch (err: any) {
      console.error("Error al actualizar sensor:", err);
      alert("❌ Error: " + (err.response?.data?.message || "No se pudo actualizar"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!sensor) return <p>Cargando...</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar">
      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <Cpu className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Sensor</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Nombre del sensor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            isRequired
          />

          <Input
            label="Valor mínimo"
            type="number"
            value={valorMinimo !== null ? String(valorMinimo) : ""}
            onChange={(e) => setValorMinimo(e.target.value ? Number(e.target.value) : null)}
            isRequired
          />

          <Input
            label="Valor máximo"
            type="number"
            value={valorMaximo !== null ? String(valorMaximo) : ""}
            onChange={(e) => setValorMaximo(e.target.value ? Number(e.target.value) : null)}
            isRequired
          />

          <Input
            label="Fecha inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            isRequired
          />

          <Input
            label="Fecha fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />

          <Select
            label="Cultivo"
            selectedKeys={cultivo !== null ? [String(cultivo)] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setCultivo(selectedKey ? Number(selectedKey) : null);
            }}
            isRequired
          >
            {cultivos.map((c) => (
              <SelectItem key={String(c.id_cultivo_pk)}>
                {c.nombre_cultivo}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tipo de sensor"
            selectedKeys={tipo !== null ? [String(tipo)] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setTipo(selectedKey ? Number(selectedKey) : null);
            }}
            isRequired
          >
            {tiposSensor.map((t) => (
              <SelectItem key={String(t.id_tipo_sensor_pk)}>
                {t.nombre_tipo_sensor}
              </SelectItem>
            ))}
          </Select>

          <div className="sm:col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-medium shadow-sm transition"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
