import {
  Input,
  Checkbox,
  Button,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginService } from "#/modules/auth/api/auth";

const BYPASS = import.meta.env.VITE_BYPASS_AUTH === "true";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false); // 👈 controla el modal
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setShowError(false);
    setLoading(true);

    try {
      const fd = new FormData(e.currentTarget);
      const correo = fd.get("correo") as string;
      const password = fd.get("password") as string;

      try {
        const token = await loginService(correo, password);
        localStorage.setItem("token", token);
  

        navigate("/home");
        return;
      } catch (err: any) {
        if (BYPASS && err?.response?.status === 400) {
          localStorage.setItem("token", "dev-fake-token");
          navigate("/home");
          return;
        }
        throw err; 
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo iniciar sesión";
      const text = typeof msg === "string" ? msg : "Correo o contraseña incorrectos";
      setError(text);
      setShowError(true); // 👈 abre el modal
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh overflow-hidden grid md:grid-cols-[50%_50%] bg-white">
      <div className="relative hidden md:block">
        <img src="/public/cacao.jpg" alt="Cacao" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="pl-[72px] lg:pl-[96px] text-white max-w-[560px]">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">Bienvenido</h1>
            <p className="text-xl lg:text-2xl opacity-95 mt-2">Conéctate de nuevo con tus cultivos</p>
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

          <h2 className="text-2xl font-extrabold mb-3">Inicia sesión</h2>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <Input label="Correo electrónico" name="correo" type="email" size="sm" required />
            <Input label="Contraseña" name="password" type="password" size="sm" required />

            <div className="flex items-center justify-between -mt-1">
              <Checkbox size="sm">Recordarme</Checkbox>
              <Link href="/recover" size="sm" color="primary" underline="hover">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              color="success"
              className="w-full h-10 rounded-full"
              type="submit"
              isLoading={loading}
            >
              Entrar
            </Button>
          </form>

          {/* Modal de error */}
          <Modal isOpen={showError} onOpenChange={setShowError}>
            <ModalContent>
              <ModalHeader>Error de inicio de sesión</ModalHeader>
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

          <p className="text-center text-foreground-500 mt-3">
            ¿No tienes cuenta?{" "}
            <Link href="/register" color="primary" underline="hover">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
