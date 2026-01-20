import React, { useState, useEffect } from 'react';
import { api, Associate } from '../services/api';

interface AssociateProfileProps {
  associateId: number;
  onBack: () => void;
}

const AssociateProfile: React.FC<AssociateProfileProps> = ({ associateId, onBack }) => {
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssociate = async () => {
      setLoading(true);
      try {
        const data = await api.getAssociateById(associateId);
        setAssociate(data);
      } catch (error) {
        console.error("Error fetching associate details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssociate();
  }, [associateId]);

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y flex flex-col items-center justify-center animate-fade-in">
        <i className="fa-solid fa-circle-notch fa-spin text-brand text-4xl mb-6"></i>
        <p className="text-secondary font-serif italic">Preparando perfil de asociada...</p>
      </div>
    );
  }

  if (!associate) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y text-center animate-fade-in">
        <i className="fa-solid fa-user-slash text-5xl text-neutral mb-6"></i>
        <h2 className="text-3xl font-serif text-primary mb-4">Perfil no encontrado</h2>
        <button onClick={onBack} className="text-brand font-bold uppercase tracking-widest text-xs hover:text-accent transition-colors">
          Volver al Directorio
        </button>
      </div>
    );
  }

  // Concatenate full name
  const fullName = `${associate.name} ${associate.last_name || ''}`;

  return (
    <div className="animate-fade-in">
      <div className="max-w-site mx-auto px-mobile-x pt-12 pb-section-y">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-brand transition-colors text-[10px] font-bold uppercase tracking-[3px] mb-12"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver al Directorio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Column 1: Image & Socials (4 Cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="relative group">
               <div className="absolute -inset-4 border border-accent/20 -z-10 group-hover:inset-0 transition-all duration-500"></div>
               <div className="w-full aspect-[4/5] overflow-hidden bg-neutral shadow-2xl">
                    <img 
                        src={associate.image || 'https://via.placeholder.com/800x1000?text=Profile+Image'} 
                        alt={fullName} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1000?text=No+Photo' }}
                    />
               </div>
            </div>

            {/* Social Media Block */}
            <div className="bg-white border border-neutral p-8 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-6 text-center">Social Connect</span>
                <div className="flex justify-center gap-8">
                    {associate.instagram && (
                        <a href={associate.instagram} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                    )}
                    {associate.facebook && (
                        <a href={associate.facebook} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    )}
                    {associate.tiktok && (
                        <a href={associate.tiktok} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                    )}
                    {(!associate.instagram && !associate.facebook && !associate.tiktok) && (
                        <p className="text-[10px] italic text-secondary uppercase tracking-widest">No hay redes vinculadas</p>
                    )}
                </div>
            </div>
          </div>

          {/* Column 2: Information & Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Header Block */}
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-accent"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[4px] text-accent">Perfil de Asociada</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-primary font-medium leading-tight mb-4">
                    {fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-brand text-white px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-lg">
                        {associate.associate_type || 'Travel Consultant'}
                    </span>
                    <span className="text-secondary italic font-serif text-lg">
                        {associate.position || 'Agente Elite'}
                    </span>
                </div>
            </div>

            {/* Quick Contact Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-t border-b border-neutral">
                <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary block">Email Corporativo</span>
                    <a href={`mailto:${associate.email}`} className="text-lg text-primary hover:text-accent transition-colors font-sans">
                        {associate.email}
                    </a>
                </div>
                <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary block">WhatsApp Directo</span>
                    <a href={`https://wa.me/${associate.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-lg text-primary hover:text-accent transition-colors font-sans flex items-center gap-2">
                        <i className="fa-brands fa-whatsapp text-green-600"></i> {associate.whatsapp || 'No disponible'}
                    </a>
                </div>
            </div>

            {/* Biography Content */}
            <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-serif text-primary mb-8 flex items-center gap-3">
                    <i className="fa-solid fa-quote-left text-accent text-sm"></i> Mi Trayectoria
                </h3>
                <div className="text-xl text-primary leading-luxury font-light space-y-6">
                    {associate.content ? (
                        <div className="associate-bio">
                            <p className="first-letter:text-6xl first-letter:font-serif first-letter:text-brand first-letter:float-left first-letter:mr-4 first-letter:mt-1">
                                {associate.content}
                            </p>
                        </div>
                    ) : (
                        <p className="italic text-secondary">Esta asociada aún no ha redactado su biografía profesional en la plataforma Compass.</p>
                    )}
                </div>
            </div>

            {/* Specialties Placeholder */}
            <div className="pt-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6">Especialidades</h4>
                <div className="flex flex-wrap gap-3">
                    {['Viajes de Lujo', 'Cruceros', 'Exótico', 'Corporativo'].map(tag => (
                        <span key={tag} className="px-5 py-2 bg-background border border-neutral text-[10px] font-bold uppercase tracking-widest text-primary hover:border-accent hover:text-accent transition-all cursor-default">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateProfile;