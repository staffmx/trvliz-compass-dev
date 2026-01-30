import React, { useState, useEffect } from 'react';
import { api, Associate, Event, EventRegistration, Seller } from '../services/api';
import { Notice, UserProfile, Role } from '../types';

type AdminSection = 'overview' | 'directory' | 'notices' | 'events' | 'blog' | 'sellers' | 'users';

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
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeSection === 'users' ? 'bg-white/5 text-accent border-l-4 border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-users-gear w-5"></i> Usuarios
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#F9FAFB]">
        {activeSection === 'overview' && <AdminOverview setActive={setActiveSection} />}
        {activeSection === 'users' && <AdminUsers Header={SectionHeader} />}
        {activeSection === 'directory' && <AdminDirectory Header={SectionHeader} />}
        {activeSection === 'sellers' && <AdminSellers Header={SectionHeader} />}
        {activeSection === 'notices' && <AdminNotices Header={SectionHeader} />}
        {activeSection === 'events' && <AdminEvents Header={SectionHeader} />}
        {activeSection === 'blog' && <div className="p-20 text-center"><i className="fa-solid fa-tools text-4xl mb-4 text-secondary opacity-30"></i><p className="text-secondary italic">Módulo de Blog en desarrollo...</p></div>}
      </main>
    </div>
  );
};

