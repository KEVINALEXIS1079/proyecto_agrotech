import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Input, Kbd, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Tab, Tabs, Tooltip} from "@heroui/react";
import {Camera, Check, Eye, EyeOff, KeyRound, Mail, Phone, ShieldCheck, User as UserIcon, UserRoundCog, Undo2} from "lucide-react";

/* =========================================================
   Tipos (puedes adaptar a tu proyecto real)
   ========================================================= */
export type UserStatus = "activo" | "inactivo";
export type MeUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  role: string;
  avatarUrl?: string | null;
};

export type UpdateUserInput = Partial<{
  nombre_usuario: string;
  apellido_usuario: string;
  telefono_usuario: string;
  correo_usuario: string;
  estado_usuario: UserStatus;
  img_usuario: File;
}>;

/* =========================================================
   Mock de datos y Provider para el demo
   ========================================================= */
const PerfilCtx = createContext<{
  me: MeUser | null;
  loading: boolean;
  saving: boolean;
  save: (payload: UpdateUserInput) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<void>;
}>({ me: null, loading: true, saving: false, save: async () => {}, changePassword: async () => {} });

function fakeDelay(ms: number) { return new Promise(res => setTimeout(res, ms)); }

function randomAvatar() {
  const n = Math.floor(Math.random() * 6) + 1;
  return `https://i.pravatar.cc/256?img=${n}`;
}

function PerfilProvider({children}: {children: React.ReactNode}) {
  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carga fake
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fakeDelay(700);
      setMe({
        id: 1,
        firstName: "Kevin",
        lastName: "Alexis",
        email: "kevin@example.com",
        phone: "+57 320 123 4567",
        status: "activo",
        role: "Administrador",
        avatarUrl: randomAvatar(),
      });
      setLoading(false);
    })();
  }, []);

  const save = async (payload: UpdateUserInput) => {
    setSaving(true);
    await fakeDelay(900);
    setMe(m => {
      if (!m) return m;
      return {
        ...m,
        firstName: payload.nombre_usuario ?? m.firstName,
        lastName: payload.apellido_usuario ?? m.lastName,
        email: payload.correo_usuario ?? m.email,
        phone: payload.telefono_usuario ?? m.phone ?? undefined,
        status: payload.estado_usuario ?? m.status,
        avatarUrl: payload.img_usuario ? URL.createObjectURL(payload.img_usuario) : m.avatarUrl,
      };
    });
    setSaving(false);
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    // Simula validación de contraseña antigua y actualización
    await fakeDelay(800);
    if (oldPass !== "12345678") {
      throw new Error("La contraseña actual no es correcta (usa 12345678 en el demo)");
    }
    return; // ok
  };

  return (
    <PerfilCtx.Provider value={{me, loading, saving, save, changePassword}}>
      {children}
    </PerfilCtx.Provider>
  );
}

function usePerfil() { return useContext(PerfilCtx); }

/* =========================================================
   Página de Perfil (mejorada)
   ========================================================= */
export default function DemoPerfilApp(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-default-50 to-default-100 p-4 md:p-10">
      <div className="mx-auto max-w-6xl">
        <PerfilProvider>
          <PerfilPage />
        </PerfilProvider>
      </div>
    </div>
  );
}

