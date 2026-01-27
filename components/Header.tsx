import React, { useState, useRef, useEffect } from 'react';
import { User, NavigationItem } from '../types';
import { api, AppNotification } from '../services/api';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentNav: NavigationItem;
  onNavigate: (nav: NavigationItem) => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentNav, onNavigate, onSearch }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (user?.email) {
        const data = await api.getNotificationsForUser(user.email);
        setNotifications(data);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
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
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-300 hover:text-white transition-colors">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate(NavigationItem.DASHBOARD)}>
               <img src="https://traveliz.com/new-2025/wp-content/uploads/2025/07/Traveliz_Logo_white.png" alt="Traveliz Logo" className="h-10 sm:h-12 w-auto object-contain" />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <span className="absolute left-3 top-2.5 text-secondary group-focus-within:text-accent transition-colors"><i className="fa-solid fa-search"></i></span>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar documentación, avisos..." className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-secondary rounded-none focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all text-sm font-light tracking-wide" />
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative" ref={notificationsRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`relative p-2 transition-colors ${isNotificationsOpen ? 'text-accent' : 'text-secondary hover:text-white'}`}>
                <i className="fa-regular fa-bell text-xl"></i>
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-[9px] font-bold text-white flex items-center justify-center rounded-full ring-2 ring-primary">{unreadCount}</span>}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface rounded-none shadow-2xl ring-1 ring-black/5 animate-fade-in origin-top-right z-50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral flex items-center justify-between bg-white"><h3 className="text-xs font-bold uppercase tracking-widest text-primary">Notificaciones Privadas</h3></div>
                  <div className="max-h-[400px] overflow-y-auto no-scrollbar bg-background">
                    {notifications.length > 0 ? notifications.slice(0, 5).map((n) => (
                      <div key={n.id} onClick={() => { api.markNotificationRead(n.id); onNavigate(NavigationItem.NOTIFICATIONS_HISTORY); setIsNotificationsOpen(false); }} className={`px-6 py-5 border-b border-neutral hover:bg-white transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-white/40' : ''}`}>
                        {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
                        <div className="flex gap-4">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'urgent' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : n.type === 'event' ? 'bg-purple-500' : 'bg-brand'}`}></div>
                          <div className="flex-1"><p className={`text-sm leading-snug mb-1 ${!n.is_read ? 'font-bold text-primary' : 'text-secondary font-light'}`}>{n.title}</p></div>
                        </div>
                      </div>
                    )) : <div className="p-10 text-center text-xs text-secondary italic">No hay mensajes nuevos.</div>}
                  </div>
                  <button onClick={() => { onNavigate(NavigationItem.NOTIFICATIONS_HISTORY); setIsNotificationsOpen(false); }} className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-[3px] hover:bg-brand transition-colors">Ver Todo el Historial</button>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1.5 rounded-none hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                <img src={user.avatar} alt={user.first_name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
                <span className="hidden lg:block text-sm font-medium text-white tracking-wide">{user.first_name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-surface rounded-none shadow-2xl py-2 z-50 animate-fade-in origin-top-right">
                  <div className="px-6 py-4 border-b border-neutral mb-2">
                    <p className="text-sm font-serif font-bold text-primary">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-secondary truncate mb-2">{user.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {user.groups.map(g => <span key={g} className="text-[7px] font-bold px-1 py-0.5 bg-accent/10 text-accent border border-accent/20 tracking-widest uppercase">{g}</span>)}
                    </div>
                  </div>
                  {(user.role === 'admin' || user.roles.includes('Admin')) && <button onClick={() => { onNavigate(NavigationItem.ADMIN); setIsProfileOpen(false); }} className="w-full text-left px-6 py-2.5 text-sm text-brand font-bold hover:bg-background"><i className="fa-solid fa-toolbox w-6"></i> Panel de Admin</button>}
                  <button onClick={onLogout} className="w-full text-left px-6 py-2.5 text-sm text-red-600 hover:bg-red-50"><i className="fa-solid fa-right-from-bracket w-6"></i> Salir</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden md:block bg-primary border-t border-white/5">
        <div className="max-w-site mx-auto px-mobile-x flex gap-10 items-center overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex items-center gap-2 py-5 text-xs font-semibold uppercase tracking-[2px] border-b-2 transition-all ${currentNav === item.id ? 'border-accent text-accent' : 'border-transparent text-secondary hover:text-white'}`}>
              <i className={`fa-solid ${item.icon} text-sm`}></i>{item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;