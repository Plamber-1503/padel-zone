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
      id: "post-1",
      author_email: "carlos.owner@mail.com",
      author_name: "Carlos Rodríguez",
      content: "¡Bienvenidos a PadelZone! Nuevos horarios disponibles para esta semana.",
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      likes: [],
      comments_count: 0,
      created_date: new Date().toISOString()
    }
  ],
  Comment: [],
  ChatMessage: [],
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