function PerfilPage() {
  const { me, loading, saving, save } = usePerfil();
  const [edit, setEdit] = useState<UpdateUserInput>({});
  const [pwdOpen, setPwdOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrl = useRef<string | null>(null);

  // Inicializa el formulario cuando llega "me"
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

  // Limpia URLs temporales para evitar fugas
  useEffect(() => () => { if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current); }, []);

  const fullName = useMemo(() => (!me ? "" : `${me.firstName} ${me.lastName}`.trim()), [me]);

  const onPickAvatar = () => fileRef.current?.click();
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    lastObjectUrl.current = url;
    setPreview(url);
    setEdit(s => ({...s, img_usuario: file}));
  };

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);
  const canSave = useMemo(() => {
    const nombre = (edit.nombre_usuario ?? "").trim();
    const apellido = (edit.apellido_usuario ?? "").trim();
    const correo = (edit.correo_usuario ?? "").trim();
    return nombre.length > 0 && apellido.length > 0 && isEmailValid(correo);
  }, [edit]);

  const onSave = async () => {
    const payload: UpdateUserInput = { ...edit };
    await save(payload);
  };

  if (loading || !me) {
    return (
      <div className="w-full h-[50vh] grid place-items-center">
        <Spinner label="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={preview || ""} className="w-24 h-24 text-large" radius="lg"/>
            <Tooltip content="Cambiar avatar">
              <Button isIconOnly size="sm" className="absolute -bottom-2 -right-2" onPress={onPickAvatar}>
                <Camera className="w-4 h-4"/>
              </Button>
            </Tooltip>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange}/>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex flex-wrap items-center gap-2">
              {fullName}
              <Chip color="primary" variant="flat" startContent={<UserRoundCog className="w-3.5 h-3.5"/>}>
                {me.role}
              </Chip>
              {me.status === "activo" ? (
                <Chip color="success" variant="flat" startContent={<ShieldCheck className="w-3.5 h-3.5"/>}>
                  Activo
                </Chip>
              ) : (
                <Chip color="warning" variant="flat">Inactivo</Chip>
              )}
            </h1>
            <div className="text-default-500 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4"/>{me.email}</span>
              {me.phone && <span className="inline-flex items-center gap-1"><Phone className="w-4 h-4"/>{me.phone}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="flat" startContent={<KeyRound className="w-4 h-4"/>} onPress={() => setPwdOpen(true)}>Cambiar contraseña</Button>
          <Button color="primary" startContent={<Check className="w-4 h-4"/>} isLoading={saving} isDisabled={!canSave} onPress={onSave}>Guardar</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs aria-label="Secciones de perfil" variant="underlined" className="mb-4">
        <Tab key="overview" title={<div className="flex items-center gap-2"><UserIcon className="w-4 h-4"/>Resumen</div>}>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Información básica</h3>
                  <p className="text-small text-default-500">Se actualizará en tu cuenta</p>
                </div>
                <Tooltip content="Restaurar valores originales">
                  <Button size="sm" variant="light" startContent={<Undo2 className="w-4 h-4"/>}
                          onPress={() => {
                            setEdit({
                              nombre_usuario: me.firstName,
                              apellido_usuario: me.lastName,
                              telefono_usuario: me.phone ?? "",
                              correo_usuario: me.email,
                              estado_usuario: me.status,
                            });
                            setPreview(me.avatarUrl ?? null);
                          }}>Restaurar</Button>
                </Tooltip>
              </CardHeader>
              <Divider/>
              <CardBody className="grid md:grid-cols-2 gap-4">
                <Input label="Nombre" value={edit.nombre_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, nombre_usuario: v}))} isRequired/>
                <Input label="Apellido" value={edit.apellido_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, apellido_usuario: v}))} isRequired/>
                <Input type="email" label="Correo" value={edit.correo_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, correo_usuario: v}))} startContent={<Mail className="w-4 h-4"/>} isInvalid={Boolean(edit.correo_usuario && !isEmailValid(edit.correo_usuario))} errorMessage={edit.correo_usuario && !isEmailValid(edit.correo_usuario) ? "Correo inválido" : undefined} isRequired/>
                <Input label="Teléfono" value={edit.telefono_usuario || ""} onValueChange={(v) => setEdit(s => ({...s, telefono_usuario: v}))}/>
                <Select label="Estado" selectedKeys={new Set([edit.estado_usuario ?? me.status])} onChange={(e) => setEdit(s => ({...s, estado_usuario: (e.target.value as UserStatus) ?? s.estado_usuario}))}>
                  <SelectItem key="activo">Activo</SelectItem>
                  <SelectItem key="inactivo">Inactivo</SelectItem>
                </Select>
              </CardBody>
              <CardFooter className="justify-end gap-2">
                <Button variant="light" onPress={() => {
                  setEdit({
                    nombre_usuario: me.firstName,
                    apellido_usuario: me.lastName,
                    telefono_usuario: me.phone ?? "",
                    correo_usuario: me.email,
                    estado_usuario: me.status,
                  });
                  setPreview(me.avatarUrl ?? null);
                }}>Cancelar</Button>
                <Button color="primary" startContent={<Check className="w-4 h-4"/>} isLoading={saving} isDisabled={!canSave} onPress={onSave}>Guardar cambios</Button>
              </CardFooter>
            </Card>
          </div>
        </Tab>
      </Tabs>

      <ChangePasswordModal isOpen={pwdOpen} onOpenChange={setPwdOpen}/>
    </div>
  );
}

