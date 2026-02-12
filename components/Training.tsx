

import React, { useState, useEffect, useMemo } from 'react';
import { api, RecordedWebinar, WEBINAR_CATEGORIES } from '../services/api';

const Training: React.FC = () => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [webinars, setWebinars] = useState<RecordedWebinar[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (showLibrary) {
      loadLibrary();
    }
  }, [showLibrary]);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const data = await api.getRecordedWebinars();
      setWebinars(data || []);
    } catch (error) {
      console.error("Error cargando biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Filtrado por búsqueda
  const filteredWebinars = useMemo(() => {
    return webinars.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [webinars, searchTerm]);

  // Agrupación por categorías
  const groupedWebinars = useMemo(() => {
    const groups: Record<string, RecordedWebinar[]> = {};
    WEBINAR_CATEGORIES.forEach(cat => {
      const items = filteredWebinars.filter(w => w.category === cat);
      if (items.length > 0) groups[cat] = items;
    });
    return groups;
  }, [filteredWebinars]);

  if (showLibrary) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-12 md:py-20 animate-fade-in">
        {/* Barra de Navegación y Búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <button 
                onClick={() => { setShowLibrary(false); setSearchTerm(''); }} 
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-secondary hover:text-brand transition-colors"
            >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver
            </button>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={loadLibrary}
                    className="w-12 h-12 flex items-center justify-center border border-neutral hover:bg-white text-secondary hover:text-brand transition-all"
                    title="Actualizar biblioteca"
                >
                    <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
                </button>
                <div className="relative flex-1 md:w-80">
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar capacitación..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-neutral text-xs focus:border-brand outline-none transition-all placeholder-secondary/50 shadow-sm"
                    />
                    <i className="fa-solid fa-search absolute left-5 top-4.5 text-secondary/30 text-xs"></i>
                </div>
            </div>
        </div>

        {/* Título */}
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[1px] bg-accent"></span>
                <span className="text-accent text-[10px] font-bold uppercase tracking-[4px]">On-Demand Learning</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-primary">Webinars Grabados</h1>
            <p className="text-secondary text-lg mt-6 font-light max-w-2xl leading-relaxed">
                Nuestra videoteca exclusiva de capacitaciones. Revive las sesiones de producto y destino en cualquier momento.
            </p>
        </div>

        {loading ? (
            <div className="py-32 text-center">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand/20 mb-4"></i>
                <p className="text-secondary font-serif italic">Conectando con la videoteca...</p>
            </div>
        ) : Object.keys(groupedWebinars).length === 0 ? (
            <div className="py-32 text-center border border-dashed border-neutral bg-white/40">
                <i className="fa-solid fa-clapperboard text-5xl text-neutral mb-6 opacity-20"></i>
                <h3 className="text-xl font-serif text-primary mb-2">No se encontraron sesiones</h3>
                <p className="text-secondary text-sm">Intenta con otros términos de búsqueda.</p>
            </div>
        ) : (
            <div className="space-y-32">
                {/* Fixed TypeScript error by explicitly casting Object.entries results to ensure 'items' is treated as RecordedWebinar[] instead of 'unknown' */}
                {(Object.entries(groupedWebinars) as [string, RecordedWebinar[]][]).map(([category, items]) => (
                    <section key={category} className="animate-slide-up">
                        <div className="flex items-end justify-between mb-12 pb-6 border-b border-neutral/60">
                            <h2 className="text-xs font-bold uppercase tracking-[4px] text-primary flex items-center gap-3">
                                <i className="fa-solid fa-folder-open text-accent text-[10px]"></i>
                                {category}
                            </h2>
                            <span className="text-[9px] font-bold text-secondary bg-white px-3 py-1 border border-neutral">
                                {items.length} {items.length === 1 ? 'SESIÓN' : 'SESIONES'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {/* Fixed 'map' property error by ensuring 'items' is correctly typed as an array */}
                            {items.map(webinar => (
                                <div key={webinar.id} className="bg-white border border-neutral group hover:shadow-2xl hover:border-brand/20 transition-all duration-500 flex flex-col luxury-image-hover relative">
                                    
                                    {/* Overlay Feedback de Copiado */}
                                    {copySuccess === webinar.access_code && (
                                        <div className="absolute top-4 right-4 z-20 bg-accent text-white px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest animate-fade-in shadow-xl">
                                            Copiado
                                        </div>
                                    )}

                                    {/* 1. cover_image */}
                                    <div className="aspect-video relative overflow-hidden bg-primary">
                                        <img 
                                            src={webinar.cover_image} 
                                            alt={webinar.name} 
                                            className="w-full h-full object-cover opacity-85 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100" 
                                        />
                                        <div className="absolute inset-0 bg-brand/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                            <a 
                                                href={webinar.access_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-16 h-16 bg-white rounded-none flex items-center justify-center text-brand text-xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent hover:text-white"
                                            >
                                                <i className="fa-solid fa-play ml-1"></i>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Info Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        {/* 2. name ("Sesión") */}
                                        <div className="mb-8">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-accent mb-2 block">Sesión</span>
                                            <h3 className="font-serif text-xl text-primary leading-tight group-hover:text-brand transition-colors h-14 line-clamp-2">
                                                {webinar.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="mt-auto space-y-6">
                                            {/* 4. access_code ("Código de acceso") */}
                                            <div className="flex items-center justify-between bg-background p-4 border border-neutral/40 group/code hover:border-accent/40 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-bold uppercase text-secondary tracking-[2px] mb-1">Código de acceso</span>
                                                    <span className="text-[11px] font-mono font-bold text-primary tracking-wider uppercase">
                                                        {webinar.access_code || 'Acceso Libre'}
                                                    </span>
                                                </div>
                                                {webinar.access_code && (
                                                    <button 
                                                        onClick={() => handleCopyCode(webinar.access_code!)}
                                                        className="w-10 h-10 flex items-center justify-center text-secondary hover:text-accent hover:bg-white transition-all"
                                                        title="Copiar Código"
                                                    >
                                                        <i className={`fa-regular ${copySuccess === webinar.access_code ? 'fa-check text-accent' : 'fa-copy'} text-sm`}></i>
                                                    </button>
                                                )}
                                            </div>

                                            {/* 3. access_link ("Ver Webinar") */}
                                            <a 
                                                href={webinar.access_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[4px] hover:bg-brand transition-all shadow-lg active:scale-95"
                                            >
                                                Ver Webinar
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        )}

        {/* Footer */}
        <div className="mt-40 pt-16 border-t border-neutral text-center">
            <p className="text-[9px] text-secondary font-bold uppercase tracking-[5px]">
                Traveliz Academy &copy; 2026 - Conocimiento sin Fronteras
            </p>
        </div>
      </div>
    );
  }

  // Vista General de Capacitación (No modificada pero mantenida para integridad)
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
            <div className="bg-surface p-12 border border-neutral hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col h-full">
                <div className="w-16 h-16 bg-brand/5 rounded-none flex items-center justify-center mb-8 group-hover:bg-brand transition-colors">
                    <i className="fa-solid fa-graduation-cap text-3xl text-brand group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-3xl mb-4 text-primary group-hover:text-brand transition-colors">Certificaciones</h3>
                <p className="text-sm text-secondary leading-luxury mb-10 flex-grow font-light">
                    Rutas de aprendizaje estructuradas para obtener el sello de Agente Elite. Mantente certificado en las marcas más exclusivas.
                </p>
                <div className="mt-auto pt-8 border-t border-neutral">
                     <span className="text-[10px] font-bold uppercase tracking-[3px] text-brand group-hover:text-accent transition-colors flex items-center gap-3">
                        Mis Cursos <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </div>
            </div>

            <div 
                onClick={() => setShowLibrary(true)} 
                className="bg-surface p-12 border border-accent/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col h-full relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-12 -mt-12 group-hover:w-32 group-hover:h-32 transition-all"></div>
                <div className="w-16 h-16 bg-accent/5 rounded-none flex items-center justify-center mb-8 group-hover:bg-accent transition-colors">
                    <i className="fa-solid fa-play text-2xl text-accent group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-3xl mb-4 text-primary group-hover:text-accent transition-colors">Webinars Grabados</h3>
                <p className="text-sm text-secondary leading-luxury mb-10 flex-grow font-light">
                    Nuestra biblioteca histórica de grabaciones sincronizada en tiempo real. Repasa destinos y productos en cualquier momento.
                </p>
                <div className="mt-auto pt-8 border-t border-neutral">
                     <span className="text-[10px] font-bold uppercase tracking-[3px] text-accent group-hover:text-brand transition-colors flex items-center gap-3">
                        Entrar a la Biblioteca <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </div>
            </div>

            <div className="bg-surface p-12 border border-neutral hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col h-full">
                <div className="w-16 h-16 bg-brand/5 rounded-none flex items-center justify-center mb-8 group-hover:bg-brand transition-colors">
                    <i className="fa-solid fa-users text-3xl text-brand group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-3xl mb-4 text-primary group-hover:text-brand transition-colors">Mentoria 1:1</h3>
                <p className="text-sm text-secondary leading-luxury mb-10 flex-grow font-light">
                    Sesiones personalizadas con especialistas senior para resolver dudas sobre expedientes complejos o desarrollo de negocio.
                </p>
                <div className="mt-auto pt-8 border-t border-neutral">
                     <span className="text-[10px] font-bold uppercase tracking-[3px] text-brand group-hover:text-accent transition-colors flex items-center gap-3">
                        Agendar Sesión <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Training;
