/**
 * useBookings.js
 *
 * Hooks de React Query para la entidad Booking.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingsRepository } from "@/repositories/bookings";
import { QUERY_KEYS } from "@/lib/query-keys";

/** Reservas del jugador autenticado */
export function useMyBookings(playerEmail) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.mine(playerEmail),
    queryFn: () => BookingsRepository.getByPlayer(playerEmail),
    enabled: !!playerEmail,
  });
}

/** Slots ocupados de una cancha en una fecha (para el calendario de reserva) */
export function useBookedSlots(courtId, date) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.forCourt(courtId, date),
    queryFn: () => BookingsRepository.getConfirmedForCourtOnDate(courtId, date),
    enabled: !!courtId && !!date,
  });
}

/** Reservas recibidas por un dueño */
export function useOwnerBookings(ownerEmail) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.forOwner(ownerEmail),
    queryFn: () => BookingsRepository.getByOwner(ownerEmail),
    enabled: !!ownerEmail,
    refetchInterval: 30_000, // polling cada 30s para notificaciones de nuevas reservas
  });
}

/** Cancela una reserva del jugador */
export function useCancelBooking(playerEmail) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => BookingsRepository.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bookings.mine(playerEmail),
      });
    },
  });
}

/** Aprueba o rechaza una reserva (para dueños) */
export function useUpdateBookingStatus(ownerEmail) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => BookingsRepository.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bookings.forOwner(ownerEmail),
      });
    },
  });
}
