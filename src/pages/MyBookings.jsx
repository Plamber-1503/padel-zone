import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, X, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { shouldRefundOnCancel } from "@/services/bookingService";
import ReviewModal from "@/components/courts/ReviewModal";
import {
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  CANCELLABLE_STATUSES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "@/constants";



export default function MyBookings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewBooking, setReviewBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: () => base44.entities.Booking.filter({ player_email: user?.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const cancelMutation = useMutation({
    mutationFn: async (booking) => {
      const refunds = shouldRefundOnCancel(booking);
      await base44.entities.Booking.update(booking.id, {
        status: "cancelada",
        // NOTA: esto sólo registra la intención de reembolso. El reembolso real
        // de dinero tiene que dispararse contra la API de Mercado Pago una vez
        // que exista integración real de pagos (ver bookingService.js).
        payment_status: refunds ? "reembolsado" : booking.payment_status,
      });

      // Avisar al dueño de la cancha: antes esto no pasaba y el dueño se
      // enteraba de la cancelación recién al entrar al panel.
      if (booking.owner_email) {
        await base44.integrations.Core.SendEmail({
          to: booking.owner_email,
          subject: `❌ Reserva cancelada - ${booking.court_name}`,
          body: `
            <h2>Un jugador canceló una reserva</h2>
            <p><strong>Jugador:</strong> ${booking.player_name || booking.player_email}</p>
            <p><strong>Cancha:</strong> ${booking.court_name}</p>
            <p><strong>Fecha:</strong> ${booking.date} a las ${booking.time_slot} hs</p>
            ${refunds ? "<p>El jugador había pagado depósito o total — coordinar el reembolso correspondiente.</p>" : "<p>No había pago registrado para esta reserva.</p>"}
          `,
        }).catch(() => {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Reserva cancelada");
    },
    onError: () => {
      toast.error("No pudimos cancelar la reserva. Probá de nuevo.");
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold">Mis reservas</h1>
      <p className="text-muted-foreground mt-1 mb-8">Historial de todas tus reservas</p>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No tenés reservas todavía.
          </div>
        ) : (
          bookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{booking.court_name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {booking.date ? format(new Date(booking.date + "T12:00:00"), "dd MMM yyyy", { locale: es }) : "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.time_slot} hs
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge className={BOOKING_STATUS_COLORS[booking.status] || "bg-muted text-muted-foreground"}>
                          {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                        </Badge>
                        <Badge className={PAYMENT_STATUS_COLORS[booking.payment_status] || "bg-muted text-muted-foreground"}>
                          {PAYMENT_STATUS_LABELS[booking.payment_status] || booking.payment_status}
                        </Badge>
                      </div>
                      {booking.status === "aprobada" && booking.remaining_amount > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          Saldo pendiente: ${booking.remaining_amount?.toLocaleString()}
                          {booking.payment_deadline && (
                            <span> · vence {format(new Date(booking.payment_deadline), "dd/MM HH:mm")} hs</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-lg text-primary">
                        ${booking.total_price?.toLocaleString()}
                      </p>
                      {(CANCELLABLE_STATUSES.includes(booking.status)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive mt-2"
                          onClick={() => cancelMutation.mutate(booking)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      {booking.status === BOOKING_STATUS.CONFIRMED && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 ml-2 rounded-xl"
                          onClick={() => setReviewBooking(booking)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Calificar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <ReviewModal
        open={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
      />
    </div>
  );
}