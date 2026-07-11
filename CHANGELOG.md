# Changelog

## [0.2.0] — Reformas post-auditoría técnica

Reformas aplicadas sobre el proyecto entregado originalmente por Base44, en
base a la auditoría técnica de julio 2026.

### 🔐 Seguridad y roles
- **Nuevo:** `RoleRoute` — guard de rutas por rol; `/owner-dashboard` ahora
  requiere `court_owner` o `admin` (antes cualquier usuario autenticado
  entraba escribiendo la URL).
- Documentadas en el README las reglas de acceso server-side que deben
  configurarse en el Builder de Base44 como segunda capa de protección.

### 💳 Pagos y reservas
- **Nuevo:** `src/services/bookingService.js` — única fuente de verdad para
  el cálculo de depósito, saldo, deadline y comisión de plataforma (antes
  duplicado y potencialmente desincronizado entre `BookCourt.jsx` y
  `PaymentQRModal.jsx`).
- **Nuevo:** campo `platform_fee` en la entidad `Booking`, base del modelo de
  comisión de la plataforma.
- **Nuevo:** función de backend `expireBookings` (cron) — reemplaza el
  vencimiento de reservas que antes sólo ocurría si el dueño tenía el panel
  abierto en el navegador, y que además tenía un bug de reintento en bucle.
- Cancelación de reservas (`MyBookings.jsx`): ahora marca `reembolsado`
  cuando corresponde y notifica por email al dueño de la cancha (antes el
  dueño no se enteraba de la cancelación).
- **Nuevo:** chequeo de disponibilidad justo antes de crear una reserva, para
  reducir la ventana de doble-reserva del mismo horario.
- **Stub:** función de backend `confirmPayment`, con el punto de integración
  documentado para reemplazar la confirmación manual de pago por una
  validación real contra la API de Mercado Pago. **Requiere credenciales
  productivas del cliente para completarse — no está activa todavía.**

### 🧵 Concurrencia
- `PostCard.jsx`: se relee el post inmediatamente antes de escribir el like,
  acotando (no eliminando del todo) la condición de carrera del contador de
  "me gusta". Limitación documentada en el propio código, con la solución de
  fondo recomendada (entidad `Like` separada o lógica server-side).

### 🧹 Deuda técnica
- Eliminadas dependencias muertas: `moment` (no se usaba en ningún archivo) y
  `react-hot-toast` (no se usaba en ningún archivo).
- Unificado el sistema de notificaciones en `sonner`; eliminado el sistema de
  toast duplicado de shadcn/ui (`use-toast.jsx`, `toast.jsx`, `toaster.jsx`).
- Agregado límite explícito a las consultas de `Court` y `User` que antes
  traían la tabla completa sin paginar.

### 🌟 Producto y red social
- **Nueva entidad:** `Review` — calificación de canchas (1 a 5 estrellas +
  comentario), ligada a una reserva confirmada.
- **Nuevo:** `CourtRating` y `ReviewModal` — promedio de estrellas visible en
  las tarjetas de cancha, y flujo para dejar reseña desde "Mis reservas".
- `Feed.jsx`: ahora permite alternar entre "Todos" y "Siguiendo", usando el
  sistema de `Follow` que existía en el modelo de datos pero no se usaba en
  ningún lado.

### 🛠️ Estructura y control de versiones
- Repositorio git inicializado con historial base.
- `.env.example` agregado.
- CI en GitHub Actions (`lint` + `typecheck` + `build` en cada PR).
- `husky` + `lint-staged`: `eslint --fix` automático antes de cada commit.
- `package.json`: nombre y versión actualizados (`0.0.0` → `0.2.0`), listo
  para versionado semántico hacia adelante.

---

## Pendientes que requieren decisiones o recursos del cliente

Estos puntos quedaron documentados pero **no se pudieron completar** en esta
pasada porque requieren credenciales, cuentas o decisiones de negocio que no
están disponibles en el repositorio:

1. **Integración real con Mercado Pago** (Checkout API + webhook) — requiere
   cuenta de Mercado Pago Developers y decidir el modelo (marketplace vs.
   cobro directo por dueño).
2. **Activar `expireBookings` como cron** en la configuración de Base44.
3. **Reglas de acceso server-side por entidad** en el Builder de Base44.
4. **Panel de administración** (rol `admin` existe en el modelo pero no tiene
   pantallas asociadas).
5. **Migrar relaciones de `email` a `user_id`** — cambio de modelo de datos
   que conviene planificar como migración propia, no como parche.

## Nota sobre `npm run typecheck`

El proyecto entregado originalmente ya tenía un volumen alto de errores de
`tsc` (~426) sobre archivos `.jsx`, principalmente porque los componentes de
shadcn/ui no anotan explícitamente props como `children` o `variant`, y
porque `useMutation` sin anotaciones explícitas infiere a veces el tipo del
parámetro de `mutationFn` como `void`. Esto es ruido de configuración
(`jsconfig.json` con `checkJs: true` pero sin tipos completos en los
componentes base), no errores reales de runtime — el `build` compila y
corre sin problemas. No se resolvió en esta pasada porque requeriría
tipar a mano toda la librería de componentes base, un trabajo aparte y de
alcance mayor al de esta auditoría.
