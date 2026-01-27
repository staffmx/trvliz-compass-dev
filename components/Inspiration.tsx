import React, { useState, useEffect } from 'react';
import { NavigationItem } from '../types';
import { api, BlogPost, Event } from '../services/api';

interface InspirationProps {
    onNavigate: (nav: NavigationItem) => void;
}

const Inspiration: React.FC<InspirationProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, eventsData] = await Promise.all([
          api.getBlogPosts(),
          api.getEvents()
        ]);
        setPosts(postsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Inspiration failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const renderPostContent = (content?: string) => {
    if (!content) {
        // Fallback dummy content if DB doesn't have content field
        return (
            <div className="space-y-6 text-lg leading-relaxed text-primary font-light">
                <p><span className="first-letter:text-5xl first-letter:font-serif first-letter:text-brand first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">L</span>orem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Contenido no disponible.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-lg leading-relaxed text-primary font-light">
            {content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index} className={index === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:text-brand first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]" : ""}>{paragraph}</p>
            ))}
        </div>
    );
  };

  if (selectedPostId && selectedPost) {
    const recentPosts = posts.filter(p => p.id !== selectedPostId).slice(0, 3);
    return (
        <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
            <button onClick={() => setSelectedPostId(null)} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-brand mb-8 transition-colors">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver al Blog
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
                <div className="lg:col-span-7">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                            <span className="text-accent">{selectedPost.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{selectedPost.publish_date}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary leading-tight mb-6">{selectedPost.title}</h1>
                        <div className="flex items-center justify-between border-t border-b border-neutral py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-secondary"><i className="fa-solid fa-user"></i></div>
                                <div>
                                    <p className="text-sm font-bold text-primary">{selectedPost.author}</p>
                                    <p className="text-xs text-secondary">Traveliz Editor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 w-full aspect-video overflow-hidden shadow-md"><img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" /></div>
                    <div className="mb-16">{renderPostContent(selectedPost.content)}</div>
                    <div className="border-t border-neutral pt-12">
                        <h3 className="font-serif text-2xl text-primary mb-8">Lo más reciente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentPosts.map(post => (
                                <div key={post.id} onClick={() => { setSelectedPostId(post.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="group cursor-pointer">
                                    <div className="h-32 overflow-hidden mb-4 relative"><img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} /></div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">{post.category}</p>
                                    <h4 className="font-serif text-lg leading-tight text-primary group-hover:text-accent transition-colors">{post.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3 space-y-12">
                  <div className="bg-surface p-6 border border-neutral">
                    <h2 className="text-xl font-serif mb-6 border-b border-neutral pb-4">Próximos Eventos</h2>
                    <div className="space-y-4">
                        {events.map(event => (
                          <div key={event.id} className="flex gap-4 items-center">
                            <div className="bg-brand text-white w-10 h-10 flex flex-col items-center justify-center text-[8px]">
                              <span>{event.month}</span>
                              <span className="font-bold text-xs">{event.day}</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary truncate max-w-[150px]">{event.title}</p>
                              <p className="text-[10px] text-secondary">{event.time}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">Blog & Novedades</span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-6">Inspiración para tus Clientes</h1>
        <p className="text-secondary text-lg font-light leading-relaxed">Descubre las últimas tendencias, destinos emergentes y estrategias de mercado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-gap">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface h-96 border border-neutral animate-pulse"></div>
          ))
        ) : (
          posts.map((post) => (
            <article key={post.id} onClick={() => { setSelectedPostId(post.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="flex flex-col bg-surface rounded-none border border-neutral overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer luxury-image-hover h-full">
              <div className="h-64 overflow-hidden relative w-full">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute top-5 left-5"><span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest text-brand border border-gray-100">{post.category}</span></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">
                    <span className="text-brand">{post.publish_date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{post.read_time} lectura</span>
                </div>
                <h3 className="font-serif text-2xl text-primary mb-4 leading-tight group-hover:text-accent transition-colors">{post.title}</h3>
                <p className="text-sm text-secondary font-light leading-luxury mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                <div className="mt-auto border-t border-neutral pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral flex items-center justify-center text-xs text-secondary"><i className="fa-solid fa-user"></i></div>
                        <span className="text-xs text-secondary font-medium">{post.author}</span>
                    </div>
                    <span className="text-brand group-hover:text-accent text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-all flex items-center gap-2">Leer artículo <i className="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Inspiration;