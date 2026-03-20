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
                <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border ${provider.estatus === 'Activo' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
                    {provider.estatus}
                </div>
             </div>

              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-32 h-32 bg-white border border-neutral flex items-center justify-center p-4 flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-building text-5xl text-brand/20"></i>
                </div>
                <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(provider.tipoProveedor) ? provider.tipoProveedor : []).map(t => (
                            <span key={t} className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 border border-accent/10">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2 leading-tight">
                        {provider.nombre || 'Proveedor sin nombre'}
                    </h1>
                    <p className="text-secondary font-light max-w-xl">
                        Información administrativa registrada para {provider.nombre} dentro de la red Traveliz Compass.
                        {provider.descripcion && <span className="block mt-2 italic text-sm">{provider.descripcion}</span>}
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
                        const services = provider.servicios;
                        const servicesArray = Array.isArray(services) ? services : [];
                        return (
                          <>
                            {servicesArray.map((service, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-background border border-neutral px-3 py-2 text-sm text-secondary">
                                    <i className="fa-solid fa-check text-[10px] text-accent"></i>
                                    {service}
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
                        const platforms = provider.plataforma;
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
            
            {/* Comisiones */}
            <div className="col-span-1 md:col-span-2 bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                 <h3 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-percent text-brand text-sm"></i>
                    Estructura de Comisiones
                </h3>
                {provider.comisiones && provider.comisiones.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-neutral text-secondary uppercase tracking-wider text-[10px]">
                                    <th className="py-3 pr-4 font-bold">Clasificación</th>
                                    <th className="py-3 px-4 font-bold">Servicio / Cabina</th>
                                    <th className="py-3 px-4 font-bold">Región / País</th>
                                    <th className="py-3 px-4 font-bold text-right">%</th>
                                    <th className="py-3 pl-4 font-bold text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-light text-primary">
                                {provider.comisiones.map((comision, idx) => (
                                    <tr key={idx} className="hover:bg-neutral/10 transition-colors">
                                        <td className="py-3 pr-4 font-medium">{comision.Clasifica} <span className="text-[10px] text-secondary ml-1">({comision.Plataforma})</span></td>
                                        <td className="py-3 px-4">{comision.Servicio} / {comision.Cabina || '-'}</td>
                                        <td className="py-3 px-4">{comision.Continente} / {comision.Pais || comision.Region || '-'}</td>
                                        <td className="py-3 px-4 text-right font-bold text-accent">{comision.Porcentaje}%</td>
                                        <td className="py-3 pl-4 text-right font-bold text-brand">{comision.Monto} {comision.Moneda}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xs text-secondary italic">No hay comisiones registradas para este proveedor.</p>
                )}
            </div>

            {/* Ubicaciones */}
            <div className="bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                <h3 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-map-location-dot text-brand text-sm"></i>
                    Ubicaciones
                </h3>
                {provider.ubicaciones && provider.ubicaciones.length > 0 ? (
                     <div className="space-y-4">
                        {provider.ubicaciones.map((ubi, idx) => (
                            <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-neutral last:border-0 last:pb-0">
                                <span className="font-bold text-primary">{ubi.Ciudad}, {ubi.Pais}</span>
                                <span className="text-xs text-secondary">{ubi.Continente} • {ubi.Categoria}</span>
                                {ubi.Serendipians === 'SI' && (
                                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1">Serendipians Partner</span>
                                )}
                            </div>
                        ))}
                     </div>
                ) : (
                    <p className="text-xs text-secondary italic">No hay ubicaciones registradas.</p>
                )}
            </div>

            {/* Contactos */}
            <div className="bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                <h3 className="font-serif text-xl text-primary mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-users text-brand text-sm"></i>
                    Directorio de Contactos
                </h3>
                {provider.contactos && provider.contactos.length > 0 ? (
                     <div className="space-y-4">
                        {provider.contactos.map((contacto, idx) => (
                            <div key={idx} className="flex flex-col gap-2 pb-4 border-b border-neutral last:border-0 last:pb-0">
                                <span className="font-bold text-primary">{contacto.Nombre}</span>
                                {contacto.Correo && (
                                     <a href={`mailto:${contacto.Correo}`} className="text-sm text-secondary hover:text-brand flex items-center gap-2">
                                         <i className="fa-solid fa-envelope text-xs"></i> {contacto.Correo}
                                     </a>
                                )}
                                {contacto.CorreoSec && (
                                     <a href={`mailto:${contacto.CorreoSec}`} className="text-sm text-secondary hover:text-brand flex items-center gap-2">
                                         <i className="fa-regular fa-envelope text-xs"></i> {contacto.CorreoSec}
                                     </a>
                                )}
                                {contacto.Telefono && (
                                    <div className="text-sm text-secondary flex items-center gap-2">
                                        <i className="fa-solid fa-phone text-xs"></i> {contacto.Telefono}
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                ) : (
                    <p className="text-xs text-secondary italic">No hay contactos adicionales registrados.</p>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-primary text-white p-8">
                <h4 className="font-serif text-lg mb-6 border-b border-white/10 pb-4">Contacto Principal</h4>
                <div className="space-y-6">
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">General</span>
                        <span className="text-sm">{provider.contactoGeneral || 'No registrado'}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Correo</span>
                        {provider.correo ? (
                          <a href={`mailto:${provider.correo}`} className="text-sm text-brand hover:underline">{provider.correo}</a>
                        ) : (
                          <span className="text-sm text-white/70">No registrado</span>
                        )}
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Teléfono</span>
                        <span className="text-sm">{provider.telefono || 'No registrado'}</span>
                    </div>
                    {provider.paginaWeb && (
                      <div>
                          <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Sitio Web</span>
                          <a href={provider.paginaWeb.startsWith('http') ? provider.paginaWeb : `https://${provider.paginaWeb}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline break-all">
                              {provider.paginaWeb}
                          </a>
                      </div>
                    )}
                </div>
            </div>

            <div className="bg-surface border border-neutral p-8 hover:border-brand/30 transition-colors">
                <h4 className="font-serif text-lg text-primary mb-6 border-b border-neutral pb-4">Detalles Operativos</h4>
                <div className="space-y-6">
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-secondary mb-1">ID Único</span>
                        <span className="text-sm font-mono tracking-wider text-primary">{provider.id}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-secondary mb-1">Forma de Pago</span>
                        <span className="text-sm text-primary">{provider.formaPago || 'No registrada'}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-secondary mb-1">¿Cómo Cotizar?</span>
                        <span className="text-sm text-primary">{provider.comoCotizo || 'No registrado'}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] uppercase tracking-widest text-secondary mb-1">Ingreso de Comisión</span>
                        <span className="text-sm text-primary">{provider.tipoIngreso || 'No registrado'}</span>
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
