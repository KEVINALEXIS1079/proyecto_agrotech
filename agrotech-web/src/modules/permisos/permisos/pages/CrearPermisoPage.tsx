// src/modules/permisos/features/PermisosPorUsuarioDemo.tsx
import { useMemo, useState } from "react";
import {
  Card, CardHeader, CardBody, CardFooter,
  Button, Select, SelectItem, Chip, Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Switch, Tooltip
} from "@heroui/react";
import { Pencil, Trash2, Plus, ShieldCheck, Save, RotateCcw, Search } from "lucide-react";

type Accion = "crear" | "borrar" | "editar" | "restaurar";
type Rol = { id: string; nombre: string };
type Modulo = { id: string; nombre: string };
type Usuario = { id: string; nombre: string; cedula: string; rolId: string };

const ROLES: Rol[] = [
  { id: "r1", nombre: "Admin" },
  { id: "r2", nombre: "Instructor" },
  { id: "r3", nombre: "Aprendiz" },
];

const MODULOS: Modulo[] = [
  { id: "cultivos", nombre: "Cultivos" },
  { id: "insumos", nombre: "Insumos" },
  { id: "sensores", nombre: "Sensores" },
  { id: "reportes", nombre: "Reportes" },
];

// permisos por rol y módulo (base de referencia)
const PERMISOS_ROL: Record<string, Record<string, Record<Accion, boolean>>> = {
  r1: {
    cultivos: { crear: true, borrar: true, editar: true, restaurar: true },
    insumos: { crear: true, borrar: true, editar: true, restaurar: true },
    sensores: { crear: true, borrar: true, editar: true, restaurar: true },
    reportes: { crear: true, borrar: true, editar: true, restaurar: true },
  },
  r2: {
    cultivos: { crear: true, borrar: false, editar: true, restaurar: false },
    insumos: { crear: true, borrar: false, editar: true, restaurar: false },
    sensores: { crear: false, borrar: false, editar: true, restaurar: false },
    reportes: { crear: false, borrar: false, editar: true, restaurar: false },
  },
  r3: {
    cultivos: { crear: false, borrar: false, editar: true, restaurar: false },
    insumos: { crear: false, borrar: false, editar: false, restaurar: false },
    sensores: { crear: false, borrar: false, editar: false, restaurar: false },
    reportes: { crear: false, borrar: false, editar: false, restaurar: false },
  },
};

const USUARIOS: Usuario[] = [
  { id: "u1", nombre: "Pepe",  cedula: "1001001001", rolId: "r2" },
  { id: "u2", nombre: "Lola",  cedula: "2002002002", rolId: "r3" },
  { id: "u3", nombre: "Kevin", cedula: "3003003003", rolId: "r1" },
];

const ACCIONES: Accion[] = ["crear", "borrar", "editar", "restaurar"];

