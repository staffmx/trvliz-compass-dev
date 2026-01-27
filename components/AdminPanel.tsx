import React, { useState, useEffect } from 'react';
import { api, Associate, Event, EventRegistration, Seller, AppNotification } from '../services/api';
import { Notice, User } from '../types';

type AdminSection = 'overview' | 'directory' | 'notices' | 'events' | 'blog' | 'sellers' | 'messages' | 'users';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'disconnected'>('disconnected');

  useEffect(() => {
    setDbStatus(api.isSupabaseConnected() ? 'connected' : 'error');
  }, []);

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
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'users' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-users-gear w-5"></i> Usuarios
          </button>
          <button 
            onClick={() => setActiveSection('messages')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'messages' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-paper-plane w-5"></i> Mensajes Directos
          </button>
          <button 
            onClick={() => setActiveSection('directory')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'directory' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-address-book w-5"></i> Directorio
          </button>
          <button 
            onClick={() => setActiveSection('sellers')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'sellers' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-trophy w-5"></i> Top Producers
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
        {activeSection === 'messages' && <AdminMessages Header={SectionHeader} />}
        {activeSection === 'directory' && <AdminDirectory Header={SectionHeader} />}
        {activeSection === 'sellers' && <AdminSellers Header={SectionHeader} />}
        {activeSection === 'notices' && <AdminNotices Header={SectionHeader} />}
        {activeSection === 'events' && <AdminEvents Header={SectionHeader} />}
      </main>
    </div>
  );
};

/* --- SUB-COMPONENT: USERS MANAGEMENT --- */
const AdminUsers = ({ Header }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: '',
    last_name: '',
    email: '',
    roles: [],
    groups: [],
    status: 1
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await api.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.upsertUser(formData);
    setIsFormOpen(false);
    setFormData({ first_name: '', last_name: '', email: '', roles: [], groups: [], status: 1 });
    loadUsers();
  };

  const toggleArrayItem = (item: string, field: 'roles' | 'groups') => {
    const current = (formData[field] || []) as string[];
    const updated = current.includes(item) 
      ? current.filter(i => i !== item) 
      : [...current, item];
    setFormData({ ...formData, [field]: updated });
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Gestión de Usuarios" 
        subtitle="Control de accesos, roles y grupos del personal."
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Usuario"}
        onAction={() => setIsFormOpen(!isFormOpen)}
      />

      {isFormOpen && (
        <div className="bg-white border border-neutral p-10 shadow-sm mb-10 max-w-4xl">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Nombre(s)</label>
                <input 
                  type="text" required
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Apellido(s)</label>
                <input 
                  type="text" required
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">E-mail de Acceso</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Estatus Inicial</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: parseInt(e.target.value) as 0 | 1})}
                  className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 block">Roles Asignados</label>
                  <div className="flex flex-wrap gap-2">
                    {['Admin', 'Editor', 'Employee', 'Manager'].map(role => (
                      <button 
                        key={role} type="button"
                        onClick={() => toggleArrayItem(role, 'roles')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${formData.roles?.includes(role) ? 'bg-brand border-brand text-white' : 'border-neutral text-secondary hover:border-brand'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 block">Grupos de Trabajo</label>
                  <div className="flex flex-wrap gap-2">
                    {['ROBLE', 'IN-HOUSE', 'SABRE-TEAM', 'VENTAS-ELITE'].map(group => (
                      <button 
                        key={group} type="button"
                        onClick={() => toggleArrayItem(group, 'groups')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${formData.groups?.includes(group) ? 'bg-accent border-accent text-white' : 'border-neutral text-secondary hover:border-accent'}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <button type="submit" className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all">
              Guardar Usuario
            </button>
          </form>
        </div>
      )}

      <div className="bg-surface border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Usuario</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Estatus</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Roles</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Grupos</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center"><i className="fa-solid fa-circle-notch fa-spin text-brand text-2xl"></i></td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-background/50 group">
                <td className="px-8 py-6">
                  <p className="font-serif font-bold text-primary">{u.first_name} {u.last_name}</p>
                  <p className="text-xs text-secondary">{u.email}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none ${u.status === 1 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {u.status === 1 ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-wrap gap-1">
                      {u.roles?.map(r => <span key={r} className="text-[8px] font-bold px-1.5 py-0.5 bg-brand/10 text-brand border border-brand/20 uppercase tracking-widest">{r}</span>)}
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-wrap gap-1">
                      {u.groups?.map(g => <span key={g} className="text-[8px] font-bold px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20 uppercase tracking-widest">{g}</span>)}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => { setFormData(u); setIsFormOpen(true); }} className="text-secondary hover:text-brand p-2"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => u.id && api.deleteUser(u.id).then(loadUsers)} className="text-secondary hover:text-red-600 p-2"><i className="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: MESSAGES --- */
const AdminMessages = ({ Header }: any) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<Partial<AppNotification>>({
    user_email: '',
    title: '',
    description: '',
    type: 'info'
  });

  useEffect(() => {
    const fetchAssocs = async () => {
      const data = await api.getAssociates();
      setAssociates(data);
    };
    fetchAssocs();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_email) return alert('Selecciona un destinatario');
    setIsSending(true);
    const success = await api.createNotification(formData);
    if (success) {
      alert('Notificación enviada con éxito');
      setFormData({ user_email: '', title: '', description: '', type: 'info' });
    } else {
      alert('Error al enviar');
    }
    setIsSending(false);
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Mensajería Directa" 
        subtitle="Envía notificaciones privadas y personalizadas a asociadas específicas." 
      />
      <div className="bg-white border border-neutral p-10 shadow-sm max-w-3xl">
          <form onSubmit={handleSend} className="space-y-6">
              <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Destinatario</label>
                  <select 
                    required
                    value={formData.user_email}
                    onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                    className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                  >
                      <option value="">Selecciona una asociada...</option>
                      {associates.map(a => (
                        <option key={a.id} value={a.email}>{a.name} {a.last_name} ({a.email})</option>
                      ))}
                  </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Asunto</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Revisión de Contrato"
                    className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Prioridad / Tipo</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                  >
                      <option value="info">Información (Azul)</option>
                      <option value="urgent">Urgente (Rojo)</option>
                      <option value="event">Evento / Recordatorio (Morado)</option>
                  </select>
                </div>
              </div>
              <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Mensaje</label>
                  <textarea 
                    rows={4} required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Escribe el mensaje personal para la asociada..."
                    className="w-full p-4 border border-neutral text-sm bg-background outline-none focus:border-brand"
                  />
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50"
              >
                {isSending ? 'Enviando...' : 'Enviar Notificación Privada'}
              </button>
          </form>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: OVERVIEW --- */
const AdminOverview = ({ setActive }: { setActive: (s: AdminSection) => void }) => {
  const [stats, setStats] = useState({ associates: 0, notices: 0, events: 0, sellers: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [associates, notices, events, sellers, users] = await Promise.allSettled([
          api.getAssociates(),
          api.getNotices(),
          api.getEvents(),
          api.getTopSellers(),
          api.getUsers()
        ]);
        
        setStats({
          associates: associates.status === 'fulfilled' ? associates.value.length : 0,
          notices: notices.status === 'fulfilled' ? notices.value.length : 0,
          events: events.status === 'fulfilled' ? events.value.length : 0,
          sellers: sellers.status === 'fulfilled' ? sellers.value.length : 0,
          users: users.status === 'fulfilled' ? users.value.length : 0
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
    { label: 'Usuarios Compass', count: stats.users, icon: 'fa-users-gear', section: 'users' as AdminSection },
    { label: 'Asociadas Direct.', count: stats.associates, icon: 'fa-address-book', section: 'directory' as AdminSection },
    { label: 'Avisos Totales', count: stats.notices, icon: 'fa-bullhorn', section: 'notices' as AdminSection },
    { label: 'Eventos Activos', count: stats.events, icon: 'fa-calendar', section: 'events' as AdminSection },
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

/* --- REST OF ADMIN SUB-COMPONENTS REMAIN UNCHANGED --- */
const AdminDirectory = ({ Header }: any) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadData(); }, []);
  const loadData = async () => { setLoading(true); try { const data = await api.getAssociates(); setAssociates(data || []); } finally { setLoading(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm("¿Seguro?")) return; await api.deleteAssociate(id); loadData(); };
  return (
    <div className="animate-fade-in">
      <Header title="Directorio" subtitle="Administra perfiles." actionLabel="Agregar Nueva" onAction={() => alert("Form en desarrollo")} />
      <div className="bg-surface border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral"><tr><th className="px-6 py-4 text-[10px] font-bold">Nombre</th><th className="px-6 py-4 text-[10px] font-bold text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-neutral">{associates.map((assoc) => (<tr key={assoc.id} className="hover:bg-background/50"><td className="px-6 py-6 font-medium text-sm">{assoc.name} {assoc.last_name}</td><td className="px-6 py-6 text-right"><button onClick={() => assoc.id && handleDelete(assoc.id)} className="text-secondary hover:text-red-600"><i className="fa-solid fa-trash"></i></button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSellers = ({ Header }: any) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  useEffect(() => { loadSellers(); }, []);
  const loadSellers = async () => { try { const data = await api.getTopSellers(); setSellers(data || []); } catch(e){} };
  return (
    <div className="animate-fade-in">
      <Header title="Top Producers" subtitle="Administra ranking." actionLabel="Nuevo" onAction={() => alert("Form en desarrollo")} />
      <div className="bg-white border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left"><tbody className="divide-y divide-neutral">{sellers.map(s => <tr key={s.id}><td className="px-8 py-6">#{s.ranking} {s.name}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
};

const AdminNotices = ({ Header }: any) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => { load(); }, []);
  const load = async () => { const data = await api.getNotices(); setNotices(data); };
  return (
    <div className="animate-fade-in">
      <Header title="Avisos" subtitle="Mensajes masivos." actionLabel="Nuevo Aviso" onAction={() => alert("Use form simple")} />
      <div className="bg-white border border-neutral"><table className="w-full text-left"><tbody className="divide-y divide-neutral">{notices.map(n => <tr key={n.id}><td className="px-8 py-6">{n.title}</td></tr>)}</tbody></table></div>
    </div>
  );
};

const AdminEvents = ({ Header }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => { load(); }, []);
  const load = async () => { const data = await api.getEvents(); setEvents(data); };
  return (
    <div className="animate-fade-in">
      <Header title="Eventos" subtitle="Calendario corporativo." actionLabel="Nuevo Evento" onAction={() => alert("Form en desarrollo")} />
      <div className="bg-white border border-neutral"><table className="w-full text-left"><tbody className="divide-y divide-neutral">{events.map(e => <tr key={e.id}><td className="px-8 py-6">{e.title}</td></tr>)}</tbody></table></div>
    </div>
  );
};

export default AdminPanel;