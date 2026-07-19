import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Crear directorio data si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Datos semilla por defecto
const initialSeed = {
  User: [
    {
      id: "demo-user-1",
      email: "demo@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2", // demo123
      full_name: "Martín Gómez",
      role: "player",
      level: "intermedio",
      bio: "Jugador apasionado del pádel 🎾 | Buenos Aires",
      avatar_url: null,
      created_date: "2024-06-01T10:00:00Z"
    },
    {
      id: "owner-user-1",
      email: "carlos.owner@mail.com",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2", // demo123
      full_name: "Carlos Rodríguez",
      role: "court_owner",
      level: "intermedio",
      bio: "Dueño de PadelClub Norte",
      avatar_url: null,
      mp_alias: "PADELZONE.CARLOS.MP",
      mp_cbu: "0000003100012345678901",
      mp_verified: true,
      created_date: "2024-04-15T08:00:00Z"
    },
    {
      id: "user-sofia-1",
      email: "sofia.rossi@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Sofía Rossi",
      role: "player",
      level: "avanzado",
      bio: "Jugadora de revés ⚡ Campeona del Torneo Córdoba 2024. Busco pareja de revés/drive para torneos.",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      created_date: "2024-05-10T10:00:00Z"
    },
    {
      id: "user-lucas-2",
      email: "lucas.benitez@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Lucas Benítez",
      role: "player",
      level: "intermedio",
      bio: "Entrenando 3 veces por semana 🎾 Fanático de la víbora y del juego agresivo en la red.",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      created_date: "2024-05-12T11:30:00Z"
    },
    {
      id: "user-valen-3",
      email: "valentina.m@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Valentina Morales",
      role: "player",
      level: "profesional",
      bio: "Profesora e instructora certificada de pádel 🏆 Clases particulares e intensivos en Córdoba.",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      created_date: "2024-05-14T09:15:00Z"
    },
    {
      id: "user-mateo-4",
      email: "mateo.silveira@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Mateo Silveira",
      role: "player",
      level: "principiante",
      bio: "Recién arrancando en este hermoso deporte 🙌 Buscando partidos amistosos para sumar ritmo.",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      created_date: "2024-05-18T14:20:00Z"
    },
    {
      id: "user-camila-5",
      email: "camila.navarro@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Camila Navarro",
      role: "player",
      level: "intermedio",
      bio: "Zurdita de drive ⚡ Siempre lista para sumar un partido exprés de 5ta categoría.",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      created_date: "2024-05-20T16:45:00Z"
    },
    {
      id: "user-joaquin-6",
      email: "joaquin.peralta@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Joaquín Peralta",
      role: "player",
      level: "avanzado",
      bio: "Jugador de revés agresivo 🔥 Amante de las bajadas de pared y saques con efecto.",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
      created_date: "2024-05-22T18:00:00Z"
    },
    {
      id: "user-mariana-7",
      email: "mariana.lopez@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Mariana López",
      role: "court_owner",
      level: "intermedio",
      bio: "Coordinadora de eventos y torneos de fin de semana en PadelZone Córdoba 🎾",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      created_date: "2024-05-25T12:00:00Z"
    },
    {
      id: "user-gonzalo-8",
      email: "gonzalo.fernandez@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Gonzalo Fernández",
      role: "player",
      level: "avanzado",
      bio: "Drive táctico 🧠 10 años en el circuito amateur. Apasionado por la táctica y estrategia de juego.",
      avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop",
      created_date: "2024-05-28T15:30:00Z"
    },
    {
      id: "user-flor-9",
      email: "flor.diaz@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Florencia Díaz",
      role: "player",
      level: "principiante",
      bio: "Perfeccionando el remate por 3 🚀 Fan del pádel femenino y de armar partidos mixtos.",
      avatar_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      created_date: "2024-06-01T08:20:00Z"
    },
    {
      id: "user-diego-10",
      email: "diego.romero@padelzone.app",
      password_hash: "$2a$10$DOxKstAfXSeM72PwIFJYrObaWvWN0Kdy2Fc4QwIUC2TEkJGzOOIl2",
      full_name: "Diego Romero",
      role: "player",
      level: "intermedio",
      bio: "Jugador de fin de semana 🍺 Gran nivel de pádel y el mejor tercer tiempo garantizado.",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      created_date: "2024-06-03T19:10:00Z"
    }
  ],
  Court: [
    {
      id: "court-1",
      name: "PadelClub Nueva Córdoba",
      description: "Cancha techada con piso de césped sintético premium. Vestuarios modernos, estacionamiento y bar.",
      address: "Av. Hipólito Yrigoyen 650, Nueva Córdoba",
      price_per_hour: 12000,
      surface_type: "cesped_sintetico",
      is_active: true,
      is_covered: true,
      owner_email: "carlos.owner@mail.com",
      latitude: -31.4167,
      longitude: -64.1895,
      image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
      created_date: "2024-01-10T08:00:00Z"
    },
    {
      id: "court-2",
      name: "Padel Güemes",
      description: "Complejo de 4 canchas al aire libre. Iluminación LED para jugar de noche toda la semana.",
      address: "Bv. San Juan 1200, Güemes, Córdoba",
      price_per_hour: 8500,
      surface_type: "cristal",
      is_active: true,
      is_covered: false,
      owner_email: "carlos.owner@mail.com",
      latitude: -31.4098,
      longitude: -64.1820,
      image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop",
      created_date: "2024-02-05T09:00:00Z"
    },
    {
      id: "court-3",
      name: "Urban Padel Alberdi",
      description: "La cancha más moderna del barrio. Piso de césped de última generación y equipamiento top.",
      address: "Av. Colón 3200, Alberdi, Córdoba",
      price_per_hour: 15000,
      surface_type: "cesped_sintetico",
      is_active: true,
      is_covered: false,
      owner_email: "carlos.owner@mail.com",
      latitude: -31.4052,
      longitude: -64.2010,
      image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
      created_date: "2024-03-01T10:00:00Z"
    }
  ],
  Booking: [],
  Post: [
    {
      id: "post-mariana-1",
      author_email: "mariana.lopez@padelzone.app",
      author_name: "Mariana López",
      author_avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      content: "🏆 ¡Abiertas las inscripciones para el Torneo Abierto PadelZone! Categorías 4ta, 5ta y 6ta. Premios e indumentaria oficial para los ganadores.",
      image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
      likes: ["gonzalo.fernandez@padelzone.app", "sofia.rossi@padelzone.app", "joaquin.peralta@padelzone.app"],
      comments_count: 2,
      created_date: "2026-07-17T12:56:30.027Z"
    },
    {
      id: "post-camila-1",
      author_email: "camila.navarro@padelzone.app",
      author_name: "Camila Navarro",
      author_avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      content: "¡Se busca 1 jugador/a para hoy a las 20:00 hs en Urban Padel Alberdi! 🎾 Nivel intermedio (5ta categoría). ¡Sumense!",
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      likes: ["diego.romero@padelzone.app", "lucas.benitez@padelzone.app"],
      comments_count: 2,
      created_date: "2026-07-18T06:56:30.027Z"
    },
    {
      id: "post-valen-1",
      author_email: "valentina.m@padelzone.app",
      author_name: "Valentina Morales",
      author_avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      content: "💡 Tip del día: El 70% de los puntos en pádel se ganan dominando la red. No te quedes en tierra de nadie entre la pared y la cinta.",
      image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop",
      likes: ["demo@padelzone.app", "mateo.silveira@padelzone.app", "camila.navarro@padelzone.app", "flor.diaz@padelzone.app"],
      comments_count: 3,
      created_date: "2026-07-18T12:56:30.027Z"
    },
    {
      id: "post-lucas-1",
      author_email: "lucas.benitez@padelzone.app",
      author_name: "Lucas Benítez",
      author_avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      content: "Probando la nueva pala Bullpadel Vertex 04 💥 Increíble el control en las voleas y la potencia en el remate por 3.",
      image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&h=600&fit=crop",
      likes: ["sofia.rossi@padelzone.app", "joaquin.peralta@padelzone.app"],
      comments_count: 2,
      created_date: "2026-07-19T00:56:30.027Z"
    },
    {
      id: "post-sofia-1",
      author_email: "sofia.rossi@padelzone.app",
      author_name: "Sofía Rossi",
      author_avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      content: "¡Tremendo partido hoy en PadelClub Nueva Córdoba! 🎾 Gran nivel de juego en las semifinales. ¡Felicitaciones a los rivales!",
      image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop",
      likes: ["demo@padelzone.app", "lucas.benitez@padelzone.app", "valentina.m@padelzone.app"],
      comments_count: 2,
      created_date: "2026-07-19T07:56:30.026Z"
    },
    {
      id: "post-1",
      author_email: "carlos.owner@mail.com",
      author_name: "Carlos Rodríguez",
      content: "¡Bienvenidos a PadelZone! Nuevos horarios disponibles para esta semana.",
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      likes: [],
      comments_count: 0,
      created_date: "2026-07-19T00:59:34.665Z"
    }
  ],
  Comment: [
    {
      id: "comm-1",
      post_id: "post-sofia-1",
      author_email: "lucas.benitez@padelzone.app",
      author_name: "Lucas Benítez",
      author_avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      content: "¡Gran partido Sofi! La próxima te jugamos el la revancha en Padel Güemes.",
      created_date: "2026-07-19T08:56:30.027Z"
    },
    {
      id: "comm-2",
      post_id: "post-sofia-1",
      author_email: "demo@padelzone.app",
      author_name: "Martín Gómez",
      author_avatar_url: null,
      content: "¡Excelente jugada en el tiebreak!",
      created_date: "2026-07-19T09:56:30.027Z"
    },
    {
      id: "comm-3",
      post_id: "post-lucas-1",
      author_email: "joaquin.peralta@padelzone.app",
      author_name: "Joaquín Peralta",
      author_avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
      content: "Esa pala tiene un punto dulce enorme, felicitaciones.",
      created_date: "2026-07-19T02:56:30.027Z"
    },
    {
      id: "comm-4",
      post_id: "post-valen-1",
      author_email: "mateo.silveira@padelzone.app",
      author_name: "Mateo Silveira",
      author_avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      content: "¡Muy buen consejo Profe! Lo pongo en práctica hoy mismo.",
      created_date: "2026-07-18T16:56:30.027Z"
    },
    {
      id: "comm-5",
      post_id: "post-camila-1",
      author_email: "diego.romero@padelzone.app",
      author_name: "Diego Romero",
      author_avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      content: "¡Anotame Cami! Voy directo desde el trabajo.",
      created_date: "2026-07-18T08:56:30.027Z"
    }
  ],
  ChatMessage: [
    {
      id: "msg-1",
      sender_email: "sofia.rossi@padelzone.app",
      receiver_email: "demo@padelzone.app",
      content: "¡Hola Martín! ¿Cómo estás? Vi que jugás en nivel intermedio. ¿Te prendés a un partido el jueves?",
      is_read: true,
      created_date: "2026-07-19T10:56:30.027Z"
    },
    {
      id: "msg-2",
      sender_email: "demo@padelzone.app",
      receiver_email: "sofia.rossi@padelzone.app",
      content: "¡Hola Sofi! Sí totalmente, me viene re bien el jueves después de las 19hs.",
      is_read: true,
      created_date: "2026-07-19T11:56:30.027Z"
    },
    {
      id: "msg-3",
      sender_email: "lucas.benitez@padelzone.app",
      receiver_email: "demo@padelzone.app",
      content: "Buenas Tincho, ¿tenés lugar para armar un dobles este sábado?",
      is_read: true,
      created_date: "2026-07-19T06:56:30.027Z"
    },
    {
      id: "msg-4",
      sender_email: "valentina.m@padelzone.app",
      receiver_email: "demo@padelzone.app",
      content: "Hola Martín! Recuerda que tenemos clase táctica mañana a las 18hs en Padel Güemes.",
      is_read: true,
      created_date: "2026-07-19T04:56:30.027Z"
    },
    {
      id: "msg-5",
      sender_email: "camila.navarro@padelzone.app",
      receiver_email: "demo@padelzone.app",
      content: "¡Hola! ¿Buscás pareja para el torneo mixto del próximo mes?",
      is_read: false,
      created_date: "2026-07-18T22:56:30.027Z"
    },
    {
      id: "msg-6",
      sender_email: "gonzalo.fernandez@padelzone.app",
      receiver_email: "demo@padelzone.app",
      content: "Gran partido el del otro día hermano, esas voleas estuvieron impecables.",
      is_read: true,
      created_date: "2026-07-18T12:56:30.027Z"
    }
  ],
  Follow: [],
  Review: []
};

