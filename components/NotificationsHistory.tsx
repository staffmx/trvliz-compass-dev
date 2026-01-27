import React, { useState, useEffect } from 'react';
import { api, AppNotification } from '../services/api';
import { User } from '../types';

interface NotificationsHistoryProps {
  user: User;
}

const NotificationsHistory: React.FC<NotificationsHistoryProps> = ({ user }) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'event' | 'info'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const data = await api.getNotificationsForUser(user.email);
      setNotifications(data);
      setLoading(false);
    };
    loadNotifications();
  }, [user.email]);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => api.markNotificationRead(n.id)));
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id: string) => {
    await api.deleteNotification(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'urgent': return <i className="fa-solid fa-triangle-exclamation text-red-500"></i>;
      case 'event': return <i className="fa-solid fa-calendar-star text-purple-500"></i>;
      default: return <i className="fa-solid fa-circle-info text-brand"></i>;
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Hoy';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="max-w-4xl mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">Mensajería Privada</span>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary leading-tight">Mis Notificaciones</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            className="px-6 py-3 border border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-brand hover:border-brand transition-all"
          >
            Marcar todo como leído
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'urgent', label: 'Urgentes' },
          { id: 'event', label: 'Eventos' },
          { id: 'info', label: 'Información' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
              filter === cat.id 
                ? 'bg-primary border-primary text-white' 
                : 'bg-white border-neutral text-secondary hover:border-brand hover:text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="py-20 text-center"><i className="fa-solid fa-circle-notch fa-spin text-brand text-3xl"></i></div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              className={`bg-surface border border-neutral p-6 md:p-8 flex gap-6 relative group transition-all duration-300 hover:shadow-xl ${!n.is_read ? 'border-l-4 border-l-accent' : ''}`}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-background flex items-center justify-center text-xl">
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`text-lg font-serif mb-1 ${!n.is_read ? 'text-primary font-bold' : 'text-primary/70 font-medium'}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                      <span>{formatDate(n.created_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral"></span>
                      <span>{formatTime(n.created_at)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-secondary hover:text-red-600 transition-all"
                    title="Eliminar"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
                <p className="text-sm text-secondary font-light leading-relaxed max-w-2xl">
                  {n.description}
                </p>
              </div>

              {!n.is_read && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-neutral">
            <i className="fa-regular fa-bell-slash text-4xl mb-4 text-neutral opacity-50"></i>
            <p className="font-serif italic text-secondary text-lg">No tienes notificaciones personales.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsHistory;