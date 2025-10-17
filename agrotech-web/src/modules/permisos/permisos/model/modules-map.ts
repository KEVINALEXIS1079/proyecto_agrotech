// ===============================
// Helpers de normalización
// ===============================
function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/** "actividad:evidencias" → "Evidencias" */
export function normalizeModuleSlug(raw?: string): string {
  if (!raw) return "";
  const tail = String(raw).split(":").pop() || "";
  return titleCase(tail);
}

/** Recurso legible a partir del permiso */
export function getPermResource(p: any): string {
  const base = p?.module?.nombre ?? p?.modulo ?? "";
  return normalizeModuleSlug(base);
}

// ===============================
// Mapas base (puedes editarlos)
// ===============================
export const MODULE_NAME_OVERRIDES: Record<number, string> = {
  2: "Actividades",
  3: "Actividad de Cultivo",
  4: "Actividad - Evidencias",
  5: "Actividad - Tipos",
  6: "Actividad por Usuario",
  8: "Cultivos",
  9: "Lotes",
  10: "Sublotes",
  11: "Tipos de Cultivo",
  13: "Movimientos (Finanzas)",
  14: "Productos (Finanzas)",
  15: "Ventas",
  17: "EPAS",
  18: "Tipos de EPAS",
  20: "Almacenes",
  21: "Categorías",
  22: "Insumos ↔ Proveedor",
  23: "Insumos",
  24: "Movimientos (Inventario)",
  26: "Sensores IoT",
  27: "Tipos de Sensores",
  29: "Roles",
  30: "Usuarios",
};

export const ACTION_LABELS: Record<string, string> = {
  read: "Ver",
  create: "Crear",
  update: "Editar",
  delete: "Eliminar",
};

export const PERMISO_LABEL_OVERRIDES: Record<string, string> = {
  // "actividad:evidencias:read": "Ver evidencias",
};

// ===============================
// Construcción automática desde API
// ===============================

/** Toma /permisos (o /permisos/user-selection) y arma id → nombre bonito */
export function buildModuleMapFromPermisos(permisos: any[]): Record<number, string> {
  const map: Record<number, string> = {};

  for (const p of permisos || []) {
    // Cubrimos distintas formas de venir el id del módulo
    const rawId =
      p?.module?.id ??
      p?.module?.id_permiso_module_pk ??
      p?.moduleId ??
      p?.module_id ??
      null;

    const id = Number(rawId);
    if (!id || Number.isNaN(id)) continue;

    // Override fijo si existe
    if (MODULE_NAME_OVERRIDES[id]) {
      map[id] = MODULE_NAME_OVERRIDES[id];
      continue;
    }

    // Si no hay override, generamos a partir del nombre crudo
    const rawName = p?.module?.nombre ?? p?.modulo ?? "";
    if (!rawName) continue;
    map[id] = normalizeModuleSlug(rawName);
  }

  // Si por cualquier razón quedó vacío, devolvemos al menos los overrides
  if (Object.keys(map).length === 0) return { ...MODULE_NAME_OVERRIDES };

  return map;
}

/** Devuelve label para un id dado el mapa ya construido */
export function getModuleLabelFromMap(id?: number | null, map?: Record<number, string>) {
  if (!id) return "Todos";
  if (map?.[id]) return map[id];
  if (MODULE_NAME_OVERRIDES[id]) return MODULE_NAME_OVERRIDES[id];
  return `Módulo ${id}`;
}

/** Opciones para Select a partir del mapa */
export function moduleOptionsFromMap(map: Record<number, string>) {
  return Object.entries(map)
    .map(([id, nombre]) => ({ id: Number(id), nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/** Etiqueta bonita para cada permiso */
export function buildPermisoLabel(p: any): string {
  const key = p?.permisoCompleto ?? "";
  if (PERMISO_LABEL_OVERRIDES[key]) return PERMISO_LABEL_OVERRIDES[key];

  const action = ACTION_LABELS[p?.accion] ?? titleCase(p?.accion ?? "");
  const resource = getPermResource(p);
  return `${action} ${resource}`.trim();
}
