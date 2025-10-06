import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Input, Button, Card } from "@heroui/react";
import { Cpu } from "lucide-react";
import type { LayoutContext } from "@/app/layout/ProtectedLayout";
import type { TipoSensor } from "../model/types";
import { updateTipoSensor } from "../api/update";
import api from "@/shared/api/client";

export default function EditarPageTipoSensor() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string>("");

  // Cargar datos del tipo de sensor
  useEffect(() => {
    setTitle("Editar Tipo de Sensor");

    if (!id) return;

    api
      .get(`/tipo-sensor/${id}`)
      .then((res) => {
        const data: TipoSensor = res.data;
        setNombre(data.nombre_tipo_sensor);
      })
      .catch((err) => {
        console.error("Error cargando tipo de sensor:", err);
        setMensaje("❌ No se pudo cargar el tipo de sensor.");
      });
  }, [id, setTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim()) {
      setMensaje("❌ Completa el nombre del tipo de sensor.");
      return;
    }

    setIsLoading(true);
    try {
      await updateTipoSensor(Number(id), { nombre_tipo_sensor: nombre.trim() });
      setMensaje("✅ Tipo de sensor actualizado correctamente.");
      setTimeout(() => navigate("/tipo-sensor"), 1200);
    } catch (err: any) {
      console.error("Error actualizando tipo de sensor:", err);
      const backendMsg =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "No se pudo actualizar el tipo de sensor.";
      setMensaje("❌ " + String(backendMsg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 h-[calc(100vh-10rem)] overflow-y-auto">
      <Card className="p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8">
          <Cpu className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Tipo de Sensor</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Nombre del tipo de sensor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            isRequired
          />

          <div className="sm:col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-medium shadow-sm transition"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Actualizar"}
            </Button>
          </div>
        </form>

        {mensaje && (
          <Card className={`mt-6 border ${mensaje.startsWith("✅") ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
            <div className="p-3 text-center">
              <p className={`text-center font-medium ${mensaje.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>
                {mensaje}
              </p>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}
