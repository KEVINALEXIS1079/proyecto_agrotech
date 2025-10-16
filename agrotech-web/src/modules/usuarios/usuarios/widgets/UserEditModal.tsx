import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import type { RolLite, UsuarioLite } from "../model/types";
import { IdCard, Mail, Phone } from "lucide-react";
import { useMemo, useState } from "react";

export default function UserEditModal({
  user, roles, isOpen, onClose, onSubmit,
}: {
  user: UsuarioLite | null;
  roles: RolLite[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { id: number; dto: Partial<UsuarioLite> & { idRol?: number } }) => void;
}) {
  const [form, setForm] = useState<Partial<UsuarioLite>>({
    nombre: user?.nombre, apellido: user?.apellido, cedula: user?.cedula,
    telefono: user?.telefono, correo: user?.correo, idFicha: user?.idFicha,
    rol: user?.rol || roles[0],
  });

  // sincroniza cuando cambie el user
  useMemo(() => {
    if (user) {
      setForm({
        nombre: user.nombre, apellido: user.apellido, cedula: user.cedula,
        telefono: user.telefono, correo: user.correo, idFicha: user.idFicha,
        rol: user.rol || roles[0],
      });
    }
  }, [user, roles]);

  const can = useMemo(() => {
    const base =
      (form.nombre?.trim()?.length || 0) > 1 &&
      (form.apellido?.trim()?.length || 0) > 1 &&
      (form.cedula?.trim()?.length || 0) >= 6 &&
      (form.telefono?.trim()?.length || 0) >= 10 &&
      (form.correo?.includes("@") || false) &&
      (form.idFicha?.trim()?.length || 0) >= 3;
    return !!base;
  }, [form]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center" size="xl">
      <ModalContent className="md:max-w-2xl">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editar usuario</ModalHeader>
            <ModalBody>
              {user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Número de documento" startContent={<IdCard size={16} />} value={form.cedula}
                    onChange={(e) => setForm((s) => ({ ...s, cedula: e.target.value }))} />
                  <Input label="Nombre" value={form.nombre}
                    onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))} />
                  <Input label="Apellido" value={form.apellido}
                    onChange={(e) => setForm((s) => ({ ...s, apellido: e.target.value }))} />
                  <Input label="Correo electrónico" type="email" startContent={<Mail size={16} />} value={form.correo}
                    onChange={(e) => setForm((s) => ({ ...s, correo: e.target.value }))} />
                  <Input label="Teléfono" startContent={<Phone size={16} />} value={form.telefono}
                    onChange={(e) => setForm((s) => ({ ...s, telefono: e.target.value }))} />
                  <Input label="ID ficha" value={form.idFicha}
                    onChange={(e) => setForm((s) => ({ ...s, idFicha: e.target.value }))} />
                  <Select label="Rol"
                    selectedKeys={[String(((form.rol as RolLite)?.id) || roles[0]?.id)]}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const rol = roles.find((r) => r.id === id) || roles[0];
                      setForm((s) => ({ ...s, rol }));
                    }}>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id} textValue={r.nombre}>{r.nombre}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>Cancelar</Button>
              <Button
                color="primary"
                isDisabled={!can || !user}
                onPress={() => user && onSubmit({
                  id: user.id,
                  dto: { ...form, idRol: (form.rol as RolLite)?.id }
                })}
              >
                Guardar cambios
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
