import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, XCircle, Clock, CalendarCheck, Building2 } from "lucide-react";
import BookingRequestCard from "@/components/owner/BookingRequestCard";
import MyCourtsManager from "@/components/owner/MyCourtsManager";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  HISTORY_STATUSES,
} from "@/constants";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all bookings for courts owned by this user
  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ["owner-bookings", user?.email],
    queryFn: () =>
      base44.entities.Booking.filter({ owner_email: user?.email }, "-created_date"),
    enabled: !!user?.email,
    refetchInterval: 30000, // auto-refresh every 30s
  });

  // NOTA: el vencimiento automático de reservas ya NO depende de que este
  // panel esté abierto. Ahora lo hace la función de backend
  // `base44/functions/expireBookings`, programada como cron cada 15 min.
  // Antes, este efecto disparaba una mutación por cada reserva vencida en
  // cada render (podía re-ejecutarse en bucle); se retiró por completo.

  const pending = allBookings.filter((b) => b.status === "pendiente_aprobacion");
  const approved = allBookings.filter((b) => b.status === "aprobada");
  const confirmed = allBookings.filter((b) => b.status === "confirmada");
  const rejected = allBookings.filter((b) => b.status === "rechazada" || b.status === "expirada" || b.status === "cancelada");



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">Panel de dueño</h1>
          <p className="text-muted-foreground mt-1">Gestioná las reservas de tus canchas</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <Bell className="w-5 h-5 text-yellow-600 animate-bounce" />
            <span className="font-medium text-yellow-800 text-sm">
              {pending.length} solicitud{pending.length > 1 ? "es" : ""} pendiente{pending.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Pendientes", value: pending.length, icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
          { label: "Aprobadas", value: approved.length, icon: CheckCircle2, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Confirmadas", value: confirmed.length, icon: CalendarCheck, color: "text-primary bg-accent border-accent" },
          { label: "Rechazadas/Exp.", value: rejected.length, icon: XCircle, color: "text-muted-foreground bg-muted border-border" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className={`border ${color}`}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              <Icon className="w-5 h-5" />
              <p className="font-heading font-bold text-2xl">{value}</p>
              <p className="text-xs font-medium">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="courts" className="flex-1 sm:flex-none gap-2">
              <Building2 className="w-4 h-4" />
              Mis Canchas
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none gap-2">
              <Clock className="w-4 h-4" />
              Pendientes
              {pending.length > 0 && (
                <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5 min-w-[1.25rem]">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex-1 sm:flex-none gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Aprobadas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none gap-2">
              <CalendarCheck className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* MY COURTS TAB */}
          <TabsContent value="courts">
            <MyCourtsManager user={user} onUserUpdate={() => queryClient.invalidateQueries({ queryKey: ["owner-bookings"] })} />
          </TabsContent>

          {/* PENDING TAB */}
          <TabsContent value="pending">
            {pending.length === 0 ? (
              <div className="text-center py-20">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground font-medium">No hay solicitudes pendientes</p>
                <p className="text-muted-foreground text-sm mt-1">Cuando llegue una reserva nueva, aparecerá acá.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <BookingRequestCard booking={booking} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* APPROVED TAB */}
          <TabsContent value="approved">
            {approved.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No hay reservas aprobadas con pago pendiente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approved.map((booking, i) => (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border border-blue-200">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-heading font-semibold">{booking.court_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.player_name} — {booking.date} a las {booking.time_slot} hs
                            </p>
                            <p className="text-sm">
                              Pagado: <span className="text-primary font-semibold">${booking.deposit_amount?.toLocaleString()}</span>
                              {" / "}
                              Pendiente: <span className="text-destructive font-semibold">${booking.remaining_amount?.toLocaleString()}</span>
                            </p>
                            {booking.payment_deadline && (
                              <p className="text-xs text-destructive">
                                ⏰ Vence: {format(new Date(booking.payment_deadline), "dd/MM HH:mm", { locale: es })} hs
                              </p>
                            )}
                          </div>
                          <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            {[...allBookings.filter(b => HISTORY_STATUSES.includes(b.status))].length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No hay historial de reservas todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allBookings.filter(b => HISTORY_STATUSES.includes(b.status)).map((booking, i) => (
                  <motion.div key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{booking.court_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.player_name} — {booking.date} {booking.time_slot} hs
                            </p>
                          </div>
                          <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                            {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}