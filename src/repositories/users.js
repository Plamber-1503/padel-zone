/**
 * users.js — UsersRepository
 *
 * Única fuente de verdad para la entidad User (no confundir con base44.auth).
 */
import { base44 } from "@/api/base44Client";

export const UsersRepository = {
  /** Lista usuarios con un límite razonable (para chat) */
  list: (limit = 200) =>
    base44.entities.User.list("-created_date", limit),

  /** Busca un usuario por email */
  getByEmail: async (email) => {
    const users = await base44.entities.User.filter({ email });
    return users[0] ?? null;
  },
};
