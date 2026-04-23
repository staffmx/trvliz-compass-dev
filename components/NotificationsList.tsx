
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, NotificationInbox } from '../types';

interface NotificationsListProps {
  user: User;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<NotificationInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, [user.id]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const success = await api.markNotificationAsRead(id);
    if (success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => api.markNotificationAsRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.is_read);

  return (
    <div className="max-w-4xl mx-auto px-mobile-x py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-neutral pb-8">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-[4px] mb-2 block">Buzón Personal</span>
          <h1 className="text-4xl font-serif text-primary">Mis Notificaciones</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              No Leídas
            </button>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent underline underline-offset-4"
          >
            Marcar todo como leído
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 animate-pulse border border-neutral"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 border border-dashed border-neutral text-secondary font-serif italic">
            No tienes notificaciones {filter === 'unread' ? 'pendientes' : 'en tu historial'}.
          </div>
        ) : (
          filtered.map((item) => (
            <div 
              key={item.id}
              className={`group relative p-8 border transition-all ${!item.is_read ? 'bg-white border-brand shadow-md ring-1 ring-brand/10' : 'bg-gray-50/50 border-neutral opacity-80'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!item.is_read && <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>}
                    <h3 className={`text-lg font-serif ${!item.is_read ? 'text-primary' : 'text-secondary'}`}>
                      {item.notification?.title}
                    </h3>
                  </div>
                  <p className="text-secondary text-sm font-light leading-relaxed mb-4">
                    {item.notification?.content}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-neutral uppercase tracking-widest">
                    <span><i className="fa-regular fa-clock mr-2"></i>{new Date(item.created_at).toLocaleString('es-ES')}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  {!item.is_read && (
                    <button 
                      onClick={() => markAsRead(item.id)}
                      className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 border border-brand text-brand hover:bg-brand hover:text-white transition-all"
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
