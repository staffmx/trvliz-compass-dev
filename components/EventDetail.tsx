import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Event } from '../types';

interface EventDetailProps {
  eventId: number;
  user: User;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ eventId, user, onBack }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const [eventData, registrationStatus] = await Promise.all([
          api.getEventById(eventId),
          api.checkEventRegistration(eventId, user.email)
        ]);
        setEvent(eventData);
        setIsRegistered(registrationStatus);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId, user.email]);

  const handleConfirm = async () => {
    if (isRegistered || registering) return;

    setRegistering(true);
    try {
      const success = await api.registerForEvent(eventId, user.email);
      if (success) {
        setIsRegistered(true);
      } else {
        alert("Hubo un problema al registrar tu asistencia. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      console.error("Confirmation error:", error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y flex flex-col items-center justify-center animate-fade-in">
        <i className="fa-solid fa-circle-notch fa-spin text-brand text-4xl mb-6"></i>
        <p className="text-secondary font-serif italic">Cargando detalles del evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y text-center animate-fade-in">
        <i className="fa-solid fa-calendar-xmark text-5xl text-neutral mb-6"></i>
        <h2 className="text-3xl font-serif text-primary mb-4">Evento no encontrado</h2>
        <button onClick={onBack} className="text-brand font-bold uppercase tracking-widest text-xs hover:text-accent transition-colors">
          Volver al Calendario
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-primary py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand rounded-full -ml-48 -mb-48 blur-3xl"></div>
        </div>

        <div className="max-w-site mx-auto px-mobile-x relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-[3px] mb-12"
          >
            <i className="fa-solid fa-arrow-left"></i> Volver al Calendario
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-brand border border-accent/30 text-white flex flex-col items-center justify-center shadow-2xl shrink-0">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80">{event.month}</span>
              <span className="text-4xl md:text-6xl font-serif font-medium">{event.day}</span>
            </div>

            <div className="flex-1">
              <span className={`inline-block px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-[2px] border mb-6 ${event.type === 'Webinar' ? 'bg-purple-900/40 text-purple-200 border-purple-500/30' :
                  event.type === 'Viaje' ? 'bg-emerald-900/40 text-emerald-200 border-emerald-500/30' :
                    'bg-white/5 text-accent border-accent/20'
                }`}>
                {event.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-white font-medium leading-tight max-w-4xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-site mx-auto px-mobile-x py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-serif text-primary mb-6 pb-4 border-b border-neutral flex items-center gap-3">
                <i className="fa-solid fa-circle-info text-brand text-sm"></i> Acerca del Evento
              </h2>
              <div className="text-lg text-primary leading-luxury font-light space-y-6">
                {event.description ? (
                  <p>{event.description}</p>
                ) : (
                  <p>Únete a nosotros para este exclusivo evento de {event.type.toLowerCase()}. Esta sesión ha sido diseñada específicamente para los agentes de Traveliz con el objetivo de profundizar en el conocimiento de marca y las mejores prácticas del sector de lujo.</p>
                )}
                <p>Durante este encuentro, exploraremos oportunidades clave, compartiremos actualizaciones estratégicas y fomentaremos la conexión entre los miembros de nuestro equipo elite.</p>
              </div>
            </div>

            <div className="bg-surface border border-neutral p-10 shadow-sm">
              <h3 className="text-xl font-serif mb-8 text-brand flex items-center gap-3">
                <i className="fa-solid fa-location-dot"></i> Detalles Logísticos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">Horario Central</span>
                  <p className="text-lg font-serif text-primary italic">{event.time} hrs</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">Ubicación / Modalidad</span>
                  <p className="text-lg font-serif text-primary italic">{event.type === 'Webinar' ? 'Sesión Virtual (Zoom)' : (event.link || 'Oficinas Corporativas Traveliz')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-brand p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-2xl mb-6">Confirmar Asistencia</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-10">Es indispensable confirmar tu participación para asegurar tu lugar y recibir el material complementario.</p>

                {event.link ? (
                  <a
                    href={event.link}
                    target="_blank"
                    className="block w-full py-4 bg-accent text-white font-bold uppercase tracking-widest text-center text-[11px] hover:bg-white hover:text-brand transition-all shadow-xl"
                  >
                    {event.type === 'Webinar' ? 'Entrar al Webinar' : 'Ver Detalles de Acceso'}
                  </a>
                ) : (
                  <button
                    disabled={isRegistered || registering}
                    onClick={handleConfirm}
                    className={`w-full py-4 font-bold uppercase tracking-widest text-[11px] transition-all shadow-xl flex items-center justify-center gap-2 ${isRegistered
                        ? 'bg-white text-accent border border-accent cursor-default'
                        : 'bg-accent text-white hover:bg-white hover:text-brand'
                      }`}
                  >
                    {registering ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        Procesando...
                      </>
                    ) : isRegistered ? (
                      <>
                        <i className="fa-solid fa-check-circle"></i>
                        Asistencia Confirmada
                      </>
                    ) : (
                      'Confirmar vía Compass'
                    )}
                  </button>
                )}


              </div>
            </div>

            <div className="bg-surface border border-neutral p-10">
              <h4 className="font-serif text-lg mb-6 border-b border-neutral pb-4">¿Preguntas?</h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-background flex items-center justify-center text-secondary rounded-full">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Soporte Concierge</p>
                  <p className="text-[10px] text-secondary">asistencia@traveliz.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;