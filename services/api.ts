import { Notice } from '../types';

export interface Event {
  id: number;
  title: string;
  date: string; // "2023-10-15"
  event_date: string; // "2023-10-15" for calendar matching
  month: string; // "OCT"
  day: string; // "15"
  time: string; // "10:00 AM"
  type: 'Webinar' | 'Viaje' | 'Evento';
  description?: string;
  link?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export interface Seller {
  id: number;
  name: string;
  avatar: string;
  ranking: number;
}

export interface Associate {
  id: number;
  name: string;
  last_name: string;
  email: string;
  position: string;
  image: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  associate_type?: string;
  content?: string;
}

// Mock Data
const MOCK_NOTICES: Notice[] = [
  { id: '1', title: 'Nueva Política de Viajes', date: 'Oct 12', content: 'Actualización en los montos de viáticos internacionales.', priority: 'high', category: 'Urgente' },
  { id: '2', title: 'Mantenimiento de Plataforma', date: 'Oct 15', content: 'El sistema estará inactivo de 2am a 4am.', priority: 'medium', category: 'General' },
  { id: '3', title: 'Webinar de Destinos', date: 'Oct 20', content: 'Aprende sobre las nuevas rutas a Asia.', priority: 'low', category: 'Capacitación' },
];

const MOCK_EVENTS: Event[] = [
  { id: 1, title: 'Lanzamiento Verano 2026', date: '2023-10-15', event_date: '2023-10-15', month: 'OCT', day: '15', time: '10:00 AM', type: 'Webinar', description: 'Presentación de la temporada.' },
  { id: 2, title: 'Fam Trip: Riviera Maya', date: '2023-10-22', event_date: '2023-10-22', month: 'OCT', day: '22', time: 'All Day', type: 'Viaje', description: 'Visita a hoteles 5 diamantes.' },
];

let MOCK_SELLERS: Seller[] = [
  { id: 1, name: 'Ana García', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', ranking: 1 },
  { id: 2, name: 'Carlos Ruiz', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', ranking: 2 },
  { id: 3, name: 'Elena Torres', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', ranking: 3 },
  { id: 4, name: 'David M.', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', ranking: 4 },
  { id: 5, name: 'Sofia L.', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', ranking: 5 },
];

const MOCK_BLOG_POSTS: BlogPost[] = [
  { id: 1, title: 'El Renacer del Lujo Sostenible', excerpt: 'Cómo los eco-lodges están redefiniendo la experiencia high-end.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070', category: 'Tendencias', date: '10 Oct 2023', readTime: '5 min', author: 'Maria S.' },
  { id: 2, title: 'Japón: Más allá de Tokio', excerpt: 'Rutas inexploradas para viajeros exigentes.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070', category: 'Destinos', date: '05 Oct 2023', readTime: '7 min', author: 'Juan P.' },
  { id: 3, title: 'Tecnología en Viajes Corporativos', excerpt: 'Herramientas que optimizan el tiempo de tus clientes.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070', category: 'Tech', date: '01 Oct 2023', readTime: '4 min', author: 'Ana G.' },
];

const MOCK_ASSOCIATES: Associate[] = [
  { id: 1, name: 'Lucia', last_name: 'Mendez', email: 'lucia@traveliz.com', position: 'Senior Travel Designer', image: 'https://randomuser.me/api/portraits/women/65.jpg', whatsapp: '1234567890' },
  { id: 2, name: 'Roberto', last_name: 'Diaz', email: 'roberto@traveliz.com', position: 'Agente Corporativo', image: 'https://randomuser.me/api/portraits/men/45.jpg', whatsapp: '0987654321' },
];

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getNotices: async (): Promise<Notice[]> => {
    await delay(500);
    return MOCK_NOTICES;
  },
  getEvents: async (): Promise<Event[]> => {
    await delay(500);
    return MOCK_EVENTS;
  },
  getEventById: async (id: number): Promise<Event | null> => {
    await delay(500);
    return MOCK_EVENTS.find(e => e.id === id) || null;
  },
  checkEventRegistration: async (eventId: number, email: string): Promise<boolean> => {
    await delay(500);
    // Mock random check
    return false; 
  },
  registerForEvent: async (eventId: number, email: string): Promise<boolean> => {
    await delay(800);
    return true;
  },
  getTopSellers: async (): Promise<Seller[]> => {
    await delay(500);
    return MOCK_SELLERS.sort((a, b) => a.ranking - b.ranking);
  },
  getBlogPosts: async (limit?: number): Promise<BlogPost[]> => {
    await delay(500);
    return limit ? MOCK_BLOG_POSTS.slice(0, limit) : MOCK_BLOG_POSTS;
  },
  getAssociates: async (): Promise<Associate[]> => {
    await delay(600);
    return MOCK_ASSOCIATES;
  },
  getAssociateById: async (id: number): Promise<Associate | null> => {
    await delay(500);
    return MOCK_ASSOCIATES.find(a => a.id === id) || null;
  },
  upsertSeller: async (seller: Partial<Seller>): Promise<Seller | null> => {
    await delay(800);
    if (seller.id) {
        // Update
        const index = MOCK_SELLERS.findIndex(s => s.id === seller.id);
        if (index !== -1) {
            MOCK_SELLERS[index] = { ...MOCK_SELLERS[index], ...seller } as Seller;
            return MOCK_SELLERS[index];
        }
        return null;
    } else {
        // Create
        const newSeller = { ...seller, id: Math.floor(Math.random() * 10000) } as Seller;
        MOCK_SELLERS.push(newSeller);
        return newSeller;
    }
  },
  deleteSeller: async (id: number): Promise<boolean> => {
    await delay(600);
    MOCK_SELLERS = MOCK_SELLERS.filter(s => s.id !== id);
    return true;
  }
};
