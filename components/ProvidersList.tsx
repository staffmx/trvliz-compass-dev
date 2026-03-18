import React, { useState, useEffect } from 'react';
import { Provider } from '../types';
import { providersService } from '../services/providers';

interface ProvidersListProps {
  onSelectProvider: (provider: Provider) => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ onSelectProvider }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedProviderTypes, setSelectedProviderTypes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        const response = await providersService.fetchProviders();
        if (response && Array.isArray(response.data)) {
          setProviders(response.data);
        } else {
          setError('El formato de los datos es inválido.');
        }
      } catch (err) {
        setError('Error al cargar proveedores.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 opacity-100 transition-opacity">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-secondary font-light tracking-widest uppercase text-[10px]">Cargando proveedores...</p>
      </div>
    );
  }

  if (error || !Array.isArray(providers)) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
        </div>
        <h3 className="text-xl font-serif text-primary mb-2">Error</h3>
        <p className="text-secondary mb-6">{error || 'Error al procesar los datos.'}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors">Reintentar</button>
      </div>
    );
  }

  // Safe Data Extractions
    const allServiceTypes: string[] = Array.from(new Set(providers.flatMap(p => {
      const services = p.provServicios;
      return Array.isArray(services) ? services.map(s => s?.display_value) : [];
    }))).filter(t => t).sort() as string[];

    const allProviderTypes: string[] = Array.from(new Set(providers.flatMap(p => {
      const types = p.proTipoProveMulti;
      return Array.isArray(types) ? types : [];
    }))).filter(t => t).sort() as string[];

    const allPlatforms: string[] = Array.from(new Set(providers.flatMap(p => {
      const platforms = p.ddlPlataforma;
      if (Array.isArray(platforms)) return platforms;
      return platforms ? [String(platforms)] : [];
    }))).map(plat => String(plat)).filter(p => p && p !== "null" && p !== "undefined").sort() as string[];

    const filteredProviders = providers.filter(p => {
      const nameMatch = (p.proProveedor || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const services = p.provServicios;
      const serviceMatch = selectedServiceTypes.length === 0 || 
        (Array.isArray(services) && services.some(s => s && selectedServiceTypes.includes(s.display_value)));
      
      const pTypes = p.proTipoProveMulti;
      const typeMatch = selectedProviderTypes.length === 0 || 
        (Array.isArray(pTypes) && pTypes.some(t => selectedProviderTypes.includes(t)));
      
      const rawPlatforms = p.ddlPlataforma;
      const platforms = Array.isArray(rawPlatforms) ? rawPlatforms : (rawPlatforms ? [rawPlatforms] : []);
      const platformMatch = selectedPlatforms.length === 0 || platforms.some(plat => plat && selectedPlatforms.includes(String(plat)));

      return nameMatch && serviceMatch && typeMatch && platformMatch;
    });

    const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
      if (list.includes(item)) {
        setList(list.filter(i => i !== item));
      } else {
        setList([...list, item]);
      }
    };

    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y">
        <div className="text-center mb-16 border-b border-neutral pb-12">
          <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">Socios Comerciales</span>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">Directorio de Proveedores</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[30%] bg-surface border border-neutral p-8 shadow-sm lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl text-primary">Filtros</h3>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedServiceTypes([]); setSelectedProviderTypes([]); setSelectedPlatforms([]); }}
                className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent underline"
              >
                Limpiar
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Nombre del Proveedor</label>
                <div className="relative">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="w-full p-3 pl-10 bg-background border border-neutral text-sm focus:border-accent outline-none" />
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Tipo de Proveedor</label>
                <div className="space-y-2">
                  {allProviderTypes.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedProviderTypes.includes(type) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                        {selectedProviderTypes.includes(type) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                      </div>
                      <input type="checkbox" className="hidden" onChange={() => toggleFilter(selectedProviderTypes, setSelectedProviderTypes, type)} />
                      <span className={`text-xs ${selectedProviderTypes.includes(type) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Servicios</label>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                  {allServiceTypes.map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedServiceTypes.includes(type) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                        {selectedServiceTypes.includes(type) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                      </div>
                      <input type="checkbox" className="hidden" onChange={() => toggleFilter(selectedServiceTypes, setSelectedServiceTypes, type)} />
                      <span className={`text-xs ${selectedServiceTypes.includes(type) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Plataformas</label>
                <div className="space-y-2">
                  {allPlatforms.map(plat => (
                    <label key={plat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedPlatforms.includes(plat) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                        {selectedPlatforms.includes(plat) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                      </div>
                      <input type="checkbox" className="hidden" onChange={() => toggleFilter(selectedPlatforms, setSelectedPlatforms, plat)} />
                      <span className={`text-xs ${selectedPlatforms.includes(plat) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{plat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="w-full lg:w-[70%]">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">{filteredProviders.length} Proveedores Encontrados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map(provider => (
                <div key={provider.ID} onClick={() => onSelectProvider(provider)} className="bg-surface border border-neutral hover:shadow-xl hover:border-accent/30 transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-background bg-white/50 group-hover:bg-white transition-colors">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(Array.isArray(provider.proTipoProveMulti) ? provider.proTipoProveMulti : []).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-brand/20 bg-brand/5 text-brand">{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-serif text-2xl text-primary group-hover:text-brand transition-colors mb-2">{provider.proProveedor || 'Sin nombre'}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${provider.ddlEstatus === 'Activo' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-[10px] text-secondary uppercase tracking-widest">{provider.ddlEstatus || 'Estatus desconocido'}</span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Servicios</p>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                           const services = provider.provServicios;
                           const servicesArray = Array.isArray(services) ? services : [];
                           return (
                             <>
                               {servicesArray.slice(0, 4).map(s => (
                                 <span key={s?.ID} className="text-[10px] text-secondary bg-neutral/30 px-2 py-1">{s?.display_value}</span>
                               ))}
                               {servicesArray.length > 4 && (
                                 <span className="text-[10px] text-brand font-bold py-1">+{servicesArray.length - 4} más</span>
                               )}
                             </>
                           );
                        })()}
                      </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-neutral flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand group-hover:text-accent transition-colors">Ver Información Completa</span>
                      <i className="fa-solid fa-arrow-right-long text-brand group-hover:translate-x-2 transition-transform"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="py-32 text-center border border-dashed border-neutral bg-background/50">
                <i className="fa-regular fa-folder-open text-5xl mb-6 opacity-20"></i>
                <p className="font-serif italic text-xl text-primary mb-2">No se encontraron proveedores</p>
                <p className="text-secondary text-sm">Intenta ajustar los filtros o la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default ProvidersList;
