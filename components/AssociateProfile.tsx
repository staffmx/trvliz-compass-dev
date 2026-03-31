import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Associate } from '../types';

interface AssociateProfileProps {
  associateId: number;
  onBack: () => void;
}

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const BLANK_USER = 'https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/travel_advisors/blank-user.png';

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

  // Concatenate full name with Title Case
  const fullName = `${toTitleCase(associate.name)} ${toTitleCase(associate.last_name || '')}`;

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
                         src={associate.image || BLANK_USER} 
                         alt={fullName} 
                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                         onError={(e) => { (e.target as HTMLImageElement).src = BLANK_USER }}
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
                    {associate.linkedIn && (
                        <a href={associate.linkedIn} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    )}
                    {associate.facebook && (
                        <a href={associate.facebook} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    )}
                    {associate.tik_tok && (
                        <a href={associate.tik_tok} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent transition-all transform hover:-translate-y-1">
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                    )}
                    {(!associate.instagram && !associate.facebook && !associate.tik_tok && !associate.linkedIn) && (
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
                        {associate.tipo || 'Travel Consultant'}
                    </span>
                    <span className="text-secondary italic font-serif text-lg">
                        {associate.position || 'Agente Elite'}
                    </span>
                    {associate.Branch && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <i className="fa-solid fa-location-dot text-accent"></i>
                            {associate.Branch}
                        </span>
                    )}
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
                        <div 
                            className="associate-bio prose prose-slate max-w-none 
                                     [&_p]:mb-6 [&_strong]:text-primary [&_strong]:font-bold 
                                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
                                     [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6"
                            dangerouslySetInnerHTML={{ __html: associate.content }}
                        />
                    ) : (
                        <p className="italic text-secondary">Esta asociada aún no ha redactado su biografía profesional en la plataforma Compass.</p>
                    )}
                </div>
            </div>

            {/* Specialties Placeholder */}
            <div className="pt-10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6">Especialidades</h4>
                <div className="flex flex-wrap gap-3">
                    {(associate.especialidades?.split(',').map(s => s.trim()).filter(Boolean) || []).map((tag, i) => (
                        <span key={i} className="px-5 py-2 bg-background border border-neutral text-[10px] font-bold uppercase tracking-widest text-primary hover:border-accent hover:text-accent transition-all cursor-default">
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