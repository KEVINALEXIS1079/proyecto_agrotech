import {
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import Section from "../ui/Section";
import AsyncButton from "../ui/AsyncButton";
import PermisosChecklist from "../widgets/PermisosChecklist";
import EmptyState from "../ui/EmptyState";
import { useListPermisosAll, useRemovePermisosFromUser } from "../hooks";
import type { Permiso } from "../model/types";
import { useMemo, useState } from "react";

// Si ya tienes moduleNames.ts, puedes importar getModuleLabel si lo quieres mostrar
// import { getModuleLabel, MODULE_RANGE } from "../model/moduleNames";

export default function QuitarPermisosUsuarioFeature() {
  // Traer todos los permisos para seleccionarlos
  const { data, isLoading } = useListPermisosAll();
  const permisos: Permiso[] = Array.isArray(data) ? data : [];

  // Filtro por módulo (0 = Todos)
  const moduleOptions = useMemo(
    () => [
      { id: "0", label: "Todos" },
      ...Array.from({ length: 12 }, (_, i) => {
        const id = String(i + 1);
        return { id, label: `Módulo ${id}` };
      }),
    ],
    []
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(["0"]));
  const moduleFilter = useMemo(() => Number([...selected][0] ?? "0"), [selected]);

  const filteredPermisos = useMemo(() => {
    if (!moduleFilter) return permisos;
    return permisos.filter((p) => Number(p.moduleId) === moduleFilter);
  }, [permisos, moduleFilter]);

  // Form: usuario + permisos a quitar
  const [userId, setUserId] = useState<number>(1);
  const [permisoIds, setPermisoIds] = useState<string[]>([]);

  const { mutate, isPending } = useRemovePermisosFromUser();

  const onSubmit = () => {
    if (!userId || !permisoIds.length) return;
    mutate({ userId: Number(userId), permisosIds: permisoIds.map(Number) });
  };

  return (
    <Section title="Quitar permisos a un usuario">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          label="User ID"
          type="number"
          value={String(userId)}
          onChange={(e) => setUserId(Number(e.target.value))}
          isRequired
        />
        <Select
          label="Filtrar por módulo"
          selectedKeys={selected}
          onSelectionChange={(keys) => setSelected(new Set(keys as Set<string>))}
          items={moduleOptions}
        >
          {(opt) => <SelectItem key={opt.id}>{opt.label}</SelectItem>}
        </Select>
      </div>

      {isLoading ? (
        <EmptyState text="Cargando permisos..." />
      ) : (
        <>
          <PermisosChecklist
            permisos={filteredPermisos}
            value={permisoIds}
            onChange={setPermisoIds}
          />
          <div className="mt-4">
            <AsyncButton
              isLoading={isPending}
              isDisabled={!userId || !permisoIds.length}
              onPress={onSubmit}
            >
              Quitar permisos seleccionados
            </AsyncButton>
          </div>
        </>
      )}
    </Section>
  );
}
