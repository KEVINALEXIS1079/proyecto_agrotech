import { useMemo, useState, useCallback } from "react";
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
  TableRow,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Layers } from "lucide-react";

import Surface from "../widgets/Surface";
import SectionTitle from "../widgets/SectionTitle";
import PermisoChip from "../widgets/PermisoChip";

import { usePermisosUserSelection, useTogglePermisoOnUser } from "../hooks/usePermisos";
import UsuariosTable from "../widgets/UsuariosTable";
import { useUsuariosLite } from "../hooks/useUsuariosLite";

import {
  buildModuleMapFromPermisos,
  moduleOptionsFromMap,
  getModuleLabelFromMap,
  buildPermisoLabel,
} from "../model/modules-map";

type ModOpt = { id: string; nombre: string };

/* =========================
 * Confirm Dialog (reutilizable)
 * ========================= */
type ConfirmState = {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

function ConfirmDialog({
  state,
  setState,
  isBusy = false,
}: {
  state: ConfirmState;
  setState: (s: ConfirmState) => void;
  isBusy?: boolean;
}) {
  const onClose = () => setState({ ...state, open: false });

  return (
    <Modal isOpen={state.open} onOpenChange={onClose} placement="center" hideCloseButton>
      <ModalContent>
        <ModalHeader className="text-base font-semibold">{state.title}</ModalHeader>
        {state.message ? (
          <ModalBody className="text-default-600 whitespace-pre-line">{state.message}</ModalBody>
        ) : null}
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isBusy}>
            {state.cancelText ?? "Cancelar"}
          </Button>
          <Button
            color="danger"
            onPress={() => {
              const cb = state.onConfirm;
              onClose();
              cb?.();
            }}
            isLoading={isBusy}
          >
            {state.confirmText ?? "Confirmar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function PermisosPorUsuario() {
  const [selectedUser, setSelectedUser] = useState<{ id: number; nombre: string; rol?: any } | null>(null);
  const [moduleId, setModuleId] = useState<number | undefined>(undefined);

  // usuarios
  const { data: users = [] } = useUsuariosLite({ estado: "activo", limit: 500 });

  // permisos filtrados por módulo (para pintar la tabla)
  const { data: sel } = usePermisosUserSelection(selectedUser?.id, moduleId);

  // permisos SIN filtrar (solo para poblar el Select de módulos)
  const { data: selAll } = usePermisosUserSelection(selectedUser?.id, undefined);

  const toggle = useTogglePermisoOnUser();
  const permisos = sel?.permisos ?? [];
  const allOn = useMemo(() => permisos.length > 0 && permisos.every((p) => p.selected), [permisos]);

  // nombres “bonitos” de módulos construidos desde la API (selAll)
  const moduleMap = useMemo(
    () => buildModuleMapFromPermisos(selAll?.permisos ?? []),
    [selAll?.permisos]
  );

  // Opciones del Select (incluye "Todos")
  const MODULE_SELECT_OPTIONS: ModOpt[] = useMemo(() => {
    const opts = moduleOptionsFromMap(moduleMap).map((o) => ({ id: String(o.id), nombre: o.nombre }));
    return [{ id: "__ALL__", nombre: "Todos" }, ...opts];
  }, [moduleMap]);

  const selectedKeys = useMemo(
    () => new Set<string>([moduleId ? String(moduleId) : "__ALL__"]),
    [moduleId]
  );

  // =========================
  // Confirm state / helpers
  // =========================
  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    title: "",
    message: "",
  });

  const ask = useCallback(
    (cfg: Omit<ConfirmState, "open">) => {
      setConfirm({
        open: true,
        title: cfg.title,
        message: cfg.message,
        confirmText: cfg.confirmText,
        cancelText: cfg.cancelText ?? "Cancelar",
        onConfirm: cfg.onConfirm,
      });
    },
    []
  );

  const anyBusy = toggle.isPending;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      {/* Izquierda: tabla de usuarios */}
      <div className="md:col-span-5">
        <Surface className="sticky top-4 h-[calc(100dvh-200px)] overflow-hidden">
          <UsuariosTable
            users={users as any}
            selectedId={selectedUser?.id ?? null}
            onPick={setSelectedUser as any}
          />
        </Surface>
      </div>

      {/* Derecha: detalle + permisos */}
      <Surface className="md:col-span-7">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-4">
            {/* header usuario + módulo */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-8">
                <SectionTitle>Usuario</SectionTitle>
                <div className="rounded-xl px-3 py-2 text-sm bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  {selectedUser ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{selectedUser.nombre}</div>
                        <div className="text-xs opacity-60">
                          {typeof (selectedUser as any).rol === "string"
                            ? (selectedUser as any).rol
                            : (selectedUser as any).rol?.nombre}
                        </div>
                      </div>
                      <span className="text-xs opacity-60">ID {selectedUser.id}</span>
                    </div>
                  ) : (
                    <span className="opacity-60">Seleccione un usuario</span>
                  )}
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <SectionTitle>Módulo</SectionTitle>
                <Select<ModOpt>
                  aria-label="Seleccionar módulo"
                  items={MODULE_SELECT_OPTIONS}
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys as Set<string>)[0];
                    setModuleId(k && k !== "__ALL__" ? Number(k) : undefined);
                  }}
                  size="md"
                  radius="lg"
                  variant="bordered"
                  placeholder="Todos"
                  className="w-full"
                  popoverProps={{
                    placement: "bottom",
                    offset: 8,
                    classNames: { content: "max-h-80 overflow-auto" },
                  }}
                  classNames={{
                    trigger:
                      "h-11 px-4 bg-white/70 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10",
                    value: "text-sm",
                    popoverContent: "rounded-xl min-w-[18rem] max-h-80 overflow-auto",
                    listbox: "max-h-80 overflow-auto",
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.id} className="text-sm py-2">
                      {item.nombre}
                    </SelectItem>
                  )}
                </Select>
              </div>
            </div>

            {/* permisos */}
            <div className="rounded-2xl p-3 bg-gradient-to-br from-white/70 to-white/40 dark:from-white/5 dark:to-white/0 ring-1 ring-black/5 dark:ring-white/10">
              <div className="mb-2 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4" /> Permisos del módulo
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color="success"
                  isDisabled={!selectedUser || permisos.length === 0}
                  onPress={() => {
                    if (!selectedUser || permisos.length === 0) return;
                    const accion = allOn ? "desactivar" : "asignar";
                    const modulo = getModuleLabelFromMap(moduleId, moduleMap);
                    ask({
                      title: `¿${allOn ? "Desactivar" : "Asignar"} todos?`,
                      message: `Usuario: ${selectedUser.nombre}\nMódulo: ${modulo}\nAcción: ${accion} ${permisos.length} permisos.`,
                      confirmText: allOn ? "Desactivar todos" : "Asignar todos",
                      onConfirm: () => {
                        permisos.forEach((p: any) => {
                          if (p.selected !== !allOn) {
                            toggle.mutate({
                              userId: selectedUser.id,
                              permisoId: p.id,
                              enable: !allOn,
                              moduleId, // ⬅️ mantiene el filtro actual
                            });
                          }
                        });
                      },
                    });
                  }}
                >
                  {allOn ? "Desactivar todos" : "Asignar todos"}
                </Button>
              </div>

              {permisos.length ? (
                <Table aria-label="permisos modulo" removeWrapper className="[&_[data-slot=td]]:py-2">
                  <TableHeader>
                    <TableColumn>Permiso</TableColumn>
                    <TableColumn className="w-32 text-right">Estado</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {permisos.map((p: any) => (
                      <TableRow key={p.id} className="hover:bg-success/10 transition-colors">
                        <TableCell>
                          <PermisoChip
                            checked={!!p.selected}
                            label={buildPermisoLabel(p)}
                            onToggle={() => {
                              if (!selectedUser) return;
                              const v = !p.selected;
                              const modulo = getModuleLabelFromMap(moduleId, moduleMap);
                              ask({
                                title: v ? "¿Activar este permiso?" : "¿Desactivar este permiso?",
                                message: `Usuario: ${selectedUser.nombre}\nMódulo: ${modulo}\nPermiso: ${buildPermisoLabel(
                                  p
                                )}`,
                                confirmText: v ? "Activar" : "Desactivar",
                                onConfirm: () =>
                                  toggle.mutate({
                                    userId: selectedUser.id,
                                    permisoId: p.id,
                                    enable: v,
                                    moduleId,
                                  }),
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Switch
                              color="success"
                              isSelected={!!p.selected}
                              onValueChange={(v) => {
                                if (!selectedUser) return;
                                const modulo = getModuleLabelFromMap(moduleId, moduleMap);
                                ask({
                                  title: v ? "¿Activar este permiso?" : "¿Desactivar este permiso?",
                                  message: `Usuario: ${selectedUser.nombre}\nMódulo: ${modulo}\nPermiso: ${buildPermisoLabel(
                                    p
                                  )}`,
                                  confirmText: v ? "Activar" : "Desactivar",
                                  onConfirm: () =>
                                    toggle.mutate({
                                      userId: selectedUser.id,
                                      permisoId: p.id,
                                      enable: v,
                                      moduleId,
                                    }),
                                });
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm opacity-60">
                  {selectedUser
                    ? `No hay permisos para ${getModuleLabelFromMap(moduleId, moduleMap)}.`
                    : "Seleccione usuario y/o módulo."}
                </div>
              )}
            </div>
          </div>
        </div>
      </Surface>

      {/* Diálogo global de confirmación */}
      <ConfirmDialog state={confirm} setState={setConfirm} isBusy={anyBusy} />
    </div>
  );
}
