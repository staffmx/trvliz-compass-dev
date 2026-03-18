import React from 'react';
import { Provider } from '../types';

interface ProviderDetailProps {
  provider: Provider;
  onBack: () => void;
}

const ProviderDetail: React.FC<ProviderDetailProps> = ({ provider, onBack }) => {
  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 group mb-12 text-secondary hover:text-brand transition-colors uppercase text-[10px] font-bold tracking-[2px]"
      >
        <i className="fa-solid fa-arrow-left-long group-hover:-translate-x-1 transition-transform"></i>
        Volver al Directorio
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Hero Section */}
          <div className="bg-surface border border-neutral p-10 md:p-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6">
                <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border ${provider.ddlEstatus === 'Activo' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
                    {provider.ddlEstatus}
                </div>
             </div>

              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-32 h-32 bg-white border border-neutral flex items-center justify-center p-4 flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-building text-5xl text-brand/20"></i>
                </div>
                <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(provider.proTipoProveMulti) ? provider.proTipoProveMulti : []).map(t => (
                            <span key={t} className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 border border-accent/10">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2 leading-tight">
                        {provider.proProveedor || 'Proveedor sin nombre'}
                    </h1>
                    <p className="text-secondary font-light max-w-xl">
                        Información administrativa registrada para {provider.proProveedor} dentro de la red Traveliz Compass.
                    </p>
                </div>
             </div>
          </div>

          {/* Detailed Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Services */}
            <div className="bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                <h3 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-concierge-bell text-brand text-sm"></i>
                    Servicios Ofrecidos
                </h3>
                <div className="flex flex-wrap gap-2">
                    {(() => {
                        const services = provider.provServicios;
                        const servicesArray = Array.isArray(services) ? services : [];
                        return (
                          <>
                            {servicesArray.map(service => (
                                <div key={service?.ID} className="flex items-center gap-2 bg-background border border-neutral px-3 py-2 text-sm text-secondary">
                                    <i className="fa-solid fa-check text-[10px] text-accent"></i>
                                    {service?.display_value}
                                </div>
                            ))}
                            {servicesArray.length === 0 && (
                                <p className="text-xs text-secondary italic">No hay servicios registrados.</p>
                            )}
                          </>
                        );
                    })()}
                </div>
            </div>

            {/* Platforms */}
            <div className="bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                <h3 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-laptop text-brand text-sm"></i>
                    Plataformas de Distribución
                </h3>
                <div className="space-y-3">
                    {(() => {
                        const platforms = provider.ddlPlataforma;
                        const platformsArray = Array.isArray(platforms) ? platforms : (platforms ? [String(platforms)] : []);
                        const validPlatforms = platformsArray.filter(p => p && p !== "");
                        
                        return (
                          <>
                            {validPlatforms.map(p => (
                                <div key={p} className="flex items-center gap-3 p-3 bg-background border border-neutral-light">
                                    <div className="w-8 h-8 rounded-full bg-brand/5 flex items-center justify-center text-brand">
                                        <i className="fa-solid fa-network-wired text-xs"></i>
                                    </div>
                                    <span className="text-sm font-medium text-primary">{p}</span>
                                </div>
                            ))}
                            {validPlatforms.length === 0 && (
                                <p className="text-xs text-secondary italic">No hay plataformas específicas registradas.</p>
                            )}
                          </>
                        );
                    })()}
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-primary text-white p-8">
                <h4 className="font-serif text-lg mb-6 border-b border-white/10 pb-4">Detalles del Registro</h4>
                <div className="space-y-6">
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">ID Único</span>
                        <span className="text-sm font-mono tracking-wider">{provider.ID}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Añadido por</span>
                        <span className="text-sm">{provider.Added_User || 'Sistema'}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Fecha de Registro</span>
                        <span className="text-sm">{provider.Added_Time || 'Desconocida'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface border border-neutral p-8">
                <h4 className="font-serif text-lg text-primary mb-6">¿Necesitas ayuda?</h4>
                <p className="text-xs text-secondary mb-6 leading-relaxed">
                    Si la información de este proveedor es incorrecta o necesitas actualizar sus datos, contacta al administrador del sistema.
                </p>
                <a href="mailto:soporte@traveliz.com" className="block w-full text-center py-3 bg-transparent border border-brand text-brand text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                    Contactar Soporte
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
