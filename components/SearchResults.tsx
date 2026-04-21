import React from 'react';
import { SearchResults as SearchResultsType, NavigationItem, Notice, Event, Certification, Associate, Document, BlogPost, RecordedWebinar } from '../types';

interface SearchResultsProps {
  results: SearchResultsType;
  searchTerm: string;
  onNavigate: (nav: NavigationItem) => void;
  onEventClick: (id: number) => void;
  onNoticeClick: (id: string) => void;
  onViewProfile: (id: number) => void;
  onBlogClick?: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  searchTerm, 
  onNavigate, 
  onEventClick, 
  onNoticeClick,
  onViewProfile,
  onBlogClick
}) => {
  const totalResults = 
    results.notices.length + 
    results.events.length + 
    results.certifications.length + 
    results.associates.length + 
    results.documents.length +
    (results.blogs?.length || 0) +
    (results.recorded_webinars?.length || 0);

  const isEmpty = totalResults === 0;

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="mb-12 border-b border-neutral pb-8">
        <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-2 block">Motor de Búsqueda</span>
        <h2 className="text-4xl font-serif text-primary mb-2">Explorando Resultados</h2>
        <p className="text-secondary font-light">
          {isEmpty 
            ? `No se encontraron coincidencias para "${searchTerm}"` 
            : `Se identificaron ${totalResults} resultados relevantes para "${searchTerm}"`}
        </p>
      </div>

      {isEmpty ? (
        <div className="bg-white border border-neutral p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-background rounded-none flex items-center justify-center mx-auto mb-6 text-neutral">
            <i className="fa-solid fa-magnifying-glass text-3xl opacity-20"></i>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-3">Sin coincidencias exactas</h3>
          <p className="text-secondary font-light max-w-md mx-auto mb-10 leading-relaxed">
            Intenta con términos más generales (ej: "Cruise", "Ventas", "Directorio") para encontrar lo que buscas en el universo Traveliz.
          </p>
          <button 
            onClick={() => onNavigate(NavigationItem.DASHBOARD)}
            className="px-10 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[3px] hover:bg-brand transition-all shadow-lg active:scale-95"
          >
            Volver al Inicio
          </button>
        </div>
      ) : (
        <div className="space-y-24">
          {/* Notices */}
          {results.notices.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Avisos y Comunicados</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.notices.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.notices.map((notice) => (
                  <div 
                    key={notice.id} 
                    onClick={() => onNoticeClick(notice.id)}
                    className="bg-white border border-neutral p-8 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-1">{notice.category}</span>
                      <span className="text-[10px] text-secondary font-light">{notice.date}</span>
                    </div>
                    <h4 className="text-xl font-serif text-primary mb-4 group-hover:text-brand transition-colors line-clamp-2 leading-tight">{notice.title}</h4>
                    <p className="text-secondary text-sm font-light line-clamp-3 mb-6 leading-relaxed">{notice.content}</p>
                    <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-primary group-hover:text-brand transition-colors">
                      Expandir información <i className="fa-solid fa-arrow-right ml-3 text-[8px] group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Blogs */}
          {results.blogs && results.blogs.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Inspiración (Blog)</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.blogs.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.blogs.map((post) => (
                  <div 
                    key={post.id} 
                    onClick={() => onBlogClick && onBlogClick(post.id)}
                    className="bg-white border border-neutral hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="aspect-video overflow-hidden bg-primary relative">
                       <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{post.category}</span>
                        <span className="text-[10px] text-secondary font-light">{post.read_time}</span>
                      </div>
                      <h4 className="text-xl font-serif text-primary mb-4 group-hover:text-brand transition-colors line-clamp-2 leading-tight">{post.title}</h4>
                      <p className="text-secondary text-xs font-light line-clamp-2 mb-6 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-auto pt-6 border-t border-neutral flex justify-between items-center">
                        <span className="text-[9px] font-medium text-secondary uppercase">Por {post.author}</span>
                        <i className="fa-solid fa-chevron-right text-[10px] text-brand group-hover:translate-x-1 transition-transform"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recorded Webinars */}
          {results.recorded_webinars && results.recorded_webinars.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Academy (Webinars)</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.recorded_webinars.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {results.recorded_webinars.map((webinar) => (
                  <div 
                    key={webinar.id} 
                    className="bg-white border border-neutral group hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden bg-primary">
                      <img src={webinar.cover_image} alt={webinar.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <i className="fa-solid fa-play text-white text-2xl"></i>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-accent mb-2 block">{webinar.category}</span>
                      <h4 className="font-serif text-sm text-primary mb-4 line-clamp-2 h-10 group-hover:text-brand transition-colors leading-snug">{webinar.name}</h4>
                      <a 
                        href={webinar.access_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-auto block w-full text-center py-2.5 bg-brand text-white text-[9px] font-bold uppercase tracking-widest hover:bg-primary transition-all"
                      >
                        Ver Sesión
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {results.certifications.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Certificaciones Academy</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.certifications.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.certifications.map((cert) => (
                  <div 
                    key={cert.id} 
                    onClick={() => onNavigate(NavigationItem.CAPACITACION)}
                    className="flex bg-white border border-neutral hover:shadow-xl transition-all cursor-pointer group"
                  >
                    {cert.img_certificacion && (
                      <div className="w-1/3 aspect-square overflow-hidden bg-primary shrink-0 border-r border-neutral">
                        <img src={cert.img_certificacion} alt={cert.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-8 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent mb-2 block">{cert.company}</span>
                      <h4 className="text-xl font-serif text-primary mb-3 group-hover:text-brand transition-colors leading-tight">{cert.name}</h4>
                      <p className="text-secondary text-xs font-light line-clamp-2 leading-relaxed mb-4">{cert.description}</p>
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-secondary pt-4 border-t border-neutral/40">
                         <span>{cert.mode}</span>
                         <span className="text-brand">Academy <i className="fa-solid fa-arrow-right ml-1"></i></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {results.events.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Calendario de Eventos</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.events.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.events.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onEventClick(event.id!)}
                    className="flex bg-white border border-neutral overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="w-24 bg-background flex flex-col items-center justify-center border-r border-neutral p-4 shrink-0 transition-colors group-hover:bg-brand/5">
                      <span className="text-3xl font-serif text-primary leading-none">{event.day}</span>
                      <span className="text-[10px] uppercase tracking-widest text-brand mt-2 font-bold">{event.month}</span>
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`w-2 h-2 rounded-full ${
                          event.type === 'Webinar' ? 'bg-blue-500' : 
                          event.type === 'Presencial' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">{event.type}</span>
                      </div>
                      <h4 className="text-xl font-serif text-primary mb-3 group-hover:text-brand transition-colors leading-tight">{event.title}</h4>
                      <div className="flex items-center text-[11px] text-secondary font-light">
                        <i className="fa-regular fa-clock mr-3 text-brand"></i> {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Associates */}
          {results.associates.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Colegas y Expertos (Directorio)</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.associates.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {results.associates.map((associate) => (
                  <div 
                    key={associate.id}
                    className="bg-white border border-neutral p-8 text-center hover:shadow-2xl transition-all group relative"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 relative overflow-hidden">
                      <img 
                        src={associate.image || `https://ui-avatars.com/api/?name=${associate.name}+${associate.last_name}&background=f8f9fa&color=1a1a1a`} 
                        alt={associate.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 border border-black/5"></div>
                    </div>
                    <h4 className="text-lg font-serif text-primary mb-2 leading-tight">{associate.name} {associate.last_name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-6">{associate.position || 'Asociado'}</p>
                    <button 
                      onClick={() => associate.id && onViewProfile(associate.id)}
                      className="inline-block text-[10px] uppercase tracking-[3px] text-primary font-bold border-b border-primary/20 pb-1 hover:border-brand hover:text-brand transition-all"
                    >
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          {results.documents.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Documentación Oficial</h3>
                <div className="h-[1px] flex-grow bg-neutral"></div>
                <span className="text-[10px] font-mono text-secondary">{results.documents.length}</span>
              </div>
              <div className="bg-white border border-neutral overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-neutral">
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[3px] text-primary font-bold">Documento</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[3px] text-primary font-bold hidden md:table-cell">Formato</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[3px] text-primary font-bold hidden sm:table-cell">Tamaño</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-[3px] text-primary font-bold text-right">Descarga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-neutral/40 hover:bg-background/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-10 h-10 bg-background flex items-center justify-center text-secondary group-hover:bg-brand group-hover:text-white transition-colors">
                              <i className={`fa-solid ${
                                doc.type === 'pdf' ? 'fa-file-pdf' : 
                                doc.type === 'doc' || doc.type === 'docx' ? 'fa-file-word' : 
                                doc.type === 'xls' || doc.type === 'xlsx' ? 'fa-file-excel' : 'fa-file'
                              } text-base`}></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary group-hover:text-brand transition-colors tracking-wide">{doc.name}</p>
                              <p className="text-[10px] text-secondary mt-1 md:hidden uppercase tracking-widest">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] text-secondary font-bold uppercase tracking-widest hidden md:table-cell">{doc.type}</td>
                        <td className="px-8 py-6 text-xs text-secondary font-light hidden sm:table-cell">{doc.size}</td>
                        <td className="px-8 py-6 text-right">
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-background border border-neutral text-secondary hover:bg-brand hover:text-white hover:border-brand transition-all shadow-sm active:scale-90"
                            title="Descargar Documento"
                          >
                            <i className="fa-solid fa-cloud-arrow-down text-sm"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
