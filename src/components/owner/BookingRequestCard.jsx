import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, User, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function BookingRequestCard({ booking }) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () =>
      base44.entities.Booking.update(booking.id, { status: "aprobada" }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["owner-bookings"] });
      toast.success("Reserva aprobada");
      await base44.integrations.Core.SendEmail({
        to: booking.player_email,
        subject: `✅ Reserva aprobada - ${booking.court_name}`,
        body: `
          <h2>¡Tu reserva fue aprobada!</h2>
          <p><strong>Cancha:</strong> ${booking.court_name}</p>
          <p><strong>Fecha:</strong> ${booking.date}</p>
          <p><strong>Horario:</strong> ${booking.time_slot} hs</p>
          <p><strong>Total:</strong> $${booking.total_price?.toLocaleString()}</p>
          <p><strong>Ya pagaste:</strong> $${booking.deposit_amount?.toLocaleString()} (30%)</p>
          <p><strong>Saldo pendiente:</strong> $${booking.remaining_amount?.toLocaleString()}</p>
          <p>⚠️ Recordá abonar el saldo restante hasta 2 hs antes del turno para no perder la reserva.</p>
        `,
      }).catch(() => {});
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      base44.entities.Booking.update(booking.id, { status: "rechazada" }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["owner-bookings"] });
      toast.success("Reserva rechazada");
      await base44.integrations.Core.SendEmail({
        to: booking.player_email,
        subject: `❌ Reserva no disponible - ${booking.court_name}`,
        body: `
          <h2>Tu solicitud de reserva no pudo ser confirmada</h2>
          <p><strong>Cancha:</strong> ${booking.court_name}</p>
          <p><strong>Fecha:</strong> ${booking.date}</p>
          <p><strong>Horario:</strong> ${booking.time_slot} hs</p>
          <p>Lamentablemente la cancha no está disponible para ese horario. Por favor, intentá reservar otro turno.</p>
        `,
      }).catch(() => {});
    },
  });

  const isLoading = approveMutation.isPending || rejectMutation.isPending;
  const depositPct = booking.deposit_amount && booking.total_price
    ? Math.round((booking.deposit_amount / booking.total_price) * 100)
    : 30;

  return (
    <Card className="border border-border hover:border-primary/20 transition-colors">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-semibold text-lg">{booking.court_name}</h3>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pendiente aprobación
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {booking.player_name || booking.player_email}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {booking.date
                  ? format(new Date(booking.date + "T12:00:00"), "dd MMM yyyy", { locale: es })
                  : "—"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.time_slot} hs
              </span>
            </div>

            <div className="rounded-xl bg-muted/50 p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total reserva</span>
                <span className="font-semibold">${booking.total_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Depósito pagado ({depositPct}%)
                </span>
                <span className="font-semibold text-primary">${booking.deposit_amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo pendiente</span>
                <span className="font-semibold">${booking.remaining_amount?.toLocaleString()}</span>
              </div>
              {booking.payment_deadline && (
                <div className="flex justify-between pt-1 border-t border-border">
                  <span className="text-muted-foreground text-xs">Vence pago final</span>
                  <span className="text-xs font-medium text-destructive">
                    {format(new Date(booking.payment_deadline), "dd/MM HH:mm", { locale: es })} hs
                  </span>
                </div>
              )}
            </div>

            {booking.notes && (
              <p className="text-sm text-muted-foreground italic">📝 {booking.notes}</p>
            )}
          </div>

          <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 gap-2"
            >
              {approveMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Aprobar
            </Button>
            <Button
              variant="outline"
              onClick={() => rejectMutation.mutate()}
              disabled={isLoading}
              className="flex-1 sm:flex-none border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
            >
              {rejectMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Rechazar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}