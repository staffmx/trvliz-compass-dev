import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notice } from '../types';

const NoticesList: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await api.getNotices();
        // Ordenar por fecha (asumiendo formato DD de MMM, YYYY o similar, 
        // pero la API ya devuelve por created_at desc. Reforzamos aquí si es necesario)
        setNotices(data);
      } catch (error) {
        console.error("Error al cargar avisos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-mobile-x py-section-y animate-fade-in">
      <div className="text-center mb-16">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">Comunicaciones Internas</span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">Avisos e Información</h1>
        <p className="text-secondary text-sm mt-4 font-light italic">Mantente al día con las últimas actualizaciones de Traveliz.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white border border-neutral animate-pulse"></div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-neutral">
          <i className="fa-solid fa-box-open text-neutral text-4xl mb-4"></i>
          <p className="text-secondary font-serif">No hay avisos publicados en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div 
              key={notice.id} 
              className={`bg-white border transition-all duration-300 ${
                expandedId === notice.id ? 'border-accent shadow-lg' : 'border-neutral hover:border-brand/30'
              }`}
            >
              {/* Accordion Header */}
              <button 
                onClick={() => toggleAccordion(notice.id)}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between group"
              >
                <div className="flex items-center gap-6 overflow-hidden">
                  <div className="hidden md:block text-center min-w-[80px] border-r border-neutral pr-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{notice.date.split(' de ')[2] || '2026'}</p>
                    <p className="text-sm font-serif font-bold text-brand">{notice.date.split(' de ')[0]} {notice.date.split(' de ')[1]?.substring(0,3)}</p>
                  </div>
                  
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        notice.priority === 'high' ? 'bg-red-500 animate-pulse' : 
                        notice.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                      }`}></span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{notice.category}</span>
                    </div>
                    <h3 className={`text-lg md:text-xl font-serif font-medium transition-colors ${
                      expandedId === notice.id ? 'text-brand' : 'text-primary group-hover:text-brand'
                    }`}>
                      {notice.title}
                    </h3>
                  </div>
                </div>

                <div className={`ml-4 w-8 h-8 rounded-full border border-neutral flex items-center justify-center transition-transform duration-300 ${
                  expandedId === notice.id ? 'rotate-180 bg-brand border-brand text-white' : 'text-secondary group-hover:border-brand group-hover:text-brand'
                }`}>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </button>

              {/* Accordion Content */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedId === notice.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 md:px-20 pb-10 pt-2 border-t border-neutral/50">
                  <div className="prose prose-sm max-w-none text-primary leading-luxury font-light">
                    {notice.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                  
                  {notice.priority === 'high' && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 flex items-start gap-3">
                      <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-800">Este es un aviso de alta prioridad. Por favor, confirma su recepción con tu supervisor.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticesList;