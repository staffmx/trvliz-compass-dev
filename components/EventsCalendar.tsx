import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Event } from '../types';

interface EventsCalendarProps {
  onEventClick?: (eventId: number) => void;
}

interface EventsMap {
  [date: string]: Event[];
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error loading calendar events:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const eventsByDate = useMemo(() => {
    const map: EventsMap = {};
    events.forEach(event => {
      const dateKey = event.event_date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
    });
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!filterCategory) return events;
    return events.filter(e => e.type === filterCategory);
  }, [events, filterCategory]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const changeMonth = (diff: number) => {
    setCurrentDate(new Date(year, month + diff, 1));
  };

  const handleCategoryClick = (category: string) => {
    setFilterCategory(category);
    setViewMode('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCalendarCells = () => {
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    
    const cells = [];

    for (let i = firstDay; i > 0; i--) {
      cells.push(
        <div key={`prev-${i}`} className="min-h-[100px] md:min-h-[140px] p-2 md:p-[15px] border-r border-b border-black/5 relative bg-white opacity-20">
          <span className="font-bold text-xs block mb-2.5">{prevMonthDays - i + 1}</span>
        </div>
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = eventsByDate[dateStr];
      const today = new Date();
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;

      cells.push(
        <div 
            key={i} 
            className={`min-h-[100px] md:min-h-[140px] p-2 md:p-[15px] border-r border-b border-black/5 relative bg-white hover:bg-background transition-colors ${isToday ? 'ring-2 ring-inset ring-accent/30 bg-accent/5' : ''}`}
        >
          <span className={`font-bold text-sm block mb-2.5 ${isToday ? 'text-accent' : 'text-primary'}`}>{i}</span>
          
          {dayEvents && dayEvents.map((ev, idx) => (
            <button 
                key={ev.id || idx} 
                onClick={() => ev.id && onEventClick && onEventClick(ev.id)}
                className="w-full text-left block bg-brand text-white p-2 text-[9px] md:text-[10px] leading-tight mb-1.5 border-l-[3px] border-accent font-sans hover:translate-x-1 hover:bg-primary transition-all duration-200 overflow-hidden"
                title={ev.title}
            >
                <span className="hidden md:block font-bold text-[8px] text-accent uppercase mb-0.5">{ev.time}</span>
                <p className="truncate">{ev.title}</p>
            </button>
          ))}
        </div>
      );
    }

    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
        cells.push(
            <div key={`next-${i}`} className="min-h-[100px] md:min-h-[140px] p-2 md:p-[15px] border-r border-b border-black/5 relative bg-white opacity-20">
              <span className="font-bold text-xs block mb-2.5">{i}</span>
            </div>
        );
    }

    return cells;
  };

  if (viewMode === 'list') {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
        <div className="flex items-center justify-between mb-12">
            <button 
                onClick={() => setViewMode('calendar')} 
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-secondary hover:text-brand transition-colors"
            >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver al Calendario
            </button>
            <span className="text-accent text-[10px] font-bold uppercase tracking-[4px]">
                {filterCategory === 'Social' ? 'Eventos Sociales' : filterCategory === 'Corporativo' ? 'Corporativo' : 'Viajes'}
            </span>
        </div>

        <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-4">
                {filterCategory === 'Social' ? 'Eventos Sociales' : filterCategory === 'Corporativo' ? 'Corporativo' : 'Listado de Viajes'}
            </h1>
            <p className="text-secondary text-base font-light max-w-2xl leading-relaxed">
                Explora todos los eventos programados en esta categoría. Haz clic en cualquier sesión para ver detalles y registro.
            </p>
        </div>

        {loading ? (
            <div className="py-32 text-center">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand/20 mb-4"></i>
                <p className="text-secondary font-serif italic">Cargando eventos...</p>
            </div>
        ) : filteredEvents.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-neutral">
                <i className="fa-solid fa-calendar-xmark text-4xl text-neutral mb-4 opacity-20"></i>
                <h3 className="text-xl font-serif text-primary">No hay eventos programados</h3>
                <p className="text-secondary text-sm">Próximamente añadiremos nuevas fechas para esta categoría.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <div 
                        key={event.id} 
                        onClick={() => event.id && onEventClick && onEventClick(event.id)}
                        className="bg-white border border-neutral group hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col"
                    >
                        <div className="p-8 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-brand/5 px-3 py-1 border-l-2 border-accent">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand">{event.time}</span>
                                </div>
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                                    {new Date(event.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="font-serif text-2xl text-primary mb-4 group-hover:text-brand transition-colors leading-tight">
                                {event.title}
                            </h3>
                            <p className="text-sm text-secondary font-light leading-relaxed mb-8 line-clamp-3">
                                {event.description || "Sin descripción disponible para este evento."}
                            </p>
                            <div className="mt-auto pt-6 border-t border-neutral flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-[2px] text-brand group-hover:text-accent transition-colors">
                                    Ver Detalles <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                </span>
                                <i className={`fa-solid ${filterCategory === 'Social' ? 'fa-champagne-glasses' : filterCategory === 'Corporativo' ? 'fa-briefcase' : 'fa-plane-departure'} text-neutral/30`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
        <div className="text-center mb-12">
            <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
                Agenda Corporativa
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
                Calendario de Eventos
            </h1>
        </div>

        <div className="max-w-[1100px] mx-auto bg-white border border-black/10 shadow-sm relative">
            {loading && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <i className="fa-solid fa-circle-notch fa-spin text-brand text-3xl"></i>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-10 bg-primary text-white gap-6">
                <h2 className="font-serif text-3xl md:text-5xl font-light">
                    {monthNames[month]} <span className="text-accent italic">{year}</span>
                </h2>
                <div className="flex gap-4">
                    <button 
                        onClick={() => changeMonth(-1)}
                        className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:border-accent hover:text-accent transition-all duration-300"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-6 py-2.5 font-bold text-[10px] tracking-[2px] uppercase border border-white/20 hover:border-accent hover:text-accent transition-all"
                    >
                        Hoy
                    </button>
                    <button 
                        onClick={() => changeMonth(1)}
                        className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:border-accent hover:text-accent transition-all duration-300"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 bg-white">
                {daysOfWeek.map(day => (
                    <div key={day} className="p-4 bg-[#F5F1E8] border-b border-black/10 font-bold text-[10px] uppercase tracking-widest text-center text-brand">
                        {day}
                    </div>
                ))}
                {renderCalendarCells()}
            </div>
        </div>

        <div className="max-w-[1100px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
                onClick={() => handleCategoryClick('Social')}
                className="bg-surface p-10 border border-neutral shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div className="w-12 h-12 bg-brand/5 flex items-center justify-center text-brand mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                    <i className="fa-solid fa-champagne-glasses text-xl"></i>
                </div>
                <h3 className="font-serif text-xl mb-3 text-primary group-hover:text-brand transition-colors">Eventos Sociales</h3>
                <p className="text-xs text-secondary leading-luxury font-light">Conecta con tus colegas en un ambiente relajado y exclusivo diseñado para fortalecer lazos.</p>
            </div>
            <div 
                onClick={() => handleCategoryClick('Corporativo')}
                className="bg-surface p-10 border border-neutral shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div className="w-12 h-12 bg-brand/5 flex items-center justify-center text-brand mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                    <i className="fa-solid fa-briefcase text-xl"></i>
                </div>
                <h3 className="font-serif text-xl mb-3 text-primary group-hover:text-brand transition-colors">Corporativo</h3>
                <p className="text-xs text-secondary leading-luxury font-light">Juntas de resultados, planeación estratégica y sesiones informativas clave para el negocio.</p>
            </div>
            <div 
                onClick={() => handleCategoryClick('Viaje')}
                className="bg-surface p-10 border border-neutral shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div className="w-12 h-12 bg-brand/5 flex items-center justify-center text-brand mb-6 group-hover:bg-brand group-hover:text-white transition-colors">
                    <i className="fa-solid fa-plane-departure text-xl"></i>
                </div>
                <h3 className="font-serif text-xl mb-3 text-primary group-hover:text-brand transition-colors">Viajes</h3>
                <p className="text-xs text-secondary leading-luxury font-light">Fam trips y visitas a propiedades destacadas para que conozcas de primera mano el producto.</p>
            </div>
        </div>
    </div>
  );
};

export default EventsCalendar;