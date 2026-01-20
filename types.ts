export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
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
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}