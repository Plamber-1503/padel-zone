// ─── Mock Data ────────────────────────────────────────────────────────────────
// Datos simulados para el modo demo (VITE_MOCK_MODE=true).
// No se usa en producción.

export const MOCK_USER = {
  id: "demo-user-1",
  email: "demo@padelzone.app",
  full_name: "Martín Gómez",
  role: "player",
  level: "intermedio",
  bio: "Jugador apasionado del pádel 🎾 | Buenos Aires",
  avatar_url: null,
  created_date: "2024-06-01T10:00:00Z",
};

export const mockUsers = [
  MOCK_USER,
  {
    id: "user-2",
    email: "lucia.fernandez@mail.com",
    full_name: "Lucía Fernández",
    role: "player",
    level: "avanzado",
    bio: "Campeona provincial 2023 🏆",
    avatar_url: null,
    created_date: "2024-05-10T09:00:00Z",
  },
  {
    id: "user-3",
    email: "carlos.owner@mail.com",
    full_name: "Carlos Rodríguez",
    role: "court_owner",
    level: "intermedio",
    bio: "Dueño de PadelClub Norte",
    avatar_url: null,
    created_date: "2024-04-15T08:00:00Z",
  },
  {
    id: "user-4",
    email: "sofia.torres@mail.com",
    full_name: "Sofía Torres",
    role: "player",
    level: "principiante",
    bio: "Aprendiendo a jugar 🎾",
    avatar_url: null,
    created_date: "2024-06-20T11:00:00Z",
  },
  {
    id: "user-5",
    email: "pablo.rios@mail.com",
    full_name: "Pablo Ríos",
    role: "player",
    level: "avanzado",
    bio: "Instrúctor certificado | DT de academia",
    avatar_url: null,
    created_date: "2024-03-01T07:00:00Z",
  },
];

export const mockCourts = [
  {
    id: "court-1",
    name: "PadelClub Nueva Córdoba",
    description: "Cancha techada con piso de césped sintético premium. Vestuarios modernos, estacionamiento y bar.",
    address: "Av. Hipólito Yrigoyen 650, Nueva Córdoba",
    price_per_hour: 12000,
    is_active: true,
    is_covered: true,
    owner_email: "carlos.owner@mail.com",
    latitude: -31.4167,
    longitude: -64.1895,
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop"
    ],
    amenities: ["Estacionamiento", "Vestuarios", "Bar", "Wi-Fi"],
    rating: 4.8,
    review_count: 34,
    created_date: "2024-01-10T08:00:00Z",
  },
  {
    id: "court-2",
    name: "Padel Güemes",
    description: "Complejo de 4 canchas al aire libre. Iluminación LED para jugar de noche toda la semana.",
    address: "Bv. San Juan 1200, Güemes, Córdoba",
    price_per_hour: 8500,
    is_active: true,
    is_covered: false,
    owner_email: "carlos.owner@mail.com",
    latitude: -31.4098,
    longitude: -64.1820,
    image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop"
    ],
    amenities: ["Iluminación LED", "Alquiler de paletas"],
    rating: 4.5,
    review_count: 21,
    created_date: "2024-02-05T09:00:00Z",
  },
  {
    id: "court-3",
    name: "Urban Padel Alberdi",
    description: "La cancha más moderna del barrio. Piso de césped de última generación y equipamiento top.",
    address: "Av. Colón 3200, Alberdi, Córdoba",
    price_per_hour: 15000,
    is_active: true,
    is_covered: false,
    owner_email: "carlos.owner@mail.com",
    latitude: -31.4052,
    longitude: -64.2010,
    image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&h=400&fit=crop"
    ],
    amenities: ["Estacionamiento", "Vestuarios", "Café", "Pro Shop"],
    rating: 4.9,
    review_count: 58,
    created_date: "2024-03-01T10:00:00Z",
  },
  {
    id: "court-4",
    name: "Padel Express General Paz",
    description: "Canchas económicas en el corazón de General Paz. Ideal para entrenar entre semana.",
    address: "Av. Vélez Sarsfield 4100, General Paz, Córdoba",
    price_per_hour: 7000,
    is_active: true,
    is_covered: false,
    owner_email: "carlos.owner@mail.com",
    latitude: -31.4310,
    longitude: -64.1930,
    image_url: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop"
    ],
    amenities: ["Alquiler de paletas"],
    rating: 4.2,
    review_count: 15,
    created_date: "2024-04-10T11:00:00Z",
  },
  {
    id: "court-5",
    name: "Córdoba Padel Center",
    description: "El complejo más grande de Córdoba. 6 canchas, pileta, restaurante y academia de pádel.",
    address: "Av. Rafael Núñez 4800, Cerro de las Rosas, Córdoba",
    price_per_hour: 18000,
    is_active: true,
    is_covered: true,
    owner_email: "carlos.owner@mail.com",
    latitude: -31.3820,
    longitude: -64.2250,
    image_url: "https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&h=400&fit=crop"
    ],
    amenities: ["Pileta", "Restaurante", "Academia", "Estacionamiento", "Wi-Fi"],
    rating: 5.0,
    review_count: 102,
    created_date: "2023-12-01T08:00:00Z",
  },
];

