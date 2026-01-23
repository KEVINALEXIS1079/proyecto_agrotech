import { Chip } from "@heroui/react";
import { Check } from "lucide-react";
export default function PermisoChip({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void; }) {
  return (
    <Chip variant={checked ? "solid" : "flat"} color={checked ? "success" : "default"}
      onClick={onToggle} className="cursor-pointer select-none"
      startContent={checked ? <Check className="h-3 w-3" /> : undefined}>
      {label}
    </Chip>
  );
}
