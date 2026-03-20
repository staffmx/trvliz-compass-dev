export interface Certification {
  id: number;
  name: string;
  company: string;
  start_date: string;
  end_date: string;
  cost: string; // e.g., "$100" or "Gratuito"
  mode: 'Presencial' | 'Online';
  description: string;
  img_certificacion?: string;
  created_at?: string;
}

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
  recipient_ids?: string | null;
}

export interface QuickLink {
  id: string;
  title: string;
  icon: string;
  path: string;
  color: string;
}

export interface DocumentCategory {
  id: number;
  name: string;
  parent_id?: number | null;
  description?: string;
  created_at?: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  storage_path: string;
  cat_id: number;
  description?: string;
  created_at: string;
  url?: string;
}

export interface Associate {
  id?: number;
  user_id?: string; // Link to auth.users.id / profiles.id
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
  branch?: string;
  created_at?: string;
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
  MY_PROFILE = 'my_profile',
  SEARCH_RESULTS = 'search_results',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
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

export interface SearchResults {
  notices: Notice[];
  events: Event[];
  certifications: Certification[];
  associates: Associate[];
  documents: Document[];
}

export interface SearchLog {
  id: string;
  user_id: string;
  user_name: string;
  query: string;
  results_count: number;
  created_at: string;
}

export interface ProviderCommission {
  Plataforma: string;
  Clasifica: string;
  Moneda: string;
  Region: string;
  Continente: string;
  Pais: string;
  Cabina: string;
  Servicio: string;
  Porcentaje: string;
  Monto: string;
}

export interface ProviderLocation {
  Continente: string;
  Pais: string;
  Ciudad: string;
  Categoria: string;
  Serendipians: string;
}

export interface ProviderContact {
  Nombre: string;
  Correo: string;
  CorreoSec: string;
  Telefono: string;
}

export interface Provider {
  id: string;
  nombre: string;
  tipoProveedor: string[];
  servicios: string[];
  plataforma: string[];
  tipoIngreso: string;
  contactoGeneral: string;
  paginaWeb: string;
  comoCotizo: string;
  formaPago: string;
  correo: string;
  telefono: string;
  bandera: string;
  descripcion: string;
  estatus: string;
  comisiones: ProviderCommission[];
  ubicaciones: ProviderLocation[];
  contactos: ProviderContact[];
}

export interface ProvidersResponse {
  ListProveedoresAPI: any[]; // Raw objects from Zoho API
}