const today = new Date();

const fmtDate = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const mockBookings = [
  {
    id: "booking-1",
    court_id: "court-1",
    court_name: "PadelClub Norte",
    player_email: "demo@padelzone.app",
    player_name: "Martín Gómez",
    owner_email: "carlos.owner@mail.com",
    date: fmtDate(addDays(today, 2)),
    time_slot: "18:00",
    status: "confirmada",
    payment_status: "pagado_total",
    total_price: 12000,
    deposit_amount: 3600,
    remaining_amount: 0,
    notes: "",
    created_date: new Date().toISOString(),
  },
  {
    id: "booking-2",
    court_id: "court-3",
    court_name: "Urban Padel",
    player_email: "demo@padelzone.app",
    player_name: "Martín Gómez",
    owner_email: "carlos.owner@mail.com",
    date: fmtDate(addDays(today, 5)),
    time_slot: "20:00",
    status: "pendiente_aprobacion",
    payment_status: "deposito_pagado",
    total_price: 15000,
    deposit_amount: 4500,
    remaining_amount: 10500,
    payment_deadline: addDays(today, 4).toISOString(),
    notes: "Somos 4 jugadores",
    created_date: new Date().toISOString(),
  },
  {
    id: "booking-3",
    court_id: "court-2",
    court_name: "Padel Sur Club",
    player_email: "demo@padelzone.app",
    player_name: "Martín Gómez",
    owner_email: "carlos.owner@mail.com",
    date: fmtDate(addDays(today, -7)),
    time_slot: "10:00",
    status: "confirmada",
    payment_status: "pagado_total",
    total_price: 8500,
    deposit_amount: 2550,
    remaining_amount: 0,
    notes: "",
    created_date: addDays(today, -8).toISOString(),
  },
];

export const mockPosts = [
  {
    id: "post-1",
    author_email: "lucia.fernandez@mail.com",
    author_name: "Lucía Fernández",
    content: "¡Increíble partido hoy en Urban Padel! 3 sets de puro fuego 🔥 Gracias a mis compañeros de siempre. ¿Alguien quiere sumarse el próximo finde?",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    likes: ["pablo.rios@mail.com", "sofia.torres@mail.com", "carlos.owner@mail.com"],
    comments_count: 2,
    created_date: addDays(today, -1).toISOString(),
  },
  {
    id: "post-2",
    author_email: "pablo.rios@mail.com",
    author_name: "Pablo Ríos",
    content: "Tip de la semana 🎾: Para mejorar tu remate, el secreto está en la posición de los pies ANTES de golpear. La mayoría de los errores no son de brazo, son de movimiento previo. ¿Preguntas? 👇",
    image_url: null,
    likes: ["demo@padelzone.app", "lucia.fernandez@mail.com", "sofia.torres@mail.com"],
    comments_count: 1,
    created_date: addDays(today, -2).toISOString(),
  },
  {
    id: "post-3",
    author_email: "sofia.torres@mail.com",
    author_name: "Sofía Torres",
    content: "¡Primera clase hoy y ya me enamoré del pádel! 😍 Gracias Pablo por la paciencia. El año que viene ya competimos jajaja",
    image_url: "https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=600&h=400&fit=crop",
    likes: ["demo@padelzone.app", "lucia.fernandez@mail.com"],
    comments_count: 1,
    created_date: addDays(today, -3).toISOString(),
  },
  {
    id: "post-4",
    author_email: "demo@padelzone.app",
    author_name: "Martín Gómez",
    content: "¡Qué buenas canchas las de PadelClub Norte! Sin dudas el mejor piso que jugué este año. Ya reservé para el próximo sábado 🙌",
    image_url: null,
    likes: ["lucia.fernandez@mail.com"],
    comments_count: 1,
    created_date: addDays(today, -5).toISOString(),
  },
];

