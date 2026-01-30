export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export interface UserProfile {
  id: string; // matches auth.users.id
  name: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  position?: string;
  roles?: Role[];
  created_at?: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  category: 'General' | 'Corporativo' | 'Capacitación';
  target_associate_id?: number | null;
}

export interface QuickLink {
  id: string;
  title: string;
  icon: string;
  path: string;
  color: string;
}

export enum NavigationItem {
  DASHBOARD = 'dashboard',
  AVISOS = 'avisos',
  DOCUMENTACION = 'documentacion',
  DIRECTORIO = 'directorio',
  ASSOCIATE_DETAIL = 'associate_detail',
  CAPACITACION = 'capacitacion',
  BLOG = 'blog',
  CALENDARIO = 'calendario',
  ADMIN = 'admin',
  EVENT_DETAIL = 'event_detail',
  PROVEEDORES = 'proveedores',
  NOTICE_DETAIL = 'notice_detail',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}