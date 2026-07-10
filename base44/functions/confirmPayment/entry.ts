import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * confirmPayment
 *
 * ESTADO: STUB — no reemplaza todavía a la confirmación manual del
 * frontend (PaymentQRModal.jsx). Se deja preparado el punto de integración
 * para que el equipo de desarrollo lo complete con las credenciales
 * productivas de Mercado Pago del cliente.
 *
 * Objetivo de esta función cuando esté completa:
 * 1. Recibir el `payment_id` que devuelve Mercado Pago tras un pago con
 *    Checkout Pro / Checkout API (no la confirmación manual actual).
 * 2. Validar contra la API de Mercado Pago (GET /v1/payments/{id}) usando el
 *    Access Token del dueño de la cancha (o de la plataforma, si se centraliza
 *    el cobro) que el pago existe, está aprobado y el monto coincide con la
 *    reserva.
 * 3. Recién ahí actualizar Booking.payment_status y Booking.status.
 *
 * Esto es lo que cierra el hallazgo crítico "El sistema de pagos no verifica
 * ningún pago real" del informe de auditoría. Requiere:
 *   - Cuenta de Mercado Pago developers de PadelZone (o de cada dueño, según
 *     el modelo elegido: marketplace vs. cobro directo).
 *   - Configurar el Access Token como secreto en Base44 (nunca en el cliente).
 *   - Configurar la URL de notificación (webhook) de Mercado Pago para que
 *     apunte a esta función.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { booking_id, payment_id } = body;

    if (!booking_id || !payment_id) {
      return Response.json({ error: 'booking_id y payment_id son requeridos' }, { status: 400 });
    }

    // TODO (equipo de desarrollo): reemplazar por la validación real contra
    // la API de Mercado Pago antes de habilitar esta función en producción.
    // const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
    //   headers: { Authorization: `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` },
    // });
    // const payment = await mpResponse.json();
    // if (payment.status !== 'approved') {
    //   return Response.json({ error: 'Pago no aprobado' }, { status: 402 });
    // }

    return Response.json(
      {
        error:
          'Integración con Mercado Pago pendiente de completar. Ver comentarios en el código de esta función.',
      },
      { status: 501 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
