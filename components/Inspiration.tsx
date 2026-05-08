
import React, { useState, useEffect } from 'react';
import { NavigationItem, Event, User, BlogPost, BlogComment } from '../types';
import { api } from '../services/api';
import { BLOG_CATEGORIES } from './AdminPanel';

interface InspirationProps {
    user: User;
    onNavigate: (nav: NavigationItem) => void;
    onNavigateToAdmin?: (section: string) => void;
    initialPostId?: number | null;
    onClearInitialPost?: () => void;
}

const Inspiration: React.FC<InspirationProps> = ({ user, onNavigate, onNavigateToAdmin, initialPostId, onClearInitialPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (initialPostId !== undefined && initialPostId !== null) {
      setSelectedPostId(initialPostId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialPostId]);

  const [articleComments, setArticleComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);

  useEffect(() => {
    if (selectedPostId) {
      // Incrementar vistas
      api.incrementBlogPostViews(selectedPostId);
      
      setCommentsLoading(true);
      setVisibleCommentsCount(10);
      api.getPostComments(selectedPostId).then(data => {
        setArticleComments(data);
        setCommentsLoading(false);
      });
    } else {
      setArticleComments([]);
    }
  }, [selectedPostId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, eventsData] = await Promise.all([
          api.getBlogPosts(),
          api.getEvents()
        ]);

        const postIds = postsData.map(p => p.id);
        const interactions = await api.getFeedInteractions(postIds, user.id);
        
        const enhancedPosts = postsData.map(post => ({
           ...post,
           likes_count: interactions.likes[post.id] || 0,
           comments_count: interactions.comments[post.id] || 0,
           has_liked: interactions.userLiked.has(post.id),
           has_saved: interactions.userSaved.has(post.id)
        }));

        setPosts(enhancedPosts);
        setEvents(eventsData);
      } catch (error) {
        console.error("Inspiration failed to load", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleToggleLike = async (postId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;
      
      const post = posts[postIndex];
      const currentlyLiked = !!post.has_liked;
      
      const newPosts = [...posts];
      newPosts[postIndex] = {
         ...post,
         has_liked: !currentlyLiked,
         likes_count: (post.likes_count || 0) + (currentlyLiked ? -1 : 1)
      };
      setPosts(newPosts);
      
      await api.toggleLike(postId, user.id, currentlyLiked);
  };

  const handleToggleSave = async (postId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;
      
      const post = posts[postIndex];
      const currentlySaved = !!post.has_saved;
      
      const newPosts = [...posts];
      newPosts[postIndex] = {
         ...post,
         has_saved: !currentlySaved
      };
      setPosts(newPosts);
      
      await api.toggleSave(postId, user.id, currentlySaved);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPostId) return;

    setIsSubmitting(true);
    const success = await api.addComment(selectedPostId, user.id, newComment.trim());
    if (success) {
      const tempId = Date.now();
      setArticleComments(prev => [...prev, {
         id: tempId,
         post_id: selectedPostId,
         user_id: user.id,
         content: newComment.trim(),
         created_at: new Date().toISOString(),
         profiles: { full_name: user.name, avatar_url: user.avatar || '' }
      }]);
      setNewComment('');
      
      const postIndex = posts.findIndex(p => p.id === selectedPostId);
      if (postIndex > -1) {
          const newPosts = [...posts];
          newPosts[postIndex] = {
             ...newPosts[postIndex],
             comments_count: (newPosts[postIndex].comments_count || 0) + 1
          };
          setPosts(newPosts);
      }
    }
    setIsSubmitting(false);
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);
  const popularPosts = [...posts].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)).slice(0, 5);
  const filteredPosts = selectedCategory ? posts.filter(p => p.category === selectedCategory) : posts;

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
        <div 
          className="space-y-6 text-lg leading-relaxed text-primary font-light [&>p:first-child]:first-letter:text-5xl [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-brand [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:mt-[-10px] break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-4 [&_a]:text-brand [&_a:hover]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_h1]:text-3xl [&_h1]:font-serif [&_h2]:text-2xl [&_h2]:font-serif [&_h3]:text-xl [&_h3]:font-serif"
          dangerouslySetInnerHTML={{ __html: content }}
        />
    );
  };

  if (selectedPostId && selectedPost) {
    const recentPosts = posts.filter(p => p.id !== selectedPostId).slice(0, 3);
    return (
        <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
            <button onClick={() => { setSelectedPostId(null); if (onClearInitialPost) onClearInitialPost(); }} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-brand mb-8 transition-colors">
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
                                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-secondary shadow-inner"><i className="fa-solid fa-compass"></i></div>
                                <div>
                                    <p className="text-sm font-bold text-primary">{selectedPost.profiles?.full_name || selectedPost.author}</p>
                                    <p className="text-[10px] text-secondary uppercase tracking-widest font-bold font-primary text-brand">Traveliz Editor</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-xl">
                                <button onClick={(e) => handleToggleLike(selectedPost.id, e)} className={`transition-colors flex items-center gap-2 hover:scale-110 transform outline-none ${selectedPost.has_liked ? 'text-red-500' : 'text-secondary hover:text-accent'}`}>
                                    <i className={`${selectedPost.has_liked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> 
                                    {selectedPost.likes_count ? <span className="text-sm font-semibold">{selectedPost.likes_count}</span> : null}
                                </button>
                                <div className="text-secondary flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                                    <i className="fa-regular fa-comment"></i>
                                    {selectedPost.comments_count ? <span className="text-sm font-semibold">{selectedPost.comments_count}</span> : null}
                                </div>
                                <button onClick={(e) => handleToggleSave(selectedPost.id, e)} className={`transition-colors hover:scale-110 transform outline-none ${selectedPost.has_saved ? 'text-brand' : 'text-secondary hover:text-primary'}`}>
                                    <i className={`${selectedPost.has_saved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                                </button>
                                <div className="h-6 w-[1px] bg-neutral mx-2 hidden sm:block"></div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => {
                                            const url = `${window.location.origin}?post=${selectedPost.id}`;
                                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${selectedPost.title} - Mira este artículo en Traveliz: ${url}`)}`, '_blank');
                                        }}
                                        className="text-secondary hover:text-[#25D366] transition-colors hover:scale-110 transform outline-none"
                                        title="Compartir por WhatsApp"
                                    >
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const url = `${window.location.origin}?post=${selectedPost.id}`;
                                            window.location.href = `mailto:?subject=${encodeURIComponent(selectedPost.title)}&body=${encodeURIComponent(`Hola, te comparto este artículo de Traveliz: ${url}`)}`;
                                        }}
                                        className="text-secondary hover:text-brand transition-colors hover:scale-110 transform outline-none"
                                        title="Enviar por Correo"
                                    >
                                        <i className="fa-regular fa-envelope"></i>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const url = `${window.location.origin}?post=${selectedPost.id}`;
                                            navigator.clipboard.writeText(url);
                                            alert("¡Enlace público copiado al portapapeles!");
                                        }}
                                        className="text-secondary hover:text-accent transition-colors hover:scale-110 transform outline-none"
                                        title="Copiar link público"
                                    >
                                        <i className="fa-solid fa-link text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 w-full aspect-video overflow-hidden shadow-md"><img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" /></div>
                    <div className="mb-16">{renderPostContent(selectedPost.content)}</div>
                    
                    <div className="border-t border-neutral pt-10 pb-12">
                        <h3 className="font-serif text-2xl text-primary mb-8 flex items-center gap-3">
                            <i className="fa-regular fa-comments text-brand"></i> Comentarios ({selectedPost.comments_count || 0})
                        </h3>
                        
                        <div className="space-y-8 mb-10">
                            {commentsLoading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 animate-pulse"><div className="w-10 h-10 rounded-full bg-neutral"></div><div className="flex-1 space-y-2"><div className="h-3 w-1/4 bg-neutral"></div><div className="h-10 w-full bg-neutral"></div></div></div>
                                ))
                            ) : articleComments.length > 0 ? (
                                <>
                                    <div className="space-y-8">
                                        {articleComments.slice(0, visibleCommentsCount).map(comment => (
                                            <div key={comment.id} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-neutral overflow-hidden shrink-0">
                                                    <img 
                                                        src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles?.full_name?.split(' ')[0] || 'U')}&background=random`} 
                                                        alt={comment.profiles?.full_name} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles?.full_name?.split(' ')[0] || 'U')}&background=random`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-3 mb-1">
                                                        <span className="text-sm font-bold text-primary uppercase">{comment.profiles?.full_name || 'Usuario'}</span>
                                                        <span className="text-[10px] text-secondary uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-secondary leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {articleComments.length > visibleCommentsCount && (
                                        <div className="mt-8 flex justify-center">
                                            <button 
                                                onClick={() => setVisibleCommentsCount(prev => prev + 10)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent transition-colors flex items-center gap-2"
                                            >
                                                Ver más comentarios <i className="fa-solid fa-chevron-down"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-secondary italic">Sé el primero en comentar.</p>
                            )}
                        </div>

                        <form onSubmit={submitComment} className="flex gap-4 items-start bg-surface p-6 border border-neutral">
                           <div className="w-10 h-10 rounded-full bg-neutral overflow-hidden shrink-0 hidden md:block">
                               <img 
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name?.split(' ')[0] || 'U')}&background=random`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name?.split(' ')[0] || 'U')}&background=random`;
                                    }}
                               />
                           </div>
                           <div className="flex-1 w-full">
                               <textarea 
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="Escribe tu comentario..." 
                                  className="w-full bg-white border border-neutral p-4 text-sm resize-none focus:outline-none focus:border-accent min-h-[100px] mb-4"
                                  required
                               />
                               <div className="flex justify-end">
                                   <button 
                                      type="submit" 
                                      disabled={isSubmitting || !newComment.trim()}
                                      className="bg-brand text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-accent transition-colors disabled:opacity-50"
                                   >
                                      {isSubmitting ? 'Publicando...' : 'Publicar'}
                                   </button>
                               </div>
                           </div>
                        </form>
                    </div>

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
                  <div className="bg-surface p-6 border border-neutral shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
                        <h2 className="text-xl font-serif font-light text-primary">Próximos Eventos</h2>
                        <button onClick={() => onNavigate(NavigationItem.CALENDARIO)} className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent transition-colors">Ver Todo</button>
                    </div>
                    <div className="space-y-0 divide-y divide-neutral">
                        {loading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="py-4 flex gap-4 animate-pulse">
                              <div className="bg-gray-200 w-12 h-12"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 w-3/4"></div>
                                <div className="h-2 bg-gray-200 w-1/2"></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          events
                            .filter(e => e.event_date && e.event_date >= new Date().toISOString().split('T')[0])
                            .slice(0, 4)
                            .map(event => (
                            <div key={event.id} onClick={() => onNavigate(NavigationItem.CALENDARIO)} className="py-4 flex gap-4 items-center group cursor-pointer hover:bg-background transition-colors">
                              <div className="bg-brand text-white w-12 h-12 flex flex-col items-center justify-center text-[8px] group-hover:bg-accent transition-colors shrink-0 shadow-sm">
                                <span className="opacity-80 uppercase font-bold tracking-tighter">{event.month}</span>
                                <span className="font-serif font-medium text-lg leading-none">{event.day}</span>
                              </div>
                              <div className="min-w-0">
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-1 py-0.5 rounded-none border mb-1 inline-block ${
                                    event.type === 'Webinar' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>
                                    {event.type}
                                </span>
                                <p className="text-sm font-serif font-medium text-primary truncate group-hover:text-accent transition-colors leading-tight">{event.title}</p>
                                <p className="text-[10px] text-secondary mt-0.5 font-light">{event.time}</p>
                              </div>
                            </div>
                          ))
                        )}
                        {!loading && events.length === 0 && (
                          <p className="text-xs text-secondary italic text-center py-10 font-light">Sin eventos próximos.</p>
                        )}
                    </div>
                  </div>

                  <div className="bg-surface p-6 border border-neutral shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
                        <h2 className="text-xl font-serif font-light text-primary">Los más populares</h2>
                        <i className="fa-solid fa-fire text-orange-500"></i>
                    </div>
                    <div className="space-y-6">
                        {loading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                              <div className="bg-gray-200 w-16 h-12"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 w-full"></div>
                                <div className="h-2 bg-gray-200 w-1/4"></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          popularPosts.map(post => (
                            <div key={post.id} onClick={() => { setSelectedPostId(post.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="flex gap-4 items-start group cursor-pointer transition-all">
                              <div className="w-16 h-12 overflow-hidden shrink-0 border border-neutral/50">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-serif font-medium text-primary line-clamp-2 group-hover:text-accent transition-colors leading-tight mb-1">{post.title}</h4>
                                <div className="flex items-center gap-2 text-red-500">
                                    <i className="fa-solid fa-heart text-[8px]"></i>
                                    <span className="text-[10px] font-bold">{post.likes_count || 0}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                    </div>
                  </div>

                  <div className="bg-surface p-6 border border-neutral shadow-sm mt-8">
                    <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
                        <h2 className="text-xl font-serif font-light text-primary">Categorías</h2>
                        <i className="fa-solid fa-tags text-brand"></i>
                    </div>
                    <ul className="space-y-4">
                        {BLOG_CATEGORIES.map(cat => {
                            const count = posts.filter(p => p.category === cat).length;
                            if (count === 0) return null;
                            return (
                                <li key={cat} onClick={() => { setSelectedCategory(cat); setSelectedPostId(null); if (onClearInitialPost) onClearInitialPost(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="flex justify-between items-center group cursor-pointer text-sm font-light text-secondary hover:text-brand transition-colors">
                                    <span>{cat}</span>
                                    <span className="w-6 h-6 rounded-full bg-background border border-neutral flex items-center justify-center text-[10px] group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all">
                                        {count}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
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
        
        {onNavigateToAdmin && (user.role === 'admin' || (user.roles || []).some(r => r.name.toLowerCase().trim().replace(/ /g, '_') === 'editor_blogs')) && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => onNavigateToAdmin('blog')}
              className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all duration-300 shadow-xl flex items-center gap-3 group"
            >
              <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> Agregar Blog
            </button>
          </div>
        )}
      </div>

      <div className="flex overflow-x-auto gap-4 py-4 mb-12 no-scrollbar border-b border-neutral justify-start md:justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-all ${!selectedCategory ? 'text-brand border-b-2 border-brand' : 'text-secondary hover:text-brand'}`}
        >
          Todos
        </button>
        {BLOG_CATEGORIES.map(cat => {
          const count = posts.filter(p => p.category === cat).length;
          if (count === 0) return null;
          return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'text-brand border-b-2 border-brand' : 'text-secondary hover:text-brand'}`}
              >
                {cat} <span className="opacity-50 ml-1">({count})</span>
              </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-gap">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface h-96 border border-neutral animate-pulse"></div>
          ))
        ) : (
          filteredPosts.map((post) => (
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
                <div className="mt-auto border-t border-neutral pt-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-brand text-lg">
                            <button onClick={(e) => handleToggleLike(post.id, e)} className={`transition-colors hover:scale-110 transform outline-none flex items-center gap-1.5 ${post.has_liked ? 'text-red-500' : 'hover:text-accent'}`}>
                                <i className={`${post.has_liked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i> 
                                {post.likes_count ? <span className="text-xs font-semibold">{post.likes_count}</span> : null}
                            </button>
                            <div className="hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer">
                                <i className="fa-regular fa-comment"></i>
                                {post.comments_count ? <span className="text-xs font-semibold">{post.comments_count}</span> : null}
                            </div>
                        </div>
                        <button onClick={(e) => handleToggleSave(post.id, e)} className={`transition-colors text-lg hover:scale-110 transform outline-none ${post.has_saved ? 'text-brand' : 'text-secondary hover:text-primary'}`}>
                            <i className={`${post.has_saved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-neutral flex items-center justify-center text-[10px] text-brand shadow-inner"><i className="fa-solid fa-compass"></i></div>
                            <span className="text-xs text-primary font-medium tracking-wide">{post.profiles?.full_name || post.author}</span>
                        </div>
                        <span className="text-brand group-hover:text-accent text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-all flex items-center gap-2">Continuar leyendo <i className="fa-solid fa-arrow-right"></i></span>
                    </div>
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
