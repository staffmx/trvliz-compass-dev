import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Associate } from '../types';

const ITEMS_PER_PAGE = 10;

interface DirectoryProps {
    onViewProfile?: (id: number) => void;
}

const Directory: React.FC<DirectoryProps> = ({ onViewProfile }) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getAssociates();
        setAssociates(data || []);
      } catch (err: any) {
        console.error("Directory component catch:", err);
        setError(err.message || "Error al conectar con el servidor de datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic - Null safe search including last_name
  const filteredAssociates = (associates || []).filter(associate => {
    if (!associate) return false;
    const name = (associate.name || "").toLowerCase();
    const lastName = (associate.last_name || "").toLowerCase();
    const email = (associate.email || "").toLowerCase();
    const position = (associate.position || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || lastName.includes(search) || email.includes(search) || position.includes(search);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssociates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAssociates = filteredAssociates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      
      {/* Header & Search */}
      <div className="text-center mb-16">
          <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
            Nuestro Equipo
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-12">
            Directorio de Asociadas
          </h1>

          <div className="flex justify-center">
            <div className="relative w-full max-w-[600px]">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar asociada por nombre, cargo o email..."
                    className="w-full p-[18px] px-[25px] border border-black/10 rounded-none font-sans text-base bg-[#F5F1E8] focus:bg-white focus:border-accent focus:shadow-xl outline-none transition-all duration-300 placeholder-primary/40 text-primary"
                />
                <span className="absolute right-6 top-[22px] text-primary/30 pointer-events-none">
                    <i className="fa-solid fa-search"></i>
                </span>
            </div>
          </div>
          
          {associates.length > 0 && (
            <p className="text-[10px] text-secondary mt-4 uppercase tracking-widest font-bold">
              Mostrando {filteredAssociates.length} de {associates.length} asociadas encontradas
            </p>
          )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-16 p-8 bg-red-50 border border-red-200 text-center">
          <i className="fa-solid fa-triangle-exclamation text-red-600 text-3xl mb-4"></i>
          <h3 className="text-lg font-serif text-red-800 mb-2">Error de Conexión</h3>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Main Table Content */}
      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
              {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col bg-white border border-neutral animate-pulse">
                      <div className="w-full aspect-square bg-gray-200"></div>
                      <div className="p-5 flex-1 flex flex-col gap-3">
                          <div className="h-4 bg-gray-200 w-3/4 mx-auto"></div>
                          <div className="h-3 bg-gray-200 w-1/2 mx-auto mb-2"></div>
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                              <div className="h-8 bg-gray-200"></div>
                              <div className="h-8 bg-gray-200"></div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      ) : !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
                {currentAssociates.map((associate, idx) => (
                <div 
                    key={associate.id || `assoc-${idx}`} 
                    className="group flex flex-col bg-white border border-black/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                >
                    <div className="w-full aspect-square overflow-hidden bg-[#F5F1E8]">
                    <img 
                        src={associate.image || 'https://via.placeholder.com/400x400?text=No+Photo'} 
                        alt={`${associate.name} ${associate.last_name || ''}`} 
                        className="w-full h-full object-cover transition-all duration-[600ms] ease-out group-hover:scale-[1.05] grayscale group-hover:grayscale-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Photo' }}
                    />
                    </div>

                    <div className="p-5 text-center flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-serif text-lg font-medium mb-0.5 text-primary truncate">
                            {associate.name} {associate.last_name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-secondary mb-3 truncate">
                            {associate.position || 'Agente de Viajes'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <a 
                                href={`https://wa.me/${associate.whatsapp || ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] tracking-[1px] font-bold uppercase py-2 px-1 border border-primary text-primary hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                                <i className="fa-brands fa-whatsapp"></i> WA
                            </a>
                            <a 
                                href={`mailto:${associate.email}`}
                                className="text-[9px] tracking-[1px] font-bold uppercase py-2 px-1 border border-primary text-primary hover:bg-brand hover:border-brand hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                                <i className="fa-regular fa-envelope"></i> Email
                            </a>
                        </div>
                    </div>

                    <div>
                        <button 
                            onClick={() => associate.id && onViewProfile && onViewProfile(associate.id)}
                            className="text-[10px] tracking-[2px] uppercase font-bold text-accent inline-block relative group/btn"
                        >
                            Ver Perfil
                            <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-accent transition-all duration-300 group-hover/btn:w-full"></span>
                        </button>
                    </div>
                    </div>
                </div>
                ))}

                {filteredAssociates.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 text-secondary bg-surface border border-neutral">
                        <i className="fa-regular fa-face-frown text-4xl mb-4 opacity-50"></i>
                        <p className="font-serif italic text-lg">No se encontraron asociadas en el sistema.</p>
                        <p className="text-xs mt-2">Prueba con otros términos de búsqueda o verifica la conexión.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-brand font-bold uppercase tracking-widest text-[10px] border-b border-brand">Limpiar filtros</button>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button 
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center border border-neutral text-primary hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-none"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 flex items-center justify-center text-xs font-bold border transition-all duration-300 rounded-none ${
                                currentPage === page
                                    ? 'bg-brand border-brand text-white shadow-md'
                                    : 'bg-white border-neutral text-primary hover:bg-neutral'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center border border-neutral text-primary hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-none"
                    >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            )}
          </>
      )}

    </div>
  );
};

export default Directory;