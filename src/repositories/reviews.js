/**
 * reviews.js — ReviewsRepository
 */
import { base44 } from "@/api/base44Client";

export const ReviewsRepository = {
  /** Reviews de una cancha */
  getByCourt: (courtId) =>
    base44.entities.Review.filter({ court_id: courtId }, "-created_date"),

  /** Verifica si ya existe una review para una reserva (evita duplicados) */
  getByBooking: (bookingId) =>
    base44.entities.Review.filter({ booking_id: bookingId }),

  /** Crea una review */
  create: (data) => base44.entities.Review.create(data),
};