export const mockComments = [
  { id: "c-1", post_id: "post-1", author_email: "demo@padelzone.app", author_name: "Martín Gómez", content: "¡Que viaje! Cuenten conmigo el próximo finde 🙋", created_date: addDays(today, -1).toISOString() },
  { id: "c-2", post_id: "post-1", author_email: "pablo.rios@mail.com", author_name: "Pablo Ríos", content: "Siempre un placer jugar con vos Lucía!", created_date: addDays(today, -1).toISOString() },
  { id: "c-3", post_id: "post-2", author_email: "sofia.torres@mail.com", author_name: "Sofía Torres", content: "Clarísimo el tip, lo voy a practicar!", created_date: addDays(today, -2).toISOString() },
  { id: "c-4", post_id: "post-4", author_email: "lucia.fernandez@mail.com", author_name: "Lucía Fernández", content: "Totalmente de acuerdo, ese piso es una maravilla!", created_date: addDays(today, -5).toISOString() },
];

export const mockChatMessages = [
  { id: "msg-1", sender_email: "lucia.fernandez@mail.com", receiver_email: "demo@padelzone.app", content: "Hola Martín! ¿Jugamos esta semana?", is_read: true, created_date: addDays(today, -1).toISOString() },
  { id: "msg-2", sender_email: "demo@padelzone.app", receiver_email: "lucia.fernandez@mail.com", content: "¡Claro! Tengo el miércoles libre", is_read: true, created_date: addDays(today, -1).toISOString() },
  { id: "msg-3", sender_email: "lucia.fernandez@mail.com", receiver_email: "demo@padelzone.app", content: "Perfecto, reservo en Urban Padel a las 18?", is_read: true, created_date: addDays(today, -1).toISOString() },
  { id: "msg-4", sender_email: "pablo.rios@mail.com", receiver_email: "demo@padelzone.app", content: "Martín, ¿te interesa una clase de perfeccionamiento?", is_read: false, created_date: addDays(today, -2).toISOString() },
];

export const mockFollows = [
  { id: "f-1", follower_email: "demo@padelzone.app", following_email: "lucia.fernandez@mail.com", created_date: addDays(today, -10).toISOString() },
  { id: "f-2", follower_email: "demo@padelzone.app", following_email: "pablo.rios@mail.com", created_date: addDays(today, -15).toISOString() },
  { id: "f-3", follower_email: "lucia.fernandez@mail.com", following_email: "demo@padelzone.app", created_date: addDays(today, -8).toISOString() },
  { id: "f-4", follower_email: "sofia.torres@mail.com", following_email: "demo@padelzone.app", created_date: addDays(today, -3).toISOString() },
];

export const mockReviews = [
  { id: "r-1", court_id: "court-1", booking_id: "booking-3", author_email: "demo@padelzone.app", author_name: "Martín Gómez", rating: 5, comment: "Excelente cancha, muy bien mantenida.", created_date: addDays(today, -6).toISOString() },
  { id: "r-2", court_id: "court-1", booking_id: "other-booking", author_email: "lucia.fernandez@mail.com", author_name: "Lucía Fernández", rating: 5, comment: "El mejor piso de la ciudad.", created_date: addDays(today, -20).toISOString() },
  { id: "r-3", court_id: "court-3", booking_id: "other-booking-2", author_email: "pablo.rios@mail.com", author_name: "Pablo Ríos", rating: 5, comment: "Instalaciones de primer nivel.", created_date: addDays(today, -12).toISOString() },
];
