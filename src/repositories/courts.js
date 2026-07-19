/**
 * courts.js — CourtsRepository
 *
 * Única fuente de verdad para todas las llamadas a la entidad Court.
 * Las páginas y hooks NO deben llamar a base44.entities.Court directamente.
 *
 * Beneficio: si cambia el nombre de un campo o la lógica de filtrado,
 * hay un solo lugar donde actualizar.
 */
import { base44 } from "@/api/base44Client";

export const CourtsRepository = {
  /** Canchas activas, ordenadas por fecha de creación descendente */
  getActive: (limit = 300) =>
    base44.entities.Court.filter({ is_active: true }, "-created_date", limit),

  /** Canchas de un dueño específico */
  getByOwner: (ownerEmail) =>
    base44.entities.Court.filter({ owner_email: ownerEmail }),

  /** Busca una cancha por id; retorna null si no existe */
  getById: async (id) => {
    const courts = await base44.entities.Court.filter({ id });
    return courts[0] ?? null;
  },

  /** Crea una cancha nueva */
  create: (data) => base44.entities.Court.create(data),

  /** Actualiza campos de una cancha existente */
  update: (id, data) => base44.entities.Court.update(id, data),
};
