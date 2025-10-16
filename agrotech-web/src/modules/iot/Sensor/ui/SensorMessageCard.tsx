import { Card } from "@heroui/react";

interface Props {
  mensaje: string;
}

export function SensorMessageCard({ mensaje }: Props) {
  if (!mensaje) return null;

  const isSuccess = mensaje.startsWith("");

  return (
    <Card
      className={`mt-6 border ${
        isSuccess ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
      }`}
    >
      <div className="p-3 text-center">
        <p
          className={`text-center font-medium ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}
        >
          {mensaje}
        </p>
      </div>
    </Card>
  );
}
