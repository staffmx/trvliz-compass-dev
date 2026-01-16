import React from 'react';
import { User, Notice, NavigationItem } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (nav: NavigationItem) => void;
}

const notices: Notice[] = [
  {
    id: '1',
    title: 'Nueva Política de Viajes Corporativos',
    date: '10 Oct, 2023',
    content: 'Se han actualizado los límites de gastos para viajes internacionales. Por favor revisen el documento adjunto.',
    priority: 'high',
    category: 'Urgente'
  },
  {
    id: '2',
    title: 'Capacitación: Sistema de Reservas Amadeus',
    date: '15 Oct, 2023',
    content: 'Este viernes tendremos una sesión de refrescamiento sobre las nuevas funciones de Amadeus. Asistencia obligatoria.',
    priority: 'medium',
    category: 'Capacitación'
  },
  {
    id: '3',
    title: 'Bienvenida a nuevos empleados',
    date: '18 Oct, 2023',
    content: 'Demos la bienvenida a Laura y Carlos que se unen al equipo de Ventas LATAM.',
    priority: 'low',
    category: 'General'
  }
];

const events = [
    { id: 1, type: 'Webinar', title: 'Lanzamiento Temporada Europea 2026', date: '24', month: 'OCT', time: '10:00 AM' },
    { id: 2, type: 'Presencial', title: 'Cata de Vinos & Networking: Ritz', date: '28', month: 'OCT', time: '07:30 PM' },
    { id: 3, type: 'Webinar', title: 'Certificación Disney Destinations', date: '02', month: 'NOV', time: '04:00 PM' },
];

const topSellers = [
    { name: 'Sofia Rodriguez', sales: '$45,200', avatar: 'https://picsum.photos/id/101/100/100' },
    { name: 'Miguel Angel', sales: '$42,150', avatar: 'https://picsum.photos/id/203/100/100' },
    { name: 'Valentina C.', sales: '$38,900', avatar: 'https://picsum.photos/id/338/100/100' },
    { name: 'Jorge Torres', sales: '$35,400', avatar: 'https://picsum.photos/id/433/100/100' },
    { name: 'Ana Perez', sales: '$31,000', avatar: 'https://picsum.photos/id/523/100/100' },
];

