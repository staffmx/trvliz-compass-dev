import React, { useState, useEffect } from 'react';
import { api, Seller } from '../services/api';

interface HeaderProps {
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({ title, subtitle, actionLabel, onAction }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-neutral pb-6">
        <div>
            <h2 className="text-2xl font-serif text-primary">{title}</h2>
            <p className="text-secondary text-sm font-light">{subtitle}</p>
        </div>
        {actionLabel && onAction && (
            <button 
                onClick={onAction}
                className="px-6 py-3 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

/* --- SUB-COMPONENT: SELLERS MANAGEMENT --- */
const AdminSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: Partial<Seller> = { 
    name: '', 
    avatar: '', 
    ranking: 1 
  };
  const [formData, setFormData] = useState<Partial<Seller>>(emptyForm);

  useEffect(() => { loadSellers(); }, []);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const data = await api.getTopSellers();
      setSellers(data || []);
    } catch (err) {
      console.error("Admin Sellers Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seller: Seller) => {
    setEditingId(seller.id || null);
    setFormData({ ...seller });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar a este vendedor del ranking?')) return;
    try {
      const success = await api.deleteSeller(id);
      if (success) {
        loadSellers();
      } else {
        alert('No se pudo eliminar el vendedor. Verifica la consola para más detalles o revisa tu conexión.');
      }
    } catch (err) {
      console.error(err);
      alert('Error crítico al eliminar vendedor.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.upsertSeller(formData);
      setIsFormOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      loadSellers();
    } catch (err) {
      console.error(err);
      alert('Error al guardar vendedor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <AdminHeader 
        title="Top Producers" 
        subtitle="Administra el ranking de ventas visible en el Dashboard." 
        actionLabel={isFormOpen ? "Cancelar" : "Nuevo Vendedor"} 
        onAction={() => { setIsFormOpen(!isFormOpen); setEditingId(null); setFormData(emptyForm); }} 
      />

      {isFormOpen && (
        <div className="mb-12 bg-white border border-accent/20 p-10 shadow-2xl animate-slide-down">
          <h3 className="font-serif text-2xl text-primary mb-6">{editingId ? 'Editar Vendedor' : 'Agregar Vendedor al Ranking'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Nombre Completo</label>
                <input 
                    type="text" 
                    required 
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">URL Avatar (Foto)</label>
                <input 
                    type="url" 
                    required 
                    placeholder="https://..."
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Posición en Ranking (Número)</label>
                <input 
                    type="number" 
                    min="1"
                    required 
                    className="w-full p-4 border border-neutral text-sm bg-[#F9FAFB] focus:border-accent outline-none" 
                    value={formData.ranking}
                    onChange={(e) => setFormData({...formData, ranking: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <button type="submit" className="bg-brand text-white px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl">
              {saving ? 'Guardando...' : 'Guardar Productor'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F5F6F8] border-b border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary">
            <tr>
              <th className="px-8 py-5">Ranking</th>
              <th className="px-8 py-5">Vendedor</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-background/30">
                <td className="px-8 py-6">
                  <span className={`text-xl font-serif font-bold ${seller.ranking === 1 ? 'text-accent' : 'text-secondary'}`}>#{seller.ranking}</span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover border border-neutral" />
                      <p className="font-bold text-primary">{seller.name}</p>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => handleEdit(seller)} className="text-secondary hover:text-brand px-3"><i className="fa-solid fa-pen"></i></button>
                   <button onClick={() => seller.id && handleDelete(seller.id)} className="text-secondary hover:text-red-600 px-3"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
    return (
        <div className="max-w-site mx-auto px-mobile-x py-section-y">
            <div className="mb-12">
                <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
                    Panel de Control
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
                    Administración
                </h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation (Mock) */}
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full text-left px-5 py-3 bg-brand text-white font-bold text-xs uppercase tracking-widest">
                        Top Producers
                    </button>
                    <button className="w-full text-left px-5 py-3 bg-white border border-neutral hover:bg-neutral text-secondary font-bold text-xs uppercase tracking-widest transition-colors">
                        Avisos
                    </button>
                    <button className="w-full text-left px-5 py-3 bg-white border border-neutral hover:bg-neutral text-secondary font-bold text-xs uppercase tracking-widest transition-colors">
                        Usuarios
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AdminSellers />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
