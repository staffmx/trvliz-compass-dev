import React, { useState, useEffect } from 'react';
import { User, Notice, NavigationItem } from '../types';
import { api, Event, BlogPost, Seller } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (nav: NavigationItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [noticesData, eventsData, sellersData, blogData] = await Promise.all([
          api.getNotices(),
          api.getEvents(),
          api.getTopSellers(),
          api.getBlogPosts(3)
        ]);
        setNotices(noticesData);
        setEvents(eventsData);
        setSellers(sellersData);
        setBlogPosts(blogData);
      } catch (error) {
        console.error("Dashboard failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const CalendarSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral pb-4">
          <h2 className="text-2xl font-serif font-light text-primary">Calendario</h2>
          <button onClick={() => onNavigate(NavigationItem.CALENDARIO)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">
              Ver Todo
          </button>
      </div>
      
      <div className="bg-surface rounded-none shadow-sm border border-neutral divide-y divide-neutral">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="p-5 flex gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 w-1/4"></div>
                      <div className="h-4 bg-gray-200 w-3/4"></div>
                  </div>
               </div>
             ))
          ) : (
            events.map((event) => (
                <div key={event.id} className="p-5 flex flex-col gap-4 hover:bg-background transition-colors group">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-brand text-white flex flex-col items-center justify-center rounded-none shadow-md transition-colors duration-300">
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{event.month}</span>
                            <span className="text-xl font-serif font-medium">{event.day}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none border ${
                                    event.type === 'Webinar' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>
                                    {event.type}
                                </span>
                                <span className="text-[10px] text-secondary font-medium">{event.time}</span>
                            </div>
                            <h4 className="font-serif text-base text-primary font-medium group-hover:text-accent transition-colors leading-tight">
                                {event.title}
                            </h4>
                        </div>
                    </div>
                </div>
            ))
          )}
      </div>
    </div>
  );

  return (
    <div className="max-w-site mx-auto px-mobile-x pt-[50px] pb-section-y animate-fade-in">
      <div className="mb-12 relative overflow-hidden rounded-none bg-brand text-white shadow-2xl">
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-white leading-none">
              Your World, <span className="italic text-accent">Tailored.</span>
            </h1>
            <div className="space-y-2">
                <p className="text-xl md:text-2xl text-white font-light tracking-wide">
                  Te damos la Bienvenida a Compass, <span className="font-semibold">{user.name.split(' ')[0]}</span>
                </p>
                <p className="text-gray-400 text-xs md:text-sm font-light tracking-[3px] uppercase">Diseñar viajes extraordinarios empieza aquí.</p>
            </div>
          </div>
          <button onClick={() => onNavigate(NavigationItem.AVISOS)} className="px-[30px] py-[15px] bg-white text-brand font-semibold uppercase tracking-[2px] rounded-none shadow-lg hover:text-accent transition-all transform hover:-translate-y-1 text-xs md:text-sm flex-shrink-0">
             Ir a mis avisos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gap mb-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral pb-4">
                <h2 className="text-2xl font-serif font-light text-primary">Avisos Importantes</h2>
                <button onClick={() => onNavigate(NavigationItem.AVISOS)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ver todos</button>
            </div>

            <div className="space-y-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface p-8 rounded-none border border-neutral animate-pulse space-y-4">
                            <div className="flex gap-4"><div className="h-4 bg-gray-200 w-20"></div><div className="h-4 bg-gray-200 w-20"></div></div>
                            <div className="h-6 bg-gray-200 w-3/4"></div>
                            <div className="h-4 bg-gray-200 w-full"></div>
                        </div>
                    ))
                ) : (
                    notices.map((notice) => (
                    <div key={notice.id} className="bg-surface p-8 rounded-none shadow-sm border border-neutral hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                                        notice.priority === 'high' ? 'bg-red-50 text-red-800' : notice.priority === 'medium' ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'
                                    }`}>{notice.category}</span>
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wide">{notice.date}</span>
                                </div>
                                <h3 className="text-xl font-serif font-medium text-primary group-hover:text-accent transition-colors mb-3">{notice.title}</h3>
                                <p className="text-base text-primary leading-luxury font-light">{notice.content}</p>
                            </div>
                            {notice.priority === 'high' && <div className="sm:self-center"><span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse"></span></div>}
                        </div>
                    </div>
                    ))
                )}
            </div>
          </div>

          <div className="block lg:hidden"><CalendarSection /></div>

          <div>
            <h2 className="text-2xl font-serif font-light text-primary mb-6 pb-4 border-b border-neutral">Accesos Rápidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { id: NavigationItem.DOCUMENTACION, icon: 'fa-file-contract', label: 'Documentación', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { id: NavigationItem.CAPACITACION, icon: 'fa-chalkboard-user', label: 'Capacitación', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { id: NavigationItem.DIRECTORIO, icon: 'fa-users', label: 'Directorio', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'PROVEEDORES', icon: 'fa-handshake', label: 'Proveedores', color: 'text-orange-600', bg: 'bg-orange-50', action: () => alert("Función en desarrollo") }
                ].map((item: any) => (
                    <button key={item.label} onClick={item.action ? item.action : () => onNavigate(item.id)} className="p-6 bg-surface rounded-none shadow-sm border border-neutral hover:border-accent hover:shadow-md transition-all text-center group h-full flex flex-col items-center justify-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${item.bg} ${item.color} group-hover:bg-accent group-hover:text-white`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="hidden lg:block"><CalendarSection /></div>
          
          <div className="bg-brand rounded-none p-8 text-white shadow-xl relative overflow-hidden sticky top-24">
             <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-xl font-light tracking-wide text-white">Top Producers</h3>
                    <i className="fa-solid fa-trophy text-accent text-xl"></i>
                 </div>
                 <div className="space-y-5">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                                <div className="space-y-2 flex-1"><div className="h-3 bg-white/10 w-3/4"></div><div className="h-2 bg-white/10 w-1/4"></div></div>
                            </div>
                        ))
                    ) : (
                        sellers.map((seller, index) => (
                            <div key={index} className="flex items-center gap-4 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <span className={`text-lg font-serif italic w-6 text-center ${index === 0 ? 'text-accent' : 'text-gray-400'}`}>{index + 1}</span>
                                <div className="flex items-center gap-3">
                                    <img src={seller.avatar} alt={seller.name} className={`w-10 h-10 rounded-full object-cover ring-2 ${index === 0 ? 'ring-accent' : 'ring-white/10'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-200 tracking-wide">{seller.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono tracking-wider">{seller.sales}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 animate-slide-up">
         <div className="flex items-center justify-between border-b border-neutral pb-4">
            <h2 className="text-2xl font-serif font-light text-primary">Inspiración</h2>
            <button onClick={() => onNavigate(NavigationItem.BLOG)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ver todo</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gap">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-surface h-80 border border-neutral animate-pulse"></div>
                ))
            ) : (
                blogPosts.map((post) => (
                    <div key={post.id} onClick={() => onNavigate(NavigationItem.BLOG)} className="bg-surface rounded-none shadow-sm border border-neutral overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col h-full luxury-image-hover">
                        <div className="h-56 overflow-hidden relative"><img src={post.image} alt={post.title} className="w-full h-full object-cover" /></div>
                        <div className="p-8 flex flex-col flex-1">
                            <h3 className="font-serif text-xl font-medium text-primary mb-4 group-hover:text-accent transition-colors leading-tight">{post.title}</h3>
                            <p className="text-sm text-secondary mb-6 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-xs text-secondary border-t border-neutral pt-4 mt-auto">
                                <span className="italic font-serif">{post.readTime} de lectura</span>
                                <span className="text-brand group-hover:text-accent font-bold uppercase tracking-widest flex items-center gap-2 text-[10px]">Leer más <i className="fa-solid fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;