// ─── Mock Base44 Client ───────────────────────────────────────────────────────
// Drop-in replacement del cliente real de Base44.
// Se activa cuando VITE_MOCK_MODE=true en .env.local.
// Todas las operaciones se hacen en memoria; los datos se resetean al recargar.

import {
  MOCK_USER,
  mockUsers,
  mockCourts,
  mockBookings,
  mockPosts,
  mockComments,
  mockChatMessages,
  mockFollows,
  mockReviews,
} from "./mockData";

// ── Helpers ──────────────────────────────────────────────────────────────────

// Estado mutable en memoria (se resetea al recargar la página)
const store = {
  User: [...mockUsers],
  Court: [...mockCourts],
  Booking: [...mockBookings],
  Post: [...mockPosts],
  Comment: [...mockComments],
  ChatMessage: [...mockChatMessages],
  Follow: [...mockFollows],
  Review: [...mockReviews],
};

let idCounter = 1000;
const genId = () => `mock-${++idCounter}`;

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Filtra registros según un objeto de condiciones */
function applyFilter(records, conditions) {
  if (!conditions) return records;
  return records.filter((r) =>
    Object.entries(conditions).every(([k, v]) => r[k] === v)
  );
}

/** Ordena registros: prefijo "-" = descendente */
function applySort(records, sort) {
  if (!sort) return records;
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  return [...records].sort((a, b) => {
    const va = a[field] ?? "";
    const vb = b[field] ?? "";
    if (va < vb) return desc ? 1 : -1;
    if (va > vb) return desc ? -1 : 1;
    return 0;
  });
}

/** Crea la interfaz de entidad genérica */
function makeEntity(name) {
  return {
    async list(sort, limit = 100) {
      await delay();
      let records = [...store[name]];
      if (sort) records = applySort(records, sort);
      return records.slice(0, limit);
    },

    async filter(conditions, sort, limit = 100) {
      await delay();
      let records = applyFilter(store[name], conditions);
      if (sort) records = applySort(records, sort);
      return records.slice(0, limit);
    },

    async get(id) {
      await delay();
      return store[name].find((r) => r.id === id) ?? null;
    },

    async create(data) {
      await delay();
      const record = {
        id: genId(),
        created_date: new Date().toISOString(),
        ...data,
      };
      store[name].unshift(record);
      return record;
    },

    async update(id, data) {
      await delay();
      const idx = store[name].findIndex((r) => r.id === id);
      if (idx !== -1) {
        store[name][idx] = { ...store[name][idx], ...data };
        return store[name][idx];
      }
      return null;
    },

    async delete(id) {
      await delay();
      const idx = store[name].findIndex((r) => r.id === id);
      if (idx !== -1) store[name].splice(idx, 1);
      return { success: true };
    },
  };
}

// ── Cliente mock completo ─────────────────────────────────────────────────────

export const mockBase44 = {
  entities: {
    User: makeEntity("User"),
    Court: makeEntity("Court"),
    Booking: makeEntity("Booking"),
    Post: makeEntity("Post"),
    Comment: makeEntity("Comment"),
    ChatMessage: makeEntity("ChatMessage"),
    Follow: makeEntity("Follow"),
    Review: makeEntity("Review"),
  },

  auth: {
    async me() {
      await delay(100);
      return { ...MOCK_USER };
    },

    async updateMe(data) {
      await delay();
      Object.assign(MOCK_USER, data);
      // También actualizar en el store de usuarios
      const idx = store.User.findIndex((u) => u.id === MOCK_USER.id);
      if (idx !== -1) store.User[idx] = { ...store.User[idx], ...data };
      return { ...MOCK_USER };
    },

    logout() {
      // En modo mock el logout no hace nada (no hay sesión real)
      console.info("[mock] logout() — no-op en modo demo");
    },

    redirectToLogin() {
      console.info("[mock] redirectToLogin() — no-op en modo demo");
    },
  },

  integrations: {
    Core: {
      async SendEmail(payload) {
        console.info("[mock] SendEmail →", payload.to, payload.subject);
        await delay(100);
        return { success: true };
      },

      async UploadFile({ file }) {
        await delay(300);
        // Devuelve una URL de placeholder con el nombre del archivo
        const url = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&mock=${file.name}`;
        console.info("[mock] UploadFile →", url);
        return { file_url: url };
      },
    },
  },
};
