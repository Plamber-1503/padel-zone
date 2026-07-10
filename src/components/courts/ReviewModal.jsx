import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ReviewModal({ open, onClose, booking }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Evita reseñas duplicadas para la misma reserva.
  const { data: existing = [] } = useQuery({
    queryKey: ["review-for-booking", booking?.id],
    queryFn: () => base44.entities.Review.filter({ booking_id: booking.id }),
    enabled: !!booking?.id && open,
  });
  const alreadyReviewed = existing.length > 0;

  const submitReview = useMutation({
    mutationFn: () =>
      base44.entities.Review.create({
        court_id: booking.court_id,
        booking_id: booking.id,
        author_email: user?.email,
        author_name: user?.full_name || user?.email,
        rating,
        comment,
      }),
    onSuccess: () => {
      toast.success("¡Gracias por tu reseña!");
      queryClient.invalidateQueries({ queryKey: ["court-reviews", booking.court_id] });
      setRating(0);
      setComment("");
      onClose();
    },
    onError: () => toast.error("No pudimos guardar tu reseña. Probá de nuevo."),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Calificar {booking?.court_name}</DialogTitle>
        </DialogHeader>

        {alreadyReviewed ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Ya dejaste una reseña para esta reserva. ¡Gracias!
          </p>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      n <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contá cómo fue tu experiencia (opcional)"
              rows={3}
            />
            <Button
              className="w-full rounded-xl"
              disabled={rating === 0 || submitReview.isPending}
              onClick={() => submitReview.mutate()}
            >
              Enviar reseña
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
