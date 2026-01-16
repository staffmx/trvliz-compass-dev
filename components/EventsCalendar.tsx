import React, { useState } from 'react';

interface CalendarEvent {
  title: string;
  time: string;
  link: string;
  type?: 'Social' | 'Corporativo' | 'Viaje';
}

interface EventsMap {
  [date: string]: CalendarEvent[];
}

// Mock data for General Events (cloned structure, different content example)
const eventsData: EventsMap = {
    "2026-01-05": [{ title: "Brindis de Año Nuevo", time: "06:00 PM", link: "#", type: 'Social' }],
    "2026-01-10": [{ title: "Junta Anual de Resultados", time: "09:00 AM", link: "#", type: 'Corporativo' }],
    "2026-01-14": [{ title: "Visita de Inspección: Hotel Four Seasons", time: "11:00 AM", link: "#", type: 'Viaje' }],
    "2026-01-20": [{ title: "Networking con Proveedores Locales", time: "07:30 PM", link: "#", type: 'Social' }],
    "2026-01-24": [{ title: "Lanzamiento Campaña Verano 2026", time: "10:00 AM", link: "#", type: 'Corporativo' }],
    "2026-01-28": [{ title: "Cocktail de Bienvenida: Nuevos Socios", time: "08:00 PM", link: "#", type: 'Social' }]
};

const EventsCalendar: React.FC = () => {
  // Start in January 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const changeMonth = (diff: number) => {
    setCurrentDate(new Date(year, month + diff, 1));
  };

  const renderCalendarCells = () => {
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    
    const cells = [];

    // Padding days from previous month
    for (let i = firstDay; i > 0; i--) {
      cells.push(
        <div key={`prev-${i}`} className="min-h-[100px] md:min-h-[140px] p-2 md:p-[15px] border-r border-b border-black/5 relative bg-white opacity-30">
          <span className="font-bold text-sm block mb-2.5">{prevMonthDays - i + 1}</span>
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasEvents = eventsData[dateStr];
      const isToday = false; 

      cells.push(
        <div 
            key={i} 
            className={`min-h-[100px] md:min-h-[140px] p-2 md:p-[15px] border-r border-b border-black/5 relative bg-white hover:bg-background transition-colors ${isToday ? 'bg-[#F5F1E8]/50' : ''}`}
        >
          <span className="font-bold text-sm block mb-2.5 text-primary">{i}</span>
          
          {hasEvents && hasEvents.map((ev, idx) => (
            <a 
                key={idx} 
                href={ev.link}
                className="block bg-brand text-white p-2 text-[9px] md:text-[11px] leading-tight mb-1.5 border-l-[3px] border-accent font-sans hover:translate-x-1 hover:bg-primary transition-all duration-200"
            >
                <span className="hidden md:block font-bold text-[9px] text-accent uppercase mb-0.5">{ev.time}</span>
                {ev.title}
            </a>
          ))}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
        
        {/* Page Header */}
        <div className="text-center mb-12">
            <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
                Agenda Corporativa
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
                Calendario de Eventos
            </h1>
        </div>

        {/* Calendar Module - Traveliz Core Style */}
        <div className="max-w-[1100px] mx-auto bg-white border border-black/10 shadow-sm">
            
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-10 bg-primary text-white gap-6">
                <h2 className="font-serif text-3xl md:text-5xl font-light">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex gap-5">
                    <button 
                        onClick={() => changeMonth(-1)}
                        className="bg-transparent border border-accent text-accent px-5 py-2.5 font-bold text-[10px] tracking-[2px] uppercase cursor-pointer hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Anterior
                    </button>
                    <button 
                        onClick={() => changeMonth(1)}
                        className="bg-transparent border border-accent text-accent px-5 py-2.5 font-bold text-[10px] tracking-[2px] uppercase cursor-pointer hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-white">
                {/* Day Names */}
                {daysOfWeek.map(day => (
                    <div key={day} className="p-4 bg-[#F5F1E8] border-b border-black/10 font-bold text-[11px] uppercase tracking-widest text-center text-brand">
                        {day}
                    </div>
                ))}
                
                {/* Days Cells */}
                {renderCalendarCells()}
            </div>
        </div>

        {/* Additional Info Section */}
        <div className="max-w-[1100px] mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 border border-neutral">
                <i className="fa-solid fa-champagne-glasses text-3xl text-brand mb-4"></i>
                <h3 className="font-serif text-xl mb-2">Eventos Sociales</h3>
                <p className="text-sm text-secondary leading-relaxed">Conecta con tus colegas en un ambiente relajado y exclusivo.</p>
            </div>
            <div className="bg-surface p-8 border border-neutral">
                <i className="fa-solid fa-briefcase text-3xl text-brand mb-4"></i>
                <h3 className="font-serif text-xl mb-2">Reuniones Corporativas</h3>
                <p className="text-sm text-secondary leading-relaxed">Juntas de resultados, planeación estratégica y town halls.</p>
            </div>
            <div className="bg-surface p-8 border border-neutral">
                <i className="fa-solid fa-plane-departure text-3xl text-brand mb-4"></i>
                <h3 className="font-serif text-xl mb-2">Viajes de Inspección</h3>
                <p className="text-sm text-secondary leading-relaxed">Fam trips y visitas a propiedades destacadas para agentes.</p>
            </div>
        </div>

    </div>
  );
};

export default EventsCalendar;