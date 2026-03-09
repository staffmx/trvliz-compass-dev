
import { Notice, UserProfile, Role, DocumentCategory, Document as DocType, Associate } from '../types';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// --- INTERFACES ---

export type WebinarCategory = 
  | "ONBOARDING TRAVELIZ - SESIONES DE FAMILIARIZACIÓN"
  | "ONBOARDING TRAVELIZ - SESIONES DE REFUERZO (TERRESTRE)"
  | "TEMAS GENERALES"
  | "HOTELES"
  | "DMC´s Y OTROS PROVEEDORES"
  | "DESTINOS"
  | "CERTIFICADO TRAVELIZ SAFARIS"
  | "CRUCEROS"
  | "TRAVELIZ - LUXURY CRUISES - PLAYBOOK";

export interface RecordedWebinar {
  id?: number;
  name: string;
  category: WebinarCategory;
  cover_image: string;
  access_link: string;
  access_code?: string;
  created_at?: string;
}

export const WEBINAR_CATEGORIES: WebinarCategory[] = [
  "ONBOARDING TRAVELIZ - SESIONES DE FAMILIARIZACIÓN",
  "ONBOARDING TRAVELIZ - SESIONES DE REFUERZO (TERRESTRE)",
  "TEMAS GENERALES",
  "HOTELES",
  "DMC´s Y OTROS PROVEEDORES",
  "DESTINOS",
  "CERTIFICADO TRAVELIZ SAFARIS",
  "CRUCEROS",
  "TRAVELIZ - LUXURY CRUISES - PLAYBOOK"
];


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

export interface MentorshipRequest {
  id?: number;
  user_id: string;
  name: string;
  email: string;
  tentative_date: string;
  topic: string;
  comments?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
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
  isSupabaseConnected: () => {
    if (!supabase) return false;
    // Simple verification
    return true;
  },

