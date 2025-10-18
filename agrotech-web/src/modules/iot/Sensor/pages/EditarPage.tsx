import { useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useSensorById } from "../hooks";
import { SensorForm } from "../ui";
import type { LayoutContext } from "@/app/layout/ProtectedLayout";
import { Spinner } from "@heroui/react";

export default function EditarPageIot() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { sensor, loading, error } = useSensorById(Number(id));

  useEffect(() => setTitle("Editar Sensor"), [setTitle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner label="Cargando datos del sensor..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto pr-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <SensorForm
          sensorToEdit={sensor}
          onSuccess={() => setTimeout(() => navigate("/iot"), 1200)}
        />
      </div>
    </div>
  );
}