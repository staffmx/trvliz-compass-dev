
import React, { useState, useEffect } from 'react';
import { User, Notice, NavigationItem, Associate } from '../types';
import { api, Event, BlogPost, Seller } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (nav: NavigationItem) => void;
  onEventClick?: (eventId: number) => void; 
  onNoticeClick?: (noticeId: string) => void; 
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onEventClick, onNoticeClick }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<Associate[]>([]);
  const [currentUserAssociate, setCurrentUserAssociate] = useState<Associate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [noticesData, eventsData, sellersData, blogData, associatesData, myAssociateData] = await Promise.all([
          api.getNotices(),
          api.getEvents(),
          api.getTopSellers(),
          api.getBlogPosts(3),
          api.getAssociates(),
          api.getAssociateByUserId(user.id)
        ]);
        setNotices(noticesData);
        setEvents(eventsData);
        setSellers(sellersData);
        setBlogPosts(blogData);
        setTeamMembers(associatesData.slice(0, 5)); // Show first 5 associates
        setCurrentUserAssociate(myAssociateData);
      } catch (error) {
        console.error("Dashboard failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [user.id]);

  const CalendarSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral pb-4">
          <h2 className="text-2xl font-serif font-light text-primary">Próximos Eventos</h2>
          <button onClick={() => onNavigate(NavigationItem.CALENDARIO)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">
              Ver Todo
          </button>
      </div>
      
      <div className="bg-surface rounded-none shadow-sm border border-neutral divide-y divide-neutral">
          {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="p-5 flex gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 w-1/4"></div>
                      <div className="h-4 bg-gray-200 w-3/4"></div>
                  </div>
               </div>
             ))
          ) : (
            events.slice(0, 6).map((event) => (
                <button 
                    key={event.id} 
                    onClick={() => event.id && onEventClick && onEventClick(event.id)}
                    className="w-full text-left p-5 flex flex-col gap-4 hover:bg-background transition-colors group cursor-pointer"
                >
                    <div className="flex items-start gap-4 w-full">
                        <div className="flex-shrink-0 w-14 h-14 bg-brand text-white flex flex-col items-center justify-center rounded-none shadow-md transition-colors duration-300 group-hover:bg-accent">
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{event.month}</span>
                            <span className="text-xl font-serif font-medium">{event.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none border ${
                                    event.type === 'Webinar' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>
                                    {event.type}
                                </span>
                                <span className="text-[10px] text-secondary font-medium">{event.time}</span>
                            </div>
                            <h4 className="font-serif text-base text-primary font-medium group-hover:text-accent transition-colors leading-tight truncate">
                                {event.title}
                            </h4>
                        </div>
                    </div>
                </button>
            ))
          )}
          {!loading && events.length === 0 && (
            <div className="p-10 text-center text-secondary text-sm italic">No hay eventos programados.</div>
          )}
      </div>
    </div>
  );

  return (
    <div className="max-w-site mx-auto px-mobile-x pt-[50px] pb-section-y animate-fade-in">
      <div className="mb-12 relative overflow-hidden rounded-none bg-brand text-white shadow-2xl">
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* User Avatar from Profile */}
            <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                    <img 
                        src={currentUserAssociate?.image || user.avatar || 'https://via.placeholder.com/200'} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                {currentUserAssociate?.branch && (
                    <div className="absolute -bottom-2 -right-2 bg-accent text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-lg">
                        {currentUserAssociate.branch}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-white leading-none">
                Your World, <span className="italic text-accent">Tailored.</span>
                </h1>
                <div className="space-y-1">
                    <p className="text-xl md:text-2xl text-white font-light tracking-wide">
                    Te damos la Bienvenida, <span className="font-semibold">{user.name.split(' ')[0]}</span>
                    </p>
                    {currentUserAssociate?.position && (
                        <p className="text-accent text-[10px] font-bold uppercase tracking-[4px]">{currentUserAssociate.position}</p>
                    )}
                </div>
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
                    <button 
                        key={notice.id} 
                        onClick={() => onNoticeClick && onNoticeClick(notice.id)}
                        className="w-full text-left bg-surface p-8 rounded-none shadow-sm border border-neutral hover:shadow-lg hover:border-accent/30 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                                        notice.priority === 'high' ? 'bg-red-50 text-red-800' : notice.priority === 'medium' ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'
                                    }`}>{notice.category}</span>
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wide">{notice.date}</span>
                                </div>
                                <h3 className="text-xl font-serif font-medium text-primary group-hover:text-accent transition-colors mb-3">{notice.title}</h3>
                                <p className="text-base text-primary leading-luxury font-light line-clamp-2">{notice.content}</p>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand mt-4 inline-block group-hover:underline">Leer Más</span>
                            </div>
                            {notice.priority === 'high' && <div className="sm:self-center"><span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse"></span></div>}
                        </div>
                    </button>
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
                  { id: NavigationItem.PROVEEDORES, icon: 'fa-handshake', label: 'Proveedores', color: 'text-orange-600', bg: 'bg-orange-50' }
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
          
          <div className="bg-brand rounded-none p-8 text-white shadow-xl relative overflow-hidden">
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
                            <div key={index} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0 min-h-[60px]">
                                <span className={`text-lg font-serif italic w-6 text-center ${index === 0 ? 'text-accent' : 'text-gray-400'}`}>{seller.ranking}</span>
                                <div className="flex items-center gap-4">
                                    <img src={seller.avatar} alt={seller.name} className={`w-12 h-12 rounded-full object-cover ring-2 ${index === 0 ? 'ring-accent' : 'ring-white/10'}`} />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm font-medium text-gray-200 tracking-wide leading-tight">{seller.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
             </div>
          </div>

          <div className="bg-white border border-neutral p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
                  <h3 className="font-serif text-xl font-light text-primary">Mi Equipo</h3>
                  <button onClick={() => onNavigate(NavigationItem.DIRECTORIO)} className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ver Directorio</button>
              </div>
              <div className="space-y-6">
                  {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-4 animate-pulse">
                              <div className="w-10 h-10 bg-neutral rounded-full"></div>
                              <div className="space-y-2 flex-1"><div className="h-3 bg-neutral w-3/4"></div><div className="h-2 bg-neutral w-1/4"></div></div>
                          </div>
                      ))
                  ) : (
                      teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate(NavigationItem.DIRECTORIO)}>
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral grayscale group-hover:grayscale-0 transition-all">
                                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-primary truncate group-hover:text-brand transition-colors">{member.name} {member.last_name}</p>
                                  <p className="text-[10px] text-secondary uppercase tracking-widest truncate">{member.position || 'Travel Consultant'}</p>
                              </div>
                          </div>
                      ))
                  )}
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
                                <span className="italic font-serif">{post.read_time} de lectura</span>
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