  // --- RECORDED WEBINARS ---
  getRecordedWebinars: async (): Promise<RecordedWebinar[]> => {
    if (!supabase) {
        console.error("Supabase client is null");
        return [];
    }
    try {
      const { data, error } = await supabase
        .from('recorded_webinars')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) {
          console.error("Supabase Query Error (recorded_webinars):", error.message, error.details);
          throw error;
      }
      return data || [];
    } catch (err) {
      console.error("Critical error in getRecordedWebinars:", err);
      throw err;
    }
  },

  upsertRecordedWebinar: async (webinar: Partial<RecordedWebinar>): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('recorded_webinars').upsert(webinar);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error saving webinar:", err);
      return false;
    }
  },

  deleteRecordedWebinar: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('recorded_webinars').delete().eq('id', id);
      return !error;
    } catch (err) {
      return false;
    }
  },

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
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id || undefined,
          name: userData.name,
          last_name: userData.last_name,
          email: userData.email,
          position: userData.position,
          avatar_url: userData.avatar_url
        })
        .select()
        .single();
      
      if (pError) throw pError;

      if (roleIds.length > 0) {
        await supabase.from('user_roles').delete().eq('user_id', profile.id);
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

  getAssociateByUserId: async (userId: string): Promise<Associate | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('associates').select('*').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("API Error getAssociateByUserId:", err);
      return null;
    }
  },

  updateProfile: async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          last_name: profileData.last_name,
          position: profileData.position,
          avatar_url: profileData.avatar_url
        })
        .eq('id', profileData.id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
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
    
    // Limpiar el objeto de campos que no pertenecen a la tabla
    const { day, month, ...payload } = event as any;
    
    try {
      let query;
      if (payload.id && payload.id !== 0) {
        // Si hay un ID, realizamos un UPDATE explícito
        const { id, ...updateData } = payload;
        query = supabase.from('events').update(updateData).eq('id', id);
      } else {
        // Si no hay ID, realizamos un INSERT explícito y dejamos que la DB genere el ID
        const { id, ...insertData } = payload;
        query = supabase.from('events').insert(insertData);
      }

      const { data, error } = await query.select().single();
      if (error) throw error;
      
      const dateObj = new Date(data.event_date + 'T00:00:00');
      return {
        ...data,
        day: dateObj.getDate().toString().padStart(2, '0'),
        month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
      };
    } catch (err) {
      console.error("Error in upsertEvent:", err);
      throw err;
    }
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
  getDocumentCategories: async (): Promise<DocumentCategory[]> => {
    if (!supabase) return [];
    const tableNames = ['documents_categoria', 'documents_categorias', 'document_categories'];
    
    for (const tableName of tableNames) {
      try {
        console.log(`Attempting to fetch categories from '${tableName}'...`);
        // First try to just get the data without ordering to avoid column name errors
        const { data, error } = await supabase
          .from(tableName)
          .select('*');
        
        if (!error && data) {
          console.log(`Successfully fetched ${data.length} categories from '${tableName}'`);
          if (data.length > 0) {
            console.log("Sample raw category data:", data[0]);
          }
          const mapped = data.map((c: any) => ({
            id: parseInt(c.id, 10),
            name: c.name || c.nombre || 'Sin nombre',
            parent_id: parseInt(c.parent_id !== undefined ? c.parent_id : (c.categoria_padre_id || 0), 10) || 0,
            created_at: c.created_at
          }));
          // Sort manually in JS to be safe
          return mapped.sort((a, b) => a.name.localeCompare(b.name));
        }
        console.warn(`Failed to fetch from '${tableName}':`, error?.message);
      } catch (err) {
        console.error(`Error with table '${tableName}':`, err);
      }
    }
    return [];
  },

  getDocumentsByCategory: async (catId: number): Promise<DocType[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('cat_id', catId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error fetching documents by category:", error.message);
        throw error;
      }
      
      return (data || []).map((d: any) => {
        const storagePath = d.storage_path || d.ruta_almacenamiento || d.ruta || '';
        let finalUrl = '';

        if (storagePath.startsWith('http')) {
          finalUrl = storagePath;
        } else {
          // Si el path ya incluye el nombre del bucket al principio, lo removemos para getPublicUrl
          let cleanPath = storagePath.startsWith('/') ? storagePath.substring(1) : storagePath;
          if (cleanPath.startsWith('documentation/')) {
            cleanPath = cleanPath.replace('documentation/', '');
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('documentation')
            .getPublicUrl(cleanPath);
          finalUrl = publicUrl;
        }
        
        return {
          id: parseInt(d.id, 10),
          name: d.name || d.nombre || 'Sin nombre',
          type: d.type || d.tipo || 'other',
          size: d.size || d.tamaño || d.tamano || '0 KB',
          storage_path: storagePath,
          cat_id: parseInt(d.cat_id !== undefined ? d.cat_id : d.categoria_id, 10) || 0,
          description: d.description || d.descripcion || '',
          created_at: new Date(d.created_at).toLocaleDateString('es-ES'),
          url: finalUrl
        };
      });
    } catch (err) {
      console.error("Error in getDocumentsByCategory:", err);
      return [];
    }
  },

  getAllDocuments: async (): Promise<{data: DocType[], error: any}> => {
    if (!supabase) return { data: [], error: 'No connection' };
    const tableNames = ['documents', 'documentos'];
    
    for (const tableName of tableNames) {
      try {
        console.log(`Attempting to fetch documents from '${tableName}'...`);
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          console.log(`Successfully fetched ${data.length} documents from '${tableName}'`);
          const docs = data.map((d: any) => {
            const storagePath = d.storage_path || d.ruta_almacenamiento || d.ruta || '';
            let finalUrl = '';

            if (storagePath.startsWith('http')) {
              finalUrl = storagePath;
            } else {
              let cleanPath = storagePath.startsWith('/') ? storagePath.substring(1) : storagePath;
              if (cleanPath.startsWith('documentation/')) {
                cleanPath = cleanPath.replace('documentation/', '');
              }

              const { data: { publicUrl } } = supabase.storage
                .from('documentation')
                .getPublicUrl(cleanPath);
              finalUrl = publicUrl;
            }
            
            return {
              id: parseInt(d.id, 10),
              name: d.name || d.nombre || 'Sin nombre',
              type: d.type || d.tipo || 'other',
              size: d.size || d.tamaño || d.tamano || '0 KB',
              storage_path: storagePath,
              cat_id: parseInt(d.cat_id !== undefined ? d.cat_id : d.categoria_id, 10) || 0,
              description: d.description || d.descripcion || '',
              created_at: new Date(d.created_at).toLocaleDateString('es-ES'),
              url: finalUrl
            };
          });
          return { data: docs, error: null };
        }
        console.warn(`Failed to fetch from '${tableName}':`, error?.message);
      } catch (err) {
        console.error(`Error with table '${tableName}':`, err);
      }
    }
    return { data: [], error: 'Could not find documents table' };
  },

  createCategory: async (name: string, parentId: number = 0): Promise<DocumentCategory | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('documents_categoria')
      .insert({ name, parent_id: parentId })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    return data;
  },

  uploadDocument: async (file: File, catId: number, description?: string): Promise<DocType | null> => {
    if (!supabase) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`; 
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documentation')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const sizeMB = file.size / (1024 * 1024);
      const sizeStr = sizeMB < 1 ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMB.toFixed(1)} MB`;

      const { data, error: dbError } = await supabase.from('documents').insert({
        name: file.name,
        type: fileExt || 'other',
        size: sizeStr,
        cat_id: catId,
        storage_path: filePath,
        description: description || ''
      }).select().single();

      if (dbError) throw dbError;

      const { data: { publicUrl } } = supabase.storage
        .from('documentation')
        .getPublicUrl(data.storage_path);

      return {
        ...data,
        url: publicUrl,
        created_at: new Date(data.created_at).toLocaleDateString('es-ES')
      };

    } catch (err) {
      console.error("Error uploading document:", err);
      return null;
    }
  },

  deleteDocument: async (docId: number, storagePath: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error: storageError } = await supabase.storage
        .from('documentation')
        .remove([storagePath]);
      
      if (storageError) console.warn("Could not delete file from bucket", storageError);

      const { error } = await supabase.from('documents').delete().eq('id', docId);
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error deleting document:", err);
      return false;
    }
  },

  deleteCategory: async (catId: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('documents_categoria').delete().eq('id', catId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting category:", err);
      return false;
    }
  },

  // --- MENTORSHIP ---
  createMentorshipRequest: async (request: Partial<MentorshipRequest>): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "Supabase no está configurado." };
    try {
      const { error } = await supabase.from('mentorship_requests').insert(request);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Error creating mentorship request:", err);
      return { 
        success: false, 
        error: err.message || "Error desconocido al guardar en la base de datos." 
      };
    }
  },

  getMentorshipRequests: async (userId?: string): Promise<MentorshipRequest[]> => {
    if (!supabase) return [];
    try {
      let query = supabase.from('mentorship_requests').select('*').order('created_at', { ascending: false });
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching mentorship requests:", err);
      return [];
    }
  },

  updateMentorshipStatus: async (requestId: number, status: MentorshipRequest['status']): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({ status })
        .eq('id', requestId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error updating mentorship status:", err);
      return false;
    }
  },

  deleteMentorshipRequest: async (requestId: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .delete()
        .eq('id', requestId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting mentorship request:", err);
      return false;
    }
  }
};