export default function PermisosPorUsuarioDemo() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS);
  const [userId, setUserId] = useState<string>("u1");
  const [moduloId, setModuloId] = useState<string>("cultivos");

  // buscador interno del Select de usuarios
  const [userFilter, setUserFilter] = useState("");
  const [openUserSelect, setOpenUserSelect] = useState(false);

  // overrides de permisos por USUARIO y MÓDULO
  const [overrides, setOverrides] = useState<
    Record<string, Record<string, Partial<Record<Accion, boolean>>>>
  >({});

  // modales
  const [openCambiarRol, setOpenCambiarRol] = useState(false);
  const [rolNuevo, setRolNuevo] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const usuario = useMemo(() => usuarios.find(u => u.id === userId) ?? null, [usuarios, userId]);
  const rolUsuario = useMemo(() => ROLES.find(r => r.id === (usuario?.rolId ?? "")) ?? null, [usuario]);
  const moduloActual = useMemo(() => MODULOS.find(m => m.id === moduloId) ?? null, [moduloId]);

  const baseRol: Record<Accion, boolean> = useMemo(() => {
    const base = PERMISOS_ROL[usuario?.rolId ?? ""]?.[moduloId];
    return base ?? { crear: false, borrar: false, editar: false, restaurar: false };
  }, [usuario?.rolId, moduloId]);

  const userOverrides = useMemo(() => overrides[userId]?.[moduloId] ?? {}, [overrides, userId, moduloId]);

  const efectivo: Record<Accion, boolean> = useMemo(() => {
    const res: Record<Accion, boolean> = { ...baseRol };
    for (const a of ACCIONES) {
      if (userOverrides[a] !== undefined) res[a] = !!userOverrides[a];
    }
    return res;
  }, [baseRol, userOverrides]);

  const filteredUsuarios = useMemo(
    () =>
      usuarios.filter((u) =>
        `${u.nombre} - ${u.cedula}`.toLowerCase().includes(userFilter.toLowerCase())
      ),
    [usuarios, userFilter]
  );

  const setOverride = (a: Accion, value: boolean) => {
    setOverrides((prev) => {
      const byUser = { ...(prev[userId] ?? {}) };
      const byModulo = { ...(byUser[moduloId] ?? {}) };
      byModulo[a] = value;
      byUser[moduloId] = byModulo;
      return { ...prev, [userId]: byUser };
    });
  };

  const handleAsignar = () => {
    // Aquí iría tu llamada a la API real
    setOpenConfirm(true);
  };

  const aplicarCambioRol = () => {
    if (!rolNuevo || !usuario) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuario.id ? { ...u, rolId: rolNuevo } : u))
    );
    setOpenCambiarRol(false);
    setRolNuevo(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card shadow="sm" className="border border-default-200">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Permisos / Usuario</h2>
          </div>
          <Chip color="primary" variant="flat">Demo UI (HeroUI)</Chip>
        </CardHeader>

        <Divider />

        <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Select de usuario con buscador interno y "nombre - cédula" */}
          <div className="space-y-3">
            <div className="text-sm text-foreground-500">usuario</div>

            <Select
              aria-label="Seleccione el usuario"
              className="w-full"
              selectedKeys={new Set([userId])}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as string | undefined;
                if (k) setUserId(k);
              }}
              isOpen={openUserSelect}
              onOpenChange={(open) => {
                setOpenUserSelect(open);
                if (!open) setUserFilter("");
              }}
              items={filteredUsuarios}
              listboxProps={{
                emptyContent: "Sin resultados",
                topContent: (
                  <div className="px-2 py-2 sticky top-0 bg-content1 z-10">
                    <Input
                      autoFocus
                      size="sm"
                      aria-label="Buscar usuario"
                      placeholder="Buscar…"
                      startContent={<Search className="w-4 h-4" />}
                      value={userFilter}
                      onValueChange={setUserFilter}
                      classNames={{ inputWrapper: "h-9" }}
                    />
                  </div>
                ),
              }}
              renderValue={(items) => {
                const it = items[0]?.data as Usuario | undefined;
                if (!it) return null;
                return <span>{`${it.nombre} - ${it.cedula}`}</span>;
              }}
            >
              {(u: Usuario) => (
                <SelectItem key={u.id} textValue={`${u.nombre} - ${u.cedula}`}>
                  <div className="flex items-center justify-between w-full">
                    <span>{u.nombre} - {u.cedula}</span>
                    <Chip size="sm" variant="flat">
                      {ROLES.find(r => r.id === u.rolId)?.nombre ?? "—"}
                    </Chip>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>

          {/* Rol del usuario + módulo */}
          <div className="space-y-3">
            <div className="text-sm text-foreground-500">rol</div>
            <div className="flex gap-2">
              <Input readOnly value={rolUsuario?.nombre ?? ""} className="w-full" />
              <Button variant="flat" onPress={() => setOpenCambiarRol(true)}>cambiar rol</Button>
            </div>

            <div className="text-sm text-foreground-500">permisos</div>
            <Select
              aria-label="Seleccione módulo"
              className="w-full"
              selectedKeys={new Set([moduloId])}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as string | undefined;
                if (k) { setModuloId(k); }
              }}
            >
              {MODULOS.map((m) => (
                <SelectItem key={m.id}>{m.nombre}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Grid de permisos: base del rol + override por usuario */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCIONES.map((a) => {
                const fromRol = baseRol[a];
                const hasOverride = userOverrides[a] !== undefined;
                return (
                  <div key={a} className="flex items-center justify-between rounded-2xl border border-default-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a === "crear" && <Plus className="w-4 h-4" />}
                      {a === "borrar" && <Trash2 className="w-4 h-4" />}
                      {a === "editar" && <Pencil className="w-4 h-4" />}
                      {a === "restaurar" && <RotateCcw className="w-4 h-4" />}
                      <span className="capitalize">
                        {a} {moduloActual?.nombre.toLowerCase()}
                      </span>
                      <Tooltip content={`Permiso del rol: ${fromRol ? "habilitado" : "deshabilitado"}`}>
                        <Chip size="sm" variant="flat" color={fromRol ? "success" : "default"}>
                          rol {fromRol ? "on" : "off"}
                        </Chip>
                      </Tooltip>
                      {hasOverride && (
                        <Chip size="sm" variant="flat" color="primary">
                          override
                        </Chip>
                      )}
                    </div>
                    <Switch
                      isSelected={efectivo[a]}
                      onValueChange={(v) => setOverride(a, v)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-end">
          <Button color="success" startContent={<Save className="w-4 h-4" />} onPress={handleAsignar}>
            asignar
          </Button>
        </CardFooter>
      </Card>

      {/* Modal cambiar rol del usuario */}
      <Modal isOpen={openCambiarRol} onOpenChange={setOpenCambiarRol}>
        <ModalContent>
          <ModalHeader>Cambiar rol del usuario</ModalHeader>
          <ModalBody>
            <Select
              aria-label="Seleccionar rol"
              selectedKeys={new Set([rolNuevo ?? usuario?.rolId ?? ""])}
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as string | undefined;
                if (k) setRolNuevo(k);
              }}
            >
              {ROLES.map((r) => (
                <SelectItem key={r.id}>{r.nombre}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setOpenCambiarRol(false)}>Cancelar</Button>
            <Button color="primary" onPress={aplicarCambioRol}>Aplicar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación */}
      <Modal isOpen={openConfirm} onOpenChange={setOpenConfirm}>
        <ModalContent>
          <ModalHeader>Permisos guardados</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              Usuario <b>{usuario?.nombre} - {usuario?.cedula}</b> — Rol <b>{rolUsuario?.nombre}</b> — Módulo <b>{moduloActual?.nombre}</b>
            </p>
            <Table aria-label="Resumen de permisos">
              <TableHeader>
                <TableColumn>ACCIÓN</TableColumn>
                <TableColumn>ROL</TableColumn>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn>EFECTIVO</TableColumn>
              </TableHeader>
              <TableBody>
                {ACCIONES.map((a) => (
                  <TableRow key={a}>
                    <TableCell className="capitalize">{a}</TableCell>
                    <TableCell>{baseRol[a] ? "on" : "off"}</TableCell>
                    <TableCell>
                      {userOverrides[a] === undefined ? "—" : userOverrides[a] ? "on" : "off"}
                    </TableCell>
                    <TableCell>{efectivo[a] ? "on" : "off"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setOpenConfirm(false)}>Listo</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
