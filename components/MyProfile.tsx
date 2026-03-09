
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserProfile, Associate } from '../types';

interface MyProfileProps {
  user: User;
  onBack: () => void;
  onUserUpdate: (user: User) => void;
}

const MyProfile: React.FC<MyProfileProps> = ({ user, onBack, onUserUpdate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const users = await api.getUsers();
        const currentUserProfile = users.find(u => u.id === user.id);
        if (currentUserProfile) {
          setProfile(currentUserProfile);
        }

        // Fetch associate data linked by user_id
        const associateData = await api.getAssociateByUserId(user.id);
        if (associateData) {
          setAssociate(associateData);
        } else {
          // Initialize empty associate data if not found
          setAssociate({
            user_id: user.id,
            name: user.name.split(' ')[0] || '',
            last_name: user.name.split(' ').slice(1).join(' ') || '',
            email: user.email,
            image: user.avatar || '',
            whatsapp: '',
            position: '',
            associate_type: 'Travel Consultant',
            content: '',
            instagram: '',
            facebook: '',
            tiktok: ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleAssociateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (associate) {
      setAssociate({ ...associate, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // 1. Update Profile
      if (profile) {
        const profileSuccess = await api.updateProfile(profile);
        if (!profileSuccess) throw new Error("Error al actualizar el perfil");
      }

      // 2. Update Associate
      if (associate) {
        const updatedAssociate = await api.upsertAssociate(associate);
        if (!updatedAssociate) throw new Error("Error al actualizar la información de asociada");
        setAssociate(updatedAssociate);
      }

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      
      // Update local storage and app state if name or avatar changed
      if (profile) {
        const updatedUser = {
          ...user,
          name: `${profile.name} ${profile.last_name || ''}`.trim(),
          avatar: profile.avatar_url
        };
        localStorage.setItem('traveliz_user', JSON.stringify(updatedUser));
        onUserUpdate(updatedUser);
      }

    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({ type: 'error', text: error.message || 'Ocurrió un error al guardar' });
    } finally {
      setSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y flex flex-col items-center justify-center animate-fade-in">
        <i className="fa-solid fa-circle-notch fa-spin text-brand text-4xl mb-6"></i>
        <p className="text-secondary font-serif italic">Cargando tu información...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-site mx-auto px-mobile-x pt-12 pb-section-y">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-brand transition-colors text-[10px] font-bold uppercase tracking-[3px] mb-12"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver al Inicio
        </button>

        <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
                <span className="h-[1px] w-12 bg-accent"></span>
                <span className="text-[10px] font-bold uppercase tracking-[4px] text-accent">Gestión de Cuenta</span>
            </div>
            <h1 className="text-5xl font-serif text-primary font-medium leading-tight">
                Mi Perfil
            </h1>
            <p className="text-secondary mt-4 max-w-2xl font-light">
                Administra tu información personal y profesional. Los cambios realizados aquí se verán reflejados en el directorio de asociadas y en tu perfil público dentro de Compass.
            </p>
        </div>

        {message && (
            <div className={`mb-8 p-4 border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-slide-down`}>
                <div className="flex items-center gap-3">
                    <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Basic Info & Avatar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white border border-neutral p-8 shadow-sm">
                    <h3 className="text-lg font-serif text-primary mb-6 border-b border-neutral pb-4">Foto de Perfil</h3>
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full overflow-hidden mb-6 ring-4 ring-background shadow-inner">
                            <img 
                                src={associate?.image || profile?.avatar_url || 'https://via.placeholder.com/200'} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">URL de Imagen</label>
                                <input 
                                    type="text"
                                    name="image"
                                    value={associate?.image || ''}
                                    onChange={handleAssociateChange}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 italic">Se recomienda una imagen cuadrada de alta resolución.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral p-8 shadow-sm">
                    <h3 className="text-lg font-serif text-primary mb-6 border-b border-neutral pb-4">Redes Sociales</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Instagram (URL)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-secondary"><i className="fa-brands fa-instagram"></i></span>
                                <input 
                                    type="text"
                                    name="instagram"
                                    value={associate?.instagram || ''}
                                    onChange={handleAssociateChange}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Facebook (URL)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-secondary"><i className="fa-brands fa-facebook-f"></i></span>
                                <input 
                                    type="text"
                                    name="facebook"
                                    value={associate?.facebook || ''}
                                    onChange={handleAssociateChange}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">TikTok (URL)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-secondary"><i className="fa-brands fa-tiktok"></i></span>
                                <input 
                                    type="text"
                                    name="tiktok"
                                    value={associate?.tiktok || ''}
                                    onChange={handleAssociateChange}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white border border-neutral p-8 shadow-sm">
                    <h3 className="text-lg font-serif text-primary mb-6 border-b border-neutral pb-4">Información Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Nombre(s)</label>
                            <input 
                                type="text"
                                name="name"
                                value={profile?.name || ''}
                                onChange={(e) => {
                                    handleProfileChange(e);
                                    handleAssociateChange(e);
                                }}
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Apellidos</label>
                            <input 
                                type="text"
                                name="last_name"
                                value={profile?.last_name || ''}
                                onChange={(e) => {
                                    handleProfileChange(e);
                                    handleAssociateChange(e);
                                }}
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Email Corporativo</label>
                            <input 
                                type="email"
                                value={profile?.email || ''}
                                className="w-full px-4 py-2 bg-gray-50 border border-neutral text-sm text-gray-500 outline-none cursor-not-allowed"
                                disabled
                            />
                            <p className="text-[9px] text-gray-400 mt-1 italic">El email no puede ser modificado.</p>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">WhatsApp (con código de país)</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                value={associate?.whatsapp || ''}
                                onChange={handleAssociateChange}
                                placeholder="521234567890"
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral p-8 shadow-sm">
                    <h3 className="text-lg font-serif text-primary mb-6 border-b border-neutral pb-4">Información Profesional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Cargo / Título</label>
                            <input 
                                type="text"
                                name="position"
                                value={profile?.position || ''}
                                onChange={(e) => {
                                    handleProfileChange(e);
                                    handleAssociateChange(e);
                                }}
                                placeholder="Agente de Viajes Senior"
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Tipo de Asociada</label>
                            <select 
                                name="associate_type"
                                value={associate?.associate_type || ''}
                                onChange={handleAssociateChange}
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all appearance-none"
                            >
                                <option value="Travel Consultant">Travel Consultant</option>
                                <option value="Elite Agent">Elite Agent</option>
                                <option value="Partner">Partner</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Sucursal</label>
                            <select 
                                name="branch"
                                value={associate?.branch || ''}
                                onChange={handleAssociateChange}
                                className="w-full px-4 py-2 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all appearance-none"
                            >
                                <option value="">Seleccionar Sucursal</option>
                                <option value="ROBLE">ROBLE</option>
                                <option value="BAJA">BAJA</option>
                                <option value="CDMX">CDMX</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Biografía Profesional / Trayectoria</label>
                        <textarea 
                            name="content"
                            value={associate?.content || ''}
                            onChange={handleAssociateChange}
                            rows={8}
                            placeholder="Cuéntanos sobre tu experiencia en el mundo del turismo..."
                            className="w-full px-4 py-3 bg-background border border-neutral text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-none leading-relaxed"
                        ></textarea>
                        <p className="text-[10px] text-gray-400 mt-2 italic">Esta biografía aparecerá en tu perfil público del directorio.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        type="button"
                        onClick={onBack}
                        className="px-8 py-3 border border-neutral text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-background transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="px-12 py-3 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...
                            </>
                        ) : (
                            'Guardar Cambios'
                        )}
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
