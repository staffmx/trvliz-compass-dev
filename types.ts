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
  CAPACITACION = 'capacitacion',
  BLOG = 'blog',
  CALENDARIO = 'calendario',
  ADMIN = 'admin',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}