
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inspiration from './components/Inspiration';
import Directory from './components/Directory';
import AssociateProfile from './components/AssociateProfile';
import Training from './components/Training';
import EventsCalendar from './components/EventsCalendar';
import EventDetail from './components/EventDetail';
import AdminPanel from './components/AdminPanel';
import Documentation from './components/Documentation';
import Suppliers from './components/Suppliers';
import NoticeDetail from './components/NoticeDetail';
import NoticesList from './components/NoticesList';
import MyProfile from './components/MyProfile';
import { User, NavigationItem } from './types';

const PlaceholderPage: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="max-w-site mx-auto px-mobile-x py-section-y text-center animate-fade-in">
    <div className="w-24 h-24 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary shadow-sm">
      <i className={`fa-solid ${icon} text-4xl`}></i>
    </div>
    <h2 className="text-3xl font-serif text-primary mb-3">{title}</h2>
    <p className="text-secondary text-lg font-light">Esta sección está actualmente bajo construcción.</p>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentNav, setCurrentNav] = useState<NavigationItem>(NavigationItem.DASHBOARD);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedAssociateId, setSelectedAssociateId] = useState<number | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('traveliz_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('traveliz_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('traveliz_user');
    setCurrentNav(NavigationItem.DASHBOARD);
  };

  const handleSearch = (term: string) => {
    alert(`Buscando: ${term}\n(Funcionalidad de búsqueda en desarrollo)`);
  };

  const handleNavigateToEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentNav(NavigationItem.EVENT_DETAIL);
  };
  
  const handleNavigateToNotice = (noticeId: string) => {
    setSelectedNoticeId(noticeId);
    setCurrentNav(NavigationItem.NOTICE_DETAIL);
  };

  const handleViewAssociate = (id: number) => {
    setSelectedAssociateId(id);
    setCurrentNav(NavigationItem.ASSOCIATE_DETAIL);
  };

  const renderContent = () => {
    switch (currentNav) {
      case NavigationItem.DASHBOARD:
        return <Dashboard 
            user={user!} 
            onNavigate={setCurrentNav} 
            onEventClick={handleNavigateToEvent}
            onNoticeClick={handleNavigateToNotice}
        />;
      case NavigationItem.AVISOS:
        return <NoticesList 
            onNavigate={setCurrentNav} 
            onEventClick={handleNavigateToEvent}
        />;
      case NavigationItem.NOTICE_DETAIL:
        return selectedNoticeId ? (
            <NoticeDetail 
                noticeId={selectedNoticeId} 
                onBack={() => setCurrentNav(NavigationItem.DASHBOARD)} 
            />
        ) : <PlaceholderPage title="Aviso no encontrado" icon="fa-triangle-exclamation" />;
      case NavigationItem.DOCUMENTACION:
        return <Documentation user={user!} />;
      case NavigationItem.PROVEEDORES:
        return <Suppliers />;
      case NavigationItem.BLOG:
        return <Inspiration onNavigate={setCurrentNav} />;
      case NavigationItem.DIRECTORIO:
        return <Directory onViewProfile={handleViewAssociate} />;
      case NavigationItem.ASSOCIATE_DETAIL:
        return selectedAssociateId ? (
            <AssociateProfile associateId={selectedAssociateId} onBack={() => setCurrentNav(NavigationItem.DIRECTORIO)} />
        ) : <Directory onViewProfile={handleViewAssociate} />;
      case NavigationItem.CAPACITACION:
        return <Training user={user!} />;
      case NavigationItem.CALENDARIO:
        return <EventsCalendar onEventClick={handleNavigateToEvent} />;
      case NavigationItem.EVENT_DETAIL:
        return selectedEventId ? (
          <EventDetail 
            eventId={selectedEventId} 
            user={user!} 
            onBack={() => setCurrentNav(NavigationItem.CALENDARIO)} 
          />
        ) : (
          <EventsCalendar onEventClick={handleNavigateToEvent} />
        );
      case NavigationItem.ADMIN:
        return <AdminPanel />;
      case NavigationItem.MY_PROFILE:
        return <MyProfile user={user!} onBack={() => setCurrentNav(NavigationItem.DASHBOARD)} onUserUpdate={setUser} />;
      default:
        return <Dashboard 
            user={user!} 
            onNavigate={setCurrentNav} 
            onEventClick={handleNavigateToEvent}
            onNoticeClick={handleNavigateToNotice}
        />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-primary">
      <Header 
        user={user!} 
        onLogout={handleLogout} 
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-primary border-t border-white/5 pt-16 pb-8 mt-16">
        <div className="max-w-site mx-auto px-mobile-x">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-16 justify-between">
                <div className="lg:w-[44%] space-y-6">
                    <div className="mb-4">
                        <img 
                            src="https://traveliz.com/new-2025/wp-content/uploads/2026/01/logo-vert-traveliz-1.png" 
                            alt="Traveliz" 
                            className="h-24 w-auto object-contain opacity-90"
                        />
                    </div>
                    <p className="text-secondary text-sm leading-luxury font-light max-w-md">
                        Redefiniendo el viaje de lujo a través de una lente de elegancia, sutileza y conexión emocional. Tu mundo, a tu medida.
                    </p>
                </div>

                <div className="lg:w-[28%] space-y-6">
                    <h5 className="font-serif text-white text-lg font-medium">Mapa de Sitio</h5>
                    <ul className="space-y-3">
                        <li><button onClick={() => setCurrentNav(NavigationItem.AVISOS)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Avisos</button></li>
                        <li><button onClick={() => setCurrentNav(NavigationItem.DOCUMENTACION)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Documentación</button></li>
                        <li><button onClick={() => setCurrentNav(NavigationItem.BLOG)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Inspiración</button></li>
                        <li><button onClick={() => setCurrentNav(NavigationItem.DIRECTORIO)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Directorio</button></li>
                        <li><button onClick={() => setCurrentNav(NavigationItem.CAPACITACION)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Capacitación</button></li>
                        <li><button onClick={() => setCurrentNav(NavigationItem.CALENDARIO)} className="text-secondary hover:text-accent transition-colors text-sm tracking-wide flex items-center gap-2 group">Calendario</button></li>
                    </ul>
                </div>

                <div className="lg:w-[28%] space-y-6">
                    <h5 className="font-serif text-white text-lg font-medium">Contacto</h5>
                    <ul className="space-y-5">
                        <li className="flex items-start gap-3 text-secondary group cursor-default">
                            <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                                <i className="fa-solid fa-envelope text-xs"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Email</span>
                                <span className="text-sm font-light text-gray-300">soporte@traveliz.com</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center">
                <p className="text-sm text-secondary font-light tracking-wide">© 2026 Traveliz. Todos los derechos reservados.</p>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Exclusivo uso interno.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
