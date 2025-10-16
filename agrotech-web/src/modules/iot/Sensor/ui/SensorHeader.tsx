import { Cpu } from "lucide-react";

interface Props {
  title: string;
}

export function SensorHeader({ title }: Props) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <Cpu className="h-6 w-6 text-green-600" />
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );
}
