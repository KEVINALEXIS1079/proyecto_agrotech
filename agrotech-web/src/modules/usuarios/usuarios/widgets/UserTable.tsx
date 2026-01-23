// src/modules/usuarios/widgets/UserTable.tsx
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import type { UsuarioLite } from "../api/usuario";

export default function UserTable({
  items,
  onView,
}: {
  items: UsuarioLite[];
  onView: (u: UsuarioLite) => void;
}) {
  return (
    <Table aria-label="usuarios" removeWrapper className="[&_[data-slot=td]]:py-2 [&_[data-slot=tr]]:hover:bg-success/10">
      <TableHeader>
        <TableColumn>Usuario</TableColumn>
        <TableColumn>Rol</TableColumn>
        <TableColumn>Ficha</TableColumn>
        <TableColumn>Estado</TableColumn>
        <TableColumn className="text-right">Acciones</TableColumn>
      </TableHeader>

      <TableBody emptyContent="Sin resultados">
        {items.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{u.nombre} {u.apellido}</span>
                <span className="text-xs opacity-60">{u.cedula}</span>
              </div>
            </TableCell>
            <TableCell>{u.rol?.nombre ?? "—"}</TableCell>
            <TableCell>{u.idFicha ?? "—"}</TableCell>
            <TableCell>
              <Chip
                size="sm"
                color={u.estado === "activo" ? "success" : u.estado === "inactivo" ? "warning" : "default"}
                variant="flat"
              >
                {u.estado}
              </Chip>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <Button size="sm" variant="flat" color="success" onPress={() => onView(u)}>Ver</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
