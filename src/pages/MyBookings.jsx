import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, X, AlertCircle } from "lucide-react";
import { format as formatDate } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors = {
  pendiente_aprobacion: "bg-yellow-100 text-yellow-800 border-yellow-200",
  aprobada: "bg-blue-100 text-blue-800 border-blue-200",
  confirmada: "bg-accent text-accent-foreground border-accent",
  rechazada: "bg-destructive/10 text-destructive border-destructive/20",
  expirada: "bg-muted text-muted-foreground border-border",
  cancelada: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  pendiente_aprobacion: "Pendiente aprobación",
  aprobada: "Aprobada — pago pendiente",
  confirmada: "Confirmada",
  rechazada: "Rechazada",
  expirada: "Expirada",
  cancelada: "Cancelada",
};

const paymentColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  deposito_pagado: "bg-blue-100 text-blue-800",
  pagado_total: "bg-accent text-accent-foreground",
  reembolsado: "bg-muted text-muted-foreground",
};

const paymentLabels = {
  pendiente: "Sin pago",
  deposito_pagado: "Depósito pagado (30%)",
  pagado_total: "Pagado total",
  reembolsado: "Reembolsado",
};

export default function MyBookings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: () => base44.entities.Booking.filter({ player_email: user?.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Booking.update(id, { status: "cancelada" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Reserva cancelada");
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
                        <Badge className={statusColors[booking.status] || "bg-muted text-muted-foreground"}>
                          {statusLabels[booking.status] || booking.status}
                        </Badge>
                        <Badge className={paymentColors[booking.payment_status] || "bg-muted text-muted-foreground"}>
                          {paymentLabels[booking.payment_status] || booking.payment_status}
                        </Badge>
                      </div>
                      {booking.status === "aprobada" && booking.remaining_amount > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          Saldo pendiente: ${booking.remaining_amount?.toLocaleString()}
                          {booking.payment_deadline && (
                            <span> · vence {formatDate(new Date(booking.payment_deadline), "dd/MM HH:mm")} hs</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-lg text-primary">
                        ${booking.total_price?.toLocaleString()}
                      </p>
                      {(booking.status === "confirmada" || booking.status === "aprobada" || booking.status === "pendiente_aprobacion") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive mt-2"
                          onClick={() => cancelMutation.mutate(booking.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
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
    </div>
  );
}