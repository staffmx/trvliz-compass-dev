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
  email: string;
  image: string;
  whatsapp?: string;
  position?: string;
}

export interface Event {
  id: number;
  type: 'Webinar' | 'Presencial' | 'Viaje' | 'Social' | 'Corporativo';
  title: string;
  date: string; 
  month: string;
  day: string;
  time: string;
  link?: string;
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

// --- MOCK DATABASE (Fallback) ---

const MOCK_ASSOCIATES: Associate[] = [
  { id: 1, name: "Alessandra Vianna", position: "Senior Travel Consultant", email: "alessandra.v@traveliz.com", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", whatsapp: "123456789" },
  { id: 2, name: "Julianne Moore", position: "Luxury Travel Specialist", email: "j.moore@traveliz.com", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", whatsapp: "987654321" }
];

// --- SERVICE LAYER ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getAssociates: async (): Promise<Associate[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('associates').select('*').order('name');
      if (!error && data) return data;
      console.error("Supabase Error:", error);
    }
    await delay(1000);
    return MOCK_ASSOCIATES;
  },

  upsertAssociate: async (associate: Associate): Promise<Associate | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('associates')
      .upsert(associate)
      .select()
      .single();
    if (error) {
      console.error("Error saving associate:", error);
      throw error;
    }
    return data;
  },

  deleteAssociate: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('associates')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Error deleting associate:", error);
      return false;
    }
    return true;
  },

  getNotices: async (): Promise<Notice[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    await delay(800);
    return [];
  },

  getEvents: async (): Promise<Event[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').order('event_date');
      if (!error && data) return data;
    }
    await delay(1000);
    return [];
  },

  getBlogPosts: async (limit?: number): Promise<BlogPost[]> => {
    if (supabase) {
      let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    await delay(1200);
    return [];
  },

  getTopSellers: async (): Promise<Seller[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('sellers').select('*').order('sales', { ascending: false });
      if (!error && data) return data;
    }
    await delay(700);
    return [];
  }
};