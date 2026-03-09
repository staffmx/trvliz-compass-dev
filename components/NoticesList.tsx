
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notice, NavigationItem, Event, User, Associate } from '../types';

interface NoticesListProps {
  user: User;
  onNavigate?: (nav: NavigationItem) => void;
  onEventClick?: (eventId: number) => void;
}

const NoticesList: React.FC<NoticesListProps> = ({ user, onNavigate, onEventClick }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [noticesData, eventsData, myAssociateData] = await Promise.all([
          api.getNotices(),
          api.getEvents(),
          api.getAssociateByUserId(user.id)
        ]);

        const filteredNotices = noticesData.filter((notice: Notice) => {
          if (!notice.recipient_ids || notice.recipient_ids.trim() === '') return true;
          if (!myAssociateData) return false;
          const ids = notice.recipient_ids.split(',').map(id => id.trim());
          return ids.includes(myAssociateData.id?.toString() || '');
        });

        setNotices(filteredNotices);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error al cargar datos en Avisos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">Comunicaciones Internas</span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">Avisos e Información</h1>
        <p className="text-secondary text-sm mt-4 font-light italic">Mantente al día con las últimas actualizaciones de Traveliz.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Lado Izquierdo: Lista de Avisos (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-white border border-neutral animate-pulse"></div>
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-neutral">
              <i className="fa-solid fa-box-open text-neutral text-4xl mb-4"></i>
              <p className="text-secondary font-serif">No hay avisos publicados en este momento.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`bg-white border transition-all duration-300 ${
                  expandedId === notice.id ? 'border-accent shadow-lg' : 'border-neutral hover:border-brand/30'
                }`}
              >
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleAccordion(notice.id)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6 overflow-hidden">
                    <div className="hidden md:block text-center min-w-[80px] border-r border-neutral pr-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{notice.date.split(' de ')[2] || '2026'}</p>
                      <p className="text-sm font-serif font-bold text-brand">{notice.date.split(' de ')[0]} {notice.date.split(' de ')[1]?.substring(0,3)}</p>
                    </div>
                    
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          notice.priority === 'high' ? 'bg-red-500 animate-pulse' : 
                          notice.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                        }`}></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{notice.category}</span>
                      </div>
                      <h3 className={`text-lg md:text-xl font-serif font-medium transition-colors ${
                        expandedId === notice.id ? 'text-brand' : 'text-primary group-hover:text-brand'
                      }`}>
                        {notice.title}
                      </h3>
                    </div>
                  </div>

                  <div className={`ml-4 w-8 h-8 rounded-full border border-neutral flex items-center justify-center transition-transform duration-300 ${
                    expandedId === notice.id ? 'rotate-180 bg-brand border-brand text-white' : 'text-secondary group-hover:border-brand group-hover:text-brand'
                  }`}>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </button>

                {/* Accordion Content */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedId === notice.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 md:px-20 pb-10 pt-2 border-t border-neutral/50">
                    <div className="prose prose-sm max-w-none text-primary leading-luxury font-light">
                      {notice.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                    
                    {notice.priority === 'high' && (
                      <div className="mt-8 p-4 bg-red-50 border border-red-100 flex items-start gap-3">
                        <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-800">Prioridad Alta: Confirma recepción con tu equipo.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lado Derecho: Sidebar de Eventos (3 Cols) */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-surface p-8 border border-neutral shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
              <h2 className="text-xl font-serif text-primary">Próximos Eventos</h2>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="bg-gray-200 w-12 h-12"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 w-3/4"></div>
                      <div className="h-2 bg-gray-200 w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-secondary italic">Sin eventos programados.</p>
                </div>
              ) : (
                events.slice(0, 6).map(event => (
                  <button 
                    key={event.id} 
                    onClick={() => event.id && onEventClick && onEventClick(event.id)}
                    className="w-full flex gap-4 items-center group cursor-pointer text-left hover:bg-background/50 p-2 -mx-2 transition-all"
                  >
                    <div className="bg-brand text-white w-12 h-12 flex flex-col items-center justify-center text-[9px] group-hover:bg-accent transition-colors shrink-0 shadow-sm">
                      <span className="opacity-80 font-bold">{event.month}</span>
                      <span className="font-serif text-base">{event.day}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary truncate group-hover:text-brand transition-colors leading-tight">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-brand uppercase font-bold tracking-tighter">{event.type}</span>
                        <span className="text-[9px] text-secondary">{event.time}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-neutral">
              <button 
                onClick={() => onNavigate && onNavigate(NavigationItem.CALENDARIO)}
                className="w-full text-center py-3 border border-brand text-brand hover:bg-brand hover:text-white text-[10px] font-bold uppercase tracking-[2px] transition-all"
              >
                Ver Todos los Eventos
              </button>
            </div>
          </div>
          
          {/* Tarjeta de Soporte Rápido en Sidebar */}
          <div className="bg-primary p-8 text-white">
            <h4 className="font-serif text-lg mb-4 text-accent">¿Necesitas ayuda?</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Si tienes dudas sobre un aviso o evento, contacta a Soporte Concierge.</p>
            <a href="mailto:soporte@traveliz.com" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white hover:text-accent transition-colors">
              <i className="fa-solid fa-envelope"></i> soporte@traveliz.com
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NoticesList;
