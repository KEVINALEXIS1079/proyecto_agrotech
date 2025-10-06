import { useState } from "react";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import type { PermisoAccion } from "../model/types";

type Props = {
  onSubmit: (payload: {
    nombre_permiso: string;
    accion: PermisoAccion;
    moduleId: number;
    activo: boolean;
  }) => void;
  isSubmitting?: boolean;
};

export default function PermisoForm({ onSubmit, isSubmitting }: Props) {
  const [nombre, setNombre] = useState("");
  const [accion, setAccion] = useState<PermisoAccion>("create");
  const [moduleId, setModuleId] = useState<number>(1);
  const [activo, setActivo] = useState(true);

  const disabled =
    !nombre.trim() || !accion || !moduleId || Number.isNaN(moduleId) || moduleId <= 0;

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled) return;
        onSubmit({
          nombre_permiso: nombre.trim(),
          accion,
          moduleId: Number(moduleId),
          activo,
        });
      }}
    >
      <Input
        label="Nombre del permiso"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        isRequired
      />
      <Select
        label="Acción"
        selectedKeys={[accion]}
        onChange={(e) => setAccion(e.target.value as PermisoAccion)}
      >
        {["create", "read", "update", "delete"].map((a) => (
          <SelectItem key={a}>{a}</SelectItem>
        ))}
      </Select>
      <Input
        label="ID de módulo"
        type="number"
        value={String(moduleId)}
        onChange={(e) => setModuleId(Number(e.target.value))}
        isRequired
      />
      <div className="flex items-center">
        <Checkbox isSelected={activo} onValueChange={setActivo}>
          Activo
        </Checkbox>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="w-full h-10 rounded-medium bg-primary text-primary-foreground disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : "Crear permiso"}
        </button>
      </div>
    </form>
  );
}
