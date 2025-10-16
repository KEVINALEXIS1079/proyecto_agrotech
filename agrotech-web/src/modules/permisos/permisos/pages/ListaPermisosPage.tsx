import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Shield, Layers, Check, Search } from "lucide-react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Pagination,
} from "@heroui/react";

/* =========================================================
   Datos DEMO
   ========================================================= */
const ROLES = ["Administrador", "Instructor", "Aprendiz", "Pasante", "Supervisor", "Auditor"];

const NOMBRES = [
  "Ana Pérez", "Luis Gómez", "María Rodríguez", "Carlos Sánchez", "Laura Ramírez",
  "Diego Torres", "Camila Herrera", "Andrés Castillo", "Valentina López", "Julián Ríos",
  "Daniela Cruz", "Santiago Medina", "Paula Morales", "Kevin Castañeda", "Sara Jiménez",
  "Felipe Vargas", "Diana Patiño", "Esteban Quintero", "Natalia Silva", "Jorge Ruiz",
  "Manuela Torres", "David Ospina", "Alejandra Prieto", "Miguel Salazar", "Isabella Cárdenas",
  "Juan Pablo Mejía", "Tatiana Duarte", "Oscar Nieto", "Andrea Bonilla", "Samuel Franco",
  "Luisa Fernanda", "Mateo Álvarez", "Karen Roldán", "Sebastián Pardo", "Mónica Acosta",
  "Ricardo Peña", "Eliana Córdoba", "Cristian Rangel", "Yuliana Suárez", "Tomás Giraldo",
];

const USERS = NOMBRES.slice(0, 40).map((nombre, i) => ({
  id: i + 1,
  nombre,
  cedula: String(10000000 + i * 7),
  id_ficha: 500 + (i % 9),
  rol: ROLES[i % ROLES.length],
}));

const MODULOS = [
  { id: "cultivos", nombre: "Cultivos" },
  { id: "lotes", nombre: "Lotes" },
  { id: "insumos", nombre: "Insumos" },
  { id: "reportes", nombre: "Reportes" },
  { id: "sensores", nombre: "Sensores" },
];

const PERMISOS_POR_MODULO: Record<string, string[]> = {
  cultivos: ["crear cultivo", "editar cultivo", "borrar cultivo", "restaurar cultivo"],
  lotes: ["crear lote", "editar lote", "borrar lote", "ver mapa"],
  insumos: ["registrar insumo", "salida insumo", "editar insumo", "ver inventario"],
  reportes: ["generar reporte", "exportar pdf", "ver dashboard"],
  sensores: ["crear sensor", "editar umbrales", "ver lecturas", "recalibrar"],
};

/* =========================================================
   Helpers UI – superficies sin bordes feos
   ========================================================= */
function Surface({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <Card
      shadow="sm"
      className={`rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-zinc-900/40 ring-1 ring-black/5 dark:ring-white/10 ${className}`}
    >
      <CardBody className="p-5">{children}</CardBody>
    </Card>
  );
}

function SectionTitle({ children }: React.PropsWithChildren) {
  return <h3 className="text-sm font-semibold tracking-wide opacity-70">{children}</h3>;
}

function PillToggle({
  value,
  onChange,
}: {
  value: "usuario" | "rol";
  onChange: (v: "usuario" | "rol") => void;
}) {
  const index = value === "usuario" ? 0 : 1;
  return (
    <div className="relative flex overflow-hidden rounded-full bg-white/70 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10 p-1">
      <button
        onClick={() => onChange("usuario")}
        className="relative z-10 px-4 py-2 text-sm flex items-center gap-2"
      >
        <User className="h-4 w-4" /> Usuario → Permiso
      </button>
      <button
        onClick={() => onChange("rol")}
        className="relative z-10 px-4 py-2 text-sm flex items-center gap-2"
      >
        <Shield className="h-4 w-4" /> Rol → Permiso
      </button>
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="pointer-events-none absolute top-1 bottom-1 w-1/2 rounded-full bg-success/15"
        style={{ left: index === 0 ? "4px" : "calc(50% + 4px)" }}
      />
    </div>
  );
}

