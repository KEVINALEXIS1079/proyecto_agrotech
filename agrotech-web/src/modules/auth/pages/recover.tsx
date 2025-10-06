import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthRecoverForm, { type AuthRecoverValues } from "../ui/AuthRecoverForm";
import { useRecoverRequest } from "../hooks/useRecover";

export default function RecoverPage() {
  const [msg, setMsg] = useState(""); const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRecoverRequest();
  const navigate = useNavigate();

  async function handleSubmit(v: AuthRecoverValues) {
    if (!v.correo_usuario) { setMsg("El correo es obligatorio"); setOpen(true); return; }
    try { await mutateAsync({ correo_usuario: v.correo_usuario }); navigate("/code", { state: { correo: v.correo_usuario } }); }
    catch (e:any) { setMsg(e?.message || "No se pudo enviar el código"); setOpen(true); }
  }

  return (
    <>
      <AuthLayout
        
        title="Recuperar tu acceso"
        subtitle="Escribe tu correo y te enviaremos un enlace para restablecer tu contraseña."
        logoSlot={<AuthLogo/>}
        backSlot={<AuthBackButton/>}
        formTitle="Verificación"
      >
        <AuthRecoverForm onSubmit={handleSubmit} loading={isPending}/>
      </AuthLayout>

      <ToastDialog open={open} title="Recuperación" message={msg} onClose={() => setOpen(false)} variant="warning"/>
    </>
  );
}
