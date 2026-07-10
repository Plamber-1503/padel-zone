import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Muestra el promedio de calificación de una cancha en base a la entidad
 * Review. Antes no existía ningún sistema de reseñas en el proyecto — esto
 * cierra uno de los gaps comerciales más importantes de un marketplace de
 * reservas (los jugadores eligen cancha en base a reputación).
 */
export default function CourtRating({ courtId, size = "sm" }) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["court-reviews", courtId],
    queryFn: () => base44.entities.Review.filter({ court_id: courtId }, "-created_date", 200),
    enabled: !!courtId,
  });

  if (isLoading) return null;
  if (reviews.length === 0) {
    return <span className="text-xs text-muted-foreground">Sin reseñas todavía</span>;
  }

  const average = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  const starSize = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              starSize,
              n <= Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {average.toFixed(1)} ({reviews.length})
      </span>
    </div>
  );
}
