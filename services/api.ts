import { Notice, UserProfile, Role, DocumentCategory, Document as DocType, Associate, Certification, Event, SearchResults, SearchLog, BlogPost, RecordedWebinar, BlogComment, WebinarCategory } from '../types';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://klknrbnipvgwywjbzafh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsa25yYm5pcHZnd3l3amJ6YWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MDM3OTUsImV4cCI6MjA4NDE3OTc5NX0.JcCuNhrRGJFE6kXfMH0rLPc1ZuSxzEihjeWHEx4ny-U';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// --- CONSTANTS ---
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

export const NOTICE_CATEGORIES = [
  "OPERACIÓN / DESTINOS",
  "PROMOCIONES",
  "PAQUETES",
  "CAPACITACIONES",
  "ADMINISTRATIVO",
  "MERCADOTECNIA",
  "TECNOLOGÍA",
  "GENERAL"
];



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
  tier: string; // REQUIRED for grouping
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
    return true;
  },

  logAction: async (actionType: string, description: string, metadata?: any): Promise<void> => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      
      const { error } = await supabase.from('audit_logs').insert({
        user_id: userId,
        action_type: actionType,
        description: description,
        metadata: metadata || {}
      });
      if (error) {
        console.error("Supabase Error logAction:", error);
      }
    } catch (err) {
      console.warn("Failed to log action:", err);
    }
  },

  getAuditLogs: async (limit: number = 20): Promise<any[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Supabase Error fetching audit logs:", error);
        throw error;
      }
      return data || [];
    } catch (err: any) {
      console.error("Error fetching audit logs:", err);
      // Fallback: intentar recuperar sin el join de perfiles si falla por relación
      if (err.message && err.message.includes("relationship")) {
        console.warn("Attempting fetch without profiles join due to relationship error...");
        const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
        return data || [];
      }
      return [];
    }
  },

  getAuditLogsPaged: async (page: number = 1, limit: number = 100, search: string = '', actionType: string = '', dateFrom?: string, dateTo?: string): Promise<{ data: any[], count: number }> => {
    if (!supabase) return { data: [], count: 0 };
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `, { count: 'exact' });

      if (search) {
        query = query.or(`description.ilike.%${search}%,action_type.ilike.%${search}%`);
      }

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        // Añadimos + 'T23:59:59' para incluir todo el día final
        query = query.lte('created_at', dateTo.includes('T') ? dateTo : `${dateTo}T23:59:59`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (err: any) {
      console.error("Error fetching paged audit logs:", err);
      return { data: [], count: 0 };
    }
  },

  // --- AUTH & SESSION ---
  signIn: async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase no configurado");
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error && result.data.user) {
      await api.logAction('USER_LOGIN', `El usuario ${email} inició sesión en el sistema.`);
    }
    return result;
  },

  signOut: async () => {
    if (!supabase) return;
    return await supabase.auth.signOut();
  },

  getCurrentSession: async () => {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  resetPasswordForEmail: async (email: string) => {
    if (!supabase) return { error: { message: "No Supabase connection" } };
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });
  },

  updateUserPassword: async (newPassword: string) => {
    if (!supabase) return { error: { message: "No Supabase connection" } };
    return await supabase.auth.updateUser({ password: newPassword });
  },

  subscribeToAuth: (callback: (event: string, session: any) => void) => {
    if (!supabase) return { unsubscribe: () => {} };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  createAuthUser: async (email: string, fullName: string): Promise<{ success: boolean; userId?: string; tempPassword?: string; error?: string }> => {
    const tempSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    const tempPassword = "Traveliz2026!"; 
    
    // Attempt signup via secondary client so we don't log out main session
    const { data, error } = await tempSupabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      console.error("Error creating Auth user:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, userId: data.user?.id, tempPassword };
  },

  updatePassword: async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "No connection" };
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      api.logAction('PASSWORD_CHANGED', `El usuario cambió su contraseña de acceso.`);
      return { success: true };
    } catch (err: any) {
      console.error("Error updating password:", err);
      return { success: false, error: err.message || "Error desconocido" };
    }
  },

  getUserProfile: async (userId: string, email?: string): Promise<UserProfile | null> => {
    if (!supabase) return null;
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.message.includes("schema cache")) {
         console.warn("Schema cache error ignored for base profile fetch.");
      }

      // Fetch roles independently to bypass schema cache foreign key issues
      if (data) {
        const { data: uRolesRaw, error: urErr } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', data.id);
        
        if (uRolesRaw && uRolesRaw.length > 0) {
          const roleIds = uRolesRaw.map((r: any) => r.role_id);
          const { data: rolesData, error: rolesErr } = await supabase
            .from('roles')
            .select('id, name')
            .in('id', roleIds);
            
          data.user_roles = rolesData ? rolesData.map((r: any) => ({ roles: r })) : [];
        } else {
          data.user_roles = [];
        }
      }
      
      if (!data && email) {
        const { data: dataByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (dataByEmail) {
          const { data: uRolesRaw } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', dataByEmail.id);
            
          if (uRolesRaw && uRolesRaw.length > 0) {
            const roleIds = uRolesRaw.map((r: any) => r.role_id);
            const { data: rolesData } = await supabase
              .from('roles')
              .select('id, name')
              .in('id', roleIds);
            dataByEmail.user_roles = rolesData ? rolesData.map((r: any) => ({ roles: r })) : [];
          } else {
            dataByEmail.user_roles = [];
          }

          data = dataByEmail;
          if (dataByEmail.id !== userId) {
            await api.linkProfileToAuth(dataByEmail.id, userId);
            data.id = userId;
          }
        }
      }

      // Ignorar errores de cache de esquema que son comunes en este entorno
      const isCacheError = error && error.message?.includes("schema cache");
      if ((error && !isCacheError) || !data) return null;
      
      // Intentar obtener el nombre desde la tabla de asociados si está vinculado
      const { data: linkedAssoc } = await supabase
        .from('associates')
        .select('name, last_name')
        .eq('user_id', data.id)
        .maybeSingle();

      const fullName = linkedAssoc 
        ? `${linkedAssoc.name} ${linkedAssoc.last_name || ''}`.trim()
        : (data as any).full_name || '';
      
      return {
        ...data,
        name: fullName || 'Usuario',
        roles: (data as any).user_roles?.map((ur: any) => ur.roles).filter(Boolean) || []
      };
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  },

  getRecordedWebinars: async (): Promise<RecordedWebinar[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('recorded_webinars')
        .select('*')
        .order('category', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error getRecordedWebinars:", err);
      return [];
    }
  },

  upsertRecordedWebinar: async (webinar: Partial<RecordedWebinar>): Promise<boolean> => {
    if (!supabase) return false;
    try {
      let query;
      if (webinar.id && webinar.id !== 0) {
        const { id, created_at, ...updateData } = webinar as any;
        query = supabase.from('recorded_webinars').update(updateData).eq('id', id);
      } else {
        const { id, created_at, ...insertData } = webinar as any;
        query = supabase.from('recorded_webinars').insert(insertData);
      }
      const { error } = await query;
      if (error) throw error;
      api.logAction('WEBINAR_UPDATED', `Se subió o actualizó el webinar: ${webinar.title}`);
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

  uploadWebinarCover: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `webinars/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading webinar cover:", err);
      return null;
    }
  },

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
              name
            )
          )
        `);
      
      if (error) {
        const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
        if (pError) throw pError;
        const { data: userRoles } = await supabase.from('user_roles').select('*, roles(*)');
        return (profiles || []).map(profile => {
          const roles = (userRoles || []).filter((ur: any) => ur.user_id === profile.id).map((ur: any) => ur.roles).filter(Boolean);
          const [firstName, ...lastNameParts] = (profile.name || '').split(' ');
          return {
            ...profile,
            name: profile.last_name === undefined ? firstName : profile.name,
            last_name: profile.last_name === undefined ? lastNameParts.join(' ') : profile.last_name,
            roles
          };
        });
      }
      
      return (data || []).map(profile => {
        return {
          ...profile,
          name: profile.full_name || 'Usuario',
          roles: profile.user_roles?.map((ur: any) => ur.roles).filter(Boolean) || []
        };
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },

  createUserProfile: async (userData: Partial<UserProfile>, roleIds: number[]): Promise<{ success: boolean; error?: string; tempPassword?: string }> => {
    if (!supabase) return { success: false, error: "No connection" };
    try {
      let existingId = userData.id;
      let generatedPassword = undefined;
      
      if (!existingId && userData.email) {
        const { data: existing } = await supabase.from('profiles').select('id').eq('email', userData.email).maybeSingle();
        if (existing) existingId = existing.id;
      }

      let finalId = existingId;
      if (!finalId) {
        const fullName = `${userData.name || ''} ${userData.last_name || ''}`.trim();
        if (!userData.email) throw new Error("Email es obligatorio.");
        const authResult = await api.createAuthUser(userData.email, fullName);
        if (!authResult.success) return { success: false, error: "Error al crear usuario en Auth: " + authResult.error };
        finalId = authResult.userId!;
        generatedPassword = authResult.tempPassword;
      }
      
      const profileToSave = {
        id: finalId,
        full_name: `${userData.name || ''} ${userData.last_name || ''}`.trim(),
        email: userData.email,
        position: userData.position,
        avatar_url: userData.avatar_url
      };

      const { data: profile, error: pError } = await supabase.from('profiles').upsert(profileToSave).select().single();
      if (pError) throw pError;

      await supabase.from('user_roles').delete().eq('user_id', profile.id);
      if (roleIds.length > 0) {
        const rolePayload = roleIds.map(rid => ({ user_id: profile.id, role_id: rid }));
        await supabase.from('user_roles').insert(rolePayload);
      }

      api.logAction('USER_PROFILE_UPDATED', `Se creó/actualizó el perfil maestro de: ${profile.email}`);

      return { success: true, tempPassword: generatedPassword };
    } catch (err: any) {
      console.error("Error creating/updating user profile:", err);
      return { success: false, error: err.message || "Error desconocido" };
    }
  },

  linkProfileToAuth: async (oldProfileId: string, newAuthId: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error: updateError } = await supabase.from('profiles').update({ id: newAuthId }).eq('id', oldProfileId);
      if (updateError) {
        const { data: oldProfile } = await supabase.from('profiles').select('*').eq('id', oldProfileId).single();
        if (!oldProfile) return false;
        await supabase.from('profiles').insert({ ...oldProfile, id: newAuthId });
        await supabase.from('user_roles').update({ user_id: newAuthId }).eq('user_id', oldProfileId);
        await supabase.from('profiles').delete().eq('id', oldProfileId);
      }
      return true;
    } catch (err) {
      console.error("Error linking profile to auth ID:", err);
      return false;
    }
  },

  deleteUserProfile: async (userId: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      await supabase.from('user_roles').delete().eq('user_id', userId);
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      api.logAction('USER_DELETED', `Se eliminó el perfil y roles del usuario con ID: ${userId}`);
      return true;
    } catch (err) {
      console.error("Error deleting user profile:", err);
      return false;
    }
  },

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
          full_name: `${profileData.name || ''} ${profileData.last_name || ''}`.trim(),
          position: profileData.position,
          avatar_url: profileData.avatar_url
        })
        .eq('id', profileData.id);
      if (error) throw error;
      api.logAction('PROFILE_UPDATED', `Se actualizaron los datos básicos del perfil (nombre/puesto).`, { profile_id: profileData.id });
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
    }
  },

  upsertAssociate: async (associate: Associate): Promise<Associate | null> => {
    if (!supabase) return null;
    const payload = {
      id: associate.id,
      user_id: associate.user_id === '' ? null : associate.user_id,
      name: associate.name,
      last_name: associate.last_name,
      email: associate.email,
      image: associate.image,
      whatsapp: associate.whatsapp,
      position: associate.position,
      tipo: associate.tipo,
      content: associate.content,
      instagram: associate.instagram,
      facebook: associate.facebook,
      tik_tok: associate.tik_tok,
      linkedIn: associate.linkedIn,
      especialidades: associate.especialidades,
      Branch: associate.Branch
    };
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);
    let query;
    if (payload.id && payload.id !== 0) {
      const { id, ...updateData } = payload;
      query = supabase.from('associates').update(updateData).eq('id', id);
    } else {
      const { id, ...insertData } = payload;
      query = supabase.from('associates').insert(insertData);
    }
    const { data, error } = await query.select().single();
    if (error) throw error;

    // Track standard action
    api.logAction('PROFILE_UPDATED', `El usuario ha actualizado su perfil de asociado.`, { associate_id: data.id, name: `${data.name} ${data.last_name || ''}` });

    return data;
  },

  deleteAssociate: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('associates').delete().eq('id', id);
    if (error) throw error;
    api.logAction('ASSOCIATE_DELETED', `Se eliminó un registro del directorio (Asociada ID: ${id})`);
    return true;
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
      const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();
      if (error) throw error;
      return { ...data, id: data.id.toString() };
    } catch (err) {
      console.error("API Error getNoticeById:", err);
      return null;
    }
  },

  sendIndividualNotification: async (noticeId: string, associateId: string) => {
    if (!supabase) return { error: "No Supabase connection" };
    try {
      const { data, error } = await supabase.functions.invoke('send-individual-notification', {
        body: { noticeId, targetAssociateId: associateId }
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error("Send notification error:", err);
      return { error: err.message };
    }
  },

  upsertNotice: async (notice: Partial<Notice>): Promise<Notice | null> => {
    if (!supabase) return null;
    try {
      const { id, ...rest } = notice;
      let query = (id && id !== 'null' && id !== '') ? supabase.from('notices').update(rest).eq('id', id) : supabase.from('notices').insert(rest);
      const { data, error } = await query.select().single();
      if (error) throw error;
      
      api.logAction('NOTICE_UPDATED', `Se publicó/actualizó el aviso: ${data.title}`);
      
      return { ...data, id: data.id.toString() };
    } catch (err) {
      console.error("Error in upsertNotice:", err);
      throw err;
    }
  },

  deleteNotice: async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      api.logAction('NOTICE_DELETED', `Se eliminó el aviso ID: ${id}`);
      return true;
    } catch (err) {
      console.error("Error in deleteNotice:", err);
      return false;
    }
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
        return { ...data, day: dateObj.getDate().toString().padStart(2, '0'), month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '') };
      }
    }
    return null;
  },

  upsertEvent: async (event: Partial<Event>): Promise<Event | null> => {
    if (!supabase) return null;
    const { day, month, ...payload } = event as any;
    try {
      let query;
      if (payload.id && payload.id !== 0) {
        const { id, ...updateData } = payload;
        query = supabase.from('events').update(updateData).eq('id', payload.id);
      } else {
        const { id, ...insertData } = payload;
        query = supabase.from('events').insert(insertData);
      }
      const { data, error } = await query.select().single();
      if (error) throw error;
      
      api.logAction('EVENT_UPDATED', `Se publicó/actualizó el evento: ${data.title}`);
      
      const dateObj = new Date(data.event_date + 'T00:00:00');
      return { ...data, day: dateObj.getDate().toString().padStart(2, '0'), month: dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '') };
    } catch (err) {
      console.error("Error in upsertEvent:", err);
      throw err;
    }
  },

  deleteEvent: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      api.logAction('EVENT_DELETED', `Se eliminó el evento ID: ${id}`);
    }
    return !error;
  },

  getCertifications: async (): Promise<Certification[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('certifications').select('*').order('start_date', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching certifications:", err);
      return [];
    }
  },

  upsertCertification: async (cert: Partial<Certification>): Promise<Certification | null> => {
    if (!supabase) return null;
    try {
      let query;
      if (cert.id && cert.id !== 0) {
        const { id, ...updateData } = cert;
        query = supabase.from('certifications').update(updateData).eq('id', cert.id);
      } else {
        const { id, ...insertData } = cert;
        query = supabase.from('certifications').insert(insertData);
      }
      const { data, error } = await query.select().single();
      if (error) throw error;
      api.logAction('CERTIFICATION_UPDATED', `Se creó/actualizó la certificación: ${data.name}`);
      return data;
    } catch (err) {
      console.error("Error upserting certification:", err);
      return null;
    }
  },

  deleteCertification: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', id);
      if (!error) {
        api.logAction('CERTIFICATION_DELETED', `Se eliminó la certificación ID: ${id}`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  uploadCertificationFlyer: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `flyers/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('certifications').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('certifications').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading flyer:", err);
      return null;
    }
  },

  registerForEvent: async (eventId: number, userEmail: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('event_registrations').insert({ event_id: eventId, user_email: userEmail });
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
      const { data, error } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).eq('user_email', userEmail);
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
      const { data: regs, error: regError } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);
      if (regError) throw regError;
      const { data: associates } = await supabase.from('associates').select('name, last_name, email');
      return (regs || []).map(r => {
        const assoc = associates?.find(a => a.email === r.user_email);
        return { ...r, associate_name: assoc ? `${assoc.name} ${assoc.last_name || ''}` : 'Usuario Externo' };
      });
    } catch (err) {
      console.error("Error fetching registrations:", err);
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

  getBlogPostById: async (id: number): Promise<BlogPost | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getBlogPostById:", err);
      return null;
    }
  },

  getFeedInteractions: async (postIds: number[], userId?: string) => {
    if (!supabase || postIds.length === 0) return { likes: {}, saves: {}, comments: {} };
    const { data: allLikes } = await supabase.from('blog_likes').select('post_id, user_id').in('post_id', postIds);
    const { data: allSaves } = await supabase.from('blog_saves').select('post_id, user_id').in('post_id', postIds);
    const { data: allComments } = await supabase.from('blog_comments').select('post_id, id').in('post_id', postIds);
    const likes: Record<number, number> = {};
    const comments: Record<number, number> = {};
    const userLiked = new Set<number>();
    const userSaved = new Set<number>();
    postIds.forEach(id => { likes[id] = 0; comments[id] = 0; });
    if (allLikes) allLikes.forEach(l => { likes[l.post_id]++; if (userId && l.user_id === userId) userLiked.add(l.post_id); });
    if (allSaves) allSaves.forEach(s => { if (userId && s.user_id === userId) userSaved.add(s.post_id); });
    if (allComments) allComments.forEach(c => { comments[c.post_id]++; });
    return { likes, comments, userLiked, userSaved };
  },

  toggleLike: async (postId: number, userId: string, currentlyLiked: boolean): Promise<boolean> => {
     if (!supabase) return false;
     try {
       if (currentlyLiked) {
         await supabase.from('blog_likes').delete().match({ post_id: postId, user_id: userId });
       } else {
         await supabase.from('blog_likes').insert({ post_id: postId, user_id: userId });
       }
       return true;
     } catch (err) {
       console.error("Error toggleLike:", err);
       return false;
     }
  },

  toggleSave: async (postId: number, userId: string, currentlySaved: boolean): Promise<boolean> => {
     if (!supabase) return false;
     try {
       if (currentlySaved) {
         await supabase.from('blog_saves').delete().match({ post_id: postId, user_id: userId });
       } else {
         await supabase.from('blog_saves').insert({ post_id: postId, user_id: userId });
       }
       return true;
     } catch (err) {
       console.error("Error toggleSave:", err);
       return false;
     }
  },

  addComment: async (postId: number, userId: string, content: string): Promise<boolean> => {
     if (!supabase) return false;
     try {
       await supabase.from('blog_comments').insert({ post_id: postId, user_id: userId, content });
       return true;
     } catch (err) {
       console.error("Error addComment:", err);
       return false;
     }
  },

  getPostComments: async (postId: number): Promise<BlogComment[]> => {
    if (!supabase) return [];
    try {
      const { data: comments, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (!comments || comments.length === 0) return [];

      const userIds = [...new Set(comments.map(c => c.user_id))];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const profilesMap = (profilesData || []).reduce((acc, p) => {
        acc[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        return acc;
      }, {} as Record<string, any>);

      return comments.map(c => ({
        ...c,
        profiles: profilesMap[c.user_id] || { full_name: 'Usuario', avatar_url: '' }
      }));
    } catch (err) {
      console.error("Error getPostComments:", err);
      return [];
    }
  },

  getUserActivityStats: async (userId: string, userName: string): Promise<{ blogsCount: number; commentsCount: number }> => {
    if (!supabase) return { blogsCount: 0, commentsCount: 0 };
    try {
      const [blogs, comments] = await Promise.all([
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('author', userName),
        supabase.from('blog_comments').select('id', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      return {
        blogsCount: blogs.count || 0,
        commentsCount: comments.count || 0
      };
    } catch (err) {
      console.error("Error getUserActivityStats:", err);
      return { blogsCount: 0, commentsCount: 0 };
    }
  },

  upsertBlogPost: async (post: Partial<BlogPost>): Promise<BlogPost | null> => {
    if (!supabase) return null;
    try {
      let query;
      if (post.id && post.id !== 0) {
        const { id, ...updateData } = post;
        query = supabase.from('blog_posts').update(updateData).eq('id', post.id);
      } else {
        const { id, ...insertData } = post;
        query = supabase.from('blog_posts').insert(insertData);
      }
      const { data, error } = await query.select().single();
      if (error) throw error;
      api.logAction('BLOG_POST_UPDATED', `Se publicó o actualizó un blog: ${data.title}`, { post_id: data.id });
      return data;
    } catch (err) {
      console.error("Error upserting blog post:", err);
      return null;
    }
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (!error) {
        api.logAction('BLOG_POST_DELETED', `Se eliminó el blog ID: ${id}`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  uploadBlogImage: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blogs/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading blog image:", err);
      return null;
    }
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
    try {
      // Clean data to ensure no extra fields like 'branch' are sent to DB
      const cleanData = {
        id: seller.id,
        name: seller.name,
        avatar: seller.avatar,
        ranking: seller.ranking,
        tier: (seller.tier || 'ASSOCIATE').toUpperCase() // Normalize to uppercase
      };

      const { data, error } = await supabase.from('sellers').upsert(cleanData).select().single();
      if (error) throw error;
      api.logAction('SELLER_UPDATED', `Se actualizó el ranking/perfil del vendedor ID: ${data.id}`);
      return data;
    } catch (err) {
      console.error("Error in upsertSeller:", err);
      throw err;
    }
  },

  deleteSeller: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('sellers').delete().eq('id', id);
    if (!error) {
      api.logAction('SELLER_DELETED', `Se eliminó del ranking al vendedor ID: ${id}`);
    }
    return !error;
  },

  getDocumentCategories: async (): Promise<DocumentCategory[]> => {
    if (!supabase) return [];
    const tableNames = ['documents_categoria', 'documents_categorias', 'document_categories'];
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase.from(tableName).select('*');
        if (!error && data) {
          return data.map((c: any) => ({
            id: parseInt(c.id, 10),
            name: c.name || c.nombre || 'Sin nombre',
            parent_id: parseInt(c.parent_id !== undefined ? c.parent_id : (c.categoria_padre_id || 0), 10) || 0,
            description: c.descripcion || c.description || '',
            created_at: c.created_at
          })).sort((a, b) => a.name.localeCompare(b.name));
        }
      } catch (err) {}
    }
    return [];
  },

  getDocumentsByCategory: async (catId: number): Promise<DocType[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('documents').select('*').eq('cat_id', catId).order('name', { ascending: true });
      if (error) throw error;
      return (data || []).map((d: any) => {
        const path = d.storage_path || d.ruta_almacenamiento || d.ruta || '';
        const { data: { publicUrl } } = supabase.storage.from('documentation').getPublicUrl(path.replace('documentation/', ''));
        return {
          id: parseInt(d.id, 10),
          name: d.name || d.nombre || 'Sin nombre',
          type: d.type || d.tipo || 'other',
          size: d.size || d.tamano || '0 KB',
          storage_path: path,
          cat_id: parseInt(d.cat_id || d.categoria_id, 10) || 0,
          description: d.descripcion || d.description || '',
          created_at: new Date(d.created_at).toLocaleDateString('es-ES'),
          url: path.startsWith('http') ? path : publicUrl
        };
      });
    } catch (err) {
      return [];
    }
  },

  getAllDocuments: async (): Promise<{data: DocType[], error: any}> => {
    if (!supabase) return { data: [], error: 'No connection' };
    try {
      const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const docs = (data || []).map((d: any) => {
        const path = d.storage_path || d.ruta_almacenamiento || d.ruta || '';
        const { data: { publicUrl } } = supabase.storage.from('documentation').getPublicUrl(path.replace('documentation/', ''));
        return {
          id: parseInt(d.id, 10),
          name: d.name || d.nombre || 'Sin nombre',
          type: d.type || d.tipo || 'other',
          size: d.size || d.tamano || '0 KB',
          storage_path: path,
          cat_id: parseInt(d.cat_id || d.categoria_id, 10) || 0,
          description: d.descripcion || d.description || '',
          created_at: new Date(d.created_at).toLocaleDateString('es-ES'),
          url: path.startsWith('http') ? path : publicUrl
        };
      });
      return { data: docs, error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  createCategory: async (name: string, parentId: number = 0, description: string = ''): Promise<DocumentCategory | null> => {
    if (!supabase) return null;
    
    // Attempt 1: documents_categoria with parent_id
    let res = await supabase.from('documents_categoria').insert({ nombre: name, descripcion: description, parent_id: parentId }).select().single();
    if (!res.error && res.data) return res.data;
    
    // Attempt 2: documents_categoria with categoria_padre_id
    res = await supabase.from('documents_categoria').insert({ nombre: name, descripcion: description, categoria_padre_id: parentId }).select().single();
    if (!res.error && res.data) return res.data;

    // Attempt 3: document_categories with english columns
    res = await supabase.from('document_categories').insert({ name: name, description: description, parent_id: parentId }).select().single();
    if (!res.error && res.data) {
      api.logAction('CATEGORY_CREATED', `Se creó la categoría de documentos: ${name}`);
      return res.data;
    }

    console.error("AdminPanel CreateCategory failed. Last error from DB:", res.error);
    return null;
  },

  uploadDocument: async (file: File, catId: number, description?: string): Promise<DocType | null> => {
    if (!supabase) return null;
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const filePath = `uploads/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('documentation').upload(filePath, file);
      if (uploadError) throw uploadError;
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      const { data, error } = await supabase.from('documents').insert({ name: file.name, type: file.name.split('.').pop() || 'other', size: sizeStr, cat_id: catId, storage_path: filePath, descripcion: description || '' }).select().single();
      if (error) throw error;
      api.logAction('DOCUMENT_UPLOADED', `Se subió un nuevo documento: ${file.name}`, { document_id: data.id, size: sizeStr });
      const { data: { publicUrl } } = supabase.storage.from('documentation').getPublicUrl(filePath);
      return { ...data, id: parseInt(data.id, 10), name: data.nombre || data.name, url: publicUrl, created_at: new Date(data.created_at).toLocaleDateString('es-ES') };
    } catch (err) {
      return null;
    }
  },

  updateDocument: async (docId: number, name: string, description: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('documents').update({ name, descripcion: description }).eq('id', docId);
      if (!error) {
        api.logAction('DOCUMENT_UPDATED', `Se actualizaron los datos del documento ID: ${docId} (${name})`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  updateCategory: async (catId: number, name: string, description: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('documents_categoria').update({ nombre: name, descripcion: description }).eq('id', catId);
      if (!error) {
        api.logAction('CATEGORY_UPDATED', `Se actualizó la categoría ID: ${catId} (${name})`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  deleteCategory: async (catId: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const docs = await api.getDocumentsByCategory(catId);
      for (const doc of docs) await api.deleteDocument(doc.id, doc.storage_path);
      const { error } = await supabase.from('documents_categoria').delete().eq('id', catId);
      if (!error) {
        api.logAction('CATEGORY_DELETED', `Se eliminó la categoría ID: ${catId}`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  deleteDocument: async (docId: number, storagePath: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      await supabase.storage.from('documentation').remove([storagePath]);
      const { error } = await supabase.from('documents').delete().eq('id', docId);
      if (!error) {
        api.logAction('DOCUMENT_DELETED', `Se eliminó el documento ID: ${docId}`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  uploadAvatar: async (file: File, userId: string): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('travel_advisors').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('travel_advisors').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      return null;
    }
  },

  createMentorshipRequest: async (request: Partial<MentorshipRequest>): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "Supabase not configured" };
    try {
      const { error } = await supabase.from('mentorship_requests').insert(request);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
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
      return [];
    }
  },

  updateMentorshipStatus: async (requestId: number, status: MentorshipRequest['status']): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('mentorship_requests').update({ status }).eq('id', requestId);
      if (!error) {
        api.logAction('MENTORSHIP_UPDATED', `Se cambió el estado de la mentoría ID: ${requestId} a ${status}`);
      }
      return !error;
    } catch (err) {
      return false;
    }
  },

  sendMentorshipEmail: async (request: any): Promise<boolean> => {
    try {
      // Ahora llamamos a nuestra propia Edge Function en Supabase
      // Esto evita errores de CORS y mantiene las llaves seguras en el servidor
      const { data, error } = await supabase.functions.invoke('send-mentorship-email', {
        body: request
      });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error llamando a la Edge Function de Supabase:", err);
      return false;
    }
  },

  deleteMentorshipRequest: async (requestId: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('mentorship_requests').delete().eq('id', requestId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  search: async (query: string, user?: { id: string, name: string }): Promise<SearchResults> => {
    if (!supabase) return { notices: [], events: [], certifications: [], associates: [], documents: [], blogs: [], recorded_webinars: [] };
    const term = `%${query}%`;
    try {
      const [notices, events, certifications, associates, documents, blogs, webinars] = await Promise.all([
        supabase.from('notices').select('*').or(`title.ilike.${term},content.ilike.${term}`),
        supabase.from('events').select('*').or(`title.ilike.${term},description.ilike.${term}`),
        supabase.from('certifications').select('*').or(`name.ilike.${term},description.ilike.${term}`),
        supabase.from('associates').select('*').or(`name.ilike.${term},last_name.ilike.${term},position.ilike.${term},email.ilike.${term}`),
        supabase.from('documents').select('*').or(`name.ilike.${term},description.ilike.${term}`),
        supabase.from('blog_posts').select('*').or(`title.ilike.${term},content.ilike.${term},author.ilike.${term},category.ilike.${term}`),
        supabase.from('recorded_webinars').select('*').or(`name.ilike.${term},category.ilike.${term}`)
      ]);
      const results = {
        notices: (notices.data || []).map(d => ({ ...d, id: d.id.toString() })),
        events: (events.data || []).map(e => {
          const d = new Date(e.event_date + 'T00:00:00');
          return { ...e, day: d.getDate().toString().padStart(2, '0'), month: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase() };
        }),
        certifications: certifications.data || [],
        associates: associates.data || [],
        documents: (documents.data || []).map(d => ({ ...d, id: parseInt(d.id, 10), url: d.storage_path })),
        blogs: blogs.data || [],
        recorded_webinars: webinars.data || []
      };

      // Registrar la búsqueda en el historial
      if (user) {
        const totalCount = Object.values(results).reduce((acc, curr) => acc + curr.length, 0);
        await api.logSearch(user.id, user.name, query, totalCount);
      }

      return results;
    } catch (err) {
      return { notices: [], events: [], certifications: [], associates: [], documents: [], blogs: [], recorded_webinars: [] };
    }
  },

  logSearch: async (userId: string, userName: string, query: string, resultsCount: number): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('search_logs').insert({ user_id: userId, user_name: userName, query: query, results_count: resultsCount });
      if (error) console.error("Error saving search log:", error);
      return !error;
    } catch (err) {
      console.error("Exception in logSearch:", err);
      return false;
    }
  },

  getSearchLogs: async (): Promise<SearchLog[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return data || [];
    } catch (err) {
      return [];
    }
  },

  // Notificaciones y Comunicaciones
  getNotifications: async (userId: string): Promise<NotificationInbox[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('notification_inbox')
        .select('*, notification:notifications(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return [];
    }
  },

  createNotification: async (notification: any): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('notifications').insert(notification);
    if (error) {
      console.error("Error creating notification:", error);
      throw error; // Lanzamos el error real
    }
    return true;
  },

  markNotificationAsRead: async (inboxId: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('notification_inbox')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', inboxId);
      return !error;
    } catch (err) {
      return false;
    }
  },

  uploadNoticeImage: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('notices')
        .upload(fileName, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('notices').getPublicUrl(fileName);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  }
};
