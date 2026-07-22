/**
 * demoClient.js — Cliente de demostración offline para PadelZone
 *
 * Funciona 100% en el navegador sin necesidad de servidor backend.
 * Almacena los datos en localStorage y simula autenticación con usuarios pre-cargados.
 */


// ─── Usuarios de demostración ──────────────────────────────────────────────
const DEMO_USERS = [
  {
    id: "demo-user-1",
    email: "demo@padelzone.app",
    password: "demo123",
    full_name: "Martín Gómez",
    role: "player",
    level: "intermedio",
    bio: "Jugador apasionado del pádel 🎾 | Buenos Aires",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    created_date: "2024-06-01T10:00:00Z"
  },
  {
    id: "owner-user-1",
    email: "carlos.owner@mail.com",
    password: "demo123",
    full_name: "Carlos Rodríguez",
    role: "court_owner",
    level: "intermedio",
    bio: "Dueño de PadelClub Norte",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    mp_alias: "PADELZONE.CARLOS.MP",
    mp_cbu: "0000003100012345678901",
    mp_verified: true,
    created_date: "2024-04-15T08:00:00Z"
  },
  {
    id: "user-sofia-1",
    email: "sofia.rossi@padelzone.app",
    password: "demo123",
    full_name: "Sofía Rossi",
    role: "player",
    level: "avanzado",
    bio: "Jugadora de revés ⚡ Campeona del Torneo Córdoba 2024.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    created_date: "2024-05-10T10:00:00Z"
  },
  {
    id: "user-lucas-2",
    email: "lucas.benitez@padelzone.app",
    password: "demo123",
    full_name: "Lucas Benítez",
    role: "player",
    level: "intermedio",
    bio: "Entrenando 3 veces por semana 🎾 Fanático de la víbora.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    created_date: "2024-05-12T11:30:00Z"
  },
  {
    id: "user-valen-3",
    email: "valentina.m@padelzone.app",
    password: "demo123",
    full_name: "Valentina Morales",
    role: "player",
    level: "profesional",
    bio: "Profesora e instructora certificada de pádel 🏆",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    created_date: "2024-05-14T09:15:00Z"
  },
  {
    id: "user-mateo-4",
    email: "mateo.silveira@padelzone.app",
    password: "demo123",
    full_name: "Mateo Silveira",
    role: "player",
    level: "principiante",
    bio: "Empezando mi camino en el pádel 🙌",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    created_date: "2024-05-16T08:00:00Z"
  },
  {
    id: "user-camila-5",
    email: "camila.navarro@padelzone.app",
    password: "demo123",
    full_name: "Camila Navarro",
    role: "player",
    level: "intermedio",
    bio: "Zurdita de drive ⚡ Partidos de 5ta.",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    created_date: "2024-05-18T10:00:00Z"
  },
  {
    id: "user-joaquin-6",
    email: "joaquin.peralta@padelzone.app",
    password: "demo123",
    full_name: "Joaquín Peralta",
    role: "player",
    level: "avanzado",
    bio: "Revés agresivo y bajada de pared 🔥",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    created_date: "2024-05-20T11:00:00Z"
  },
  {
    id: "user-gonzalo-7",
    email: "gonzalo.fernandez@padelzone.app",
    password: "demo123",
    full_name: "Gonzalo Fernández",
    role: "player",
    level: "avanzado",
    bio: "Drive táctico 🧠 10 años en circuito.",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    created_date: "2024-05-22T09:00:00Z"
  },
  {
    id: "user-flor-8",
    email: "flor.diaz@padelzone.app",
    password: "demo123",
    full_name: "Florencia Díaz",
    role: "player",
    level: "principiante",
    bio: "Pádel femenino 🚀",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    created_date: "2024-05-24T08:30:00Z"
  },
  {
    id: "user-diego-9",
    email: "diego.romero@padelzone.app",
    password: "demo123",
    full_name: "Diego Romero",
    role: "player",
    level: "intermedio",
    bio: "Jugador de finde 🍺 Tercer tiempo obligatorio.",
    avatar_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
    created_date: "2024-05-26T12:00:00Z"
  }
];