function PermisoChip({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <Chip
      variant={checked ? "solid" : "flat"}
      color={checked ? "success" : "default"}
      onClick={onToggle}
      className="cursor-pointer select-none"
      startContent={checked ? <Check className="h-3 w-3" /> : undefined}
    >
      {label}
    </Chip>
  );
}

/* =========================================================
   Tabla Usuarios – layout elegante y sticky
   ========================================================= */
function UsuariosTable({
  onPick,
  selectedId,
}: {
  onPick: (u: typeof USERS[number]) => void;
  selectedId?: number | null;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const filtrados = useMemo(() => {
    const q = query.toLowerCase();
    return USERS.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        u.cedula.includes(query) ||
        String(u.id_ficha).includes(query)
    );
  }, [query]);

  const pages = Math.max(1, Math.ceil(filtrados.length / rowsPerPage));
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtrados.slice(start, start + rowsPerPage);
  }, [page, filtrados]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  return (
    <Surface className="sticky top-4 h-[calc(100dvh-200px)] overflow-hidden">
      <div className="flex flex-col h-full gap-3">
        <Input
          startContent={<Search className="h-4 w-4" />}
          placeholder="Buscar por nombre, cédula o ficha"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="sm"
          className="bg-transparent"
        />
        <div className="flex-1 overflow-auto rounded-xl">
          <Table
            aria-label="usuarios"
            removeWrapper
            isHeaderSticky
            className="
              max-h-full
              [&_[data-slot=th]]:bg-transparent
              [&_[data-slot=tr]]:hover:bg-success/10
              [&_[data-slot=td]]:py-2
            "
          >
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>CC</TableColumn>
              <TableColumn>Ficha</TableColumn>
              <TableColumn>Rol</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin resultados">
              {items.map((u) => (
                <TableRow
                  key={u.id}
                  onClick={() => onPick(u)}
                  className={`cursor-pointer transition-colors ${
                    selectedId === u.id ? "bg-success/15" : ""
                  }`}
                >
                  <TableCell className="font-medium">{u.nombre}</TableCell>
                  <TableCell>{u.cedula}</TableCell>
                  <TableCell>{u.id_ficha}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end">
          <Pagination
            page={page}
            total={pages}
            onChange={setPage}
            size="sm"
            showShadow={false}
            color="success"
          />
        </div>
      </div>
    </Surface>
  );
}

/* =========================================================
   Permisos por Usuario – panel aireado sin bordes duros
   ========================================================= */
function PermisosPorUsuario() {
  const [selectedUser, setSelectedUser] = useState<typeof USERS[number] | null>(null);
  const [modulo, setModulo] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!modulo) return;
    const base: Record<string, boolean> = {};
    for (const p of PERMISOS_POR_MODULO[modulo] || []) base[p] = false;
    setChecked(base);
  }, [modulo, selectedUser]);

  const allOn = useMemo(
    () => (modulo ? (PERMISOS_POR_MODULO[modulo] || []).every((p) => checked[p]) : false),
    [checked, modulo]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-5">
        <UsuariosTable onPick={setSelectedUser} selectedId={selectedUser?.id ?? null} />
      </div>

      <Surface className="md:col-span-7">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-9">
                <SectionTitle>Usuario</SectionTitle>
                <div className="rounded-xl px-3 py-2 text-sm bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  {selectedUser ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{selectedUser.nombre}</div>
                        <div className="text-xs opacity-60">{selectedUser.rol}</div>
                      </div>
                      <span className="text-xs opacity-60">ID {selectedUser.id}</span>
                    </div>
                  ) : (
                    <span className="opacity-60">Seleccione un usuario</span>
                  )}
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <SectionTitle>Módulo</SectionTitle>
                <select
                  className="w-full rounded-xl px-3 py-2 text-sm bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10"
                  value={modulo ?? ""}
                  onChange={(e) => setModulo(e.target.value || null)}
                >
                  <option value="">Seleccione módulo</option>
                  {MODULOS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl p-3 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/5 dark:to-white/0 ring-1 ring-black/5 dark:ring-white/10">
              <div className="mb-2 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4" /> Permisos del módulo
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    if (!modulo) return;
                    const next: Record<string, boolean> = {};
                    for (const p of PERMISOS_POR_MODULO[modulo] || []) next[p] = !allOn;
                    setChecked(next);
                  }}
                  color="success"
                >
                  {allOn ? "Desactivar todos" : "Asignar todos"}
                </Button>
              </div>

              {modulo ? (
                <Table aria-label="permisos modulo" removeWrapper className="[&_[data-slot=td]]:py-2">
                  <TableHeader>
                    <TableColumn>Permiso</TableColumn>
                    <TableColumn className="w-32 text-right">Estado</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {PERMISOS_POR_MODULO[modulo].map((p) => (
                      <TableRow key={p} className="hover:bg-success/10 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PermisoChip
                              checked={!!checked[p]}
                              label={p}
                              onToggle={() => setChecked((s) => ({ ...s, [p]: !s[p] }))}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Switch
                              color="success"
                              isSelected={!!checked[p]}
                              onValueChange={(v) => setChecked((s) => ({ ...s, [p]: v }))}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm opacity-60">Seleccione un módulo para ver sus permisos.</div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 flex md:items-start md:justify-end">
            <Button
              size="sm"
              color="success"
              className="w-full md:w-auto"
              onPress={() => {
                if (!selectedUser || !modulo) return;
                const seleccionados = Object.entries(checked)
                  .filter(([, v]) => v)
                  .map(([k]) => k);
                alert(
                  `Asignar a ${selectedUser.nombre} → módulo ${modulo}:\n` +
                    (seleccionados.length ? seleccionados.join(", ") : "(sin permisos)")
                );
              }}
            >
              Asignar
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
}

/* =========================================================
   Roles
   ========================================================= */
function RolesTable({
  roles,
  onPick,
  onDelete,
  selected,
}: {
  roles: string[];
  onPick: (r: string) => void;
  onDelete: (r: string) => void;
  selected: string | null;
}) {
  return (
    <Surface className="sticky top-4 h-[calc(100dvh-200px)] overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto rounded-xl">
          <Table
            aria-label="roles"
            removeWrapper
            className="[&_[data-slot=td]]:py-2 [&_[data-slot=tr]]:hover:bg-success/10"
          >
            <TableHeader>
              <TableColumn>Rol</TableColumn>
              <TableColumn className="w-28 text-right">Acción</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin roles">
              {roles.map((r) => (
                <TableRow
                  key={r}
                  className={`cursor-pointer transition-colors ${
                    selected === r ? "bg-success/15" : ""
                  }`}
                  onClick={() => onPick(r)}
                >
                  <TableCell className="font-medium">{r}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => {
                          onDelete(r);
                        }}
                      >
                        borrar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Surface>
  );
}

function PermisosPorRol() {
  const [roles, setRoles] = useState(ROLES);
  const [eliminados, setEliminados] = useState<string[]>([]);
  const [rol, setRol] = useState<string | null>(null);
  const [modulo, setModulo] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!modulo) return;
    const base: Record<string, boolean> = {};
    for (const p of PERMISOS_POR_MODULO[modulo] || []) base[p] = false;
    setChecked(base);
  }, [modulo, rol]);

  const allOn = useMemo(
    () => (modulo ? (PERMISOS_POR_MODULO[modulo] || []).every((p) => checked[p]) : false),
    [checked, modulo]
  );

  const eliminar = (r: string) => {
    setRoles((rs) => rs.filter((x) => x !== r));
    setEliminados((e) => [r, ...e]);
    if (rol === r) setRol(null);
  };

  const restaurar = (r: string) => {
    setEliminados((e) => e.filter((x) => x !== r));
    setRoles((rs) => [r, ...rs]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-5">
        <Tabs aria-label="roles" variant="underlined" color="success" className="w-full">
          <Tab key="activos" title="Activos">
            <RolesTable roles={roles} selected={rol} onPick={setRol} onDelete={eliminar} />
          </Tab>
          <Tab key="eliminados" title="Eliminados">
            <Surface>
              <Table
                aria-label="roles eliminados"
                removeWrapper
                className="[&_[data-slot=td]]:py-2 [&_[data-slot=tr]]:hover:bg-success/10"
              >
                <TableHeader>
                  <TableColumn>Rol</TableColumn>
                  <TableColumn className="w-28 text-right">Acción</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Sin roles eliminados">
                  {eliminados.map((r) => (
                    <TableRow key={r}>
                      <TableCell className="font-medium">{r}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button size="sm" variant="light" onPress={() => restaurar(r)}>
                            restaurar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Surface>
          </Tab>
        </Tabs>
      </div>

      <Surface className="md:col-span-7">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-9">
                <SectionTitle>Rol</SectionTitle>
                <div className="rounded-xl px-3 py-2 text-sm bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  {rol ?? <span className="opacity-60">Seleccione un rol</span>}
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <SectionTitle>Módulo</SectionTitle>
                <select
                  className="w-full rounded-xl px-3 py-2 text-sm bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10"
                  value={modulo ?? ""}
                  onChange={(e) => setModulo(e.target.value || null)}
                >
                  <option value="">Seleccione módulo</option>
                  {MODULOS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl p-3 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/5 dark:to-white/0 ring-1 ring-black/5 dark:ring-white/10">
              <div className="mb-2 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4" /> Permisos del módulo
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color="success"
                  onPress={() => {
                    if (!modulo) return;
                    const next: Record<string, boolean> = {};
                    for (const p of PERMISOS_POR_MODULO[modulo] || []) next[p] = !allOn;
                    setChecked(next);
                  }}
                >
                  {allOn ? "Desactivar todos" : "Asignar todos"}
                </Button>
              </div>

              {modulo ? (
                <Table aria-label="permisos rol" removeWrapper className="[&_[data-slot=td]]:py-2">
                  <TableHeader>
                    <TableColumn>Permiso</TableColumn>
                    <TableColumn className="w-32 text-right">Estado</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {PERMISOS_POR_MODULO[modulo].map((p) => (
                      <TableRow key={p} className="hover:bg-success/10 transition-colors">
                        <TableCell>
                          <PermisoChip
                            checked={!!checked[p]}
                            label={p}
                            onToggle={() => setChecked((s) => ({ ...s, [p]: !s[p] }))}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Switch
                              color="success"
                              isSelected={!!checked[p]}
                              onValueChange={(v) => setChecked((s) => ({ ...s, [p]: v }))}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm opacity-60">Seleccione un módulo para ver sus permisos.</div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 flex md:items-start md:justify-end">
            <Button
              size="sm"
              color="success"
              className="w-full md:w-auto"
              onPress={() => {
                if (!rol || !modulo) return;
                const seleccionados = Object.entries(checked)
                  .filter(([, v]) => v)
                  .map(([k]) => k);
                alert(
                  `Asignar a rol ${rol} → módulo ${modulo}:\n` +
                    (seleccionados.length ? seleccionados.join(", ") : "(sin permisos)")
                );
              }}
            >
              Asignar
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
}

/* =========================================================
   Página
   ========================================================= */
export default function ListaPermisosPage() {
  const [mode, setMode] = useState<"usuario" | "rol">("usuario");

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(16,185,129,0.12),transparent),radial-gradient(1000px_500px_at_90%_10%,rgba(16,185,129,0.12),transparent)] dark:bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(16,185,129,0.10),transparent),radial-gradient(1000px_500px_at_90%_10%,rgba(16,185,129,0.10),transparent)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Gestión de permisos
              </span>
            </h1>
            <p className="text-sm opacity-70">Desliza entre Usuario→Permiso y Rol→Permiso</p>
          </div>
          <PillToggle value={mode} onChange={setMode} />
        </div>

        {/* Contenido con transición */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-zinc-900/30 ring-1 ring-black/5 dark:ring-white/10 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ x: mode === "usuario" ? -24 : 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: mode === "usuario" ? 24 : -24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              {mode === "usuario" ? <PermisosPorUsuario /> : <PermisosPorRol />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
