import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Input, Button } from "@heroui/react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";
import { getSensores, deleteSensor } from "../../../services/iot";
import type { Sensor } from "../../../services/iot";

export default function Iot() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTitle("IoT");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getSensores();
      setSensores(data);
    } catch (err) {
      console.error("Error cargando sensores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este sensor?")) return;
    try {
      await deleteSensor(id);
      setSensores((prev) => prev.filter((s) => s.id_sensor_pk !== id));
    } catch (err) {
      console.error("Error eliminando sensor", err);
    }
  };

  const filtered = sensores.filter((s) =>
    s.nombre_sensor.toLowerCase().includes(filtro.toLowerCase())
  );

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background-color: #d1fae5;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #10b981;
      border-radius: 9999px;
    }
  `;

  return (
    <div
      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200
                 overflow-y-scroll h-[calc(100vh-10rem)] custom-scrollbar"
    >
      <style>{scrollbarStyles}</style>

      {/* Header con botón registrar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sensores IoT</h2>
        <Button
          color="success"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => navigate("/private/iot/registrar")}
        >
          Registrar Sensor
        </Button>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <Input
          placeholder="Filtrar sensores..."
          size="sm"
          className="max-w-xs"
          startContent={<Search className="h-4 w-4 text-default-500" />}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-gray-500">Cargando sensores...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No hay sensores registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Instalación</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Cultivo</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id_sensor_pk}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-800">{s.nombre_sensor}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.tipo_sensor?.nombre_tipo_sensor ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.fecha_inicio_sensor}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.cultivo
                      ? `${s.cultivo.id_cultivo_pk} - ${s.cultivo.descripcion_cultivo}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                        startContent={<Pencil className="h-4 w-4" />}
                        onPress={() => navigate(`/private/iot/editar/${s.id_sensor_pk}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        startContent={<Trash2 className="h-4 w-4" />}
                        onPress={() => handleDelete(s.id_sensor_pk)}
                      >
                        Borrar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
