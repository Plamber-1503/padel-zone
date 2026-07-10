/**
 * bookingService.js
 *
 * Única fuente de verdad para el cálculo de montos, plazos y comisión de una
 * reserva. Antes esta lógica estaba duplicada (y podía desincronizarse) entre
 * BookCourt.jsx y PaymentQRModal.jsx.
 *
 * NOTA IMPORTANTE: estos cálculos siguen corriendo en el cliente, lo cual es
 * aceptable para *mostrar* montos en la UI, pero el estado final de una
 * reserva (pagada / confirmada) NUNCA debería depender únicamente de lo que
 * el cliente envía. La reforma pendiente de mayor impacto es mover la
 * confirmación de pago a una función de backend que valide el pago real
 * contra la API de Mercado Pago (ver /base44/functions/confirmPayment).
 */

export const DEPOSIT_RATIO = 0.3;
export const PLATFORM_FEE_RATIO = 0.05; // 5% de comisión de la plataforma (configurable)
export const PAYMENT_WINDOW_HOURS = 2; // horas antes del turno para completar el pago

/**
 * Calcula depósito, saldo restante y comisión de plataforma a partir del
 * precio total de la cancha.
 */
export function calculateAmounts(totalPrice) {
  const total = Number(totalPrice) || 0;
  const depositAmount = Math.round(total * DEPOSIT_RATIO);
  const remainingAmount = total - depositAmount;
  const platformFee = Math.round(total * PLATFORM_FEE_RATIO);
  return { totalPrice: total, depositAmount, remainingAmount, platformFee };
}

/**
 * Devuelve el datetime límite de pago (turno menos PAYMENT_WINDOW_HOURS).
 */
export function calculatePaymentDeadline(date, timeSlot) {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(hours, minutes, 0, 0);
  return new Date(bookingDateTime.getTime() - PAYMENT_WINDOW_HOURS * 60 * 60 * 1000);
}

/**
 * Arma el objeto de datos de una reserva nueva, listo para persistir.
 * Centraliza las reglas de negocio de qué status/payment_status corresponde
 * según el tipo de pago elegido.
 */
export function buildBookingPayload({ court, courtId, date, timeSlot, notes, user, paymentType }) {
  const { totalPrice, depositAmount, remainingAmount, platformFee } = calculateAmounts(court?.price_per_hour);
  const paymentDeadline = calculatePaymentDeadline(date, timeSlot);
  const isPaidTotal = paymentType === "total";

  return {
    court_id: courtId,
    court_name: court?.name,
    owner_email: court?.owner_email || "",
    date,
    time_slot: timeSlot,
    duration_hours: 1,
    total_price: totalPrice,
    deposit_amount: depositAmount,
    remaining_amount: isPaidTotal ? 0 : remainingAmount,
    platform_fee: platformFee,
    payment_deadline: paymentDeadline.toISOString(),
    status: isPaidTotal ? "confirmada" : "pendiente_aprobacion",
    payment_status: isPaidTotal ? "pagado_total" : "deposito_pagado",
    player_name: user?.full_name || "",
    player_email: user?.email || "",
    notes: notes || "",
  };
}

/**
 * Determina si una reserva aprobada/pendiente ya venció su ventana de pago.
 */
export function isBookingExpired(booking, now = new Date()) {
  return (
    (booking.status === "aprobada" || booking.status === "pendiente_aprobacion") &&
    booking.payment_status !== "pagado_total" &&
    booking.payment_deadline &&
    new Date(booking.payment_deadline) < now
  );
}

/**
 * Determina si al cancelar una reserva corresponde marcarla como reembolsada
 * (es decir, si ya había un pago registrado).
 */
export function shouldRefundOnCancel(booking) {
  return booking.payment_status === "deposito_pagado" || booking.payment_status === "pagado_total";
}
