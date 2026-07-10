import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Ventana: entre 23 y 25 horas desde ahora
    const now = new Date();
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Traer todas las reservas confirmadas o aprobadas
    const bookings = await base44.asServiceRole.entities.Booking.filter({
      status: ['confirmada', 'aprobada']
    });

    const reminders = [];

    for (const booking of bookings) {
      if (!booking.date || !booking.time_slot || !booking.player_email) continue;

      // Construir datetime del turno
      const [hours, minutes] = booking.time_slot.split(':').map(Number);
      const bookingDateTime = new Date(`${booking.date}T00:00:00-03:00`);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      if (bookingDateTime >= windowStart && bookingDateTime <= windowEnd) {
        const dateStr = bookingDateTime.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'America/Buenos_Aires'
        });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.player_email,
          subject: `⏰ Recordatorio: Tu turno mañana en ${booking.court_name}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #16a34a;">⏰ Recordatorio de turno</h2>
              <p>Hola${booking.player_name ? ' ' + booking.player_name : ''},</p>
              <p>Te recordamos que tenés un turno reservado <strong>mañana</strong>:</p>
              <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 4px 0;"><strong>🏟️ Cancha:</strong> ${booking.court_name}</p>
                <p style="margin: 4px 0;"><strong>📅 Fecha:</strong> ${dateStr}</p>
                <p style="margin: 4px 0;"><strong>🕐 Horario:</strong> ${booking.time_slot} hs</p>
                <p style="margin: 4px 0;"><strong>💰 Total:</strong> $${(booking.total_price || 0).toLocaleString('es-AR')}</p>
                ${booking.payment_status === 'deposito_pagado' ? `<p style="margin: 4px 0; color: #d97706;"><strong>💳 Saldo pendiente:</strong> $${(booking.remaining_amount || 0).toLocaleString('es-AR')}</p>` : ''}
              </div>
              ${booking.payment_status === 'deposito_pagado' ? '<p style="color: #d97706;">⚠️ Recordá llevar el saldo restante para pagar al llegar.</p>' : '<p style="color: #16a34a;">✅ Tu pago está completo.</p>'}
              <p>¡Nos vemos mañana!</p>
            </div>
          `,
        });

        reminders.push(booking.player_email);
      }
    }

    return Response.json({
      success: true,
      checked: bookings.length,
      reminders_sent: reminders.length,
      recipients: reminders,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});