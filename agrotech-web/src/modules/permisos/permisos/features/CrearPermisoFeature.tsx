import Section from "../ui/Section";
import PermisoForm from "../widgets/PermisoForm";
import { useCreatePermiso } from "../hooks";

export default function CrearPermisoFeature() {
  const { mutate, isPending } = useCreatePermiso();
  return (
    <Section title="Crear permiso">
      <PermisoForm onSubmit={(payload) => mutate(payload)} isSubmitting={isPending} />
    </Section>
  );
}
