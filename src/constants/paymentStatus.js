/**
 * paymentStatus.js
 *
 * Fuente de verdad para estados de pago, labels y colores.
 */

export const PAYMENT_STATUS = {
  PENDING:   "pendiente",
  DEPOSIT:   "deposito_pagado",
  FULL:      "pagado_total",
  REFUNDED:  "reembolsado",
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]:  "Sin pago",
  [PAYMENT_STATUS.DEPOSIT]:  "Depósito pagado (30%)",
  [PAYMENT_STATUS.FULL]:     "Pagado total",
  [PAYMENT_STATUS.REFUNDED]: "Reembolsado",
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]:  "bg-yellow-100 text-yellow-800",
  [PAYMENT_STATUS.DEPOSIT]:  "bg-blue-100 text-blue-800",
  [PAYMENT_STATUS.FULL]:     "bg-accent text-accent-foreground",
  [PAYMENT_STATUS.REFUNDED]: "bg-muted text-muted-foreground",
};
