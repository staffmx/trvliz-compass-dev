import React from 'react';

const Training: React.FC = () => {
  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
        
        {/* Page Header */}
        <div className="text-center mb-16">
            <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
                Traveliz Academy
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
                Centro de Capacitación
            </h1>
            <p className="text-secondary text-lg mt-6 max-w-2xl mx-auto font-light">
                Herramientas y recursos diseñados para potenciar tu desarrollo profesional y mantenerte a la vanguardia del turismo de lujo.
            </p>
        </div>

        {/* Resources Blocks */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-surface p-10 border border-neutral hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                    <i className="fa-solid fa-graduation-cap text-3xl text-brand group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary group-hover:text-brand transition-colors">Certificaciones</h3>
                <p className="text-sm text-secondary leading-relaxed mb-8 flex-grow">
                    Completa los cursos obligatorios y electivos para mantener tu estatus de Agente Elite 2026 y acceder a beneficios exclusivos.
                </p>
                <div className="mt-auto pt-6 border-t border-neutral">
                     <span className="text-xs font-bold uppercase tracking-widest text-brand group-hover:text-accent transition-colors flex items-center gap-2">
                        Ir a mis Cursos <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>

            <div className="bg-surface p-10 border border-neutral hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                    <i className="fa-solid fa-video text-3xl text-brand group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary group-hover:text-brand transition-colors">Webinars Grabados</h3>
                <p className="text-sm text-secondary leading-relaxed mb-8 flex-grow">
                    Accede a nuestra biblioteca on-demand con sesiones pasadas sobre destinos emergentes, nuevos hoteles y herramientas tecnológicas.
                </p>
                <div className="mt-auto pt-6 border-t border-neutral">
                     <span className="text-xs font-bold uppercase tracking-widest text-brand group-hover:text-accent transition-colors flex items-center gap-2">
                        Ver Biblioteca <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>

            <div className="bg-surface p-10 border border-neutral hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full">
                <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand transition-colors">
                    <i className="fa-solid fa-users text-3xl text-brand group-hover:text-white transition-colors"></i>
                </div>
                <h3 className="font-serif text-2xl mb-3 text-primary group-hover:text-brand transition-colors">Mentoria 1:1</h3>
                <p className="text-sm text-secondary leading-relaxed mb-8 flex-grow">
                    Agenda una sesión privada con un experto senior para revisar casos complejos, estrategias de venta o desarrollo de carrera.
                </p>
                <div className="mt-auto pt-6 border-t border-neutral">
                     <span className="text-xs font-bold uppercase tracking-widest text-brand group-hover:text-accent transition-colors flex items-center gap-2">
                        Agendar Sesión <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>

        </div>

    </div>
  );
};

export default Training;