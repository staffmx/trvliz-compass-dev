import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import { BlogPost } from '../types';
interface PublicPostViewProps {
  postId: number;
}

const PublicPostView: React.FC<PublicPostViewProps> = ({ postId }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postData, allPosts] = await Promise.all([
          api.getBlogPostById(postId),
          api.getBlogPosts(10)
        ]);
        
        if (postData) {
          setPost(postData);
          api.incrementBlogPostViews(postId);
        }
        
        // Filtrar el post actual de los populares
        const otherPosts = allPosts.filter(p => p.id !== postId).slice(0, 3);
        setPopularPosts(otherPosts);
      } catch (error) {
        console.error("Error loading public blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-secondary font-light tracking-widest uppercase text-[10px]">Cargando historia...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">Artículo no encontrado</h1>
        <p className="text-secondary mb-8">El enlace que seguiste no parece ser válido o el artículo ha sido removido.</p>
        <a href="https://traveliz.com" className="bg-brand text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-primary transition-colors">
          Ir a Traveliz.com
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-primary">
      <Helmet>
        <title>{post.title} | Traveliz Connect</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      {/* MODAL HEADER - LOGO ONLY */}
      <header className="py-8 border-b border-neutral/30 mb-8 md:mb-16">
        <div className="max-w-4xl mx-auto px-6 flex justify-center md:justify-start">
          <img 
            src="https://traveliz.com/wp-content/uploads/2025/07/logo-traveliz.svg" 
            alt="Traveliz" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </header>

      {/* ARTICLE BODY */}
      <main className="max-w-screen-md mx-auto px-6 mb-24">
        <div className="mb-12">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-accent mb-6">
                <span>{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-neutral"></span>
                <span className="text-secondary">{post.publish_date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-primary leading-tight mb-10">{post.title}</h1>
            
            <div className="flex items-center gap-4 py-8 border-t border-b border-neutral/40 mb-12">
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-compass text-lg"></i>
                </div>
                <div>
                    <p className="text-sm font-bold text-primary">{post.profiles?.full_name || post.author}</p>
                    <p className="text-[10px] text-brand uppercase tracking-widest font-bold">Expert Content Creator</p>
                </div>
            </div>
        </div>

        <div className="mb-16 rounded-none overflow-hidden shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-auto" />
        </div>

        {/* CONTENT RENDERING */}
        <div 
          className="prose prose-lg max-w-none space-y-8 text-lg leading-relaxed text-primary font-light mb-20
                     [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:font-serif 
                     [&>p:first-child]:first-letter:text-brand [&>p:first-child]:first-letter:float-left 
                     [&>p:first-child]:first-letter:mr-4 [&>p:first-child]:first-letter:mt-1
                     [&_img]:w-full [&_img]:h-auto [&_img]:mt-10 [&_img]:mb-10
                     [&_h2]:text-3xl [&_h2]:font-serif [&_h2]:text-primary [&_h2]:mt-12 [&_h2]:mb-8
                     [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA SECTION - BRAND COLORS */}
        <section className="bg-background/40 border border-neutral/60 p-10 md:p-16 text-center mb-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-serif text-primary mb-4">¿Te interesa planear una experiencia similar?</h3>
                <p className="text-secondary font-light max-w-lg mx-auto mb-10 text-base">
                    Nuestros expertos están listos para diseñar el viaje de tus sueños con beneficios exclusivos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="https://traveliz.com/quienes-somos/the-advisors/" 
                        target="_blank"
                        className="px-10 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-[3px] hover:bg-brand transition-all shadow-lg active:scale-95"
                    >
                        Contactar a un Especialista
                    </a>
                    <a 
                        href="https://traveliz.com" 
                        target="_blank"
                        className="px-10 py-4 bg-brand text-white text-[10px] font-bold uppercase tracking-[3px] hover:bg-accent transition-all shadow-lg active:scale-95"
                    >
                        Explorar Traveliz.com
                    </a>
                </div>
            </div>
        </section>

        {/* RELATED POSTS - KEEP READING */}
        <section className="border-t border-neutral/60 pt-16">
            <div className="flex items-center gap-6 mb-12">
                <h3 className="text-xs font-bold uppercase tracking-[3px] text-brand whitespace-nowrap">Sigue Leyendo</h3>
                <div className="h-[1px] flex-grow bg-neutral/60"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {popularPosts.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => window.location.href = `?post=${p.id}`}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-video overflow-hidden mb-6 bg-background relative border border-neutral/30">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-accent mb-2 block">{p.category}</span>
                        <h4 className="font-serif text-lg leading-tight text-primary group-hover:text-brand transition-colors line-clamp-2">
                            {p.title}
                        </h4>
                    </div>
                ))}
            </div>
        </section>
      </main>

      <footer className="bg-primary py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
            <img 
                src="https://traveliz.com/wp-content/uploads/2025/07/logo-traveliz.svg" 
                alt="Traveliz" 
                className="h-8 w-auto mx-auto mb-8 grayscale brightness-0 invert"
            />
            <p className="text-white/40 text-[9px] uppercase tracking-[4px] font-medium">
                © {new Date().getFullYear()} Traveliz. Todos los derechos reservados.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPostView;
