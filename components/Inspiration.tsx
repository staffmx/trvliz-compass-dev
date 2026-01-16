import React, { useState } from 'react';
import { NavigationItem } from '../types';

interface InspirationProps {
    onNavigate: (nav: NavigationItem) => void;
}

interface BlogPost {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  content?: string;
}

const events = [
    { id: 1, type: 'Webinar', title: 'Lanzamiento Temporada Europea 2026', date: '24', month: 'OCT', time: '10:00 AM' },
    { id: 2, type: 'Presencial', title: 'Cata de Vinos & Networking: Ritz', date: '28', month: 'OCT', time: '07:30 PM' },
    { id: 3, type: 'Webinar', title: 'Certificación Disney Destinations', date: '02', month: 'NOV', time: '04:00 PM' },
];

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Japón 2025: Guía para el viajero de negocios",
    category: "Destinos",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Claves culturales y logísticas para gestionar viajes corporativos al país del sol naciente. Desde etiqueta en reuniones hasta transporte eficiente.",
    readTime: "5 min",
    author: "Hiroshi T.",
    date: "10 Oct"
  },
  {
    id: 2,
    title: "Tendencias en Cruceros de Expedición",
    category: "Cruceros",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2064&auto=format&fit=crop",
    excerpt: "El mercado de lujo busca experiencias en la Antártida y el Ártico. Descubre qué navieras están liderando la oferta sostenible y exclusiva.",
    readTime: "4 min",
    author: "Sarah J.",
    date: "08 Oct"
  },
  {
    id: 3,
    title: "Herramientas de IA para agentes de viajes",
    category: "Tecnología",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Cómo utilizar las nuevas tecnologías para personalizar itinerarios en tiempo récord sin perder el toque humano que nos caracteriza.",
    readTime: "3 min",
    author: "Tech Team",
    date: "05 Oct"
  },
  {
    id: 4,
    title: "Bleisure: El arte de mezclar negocios y placer",
    category: "Tendencias",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    excerpt: "Estadísticas recientes muestran que el 60% de los viajeros corporativos extienden su estancia. Aprende a capitalizar esta oportunidad.",
    readTime: "6 min",
    author: "Ana P.",
    date: "01 Oct"
  },
  {
    id: 5,
    title: "Hotelería Sostenible en Costa Rica",
    category: "Ecoturismo",
    image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Una selección de los 5 mejores eco-lodges que ofrecen lujo sin comprometer la huella de carbono. Ideal para clientes conscientes.",
    readTime: "4 min",
    author: "Carlos M.",
    date: "28 Sep"
  },
  {
    id: 6,
    title: "Gastronomía en Lima: Más allá del Ceviche",
    category: "Gastronomía",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    excerpt: "Rutas culinarias para clientes exigentes. Restaurantes con estrellas Michelin y joyas ocultas en la capital peruana.",
    readTime: "5 min",
    author: "Valentina R.",
    date: "25 Sep"
  },
  {
    id: 7,
    title: "Retiros de Bienestar Corporativo",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Por qué las grandes empresas están invirtiendo en retiros de yoga y mindfulness para sus ejecutivos. Destinos top: Bali y Tulum.",
    readTime: "3 min",
    author: "Sofia L.",
    date: "20 Sep"
  },
  {
    id: 8,
    title: "Nuevas rutas aéreas para 2026",
    category: "Aeronáutica",
    image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Análisis de las conexiones directas que abrirán Emirates y Delta hacia Latinoamérica y Asia Pacífico el próximo año.",
    readTime: "7 min",
    author: "Ops Team",
    date: "15 Sep"
  },
  {
    id: 9,
    title: "El Renacimiento de los Trenes de Lujo",
    category: "Lujo",
    image: "https://images.unsplash.com/photo-1474487548417-781cb714d22d?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Desde el Orient Express hasta el Belmond Andean Explorer. El 'Slow Travel' regresa con fuerza para el segmento ultra-premium.",
    readTime: "5 min",
    author: "Isabella G.",
    date: "10 Sep"
  }
];

