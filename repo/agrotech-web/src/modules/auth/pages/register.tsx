
import { Input, Checkbox, Button, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUsuarioPublic } from "#/modules/auth/api/auth";
import type { UsuarioRegistroPublico } from "#/modules/auth/model/types";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData(e.currentTarget);

      const cedula_usuario = (fd.get("cedula_usuario") as string)?.trim() || "";
      const nombre_usuario = (fd.get("nombre_usuario") as string)?.trim() || "";
      const apellido_usuario = (fd.get("apellido_usuario") as string)?.trim() || "";
      const correo_usuario = (fd.get("correo_usuario") as string)?.trim() || "";
      const telefono_usuario = (fd.get("telefono_usuario") as string)?.trim() || "";
      const contrasena_usuario = (fd.get("contrasena_usuario") as string) || "";
      const confirmar = (fd.get("confirmar_contrasena") as string) || "";
      const imgVal = fd.get("img_usuario");
      const img_usuario = (imgVal instanceof File && imgVal.size > 0) ? imgVal : null;


      if (!cedula_usuario || !nombre_usuario || !apellido_usuario || !correo_usuario || !telefono_usuario) {
        setError("Completa todos los campos obligatorios.");
        setLoading(false);
        return;
      }

      if (contrasena_usuario !== confirmar) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }

      //  validar aceptación de terminos por si algo jaja
      // const acepta = fd.get("acepta_terminos");
      // if (!acepta) { setError("Debes aceptar los términos y condiciones."); setLoading(false); return; }

      const payload: UsuarioRegistroPublico = {
        cedula_usuario,
        nombre_usuario,
        apellido_usuario,
        correo_usuario,
        telefono_usuario,
        contrasena_usuario,
        img_usuario, // File | null
      };

      await createUsuarioPublic(fd);
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "No se pudo registrar";
      setError(typeof msg === "string" ? msg : "No se pudo registrar");
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
          <h2 className="text-2xl font-extrabold mb-3">Registro</h2>

          <form className="grid gap-2.5" onSubmit={handleSubmit}>
            <Input label="Número de documento" size="sm" name="cedula_usuario" required />
            <Input label="Nombre" size="sm" name="nombre_usuario" required />
            <Input label="Apellido" size="sm" name="apellido_usuario" required />
            <Input label="Correo electrónico" type="email" size="sm" name="correo_usuario" required />
            <Input label="Teléfono" type="tel" size="sm" name="telefono_usuario" required />
            <Input label="Contraseña" type="password" size="sm" name="contrasena_usuario" required />
            <Input label="Confirmar contraseña" type="password" size="sm" name="confirmar_contrasena" required />
            <Input label="Foto de perfil" type="file" size="sm" name="img_usuario" />

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

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

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
