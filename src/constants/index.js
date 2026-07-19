/**
 * index.js
 *
 * Re-exporta todas las constantes de dominio desde un único punto de entrada.
 * Permite importar múltiples constantes en una sola línea:
 *
 *   import { BOOKING_STATUS, BOOKING_STATUS_LABELS, ROLES } from "@/constants";
 */

export * from "./bookingStatus";
export * from "./paymentStatus";
export * from "./roles";
export * from "./timeSlots";
export * from "./courtTypes";