// Cargar o inicializar la base de datos
let dbData = { ...initialSeed };

function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
    } catch (err) {
      console.error('Error leyendo base de datos, reiniciando semilla:', err);
      saveDb();
    }
  } else {
    saveDb();
  }
}

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
}

loadDb();

/** Motor de base de datos genérico */
export const db = {
  getCollection(entityName) {
    if (!dbData[entityName]) {
      dbData[entityName] = [];
      saveDb();
    }
    return dbData[entityName];
  },

  list(entityName, sort, limit = 100) {
    let records = [...this.getCollection(entityName)];
    if (sort) {
      const desc = sort.startsWith('-');
      const field = desc ? sort.slice(1) : sort;
      records.sort((a, b) => {
        const va = a[field] ?? '';
        const vb = b[field] ?? '';
        if (va < vb) return desc ? 1 : -1;
        if (va > vb) return desc ? -1 : 1;
        return 0;
      });
    }
    return records.slice(0, limit);
  },

  filter(entityName, conditions = {}, sort, limit = 100) {
    let records = [...this.getCollection(entityName)];
    records = records.filter(record => {
      return Object.entries(conditions).every(([key, val]) => {
        if (Array.isArray(val)) {
          return val.includes(record[key]);
        }
        return record[key] === val;
      });
    });
    if (sort) {
      const desc = sort.startsWith('-');
      const field = desc ? sort.slice(1) : sort;
      records.sort((a, b) => {
        const va = a[field] ?? '';
        const vb = b[field] ?? '';
        if (va < vb) return desc ? 1 : -1;
        if (va > vb) return desc ? -1 : 1;
        return 0;
      });
    }
    return records.slice(0, limit);
  },

  getById(entityName, id) {
    const records = this.getCollection(entityName);
    return records.find(r => r.id === id) || null;
  },

  create(entityName, data) {
    const records = this.getCollection(entityName);
    const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newRecord = {
      id,
      created_date: new Date().toISOString(),
      ...data
    };
    records.unshift(newRecord);
    saveDb();
    return newRecord;
  },

  update(entityName, id, data) {
    const records = this.getCollection(entityName);
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...data };
      saveDb();
      return records[idx];
    }
    return null;
  },

  delete(entityName, id) {
    const records = this.getCollection(entityName);
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
      records.splice(idx, 1);
      saveDb();
      return { success: true };
    }
    return { success: false, error: 'Not found' };
  }
};