// ─── Canchas de demostración ───────────────────────────────────────────────
const DEMO_COURTS = [
  {
    id: "court-1", name: "Cancha Central", owner_id: "owner-user-1",
    location: "Av. Libertador 1250, Buenos Aires", price_per_hour: 4500,
    surface: "cristal", indoor: true, amenities: ["vestuarios", "estacionamiento", "bar"],
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&fit=crop",
    rating: 4.8, available: true, description: "Cancha de pádel cristal de última generación."
  },
  {
    id: "court-2", name: "Cancha Norte", owner_id: "owner-user-1",
    location: "Calle Rivadavia 890, Córdoba", price_per_hour: 3800,
    surface: "moqueta", indoor: false, amenities: ["vestuarios", "wifi"],
    image_url: "https://images.unsplash.com/photo-1617805273900-fcf8a83e4d70?w=800&fit=crop",
    rating: 4.5, available: true, description: "Cancha al aire libre en excelente estado."
  },
  {
    id: "court-3", name: "Club Palermo Paddle", owner_id: "owner-user-1",
    location: "Palermo, Buenos Aires", price_per_hour: 5200,
    surface: "cristal", indoor: true, amenities: ["vestuarios", "estacionamiento", "pro shop"],
    image_url: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&fit=crop",
    rating: 4.9, available: true, description: "Club premium con 6 canchas de pádel."
  }
];

// ─── Posts de demostración ─────────────────────────────────────────────────
const DEMO_POSTS = [
  {
    id: "post-1", author_id: "user-sofia-1",
    content: "¡Qué partidazo hoy! 🎾🔥 Ganamos 6-2 6-3 con mi compañera Valentina. El nivel fue increíble.",
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&fit=crop",
    likes: 24, created_date: "2024-07-15T14:30:00Z", comments_count: 3
  },
  {
    id: "post-2", author_id: "user-lucas-2",
    content: "Nuevo récord personal en entrenamiento. 2 horas de víboras y bajadas de pared 💪 ¿Alguien se suma mañana a las 18hs en Palermo?",
    image_url: null,
    likes: 15, created_date: "2024-07-14T18:00:00Z", comments_count: 5
  },
  {
    id: "post-3", author_id: "user-valen-3",
    content: "📢 Abro inscripciones para el intensivo de julio. Grupos reducidos de 4 personas, 2hs de clase teórico-práctica. ¡Plazas limitadas!",
    image_url: "https://images.unsplash.com/photo-1617805273900-fcf8a83e4d70?w=800&fit=crop",
    likes: 32, created_date: "2024-07-13T10:00:00Z", comments_count: 8
  },
  {
    id: "post-4", author_id: "demo-user-1",
    content: "Primera vez jugando en cancha de cristal. La diferencia con la moqueta es enorme. ¡Me encantó! 🎾",
    image_url: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&fit=crop",
    likes: 9, created_date: "2024-07-12T16:00:00Z", comments_count: 2
  }
];

// ─── Comentarios de demostración ───────────────────────────────────────────
const DEMO_COMMENTS = [
  { id: "c1", post_id: "post-1", author_id: "user-lucas-2", content: "¡Qué nivel! Tiene que haber sido un partidazo 🔥", created_date: "2024-07-15T15:00:00Z" },
  { id: "c2", post_id: "post-1", author_id: "demo-user-1", content: "Felicitaciones! Están en un nivel increíble 👏", created_date: "2024-07-15T15:30:00Z" },
  { id: "c3", post_id: "post-2", author_id: "user-sofia-1", content: "Yo me sumo! A qué cancha van?", created_date: "2024-07-14T19:00:00Z" },
  { id: "c4", post_id: "post-3", author_id: "demo-user-1", content: "Me interesa el intensivo! Te mando mensaje privado 🙌", created_date: "2024-07-13T11:00:00Z" }
];

