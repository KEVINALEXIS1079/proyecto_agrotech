import { useState } from "react";
import { Input, Button } from "@heroui/react";
export type AuthRecoverValues = { correo_usuario: string };
export default function AuthRecoverForm({ onSubmit, loading }: { onSubmit: (v: AuthRecoverValues) => void; loading?: boolean }) {
  const [correo, setCorreo] = useState("");
  return (
    <form className="grid gap-3" onSubmit={(e)=>{ e.preventDefault(); onSubmit({ correo_usuario: correo }); }}>
      <Input label="Correo electrónico" type="email" value={correo} onValueChange={setCorreo} radius="lg" required/>
      <Button type="submit" color="success" className="w-full rounded-full" isLoading={loading}>Verificar</Button>
    </form>
  );
}
