import React, { useState, useEffect } from 'react';
import { api, Associate, Event, EventRegistration } from '../services/api';
import { Notice } from '../types';

type AdminSection = 'overview' | 'directory' | 'notices' | 'events' | 'blog';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'disconnected'>('disconnected');

  useEffect(() => {
    setDbStatus(api.isSupabaseConnected() ? 'connected' : 'error');
  }, []);

  // Shared UI Components
  const SectionHeader = ({ title, subtitle, actionLabel, onAction }: { title: string, subtitle: string, actionLabel?: string, onAction?: () => void }) => (
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
      <div>
        <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-2 block">Administración</span>
        <h2 className="text-4xl font-serif font-medium text-primary leading-tight">{title}</h2>
        <p className="text-secondary text-sm mt-2">{subtitle}</p>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all duration-300 shadow-xl flex items-center gap-3"
        >
          <i className="fa-solid fa-plus"></i> {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row bg-background animate-fade-in">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-72 bg-primary text-white border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-accent mb-1">Compass</p>
          <h3 className="text-xl font-serif">Management</h3>
        </div>
        
        <nav className="flex-1 py-6">
          <button 
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'overview' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-chart-line w-5"></i> Dashboard
          </button>
          <button 
            onClick={() => setActiveSection('directory')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'directory' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-address-book w-5"></i> Directorio
          </button>
          <button 
            onClick={() => setActiveSection('notices')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'notices' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-bullhorn w-5"></i> Avisos
          </button>
          <button 
            onClick={() => setActiveSection('events')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'events' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-calendar-days w-5"></i> Eventos
          </button>
          <button 
            onClick={() => setActiveSection('blog')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'blog' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-newspaper w-5"></i> Inspiración
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#F9FAFB]">
        {activeSection === 'overview' && <AdminOverview setActive={setActiveSection} />}
        {activeSection === 'directory' && <AdminDirectory Header={SectionHeader} />}
        {activeSection === 'notices' && <AdminNotices Header={SectionHeader} />}
        {activeSection === 'events' && <AdminEvents Header={SectionHeader} />}
        {activeSection === 'blog' && <div className="p-20 text-center"><i className="fa-solid fa-tools text-4xl mb-4 text-secondary opacity-30"></i><p className="text-secondary italic">Módulo de Blog en desarrollo...</p></div>}
      </main>
    </div>
  );
};

/* --- SUB-COMPONENT: OVERVIEW --- */
const AdminOverview = ({ setActive }: { setActive: (s: AdminSection) => void }) => {
  const [stats, setStats] = useState({ associates: 0, notices: 0, events: 0, blogPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [associates, notices, events, blog] = await Promise.allSettled([
          api.getAssociates(),
          api.getNotices(),
          api.getEvents(),
          api.getBlogPosts()
        ]);
        
        setStats({
          associates: associates.status === 'fulfilled' ? associates.value.length : 0,
          notices: notices.status === 'fulfilled' ? notices.value.length : 0,
          events: events.status === 'fulfilled' ? events.value.length : 0,
          blogPosts: blog.status === 'fulfilled' ? blog.value.length : 0
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Asociadas', count: stats.associates, icon: 'fa-users', section: 'directory' as AdminSection },
    { label: 'Avisos Totales', count: stats.notices, icon: 'fa-bullhorn', section: 'notices' as AdminSection },
    { label: 'Eventos', count: stats.events, icon: 'fa-calendar', section: 'events' as AdminSection },
    { label: 'Posts Blog', count: stats.blogPosts, icon: 'fa-newspaper', section: 'blog' as AdminSection },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-medium text-primary">Panel de Control</h2>
        <p className="text-secondary text-sm mt-2">Bienvenido al centro de administración de Traveliz Compass.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setActive(stat.section)}
            className="bg-surface border border-neutral p-8 text-left hover:border-accent hover:shadow-xl transition-all group overflow-hidden relative"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 bg-background flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
              <span className="text-3xl font-serif font-bold text-primary">
                {loading ? <i className="fa-solid fa-circle-notch fa-spin text-sm text-neutral"></i> : stat.count.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-brand transition-colors relative z-10">{stat.label}</p>
            <i className={`fa-solid ${stat.icon} absolute -bottom-4 -right-4 text-6xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: DIRECTORY MANAGEMENT --- */
const AdminDirectory = ({ Header }: any) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssociates();
      setAssociates(data || []);
    } catch (err: any) {
      console.error("Admin Directory Error:", err);
      setError(err.message || "Error al cargar los datos desde Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Directorio de Equipo" 
        subtitle="Administra los perfiles de las asociadas visibles en la sección pública." 
        actionLabel="Agregar Nueva" 
        onAction={() => alert("Formulario en desarrollo")} 
      />
      <div className="bg-surface border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Nombre y Perfil</th>
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
                        src={assoc.image} 
                        className="w-10 h-10 rounded-full object-cover grayscale" 
                        onError={(e) => (e.target as any).src = "https://via.placeholder.com/100"}
                      />
                      <div>
                        <p className="text-sm font-bold text-primary">{assoc.name} {assoc.last_name}</p>
                        <p className="text-[10px] text-secondary">{assoc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-secondary italic font-serif">{assoc.position}</td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-secondary hover:text-brand px-2 transition-colors"><i className="fa-solid fa-pen"></i></button>
                    <button className="text-secondary hover:text-red-600 px-2 transition-colors"><i className="fa-solid fa-trash"></i></button>
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '', content: '', priority: 'medium', category: 'General', target_associate_id: null,
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [noticesData, associatesData] = await Promise.all([api.getNotices(), api.getAssociates()]);
      setNotices(noticesData);
      setAssociates(associatesData);
    } catch (err) {
      console.error("Admin Notices Error:", err);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.upsertNotice(formData);
      setIsFormOpen(false);
      setFormData({ 
        title: '', content: '', priority: 'medium', category: 'General', target_associate_id: null,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) 
      });
      loadInitialData();
    } catch (err: any) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in relative">
      <Header title="Avisos Importantes" subtitle="Publica noticias y anuncios críticos." actionLabel={isFormOpen ? "Cancelar" : "Nuevo Aviso"} onAction={() => setIsFormOpen(!isFormOpen)} />
      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Título</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-[#F9FAFB]" /></div>
              <div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Contenido</label><textarea required rows={5} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB]" /></div>
            </div>
            <button type="submit" className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px]">{saving ? 'Cargando...' : 'Publicar'}</button>
          </form>
        </div>
      )}
      <div className="bg-white border border-neutral shadow-sm"><table className="w-full text-left"><thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary"><tr><th className="px-8 py-5">Aviso / Destinatario</th><th className="px-8 py-5 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-neutral">{notices.map((notice) => (<tr key={notice.id} className="hover:bg-background/30"><td className="px-8 py-8"><p className="text-base font-serif font-medium text-primary">{notice.title}</p></td><td className="px-8 py-8 text-right"><button onClick={async () => { if(window.confirm('Eliminar?')) { await api.deleteNotice(notice.id); loadInitialData(); }}}><i className="fa-solid fa-trash"></i></button></td></tr>))}</tbody></table></div>
    </div>
  );
};

/* --- SUB-COMPONENT: EVENTS MANAGEMENT --- */
const AdminEvents = ({ Header }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedEventIdForRegs, setSelectedEventIdForRegs] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [formData, setFormData] = useState<Partial<Event>>({ title: '', description: '', type: 'Webinar', event_date: new Date().toISOString().split('T')[0], time: '10:00', link: '' });

  useEffect(() => { loadEvents(); }, []);
  const loadEvents = async () => { setLoading(true); try { const data = await api.getEvents(); setEvents(data); } finally { setLoading(false); } };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await api.upsertEvent(formData); setIsFormOpen(false); loadEvents(); } catch (err: any) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in relative">
      <Header title="Eventos y Asistencias" subtitle="Gestiona el calendario y revisa quién ha confirmado asistencia." actionLabel={isFormOpen ? "Cerrar" : "Nuevo Evento"} onAction={() => setIsFormOpen(!isFormOpen)} />
      
      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2"><label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Título</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB]" /></div>
                    <div className="grid grid-cols-2 gap-4"><input type="date" required value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB]" /><input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB]" /></div>
                    <select className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB]" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})}><option value="Webinar">Webinar</option><option value="Presencial">Presencial</option><option value="Viaje">Viaje</option><option value="Social">Social</option><option value="Corporativo">Corporativo</option></select>
                </div>
                <button type="submit" className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px]">{saving ? 'Guardando...' : 'Guardar Evento'}</button>
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
                <tr className="hover:bg-background/30 group">
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest block">{event.event_date}</span>
                    <span className="text-[10px] text-brand">{event.type}</span>
                  </td>
                  <td className="px-8 py-8">
                    <p className="text-base font-serif font-medium text-primary">{event.title}</p>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-4">
                      <button 
                        onClick={() => event.id && handleShowRegistrations(event.id)}
                        className={`p-2 transition-all ${selectedEventIdForRegs === event.id ? 'text-accent' : 'text-secondary hover:text-brand'}`}
                        title="Ver Asistentes"
                      >
                        <i className="fa-solid fa-users-viewfinder"></i>
                      </button>
                      <button onClick={async () => { if(event.id && window.confirm('Eliminar?')) { await api.deleteEvent(event.id); loadEvents(); }}} className="p-2 text-secondary hover:text-red-600">
                        <i className="fa-solid fa-trash"></i>
                      </button>
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

export default AdminPanel;