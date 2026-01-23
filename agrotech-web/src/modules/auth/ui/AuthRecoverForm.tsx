import { useState } from "react";
import { Input, Button } from "@heroui/react";
export type AuthRecoverValues = { email: string };
export default function AuthRecoverForm({ onSubmit, loading }: { onSubmit: (v: AuthRecoverValues) => void; loading?: boolean }) {
  const [email, setEmail] = useState("");
  return (
    <form className="grid gap-3" onSubmit={(e)=>{ e.preventDefault(); onSubmit({ email }); }}>
      <Input label="Correo electrónico" type="email" value={email} onValueChange={setEmail} radius="lg" required/>
      <Button type="submit" color="success" className="w-full rounded-full" isLoading={loading}>Verificar</Button>
    </form>
  );
}
