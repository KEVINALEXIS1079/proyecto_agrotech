import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthChangePasswordForm, {type AuthChangePasswordValues } from "../ui/AuthChangePasswordForm";
import { useRecoverChange } from "../hooks/useRecover";

export default function ChangePasswordPage() {
  const location = useLocation() as any;
  const correo = location?.state?.correo || "";
  const codigo = location?.state?.codigo || "";
  const [msg, setMsg] = useState(""); const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRecoverChange();
  const navigate = useNavigate();

  async function handleSubmit(v: AuthChangePasswordValues) {
    if (!v.contrasena_usuario || !v.confirmar) { setMsg("Completa todos los campos"); setOpen(true); return; }
    if (v.contrasena_usuario !== v.confirmar) { setMsg("Las contraseñas no coinciden"); setOpen(true); return; }
    try { await mutateAsync({ correo_usuario: correo, contrasena_usuario: v.contrasena_usuario, codigo }); navigate("/login"); }
    catch (e:any) { setMsg(e?.message || "No se pudo cambiar la contraseña"); setOpen(true); }
  }

  return (
    <>
      <AuthLayout
        title="Actualiza tu contraseña"
        subtitle="Ingresa y confirma tu nueva contraseña para continuar gestionando tus cultivos de manera segura."
        logoSlot={<AuthLogo/>}
        backSlot={<AuthBackButton/>}
        formTitle="Actualizar contraseña"
      >
        <AuthChangePasswordForm onSubmit={handleSubmit} loading={isPending}/>
      </AuthLayout>

      <ToastDialog open={open} title="Cambio de contraseña" message={msg} onClose={() => setOpen(false)} />
    </>
  );
}
