import { Input } from "@heroui/react";
import { useState, useEffect } from "react";
import PermisosChecklist from "./PermisosChecklist";
import AsyncButton from "../ui/AsyncButton";
import type { Permiso } from "../model/types";

type Props = {
  title: string;
  submitText: string;
  isLoading?: boolean;
  permisos: Permiso[] | undefined;
  onSubmit: (payload: { moduleId: number; roleId: number; userId: number; permisoIds: number[] }) => void;
};

export default function AssignCard({ title, submitText, isLoading, permisos, onSubmit }: Props) {
  const [moduleId, setModuleId] = useState<number>(1);
  const [roleId, setRoleId] = useState<number>(1);
  const [userId, setUserId] = useState<number>(1);
  const [permisoIds, setPermisoIds] = useState<string[]>([]);

  useEffect(() => setPermisoIds([]), [moduleId]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Módulo"
          type="number"
          value={String(moduleId)}
          onChange={(e) => setModuleId(Number(e.target.value))}
        />
        <Input
          label="Role ID"
          type="number"
          value={String(roleId)}
          onChange={(e) => setRoleId(Number(e.target.value))}
        />
        <Input
          label="User ID"
          type="number"
          value={String(userId)}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
      </div>

      <PermisosChecklist
        permisos={permisos ?? []}
        value={permisoIds}
        onChange={setPermisoIds}
      />

      <AsyncButton
        isLoading={isLoading}
        isDisabled={!permisoIds.length}
        onPress={() =>
          onSubmit({
            moduleId,
            roleId,
            userId,
            permisoIds: permisoIds.map((x) => Number(x)),
          })
        }
      >
        {submitText}
      </AsyncButton>
    </div>
  );
}
