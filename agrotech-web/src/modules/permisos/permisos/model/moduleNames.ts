// Mapea id → nombre del módulo. Déjalo vacío o edítalo cuando tengas los nombres reales.
export const MODULE_NAMES: Record<number, string> = {
    30: "Usuarios",
    2: "Actividades",
    3: "ActividadCultivo",
    4: "ActividadEvidencia",
  // 1: "Usuarios",
  // 2: "Actividades",
  // 3: "Sensores",
  // ...
};

export const MODULE_RANGE: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

export function getModuleLabel(id?: number | null): string {
  if (!id) return "-";
  return MODULE_NAMES[id] ?? `Módulo ${id}`;
}
