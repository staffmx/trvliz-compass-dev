
import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { api, EventRegistration, Seller, RecordedWebinar, WEBINAR_CATEGORIES, MentorshipRequest, BlogPost } from '../services/api';
import { Notice, UserProfile, Role, DocumentCategory, Document as DocType, Associate, Certification, Event, SearchLog } from '../types';

type AdminSection = 'overview' | 'directory' | 'notices' | 'events' | 'blog' | 'sellers' | 'users' | 'documents' | 'recorded_webinars' | 'mentorships' | 'certifications' | 'search_logs';

export const BLOG_CATEGORIES = ['Destinos', 'Tendencias', 'Tips de Viaje', 'Noticias', 'Gastronomía', 'Luxury Travel', 'Wellness'];

const AdminPanel = ({ user }: any) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'disconnected'>('disconnected');

  useEffect(() => {
    setDbStatus(api.isSupabaseConnected() ? 'connected' : 'error');
  }, []);

  const SectionHeader = ({ title, subtitle, actionLabel, onAction, secondActionLabel, onSecondAction }: { title: string, subtitle: string, actionLabel?: string, onAction?: () => void, secondActionLabel?: string, onSecondAction?: () => void }) => (
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
      <div>
        <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-2 block">Administración</span>
        <h2 className="text-4xl font-serif font-medium text-primary leading-tight">{title}</h2>
        <p className="text-secondary text-sm mt-2">{subtitle}</p>
      </div>
      <div className="flex gap-4">
        {secondActionLabel && (
          <button 
            onClick={onSecondAction}
            className="bg-white border border-brand text-brand px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-brand hover:text-white transition-all duration-300 shadow-xl flex items-center gap-3"
          >
            <i className="fa-solid fa-folder-plus"></i> {secondActionLabel}
          </button>
        )}
        {actionLabel && (
          <button 
            onClick={onAction}
            className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all duration-300 shadow-xl flex items-center gap-3"
          >
            <i className="fa-solid fa-plus"></i> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row bg-background animate-fade-in">
      <aside className="w-full lg:w-72 bg-primary text-white border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-accent mb-1">Compass</p>
          <h3 className="text-xl font-serif">Management</h3>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <button onClick={() => setActiveSection('overview')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'overview' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-chart-line w-5"></i> Dashboard
          </button>
          <button onClick={() => setActiveSection('notices')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'notices' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-bullhorn w-5"></i> Avisos
          </button>
          <button onClick={() => setActiveSection('directory')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'directory' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-address-book w-5"></i> Directorio
          </button>
          <button onClick={() => setActiveSection('sellers')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'sellers' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-trophy w-5"></i> Top Producers
          </button>
          <button onClick={() => setActiveSection('events')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'events' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-calendar-days w-5"></i> Eventos
          </button>
          <button onClick={() => setActiveSection('documents')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'documents' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-folder-tree w-5"></i> Documentos
          </button>

          <div className="px-8 py-4 mt-4 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[3px] text-accent/60">Capacitación</p>
          </div>

          <button onClick={() => setActiveSection('recorded_webinars')} className={`w-full flex items-center gap-4 px-10 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${activeSection === 'recorded_webinars' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-play w-4"></i> Webinars Grabados
          </button>
          <button onClick={() => setActiveSection('certifications')} className={`w-full flex items-center gap-4 px-10 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${activeSection === 'certifications' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-award w-4"></i> Certificaciones
          </button>
          <button onClick={() => setActiveSection('mentorships')} className={`w-full flex items-center gap-4 px-10 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${activeSection === 'mentorships' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-graduation-cap w-4"></i> Mentoría 1:1
          </button>

          <div className="my-4 border-t border-white/5 mx-8"></div>

          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'users' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-users-gear w-5"></i> Usuarios
          </button>
          <button onClick={() => setActiveSection('blog')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'blog' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-newspaper w-5"></i> Blogs
          </button>
          <button onClick={() => setActiveSection('search_logs')} className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'search_logs' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}>
            <i className="fa-solid fa-magnifying-glass w-5"></i> Búsquedas
          </button>
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-none">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Estado Sistema</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-[10px] text-white font-bold uppercase">
                {dbStatus === 'connected' ? 'SUPABASE CONECTADO' : 'ERROR DE CONEXIÓN'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#F9FAFB]">
        {activeSection === 'overview' && <AdminOverview setActive={setActiveSection} />}
        {activeSection === 'users' && <AdminUsers Header={SectionHeader} />}
        {activeSection === 'recorded_webinars' && <AdminRecordedWebinars Header={SectionHeader} />}
        {activeSection === 'documents' && <AdminDocuments Header={SectionHeader} />}
        {activeSection === 'directory' && <AdminDirectory Header={SectionHeader} />}
        {activeSection === 'sellers' && <AdminSellers Header={SectionHeader} />}
        {activeSection === 'notices' && <AdminNotices Header={SectionHeader} />}
        {activeSection === 'events' && <AdminEvents Header={SectionHeader} />}
        {activeSection === 'mentorships' && <AdminMentorships Header={SectionHeader} />}
        {activeSection === 'certifications' && <AdminCertifications Header={SectionHeader} />}
        {activeSection === 'search_logs' && <AdminSearchLogs Header={SectionHeader} />}
        {activeSection === 'blog' && <AdminBlog Header={SectionHeader} currentUser={user} />}
      </main>
    </div>
  );
};

/* --- SUB-COMPONENT: BLOG MANAGEMENT --- */
const AdminBlog = ({ Header, currentUser }: any) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editorRef = useRef(null);
  
  const emptyForm: Partial<BlogPost> = {
    title: '', category: BLOG_CATEGORIES[0], image: '', excerpt: '', content: '', read_time: '', author: '', publish_date: ''
  };
  const [formData, setFormData] = useState<Partial<BlogPost>>(emptyForm);

  const editorConfig = useMemo(() => ({
      readonly: false, 
      toolbarAdaptive: false,
      placeholder: 'Escribe el contenido del blog aquí...',
      buttons: ['bold', 'italic', 'underline', 'strikethrough', 'ul', 'ol', 'outdent', 'indent', 'link', 'align', 'undo', 'redo', 'hr']
  }), []);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogPosts();
      setPosts(data);
    } finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await api.uploadBlogImage(file);
      if (url) {
        setFormData({ ...formData, image: url });
      } else {
        alert("Error al subir la imagen. Por favor, intenta de nuevo.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Por favor sube una imagen para el artículo.");
      return;
    }
    setSaving(true);
    try {
      // Auto-assign today's date and author ONLY if it is a new post (no ID)
      const postData = { ...formData };
      if (!postData.id) {
        const today = new Date();
        postData.publish_date = today.toISOString().split('T')[0];
        postData.author = currentUser?.name || 'Admin';
      }

      await api.upsertBlogPost(postData);
      setIsFormOpen(false);
      setFormData(emptyForm);
      loadPosts();
    } finally { setSaving(false); }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({ ...post });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este artículo del blog?')) {
      await api.deleteBlogPost(id);
      loadPosts();
    }
  };

  return (
    <div className="animate-fade-in relative">
      <Header 
        title="Gestión de Blog" 
        subtitle="Administra los artículos y contenido publicado en el Blog." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Artículo"} 
        onAction={() => {
          if (isFormOpen) {
             setIsFormOpen(false);
          } else {
             setFormData(emptyForm);
             setIsFormOpen(true);
          }
        }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {formData.id ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Título del Artículo</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Ej. 5 Destinos que no te puedes perder este año" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Categoría</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent text-secondary">
                  {BLOG_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Tiempo de Lectura</label>
                <input required type="text" value={formData.read_time} onChange={e => setFormData({...formData, read_time: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Ej. 5 Min" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Imagen Principal</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} className="w-24 h-16 object-cover border border-neutral rounded" alt="Preview" />
                  )}
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="w-full p-3 border border-neutral text-sm bg-background outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand/10 file:text-brand file:font-semibold hover:file:bg-brand/20 cursor-pointer text-secondary" 
                    />
                    {uploadingImage && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand text-xs">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> Subiendo...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Extracto Corto (Resumen)</label>
                <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Breve descripción para la tarjeta..." />
              </div>
              <div className="md:col-span-2 max-w-full overflow-hidden">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block flex justify-between">
                  <span>Contenido Completo (Rich Text)</span>
                  {formData.content?.trim() === '' && <span className="text-red-500 font-normal">Requerido</span>}
                </label>
                <div className="border border-neutral bg-white [&_.jodit-container]:!border-none [&_.jodit-toolbar__box]:!bg-background [&_.jodit-toolbar__box]:!border-b [&_.jodit-toolbar__box]:!border-neutral [&_.jodit-workplace]:!min-h-[300px]">
                  <JoditEditor
                    ref={editorRef}
                    value={formData.content || ''}
                    config={editorConfig}
                    onBlur={newContent => setFormData({...formData, content: newContent})}
                  />
                </div>
              </div>
            </div>
            <button type="submit" disabled={saving || uploadingImage || !formData.content?.trim()} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50 inline-block mt-8">
              {saving ? 'Guardando...' : formData.id ? 'Actualizar Artículo' : 'Publicar Artículo'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Artículo</th>
              <th className="px-8 py-5">Autor</th>
              <th className="px-8 py-5">Vistas</th>
              <th className="px-8 py-5">Publicación</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
             {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-secondary"><i className="fa-solid fa-spinner fa-spin mr-2"></i> Cargando artículos...</td></tr>
             ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-secondary italic">No hay artículos publicados.</td></tr>
             ) : posts.map(post => (
              <tr key={post.id} className="hover:bg-background/30">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={post.image} className="w-16 h-10 object-cover border border-neutral rounded" alt={post.title} />
                    <div>
                      <span className="text-sm font-medium text-primary block">{post.title}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-brand">{post.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-secondary">{post.author}</td>
                <td className="px-8 py-6 text-xs font-bold text-accent">
                   <div className="flex items-center gap-2">
                       <i className="fa-regular fa-eye text-secondary"></i>
                       {post.vistas || 0}
                   </div>
                </td>
                <td className="px-8 py-6 text-xs text-secondary">{post.publish_date}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleEdit(post)} className="text-secondary hover:text-brand px-3" title="Editar"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(post.id!)} className="text-secondary hover:text-red-600 px-3" title="Eliminar"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: RECORDED WEBINARS MANAGEMENT --- */
const AdminRecordedWebinars = ({ Header }: any) => {
  const [webinars, setWebinars] = useState<RecordedWebinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<RecordedWebinar>>({
    name: '', category: WEBINAR_CATEGORIES[0], cover_image: '', access_link: '', access_code: ''
  });

  useEffect(() => { loadWebinars(); }, []);

  const loadWebinars = async () => {
    setLoading(true);
    try {
      const data = await api.getRecordedWebinars();
      setWebinars(data);
    } finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await api.uploadWebinarCover(file);
      if (url) {
        setFormData({ ...formData, cover_image: url });
      } else {
        alert("Error al subir la imagen. Por favor, intenta de nuevo.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.upsertRecordedWebinar(formData);
      setIsFormOpen(false);
      setFormData({ name: '', category: WEBINAR_CATEGORIES[0], cover_image: '', access_link: '', access_code: '' });
      loadWebinars();
    } finally { setSaving(false); }
  };

  const handleEdit = (webinar: RecordedWebinar) => {
    setFormData({ ...webinar });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Biblioteca de Webinars" 
        subtitle="Gestiona las grabaciones de capacitaciones por categorías." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Webinar"} 
        onAction={() => {
          if (isFormOpen) {
             setIsFormOpen(false);
          } else {
             setFormData({ name: '', category: WEBINAR_CATEGORIES[0], cover_image: '', access_link: '', access_code: '' });
             setIsFormOpen(true);
          }
        }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {formData.id ? 'Editar Capacitación' : 'Detalles de la Capacitación'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Nombre de Capacitación</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Ej. Sesión de Familiarización 01" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Categoría Oficial</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent">
                  {WEBINAR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Imagen de Portada</label>
                <div className="flex items-center gap-4">
                  {formData.cover_image && (
                    <img src={formData.cover_image} className="w-16 h-16 object-cover border border-neutral rounded" alt="Preview" />
                  )}
                  <div className="flex-1 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="w-full p-3 border border-neutral text-sm bg-background outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand/10 file:text-brand file:font-semibold hover:file:bg-brand/20 cursor-pointer text-secondary" 
                    />
                    {uploadingImage && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand text-xs">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> Subiendo...
                      </div>
                    )}
                  </div>
                </div>
                {/* Fallback hidden input required attribute */}
                <input type="hidden" value={formData.cover_image || ''} required />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Link de Acceso (Zoom/Video)</label>
                <input required type="url" value={formData.access_link} onChange={e => setFormData({...formData, access_link: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="https://zoom.us/rec/..." />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Código de Acceso</label>
                <input type="text" value={formData.access_code} onChange={e => setFormData({...formData, access_code: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Contraseña si aplica" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl">
              {saving ? 'Guardando...' : formData.id ? 'Actualizar Capacitación' : 'Guardar en Biblioteca'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Capacitación</th>
              <th className="px-8 py-5">Categoría</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              <tr className="animate-pulse h-16"><td colSpan={3}></td></tr>
            ) : webinars.map(w => (
              <tr key={w.id} className="hover:bg-background/30">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={w.cover_image} className="w-12 h-8 object-cover border border-neutral" />
                    <span className="text-sm font-medium">{w.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-[9px] font-bold uppercase tracking-widest text-brand">{w.category}</td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleEdit(w)} className="text-secondary hover:text-brand px-3"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={async () => { if(confirm('¿Eliminar de la biblioteca?')) { await api.deleteRecordedWebinar(w.id!); loadWebinars(); }}} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: MENTORSHIPS MANAGEMENT --- */
const AdminMentorships = ({ Header }: any) => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getMentorshipRequests();
      setRequests(data);
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (id: number, newStatus: MentorshipRequest['status']) => {
    const success = await api.updateMentorshipStatus(id, newStatus);
    if (success) {
      loadRequests();
    } else {
      alert("Error al actualizar el estado.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
    const success = await api.deleteMentorshipRequest(id);
    if (success) {
      loadRequests();
    } else {
      alert("Error al eliminar.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Solicitudes de Mentoría" subtitle="Revisa y gestiona las solicitudes de mentoría 1:1 de los agentes." />

      <div className="bg-white border border-neutral shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Agente</th>
              <th className="px-8 py-5">Tema</th>
              <th className="px-8 py-5">Fecha Tentativa</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              <tr className="animate-pulse h-16"><td colSpan={5}></td></tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-secondary italic">No hay solicitudes registradas.</td>
              </tr>
            ) : requests.map(r => (
              <tr key={r.id} className="hover:bg-background/30">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">{r.name}</span>
                    <span className="text-[10px] text-secondary">{r.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs text-primary capitalize">{r.topic}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs text-primary">{new Date(r.tentative_date).toLocaleString('es-ES')}</span>
                </td>
                <td className="px-8 py-6">
                  <select 
                    value={r.status} 
                    onChange={(e) => handleStatusChange(r.id!, e.target.value as any)}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest outline-none border-none cursor-pointer ${getStatusColor(r.status)}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedRequest(r); setIsModalOpen(true); }}
                      className="text-secondary hover:text-brand px-3" 
                      title="Ver detalles"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(r.id!)}
                      className="text-secondary hover:text-red-600 px-3" 
                      title="Eliminar"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-accent text-[10px] font-bold uppercase tracking-[3px] mb-1 block">Detalles de Mentoría</span>
                <h3 className="text-2xl font-serif text-primary">{selectedRequest.name}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Tema</p>
                  <p className="text-sm text-primary capitalize">{selectedRequest.topic}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Fecha Propuesta</p>
                  <p className="text-sm text-primary">{new Date(selectedRequest.tentative_date).toLocaleString('es-ES')}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Comentarios del Agente</p>
                <div className="bg-background p-4 border border-neutral italic text-sm text-secondary leading-relaxed">
                  {selectedRequest.comments || "Sin comentarios adicionales."}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-brand text-white px-8 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SUB-COMPONENT: SELLERS MANAGEMENT --- */
const AdminSellers = ({ Header }: any) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssociates, setLoadingAssociates] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: Partial<Seller> = { 
    name: '', 
    avatar: '', 
    ranking: 1,
    branch: ''
  };
  const [formData, setFormData] = useState<Partial<Seller>>(emptyForm);
  const [selectedAssociateId, setSelectedAssociateId] = useState<string>('');

  useEffect(() => { 
    loadSellers();
    loadAssociates();
  }, []);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const data = await api.getTopSellers();
      setSellers(data || []);
    } catch (err) {
      console.error("Admin Sellers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssociates = async () => {
    setLoadingAssociates(true);
    try {
        const data = await api.getAssociates();
        setAssociates(data || []);
    } finally {
        setLoadingAssociates(false);
    }
  };

  const handleAssociateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAssociateId(id);
    const assoc = associates.find(a => a.id?.toString() === id);
    if (assoc) {
        setFormData({
            ...formData,
            name: `${assoc.name} ${assoc.last_name || ''}`.trim(),
            avatar: assoc.image,
            branch: assoc.branch || ''
        });
    } else {
        setFormData({ ...formData, name: '', avatar: '', branch: '' });
    }
  };

  const handleEdit = (seller: Seller) => {
    setEditingId(seller.id || null);
    setFormData({ ...seller });
    // Try to find if this seller exists in associates by name to pre-select
    const matchingAssoc = associates.find(a => `${a.name} ${a.last_name || ''}`.trim() === seller.name);
    setSelectedAssociateId(matchingAssoc?.id?.toString() || '');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar a este vendedor del ranking?')) return;
    try {
      await api.deleteSeller(id);
      loadSellers();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar vendedor.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.avatar) {
        alert("Por favor selecciona una asociada del directorio.");
        return;
    }
    setSaving(true);
    try {
      await api.upsertSeller(formData);
      setIsFormOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      setSelectedAssociateId('');
      loadSellers();
    } catch (err) {
      console.error(err);
      alert('Error al guardar vendedor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <Header 
        title="Top Producers" 
        subtitle="Administra el ranking de ventas vinculando asociadas del directorio." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Vendedor"} 
        onAction={() => { setIsFormOpen(!isFormOpen); setEditingId(null); setFormData(emptyForm); setSelectedAssociateId(''); }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-6">{editingId ? 'Editar Vendedor' : 'Agregar Vendedor al Ranking'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Seleccionar Travel Advisor del Directorio</label>
                <div className="relative">
                    <select 
                        required 
                        value={selectedAssociateId}
                        onChange={handleAssociateChange}
                        disabled={loadingAssociates}
                        className="w-full p-4 pl-12 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none appearance-none transition-colors"
                    >
                        <option value="">-- Selecciona una asociada --</option>
                        {associates.map(assoc => (
                            <option key={assoc.id} value={assoc.id}>
                                {assoc.name} {assoc.last_name} ({assoc.position || 'Agente'})
                            </option>
                        ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                        {loadingAssociates ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-user-tie"></i>}
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-center gap-6 p-6 bg-background border border-dashed border-neutral">
                {formData.avatar ? (
                    <img src={formData.avatar} className="w-20 h-20 rounded-full object-cover ring-2 ring-accent" alt="Preview" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral/20 flex items-center justify-center text-secondary">
                        <i className="fa-solid fa-image text-2xl"></i>
                    </div>
                )}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Vista Previa de Vínculo</p>
                    <h4 className="text-xl font-serif text-primary">{formData.name || 'Sin selección'}</h4>
                    <p className="text-xs text-secondary mt-1">{formData.avatar ? 'Datos sincronizados con directorio' : 'Selecciona una asociada arriba'}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Posición en Ranking (Número)</label>
                <input 
                    type="number" 
                    min="1"
                    required 
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.ranking}
                    onChange={(e) => setFormData({...formData, ranking: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Sucursal</label>
                <input 
                    type="text" 
                    placeholder="Ej. ROBLE, CDMX"
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" disabled={saving || loadingAssociates} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar Productor'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Ranking</th>
              <th className="px-8 py-5">Vendedor</th>
              <th className="px-8 py-5">Sucursal</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {sellers.sort((a,b) => a.ranking - b.ranking).map((seller) => (
              <tr key={seller.id} className="hover:bg-background/30 group">
                <td className="px-8 py-6">
                  <span className={`text-xl font-serif font-bold ${seller.ranking === 1 ? 'text-accent' : 'text-secondary'}`}>#{seller.ranking}</span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover border border-neutral ring-1 ring-neutral/20 group-hover:ring-accent transition-all" />
                      <p className="font-bold text-primary group-hover:text-brand transition-colors">{seller.name}</p>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{seller.branch || 'N/A'}</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => handleEdit(seller)} className="text-secondary hover:text-brand px-3"><i className="fa-solid fa-pen"></i></button>
                   <button onClick={() => seller.id && handleDelete(seller.id)} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {!loading && sellers.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-secondary italic font-serif">No hay productores registrados aún.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- REST OF THE COMPONENTS (AdminUsers, AdminDocuments, etc. unchanged) --- */
const AdminUsers = ({ Header }: any) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '', last_name: '', email: '', position: '', avatar_url: ''
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, assocData] = await Promise.all([
        api.getUsers(), 
        api.getRoles(),
        api.getAssociates()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setAssociates(assocData);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleEdit = (user: UserProfile) => {
    setEditingId(user.id);
    setFormData({
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      position: user.position,
      avatar_url: user.avatar_url
    });
    setSelectedRoleIds(user.roles?.map(r => r.id) || []);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este perfil de usuario?")) return;
    setSaving(true);
    try {
      const success = await api.deleteUserProfile(userId);
      if (success) {
        loadData();
      } else {
        alert("Error al eliminar el usuario.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const success = await api.createUserProfile(formData, selectedRoleIds);
      if (success) {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', last_name: '', email: '', position: '', avatar_url: '' });
        setSelectedRoleIds([]);
        loadData();
      } else {
        alert("Error al guardar el usuario.");
      }
    } finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Gestión de Usuarios" 
        subtitle="Administra cuentas de acceso y asigna múltiples roles de seguridad." 
        actionLabel={isFormOpen ? "Cancelar" : "Agregar Usuario"} 
        onAction={() => {
          if (!isFormOpen) {
            setFormData({ name: '', last_name: '', email: '', position: '', avatar_url: '' });
            setSelectedRoleIds([]);
            setEditingId(null);
          }
          setIsFormOpen(!isFormOpen);
        }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {editingId ? 'Editar Usuario' : 'Detalles del Nuevo Usuario'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Nombre(s)</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Apellidos</label>
                <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Email Corporativo</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Cargo / Posición</label>
                <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 block">Asignar Roles (Selección Múltiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roles.map(role => (
                    <button 
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      className={`p-4 border text-left transition-all ${selectedRoleIds.includes(role.id) ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-neutral bg-white hover:border-brand/30'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`w-3 h-3 rounded-full ${selectedRoleIds.includes(role.id) ? 'bg-brand' : 'bg-neutral'}`}></span>
                        {selectedRoleIds.includes(role.id) && <i className="fa-solid fa-check text-brand text-xs"></i>}
                      </div>
                      <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{role.name}</p>
                      <p className="text-[9px] text-secondary leading-tight">{role.description || 'Sin descripción'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={saving} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50">
                {saving ? 'Guardando...' : editingId ? 'Actualizar Usuario' : 'Crear Usuario y Perfil'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-neutral shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Usuario</th>
              <th className="px-8 py-5">Roles Asignados</th>
              <th className="px-8 py-5">Perfil Vinculado</th>
              <th className="px-8 py-5">Cargo</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse h-20 bg-gray-50/50"></tr>)
            ) : users.map((u) => {
              const linkedAssoc = associates.find(a => a.user_id === u.id);
              return (
              <tr key={u.id} className="hover:bg-background/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral rounded-full flex-shrink-0 flex items-center justify-center text-secondary font-serif overflow-hidden">
                      {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary leading-tight">
                        {u.name} {u.last_name || ''}
                      </p>
                      <p className="text-[10px] text-secondary">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {u.roles?.map(role => (
                      <span key={role.id} className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border border-brand/20 bg-brand/5 text-brand">
                        {role.name}
                      </span>
                    )) || <span className="text-[10px] text-secondary italic">Sin roles</span>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  {linkedAssoc ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{linkedAssoc.name} {linkedAssoc.last_name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-neutral rounded-full"></span>
                      <span className="text-[10px] text-secondary italic">Sin vincular</span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-xs text-secondary font-serif italic">{u.position}</td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => handleEdit(u)} className="text-secondary hover:text-brand px-3 transition-colors"><i className="fa-solid fa-user-pen"></i></button>
                   <button onClick={() => handleDelete(u.id)} className="text-secondary hover:text-red-600 px-3 transition-colors"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: DOCUMENTS MANAGEMENT --- */
const AdminDocuments = ({ Header }: any) => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<DocumentCategory | null>(null);

  useEffect(() => { 
    if (currentCategory) {
      loadDocs(currentCategory.id);
    } else {
      loadCategories();
    }
  }, [currentCategory]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getDocumentCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally { setLoading(false); }
  };

  const loadDocs = async (catId: number) => {
    setLoading(true);
    try {
      const data = await api.getDocumentsByCategory(catId);
      setDocuments(data);
    } catch (error) {
      console.error("Error loading docs:", error);
    } finally { setLoading(false); }
  };

  const getBreadcrumbs = () => {
    const crumbs: DocumentCategory[] = [];
    let temp = currentCategory;
    while (temp) {
      crumbs.unshift(temp);
      const parent = categories.find(c => c.id === temp?.parent_id);
      temp = parent || null;
    }
    return crumbs;
  };

  const handleCategoryClick = (cat: DocumentCategory) => {
    setCurrentCategory(cat);
  };

  const handleBackToInicio = () => {
    setCurrentCategory(null);
  };

  const handleDeleteDoc = async (doc: DocType) => {
    if (confirm(`¿Eliminar "${doc.name}"?`)) {
      const success = await api.deleteDocument(doc.id, doc.storage_path);
      if (success && currentCategory) loadDocs(currentCategory.id);
      else if (!success) alert("Error al eliminar");
    }
  };

  const handleDeleteCategory = async (e: React.MouseEvent, cat: DocumentCategory) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar categoría "${cat.name}"?`)) {
      const success = await api.deleteCategory(cat.id);
      if (success) loadCategories();
      else alert("Error al eliminar categoría");
    }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Gestión de Documentos" 
        subtitle="Organiza y elimina archivos o categorías de la biblioteca corporativa." 
      />

      <div className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest overflow-x-auto pb-2 border-b border-neutral">
        <button 
            onClick={handleBackToInicio}
            className={!currentCategory ? 'text-brand cursor-default' : 'text-secondary hover:text-accent'}
        >
            Inicio
        </button>
        {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.id}>
                <span className="text-gray-300 mx-1">/</span>
                <button 
                    onClick={() => handleCategoryClick(crumb)}
                    disabled={index === getBreadcrumbs().length - 1}
                    className={index === getBreadcrumbs().length - 1 ? 'text-brand cursor-default' : 'text-secondary hover:text-accent'}
                >
                    {crumb.name}
                </button>
            </React.Fragment>
        ))}
      </div>

      <div className="bg-white border border-neutral shadow-sm overflow-hidden">
        {/* Subcategories Section */}
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">{currentCategory ? 'Subcategorías' : 'Categorías Raíz'}</th>
              <th className="px-8 py-5">Descripción</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading && !currentCategory ? (
              <tr className="animate-pulse h-16"><td colSpan={3}></td></tr>
            ) : categories.filter(cat => {
                if (currentCategory) return cat.parent_id === currentCategory.id;
                return !cat.parent_id || cat.parent_id === 0;
            }).length === 0 ? (
              <tr><td colSpan={3} className="px-8 py-8 text-center text-secondary italic text-xs">No hay {currentCategory ? 'subcategorías' : 'categorías'}</td></tr>
            ) : categories.filter(cat => {
                if (currentCategory) return cat.parent_id === currentCategory.id;
                return !cat.parent_id || cat.parent_id === 0;
            }).map(cat => (
              <tr key={cat.id} className="hover:bg-background/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <i className="fa-solid fa-folder text-brand text-lg"></i>
                    <button onClick={() => handleCategoryClick(cat)} className="text-sm font-bold text-primary hover:text-brand transition-colors text-left">{cat.name}</button>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs text-secondary">Carpeta de recursos corporativos</td>
                <td className="px-8 py-6 text-right">
                   <button onClick={(e) => handleDeleteCategory(e, cat)} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Documents Section (Only if category selected) */}
        {currentCategory && (
          <div className="border-t border-neutral">
            <div className="bg-background/50 px-8 py-4 border-b border-neutral">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Documentos en esta carpeta</h4>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
                <tr>
                  <th className="px-8 py-5">Archivo</th>
                  <th className="px-8 py-5">Tipo</th>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral">
                {loading ? (
                  <tr className="animate-pulse h-16"><td colSpan={4}></td></tr>
                ) : documents.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-secondary italic text-sm">No hay documentos en esta carpeta</td></tr>
                ) : documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-background/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <i className="fa-solid fa-file text-secondary text-lg"></i>
                        <span className="text-sm text-primary">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{doc.type}</span>
                    </td>
                    <td className="px-8 py-6 text-xs text-secondary">{doc.created_at}</td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => handleDeleteDoc(doc)} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: OVERVIEW --- */
const AdminOverview = ({ setActive }: { setActive: (s: AdminSection) => void }) => {
  const [stats, setStats] = useState({ 
    associates: 0, 
    notices: 0, 
    documents: 0, 
    mentorships: 0, 
    webinars: 0 
  });
  const [topSellers, setTopSellers] = useState<Seller[]>([]);
  const [latestSearchLogs, setLatestSearchLogs] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [associates, notices, docs, mentorships, webinars, sellers, logs] = await Promise.allSettled([
          api.getAssociates(),
          api.getNotices(),
          api.getAllDocuments(),
          api.getMentorshipRequests(),
          api.getRecordedWebinars(),
          api.getTopSellers(),
          api.getSearchLogs()
        ]);
        
        const newMentorships = mentorships.status === 'fulfilled' 
          ? mentorships.value.filter(m => m.status === 'pending').length 
          : 0;

        setStats({
          associates: associates.status === 'fulfilled' ? associates.value.length : 0,
          notices: notices.status === 'fulfilled' ? notices.value.length : 0,
          documents: docs.status === 'fulfilled' ? docs.value.data.length : 0,
          mentorships: newMentorships,
          webinars: webinars.status === 'fulfilled' ? webinars.value.length : 0
        });

        if (sellers.status === 'fulfilled') {
          setTopSellers(sellers.value);
        }

        if (logs.status === 'fulfilled') {
          setLatestSearchLogs(logs.value.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Avisos Totales', count: stats.notices, icon: 'fa-bullhorn', section: 'notices' as AdminSection },
    { label: 'Traveliz Advisors', count: stats.associates, icon: 'fa-address-book', section: 'directory' as AdminSection },
    { label: 'Documentos Activos', count: stats.documents, icon: 'fa-folder-tree', section: 'documents' as AdminSection },
    { label: 'Nuevas Mentorías 1:1', count: stats.mentorships, icon: 'fa-graduation-cap', section: 'mentorships' as AdminSection },
    { label: 'Webinars Grabados', count: stats.webinars, icon: 'fa-play', section: 'recorded_webinars' as AdminSection },
  ];

  // Group sellers by branch
  const sellersByBranch = topSellers.reduce((acc, seller) => {
    const branch = seller.branch || 'OTRO';
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(seller);
    return acc;
  }, {} as Record<string, Seller[]>);

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-medium text-primary">Panel de Control</h2>
        <p className="text-secondary text-sm mt-2">Bienvenido al centro de administración de Traveliz Compass.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setActive(stat.section)}
            className="bg-surface border border-neutral p-6 text-left hover:border-accent hover:shadow-xl transition-all group overflow-hidden relative"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 bg-background flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <i className={`fa-solid ${stat.icon} text-lg`}></i>
              </div>
              <span className="text-2xl font-serif font-bold text-primary">
                {loading ? <i className="fa-solid fa-circle-notch fa-spin text-sm text-neutral"></i> : stat.count.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-secondary group-hover:text-brand transition-colors relative z-10">{stat.label}</p>
            <i className={`fa-solid ${stat.icon} absolute -bottom-4 -right-4 text-5xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}></i>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Top Producers by Branch */}
        <div className="bg-white border border-neutral p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-medium text-primary">Top Producers por Sucursal</h3>
            <button onClick={() => setActive('sellers')} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-brand transition-colors">Ver todos</button>
          </div>
          
          <div className="space-y-8">
            {Object.entries(sellersByBranch).length === 0 && !loading ? (
              <p className="text-secondary italic text-sm">No hay datos de productores disponibles.</p>
            ) : (
              (Object.entries(sellersByBranch) as [string, Seller[]][]).map(([branch, sellers]) => (
                <div key={branch}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Sucursal {branch}
                  </h4>
                  <div className="space-y-3">
                    {sellers.sort((a, b) => a.ranking - b.ranking).map((seller) => (
                      <div key={seller.id} className="flex items-center justify-between p-3 bg-background/30 border border-neutral/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                            {seller.avatar ? <img src={seller.avatar} className="w-full h-full object-cover" /> : seller.name.charAt(0)}
                          </div>
                          <span className="text-sm text-primary">{seller.name}</span>
                        </div>
                        <span className="text-xs font-bold text-accent">#{seller.ranking}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Searches */}
        <div className="bg-white border border-neutral p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-medium text-primary">Últimas Búsquedas</h3>
            <button onClick={() => setActive('search_logs')} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-brand transition-colors">Ver historial</button>
          </div>
          
          <div className="space-y-4">
            {latestSearchLogs.length === 0 && !loading ? (
              <p className="text-secondary italic text-sm">No hay registros de búsqueda aún.</p>
            ) : (
              latestSearchLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border-b border-neutral last:border-0 hover:bg-background/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-primary">"{log.query}"</p>
                    <p className="text-[10px] text-secondary mt-1">{log.user_name} • {new Date(log.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-none ${log.results_count === 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {log.results_count} res
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: DIRECTORY MANAGEMENT --- */
const AdminDirectory = ({ Header }: any) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const emptyForm: Associate = {
    name: '',
    last_name: '',
    email: '',
    position: '',
    branch: '',
    image: '',
    content: '',
    whatsapp: '',
    user_id: ''
  };
  
  const [formData, setFormData] = useState<Associate>(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assocData, usersData] = await Promise.all([
        api.getAssociates(),
        api.getUsers()
      ]);
      setAssociates(assocData || []);
      setUsers(usersData || []);
    } catch (err: any) {
      console.error("Admin Directory Error:", err);
      setError(err.message || "Error al cargar los datos desde Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assoc: Associate) => {
    setEditingId(assoc.id || null);
    setFormData({ ...assoc });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este perfil de asociada?")) return;
    try {
        await api.deleteAssociate(id);
        loadData();
    } catch (err) {
        console.error("Error deleting associate:", err);
        alert("Error al eliminar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await api.upsertAssociate(formData);
      if (result) {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(emptyForm);
        loadData();
      } else {
        alert("Error al guardar el perfil.");
      }
    } catch (err: any) {
      console.error("Error saving associate:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Directorio de Equipo" 
        subtitle="Administra los perfiles de las asociadas visibles en la sección pública." 
        actionLabel={isFormOpen ? "Cancelar" : "Agregar Nueva"} 
        onAction={() => {
          if (!isFormOpen) {
            setFormData(emptyForm);
            setEditingId(null);
          }
          setIsFormOpen(!isFormOpen);
        }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {editingId ? 'Editar Perfil' : 'Nueva Asociada'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Nombre(s)</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Apellidos</label>
                <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Email Corporativo</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Cargo / Posición</label>
                <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Sucursal</label>
                <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="Ej. ROBLE" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">WhatsApp</label>
                <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Vincular a Usuario (Opcional)</label>
                <select 
                  value={formData.user_id || ''} 
                  onChange={e => setFormData({...formData, user_id: e.target.value})} 
                  className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent"
                >
                  <option value="">No vincular</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} {u.last_name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Imagen de Perfil (URL)</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Biografía / Resumen</label>
                <textarea rows={4} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-accent resize-none"></textarea>
              </div>
            </div>
            <button type="submit" disabled={saving} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar Perfil'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-surface border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Nombre y Perfil</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Sucursal</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Posición / Cargo</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse h-20 bg-gray-50/50"></tr>)
            ) : associates.map((assoc) => (
                <tr key={assoc.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={assoc.image || `https://ui-avatars.com/api/?name=${assoc.name}+${assoc.last_name}&background=f8f9fa&color=1a1a1a`} 
                        className="w-10 h-10 rounded-full object-cover grayscale" 
                        onError={(e) => (e.target as any).src = "https://via.placeholder.com/100"}
                      />
                      <div>
                        <p className="text-sm font-bold text-primary">{assoc.name} {assoc.last_name}</p>
                        <p className="text-[10px] text-secondary">{assoc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-brand uppercase tracking-widest">{assoc.branch || '-'}</td>
                  <td className="px-6 py-6 text-xs text-secondary italic font-serif">{assoc.position}</td>
                  <td className="px-6 py-6 text-right">
                    <button onClick={() => handleEdit(assoc)} className="text-secondary hover:text-brand px-2 transition-colors"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => assoc.id && handleDelete(assoc.id)} className="text-secondary hover:text-red-600 px-2 transition-colors"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: NOTICES MANAGEMENT --- */
const AdminNotices = ({ Header }: any) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssociates, setLoadingAssociates] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '', content: '', priority: 'medium', category: 'General',
    recipient_ids: '',
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  useEffect(() => { 
    loadInitialData();
    loadAssociates();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const data = await api.getNotices();
      setNotices(data);
    } catch (err) {
      console.error("Admin Notices Error:", err);
    } finally { setLoading(false); }
  };

  const loadAssociates = async () => {
    setLoadingAssociates(true);
    try {
      const data = await api.getAssociates();
      setAssociates(data || []);
    } catch (err) {
      console.error("Error loading associates:", err);
    } finally {
      setLoadingAssociates(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const success = await api.deleteNotice(id);
      if (success) {
        loadInitialData();
        setConfirmDeleteId(null);
      } else {
        alert("No se pudo eliminar el aviso. Es posible que no tengas permisos suficientes.");
      }
    } catch (err: any) {
      console.error("Error deleting notice:", err);
      alert(`Error al eliminar: ${err.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    setFormData({ ...notice, recipient_ids: notice.recipient_ids || '' });
    setEditingId(notice.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleRecipient = (id: string) => {
    const currentIds = formData.recipient_ids ? formData.recipient_ids.split(',').filter(i => i) : [];
    let newIds;
    if (currentIds.includes(id)) {
      newIds = currentIds.filter(i => i !== id);
    } else {
      newIds = [...currentIds, id];
    }
    setFormData({ ...formData, recipient_ids: newIds.join(',') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await api.upsertNotice(formData);
      if (result) {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ 
          title: '', content: '', priority: 'medium', category: 'General',
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) 
        });
        loadInitialData();
      } else {
        alert("No se pudo guardar el aviso.");
      }
    } catch (err: any) { 
      console.error("Error in handleSubmit:", err);
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    } finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in relative">
      <Header 
        title="Avisos Importantes" 
        subtitle="Publica noticias y anuncios críticos." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Aviso"} 
        onAction={() => {
          if (!isFormOpen) {
            setFormData({ 
              title: '', content: '', priority: 'medium', category: 'General',
              recipient_ids: '',
              date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) 
            });
            setEditingId(null);
          }
          setIsFormOpen(!isFormOpen);
        }} 
      />
      
      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {editingId ? 'Editar Aviso' : 'Detalles del Nuevo Aviso'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Prioridad Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Prioridad</label>
                <select 
                  required 
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-[#F9FAFB] transition-colors"
                >
                  <option value="low">Baja (Informativa)</option>
                  <option value="medium">Media (Estándar)</option>
                  <option value="high">Alta (Urgente)</option>
                </select>
              </div>

              {/* Categoría Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Categoría</label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-[#F9FAFB] transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Capacitación">Capacitación</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Destinatarios (Vacio = Todos)</label>
                <div className="border border-neutral p-4 bg-[#F9FAFB] max-h-48 overflow-y-auto space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral/50 mb-2">
                    <input 
                      type="checkbox" 
                      id="all-recipients"
                      checked={!formData.recipient_ids} 
                      onChange={() => setFormData({...formData, recipient_ids: ''})}
                      className="accent-brand"
                    />
                    <label htmlFor="all-recipients" className="text-sm font-bold text-primary cursor-pointer">Público General (Todos)</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {associates.map(assoc => {
                      const idStr = assoc.id?.toString() || '';
                      const isSelected = formData.recipient_ids?.split(',').includes(idStr);
                      return (
                        <div key={idStr} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`recipient-${idStr}`}
                            checked={isSelected}
                            onChange={() => toggleRecipient(idStr)}
                            className="accent-brand"
                          />
                          <label htmlFor={`recipient-${idStr}`} className="text-xs text-secondary truncate cursor-pointer" title={`${assoc.name} ${assoc.last_name}`}>
                            {assoc.name} {assoc.last_name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-secondary mt-2 italic">Selecciona usuarios específicos o deja sin marcar para que sea un aviso general.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Título</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Nueva Política de Reservas 2026"
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-[#F9FAFB]" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Contenido</label>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="Escribe el cuerpo del mensaje aquí..."
                  value={formData.content || ''} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-brand outline-none" 
                />
              </div>
            </div>
            
            <button type="submit" disabled={saving} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50">
              {saving ? 'Guardando...' : (editingId ? 'Actualizar Aviso' : 'Publicar Aviso')}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Prioridad / Categoría</th>
              <th className="px-8 py-5">Aviso</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-background/30 transition-colors">
                <td className="px-8 py-8">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      notice.priority === 'high' ? 'bg-red-500' : 
                      notice.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                    }`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{notice.category}</span>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <p className="text-base font-serif font-medium text-primary leading-tight">{notice.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] text-secondary uppercase tracking-widest">{notice.date}</p>
                    <span className="text-[10px] text-neutral">•</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${notice.recipient_ids ? 'text-brand' : 'text-secondary'}`}>
                      {notice.recipient_ids ? `Dirigido (${notice.recipient_ids.split(',').length})` : 'General'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {confirmDeleteId === notice.id ? (
                      <div className="flex items-center justify-end gap-2 animate-fade-in">
                        <button 
                          onClick={() => notice.id && handleDelete(notice.id)}
                          className="bg-red-600 text-white text-[9px] px-2 py-1 uppercase font-bold hover:bg-red-700 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="bg-neutral text-primary text-[9px] px-2 py-1 uppercase font-bold hover:bg-neutral/80 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(notice)}
                          className="text-secondary hover:text-brand transition-colors p-2"
                          title="Editar aviso"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(notice.id || null)}
                          className="text-secondary hover:text-red-600 transition-colors p-2"
                          title="Eliminar aviso"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: EVENTS MANAGEMENT --- */
const AdminEvents: React.FC<{ Header: any }> = ({ Header }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedEventIdForRegs, setSelectedEventIdForRegs] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Nuevo estado para rastrear si estamos editando
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const emptyForm: Partial<Event> = { 
    title: '', 
    description: '', 
    type: 'Webinar', 
    event_date: new Date().toISOString().split('T')[0], 
    time: '10:00', 
    link: '' 
  };

  const [formData, setFormData] = useState<Partial<Event>>(emptyForm);

  useEffect(() => { loadEvents(); }, []);
  const loadEvents = async () => { 
    setLoading(true); 
    try { 
      const data = await api.getEvents(); 
      setEvents(data); 
    } catch (err) {
      console.error("Error loading events:", err);
    } finally { 
      setLoading(false); 
    } 
  };

  const handleShowRegistrations = async (eventId: number) => {
    if (selectedEventIdForRegs === eventId) {
      setSelectedEventIdForRegs(null);
      return;
    }
    setSelectedEventIdForRegs(eventId);
    setLoadingRegs(true);
    try {
      const data = await api.getEventRegistrations(eventId);
      setRegistrations(data);
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEventId(event.id || null);
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description || '',
      type: event.type,
      event_date: event.event_date,
      time: event.time,
      link: event.link || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingEventId(null);
      setFormData(emptyForm);
    } else {
      setIsFormOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      const success = await api.deleteEvent(id);
      if (success) {
        loadEvents();
        setConfirmDeleteId(null);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { 
      console.log("Submitting event data:", formData);
      const result = await api.upsertEvent(formData); 
      if (result) {
        setIsFormOpen(false); 
        setEditingEventId(null);
        setFormData(emptyForm);
        loadEvents(); 
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (err: any) { 
      console.error("Error submitting event:", err);
      alert("Error al guardar el evento: " + (err.message || "Error desconocido"));
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="animate-fade-in relative">
      <Header 
        title="Eventos y Asistencias" 
        subtitle="Gestiona el calendario y revisa quién ha confirmado asistencia." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Evento"} 
        onAction={toggleForm} 
      />
      
      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral">
                <i className={`fa-solid ${editingEventId ? 'fa-pen-to-square' : 'fa-calendar-plus'} text-accent`}></i>
                <h3 className="font-serif text-2xl text-primary">
                    {editingEventId ? 'Editar Evento' : 'Nuevo Evento Corporativo'}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Título del Evento</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Ej. Webinar: Estrategias de Lujo 2026"
                            value={formData.title || ''} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Descripción / Información Detallada</label>
                        <textarea 
                            rows={4}
                            placeholder="Añade detalles sobre el itinerario, ponentes o requisitos..."
                            value={formData.description || ''} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Fecha del Evento</label>
                        <input 
                            type="date" 
                            required 
                            value={formData.event_date || ''} 
                            onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Hora (Formato 24h)</label>
                        <input 
                            type="time" 
                            required 
                            value={formData.time || ''} 
                            onChange={(e) => setFormData({...formData, time: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Tipo de Evento</label>
                        <select 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                            value={formData.type} 
                            onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        >
                            <option value="Webinar">Webinar</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Viaje">Viaje</option>
                            <option value="Social">Social</option>
                            <option value="Corporativo">Corporativo</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Link Externo / Flyer (URL)</label>
                        <input 
                            type="url" 
                            placeholder="https://zoom.us/... o link a imagen"
                            value={formData.link || ''} 
                            onChange={(e) => setFormData({...formData, link: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50"
                    >
                        {saving ? 'Procesando...' : editingEventId ? 'Actualizar Evento' : 'Guardar Evento'}
                    </button>
                    {editingEventId && (
                        <button 
                            type="button"
                            onClick={toggleForm}
                            className="border border-neutral text-secondary px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-background transition-all"
                        >
                            Descartar Cambios
                        </button>
                    )}
                </div>
            </form>
        </div>
      )}

      <div className="bg-white border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Fecha / Tipo</th>
              <th className="px-8 py-5">Evento</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {events.map((event) => (
              <React.Fragment key={event.id}>
                <tr className={`hover:bg-background/30 group transition-colors ${editingEventId === event.id ? 'bg-accent/5' : ''}`}>
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest block text-primary">{event.event_date}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 mt-1 inline-block ${
                        event.type === 'Webinar' ? 'bg-purple-50 text-purple-700' : 'bg-brand/5 text-brand'
                    }`}>
                        {event.type}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-base font-serif font-medium text-primary group-hover:text-brand transition-colors">{event.title}</p>
                    <p className="text-[10px] text-secondary mt-1">{event.time} hrs</p>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => event.id && handleShowRegistrations(event.id)}
                        className={`w-9 h-9 flex items-center justify-center transition-all ${selectedEventIdForRegs === event.id ? 'bg-accent text-white' : 'text-secondary hover:bg-background hover:text-brand'}`}
                        title="Ver Asistentes"
                      >
                        <i className="fa-solid fa-users-viewfinder text-sm"></i>
                      </button>
                      
                      <button 
                        onClick={() => handleEditClick(event)}
                        className={`w-9 h-9 flex items-center justify-center transition-all ${editingEventId === event.id ? 'bg-brand text-white' : 'text-secondary hover:bg-background hover:text-brand'}`}
                        title="Editar Evento"
                      >
                        <i className="fa-solid fa-pen text-sm"></i>
                      </button>

                      {confirmDeleteId === event.id ? (
                        <div className="flex items-center gap-1 animate-fade-in">
                          <button 
                            onClick={() => event.id && handleDelete(event.id)}
                            className="bg-red-600 text-white text-[9px] px-2 py-1 uppercase font-bold hover:bg-red-700 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-neutral text-primary text-[9px] px-2 py-1 uppercase font-bold hover:bg-neutral/80 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteId(event.id || null)} 
                          className="w-9 h-9 flex items-center justify-center text-secondary hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Eliminar Evento"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {selectedEventIdForRegs === event.id && (
                  <tr>
                    <td colSpan={3} className="px-8 py-8 bg-background/50 border-b border-accent/10">
                      <div className="animate-slide-down">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[3px] text-accent">Asistentes Confirmados vía Compass</h4>
                            <span className="text-[10px] font-bold text-secondary bg-white px-3 py-1 border border-neutral">Total: {registrations.length}</span>
                        </div>
                        
                        {loadingRegs ? (
                          <div className="flex items-center gap-2 text-xs italic text-secondary">
                            <i className="fa-solid fa-circle-notch fa-spin"></i> Cargando lista...
                          </div>
                        ) : registrations.length === 0 ? (
                          <p className="text-xs italic text-secondary py-4 text-center border border-dashed border-neutral">No hay confirmaciones registradas para este evento aún.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {registrations.map(reg => (
                              <div key={reg.id} className="bg-white p-4 border border-neutral shadow-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand/5 flex items-center justify-center text-brand">
                                  <i className="fa-solid fa-user text-xs"></i>
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-primary truncate">{reg.associate_name}</p>
                                  <p className="text-[9px] text-secondary truncate">{reg.user_email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: CERTIFICATIONS MANAGEMENT --- */
const AdminCertifications: React.FC<{ Header: any }> = ({ Header }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const emptyForm: Partial<Certification> = {
    name: '',
    company: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    cost: 'Gratuito',
    mode: 'Online',
    description: '',
    img_certificacion: ''
  };

  const [formData, setFormData] = useState<Partial<Certification>>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadCertifications(); }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const data = await api.getCertifications();
      setCertifications(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setFormData({ ...cert });
    setSelectedFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      const success = await api.deleteCertification(id);
      if (success) {
        loadCertifications();
        setConfirmDeleteId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imgUrl = formData.img_certificacion;

      if (selectedFile) {
        const uploadedUrl = await api.uploadCertificationFlyer(selectedFile);
        if (uploadedUrl) {
          imgUrl = uploadedUrl;
        } else {
          alert("Error al subir el flyer. Por favor intenta de nuevo.");
          setSaving(false);
          return;
        }
      }

      const result = await api.upsertCertification({
        ...formData,
        img_certificacion: imgUrl
      });

      if (result) {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(emptyForm);
        setSelectedFile(null);
        loadCertifications();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Gestión de Certificaciones" 
        subtitle="Administra las próximas certificaciones y cursos disponibles." 
        actionLabel={isFormOpen ? "Cancelar" : "Nueva Certificación"} 
        onAction={() => {
          if (isFormOpen) {
            setIsFormOpen(false);
            setEditingId(null);
            setFormData(emptyForm);
            setSelectedFile(null);
          } else {
            setIsFormOpen(true);
          }
        }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">
            {editingId ? 'Editar Certificación' : 'Nueva Certificación'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Nombre de la Certificación</label>
                <input 
                  type="text" required 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Empresa / Marca</label>
                <input 
                  type="text" required 
                  value={formData.company || ''} 
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Costo ($ o Gratuito)</label>
                <input 
                  type="text" required 
                  value={formData.cost || ''} 
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Fecha Inicio</label>
                <input 
                  type="date" required 
                  value={formData.start_date || ''} 
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Fecha Fin</label>
                <input 
                  type="date" required 
                  value={formData.end_date || ''} 
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Modo</label>
                <select 
                  value={formData.mode} 
                  onChange={(e) => setFormData({...formData, mode: e.target.value as any})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Flyer de la Certificación (Archivo)</label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 border border-dashed border-brand text-brand hover:bg-brand/5 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                  >
                    <i className="fa-solid fa-upload"></i> {selectedFile ? 'Cambiar Archivo' : 'Subir Imagen'}
                  </button>
                  {selectedFile && (
                    <span className="text-xs text-secondary italic">{selectedFile.name}</span>
                  )}
                  {formData.img_certificacion && !selectedFile && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand font-bold">✓ Imagen cargada</span>
                      <img src={formData.img_certificacion} alt="Preview" className="w-10 h-10 object-cover border border-neutral" />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Descripción</label>
                <textarea 
                  rows={4} required 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none resize-none" 
                />
              </div>
            </div>
            <button 
              type="submit" disabled={saving}
              className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50"
            >
              {saving ? 'Procesando...' : editingId ? 'Actualizar Certificación' : 'Guardar Certificación'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Certificación</th>
              <th className="px-8 py-5">Empresa</th>
              <th className="px-8 py-5">Fechas</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {certifications.map((cert) => (
              <tr key={cert.id} className="hover:bg-background/30 transition-colors">
                <td className="px-8 py-8">
                  <p className="text-base font-serif font-medium text-primary">{cert.name}</p>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 mt-1 inline-block ${cert.mode === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {cert.mode}
                  </span>
                </td>
                <td className="px-8 py-8 text-sm text-secondary">{cert.company}</td>
                <td className="px-8 py-8 text-sm text-secondary">{cert.start_date} - {cert.end_date}</td>
                <td className="px-8 py-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(cert)}
                      className="w-9 h-9 flex items-center justify-center text-secondary hover:bg-background hover:text-brand transition-all"
                    >
                      <i className="fa-solid fa-pen text-sm"></i>
                    </button>
                    {confirmDeleteId === cert.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(cert.id)} className="bg-red-600 text-white text-[9px] px-2 py-1 uppercase font-bold">Sí</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="bg-neutral text-primary text-[9px] px-2 py-1 uppercase font-bold">No</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(cert.id)}
                        className="w-9 h-9 flex items-center justify-center text-secondary hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSearchLogs: React.FC<{ Header: any }> = ({ Header }) => {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getSearchLogs();
      setLogs(data);
      setCurrentPage(1); // Reset to first page on refresh
    } catch (err) {
      console.error("Error fetching search logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = logs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <Header 
          title="Log de Búsquedas" 
          subtitle="Monitorea lo que los usuarios están buscando en la plataforma" 
        />
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-white border border-black/10 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-all flex items-center gap-2"
        >
          <i className={`fa-solid fa-rotate ${loading ? 'animate-spin' : ''}`}></i>
          Actualizar
        </button>
      </div>

      <div className="bg-white border border-black/5 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest">
              <th className="px-8 py-5">Usuario</th>
              <th className="px-8 py-5">Término de Búsqueda</th>
              <th className="px-8 py-5">Resultados</th>
              <th className="px-8 py-5 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6 bg-gray-50/50"></td>
                </tr>
              ))
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-secondary font-serif italic">
                  No hay registros de búsqueda aún.
                </td>
              </tr>
            ) : (
              currentItems.map((log) => (
                <tr key={log.id} className="hover:bg-background/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-primary">{log.user_name}</p>
                    <p className="text-[10px] text-secondary font-mono">{log.user_id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-accent/5 text-accent text-xs font-medium border border-accent/10">
                      {log.query}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-xs font-bold ${log.results_count === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {log.results_count} {log.results_count === 1 ? 'resultado' : 'resultados'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right text-xs text-secondary">
                    {new Date(log.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-12">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center border border-black/5 transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-white hover:shadow-sm'}`}
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Show only a few page numbers if there are too many
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`w-10 h-10 text-[10px] font-bold uppercase transition-all border ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-black/5 hover:bg-background'}`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 3 || 
                pageNum === currentPage + 3
              ) {
                return <span key={pageNum} className="text-secondary px-1">...</span>;
              }
              return null;
            })}
          </div>

          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center border border-black/5 transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-white hover:shadow-sm'}`}
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
