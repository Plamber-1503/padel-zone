/**
 * roles.js
 *
 * Roles de usuario de la plataforma.
 * Usado en RoleRoute, AppLayout y Profile para proteger rutas y mostrar opciones.
 */

export const ROLES = {
  PLAYER:      "player",
  COURT_OWNER: "court_owner",
  ADMIN:       "admin",
};

/** Roles que tienen acceso al panel de dueño */
export const OWNER_ROLES = [ROLES.COURT_OWNER, ROLES.ADMIN];
