/**
 * bookingStatus.js
 *
 * Fuente de verdad para estados de reserva, sus labels y colores de badge.
 * Antes estaban duplicados en MyBookings.jsx, OwnerDashboard.jsx y BookingRequestCard.jsx.
 */

export const BOOKING_STATUS = {
  PENDING:   "pendiente_aprobacion",
  APPROVED:  "aprobada",
  CONFIRMED: "confirmada",
  REJECTED:  "rechazada",
  EXPIRED:   "expirada",
  CANCELLED: "cancelada",
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]:   "Pendiente aprobación",
  [BOOKING_STATUS.APPROVED]:  "Aprobada — pago pendiente",
  [BOOKING_STATUS.CONFIRMED]: "Confirmada",
  [BOOKING_STATUS.REJECTED]:  "Rechazada",
  [BOOKING_STATUS.EXPIRED]:   "Expirada",
  [BOOKING_STATUS.CANCELLED]: "Cancelada",
};

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  [BOOKING_STATUS.APPROVED]:  "bg-blue-100 text-blue-800 border-blue-200",
  [BOOKING_STATUS.CONFIRMED]: "bg-accent text-accent-foreground border-accent",
  [BOOKING_STATUS.REJECTED]:  "bg-destructive/10 text-destructive border-destructive/20",
  [BOOKING_STATUS.EXPIRED]:   "bg-muted text-muted-foreground border-border",
  [BOOKING_STATUS.CANCELLED]: "bg-muted text-muted-foreground border-border",
};

/** Estados que el usuario puede cancelar */
export const CANCELLABLE_STATUSES = [
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.APPROVED,
  BOOKING_STATUS.PENDING,
];

/** Estados que van al historial del panel de dueño */
export const HISTORY_STATUSES = [
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.REJECTED,
  BOOKING_STATUS.EXPIRED,
  BOOKING_STATUS.CANCELLED,
];
