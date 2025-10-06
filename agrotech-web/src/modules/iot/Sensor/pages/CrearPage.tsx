import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Input, Select, SelectItem, Button, Card } from "@heroui/react";
import { Cpu } from "lucide-react";
import type { LayoutContext } from "@/app/layout/ProtectedLayout";
import { createiot } from "../api/index";
import { getCultivos } from "../../../cultivo/cultivo/api";
import { getTiposSensor } from "../../TipoSensor/api";
import type { Cultivo } from "../../../cultivo/cultivo/model/types";
import type { TipoSensor } from "../../TipoSensor/model/types";

export default function CrearPageIot() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  // --- Estados ---
  const [nombre, setNombre] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [idCultivo, setIdCultivo] = useState("");
  const [idTipoSensor, setIdTipoSensor] = useState("");
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [tiposSensor, setTiposSensor] = useState<TipoSensor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    setTitle("Registrar IoT");

    // Cargar cultivos y tipos de sensor
    (async () => {
      try {
        const cultivosData = await getCultivos();
        setCultivos(cultivosData);

        const tiposSensorData = await getTiposSensor();
        setTiposSensor(tiposSensorData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    })();
  }, [setTitle]);

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (
      !nombre.trim() ||
      !valorMinimo ||
      !valorMaximo ||
      !fechaInicio ||
      !fechaFin ||
      !idCultivo ||
      !idTipoSensor
    ) {
      setMensaje("❌ Completa todos los campos.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nombre_sensor: nombre.trim(),
        valor_minimo: Number(valorMinimo),
        valor_maximo: Number(valorMaximo),
        fecha_inicio_sensor: fechaInicio,
        fecha_fin_sensor: fechaFin,
        id_cultivo_fk: Number(idCultivo),
        id_tipo_sensor_fk: Number(idTipoSensor),
      };

      await createiot(payload);

      setMensaje("✅ Sensor IoT creado correctamente.");
      setTimeout(() => navigate("/iot"), 1200);

      setNombre("");
      setValorMinimo("");
      setValorMaximo("");
      setFechaInicio("");
      setFechaFin("");
      setIdCultivo("");
      setIdTipoSensor("");
    } catch (err: any) {
      console.error("Error creando sensor:", err);
      const backendMsg =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "No se pudo crear el sensor.";
      setMensaje("❌ " + String(backendMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background-color: #f3f4f6; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #22c55e; border-radius: 9999px; }
  `;

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar">
      <style>{scrollbarStyles}</style>

      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <Cpu className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Registrar IoT</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Input
            label="Nombre del sensor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            isRequired
          />

          <Input
            label="Valor mínimo"
            type="number"
            value={valorMinimo}
            onChange={(e) => setValorMinimo(e.target.value)}
            isRequired
          />

          <Input
            label="Valor máximo"
            type="number"
            value={valorMaximo}
            onChange={(e) => setValorMaximo(e.target.value)}
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
            isRequired
          />

          <Select
            label="Cultivo"
            value={idCultivo}
            onChange={(e) => setIdCultivo(e.target.value)}
            isRequired
          >
            {cultivos.map((c) => (
              <SelectItem key={c.id_cultivo_pk}>{c.nombre_cultivo}</SelectItem>
            ))}
          </Select>

          <Select
            label="Tipo de Sensor"
            value={idTipoSensor}
            onChange={(e) => setIdTipoSensor(e.target.value)}
            isRequired
          >
            {tiposSensor.map((t) => (
              <SelectItem key={t.id_tipo_sensor_pk}>
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
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>

        {mensaje && (
          <Card
            className={`mt-6 border ${
              mensaje.startsWith("✅")
                ? "border-green-400 bg-green-50"
                : "border-red-400 bg-red-50"
            }`}
          >
            <div className="p-3 text-center">
              <p
                className={`text-center font-medium ${
                  mensaje.startsWith("✅") ? "text-green-700" : "text-red-700"
                }`}
              >
                {mensaje}
              </p>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}
