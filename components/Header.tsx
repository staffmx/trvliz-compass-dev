import React, { useState, useRef, useEffect } from 'react';
import { User, NavigationItem } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentNav: NavigationItem;
  onNavigate: (nav: NavigationItem) => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentNav, onNavigate, onSearch }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const navItems = [
    { id: NavigationItem.AVISOS, label: 'AVISOS', icon: 'fa-bullhorn' },
    { id: NavigationItem.DOCUMENTACION, label: 'Documentación', icon: 'fa-folder-open' },
    { id: NavigationItem.BLOG, label: 'Inspiración', icon: 'fa-blog' },
    { id: NavigationItem.DIRECTORIO, label: 'Directorio', icon: 'fa-address-book' },
    { id: NavigationItem.CAPACITACION, label: 'Capacitación', icon: 'fa-graduation-cap' },
    { id: NavigationItem.CALENDARIO, label: 'Calendario de Eventos', icon: 'fa-calendar-days' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-white border-b border-white/5 shadow-md">
      <div className="max-w-site mx-auto px-mobile-x">
        <div className="flex justify-between items-center h-20"> 
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-none hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate(NavigationItem.DASHBOARD)}
            >
               <img 
                  src="https://traveliz.com/new-2025/wp-content/uploads/2025/07/Traveliz_Logo_white.png" 
                  alt="Traveliz Logo" 
                  className="h-10 sm:h-12 w-auto object-contain"
               />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <span className="absolute left-3 top-2.5 text-secondary group-focus-within:text-accent transition-colors">
                <i className="fa-solid fa-search"></i>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar documentación, avisos o colegas..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-secondary rounded-none focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all text-sm font-light tracking-wide"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative p-2 text-secondary hover:text-white transition-colors">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-primary"></span>
            </button>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-none hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
                />
                <span className="hidden lg:block text-sm font-medium text-white tracking-wide">{user.name}</span>
                <i className={`fa-solid fa-chevron-down text-xs text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''} hidden lg:block`}></i>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-surface rounded-none shadow-2xl ring-1 ring-black/5 py-2 animate-fade-in origin-top-right z-50">
                  <div className="px-6 py-4 border-b border-neutral mb-2">
                    <p className="text-sm font-serif font-bold text-primary">{user.name}</p>
                    <p className="text-xs text-secondary tracking-wide truncate">{user.email}</p>
                    {user.role === 'admin' && <span className="mt-1 inline-block text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20">Administrator</span>}
                  </div>
                  
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { onNavigate(NavigationItem.ADMIN); setIsProfileOpen(false); }}
                      className="w-full text-left block px-6 py-2.5 text-sm text-brand font-bold hover:bg-background transition-colors"
                    >
                      <i className="fa-solid fa-toolbox w-6"></i> Panel de Admin
                    </button>
                  )}

                  <a href="#" className="block px-6 py-2.5 text-sm text-primary hover:bg-background hover:text-brand transition-colors">
                    <i className="fa-regular fa-user w-6"></i> Mi Perfil
                  </a>
                  <div className="border-t border-neutral my-2"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left block px-6 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fa-solid fa-right-from-bracket w-6"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden md:block bg-primary border-t border-white/5">
        <div className="max-w-site mx-auto px-mobile-x">
          <div className="flex gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 py-5 text-xs font-semibold uppercase tracking-[2px] border-b-2 transition-all duration-300 ${
                  currentNav === item.id 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-secondary hover:text-white hover:border-white/20'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 border-l-2 text-sm font-semibold uppercase tracking-widest ${
                  currentNav === item.id
                    ? 'bg-white/5 border-accent text-accent'
                    : 'border-transparent text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="w-5 flex justify-center">
                    <i className={`fa-solid ${item.icon}`}></i>
                </div>
                {item.label}
              </button>
            ))}
            {user.role === 'admin' && (
              <button
                onClick={() => { onNavigate(NavigationItem.ADMIN); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 border-l-2 border-transparent text-accent font-bold text-sm uppercase tracking-widest hover:bg-white/5"
              >
                <div className="w-5 flex justify-center"><i className="fa-solid fa-toolbox"></i></div>
                Panel Admin
              </button>
            )}
            <div className="border-t border-white/10 my-2 pt-2">
                 <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-4 text-sm font-semibold uppercase tracking-widest text-red-400 hover:bg-red-900/20"
                  >
                     <div className="w-5 flex justify-center">
                        <i className="fa-solid fa-right-from-bracket"></i>
                     </div>
                    Cerrar Sesión
                  </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;