// ─── Mensajes de chat de demostración ─────────────────────────────────────
const DEMO_MESSAGES = [
  { id: "msg-1", sender_id: "user-sofia-1", recipient_id: "demo-user-1", content: "Hola! ¿Jugamos esta semana?", created_date: "2024-07-15T10:00:00Z", read: false },
  { id: "msg-2", sender_id: "demo-user-1", recipient_id: "user-sofia-1", content: "¡Claro! ¿El jueves a las 18hs?", created_date: "2024-07-15T10:05:00Z", read: true },
  { id: "msg-3", sender_id: "user-lucas-2", recipient_id: "demo-user-1", content: "Che, ¿viste que abrió una cancha nueva en Palermo?", created_date: "2024-07-14T09:00:00Z", read: false }
];

// ─── Reservas de demostración ──────────────────────────────────────────────
const DEMO_BOOKINGS = [
  {
    id: "booking-1", court_id: "court-1", user_id: "demo-user-1",
    date: "2024-07-20", start_time: "18:00", end_time: "19:30",
    status: "confirmed", total_price: 6750, created_date: "2024-07-15T10:00:00Z"
  }
];

// ─── Motor de almacenamiento en localStorage ───────────────────────────────
const STORAGE_KEY = 'padelzone_demo_db';

function getDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) { /* ignore */ }
}

function initDB() {
  const existing = getDB();
  if (existing) return existing;
  const db = {
    User: DEMO_USERS.map(({ password: _, ...u }) => u),
    Court: DEMO_COURTS,
    Post: DEMO_POSTS,
    Comment: DEMO_COMMENTS,
    ChatMessage: DEMO_MESSAGES,
    Booking: DEMO_BOOKINGS,
    Follow: [],
    Review: []
  };
  saveDB(db);
  return db;
}

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Cliente de entidades ──────────────────────────────────────────────────
function makeDemoEntityClient(entityName) {
  return {
    async list(sort, limit = 100) {
      const db = initDB();
      let items = db[entityName] || [];
      if (sort) {
        const [field, dir] = sort.replace('-', '').split(':');
        items = [...items].sort((a, b) => {
          if (a[field] < b[field]) return dir === 'desc' ? 1 : -1;
          if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
          return 0;
        });
      }
      return items.slice(0, limit);
    },

    async filter(conditions = {}, sort, limit = 100) {
      const db = initDB();
      let items = (db[entityName] || []).filter(item => {
        return Object.entries(conditions).every(([key, val]) => {
          if (val === undefined || val === null) return true;
          return item[key] == val;
        });
      });
      if (sort) {
        const field = sort.replace('-', '').replace(':desc', '').replace(':asc', '');
        const dir = sort.includes(':desc') || sort.startsWith('-') ? -1 : 1;
        items = [...items].sort((a, b) => {
          if (a[field] < b[field]) return -dir;
          if (a[field] > b[field]) return dir;
          return 0;
        });
      }
      return items.slice(0, limit);
    },

    async get(id) {
      const db = initDB();
      const item = (db[entityName] || []).find(i => i.id === id);
      if (!item) throw new Error(`${entityName} ${id} no encontrado`);
      return item;
    },

    async create(data) {
      const db = initDB();
      if (!db[entityName]) db[entityName] = [];
      const newItem = { ...data, id: data.id || generateId(), created_date: data.created_date || new Date().toISOString() };
      db[entityName].push(newItem);
      saveDB(db);
      return newItem;
    },

    async update(id, data) {
      const db = initDB();
      const idx = (db[entityName] || []).findIndex(i => i.id === id);
      if (idx === -1) throw new Error(`${entityName} ${id} no encontrado`);
      db[entityName][idx] = { ...db[entityName][idx], ...data };
      saveDB(db);
      return db[entityName][idx];
    },

    async delete(id) {
      const db = initDB();
      db[entityName] = (db[entityName] || []).filter(i => i.id !== id);
      saveDB(db);
      return { success: true };
    }
  };
}

