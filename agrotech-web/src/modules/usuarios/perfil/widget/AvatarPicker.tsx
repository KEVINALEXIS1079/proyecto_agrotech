import { useRef, useState, useEffect } from "react";
import { Avatar, Button, Tooltip } from "@heroui/react";
import { Camera } from "lucide-react";

export default function AvatarPicker({
  src,
  onPick,
}: {
  src?: string | null;
  onPick: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(src ?? null);
  const last = useRef<string | null>(null);

  useEffect(() => setPreview(src ?? null), [src]);
  useEffect(() => () => { if (last.current) URL.revokeObjectURL(last.current); }, []);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (last.current) URL.revokeObjectURL(last.current);
    last.current = url;
    setPreview(url);
    onPick(f);
  };

  return (
    <div className="relative">
      <Avatar src={preview || ""} className="w-24 h-24 text-large" radius="lg" />
      <Tooltip content="Cambiar avatar">
        <Button
          isIconOnly size="sm"
          className="absolute -bottom-2 -right-2"
          onPress={() => fileRef.current?.click()}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </Tooltip>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePick}
      />
    </div>
  );
}
