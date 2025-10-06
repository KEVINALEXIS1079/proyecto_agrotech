import type { UserDTO, User } from "./types";

export function mapUserDTO(dto: UserDTO): User {
  return {
    id: dto.id_usuario_pk,
    firstName: dto.nombre_usuario,
    lastName: dto.apellido_usuario,
    phone: dto.telefono_usuario,
    email: dto.correo_usuario,
    role: dto.rol?.nombre_rol ?? "",
    avatarUrl: dto.img_usuario ?? null,
    status: dto.estado_usuario,
    permissions: (dto.rol?.rolesPermisos ?? []).map(rp => rp.permiso.nombre_permiso),
    language: "es",
    theme: "system",
    notifications: { email: true, push: true, sms: false, weeklySummary: true },
    location: null,
    bio: null,
  };
}
