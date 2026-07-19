/**
 * query-keys.js
 *
 * Fuente de verdad para todos los queryKey de React Query.
 *
 * PROBLEMA que resuelve: antes los keys eran strings literales dispersos en
 * cada página. Si un key cambia o se escribe diferente, los `invalidateQueries`
 * no encuentran la query correcta y el cache se desincroniza silenciosamente.
 *
 * USO:
 *   import { QUERY_KEYS } from "@/lib/query-keys";
 *
 *   useQuery({ queryKey: QUERY_KEYS.courts.all, ... })
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courts.all })
 */

export const QUERY_KEYS = {
  courts: {
    /** Todas las canchas activas */
    all: ["courts"],
    /** Canchas de un dueño específico */
    byOwner: (email) => ["courts", "owner", email],
    /** Detalle de una cancha por id */
    detail: (id) => ["courts", id],
  },

  bookings: {
    /** Reservas del jugador autenticado */
    mine: (email) => ["bookings", "mine", email],
    /** Reservas recibidas por un dueño */
    forOwner: (email) => ["bookings", "owner", email],
    /** Reservas de una cancha en una fecha (para verificar disponibilidad) */
    forCourt: (courtId, date) => ["bookings", "court", courtId, date],
  },

  users: {
    /** Lista general de usuarios (para chat) */
    all: ["users"],
    /** Datos de un usuario por email */
    byEmail: (email) => ["users", email],
  },

  social: {
    /** Feed global de posts */
    posts: ["posts"],
    /** Posts de un autor específico */
    byAuthor: (email) => ["posts", "author", email],
    /** Followers de un usuario */
    followers: (email) => ["follows", "followers", email],
    /** Usuarios que sigue un usuario */
    following: (email) => ["follows", "following", email],
  },

  chat: {
    /** Mensajes de una conversación entre dos usuarios */
    messages: (userEmail, otherEmail) => ["chat", "messages", userEmail, otherEmail],
  },

  reviews: {
    /** Reviews de una cancha */
    byCourt: (courtId) => ["reviews", "court", courtId],
    /** Review de una reserva específica (para evitar duplicados) */
    forBooking: (bookingId) => ["reviews", "booking", bookingId],
  },
};