/* --- SUB-COMPONENT: USERS MANAGEMENT --- */
const AdminUsers = ({ Header }: any) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '', last_name: '', email: '', position: '', avatar_url: ''
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([api.getUsers(), api.getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const success = await api.createUserProfile(formData, selectedRoleIds);
      if (success) {
        setIsFormOpen(false);
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
        onAction={() => setIsFormOpen(!isFormOpen)} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">Detalles del Nuevo Usuario</h3>
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
                {saving ? 'Guardando...' : 'Crear Usuario y Perfil'}
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
              <th className="px-8 py-5">Cargo</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse h-20 bg-gray-50/50"></tr>)
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-background/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral rounded-full flex-shrink-0 flex items-center justify-center text-secondary font-serif overflow-hidden">
                      {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary leading-tight">{u.name} {u.last_name}</p>
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
                <td className="px-8 py-6 text-xs text-secondary font-serif italic">{u.position}</td>
                <td className="px-8 py-6 text-right">
                   <button className="text-secondary hover:text-brand px-3"><i className="fa-solid fa-user-pen"></i></button>
                   <button className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-shield-halved"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: OVERVIEW --- */
const AdminOverview = ({ setActive }: { setActive: (s: AdminSection) => void }) => {
  const [stats, setStats] = useState({ associates: 0, notices: 0, events: 0, blogPosts: 0, sellers: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [associates, notices, events, blog, sellers, users] = await Promise.allSettled([
          api.getAssociates(),
          api.getNotices(),
          api.getEvents(),
          api.getBlogPosts(),
          api.getTopSellers(),
          api.getUsers()
        ]);
        
        setStats({
          associates: associates.status === 'fulfilled' ? associates.value.length : 0,
          notices: notices.status === 'fulfilled' ? notices.value.length : 0,
          events: events.status === 'fulfilled' ? events.value.length : 0,
          blogPosts: blog.status === 'fulfilled' ? blog.value.length : 0,
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
    { label: 'Cuentas de Usuario', count: stats.users, icon: 'fa-users-gear', section: 'users' as AdminSection },
    { label: 'Asociadas Directorio', count: stats.associates, icon: 'fa-address-book', section: 'directory' as AdminSection },
    { label: 'Avisos Totales', count: stats.notices, icon: 'fa-bullhorn', section: 'notices' as AdminSection },
    { label: 'Eventos', count: stats.events, icon: 'fa-calendar', section: 'events' as AdminSection },
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

/* --- SUB-COMPONENT: SELLERS MANAGEMENT --- */
const AdminSellers = ({ Header }: any) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: Partial<Seller> = { 
    name: '', 
    avatar: '', 
    ranking: 1 
  };
  const [formData, setFormData] = useState<Partial<Seller>>(emptyForm);

  useEffect(() => { loadSellers(); }, []);

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

  const handleEdit = (seller: Seller) => {
    setEditingId(seller.id || null);
    setFormData({ ...seller });
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
    setSaving(true);
    try {
      await api.upsertSeller(formData);
      setIsFormOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
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
        subtitle="Administra el ranking de ventas visible en el Dashboard." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Vendedor"} 
        onAction={() => { setIsFormOpen(!isFormOpen); setEditingId(null); setFormData(emptyForm); }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-6">{editingId ? 'Editar Vendedor' : 'Agregar Vendedor al Ranking'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Nombre Completo</label>
                <input 
                    type="text" 
                    required 
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">URL Avatar (Foto)</label>
                <input 
                    type="url" 
                    required 
                    placeholder="https://..."
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Posición en Ranking (Número)</label>
                <input 
                    type="number" 
                    min="1"
                    required 
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.ranking}
                    onChange={(e) => setFormData({...formData, ranking: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <button type="submit" className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl">
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
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-background/30">
                <td className="px-8 py-6">
                  <span className={`text-xl font-serif font-bold ${seller.ranking === 1 ? 'text-accent' : 'text-secondary'}`}>#{seller.ranking}</span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover border border-neutral" />
                      <p className="font-bold text-primary">{seller.name}</p>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => handleEdit(seller)} className="text-secondary hover:text-brand px-3"><i className="fa-solid fa-pen"></i></button>
                   <button onClick={() => seller.id && handleDelete(seller.id)} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
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
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '', content: '', priority: 'medium', category: 'General',
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  useEffect(() => { loadInitialData(); }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const data = await api.getNotices();
      setNotices(data);
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
        title: '', content: '', priority: 'medium', category: 'General',
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
          <h3 className="font-serif text-2xl text-primary mb-8 border-b border-neutral pb-4">Detalles del Aviso</h3>
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Título</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Nueva Política de Reservas 2026"
                  value={formData.title} 
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
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-brand outline-none" 
                />
              </div>
            </div>
            
            <button type="submit" disabled={saving} className="bg-brand text-white px-12 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl disabled:opacity-50">
              {saving ? 'Publicando...' : 'Publicar Aviso'}
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
                  <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest">{notice.date}</p>
                </td>
                <td className="px-8 py-8 text-right">
                  <button 
                    onClick={async () => { if(window.confirm('¿Estás seguro de que deseas eliminar este aviso?')) { await api.deleteNotice(notice.id); loadInitialData(); }}}
                    className="text-secondary hover:text-red-600 transition-colors p-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
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
const AdminEvents = ({ Header }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedEventIdForRegs, setSelectedEventIdForRegs] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

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

  const handleEditClick = (event: Event) => {
    setEditingEventId(event.id || null);
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      event_date: event.event_date,
      time: event.time,
      link: event.link
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { 
      await api.upsertEvent(formData); 
      setIsFormOpen(false); 
      setEditingEventId(null);
      setFormData(emptyForm);
      loadEvents(); 
    } catch (err: any) { 
      console.error(err); 
      alert("Error al guardar el evento");
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
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Descripción / Información Detallada</label>
                        <textarea 
                            rows={4}
                            placeholder="Añade detalles sobre el itinerario, ponentes o requisitos..."
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Fecha del Evento</label>
                        <input 
                            type="date" 
                            required 
                            value={formData.event_date} 
                            onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                            className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none transition-colors" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 block">Hora (Formato 24h)</label>
                        <input 
                            type="time" 
                            required 
                            value={formData.time} 
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
                        className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl"
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

                      <button 
                        onClick={async () => { if(event.id && window.confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) { await api.deleteEvent(event.id); loadEvents(); }}} 
                        className="w-9 h-9 flex items-center justify-center text-secondary hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Eliminar Evento"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
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