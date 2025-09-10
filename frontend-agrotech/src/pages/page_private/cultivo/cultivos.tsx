
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../../layouts/ProtectedLayout";

export default function Cultivos() {
  const { setTitle } = useOutletContext<LayoutContext>();
  useEffect(() => setTitle("Cultivos"), [setTitle]);

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold">Cultivos</h2>
      <p className="text-foreground-600">Aquí irá tu listado, filtros y acciones.</p>
    </section>
  );
}
