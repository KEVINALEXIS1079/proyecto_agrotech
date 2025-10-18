import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import type { LayoutContext } from "@/app/layout/ProtectedLayout";
import { SensorForm } from "../ui";

export default function CrearPageIot() {
  const { setTitle } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  useEffect(() => setTitle("Registrar Sensor"), [setTitle]);

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto pr-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <SensorForm onSuccess={() => setTimeout(() => navigate("/iot"), 1200)} />
      </div>
    </div>
  );
}
