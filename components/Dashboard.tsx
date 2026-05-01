
import React, { useState, useEffect } from 'react';
import { User, Notice, NavigationItem, Associate, Event } from '../types';
import { api, BlogPost, Seller } from '../services/api';

interface DashboardProps {
  user: User;
  onNavigate: (nav: NavigationItem) => void;
  onEventClick?: (eventId: number) => void; 
  onNoticeClick?: (noticeId: string) => void; 
  onBlogClick?: (postId: number) => void; 
  onViewProfile?: (associateId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onEventClick, onNoticeClick, onBlogClick, onViewProfile }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<Associate[]>([]);
  const [allAssociates, setAllAssociates] = useState<Associate[]>([]);
  const [currentUserAssociate, setCurrentUserAssociate] = useState<Associate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSellerTier, setActiveSellerTier] = useState<string>('SENIOR PARTNER');

  const welcomePhrases = [
    { main: "Your World, ", accent: "Tailored." },
    { main: "Presence is the New ", accent: "Luxury" },
    { main: "The Art of Travel, ", accent: "Reimagined" },
    { main: "The Associates: ", accent: "Eleva tu pasión." },
    { main: "Tu respaldo en el ", accent: "mundo" }
  ];

  const heroImages = [
    "https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/fondo-hero/1.jpg",
    "https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/fondo-hero/2.jpg",
    "https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/fondo-hero/3.jpg",
    "https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/fondo-hero/4.jpg",
    "https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/fondo-hero/5.jpg"
  ];

  const [randomPhrase] = useState(() => welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)]);
  const [randomHeroImage] = useState(() => heroImages[Math.floor(Math.random() * heroImages.length)]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [noticesData, eventsData, sellersData, blogData, associatesData, myAssociateData] = await Promise.all([
          api.getNotices(),
          api.getEvents(),
          api.getTopSellers(),
          api.getBlogPosts(5),
          api.getAssociates(),
          api.getAssociateByUserId(user.id)
        ]);

        const postIds = blogData.map((p: any) => p.id);
        const interactions = await api.getFeedInteractions(postIds, user.id);
        const enhancedBlogData = blogData.map((post: any) => ({
           ...post,
           likes_count: interactions.likes[post.id] || 0,
           comments_count: interactions.comments[post.id] || 0,
           has_liked: interactions.userLiked.has(post.id),
           has_saved: interactions.userSaved.has(post.id)
        }));

        const filteredNotices = noticesData.filter((notice: Notice) => {
          if (!notice.recipient_ids || notice.recipient_ids.trim() === '') return true;
          if (!myAssociateData) return false;
          const ids = notice.recipient_ids.split(',').map(id => id.trim());
          return ids.includes(myAssociateData.id.toString());
        });
        setNotices(filteredNotices);
        setEvents(eventsData);
        setSellers(sellersData);
        setBlogPosts(enhancedBlogData);
        setAllAssociates(associatesData);
        setTeamMembers([...associatesData].sort(() => 0.5 - Math.random()).slice(0, 5));
        setCurrentUserAssociate(myAssociateData);
      } catch (error) {
        console.error("Dashboard failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [user.id]);

  const handleToggleLike = async (postId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const postIndex = blogPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;
      
      const post = blogPosts[postIndex];
      const currentlyLiked = !!post.has_liked;
      
      const newPosts = [...blogPosts];
      newPosts[postIndex] = {
         ...post,
         has_liked: !currentlyLiked,
         likes_count: (post.likes_count || 0) + (currentlyLiked ? -1 : 1)
      };
      setBlogPosts(newPosts);
      
      await api.toggleLike(postId, user.id, currentlyLiked);
  };

  const handleToggleSave = async (postId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const postIndex = blogPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;
      
      const post = blogPosts[postIndex];
      const currentlySaved = !!post.has_saved;
      
      const newPosts = [...blogPosts];
      newPosts[postIndex] = {
         ...post,
         has_saved: !currentlySaved
      };
      setBlogPosts(newPosts);
      
      await api.toggleSave(postId, user.id, currentlySaved);
  };

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
            events
                .filter(e => e.event_date && e.event_date >= new Date().toISOString().split('T')[0])
                .slice(0, 4)
                .map((event) => (
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

  const MiEquipoSection = () => (
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
                              <img src={member.image || 'https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/travel_advisors/blank-user.png'} alt={member.name} className="w-full h-full object-cover" />
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
  );

  return (
    <div className="max-w-site mx-auto px-mobile-x pt-[50px] pb-section-y animate-fade-in">
      <div className="mb-12 relative overflow-hidden rounded-none bg-brand text-white shadow-2xl min-h-[300px]">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
            <img 
                src={randomHeroImage} 
                alt="Traveliz Connect Background" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/60 to-transparent"></div>
        </div>

        <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
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
                {currentUserAssociate?.Branch && (
                    <div className="absolute -bottom-2 -right-2 bg-accent text-white px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-lg">
                        {currentUserAssociate.Branch}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-white leading-none">
                {randomPhrase.main} <span className="italic text-accent">{randomPhrase.accent}</span>
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
      
      {/* Welcome Video Section - 3 Columns */}
      <div className="mb-12 max-w-site mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
         {[
           { type: 'mp4', url: 'https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/videos/bienvenida-marcelo.mp4', title: 'Bienvenida a Traveliz Connect', poster: 'https://klknrbnipvgwywjbzafh.supabase.co/storage/v1/object/public/images/videos/portada-bienvenida-marcelo.jpg' },
           { type: 'youtube', url: "https://www.youtube.com/embed/ggET4j3Gdxg?rel=0&showinfo=0&autoplay=0", title: "Video 2", poster: undefined },
           { type: 'youtube', url: "https://www.youtube.com/embed/UlORnWguPqk?rel=0&showinfo=0&autoplay=0", title: "Video 3", poster: undefined }
         ].map((video, idx) => (
           <div key={idx} className="shadow-xl overflow-hidden rounded-none border border-neutral bg-black aspect-video relative group hover:border-accent transition-all duration-500">
              {video.type === 'mp4' ? (
                 <video 
                    src={video.url} 
                    title={video.title} 
                    poster={video.poster}
                    controls 
                    controlsList="nodownload"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                 />
              ) : (
                 <iframe 
                     src={video.url} 
                     title={video.title} 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     referrerPolicy="strict-origin-when-cross-origin" 
                     allowFullScreen
                     className="absolute top-0 left-0 w-full h-full"
                 ></iframe>
              )}
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gap mb-16">
        <div className="lg:col-span-2 space-y-12 order-2 lg:order-1">

          <div className="space-y-8 animate-slide-up">
             <div className="flex items-center justify-between border-b border-neutral pb-4">
                <h2 className="text-2xl font-serif font-light text-primary flex items-center gap-3">
                   <i className="fa-solid fa-rss text-brand"></i> Feed
                </h2>
                <button onClick={() => onNavigate(NavigationItem.BLOG)} className="text-xs font-semibold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ir al blog</button>
             </div>
             
             <div className="space-y-10">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-surface h-96 border border-neutral animate-pulse w-full shadow-sm"></div>
                    ))
                ) : (
                    blogPosts.map((post) => (
                        <div key={post.id} onClick={() => onBlogClick ? onBlogClick(post.id) : onNavigate(NavigationItem.BLOG)} className="bg-white rounded-none shadow-md border border-neutral overflow-hidden cursor-pointer group w-full transition-transform hover:-translate-y-1 duration-300">
                            <div className="p-4 flex items-center justify-between border-b border-neutral/50 bg-surface">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-sm shadow-inner">
                                        <i className="fa-solid fa-compass"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary tracking-wide">{post.author || 'Traveliz Team'}</p>
                                        <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{post.publish_date || 'Novedades'}</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-ellipsis text-secondary hover:text-primary transition-colors p-2"></i>
                            </div>
                            <div className="aspect-video w-full overflow-hidden relative bg-neutral">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-brand text-lg">
                                        <button onClick={(e) => handleToggleLike(post.id, e)} className={`transition-colors hover:scale-110 transform outline-none flex items-center gap-1.5 ${post.has_liked ? 'text-red-500' : 'hover:text-accent'}`}>
                                            <i className={`${post.has_liked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> 
                                            {post.likes_count ? <span className="text-xs font-semibold">{post.likes_count}</span> : null}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onBlogClick ? onBlogClick(post.id) : onNavigate(NavigationItem.BLOG); }} className="hover:text-accent transition-colors hover:scale-110 transform flex items-center gap-1.5 outline-none">
                                            <i className="fa-regular fa-comment"></i>
                                            {post.comments_count ? <span className="text-xs font-semibold">{post.comments_count}</span> : null}
                                        </button>
                                    </div>
                                    <button onClick={(e) => handleToggleSave(post.id, e)} className={`transition-colors text-lg hover:scale-110 transform outline-none ${post.has_saved ? 'text-brand' : 'text-secondary hover:text-primary'}`}>
                                        <i className={`${post.has_saved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                                    </button>
                                </div>
                                <span className="inline-block px-3 py-1 bg-brand/5 text-brand text-[9px] font-bold uppercase tracking-widest mb-3 border border-brand/10">
                                    {post.category || 'Destinos'}
                                </span>
                                <h3 className="font-serif text-2xl font-medium text-primary mb-3 leading-tight">{post.title}</h3>
                                <p className="text-sm text-secondary line-clamp-2 leading-relaxed mb-1">{post.excerpt}</p>
                                <span className="text-secondary text-xs hover:text-brand transition-colors inline-block mt-2 font-medium">Ver la publicación completa...</span>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>

          {/* El calendario móvil fue removido de aquí ya que ahora la columna derecha sale primero */}

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

          <div className="bg-brand rounded-none p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-white/20 gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="font-serif text-2xl font-light tracking-wide text-white">Top Producers</h3>
                        <i className="fa-solid fa-trophy text-accent text-xl"></i>
                    </div>
                    <div className="flex gap-2 bg-black/20 p-1 w-full overflow-x-auto md:w-auto scrollbar-hide">
                        {['SENIOR PARTNER', 'JUNIOR PARTNER', 'ASSOCIATE'].map(tier => (
                            <button 
                                key={tier}
                                onClick={() => setActiveSellerTier(tier)}
                                className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${activeSellerTier === tier ? 'bg-accent text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                                <div className="h-3 bg-white/10 w-3/4"></div>
                            </div>
                        ))
                    ) : (
                        sellers
                            .filter(s => (s.tier || 'SENIOR PARTNER') === activeSellerTier)
                            .sort((a,b) => a.ranking - b.ranking)
                            .slice(0, 5)
                            .map((seller, index) => {
                                const matchedAssociate = allAssociates.find(
                                    a => `${a.name} ${a.last_name || ''}`.trim().toLowerCase() === seller.name.trim().toLowerCase()
                                );
                                
                                return (
                                <div 
                                    key={index} 
                                    className="flex flex-col items-center text-center gap-3 relative group cursor-pointer"
                                    onClick={() => {
                                        if (matchedAssociate && onViewProfile) {
                                            onViewProfile(matchedAssociate.id);
                                        }
                                    }}
                                >
                                    <div className="relative">
                                        <img src={seller.avatar} alt={seller.name} className={`w-16 h-16 rounded-full object-cover ring-4 ${index === 0 ? 'ring-accent' : 'ring-white/10 group-hover:ring-white/30'} transition-all bg-white`} />
                                        <span className={`absolute -bottom-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-md ${index === 0 ? 'bg-accent text-white' : 'bg-white text-brand'}`}>
                                            {seller.ranking}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-200 tracking-wide leading-tight line-clamp-2">{seller.name}</p>
                                </div>
                                );
                            })
                    )}
                 </div>
             </div>
          </div>
          
          <div className="block lg:hidden"><MiEquipoSection /></div>
        </div>

        <div className="space-y-10 order-1 lg:order-2">
          <div className="bg-surface border border-neutral p-6 shadow-sm">
             <div className="flex items-center justify-between border-b border-neutral pb-4 mb-6">
                <h2 className="text-xl font-serif font-light text-primary">Avisos</h2>
                <button onClick={() => onNavigate(NavigationItem.AVISOS)} className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ver todos</button>
             </div>

            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="pb-4 mb-4 border-b border-neutral animate-pulse space-y-3">
                            <div className="flex gap-4"><div className="h-3 bg-gray-200 w-16"></div><div className="h-3 bg-gray-200 w-16"></div></div>
                            <div className="h-4 bg-gray-200 w-3/4"></div>
                        </div>
                    ))
                ) : (
                    notices.slice(0, 5).map((notice) => (
                    <button 
                        key={notice.id} 
                        onClick={() => onNoticeClick && onNoticeClick(notice.id)}
                        className="w-full text-left pb-4 mb-4 border-b border-neutral last:border-0 last:mb-0 last:pb-0 group cursor-pointer block"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded-none text-[8px] font-bold uppercase tracking-wider ${
                                notice.priority === 'high' ? 'bg-red-50 text-red-800' : notice.priority === 'medium' ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'
                            }`}>{notice.category}</span>
                            <span className="text-[10px] text-secondary font-medium uppercase tracking-wide">{notice.date}</span>
                            {notice.priority === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 block animate-pulse ml-auto"></span>}
                        </div>
                        <h3 className="text-sm font-serif font-medium text-primary group-hover:text-accent transition-colors mb-2 leading-tight">{notice.title}</h3>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand group-hover:underline">Leer Más</span>
                    </button>
                    ))
                )}
            </div>
          </div>

          <div><CalendarSection /></div>
          
          <div className="hidden lg:block"><MiEquipoSection /></div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
