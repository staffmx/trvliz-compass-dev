
import React, { useState, useRef, useEffect } from 'react';
import { User, NavigationItem, Notice, NotificationInbox } from '../types';
import { api } from '../services/api';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentNav: NavigationItem;
  onNavigate: (nav: NavigationItem) => void;
  onSearch: (term: string) => void;
  onNoticeClick?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentNav, onNavigate, onSearch, onNoticeClick }) => {
  const hasAdminAccess = user.role === 'admin' || (user.roles && user.roles.length > 0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<NotificationInbox[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      setLoadingNotifications(true);
      try {
        const data = await api.getNotifications(user.id);
        setNotifications(data);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 3 * 60 * 1000); // Cada 3 min
    return () => clearInterval(interval);
  }, [user.id]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = async (inboxItem: NotificationInbox) => {
    if (!inboxItem.is_read) {
      await api.markNotificationAsRead(inboxItem.id);
      // Actualizar estado local para feedback inmediato
      setNotifications(prev => prev.map(n => n.id === inboxItem.id ? { ...n, is_read: true } : n));
    }
    setIsNotificationsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const navItems = [
    { id: NavigationItem.AVISOS, label: 'AVISOS', icon: 'fa-bullhorn' },
    { id: NavigationItem.DOCUMENTACION, label: 'Documentación', icon: 'fa-folder-open' },
    { id: NavigationItem.PROVEEDORES, label: 'Proveedores', icon: 'fa-handshake' },
    { id: NavigationItem.BLOG, label: 'Inspiración', icon: 'fa-blog' },
    { id: NavigationItem.DIRECTORIO, label: 'Directorio', icon: 'fa-address-book' },
    { id: NavigationItem.CAPACITACION, label: 'Capacitación', icon: 'fa-graduation-cap' },
    { id: NavigationItem.CALENDARIO, label: 'Calendario', icon: 'fa-calendar-days' },
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
                  src="https://traveliz.com/trvconnect/16-547x184.png" 
                  alt="TRV Connect Logo" 
                  className="h-12 sm:h-16 w-auto object-contain"
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
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-none transition-all ${isNotificationsOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="relative">
                  <i className="fa-regular fa-bell text-xl"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center border-2 border-primary animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface rounded-none shadow-2xl ring-1 ring-black/5 py-0 animate-fade-in origin-top-right z-50">
                  <div className="px-6 py-4 border-b border-neutral bg-background/50">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Notificaciones Personales</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-8 text-center">
                        <i className="fa-solid fa-circle-notch fa-spin text-brand"></i>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <i className="fa-regular fa-bell-slash text-neutral text-2xl mb-3 block"></i>
                        <p className="text-xs text-secondary italic">No tienes mensajes nuevos.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral">
                        {notifications.map((item) => (
                          <button 
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`w-full text-left p-4 hover:bg-background transition-colors group ${!item.is_read ? 'bg-brand/5 border-l-2 border-brand' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!item.is_read ? 'bg-brand animate-pulse' : 'bg-neutral/40'}`}></div>
                              <div>
                                <p className={`text-xs font-bold transition-colors line-clamp-1 ${!item.is_read ? 'text-primary' : 'text-secondary'}`}>
                                  {item.notification?.title || 'Sin Título'}
                                </p>
                                <p className="text-[10px] text-secondary mt-1 line-clamp-2 leading-relaxed">{item.notification?.content}</p>
                                <p className="text-[9px] text-neutral mt-2 uppercase tracking-tighter">
                                  {item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : ''}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-neutral text-center bg-background/30">
                    <button 
                      onClick={() => { onNavigate(NavigationItem.NOTIFICATIONS); setIsNotificationsOpen(false); }}
                      className="text-[9px] font-bold uppercase tracking-widest text-brand hover:text-accent transition-colors"
                    >
                      Ver todas mis notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                    {hasAdminAccess && (
                      <span className="mt-1 inline-block text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20">Administrator</span>
                    )}
                  </div>
                  
                  {hasAdminAccess && (
                    <button 
                      onClick={() => { onNavigate(NavigationItem.ADMIN); setIsProfileOpen(false); }}
                      className="w-full text-left block px-6 py-2.5 text-sm text-brand font-bold hover:bg-background transition-colors"
                    >
                      <i className="fa-solid fa-toolbox w-6"></i> Panel de Admin
                    </button>
                  )}

                  <button 
                    onClick={() => { onNavigate(NavigationItem.MY_PROFILE); setIsProfileOpen(false); }}
                    className="w-full text-left block px-6 py-2.5 text-sm text-primary hover:bg-background hover:text-brand transition-colors"
                  >
                    <i className="fa-regular fa-user w-6"></i> Mi Perfil
                  </button>
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
          <div className="flex gap-10 items-center overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 py-5 text-xs font-semibold uppercase tracking-[2px] border-b-2 transition-all duration-300 whitespace-nowrap ${
                  currentNav === item.id 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-secondary hover:text-white hover:border-white/20'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm`}></i>
                {item.label}
              </button>
            ))}
            
            {hasAdminAccess && (
              <button
                onClick={() => onNavigate(NavigationItem.ADMIN)}
                className={`ml-auto flex items-center gap-2 py-2 px-4 text-[10px] font-bold uppercase tracking-[2px] border transition-all duration-300 ${
                  currentNav === NavigationItem.ADMIN
                    ? 'bg-accent border-accent text-white' 
                    : 'border-accent/30 text-accent hover:bg-accent hover:text-white'
                }`}
              >
                <i className="fa-solid fa-toolbox"></i>
                ADMIN
              </button>
            )}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 animate-slide-down max-h-[70vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {hasAdminAccess && (
              <button
                onClick={() => { onNavigate(NavigationItem.ADMIN); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 mb-2 border-l-2 border-accent bg-accent/10 text-accent font-bold text-sm uppercase tracking-widest"
              >
                <div className="w-5 flex justify-center"><i className="fa-solid fa-toolbox"></i></div>
                Panel Admin
              </button>
            )}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 border-l-2 text-sm font-semibold uppercase tracking-widest ${
                  currentNav === item.id
                    ? 'bg-white/5 border-white text-white'
                    : 'border-transparent text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="w-5 flex justify-center">
                    <i className={`fa-solid ${item.icon}`}></i>
                </div>
                {item.label}
              </button>
            ))}
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
