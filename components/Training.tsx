
import React, { useState, useEffect, useMemo } from 'react';
import { api, RecordedWebinar, WEBINAR_CATEGORIES } from '../services/api';
import { User } from '../types';

const ITEMS_PER_PAGE = 12;

interface TrainingProps {
  user: User;
}

const Training: React.FC<TrainingProps> = ({ user }) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [webinars, setWebinars] = useState<RecordedWebinar[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const [mentorshipData, setMentorshipData] = useState({
    name: user.name,
    email: user.email,
    date: '',
    topic: 'capacitación sobre cruceros',
    comments: ''
  });

  useEffect(() => {
    if (showLibrary) {
      loadLibrary();
    }
  }, [showLibrary]);

  const loadLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRecordedWebinars();
      setWebinars(data || []);
    } catch (err: any) {
      console.error("Error cargando biblioteca:", err);
      setError("No se pudo sincronizar con la base de datos de webinars.");
    } finally {
      setLoading(false);
    }
  };

  const handleMentorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.createMentorshipRequest({
        user_id: user.id,
        name: mentorshipData.name,
        email: mentorshipData.email,
        tentative_date: mentorshipData.date,
        topic: mentorshipData.topic,
        comments: mentorshipData.comments,
        status: 'pending'
      });

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowMentorshipForm(false);
          setMentorshipData({
              name: user.name,
              email: user.email,
              date: '',
              topic: 'capacitación sobre cruceros',
              comments: ''
          });
        }, 3000);
      } else {
        setError(result.error || "No se pudo enviar la solicitud. Por favor intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error submitting mentorship:", err);
      setError("Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // 1. Filtrado
  const filteredWebinars = useMemo(() => {
    const filtered = webinars.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.category && w.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filtered;
  }, [webinars, searchTerm]);

  // 2. Paginación Global
  const totalPages = Math.ceil(filteredWebinars.length / ITEMS_PER_PAGE);
  const paginatedWebinars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWebinars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWebinars, currentPage]);

  // 3. Agrupación por categorías de los resultados paginados
  const groupedWebinars = useMemo(() => {
    const groups: Record<string, RecordedWebinar[]> = {};
    
    // Solo agrupamos lo que está en la página actual para mantener coherencia visual
    paginatedWebinars.forEach(w => {
        const cat = w.category || 'Sin Categoría';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(w);
    });

    return groups;
  }, [paginatedWebinars]);

  // Reset de página al buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showLibrary) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-12 animate-fade-in">
        
        {/* Superior: Navegación y Búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <button 
                onClick={() => { setShowLibrary(false); setSearchTerm(''); }} 
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-secondary hover:text-brand transition-colors"
            >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver
            </button>
            
            <div className="relative w-full md:w-[500px]">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por sesión o destino..."
                    className="w-full pl-12 pr-12 py-4 bg-white border border-neutral text-sm focus:border-brand outline-none transition-all placeholder-secondary/50 shadow-sm"
                />
                <i className="fa-solid fa-search absolute left-5 top-4.5 text-secondary/30 text-xs"></i>
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-4 text-secondary/40 hover:text-brand transition-colors">
                        <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                )}
            </div>
        </div>

        {/* Título Principal */}
        <div className="mb-16 border-b border-neutral pb-12">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-3 block">Recursos Traveliz</span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">Webinars Grabados</h1>
            <p className="text-secondary text-base mt-4 font-light max-w-2xl leading-relaxed">
                Mostrando {paginatedWebinars.length} de {filteredWebinars.length} sesiones encontradas.
            </p>
        </div>

        {loading ? (
            <div className="py-32 text-center">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand/20 mb-4"></i>
                <p className="text-secondary font-serif italic">Sincronizando biblioteca...</p>
            </div>
        ) : error ? (
            <div className="py-20 text-center bg-red-50 p-10 border border-red-100">
                <i className="fa-solid fa-triangle-exclamation text-3xl text-red-400 mb-4"></i>
                <h3 className="text-lg font-serif text-red-800 mb-2">Error de conexión</h3>
                <p className="text-red-700 text-sm mb-6">{error}</p>
                <button onClick={loadLibrary} className="bg-red-600 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest">Reintentar</button>
            </div>
        ) : filteredWebinars.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-neutral">
                <i className="fa-solid fa-film text-4xl text-neutral mb-4 opacity-20"></i>
                <h3 className="text-xl font-serif text-primary">No hay resultados</h3>
                <p className="text-secondary text-sm">Prueba con otros términos de búsqueda.</p>
            </div>
        ) : (
            <>
                <div className="space-y-24">
                    {Object.entries(groupedWebinars).map(([category, items]) => (
                        <section key={category} className="animate-slide-up">
                            <div className="flex items-center gap-4 mb-10">
                                <h2 className="text-[10px] font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">{category}</h2>
                                <div className="h-[1px] bg-neutral/60 w-full"></div>
                            </div>

                            {/* GRID DE 4 COLUMNAS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {(items as RecordedWebinar[]).map(webinar => (
                                    <div key={webinar.id} className="bg-white border border-neutral group hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden">
                                        
                                        {/* 1. cover_image */}
                                        <div className="aspect-video relative overflow-hidden bg-primary">
                                            <img 
                                                src={webinar.cover_image} 
                                                alt={webinar.name} 
                                                className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105" 
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop' }}
                                            />
                                            <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                <i className="fa-solid fa-play text-white text-2xl"></i>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            {/* 2. name ("Sesión") */}
                                            <div className="mb-6">
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-accent mb-1.5 block">Sesión:</span>
                                                <h3 className="font-serif text-base text-primary leading-tight group-hover:text-brand transition-colors line-clamp-2 h-10">
                                                    {webinar.name}
                                                </h3>
                                            </div>
                                            
                                            <div className="mt-auto space-y-4">
                                                {/* 3. access_link (Botón "Ver Webinar") */}
                                                <a 
                                                    href={webinar.access_link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="block w-full text-center py-3 bg-brand text-white text-[9px] font-bold uppercase tracking-[3px] hover:bg-primary transition-all shadow-md active:scale-95"
                                                >
                                                    Ver Webinar
                                                </a>

                                                {/* 4. access_code ("Código de acceso") */}
                                                <div className="flex items-center justify-between bg-background p-3 border border-neutral/40">
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-[7px] font-bold uppercase text-secondary tracking-[1px] mb-0.5">Código de acceso:</span>
                                                        <span className="text-[10px] font-mono font-bold text-primary truncate">
                                                            {webinar.access_code || 'Libre'}
                                                        </span>
                                                    </div>
                                                    {webinar.access_code && (
                                                        <button 
                                                            onClick={() => handleCopyCode(webinar.access_code!)}
                                                            className="text-secondary hover:text-accent p-1"
                                                            title="Copiar"
                                                        >
                                                            <i className={`fa-regular ${copySuccess === webinar.access_code ? 'fa-check text-accent' : 'fa-copy'} text-xs`}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {copySuccess === webinar.access_code && (
                                            <div className="absolute top-2 right-2 z-20 bg-accent text-white px-2 py-1 text-[7px] font-bold uppercase tracking-widest shadow-lg animate-fade-in">
                                                Copiado
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className="mt-24 pt-12 border-t border-neutral flex justify-center items-center gap-3">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                            className="w-10 h-10 flex items-center justify-center border border-neutral text-primary hover:bg-brand hover:text-white disabled:opacity-20 transition-all"
                        >
                            <i className="fa-solid fa-chevron-left text-xs"></i>
                        </button>
                        
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`w-10 h-10 text-[10px] font-bold transition-all ${
                                        currentPage === page 
                                            ? 'bg-brand text-white border-brand' 
                                            : 'bg-white border border-neutral text-primary hover:bg-neutral'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                            className="w-10 h-10 flex items-center justify-center border border-neutral text-primary hover:bg-brand hover:text-white disabled:opacity-20 transition-all"
                        >
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    );
  }

  if (showMentorshipForm) {
    return (
        <div className="max-w-site mx-auto px-mobile-x py-12 animate-fade-in">
            <button 
                onClick={() => setShowMentorshipForm(false)} 
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-secondary hover:text-brand transition-colors mb-12"
            >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver a Academy
            </button>

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-3 block">Crecimiento Profesional</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">Mentoria 1:1</h1>
                    <p className="text-secondary text-base mt-4 font-light leading-relaxed">
                        Agenda una sesión personalizada para resolver dudas específicas sobre tus expedientes o estrategias de venta.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 mb-6 text-red-700 text-sm animate-fade-in">
                        <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                    </div>
                )}

                {submitted ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-12 text-center animate-slide-up">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <i className="fa-solid fa-check text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-serif text-emerald-900 mb-2">¡Solicitud Enviada!</h2>
                        <p className="text-emerald-700 font-light">Un especialista senior se pondrá en contacto contigo pronto para confirmar la sesión.</p>
                    </div>
                ) : (
                    <form onSubmit={handleMentorshipSubmit} className="bg-white border border-neutral p-8 md:p-12 shadow-xl space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={mentorshipData.name || ''}
                                    disabled
                                    className="w-full p-4 bg-gray-50 border border-neutral text-sm text-gray-500 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Email Corporativo</label>
                                <input 
                                    type="email" 
                                    value={mentorshipData.email || ''}
                                    disabled
                                    className="w-full p-4 bg-gray-50 border border-neutral text-sm text-gray-500 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Fecha y Hora Tentativa</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    value={mentorshipData.date || ''}
                                    onChange={(e) => setMentorshipData({...mentorshipData, date: e.target.value})}
                                    className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-background transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Tema a Tratar</label>
                                <select 
                                    required
                                    value={mentorshipData.topic || ''}
                                    onChange={(e) => setMentorshipData({...mentorshipData, topic: e.target.value})}
                                    className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-background transition-colors appearance-none"
                                >
                                    <option value="capacitación sobre cruceros">Capacitación sobre cruceros</option>
                                    <option value="capacitación sobre tierra">Capacitación sobre tierra</option>
                                    <option value="cruceros de lujo">Cruceros de lujo</option>
                                    <option value="comisiones">Comisiones</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Comentarios / Dudas Específicas</label>
                            <textarea 
                                rows={4}
                                value={mentorshipData.comments || ''}
                                onChange={(e) => setMentorshipData({...mentorshipData, comments: e.target.value})}
                                placeholder="Cuéntanos un poco más sobre lo que te gustaría revisar..."
                                className="w-full p-4 border border-neutral focus:border-brand outline-none text-sm bg-background transition-colors resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-5 bg-brand text-white font-bold uppercase tracking-[4px] text-xs hover:bg-primary transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin"></i> Procesando...
                                </>
                            ) : 'Solicitar Mentoria'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
        <div className="text-center mb-20">
            <span className="text-brand text-xs font-bold uppercase tracking-[5px] mb-4 block">Capacitación Permanente</span>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-primary">Traveliz Academy</h1>
            <p className="text-secondary text-lg mt-8 max-w-2xl mx-auto font-light leading-relaxed">
                Potenciamos tu talento con herramientas y conocimientos de clase mundial para el sector de lujo.
            </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <TrainingLinkCard 
                icon="fa-graduation-cap" 
                title="Certificaciones" 
                desc="Rutas de aprendizaje estructuradas para obtener el sello de Agente Elite. Mantente certificado en las marcas más exclusivas."
                label="Mis Cursos"
            />
            <TrainingLinkCard 
                icon="fa-play" 
                title="Webinars Grabados" 
                desc="Biblioteca histórica de grabaciones sincronizada con Supabase. Grid de alta densidad y buscador rápido."
                label="Entrar a la Biblioteca"
                onClick={() => setShowLibrary(true)}
                highlight
            />
            <TrainingLinkCard 
                icon="fa-users" 
                title="Mentoria 1:1" 
                desc="Sesiones personalizadas con especialistas senior para resolver dudas sobre expedientes complejos o desarrollo de negocio."
                label="Agendar Sesión"
                onClick={() => setShowMentorshipForm(true)}
            />
        </div>
    </div>
  );
};

const TrainingLinkCard: React.FC<{ icon: string, title: string, desc: string, label: string, onClick?: () => void, highlight?: boolean }> = ({ icon, title, desc, label, onClick, highlight }) => (
    <div 
        onClick={onClick}
        className={`bg-surface p-12 border transition-all duration-500 group cursor-pointer flex flex-col h-full relative overflow-hidden ${highlight ? 'border-accent/20 shadow-xl hover:shadow-2xl' : 'border-neutral hover:shadow-2xl hover:-translate-y-2'}`}
    >
        {highlight && <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-12 -mt-12"></div>}
        <div className={`w-16 h-16 rounded-none flex items-center justify-center mb-8 transition-colors ${highlight ? 'bg-accent/5 group-hover:bg-accent' : 'bg-brand/5 group-hover:bg-brand'}`}>
            <i className={`fa-solid ${icon} text-2xl ${highlight ? 'text-accent' : 'text-brand'} group-hover:text-white transition-colors`}></i>
        </div>
        <h3 className={`font-serif text-3xl mb-4 text-primary transition-colors ${highlight ? 'group-hover:text-accent' : 'group-hover:text-brand'}`}>{title}</h3>
        <p className="text-sm text-secondary leading-luxury mb-10 flex-grow font-light">{desc}</p>
        <div className="mt-auto pt-8 border-t border-neutral">
             <span className={`text-[10px] font-bold uppercase tracking-[3px] transition-colors flex items-center gap-3 ${highlight ? 'text-accent group-hover:text-brand' : 'text-brand group-hover:text-accent'}`}>
                {label} <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
        </div>
    </div>
);

export default Training;
