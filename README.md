**Welcome to your Base44 project** 

**About**

View and Edit  your app on [Base44.com](http://Base44.com) 

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)

---

## Arquitectura (para el equipo de desarrollo)

- **Frontend:** React 18 + Vite, React Router, TanStack Query para data-fetching,
  shadcn/ui + Tailwind para componentes, Framer Motion para animaciones.
- **Backend:** entidades declarativas en `base44/entities/*.jsonc` y funciones
  serverless (Deno) en `base44/functions/*/entry.ts`, corriendo sobre la
  plataforma Base44.
- **Capa de servicios:** `src/services/*` concentra la lógica de negocio que
  antes vivía repetida dentro de los componentes (cálculo de depósitos,
  deadlines, reglas de reembolso). Cualquier regla de negocio nueva debería
  vivir acá, no dentro de un componente de página.

### Reglas de acceso pendientes de configurar en el Builder de Base44

El código agrega una segunda capa de protección en el cliente (`RoleRoute`),
pero la protección real tiene que existir también del lado del servidor.
Antes de ir a producción, verificar en el Builder que:

- Sólo el propio `owner_email` (o un admin) pueda escribir sobre un `Court`.
- Sólo el propio `player_email` pueda cancelar su `Booking`.
- Sólo un `admin` pueda invocar `expireBookings` fuera del scheduler.

### Funciones de backend

| Función | Estado | Descripción |
|---|---|---|
| `sendBookingReminders` | Activa | Recordatorio por email 24hs antes del turno. |
| `expireBookings` | Nueva — activar como cron | Vence reservas impagas y libera el horario automáticamente. |
| `confirmPayment` | Stub — pendiente | Punto de integración real con Mercado Pago (ver comentarios en el archivo). |

## Flujo de trabajo y control de versiones

- Ramas: `main` (producción) ← `develop` (integración) ← `feature/*` (por tarea).
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Todo cambio entra por Pull Request a `develop`, con al menos una revisión.
- `npm run prepare` instala el hook de pre-commit (husky + lint-staged) que
  corre `eslint --fix` automáticamente antes de cada commit.
- CI (`.github/workflows/ci.yml`) corre lint, typecheck y build en cada PR.

## Auditoría técnica

El detalle completo de errores críticos, deuda técnica y el plan de reformas
aplicado está en `PadelZone_Auditoria_Tecnica.docx` (entregado junto al
código) y resumido en `CHANGELOG.md`.