const blogPosts = [
    {
        id: 1,
        title: "Japón 2025: Guía para el viajero de negocios",
        category: "Destinos",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        excerpt: "Claves culturales y logísticas para gestionar viajes corporativos al país del sol naciente.",
        readTime: "5 min"
    },
    {
        id: 2,
        title: "Tendencias en Cruceros de Expedición",
        category: "Cruceros",
        image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2064&auto=format&fit=crop",
        excerpt: "El mercado de lujo busca experiencias en la Antártida y el Ártico. Descubre qué ofrecer.",
        readTime: "4 min"
    },
    {
        id: 3,
        title: "Herramientas de IA para agentes de viajes",
        category: "Tecnología",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        excerpt: "Cómo utilizar las nuevas tecnologías para personalizar itinerarios en tiempo récord.",
        readTime: "3 min"
    }
];

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  
  // Reusable Calendar Component to be rendered in different locations based on breakpoint
  const CalendarSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral pb-4">
          <h2 className="text-2xl font-serif font-light text-primary">
              Calendario
          </h2>
          <button className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">
              Ver Todo
          </button>
      </div>
      
      <div className="bg-surface rounded-none shadow-sm border border-neutral divide-y divide-neutral">
          {events.map((event) => (
              <div key={event.id} className="p-5 flex flex-col gap-4 hover:bg-background transition-colors group">
                  <div className="flex items-start gap-4">
                      {/* Date Box - Square */}
                      <div className="flex-shrink-0 w-14 h-14 bg-brand text-white flex flex-col items-center justify-center rounded-none shadow-md transition-colors duration-300">
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{event.month}</span>
                          <span className="text-xl font-serif font-medium">{event.date}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none border ${
                                  event.type === 'Webinar' 
                                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                  {event.type === 'Webinar' ? <i className="fa-solid fa-video mr-1"></i> : <i className="fa-solid fa-users mr-1"></i>}
                                  {event.type}
                              </span>
                              <span className="text-[10px] text-secondary font-medium">
                                  <i className="fa-regular fa-clock text-accent mr-1"></i>{event.time}
                              </span>
                          </div>
                          <h4 className="font-serif text-base text-primary font-medium group-hover:text-accent transition-colors leading-tight">
                              {event.title}
                          </h4>
                      </div>
                  </div>
                  {/* Removed the "Asistir" button from here */}
              </div>
          ))}
      </div>
    </div>
  );

  return (
    // Layout System Applied: Max Width 1440px, Padding Y 120px (Bottom), Top 50px, Mobile Padding X 24px
    <div className="max-w-site mx-auto px-mobile-x pt-[50px] pb-section-y animate-fade-in">
      
      {/* Hero Section - Traveliz Blue Background */}
      <div className="mb-12 relative overflow-hidden rounded-none bg-brand text-white shadow-2xl">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left space-y-6">
             {/* H1 Primary Headline Style - High Impact */}
            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-white leading-none">
              Your World, <span className="italic text-accent">Tailored.</span>
            </h1>
            
            {/* Messages Container */}
            <div className="space-y-2">
                {/* Line 1: Welcome */}
                <p className="text-xl md:text-2xl text-white font-light tracking-wide">
                  Te damos la Bienvenida a Compass, <span className="font-semibold">{user.name.split(' ')[0]}</span>
                </p>
                {/* Line 2: Tagline */}
                <p className="text-gray-400 text-xs md:text-sm font-light tracking-[3px] uppercase">
                  Diseñar viajes extraordinarios empieza aquí.
                </p>
            </div>
          </div>
          
          {/* Button Style: Square */}
          <button 
             onClick={() => onNavigate(NavigationItem.AVISOS)}
             className="px-[30px] py-[15px] bg-white text-brand font-semibold uppercase tracking-[2px] rounded-none shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:text-accent transition-all transform hover:-translate-y-1 text-xs md:text-sm flex-shrink-0"
          >
             Ir a mis avisos
          </button>
        </div>
      </div>

      {/* Main Grid: Layout System Gap 40px */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gap mb-16">
        {/* Left Column: Notices & Quick Access (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* SECTION 1: AVISOS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral pb-4">
                {/* Secondary Headline (H2) - Traveliz Black */}
                <h2 className="text-2xl font-serif font-light text-primary">
                    Avisos Importantes
                </h2>
                {/* Link - Traveliz Blue */}
                <button onClick={() => onNavigate(NavigationItem.AVISOS)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">
                    Ver todos
                </button>
            </div>

            <div className="space-y-6">
                {notices.map((notice) => (
                <div key={notice.id} className="bg-surface p-8 rounded-none shadow-sm border border-neutral hover:shadow-lg transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                        <span className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                            notice.priority === 'high' ? 'bg-red-50 text-red-800' :
                            notice.priority === 'medium' ? 'bg-orange-50 text-orange-800' :
                            'bg-blue-50 text-blue-800'
                        }`}>
                            {notice.category}
                        </span>
                        {/* Date - Muted Text */}
                        <span className="text-xs text-secondary font-medium uppercase tracking-wide">
                            {notice.date}
                        </span>
                        </div>
                        {/* H3 style - Traveliz Black, Accent on hover */}
                        <h3 className="text-xl font-serif font-medium text-primary group-hover:text-accent transition-colors mb-3">
                            {notice.title}
                        </h3>
                        {/* Body Text - Traveliz Black */}
                        <p className="text-base text-primary leading-luxury font-light">
                            {notice.content}
                        </p>
                    </div>
                    {notice.priority === 'high' && (
                        <div className="sm:self-center">
                            <span className="w-2 h-2 rounded-full bg-red-500 block shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* MOBILE ONLY: Calendar inserted here to be between Notices and Quick Access */}
          <div className="block lg:hidden">
             <CalendarSection />
          </div>

          {/* SECTION 2: ACCESOS RÁPIDOS */}
          <div>
            <h2 className="text-2xl font-serif font-light text-primary mb-6 pb-4 border-b border-neutral">
                Accesos Rápidos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { id: NavigationItem.DOCUMENTACION, icon: 'fa-file-contract', label: 'Documentación', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { id: NavigationItem.CAPACITACION, icon: 'fa-chalkboard-user', label: 'Capacitación', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { id: NavigationItem.DIRECTORIO, icon: 'fa-users', label: 'Directorio', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'PROVEEDORES', icon: 'fa-handshake', label: 'Proveedores', color: 'text-orange-600', bg: 'bg-orange-50', action: () => alert("Función en desarrollo") }
                ].map((item: any) => (
                    <button 
                      key={item.label}
                      onClick={item.action ? item.action : () => onNavigate(item.id)}
                      className="p-6 bg-surface rounded-none shadow-sm border border-neutral hover:border-accent hover:shadow-md transition-all text-center group h-full flex flex-col items-center justify-center gap-3"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${item.bg} ${item.color} group-hover:scale-110 group-hover:bg-accent group-hover:text-white`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>

        </div>

        {/* Right Column: Calendar (Desktop) & Top Producers (1/3 width on desktop) */}
        <div className="space-y-10">
          
          {/* DESKTOP ONLY: Calendar inserted here as first option */}
          <div className="hidden lg:block">
            <CalendarSection />
          </div>
          
          {/* Top 5 Producers Widget - Traveliz Blue */}
          <div className="bg-brand rounded-none p-8 text-white shadow-xl relative overflow-hidden sticky top-24">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
             
             <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-xl font-light tracking-wide text-white">
                        Top Producers
                    </h3>
                    <i className="fa-solid fa-trophy text-accent text-xl"></i>
                 </div>
                 
                 <div className="space-y-5">
                    {topSellers.map((seller, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-default border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            {/* Rank - Gold for #1 */}
                            <span className={`text-lg font-serif italic w-6 text-center ${index === 0 ? 'text-accent' : 'text-gray-400'}`}>
                                {index + 1}
                            </span>
                            
                            {/* Avatar & Name */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={seller.avatar} 
                                        alt={seller.name} 
                                        className={`w-10 h-10 rounded-full object-cover ring-2 ${
                                            index === 0 ? 'ring-accent' : 'ring-white/10'
                                        }`} 
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200 tracking-wide">{seller.name}</p>
                                    <p className="text-[10px] text-gray-400 font-mono tracking-wider">{seller.sales}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* Corporate Blog Section - Layout System Gap 40px (gap-10) */}
      <div className="space-y-8 animate-slide-up">
         <div className="flex items-center justify-between border-b border-neutral pb-4">
            <h2 className="text-2xl font-serif font-light text-primary">
                Inspiración
            </h2>
            <button className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">
                Ver todo
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gap">
            {blogPosts.map((post) => (
                <div key={post.id} className="bg-surface rounded-none shadow-sm border border-neutral overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col h-full luxury-image-hover">
                    {/* Image Container with Luxury Hover Effect */}
                    <div className="h-56 overflow-hidden relative">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-widest text-brand shadow-sm">
                            {post.category}
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                        <h3 className="font-serif text-xl font-medium text-primary mb-4 group-hover:text-accent transition-colors leading-tight">
                            {post.title}
                        </h3>
                        <p className="text-sm text-secondary mb-6 line-clamp-3 leading-relaxed flex-1">
                            {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-secondary border-t border-neutral pt-4 mt-auto">
                            <span className="font-light tracking-wide italic font-serif">
                                {post.readTime} de lectura
                            </span>
                            {/* Interaction - Traveliz Blue, hover Gold */}
                            <span className="text-brand group-hover:text-accent group-hover:translate-x-1 transition-all font-bold uppercase tracking-widest flex items-center gap-2 text-[10px]">
                                Leer más <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Dashboard;