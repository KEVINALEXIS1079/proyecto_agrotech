import { useState } from "react";
import { Input, Button } from "@heroui/react";
export type AuthCodeValues = { codigo: string };
export default function AuthCodeForm({ onSubmit, loading }: { onSubmit: (v: AuthCodeValues) => void; loading?: boolean }) {
  const [codigo, setCodigo] = useState("");
  return (
    <form className="grid gap-3" onSubmit={(e)=>{ e.preventDefault(); onSubmit({ codigo }); }}>
      <Input label="Código de verificación" value={codigo} onValueChange={setCodigo} radius="lg" required/>
      <Button type="submit" color="success" className="w-full rounded-full" isLoading={loading}>Verificar</Button>
    </form>
  );
}
