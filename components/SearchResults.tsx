
import React from 'react';
import { SearchResults as SearchResultsType, NavigationItem, Notice, Event, Certification, Associate, Document } from '../types';

interface SearchResultsProps {
  results: SearchResultsType;
  searchTerm: string;
  onNavigate: (nav: NavigationItem) => void;
  onEventClick: (id: number) => void;
  onNoticeClick: (id: string) => void;
  onViewProfile: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  searchTerm, 
  onNavigate, 
  onEventClick, 
  onNoticeClick,
  onViewProfile
}) => {
  const totalResults = 
    results.notices.length + 
    results.events.length + 
    results.certifications.length + 
    results.associates.length + 
    results.documents.length;

  const isEmpty = totalResults === 0;

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-serif text-primary mb-2">Resultados de búsqueda</h2>
        <p className="text-secondary font-light">
          {isEmpty 
            ? `No se encontraron resultados para "${searchTerm}"` 
            : `Se encontraron ${totalResults} resultados para "${searchTerm}"`}
        </p>
      </div>

      {isEmpty ? (
        <div className="bg-white border border-gray-100 p-12 text-center rounded-sm shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <i className="fa-solid fa-magnifying-glass text-2xl"></i>
          </div>
          <h3 className="text-xl font-serif text-primary mb-2">Sin coincidencias</h3>
          <p className="text-secondary font-light max-w-md mx-auto">
            Intenta con términos más generales o verifica la ortografía de tu búsqueda.
          </p>
          <button 
            onClick={() => onNavigate(NavigationItem.DASHBOARD)}
            className="mt-8 px-8 py-3 bg-primary text-white text-xs uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Notices */}
          {results.notices.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-serif text-primary">Avisos</h3>
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{results.notices.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.notices.map((notice) => (
                  <div 
                    key={notice.id} 
                    onClick={() => onNoticeClick(notice.id)}
                    className="bg-white border border-gray-100 p-6 hover:border-accent transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] uppercase tracking-widest text-accent font-medium">{notice.category}</span>
                      <span className="text-[10px] text-gray-400">{notice.date}</span>
                    </div>
                    <h4 className="text-lg font-serif text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">{notice.title}</h4>
                    <p className="text-secondary text-sm font-light line-clamp-3 mb-4">{notice.content}</p>
                    <div className="flex items-center text-[10px] uppercase tracking-widest text-primary font-medium">
                      Leer más <i className="fa-solid fa-arrow-right ml-2 text-[8px]"></i>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {results.events.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-serif text-primary">Eventos y Calendario</h3>
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{results.events.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.events.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onEventClick(event.id!)}
                    className="flex bg-white border border-gray-100 overflow-hidden hover:border-accent transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="w-24 bg-gray-50 flex flex-col items-center justify-center border-r border-gray-100 p-4">
                      <span className="text-2xl font-serif text-primary leading-none">{event.day}</span>
                      <span className="text-[10px] uppercase tracking-widest text-accent mt-1">{event.month}</span>
                    </div>
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${
                          event.type === 'Webinar' ? 'bg-blue-400' : 
                          event.type === 'Presencial' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}></span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{event.type}</span>
                      </div>
                      <h4 className="text-lg font-serif text-primary mb-2 group-hover:text-accent transition-colors">{event.title}</h4>
                      <div className="flex items-center text-xs text-secondary font-light">
                        <i className="fa-regular fa-clock mr-2 opacity-60"></i> {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Associates */}
          {results.associates.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-serif text-primary">Directorio</h3>
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{results.associates.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.associates.map((associate) => (
                  <div 
                    key={associate.id}
                    className="bg-white border border-gray-100 p-6 text-center hover:border-accent transition-all shadow-sm group"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <img 
                        src={associate.image || `https://ui-avatars.com/api/?name=${associate.name}+${associate.last_name}&background=f8f9fa&color=1a1a1a`} 
                        alt={associate.name}
                        className="w-full h-full object-cover rounded-none grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 border border-black/5"></div>
                    </div>
                    <h4 className="text-base font-serif text-primary mb-1">{associate.name} {associate.last_name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-accent font-medium mb-4">{associate.position || 'Asociado'}</p>
                    <p className="text-xs text-secondary font-light mb-4 line-clamp-1">{associate.email}</p>
                    <button 
                      onClick={() => associate.id && onViewProfile(associate.id)}
                      className="text-[10px] uppercase tracking-widest text-primary font-semibold border-b border-primary/20 pb-1 hover:border-accent hover:text-accent transition-all"
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
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-serif text-primary">Documentación</h3>
                <div className="h-px flex-grow bg-gray-100"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{results.documents.length}</span>
              </div>
              <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Nombre</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold hidden md:table-cell">Tipo</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold hidden sm:table-cell">Tamaño</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <i className={`fa-solid ${
                              doc.type === 'pdf' ? 'fa-file-pdf text-red-400' : 
                              doc.type === 'doc' || doc.type === 'docx' ? 'fa-file-word text-blue-400' : 
                              doc.type === 'xls' || doc.type === 'xlsx' ? 'fa-file-excel text-emerald-400' : 'fa-file text-gray-400'
                            }`}></i>
                            <div>
                              <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{doc.name}</p>
                              <p className="text-[10px] text-gray-400 md:hidden">{doc.type.toUpperCase()} • {doc.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-secondary font-light hidden md:table-cell uppercase">{doc.type}</td>
                        <td className="px-6 py-4 text-xs text-secondary font-light hidden sm:table-cell">{doc.size}</td>
                        <td className="px-6 py-4 text-right">
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-gray-200 text-gray-400 hover:border-accent hover:text-accent transition-all"
                          >
                            <i className="fa-solid fa-download text-[10px]"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
