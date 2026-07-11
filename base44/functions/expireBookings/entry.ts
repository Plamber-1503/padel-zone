import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * expireBookings
 *
 * Reforma crítica: antes, el vencimiento de reservas impagas sólo pasaba si
 * el dueño de la cancha tenía el panel abierto en el navegador
 * (OwnerDashboard.jsx hacía el chequeo en el cliente). Eso significaba que
 * una reserva vencida podía quedar bloqueando el horario indefinidamente.
 *
 * Esta función corre del lado del servidor y debe programarse como tarea
 * periódica (cron, por ejemplo cada 15 minutos) desde la configuración de
 * Base44 — igual que ya está configurado `sendBookingReminders`. Sigue el
 * mismo patrón de autenticación que esa función (rol admin) en lugar de
 * inventar un mecanismo nuevo: al programar la tarea periódica en Base44,
 * consultar con su documentación con qué credencial se ejecutan los cron
 * jobs (habitualmente una cuenta de servicio con rol admin).
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const now = new Date();

    const candidates = await base44.asServiceRole.entities.Booking.filter({
      status: ['aprobada', 'pendiente_aprobacion'],
    });

    const expired = [];

    for (const booking of candidates) {
      if (booking.payment_status === 'pagado_total') continue;
      if (!booking.payment_deadline) continue;
      if (new Date(booking.payment_deadline) >= now) continue;

      const wasRefundable = booking.payment_status === 'deposito_pagado';

      await base44.asServiceRole.entities.Booking.update(booking.id, {
        status: 'expirada',
        payment_status: wasRefundable ? 'reembolsado' : booking.payment_status,
      });

      // Avisar a jugador y dueño de que el horario quedó libre nuevamente.
      if (booking.player_email) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.player_email,
          subject: `⏱️ Tu reserva en ${booking.court_name} expiró`,
          body: `
            <p>Hola${booking.player_name ? ' ' + booking.player_name : ''},</p>
            <p>Tu reserva del ${booking.date} a las ${booking.time_slot} hs en ${booking.court_name}
            expiró porque no se completó el pago dentro del plazo.</p>
            ${wasRefundable ? '<p>El depósito que pagaste será reembolsado.</p>' : ''}
          `,
        }).catch(() => {});
      }
      if (booking.owner_email) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.owner_email,
          subject: `⏱️ Reserva expirada - ${booking.court_name}`,
          body: `<p>La reserva de ${booking.player_name || booking.player_email} del ${booking.date} ${booking.time_slot} hs expiró por falta de pago. El horario vuelve a estar disponible.</p>`,
        }).catch(() => {});
      }

      expired.push(booking.id);
    }

    return Response.json({ success: true, checked: candidates.length, expired: expired.length, ids: expired });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
