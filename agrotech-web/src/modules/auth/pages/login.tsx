import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthLoginForm, { type AuthLoginValues } from "../ui/AuthLoginForm";
import { useLogin } from "../hooks/useLogin";

const BYPASS = import.meta.env.VITE_BYPASS_AUTH === "true";

export default function LoginPage() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState(""); const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useLogin();

  async function handleSubmit(v: AuthLoginValues) {
    if (!v.correo || !v.password) { setMsg("Completa correo y contraseña"); setOpen(true); return; }
    if (BYPASS) { localStorage.setItem("token", "bypass"); navigate("/home"); return; }
    try { await mutateAsync({ correo: v.correo, password: v.password }); navigate("/home"); }
    catch (e:any) { setMsg(e?.message || "No se pudo iniciar sesión"); setOpen(true); }
  }

  return (
    <>
      <AuthLayout

        title="Bienvenido"
        subtitle="Conéctate de nuevo con tus cultivos"
        logoSlot={<AuthLogo/>}
        backSlot={<AuthBackButton/>}
        formTitle="Inicia sesión"
      >
        <AuthLoginForm
          onSubmit={handleSubmit}
          loading={isPending}
          footerSlot={<Link to="/recover" className="text-primary text-sm">¿Olvidaste tu contraseña?</Link>}
        />
        <p className="text-center text-sm mt-3">
          ¿No tienes cuenta? <Link to="/register" className="text-primary">Regístrate</Link>
        </p>
      </AuthLayout>

      <ToastDialog open={open} title="Inicio de sesión" message={msg} onClose={() => setOpen(false)} />
    </>
  );
}
