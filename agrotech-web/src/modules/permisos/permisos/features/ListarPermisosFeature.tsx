import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import Section from "../ui/Section";
import EmptyState from "../ui/EmptyState";
import { useListPermisosAll } from "../hooks";
import type { Permiso } from "../model/types";
import { useMemo, useState } from "react";
import { MODULE_RANGE, getModuleLabel } from "../model/moduleNames";

export default function ListarPermisosFeature() {
  const { data, isLoading } = useListPermisosAll();
  const items: Permiso[] = Array.isArray(data) ? data : [];

  // Opciones del filtro: "0" = Todos, luego 1..12
  const moduleOptions = useMemo(
    () => [
      { id: "0", label: "Todos" },
      ...MODULE_RANGE.map((n) => ({ id: String(n), label: getModuleLabel(n) })),
    ],
    []
  );

  const [selected, setSelected] = useState<Set<string>>(new Set(["0"]));
  const moduleFilter = useMemo(() => Number([...selected][0] ?? "0"), [selected]);

  // Filtrado en cliente por moduleId
  const filtered: Permiso[] = useMemo(() => {
    if (!moduleFilter) return items;
    return items.filter((p) => Number(p.moduleId) === moduleFilter);
  }, [items, moduleFilter]);

  return (
    <Section title="Permisos">
      <div className="max-w-xs mb-4">
        <Select
          label="Filtrar por módulo"
          selectedKeys={selected}
          onSelectionChange={(keys) => setSelected(new Set(keys as Set<string>))}
          items={moduleOptions}
        >
          {(opt) => <SelectItem key={opt.id}>{opt.label}</SelectItem>}
        </Select>
      </div>

      <Table aria-label="Tabla de permisos">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Acción</TableColumn>
          <TableColumn>Módulo</TableColumn>
          <TableColumn>Estado</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={<EmptyState text="No hay permisos para ese filtro" />}
          items={filtered}
        >
          {(p: Permiso) => (
            <TableRow key={p.id_permiso}>
              <TableCell>{p.id_permiso}</TableCell>
              <TableCell>{p.nombre_permiso}</TableCell>
              <TableCell>{p.accion}</TableCell>
              <TableCell>{getModuleLabel(p.moduleId ?? undefined)}</TableCell>
              <TableCell>
                <Chip color={p.activo ? "success" : "danger"} size="sm">
                  {p.activo ? "Activo" : "Inactivo"}
                </Chip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Section>
  );
}
