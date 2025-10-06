import { CheckboxGroup, Checkbox } from "@heroui/react";
import type { Permiso } from "../model/types";

type Props = {
  permisos: Permiso[];
  value: string[];
  onChange: (vals: string[]) => void;
};

export default function PermisosChecklist({ permisos, value, onChange }: Props) {
  return (
    <CheckboxGroup
      label="Permisos del módulo"
      value={value}
      onValueChange={(vals) => onChange(vals as string[])}
    >
      {(permisos ?? []).map((p) => (
        <Checkbox key={p.id_permiso} value={String(p.id_permiso)}>
          {p.nombre_permiso} ({p.accion})
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
