import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthCodeForm, {type AuthCodeValues } from "../ui/AuthCodeForm";
import { useRecoverVerify } from "../hooks/useRecover";

export default function CodePage() {
  const location = useLocation() as any;
  const correo = location?.state?.correo || "";
  const [msg, setMsg] = useState(""); const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRecoverVerify();
  const navigate = useNavigate();

  async function handleSubmit(v: AuthCodeValues) {
    if (!correo || !v.codigo) { setMsg("Campos incompletos"); setOpen(true); return; }
    try { await mutateAsync({ correo_usuario: correo, codigo: v.codigo }); navigate("/change-password", { state: { correo, codigo: v.codigo } }); }
    catch (e:any) { setMsg(e?.message || "No se pudo verificar el código"); setOpen(true); }
  }

  return (
    <>
      <AuthLayout

        title="Actualiza tu contraseña"
        subtitle="Ingresa y confirma tu nueva contraseña para continuar gestionando tus cultivos de manera segura."
        logoSlot={<AuthLogo/>}
        backSlot={<AuthBackButton/>}
        formTitle="Código de verificación"
      >
        <AuthCodeForm onSubmit={handleSubmit} loading={isPending}/>
      </AuthLayout>

      <ToastDialog open={open} title="Verificación" message={msg} onClose={() => setOpen(false)} variant="warning"/>
    </>
  );
}