const Inspiration: React.FC<InspirationProps> = ({ onNavigate }) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // Full content placeholder text
  const getDummyContent = () => (
    <div className="space-y-6 text-lg leading-relaxed text-primary font-light">
      <p>
        <span className="first-letter:text-5xl first-letter:font-serif first-letter:text-brand first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">L</span>
        orem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nullam ac odio et elit ultricies dictum. Curabitur sed lectus vel mauris tristique dictum a vel lorem.
      </p>
      <p>
        Praesent finibus, est et congue auctor, libero enim egestas elit, id dapibus eros ante id ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed et sem justo. Donec sit amet est sit amet risus tristique ullamcorper.
      </p>
      <h3 className="text-2xl font-serif text-brand mt-8 mb-4">Una perspectiva única</h3>
      <p>
        In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam, vel hendrerit purus. Ut quis est vel nibh pulvinar convallis quis sed tortor. Nulla facilisi. Mauris et nisi vitae justo molestie viverra nec a ipsum.
      </p>
      <blockquote className="border-l-4 border-accent pl-6 italic text-secondary my-8 font-serif text-xl">
        "El verdadero viaje de descubrimiento no consiste en buscar nuevos paisajes, sino en tener nuevos ojos."
      </blockquote>
      <p>
        Phasellus ac libero ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.
      </p>
      <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-accent">
        <li>Estrategias de adaptación cultural para ejecutivos.</li>
        <li>Logística eficiente en aeropuertos internacionales.</li>
        <li>Selección de alojamientos con certificación sostenible.</li>
      </ul>
    </div>
  );

  // Reusable Calendar Widget
  const CalendarWidget = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral pb-4">
          <h2 className="text-xl font-serif font-light text-primary">
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
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-14 h-14 bg-brand text-white flex flex-col items-center justify-center rounded-none shadow-md">
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{event.month}</span>
                          <span className="text-xl font-serif font-medium">{event.date}</span>
                      </div>
                      {/* Details */}
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none border ${
                                  event.type === 'Webinar' 
                                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                  {event.type}
                              </span>
                              <span className="text-[10px] text-secondary font-medium">
                                  {event.time}
                              </span>
                          </div>
                          <h4 className="font-serif text-sm text-primary font-medium group-hover:text-accent transition-colors leading-tight">
                              {event.title}
                          </h4>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );

  // Reusable Quick Access Widget
  const QuickAccessWidget = () => (
      <div>
        <h2 className="text-xl font-serif font-light text-primary mb-6 pb-4 border-b border-neutral">
            Accesos Rápidos
        </h2>
        <div className="grid grid-cols-2 gap-4">
            {[
              { id: NavigationItem.DOCUMENTACION, icon: 'fa-file-contract', label: 'Docs', color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: NavigationItem.CAPACITACION, icon: 'fa-chalkboard-user', label: 'Cursos', color: 'text-purple-600', bg: 'bg-purple-50' },
              { id: NavigationItem.DIRECTORIO, icon: 'fa-users', label: 'Directorio', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'PROVEEDORES', icon: 'fa-handshake', label: 'Partners', color: 'text-orange-600', bg: 'bg-orange-50', action: () => alert("Función en desarrollo") }
            ].map((item: any) => (
                <button 
                  key={item.label}
                  onClick={item.action ? item.action : () => onNavigate(item.id)}
                  className="p-4 bg-surface rounded-none shadow-sm border border-neutral hover:border-accent hover:shadow-md transition-all text-center group flex flex-col items-center justify-center gap-2"
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${item.bg} ${item.color} group-hover:bg-accent group-hover:text-white`}>
                        <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">{item.label}</span>
                </button>
            ))}
        </div>
      </div>
  );

  // --- VIEW: ARTICLE PAGE (Selected Post) ---
  if (selectedPostId && selectedPost) {
    // Filter out current post for "Recent Posts" block and take 3
    const recentPosts = posts.filter(p => p.id !== selectedPostId).slice(0, 3);

    return (
        <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
            {/* Back Button */}
            <button 
                onClick={() => setSelectedPostId(null)}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-brand mb-8 transition-colors"
            >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                Volver al Blog
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
                
                {/* --- LEFT COLUMN: 70% (7 cols) --- */}
                <div className="lg:col-span-7">
                    
                    {/* Article Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                            <span className="text-accent">{selectedPost.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{selectedPost.date}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary leading-tight mb-6">
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center justify-between border-t border-b border-neutral py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-secondary">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-primary">{selectedPost.author}</p>
                                    <p className="text-xs text-secondary">Traveliz Editor</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral text-secondary hover:bg-brand hover:text-white hover:border-brand transition-all">
                                    <i className="fa-brands fa-linkedin-in text-xs"></i>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral text-secondary hover:bg-brand hover:text-white hover:border-brand transition-all">
                                    <i className="fa-regular fa-envelope text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-10 w-full aspect-video overflow-hidden shadow-md">
                        <img 
                            src={selectedPost.image} 
                            alt={selectedPost.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Body */}
                    <div className="mb-16">
                        {getDummyContent()}
                    </div>

                    {/* Block: Lo más reciente (Inside 70% col as requested "Abajo del texto") */}
                    <div className="border-t border-neutral pt-12">
                        <h3 className="font-serif text-2xl text-primary mb-8">Lo más reciente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentPosts.map(post => (
                                <div 
                                    key={post.id} 
                                    onClick={() => { setSelectedPostId(post.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                                    className="group cursor-pointer"
                                >
                                    <div className="h-32 overflow-hidden mb-4 relative">
                                        <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">{post.category}</p>
                                    <h4 className="font-serif text-lg leading-tight text-primary group-hover:text-accent transition-colors">
                                        {post.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN: 30% (3 cols) --- */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Calendar Block */}
                    <CalendarWidget />

                    {/* Quick Access Block */}
                    <QuickAccessWidget />
                </div>

            </div>
        </div>
    );
  }

  // --- VIEW: BLOG GRID (Default) ---
  return (
    // Layout System Applied: Max Width 1440px, Padding Y 120px, Mobile Padding X 24px
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
          Blog & Novedades
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-6">
          Inspiración para tus Clientes
        </h1>
        <p className="text-secondary text-lg font-light leading-relaxed">
          Descubre las últimas tendencias, destinos emergentes y estrategias de mercado para elevar tus propuestas de viaje al siguiente nivel.
        </p>
      </div>

      {/* 3x3 Grid Layout with System Gap 40px */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-gap">
        {posts.map((post) => (
          <article 
            key={post.id} 
            onClick={() => { setSelectedPostId(post.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="flex flex-col bg-surface rounded-none border border-neutral overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer luxury-image-hover h-full"
          >
            {/* Image Wrapper */}
            <div className="h-64 overflow-hidden relative w-full">
               <img 
                 src={post.image} 
                 alt={post.title} 
                 className="w-full h-full object-cover"
               />
               {/* Overlay gradient on hover - Blue Brand */}
               <div className="absolute inset-0 bg-brand/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               {/* Floating Category Tag - Square */}
               <div className="absolute top-5 left-5">
                 <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest text-brand shadow-sm border border-gray-100">
                   {post.category}
                 </span>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-8 flex flex-col flex-1">
               {/* Meta Info */}
               <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">
                  <span className="text-brand">{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{post.readTime} lectura</span>
               </div>

               {/* Title - Traveliz Black */}
               <h3 className="font-serif text-2xl text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                 {post.title}
               </h3>

               {/* Excerpt - Muted Text */}
               <p className="text-sm text-secondary font-light leading-luxury mb-6 line-clamp-3 flex-1">
                 {post.excerpt}
               </p>

               {/* Footer / Author */}
               <div className="mt-auto border-t border-neutral pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-neutral flex items-center justify-center text-xs text-secondary">
                        <i className="fa-solid fa-user"></i>
                     </div>
                     <span className="text-xs text-secondary font-medium">{post.author}</span>
                  </div>
                  
                  {/* Link Action - Brand color normal, Accent hover */}
                  <span className="text-brand group-hover:text-accent text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-all flex items-center gap-2">
                     Leer artículo <i className="fa-solid fa-arrow-right"></i>
                  </span>
               </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination / Load More - Square */}
      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-white border border-neutral text-brand text-xs font-bold uppercase tracking-[2px] hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 rounded-none shadow-sm">
           Cargar más artículos
        </button>
      </div>

    </div>
  );
};

export default Inspiration;