// ─── Token de sesión demo ──────────────────────────────────────────────────
const TOKEN_KEY = 'padelzone_token';
const SESSION_USER_KEY = 'padelzone_session_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
  }
}

function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function setSessionUser(user) {
  if (user) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_USER_KEY);
  }
}

// ─── Cliente de autenticación demo ────────────────────────────────────────
const demoAuth = {
  getToken,
  setToken,

  async me() {
    const token = getToken();
    if (!token) throw new Error('No token found');
    const sessionUser = getSessionUser();
    if (!sessionUser) throw new Error('Sesión expirada');
    return sessionUser;
  },

  async loginViaEmailPassword(email, password) {
    const emailNorm = (email || '').trim().toLowerCase();
    const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === emailNorm);

    if (!demoUser) {
      throw new Error(`Usuario "${emailNorm}" no encontrado. Verificá el correo electrónico.`);
    }

    if (password !== demoUser.password) {
      throw new Error('Contraseña incorrecta. Recordá que la contraseña es: demo123');
    }

    // Crear token simple (sin btoa para evitar problemas con caracteres)
    const token = `demo_token_${demoUser.id}_${Date.now()}`;

    // Construir objeto usuario sin el campo password
    const userObj = {
      id: demoUser.id,
      email: demoUser.email,
      full_name: demoUser.full_name,
      role: demoUser.role,
      level: demoUser.level,
      bio: demoUser.bio,
      avatar_url: demoUser.avatar_url,
      created_date: demoUser.created_date
    };

    setToken(token);
    setSessionUser(userObj);
    return userObj;
  },

  async register({ email, password, full_name, role }) {
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('Ya existe una cuenta con este correo.');

    const db = initDB();
    const newUser = {
      id: generateId(),
      email,
      full_name,
      role: role || 'player',
      level: 'principiante',
      bio: '',
      avatar_url: null,
      created_date: new Date().toISOString()
    };

    // Guardar en DB local
    db.User.push(newUser);
    saveDB(db);

    // También agregar a la lista runtime (para esta sesión)
    DEMO_USERS.push({ ...newUser, password });

    const token = btoa(`${email}:${Date.now()}`);
    setToken(token);
    setSessionUser(newUser);
    return { user: newUser, access_token: token };
  },

  async updateMe(data) {
    const sessionUser = getSessionUser();
    if (!sessionUser) throw new Error('No hay sesión activa.');
    const updated = { ...sessionUser, ...data };
    setSessionUser(updated);
    // También actualizar en DB
    const db = initDB();
    const idx = db.User.findIndex(u => u.id === sessionUser.id);
    if (idx !== -1) {
      db.User[idx] = { ...db.User[idx], ...data };
      saveDB(db);
    }
    return updated;
  },

  logout() {
    setToken(null);
    setSessionUser(null);
    window.location.hash = '#/login';
  },

  redirectToLogin() {
    window.location.hash = '#/login';
  },

  loginWithProvider() {
    // En demo no hay OAuth real, redirigir a login
    window.location.hash = '#/login';
    console.info('[Demo] OAuth no disponible en modo demo. Usá email/contraseña.');
  }
};

// ─── Cliente demo completo ─────────────────────────────────────────────────
export const demoBase44 = {
  entities: {
    User: makeDemoEntityClient('User'),
    Court: makeDemoEntityClient('Court'),
    Booking: makeDemoEntityClient('Booking'),
    Post: makeDemoEntityClient('Post'),
    Comment: makeDemoEntityClient('Comment'),
    ChatMessage: makeDemoEntityClient('ChatMessage'),
    Follow: makeDemoEntityClient('Follow'),
    Review: makeDemoEntityClient('Review')
  },
  auth: demoAuth,
  integrations: {
    Core: {
      async SendEmail(payload) {
        console.info('📧 [Demo] Email simulado a:', payload.to, payload.subject);
        return { success: true };
      },
      async UploadFile({ file }) {
        // En modo demo, devolver una URL de placeholder
        return { url: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop` };
      }
    }
  }
};
