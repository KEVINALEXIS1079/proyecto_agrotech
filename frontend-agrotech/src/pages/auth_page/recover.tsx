import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { solicitarRecuperacion } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const e1 = email.trim().toLowerCase();
    const e2 = confirmEmail.trim().toLowerCase();
    const same = e1 === e2;
    setMismatch(!same);
    if (!same) return;

    try {
      setLoading(true);
      await solicitarRecuperacion(e1); // POST /usuarios/solicitar-recuperacion

      // guarda para que Code lo encuentre aunque se pierda el state
      localStorage.setItem("recoveryEmail", e1);
      navigate("/code", { state: { email: e1 } });
    } catch (err: any) {
      setError(err?.message || "No se pudo solicitar la recuperación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-dvh overflow-hidden grid md:grid-cols-[50%_50%] bg-white">
      <div className="relative hidden md:block">
        <img src="/public/cacao.jpg" alt="Cacao" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="pl-[72px] lg:pl-[96px] text-white max-w-[560px]">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">Recupera tu acceso</h1>
            <p className="text-xl lg:text-2xl opacity-95 mt-2">
              Escribe tu correo y te enviaremos un código para restablecer tu contraseña.
            </p>
          </div>
        </div>
      </div>

      <div className="h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[420px]">
          <div className="grid grid-cols-[32px_1fr_32px] items-center mb-2">
            <button
              type="button"
              aria-label="Volver"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5"
              onClick={() => history.back()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex justify-center">
              <img src="/LogoTic.png" alt="TIC Yamboró" className="h-12 md:h-16 lg:h-20 w-auto object-contain" />
            </div>
            <div />
          </div>

          <h2 className="text-2xl font-extrabold mb-3 text-center">Verificación</h2>

          <form className="grid gap-3" onSubmit={onSubmit}>
            <Input
              label="Correo electrónico"
              type="email"
              size="sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Confirmar correo electrónico"
              type="email"
              size="sm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              isInvalid={mismatch}
              errorMessage={mismatch ? "Los correos no coinciden" : undefined}
              required
            />

            <Button color="success" className="w-full h-10 rounded-full" type="submit" isLoading={loading}>
              Verificar
            </Button>
          </form>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
