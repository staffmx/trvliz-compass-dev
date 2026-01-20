import { Notice } from '../types';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// --- INTERFACES ---

export interface Associate {
  id?: number;
  name: string;
  last_name?: string;
  email: string;
  image: string;
  whatsapp?: string;
  position?: string;
  associate_type?: string;
  content?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  created_at?: string;
}

export interface Event {
  id?: number;
  type: 'Webinar' | 'Presencial' | 'Viaje' | 'Social' | 'Corporativo';
  title: string;
  description?: string;
  event_date: string; 
  month?: string;     
  day?: string;       
  time: string;
  link?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_email: string;
  created_at: string;
  associate_name?: string; // Virtual field for UI
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
}

export interface Seller {
  name: string;
  sales: string;
  avatar: string;
}

// --- SERVICE LAYER ---

export const api = {
  isSupabaseConnected: () => !!supabase,

  getAssociates: async (): Promise<Associate[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('associates').select('*').order('name', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("API Error getAssociates:", err);
      throw err;
    }
  },

  getAssociateById: async (id: number): Promise<Associate | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('associates').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("API Error getAssociateById:", err);
      return null;
    }
  },

  upsertAssociate: async (associate: Associate): Promise<Associate | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('associates').upsert(associate).select().single();
    if (error) throw error;
    return data;
  },

  deleteAssociate: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('associates').delete().eq('id', id);
    return !error;
  },

  getNotices: async (): Promise<Notice[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (!error && data) return data.map((d: any) => ({ ...d, id: d.id.toString() }));
    }
    return [];
  },

  upsertNotice: async (notice: Partial<Notice>): Promise<Notice | null> => {
    if (!supabase) return null;
    const payload = { ...notice };
    if (payload.id) {
      (payload as any).id = parseInt(payload.id);
    }
    const { data, error } = await supabase.from('notices').upsert(payload).select().single();
    if (error) throw error;
    return { ...data, id: data.id.toString() };
  },

  deleteNotice: async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('notices').delete().eq('id', parseInt(id));
    return !error;
  },

  getEvents: async (): Promise<Event[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').order('event_date');
      if (!error && data) {
        return data.map((e: any) => {
          const dateObj = new Date(e.event_date + 'T00:00:00');
          return {
            ...e,
            day: dateObj.getDate().toString().padStart(2, '0'),
            month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
          };
        });
      }
    }
    return [];
  },

  getEventById: async (id: number): Promise<Event | null> => {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (!error && data) {
        const dateObj = new Date(data.event_date + 'T00:00:00');
        return {
          ...data,
          day: dateObj.getDate().toString().padStart(2, '0'),
          month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
        };
      }
    }
    return null;
  },

  upsertEvent: async (event: Partial<Event>): Promise<Event | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('events').upsert(event).select().single();
    if (error) throw error;
    const dateObj = new Date(data.event_date + 'T00:00:00');
    return {
      ...data,
      day: dateObj.getDate().toString().padStart(2, '0'),
      month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
    };
  },

  deleteEvent: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('events').delete().eq('id', id);
    return !error;
  },

  // --- EVENT REGISTRATIONS ---
  registerForEvent: async (eventId: number, userEmail: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('event_registrations').insert({
        event_id: eventId,
        user_email: userEmail
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error registering for event:", err);
      return false;
    }
  },

  checkEventRegistration: async (eventId: number, userEmail: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_email', userEmail);
      if (error) throw error;
      return data && data.length > 0;
    } catch (err) {
      console.error("Error checking registration:", err);
      return false;
    }
  },

  getEventRegistrations: async (eventId: number): Promise<EventRegistration[]> => {
    if (!supabase) return [];
    try {
      // Obtenemos los registros y cruzamos con asociados para tener nombres
      const { data: regs, error: regError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId);
      
      if (regError) throw regError;
      
      const { data: associates, error: assocError } = await supabase
        .from('associates')
        .select('name, last_name, email');
      
      if (assocError) throw assocError;

      return (regs || []).map(r => {
        const assoc = associates.find(a => a.email === r.user_email);
        return {
          ...r,
          associate_name: assoc ? `${assoc.name} ${assoc.last_name || ''}` : 'Usuario Externo'
        };
      });
    } catch (err) {
      console.error("Error fetching event registrations:", err);
      return [];
    }
  },

  getBlogPosts: async (limit?: number): Promise<BlogPost[]> => {
    if (supabase) {
      let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    return [];
  },

  getTopSellers: async (): Promise<Seller[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('sellers').select('*').order('sales', { ascending: false });
      if (!error && data) return data;
    }
    return [];
  }
};