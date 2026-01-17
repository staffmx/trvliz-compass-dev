import React, { useState, useEffect } from 'react';
import { api, Associate, Event } from '../services/api';
import { Notice } from '../types';

type AdminSection = 'overview' | 'directory' | 'notices' | 'events' | 'blog';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-[80vh] flex flex-col lg:flex-row bg-background">
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
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-white font-bold">SUPABASE CONECTADO</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
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
const AdminOverview = ({ setActive }: { setActive: (s: AdminSection) => void }) => (
  <div className="animate-fade-in">
    <div className="mb-12">
      <h2 className="text-4xl font-serif font-medium text-primary">Panel de Control</h2>
      <p className="text-secondary text-sm mt-2">Bienvenido al centro de administración de Traveliz Compass.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[
        { label: 'Asociadas', count: '24', icon: 'fa-users', section: 'directory' as AdminSection },
        { label: 'Avisos Hoy', count: '02', icon: 'fa-bullhorn', section: 'notices' as AdminSection },
        { label: 'Eventos Oct', count: '06', icon: 'fa-calendar', section: 'events' as AdminSection },
        { label: 'Posts Blog', count: '12', icon: 'fa-newspaper', section: 'blog' as AdminSection },
      ].map((stat, i) => (
        <button 
          key={i} 
          onClick={() => setActive(stat.section)}
          className="bg-surface border border-neutral p-8 text-left hover:border-accent hover:shadow-xl transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-background flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <span className="text-3xl font-serif font-bold text-primary">{stat.count}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-brand transition-colors">{stat.label}</p>
        </button>
      ))}
    </div>

    <div className="bg-brand p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h3 className="text-3xl font-serif mb-2">¿Necesitas ayuda con el panel?</h3>
        <p className="text-gray-300 text-sm max-w-md">Consulta la guía de usuario para administradores o contacta con el equipo de soporte técnico IT.</p>
      </div>
      <button className="bg-accent text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand transition-all">Ver Documentación</button>
    </div>
  </div>
);

/* --- SUB-COMPONENT: DIRECTORY MANAGEMENT --- */
const AdminDirectory = ({ Header }: any) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getAssociates();
    setAssociates(data);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <Header 
        title="Directorio" 
        subtitle="Gestiona el perfil de las asociadas y su información de contacto." 
        actionLabel="Nueva Asociada" 
        onAction={() => alert("Formulario abierto")} 
      />
      <div className="bg-surface border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-background border-b border-neutral">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Perfil</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Cargo</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse h-20 bg-gray-50/50"></tr>)
            ) : (
              associates.map((assoc) => (
                <tr key={assoc.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <img src={assoc.image} className="w-10 h-10 rounded-full object-cover grayscale" />
                      <div>
                        <p className="text-sm font-bold text-primary">{assoc.name}</p>
                        <p className="text-[10px] text-secondary">{assoc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-secondary italic font-serif">{assoc.position}</td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-secondary hover:text-brand px-2"><i className="fa-solid fa-pen"></i></button>
                    <button className="text-secondary hover:text-red-600 px-2"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: NOTICES MANAGEMENT --- */
const AdminNotices = ({ Header }: any) => (
  <div className="animate-fade-in">
    <Header 
      title="Avisos Importantes" 
      subtitle="Publica noticias, cambios de política y anuncios críticos para el equipo." 
      actionLabel="Crear Aviso" 
    />
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-surface border border-neutral p-10 flex items-center justify-center opacity-40 italic text-secondary">
        Cargando feed de avisos...
      </div>
    </div>
  </div>
);

/* --- SUB-COMPONENT: EVENTS MANAGEMENT --- */
const AdminEvents = ({ Header }: any) => (
  <div className="animate-fade-in">
    <Header 
      title="Calendario" 
      subtitle="Organiza eventos, webinars y viajes de inspección corporativos." 
      actionLabel="Programar Evento" 
    />
    <div className="bg-surface border border-neutral p-10 flex items-center justify-center opacity-40 italic text-secondary">
      Cargando calendario maestro...
    </div>
  </div>
);

export default AdminPanel;