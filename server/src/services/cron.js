import cron from 'node-cron';
import { db } from '../db.js';

export function startCronJobs() {
  console.log('⏰ Servidor de tareas en segundo plano (CronJobs) iniciado');

  // Ejecutar expiración de reservas impagas cada 10 minutos
  cron.schedule('*/10 * * * *', () => {
    try {
      const now = new Date();
      const candidates = db.filter('Booking', {});
      let expiredCount = 0;

      for (const booking of candidates) {
        if (booking.status !== 'aprobada' && booking.status !== 'pendiente_aprobacion') continue;
        if (booking.payment_status === 'pagado_total') continue;
        if (!booking.payment_deadline) continue;

        if (new Date(booking.payment_deadline) < now) {
          const wasRefundable = booking.payment_status === 'deposito_pagado';
          db.update('Booking', booking.id, {
            status: 'expirada',
            payment_status: wasRefundable ? 'reembolsado' : booking.payment_status
          });
          expiredCount++;
        }
      }

      if (expiredCount > 0) {
        console.log(`⏱️ Cron: Se expiraron ${expiredCount} reservas impagas`);
      }
    } catch (err) {
      console.error('Error en Cron de expiración de reservas:', err);
    }
  });
}
