import Section from "../ui/Section";
import AssignCard from "../widgets/AssignCard";
import { useAssignPermisosToUser, useListPermisosAll } from "../hooks";

export default function AsignarPermisosUsuarioFeature() {
  const { data: permisos } = useListPermisosAll();
  const { mutate, isPending } = useAssignPermisosToUser();

  return (
    <Section title="Asignar permisos a usuario">
      <AssignCard
        title="Selecciona usuario, rol y permisos"
        submitText="Asignar al usuario"
        isLoading={isPending}
        permisos={Array.isArray(permisos) ? permisos : []}
        onSubmit={({ roleId, userId, permisoIds }) => {
          mutate({ roleId, userId, permisoIds });
        }}
      />
    </Section>
  );
}
