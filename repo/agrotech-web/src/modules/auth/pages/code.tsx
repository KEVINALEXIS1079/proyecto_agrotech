// src/pages/auth_page/code.tsx
import { useRef, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { verificarCodigo } from "#/modules/auth/api/auth";

export default function Code() {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false); // 👈 modal
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email =
    (location.state as { email?: string } | null)?.email ||
    localStorage.getItem("recoveryEmail") ||
    "";

  useEffect(() => {
    if (!email) {
      navigate("/recover", { replace: true });
    }
  }, [email, navigate]);

  const focusIndex = (i: number) => {
    const el = inputsRef.current[i];
    if (el) el.focus();
  };

  const onChange = (i: number, v: string) => {
    const val = v.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (showError) setShowError(false); // 👈 al escribir, cierra el modal si estaba abierto
    setError("");
    if (val && i < 5) focusIndex(i + 1);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const next = [...code];
      next[i - 1] = "";
      setCode(next);
      focusIndex(i - 1);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < 5) focusIndex(i + 1);
  };

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...code];
    for (let k = 0; k < 6 && i + k < 6; k++) next[i + k] = text[k] ?? "";
    setCode(next);
    const last = Math.min(i + text.length - 1, 5);
    focusIndex(last);
    if (showError) setShowError(false);
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.join("");

    if (value.length !== 6) {
      setError("Ingresa los 6 dígitos del código.");
      setShowError(true);
      return;
    }
    if (!email) {
      setError("Falta el correo. Regresa y solicita el código nuevamente.");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      await verificarCodigo(email, value);

      // Persistimos por si el usuario recarga o si el guard solo mira localStorage
      localStorage.setItem("recoveryEmail", email);
      localStorage.setItem("recoveryCode", value);

      // Ir al paso final (/recovery) pasando state también
      navigate("/change-password", { state: { email, codigo: value } });
    } catch (err: any) {
      setError(err?.message || "No se pudo verificar el código.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh overflow-hidden grid md:grid-cols-[50%_50%] bg-white">
      <div className="relative hidden md:block">
        {/* Si la imagen está en public/, usa la ruta sin /public */}
        <img src="/cacao.jpg" alt="Cacao" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="pl-[72px] lg:pl-[96px] text-white max-w-[560px]">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Actualiza tu contraseña
            </h1>
            <p className="text-xl lg:text-2xl opacity-95 mt-2">
              Ingresa el código que te enviamos al correo para continuar.
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
              onClick={() => navigate(-1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex justify-center">
              <img
                src="/LogoTic.png"
                alt="TIC Yamboró"
                className="h-12 md:h-16 lg:h-20 w-auto object-contain"
              />
            </div>
            <div />
          </div>

          <h2 className="text-2xl font-extrabold mb-4 text-center">Código de verificación</h2>

          <form onSubmit={submit} className="grid gap-4">
            <div className="flex items-center justify-between gap-2">
              {code.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  value={val}
                  onChange={(e) => onChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={(e) => onPaste(i, e)}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold
                             rounded-xl border border-default-200 bg-content1
                             focus:outline-none focus:ring-2 focus:ring-success"
                />
              ))}
            </div>

            <Button
              type="submit"
              color="success"
              className="w-full h-10 rounded-full"
              isLoading={loading}
            >
              Verificar
            </Button>
          </form>
        </div>
      </div>

      {/* Modal de error */}
      <Modal isOpen={showError} onOpenChange={setShowError}>
        <ModalContent>
          <ModalHeader>No se pudo verificar el código</ModalHeader>
          <ModalBody>
            <p>{error}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setShowError(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
