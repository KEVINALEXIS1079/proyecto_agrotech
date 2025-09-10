import { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { cambiarContrasena } from "../../services/auth";

export default function ChangePassword() {
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // email y codigo vienen de /code; fallback a localStorage si decides guardarlos ahí
  const email =
    (location.state as { email?: string } | null)?.email ||
    localStorage.getItem("recoveryEmail") ||
    "";
  const codigo =
    (location.state as { codigo?: string } | null)?.codigo ||
    localStorage.getItem("recoveryCode") ||
    "";

  // si no hay contexto, volvemos a recuperar
  useEffect(() => {
    if (!email || !codigo) {
      navigate("/recover", { replace: true });
    }
  }, [email, codigo, navigate]);

  const tooShort = pw.length > 0 && pw.length < 8;
  const mismatch = cpw.length > 0 && pw !== cpw;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    if (tooShort || mismatch || !pw || !cpw) return;
    if (!email || !codigo) {
      setErr("Falta el correo o el código de verificación.");
      return;
    }

    try {
      setLoading(true);
      await cambiarContrasena({
        email,
        codigo,
        nuevaContrasena: pw,
      });
      // opcional: limpiar posibles datos guardados
      localStorage.removeItem("recoveryEmail");
      localStorage.removeItem("recoveryCode");
      navigate("/login", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  const Eye = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
  const EyeOff = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18M10.6 10.6A3 3 0 0012 15a3 3 0 001.4-.37M9.88 4.09A12 12 0 0123 12c0 0-4 7-11 7a11.2 11.2 0 01-4.37-.9M6.2 6.2A11.6 11.6 0 001 12s4 7 11 7c1.7 0 3.28-.34 4.7-.95" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="h-dvh overflow-hidden grid md:grid-cols-[50%_50%] bg-white">
      {/* IZQUIERDA */}
      <div className="relative hidden md:block">
        <img src="/cacao.jpg" alt="Cacao" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="pl-[72px] lg:pl-[96px] text-white max-w-[560px]">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Actualiza tu contraseña
            </h1>
            <p className="text-xl lg:text-2xl opacity-95 mt-2">
              Ingresa y confirma tu nueva contraseña para continuar gestionando
              tus cultivos de manera segura.
            </p>
          </div>
        </div>
      </div>

      {/* DERECHA */}
      <div className="h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[420px]">
          {/* back + logo */}
          <div className="grid grid-cols-[32px_1fr_32px] items-center mb-2">
            <button
              type="button"
              aria-label="Volver"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5"
              onClick={() => history.back()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex justify-center">
              <img src="/LogoTic.png" alt="TIC Yamboró" className="h-14 md:h-16 w-auto object-contain" />
            </div>
            <div />
          </div>

          <h2 className="text-2xl font-extrabold mb-3 text-center">Actualizar contraseña</h2>

          <form className="grid gap-3" onSubmit={onSubmit}>
            <Input
              label="Nueva contraseña"
              type={show1 ? "text" : "password"}
              size="sm"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              isInvalid={pw.length > 0 && pw.length < 8}
              errorMessage={pw.length > 0 && pw.length < 8 ? "Mínimo 8 caracteres" : undefined}
              endContent={
                <button
                  type="button"
                  onClick={() => setShow1((v) => !v)}
                  className="text-foreground-500 hover:text-foreground"
                  aria-label={show1 ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {show1 ? EyeOff : Eye}
                </button>
              }
            />
            <Input
              label="Confirmar contraseña"
              type={show2 ? "text" : "password"}
              size="sm"
              value={cpw}
              onChange={(e) => setCpw(e.target.value)}
              isInvalid={cpw.length > 0 && pw !== cpw}
              errorMessage={cpw.length > 0 && pw !== cpw ? "Las contraseñas no coinciden" : undefined}
              endContent={
                <button
                  type="button"
                  onClick={() => setShow2((v) => !v)}
                  className="text-foreground-500 hover:text-foreground"
                  aria-label={show2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {show2 ? EyeOff : Eye}
                </button>
              }
            />

            {err && <p className="text-danger text-sm">{err}</p>}

            <Button
              color="success"
              className="w-full h-10 rounded-full"
              type="submit"
              isLoading={loading}
              isDisabled={!pw || !cpw || pw.length < 8 || pw !== cpw}
            >
              Guardar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
