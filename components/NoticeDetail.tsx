import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notice, User } from '../types';

interface NoticeDetailProps {
  noticeId: string;
  user: User;
  onBack: () => void;
}

const NoticeDetail: React.FC<NoticeDetailProps> = ({ noticeId, user, onBack }) => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const [data, myAssociate] = await Promise.all([
          api.getNoticeById(noticeId),
          api.getAssociateByUserId(user.id)
        ]);
        
        if (data) {
          if (data.recipient_ids && data.recipient_ids.trim() !== '') {
            if (!myAssociate) {
              setIsAllowed(false);
            } else {
              const ids = data.recipient_ids.split(',').map(id => id.trim());
              if (!ids.includes(myAssociate.id?.toString() || '')) {
                setIsAllowed(false);
              }
            }
          }
        }
        
        setNotice(data);
      } catch (error) {
        console.error("Error fetching notice:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [noticeId, user.id]);

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y flex flex-col items-center justify-center animate-fade-in">
        <i className="fa-solid fa-circle-notch fa-spin text-brand text-4xl mb-6"></i>
        <p className="text-secondary font-serif italic">Cargando aviso...</p>
      </div>
    );
  }

  if (!notice || !isAllowed) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y text-center animate-fade-in">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-neutral mb-6"></i>
        <h2 className="text-3xl font-serif text-primary mb-4">
          {!notice ? "Aviso no encontrado" : "No tienes permiso para ver este aviso"}
        </h2>
        <button onClick={onBack} className="text-brand font-bold uppercase tracking-widest text-xs hover:text-accent transition-colors">
          Volver a Avisos
        </button>
      </div>
    );
  }

  // Styles based on priority
  const priorityColor = 
    notice.priority === 'high' ? 'text-red-600 bg-red-50 border-red-100' : 
    notice.priority === 'medium' ? 'text-orange-600 bg-orange-50 border-orange-100' : 
    'text-brand bg-blue-50 border-blue-100';

  const icon = 
    notice.priority === 'high' ? 'fa-circle-exclamation' : 
    notice.category === 'Capacitación' ? 'fa-graduation-cap' : 
    'fa-circle-info';

  return (
    <div className="animate-fade-in">
        {/* Simple Header */}
        <div className="bg-primary text-white py-16">
            <div className="max-w-site mx-auto px-mobile-x">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-[3px] mb-8"
                >
                    <i className="fa-solid fa-arrow-left"></i> Volver
                </button>
                <div className="flex flex-col gap-4">
                     <span className={`self-start px-3 py-1 text-[9px] font-bold uppercase tracking-widest border ${priorityColor} rounded-sm`}>
                         {notice.category}
                     </span>
                     <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight max-w-4xl">
                        {notice.title}
                     </h1>
                     <div className="flex items-center gap-3 text-white/50 text-xs">
                        <i className="fa-regular fa-calendar"></i>
                        <span>Publicado el: {notice.date}</span>
                     </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-mobile-x py-16">
            <div className="bg-surface border border-neutral p-10 md:p-14 shadow-sm">
                 <div className="prose prose-lg max-w-none text-primary leading-luxury font-light">
                    {/* Render newlines properly */}
                    {notice.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6 last:mb-0">{paragraph}</p>
                    ))}
                 </div>

                 {notice.priority === 'high' && (
                    <div className="mt-12 p-6 bg-red-50 border-l-4 border-red-500 flex items-start gap-4">
                        <i className="fa-solid fa-triangle-exclamation text-red-500 mt-1"></i>
                        <div>
                            <h4 className="text-red-800 font-bold text-sm uppercase tracking-wider mb-1">Aviso Importante</h4>
                            <p className="text-red-700 text-xs">Por favor asegúrate de haber leído y comprendido la información anterior. Si tienes dudas, contacta a tu supervisor inmediato.</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default NoticeDetail;