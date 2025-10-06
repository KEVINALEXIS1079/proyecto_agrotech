import {useEffect, useMemo, useRef, useState} from "react";
import {Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Tab, Tabs, Textarea} from "@heroui/react";
import {Camera, Check, Eye, EyeOff, KeyRound, Mail, User as UserIcon, UserRoundCog} from "lucide-react";
import {usePerfil} from "../features/usePerfil";
import type { UpdateUserInput } from "../model/types";

export default function PerfilPage() {
  const { me, loading, saving, save } = usePerfil();
  const [edit, setEdit] = useState<UpdateUserInput>({});
  const [pwdOpen, setPwdOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!me) return;
    setEdit({
      nombre_usuario: me.firstName,
      apellido_usuario: me.lastName,
      telefono_usuario: me.phone ?? "",
      correo_usuario: me.email,
      estado_usuario: me.status,
    });
    setPreview(me.avatarUrl ?? null);
  }, [me]);

  const fullName = useMemo(() => (!me ? "" : `${me.firstName} ${me.lastName}`.trim()), [me]);

  const onPickAvatar = () => fileRef.current?.click();
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setEdit(s => ({...s, img_usuario: file}));
  };

  const onSave = () => {
    const payload: UpdateUserInput = { ...edit };
    save(payload);
  };

  if (loading || !me) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <Spinner label="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={preview || ""} className="w-24 h-24 text-large" radius="lg"/>
            <Button isIconOnly size="sm" className="absolute -bottom-2 -right-2" onPress={onPickAvatar}>
              <Camera className="w-4 h-4"/>
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange}/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {fullName}
              <Chip color="primary" variant="flat" startContent={<UserRoundCog className="w-3.5 h-3.5"/>}>
                {me.role}
              </Chip>
            </h1>
            <p className="text-default-500">{me.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="flat" startContent={<KeyRound className="w-4 h-4"/>} onPress={() => setPwdOpen(true)}>Cambiar contraseña</Button>
          <Button color="primary" startContent={<Check className="w-4 h-4"/>} isLoading={saving} onPress={onSave}>Guardar</Button>
        </div>
      </div>

      <Tabs aria-label="Secciones de perfil" variant="underlined" className="mb-4">
        <Tab key="overview" title={<div className="flex items-center gap-2"><UserIcon className="w-4 h-4"/>Resumen</div>}>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Información básica</h3>
                  <p className="text-small text-default-500">Se actualizará en tu cuenta</p>
                </div>
              </CardHeader>
              <Divider/>
              <CardBody className="grid md:grid-cols-2 gap-4">
                <Input label="Nombre" value={edit.nombre_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, nombre_usuario: v}))} isRequired/>
                <Input label="Apellido" value={edit.apellido_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, apellido_usuario: v}))} isRequired/>
                <Input type="email" label="Correo" value={edit.correo_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, correo_usuario: v}))} startContent={<Mail className="w-4 h-4"/>} isRequired/>
                <Input label="Teléfono" value={edit.telefono_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, telefono_usuario: v}))}/>
                <Select>
                  <SelectItem key="activo">Activo</SelectItem>
                  <SelectItem key="inactivo">Inactivo</SelectItem>
                </Select>
              </CardBody>
              <CardFooter className="justify-end">
                <Button color="primary" startContent={<Check className="w-4 h-4"/>} isLoading={saving} onPress={onSave}>Guardar cambios</Button>
              </CardFooter>
            </Card>
          </div>
        </Tab>
      </Tabs>

      <ChangePasswordModal isOpen={pwdOpen} onOpenChange={setPwdOpen}/>
    </div>
  );
}

function ChangePasswordModal({isOpen, onOpenChange}: {isOpen: boolean; onOpenChange: (v: boolean) => void}) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const canSubmit = newPass.length >= 8 && newPass === confirm && oldPass.length > 0;

  const onClose = () => { setOldPass(""); setNewPass(""); setConfirm(""); onOpenChange(false); };
  const handleSubmit = () => { setLoading(true); setTimeout(() => { setLoading(false); onClose(); }, 700); };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Cambiar contraseña</ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input label="Contraseña actual" type={show1 ? "text" : "password"} value={oldPass} onValueChange={setOldPass} endContent={<Button isIconOnly variant="light" onPress={() => setShow1(s=>!s)} aria-label="toggle">{show1 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />
              <Input label="Nueva contraseña" type={show2 ? "text" : "password"} value={newPass} onValueChange={setNewPass} endContent={<Button isIconOnly variant="light" onPress={() => setShow2(s=>!s)} aria-label="toggle">{show2 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />
              <Input label="Confirmar nueva contraseña" type={show3 ? "text" : "password"} value={confirm} onValueChange={setConfirm} endContent={<Button isIconOnly variant="light" onPress={() => setShow3(s=>!s)} aria-label="toggle">{show3 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={close}>Cancelar</Button>
              <Button color="primary" isDisabled={!canSubmit} isLoading={loading} onPress={handleSubmit}>Actualizar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
