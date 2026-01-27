export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name?: string; // Mantener para compatibilidad
  email: string;
  role?: 'admin' | 'employee'; // Mantener para lógica simple
  roles: string[];
  groups: string[];
  status: 0 | 1;
  fecha_alta: string;
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  category: 'General' | 'Urgente' | 'Capacitación';
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
  NOTIFICATIONS_HISTORY = 'notifications_history',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}