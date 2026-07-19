import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Clock, CreditCard } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PaymentQRModal from "@/components/payments/PaymentQRModal";
import { calculateAmounts, buildBookingPayload, PAYMENT_WINDOW_HOURS } from "@/services/bookingService";
import { TIME_SLOTS } from "@/constants";



export default function BookCourt() {
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("courtId");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  const { data: court } = useQuery({
    queryKey: ["court", courtId],
    queryFn: async () => {
      const courts = await base44.entities.Court.filter({ id: courtId });
      return courts[0];
    },
    enabled: !!courtId,
  });

  const { data: existingBookings = [] } = useQuery({
    queryKey: ["bookings", courtId, selectedDate],
    queryFn: () =>
      base44.entities.Booking.filter({
        court_id: courtId,
        date: format(selectedDate, "yyyy-MM-dd"),
        status: "confirmada",
      }),
    enabled: !!courtId && !!selectedDate,
  });

  const bookedSlots = existingBookings.map((b) => b.time_slot);

  const createBooking = useMutation({
    mutationFn: async ({ paymentType, paidAmount }) => {
      // Doble chequeo de disponibilidad justo antes de crear la reserva, para
      // reducir (aunque no eliminar del todo, ver nota en bookingService)
      // la ventana de doble-reserva del mismo horario.
      const clash = await base44.entities.Booking.filter({
        court_id: courtId,
        date: format(selectedDate, "yyyy-MM-dd"),
        time_slot: selectedSlot,
        status: "confirmada",
      });
      if (clash.length > 0) {
        toast.error("Ese horario se acaba de ocupar. Elegí otro, por favor.");
        setStep(1);
        throw new Error("SLOT_TAKEN");
      }

      const isPaidTotal = paymentType === "total";
      const { totalPrice, remainingAmount } = calculateAmounts(court?.price_per_hour);
      const bookingData = buildBookingPayload({
        court,
        courtId,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedSlot,
        notes,
        user,
        paymentType,
      });
      const booking = await base44.entities.Booking.create(bookingData);

      await base44.integrations.Core.SendEmail({
        to: user?.email,
        subject: `🎾 ${isPaidTotal ? "Reserva confirmada" : "Solicitud enviada"} - ${court?.name}`,
        body: `
          <h2>${isPaidTotal ? "¡Tu reserva fue confirmada!" : "Tu solicitud fue enviada al dueño"}</h2>
          <p><strong>Cancha:</strong> ${court?.name}</p>
          <p><strong>Fecha:</strong> ${format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
          <p><strong>Horario:</strong> ${selectedSlot} hs</p>
          <p><strong>Total:</strong> $${totalPrice.toLocaleString()}</p>
          <p><strong>Pagado:</strong> $${paidAmount.toLocaleString()}</p>
          ${!isPaidTotal ? `<p><strong>Saldo pendiente:</strong> $${remainingAmount.toLocaleString()}</p>
          <p>⚠️ Tenés tiempo hasta las <strong>${format(new Date(bookingData.payment_deadline), "HH:mm 'del' dd/MM/yyyy", { locale: es })}</strong> para completar el pago o la reserva se cancela.</p>` : ""}
        `,
      }).catch(() => {});

      if (court?.owner_email) {
        await base44.integrations.Core.SendEmail({
          to: court.owner_email,
          subject: `🏓 Nueva reserva - ${court?.name}`,
          body: `
            <h2>Nueva ${isPaidTotal ? "reserva confirmada" : "solicitud de reserva"}</h2>
            <p><strong>Jugador:</strong> ${user?.full_name || user?.email}</p>
            <p><strong>Cancha:</strong> ${court?.name}</p>
            <p><strong>Fecha:</strong> ${format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
            <p><strong>Horario:</strong> ${selectedSlot} hs</p>
            <p><strong>Pago recibido:</strong> $${paidAmount.toLocaleString()} ${isPaidTotal ? "(total)" : "(30% depósito)"}</p>
            ${!isPaidTotal ? "<p>Ingresá al panel de dueños para aprobar o rechazar la reserva.</p>" : ""}
          `,
        }).catch(() => {});
      }

      return booking;
    },
    onSuccess: (_, { paymentType }) => {
      toast.success(paymentType === "total"
        ? "¡Reserva confirmada con pago total!"
        : "¡Solicitud enviada! Te avisamos cuando el dueño la apruebe.");
      navigate("/my-bookings");
    },
    onError: (error) => {
      if (error?.message === "SLOT_TAKEN") return; // ya se avisó arriba
      toast.error("No pudimos crear la reserva. Probá de nuevo en unos segundos.");
    },
  });

  const handlePaymentDone = (paymentType, paidAmount) => {
    createBooking.mutate({ paymentType, paidAmount });
  };

  if (!courtId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">No se seleccionó ninguna cancha.</p>
        <Link to="/courts">
          <Button className="mt-4">Ver canchas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/courts" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a canchas
      </Link>

      {court && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <img
              src={court.image_url || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&h=100&fit=crop"}
              className="w-16 h-16 rounded-xl object-cover"
              alt={court.name}
            />
            <div>
              <h1 className="font-heading text-2xl font-bold">{court.name}</h1>
              <p className="text-primary font-semibold">${court.price_per_hour?.toLocaleString()}/hora</p>
            </div>
          </div>

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Elegí fecha y horario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => d && setSelectedDate(d)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Horarios disponibles - {format(selectedDate, "EEEE d/MM", { locale: es })}
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isBooked
                              ? "bg-muted text-muted-foreground/40 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "bg-card border border-border hover:border-primary/30 text-foreground"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Notas (opcional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguna nota especial..."
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedSlot}
                  className="w-full h-12 rounded-xl text-base font-semibold"
                >
                  Continuar al pago
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Confirm & Pay */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Confirmar reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl bg-accent/50 p-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cancha</span>
                    <span className="font-medium">{court.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="font-medium">{format(selectedDate, "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horario</span>
                    <span className="font-medium">{selectedSlot} hs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración</span>
                    <span className="font-medium">1 hora</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-heading font-bold text-xl text-primary">
                      ${court.price_per_hour?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 space-y-2">
                  <p className="text-sm font-semibold text-yellow-800">💳 Modalidad de pago con depósito</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-700">Depósito ahora (30%)</span>
                    <span className="font-bold text-yellow-800">${calculateAmounts(court?.price_per_hour).depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-700">Saldo restante (70%)</span>
                    <span className="font-bold text-yellow-800">${calculateAmounts(court?.price_per_hour).remainingAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-yellow-600 pt-1 border-t border-yellow-200">
                    ⚠️ Tenés hasta {PAYMENT_WINDOW_HOURS} hs antes del turno para completar el pago. Si no pagás el total, la reserva se cancela automáticamente.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                    Volver
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={createBooking.isPending}
                    className="flex-1 h-12 rounded-xl text-base font-semibold"
                  >
                    {createBooking.isPending ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Ir al pago · MP
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      <PaymentQRModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        court={court}
        booking={{ date: format(selectedDate, "yyyy-MM-dd"), time_slot: selectedSlot }}
        onPaymentDone={handlePaymentDone}
      />
    </div>
  );
}