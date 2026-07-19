/**
 * bookings.js — BookingsRepository
 *
 * Única fuente de verdad para todas las llamadas a la entidad Booking.
 */
import { base44 } from "@/api/base44Client";

export const BookingsRepository = {
  /** Reservas de un jugador (historial personal) */
  getByPlayer: (playerEmail, sort = "-created_date") =>
    base44.entities.Booking.filter({ player_email: playerEmail }, sort),

  /** Reservas recibidas por un dueño de cancha */
  getByOwner: (ownerEmail, sort = "-created_date") =>
    base44.entities.Booking.filter({ owner_email: ownerEmail }, sort),

  /**
   * Reservas confirmadas de una cancha en una fecha.
   * Usado para verificar disponibilidad de slots antes de mostrar el calendario.
   */
  getConfirmedForCourtOnDate: (courtId, date) =>
    base44.entities.Booking.filter({
      court_id: courtId,
      date,
      status: "confirmada",
    }),

  /**
   * Verifica si un slot específico está tomado justo antes de crear la reserva.
   * Retorna true si hay colisión (double-booking).
   */
  isSlotTaken: async (courtId, date, timeSlot) => {
    const clash = await base44.entities.Booking.filter({
      court_id: courtId,
      date,
      time_slot: timeSlot,
      status: "confirmada",
    });
    return clash.length > 0;
  },

  /** Crea una reserva nueva */
  create: (data) => base44.entities.Booking.create(data),

  /** Actualiza el estado u otros campos de una reserva existente */
  update: (id, data) => base44.entities.Booking.update(id, data),
};
