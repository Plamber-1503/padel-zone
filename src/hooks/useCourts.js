/**
 * useCourts.js
 *
 * Hooks de React Query para la entidad Court.
 * Las páginas llaman a estos hooks — no al repositorio directamente.
 *
 * Beneficio: si dos páginas necesitan la misma data, usan el mismo hook
 * y React Query las deduplica automáticamente (solo una request en vuelo).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourtsRepository } from "@/repositories/courts";
import { QUERY_KEYS } from "@/lib/query-keys";

/** Todas las canchas activas */
export function useActiveCourts() {
  return useQuery({
    queryKey: QUERY_KEYS.courts.all,
    queryFn: () => CourtsRepository.getActive(),
  });
}

/** Canchas de un dueño específico */
export function useOwnerCourts(ownerEmail) {
  return useQuery({
    queryKey: QUERY_KEYS.courts.byOwner(ownerEmail),
    queryFn: () => CourtsRepository.getByOwner(ownerEmail),
    enabled: !!ownerEmail,
  });
}

/** Detalle de una cancha por id */
export function useCourtById(courtId) {
  return useQuery({
    queryKey: QUERY_KEYS.courts.detail(courtId),
    queryFn: () => CourtsRepository.getById(courtId),
    enabled: !!courtId,
  });
}

/** Mutación para crear o actualizar una cancha */
export function useSaveCourt({ ownerEmail, onSuccess } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      id ? CourtsRepository.update(id, data) : CourtsRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courts.all });
      if (ownerEmail) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.courts.byOwner(ownerEmail),
        });
      }
      onSuccess?.();
    },
  });
}
