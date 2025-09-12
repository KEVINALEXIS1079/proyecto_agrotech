import { useOutletContext } from "react-router-dom";
import { Input, Switch, Button, Card } from "@heroui/react";
import { Droplet, Thermometer, FlaskConical, Cpu } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";

export default function IotConfig() {
  const { setTitle } = useOutletContext<LayoutContext>();
  setTitle("IoT");

  // Configuración de sensores
  const sensores = [
    {
      id: "humedad",
      nombre: "Sensor de humedad",
      icon: <Droplet className="h-10 w-10 text-gray-700" />,
    },
    {
      id: "temperatura",
      nombre: "Sensor de temperatura",
      icon: <Thermometer className="h-10 w-10 text-gray-700" />,
    },
    {
      id: "ph",
      nombre: "Sensor de pH",
      icon: <FlaskConical className="h-10 w-10 text-gray-700" />,
    },
    {
      id: "otro",
      nombre: "Otro sensor",
      icon: <Cpu className="h-10 w-10 text-gray-700" />,
    },
  ];

  return (
    <div
      className="
        bg-white p-6 rounded-lg shadow-sm border border-gray-200 
        overflow-y-auto h-[calc(100vh-10rem)]
      "
    >
      <Card className="p-6">
        {/* Título */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Parámetro de sensores
        </h2>
        <p className="text-gray-600 mb-8">
          Permite configurar los parámetros de alerta para cada sensor
          adaptándose a las necesidades de cada cultivo
        </p>

        {/* Sensores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {sensores.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-start gap-4 bg-gray-10 border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Icono */}
              <div>{sensor.icon}</div>

              {/* Nombre y parámetros */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-3">
                  {sensor.nombre}
                </h3>

                <div className="flex items-center gap-6">
                  {/* Inputs */}
                  <div className="flex flex-col gap-2 w-40">
                    <Input
                      placeholder="Parámetro máximo"
                      variant="bordered"
                      size="sm"
                    />
                    <Input
                      placeholder="Parámetro mínimo"
                      variant="bordered"
                      size="sm"
                    />
                  </div>

                  {/* Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">Activar alerta</span>
                    <Switch defaultSelected color="success" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-center mt-12">
          <Button className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition">
            Guardar configuraciones
          </Button>
        </div>
      </Card>
    </div>
  );
}
