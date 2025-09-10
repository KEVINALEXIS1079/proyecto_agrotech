import { Input, Checkbox, Button, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../services/users";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const hasToken = localStorage.getItem("token") || import.meta.env.VITE_ADMIN_TOKEN;
    
if (!hasToken) {
  setError("Inicia sesión como administrador para poder registrar usuarios.");
  setLoading(false);
  return;
}

    try {
      const fd = new FormData(e.currentTarget);
      const cedula_usuario = (fd.get("cedula_usuario") as string)?.trim();
      const nombre_usuario = (fd.get("nombre_usuario") as string)?.trim();
      const apellido_usuario = (fd.get("apellido_usuario") as string)?.trim();
      const correo_usuario = (fd.get("correo_usuario") as string)?.trim();
      const telefono_usuario = (fd.get("telefono_usuario") as string)?.trim();
      const contrasena_usuario = (fd.get("contrasena_usuario") as string) || "";
      const confirmar = (fd.get("confirmar_contrasena") as string) || "";

      if (contrasena_usuario !== confirmar) {
        setError("Las contraseñas no coinciden");
        return;
      }

      await registerUser({
        cedula_usuario,
        nombre_usuario,
        apellido_usuario,
        telefono_usuario,
        correo_usuario,
        contrasena_usuario,
        estado_usuario: "activo", // por defecto
        id_rol_fk: 1,             // por defecto
      });

      // Registro OK → envía al login
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "No se pudo registrar";
      setError(typeof msg === "string" ? msg : "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh overflow-hidden grid md:grid-cols-[50%_50%] bg-white">
      <div className="relative hidden md:block">
        <img
          src="/public/cacao.jpg"
          alt="Cacao"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="pl-[72px] lg:pl-[96px] text-white max-w-[560px]">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Crea tu cuenta
            </h1>
            <p className="text-xl lg:text-2xl opacity-95 mt-2">
              Empieza a gestionar tus cultivos
            </p>
          </div>
        </div>
      </div>
      <div className="h-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[480px]">
          <div className="grid grid-cols-[32px_1fr_32px] items-center mb-2">
            <button
              type="button"
              aria-label="Volver"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5"
              onClick={() => history.back()}
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

          <h2 className="text-2xl font-extrabold mb-3">Registro</h2>

          <form className="grid gap-2.5" onSubmit={handleSubmit}>
            <Input label="Número de documento" size="sm" name="cedula_usuario" />
            <Input label="Nombre" size="sm" name="nombre_usuario" />
            <Input label="Apellido" size="sm" name="apellido_usuario" />
            <Input label="Correo electrónico" type="email" size="sm" name="correo_usuario" />
            <Input label="Teléfono" type="tel" size="sm" name="telefono_usuario" />
            <Input label="Contraseña" type="password" size="sm" name="contrasena_usuario" />
            <Input label="Confirmar contraseña" type="password" size="sm" name="confirmar_contrasena" />

            <Checkbox size="sm" className="mt-1" name="acepta_terminos">
              Acepto términos y condiciones
            </Checkbox>

            <Button
              color="success"
              className="w-full h-10 rounded-full"
              type="submit"
              isLoading={loading}
            >
              Registrarse
            </Button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

          <p className="text-center text-foreground-500 mt-3">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" color="primary" underline="hover">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