/* =========================================================
   Modal de cambio de contraseña (con validación)
   ========================================================= */
function ChangePasswordModal({isOpen, onOpenChange}: {isOpen: boolean; onOpenChange: (v: boolean) => void}) {
  const { changePassword } = usePerfil();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(newPass), [newPass]);
  const canSubmit = newPass.length >= 8 && newPass === confirm && oldPass.length > 0 && strength.score >= 2;

  const onClose = () => { setOldPass(""); setNewPass(""); setConfirm(""); setError(null); onOpenChange(false); };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await changePassword(oldPass, newPass);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Cambiar contraseña</ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input label="Contraseña actual" type={show1 ? "text" : "password"} value={oldPass} onValueChange={setOldPass} endContent={<Button isIconOnly variant="light" onPress={() => setShow1(s=>!s)} aria-label="toggle">{show1 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />

              <div className="grid gap-2">
                <Input label="Nueva contraseña" type={show2 ? "text" : "password"} value={newPass} onValueChange={setNewPass} endContent={<Button isIconOnly variant="light" onPress={() => setShow2(s=>!s)} aria-label="toggle">{show2 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />
                <PasswordMeter strength={strength}/>
                <ul className="text-tiny text-default-500 list-disc ml-5 -mt-1">
                  <li>Mínimo 8 caracteres</li>
                  <li>Usa mayúsculas, minúsculas y números</li>
                  <li>Evita secuencias comunes (1234, qwerty)</li>
                </ul>
              </div>

              <Input label="Confirmar nueva contraseña" type={show3 ? "text" : "password"} value={confirm} onValueChange={setConfirm} endContent={<Button isIconOnly variant="light" onPress={() => setShow3(s=>!s)} aria-label="toggle">{show3 ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</Button>} />

              {error && (
                <Card className="bg-danger-50 border border-danger-200">
                  <CardBody className="py-3 text-danger-600 text-small">{error}</CardBody>
                </Card>
              )}
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

/* =========================================================
   Utilidades para la fuerza de la contraseña
   ========================================================= */
function passwordStrength(pwd: string): { score: 0 | 1 | 2 | 3; label: string } {
  let score: 0 | 1 | 2 | 3 = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^\w\s]/.test(pwd)) score++;
  const label = ["Débil", "Básica", "Buena", "Fuerte"][score] as string;
  return { score, label };
}

function PasswordMeter({strength}: {strength: {score: 0|1|2|3; label: string}}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded bg-default-200 overflow-hidden">
        <div className={`h-full ${barWidth(strength.score)} bg-success-400 transition-all`} />
      </div>
      <Chip size="sm" variant="flat">{strength.label}</Chip>
    </div>
  );
}

function barWidth(score: 0|1|2|3){
  switch(score){
    case 0: return "w-1/12";
    case 1: return "w-4/12";
    case 2: return "w-8/12";
    case 3: return "w-full";
  }
}
