import { useState } from "react";
import { Input } from "@heroui/react";
import Section from "../ui/Section";
import AssignCard from "../widgets/AssignCard";
import { useAssignPermisosToRole, useListPermisosAll } from "../hooks";

export default function AsignarPermisosRolFeature() {
  // Para listar permisos a elegir, traemos todos (o podrías filtrar si luego agregas módulo)
  const { data: permisos } = useListPermisosAll();
  const { mutate, isPending } = useAssignPermisosToRole();
  const [hint, setHint] = useState<string>("");

  return (
    <Section title="Asignar permisos a rol">
      <div className="max-w-2xl mx-auto mb-4">
        <Input
          label="Tips"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          description="Opcional: solo texto para pruebas en UI"
        />
      </div>

      <AssignCard
        title="Selecciona rol, usuario auditor y permisos"
        submitText="Asignar al rol"
        isLoading={isPending}
        permisos={Array.isArray(permisos) ? permisos : []}
        onSubmit={({ roleId, userId, permisoIds }) => {
          // payload que tu back espera:
          // { permisoIds: number[], userId: number, roleId: number }
          mutate({ roleId, userId, permisoIds });
        }}
      />
    </Section>
  );
}
