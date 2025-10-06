import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthRegisterForm, { type AuthRegisterValues } from "../ui/AuthRegisterForm";
import { useRegisterPublic } from "../hooks/useRegisterPublic";

export default function RegisterPage() {
  const [msg, setMsg] = useState(""); const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRegisterPublic();

  async function handleSubmit(v: AuthRegisterValues) {
    if (!Object.values(v).every(Boolean)) { setMsg("Todos los campos son obligatorios"); setOpen(true); return; }
    if (v.contrasena_usuario !== v.confirmar) { setMsg("Las contraseñas no coinciden"); setOpen(true); return; }
    if (!v.acepta) { setMsg("Debes aceptar los términos y condiciones"); setOpen(true); return; }

    const fd = new FormData();
    (Object.keys(v) as Array<keyof typeof v>).forEach((k) => { if (k !== "confirmar" && k !== "acepta") fd.append(k, v[k] as string); });

    try { await mutateAsync(fd); setMsg("Usuario registrado con éxito"); setOpen(true); }
    catch (e:any) { setMsg(e?.message || "No se pudo registrar"); setOpen(true); }
  }

  return (
    <>
      <AuthLayout
        title="Crea tu cuenta"
        subtitle="Empieza a gestionar tus cultivos"
        logoSlot={<AuthLogo/>}
        backSlot={<AuthBackButton/>}
        formTitle="Registro"
      >
        <AuthRegisterForm onSubmit={handleSubmit} loading={isPending}/>
        <p className="text-center text-sm mt-3">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary">Inicia sesión</Link>
        </p>
      </AuthLayout>

      <ToastDialog open={open} title="Registro" message={msg} onClose={() => setOpen(false)} variant="primary"/>
    </>
  );
}
