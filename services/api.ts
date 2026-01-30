import { Notice, UserProfile, Role } from '../types';
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
  content?: string;
  read_time: string;   
  author: string;
  publish_date: string; 
}

export interface Seller {
  id?: number;
  name: string;
  avatar: string;
  ranking: number;
}

export type FileType = 'folder' | 'pdf' | 'doc' | 'xls' | 'img' | 'video' | 'other';

export interface DocItem {
  id: number;
  parent_id: number | null;
  name: string;
  type: FileType;
  size?: string;
  created_at: string;
  url?: string;
  storage_path?: string;
}

// --- SERVICE LAYER ---

export const api = {
  isSupabaseConnected: () => !!supabase,

  // --- USERS & ROLES ---
  getRoles: async (): Promise<Role[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('roles').select('*').order('name');
    if (error) return [];
    return data;
  },

  getUsers: async (): Promise<UserProfile[]> => {
    if (!supabase) return [];
    try {
      // Fetch profiles with their associated roles through the user_roles junction table
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role_id,
            roles (
              id,
              name,
              color
            )
          )
        `);
      
      if (error) throw error;
      
      return (data || []).map(profile => ({
        ...profile,
        roles: profile.user_roles?.map((ur: any) => ur.roles) || []
      }));
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },

  createUserProfile: async (userData: Partial<UserProfile>, roleIds: number[]): Promise<boolean> => {
    if (!supabase) return false;
    try {
      // Note: Real user creation in auth.users requires admin API or specific edge function.
      // Here we manage the profile and roles linking.
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id || undefined, // If creating new, auth id would come from a trigger or edge function
          name: userData.name,
          last_name: userData.last_name,
          email: userData.email,
          position: userData.position,
          avatar_url: userData.avatar_url
        })
        .select()
        .single();
      
      if (pError) throw pError;

      // Update roles in junction table
      if (roleIds.length > 0) {
        // Clear existing
        await supabase.from('user_roles').delete().eq('user_id', profile.id);
        // Insert new ones
        const rolePayload = roleIds.map(rid => ({ user_id: profile.id, role_id: rid }));
        const { error: rError } = await supabase.from('user_roles').insert(rolePayload);
        if (rError) throw rError;
      }

      return true;
    } catch (err) {
      console.error("Error upserting user:", err);
      return false;
    }
  },

  // --- ASSOCIATES ---
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

  getNoticeById: async (id: string): Promise<Notice | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('notices').select('*').eq('id', parseInt(id)).single();
      if (error) throw error;
      return { ...data, id: data.id.toString() };
    } catch (err) {
      console.error("API Error getNoticeById:", err);
      return null;
    }
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
      const { data, error } = await supabase.from('sellers').select('*').order('ranking', { ascending: true });
      if (!error && data) return data;
    }
    return [];
  },

  upsertSeller: async (seller: Partial<Seller>): Promise<Seller | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('sellers').upsert(seller).select().single();
    if (error) throw error;
    return data;
  },

  deleteSeller: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('sellers').delete().eq('id', id);
    return !error;
  },

  // --- DOCUMENTATION ---

  getDocuments: async (parentId: number | null): Promise<DocItem[]> => {
    if (!supabase) return [];
    try {
      let query = supabase.from('documents').select('*').order('type', { ascending: true }).order('name', { ascending: true }); 
      
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((d: any) => ({
          ...d,
          created_at: new Date(d.created_at).toLocaleDateString('es-ES')
      }));
    } catch (err) {
      console.error("Error fetching documents:", err);
      return [];
    }
  },

  createFolder: async (name: string, parentId: number | null): Promise<DocItem | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('documents').insert({
      name,
      type: 'folder',
      parent_id: parentId
    }).select().single();
    
    if (error) {
      console.error("Error creating folder:", error);
      return null;
    }
    return data;
  },

  uploadFile: async (file: File, parentId: number | null): Promise<DocItem | null> => {
    if (!supabase) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`; 
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documentation')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documentation')
        .getPublicUrl(filePath);

      let type: FileType = 'other';
      if (['pdf'].includes(fileExt?.toLowerCase() || '')) type = 'pdf';
      else if (['doc', 'docx'].includes(fileExt?.toLowerCase() || '')) type = 'doc';
      else if (['xls', 'xlsx', 'csv'].includes(fileExt?.toLowerCase() || '')) type = 'xls';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt?.toLowerCase() || '')) type = 'img';
      else if (['mp4', 'mov'].includes(fileExt?.toLowerCase() || '')) type = 'video';

      const sizeMB = file.size / (1024 * 1024);
      const sizeStr = sizeMB < 1 ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMB.toFixed(1)} MB`;

      const { data, error: dbError } = await supabase.from('documents').insert({
        name: file.name,
        type,
        size: sizeStr,
        parent_id: parentId,
        url: publicUrl,
        storage_path: filePath
      }).select().single();

      if (dbError) throw dbError;

      return {
          ...data,
          created_at: new Date(data.created_at).toLocaleDateString('es-ES')
      };

    } catch (err) {
      console.error("Error uploading file:", err);
      return null;
    }
  },

  deleteDocument: async (doc: DocItem): Promise<boolean> => {
    if (!supabase) return false;
    try {
        if (doc.type !== 'folder' && doc.storage_path) {
            const { error: storageError } = await supabase.storage
                .from('documentation')
                .remove([doc.storage_path]);
            
            if (storageError) console.warn("Could not delete file from bucket", storageError);
        }

        const { error } = await supabase.from('documents').delete().eq('id', doc.id);
        if (error) throw error;
        
        return true;
    } catch (err) {
        console.error("Error deleting document:", err);
        return false;
    }
  }
};