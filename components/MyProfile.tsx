
import React, { useState, useEffect, useRef } from 'react';
import JoditEditor from 'jodit-react';
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
  const [newPassword, setNewPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activityStats, setActivityStats] = useState({ blogsCount: 0, commentsCount: 0 });
  const editor = useRef(null);

  const joditConfig = {
    readonly: false,
    placeholder: 'Comparte tu pasión por los viajes y tu trayectoria...',
    buttons: ['bold', 'italic', 'underline', 'strikethrough', 'eraser', 'ul', 'ol', 'font', 'fontsize', 'paragraph', 'table', 'link', 'align', 'undo', 'redo'],
    height: 400
  };

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
            tipo: 'Associate',
            Branch: 'ROBLE',
            content: '',
            instagram: '',
            facebook: '',
            tik_tok: '',
            linkedIn: '',
            especialidades: ''
          });
        }

        // Fetch activity stats for "Tu Legado"
        const stats = await api.getUserActivityStats(user.id, user.name);
        setActivityStats(stats);
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
      let finalValue: any = value;
      if (name === 'birth_day' || name === 'birth_month') {
        finalValue = value ? parseInt(value) : undefined;
      }
      setAssociate({ ...associate, [name]: finalValue });
    }
  };

  const handleBioChange = (newContent: string) => {
    if (associate) {
      setAssociate({ ...associate, content: newContent });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !associate) return;

    setUploading(true);
    try {
      const publicUrl = await api.uploadAvatar(file, user.id);
      if (publicUrl) {
        setAssociate({ ...associate, image: publicUrl });
        if (profile) {
          setProfile({ ...profile, avatar_url: publicUrl });
        }
        setMessage({ type: 'success', text: 'Imagen subida correctamente' });
      } else {
        throw new Error("Error al subir la imagen");
      }
    } catch (err: any) {
      console.error("Error completo en la subida:", err);
      setMessage({ type: 'error', text: `Error: ${err.message || 'No se pudo subir la imagen. Verifica tu conexión o el formato del archivo.'}` });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
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

      // 3. Update Password
      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        console.log("Intentando actualizar contraseña...");
        const passResult = await api.updatePassword(newPassword);
        if (!passResult.success) {
          console.error("Error en passResult:", passResult.error);
          throw new Error("Error al actualizar contraseña: " + passResult.error);
        }
        console.log("Contraseña actualizada exitosamente");
        setNewPassword(''); // Clear field on success
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
      const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : 'Ocurrió un error al guardar');
      setMessage({ type: 'error', text: `Error: ${errorMsg}` });
    } finally {
      setSaving(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // --- CALCULO DE "TU LEGADO" ---
  const legacyScore = React.useMemo(() => {
    let score = 0;
    
    // 1. Completitud de Perfil (40% máx)
    if (associate) {
      if (associate.content && associate.content.replace(/<[^>]*>/g, '').length > 50) score += 15;
      if (associate.image) score += 10;
      if (associate.whatsapp) score += 3;
      if (associate.instagram) score += 3;
      if (associate.facebook) score += 3;
      if (associate.tik_tok) score += 3;
      if (associate.linkedIn) score += 3;
    }

    // 2. Actividad de Blog (30% máx: 3 pts por blog, max 10)
    const blogPoints = Math.min(activityStats.blogsCount * 3, 30);
    score += blogPoints;

    // 3. Engagement de Comunidad (20% máx: 0.4 pts por comentario, max 50)
    const commentPoints = Math.min(activityStats.commentsCount * 0.4, 20);
    score += commentPoints;

    // 4. Jerarquía / Nivel (10% máx)
    const levelMap: Record<string, number> = {
      'Partner': 10,
      'Senior': 7,
      'Junior': 4,
      'Associate': 2
    };
    score += levelMap[associate?.tipo || 'Associate'] || 0;

    return Math.round(score);
  }, [associate, activityStats]);

  const legacyRank = React.useMemo(() => {
    if (legacyScore >= 90) return { name: 'Embajador Legendario', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' };
    if (legacyScore >= 70) return { name: 'Nivel Elite', color: 'text-accent', bg: 'bg-accent/10' };
    if (legacyScore >= 40) return { name: 'Asociado Senior', color: 'text-brand', bg: 'bg-brand/10' };
    return { name: 'Asociado Promesa', color: 'text-secondary', bg: 'bg-secondary/10' };
  }, [legacyScore]);

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-mobile-x py-section-y flex flex-col items-center justify-center animate-fade-in">
        <i className="fa-solid fa-circle-notch fa-spin text-brand text-4xl mb-6"></i>
        <p className="text-secondary font-serif italic">Cargando tu información...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-fade-in relative pb-20">
      {/* Hero Header Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-brand">
          <div className="absolute inset-0 opacity-20 transition-opacity duration-1000">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
          
          <div className="max-w-site mx-auto px-mobile-x h-full relative flex flex-col justify-end pb-12">
              <button 
                onClick={onBack}
                className="absolute top-8 left-mobile-x flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[3px] bg-white/10 backdrop-blur-md px-4 py-2 hover:bg-white/20"
              >
                <i className="fa-solid fa-arrow-left"></i> Volver
              </button>
              
              <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8 translate-y-6">
                  <div className="relative group shrink-0">
                      <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative bg-white flex items-center justify-center">
                          <img 
                              src={associate?.image || profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user.name)}&background=random&color=fff&size=256`} 
                              alt="Profile" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user.name)}&background=random&color=fff&size=256`;
                              }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                              {uploading ? (
                                <i className="fa-solid fa-circle-notch fa-spin text-white text-2xl"></i>
                              ) : (
                                <>
                                  <i className="fa-solid fa-camera text-white text-2xl mb-2"></i>
                                  <span className="text-[10px] text-white font-bold uppercase">Cambiar Foto</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                              />
                          </div>
                      </div>
                      {associate?.tipo && (
                          <div className="absolute -bottom-3 -right-3 bg-accent text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl border-2 border-white">
                              {associate.tipo}
                          </div>
                      )}
                  </div>
                  
                  <div className="flex-1 pb-2">
                      <h1 className="text-3xl md:text-5xl font-serif text-white font-medium drop-shadow-md mb-2">
                          {profile?.name} {profile?.last_name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-light tracking-wide">
                          <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 uppercase text-[10px] font-bold tracking-widest border border-white/10">
                              <i className="fa-solid fa-briefcase text-accent"></i> {associate?.position || 'Agente de Viajes'}
                          </span>
                          <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 uppercase text-[10px] font-bold tracking-widest border border-white/10">
                              <i className="fa-solid fa-location-dot text-accent"></i> {associate?.Branch || 'Oficina Central'}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-site mx-auto px-mobile-x pt-16">
          {message && (
              <div className={`mb-10 p-5 border-l-4 shadow-sm animate-slide-down ${message.type === 'success' ? 'bg-white border-green-500 text-green-800' : 'bg-white border-red-500 text-red-800'}`}>
                  <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`fa-solid ${message.type === 'success' ? 'fa-check' : 'fa-exclamation'} text-sm`}></i>
                      </div>
                      <p className="text-sm font-semibold tracking-tight">{message.text}</p>
                  </div>
              </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Profile Card & Socials Sidebar */}
              <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
                  <div className="bg-white p-8 shadow-sm border border-neutral/50">
                      <div className="flex items-center justify-between mb-8 border-b border-neutral pb-4">
                        <h3 className="text-xs font-bold uppercase tracking-[3px] text-primary">Identidad Digital</h3>
                        <i className="fa-solid fa-id-card text-brand/20"></i>
                      </div>
                      
                      <div className="space-y-6">
                          <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Tu Imagen Maestra</label>
                              <div className="flex items-center gap-4">
                                <button 
                                  type="button" 
                                  className="relative flex-1 bg-brand text-white px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all overflow-hidden"
                                  disabled={uploading}
                                >
                                  {uploading ? 'Subiendo...' : 'Subir Nueva Foto'}
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                  />
                                </button>
                                {associate?.image && (
                                  <button 
                                    type="button"
                                    onClick={() => handleAssociateChange({ target: { name: 'image', value: '' } } as any)}
                                    className="px-4 py-3 border border-neutral text-red-500 hover:bg-red-50 transition-all"
                                    title="Quitar imagen"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                )}
                              </div>
                              <p className="text-[9px] text-secondary mt-3 italic opacity-60">Se sincroniza con el Directorio de Asociadas.</p>
                          </div>

                          <div className="pt-6 border-t border-neutral/50">
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-5">Conecta tus redes</label>
                              <div className="grid grid-cols-2 gap-4">
                                  {[
                                      { name: 'instagram', icon: 'fa-instagram', color: 'hover:text-pink-600', placeholder: 'Instagram' },
                                      { name: 'facebook', icon: 'fa-facebook-f', color: 'hover:text-blue-600', placeholder: 'Facebook' },
                                      { name: 'tik_tok', icon: 'fa-tiktok', color: 'hover:text-black', placeholder: 'TikTok' },
                                      { name: 'linkedIn', icon: 'fa-linkedin-in', color: 'hover:text-blue-700', placeholder: 'LinkedIn' }
                                  ].map((social) => (
                                      <div key={social.name} className="relative group">
                                          <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-brand transition-colors`}>
                                              <i className={`fa-brands ${social.icon}`}></i>
                                          </div>
                                          <input 
                                              type="text"
                                              name={social.name}
                                              value={(associate as any)?.[social.name] || ''}
                                              onChange={handleAssociateChange}
                                              placeholder={social.placeholder}
                                              className="w-full pl-9 pr-3 py-2.5 bg-neutral/20 border border-transparent focus:border-brand/30 focus:bg-white outline-none transition-all text-[10px] font-semibold"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-brand p-8 text-white shadow-xl relative overflow-hidden group">
                      <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                          <i className="fa-solid fa-compass text-9xl"></i>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-serif text-xl text-accent">Tu Legado</h4>
                          <div className={`px-2 py-0.5 ${legacyRank.bg} rounded text-[8px] font-bold uppercase tracking-tighter ${legacyRank.color} border border-current`}>
                            {legacyRank.name}
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-white/70 leading-relaxed font-light mb-6">
                            Tu puntuación de legado refleja tu impacto en la comunidad Traveliz.
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">Progreso</span>
                            <span className="text-xl font-serif text-white">{legacyScore}<span className="text-xs text-white/40">/100</span></span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent transition-all duration-1000 ease-out" 
                                style={{ width: `${legacyScore}%` }}
                              ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-sm font-serif text-accent">{activityStats.blogsCount}</div>
                                <div className="text-[7px] font-bold uppercase tracking-widest text-white/40">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-serif text-accent">{activityStats.commentsCount}</div>
                                <div className="text-[7px] font-bold uppercase tracking-widest text-white/40">Comentarios</div>
                            </div>
                        </div>
                      </div>
                  </div>
              </div>

              {/* Main Information Blocks */}
              <div className="lg:col-span-8 space-y-10">
                  <div className="bg-white p-8 md:p-12 shadow-sm border border-neutral/50">
                      <div className="flex items-center justify-between mb-10">
                          <div>
                              <h3 className="text-2xl font-serif text-primary font-medium">Información General</h3>
                              <p className="text-secondary text-xs font-light mt-1 uppercase tracking-widest">Tus datos personales básicos</p>
                          </div>
                          <div className="w-12 h-12 bg-background flex items-center justify-center text-brand border border-neutral">
                              <i className="fa-solid fa-user-gear"></i>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Nombre(s)</label>
                              <input 
                                  type="text"
                                  name="name"
                                  value={profile?.name || associate?.name || ''}
                                  onChange={(e) => { handleProfileChange(e); handleAssociateChange(e); }}
                                  className="w-full py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary"
                                  required
                                  placeholder="Tu nombre..."
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Apellidos</label>
                              <input 
                                  type="text"
                                  name="last_name"
                                  value={profile?.last_name || associate?.last_name || ''}
                                  onChange={(e) => { handleProfileChange(e); handleAssociateChange(e); }}
                                  className="w-full py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary"
                                  placeholder="Tus apellidos..."
                              />
                          </div>
                          <div className="space-y-2 opacity-60">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Email Corporativo</label>
                              <p className="py-2 border-b-2 border-transparent text-sm font-medium text-secondary">{profile?.email}</p>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">WhatsApp</label>
                              <div className="relative">
                                  <span className="absolute left-0 top-2 text-secondary font-bold text-sm">+</span>
                                  <input 
                                      type="text"
                                      name="whatsapp"
                                      value={associate?.whatsapp || ''}
                                      onChange={handleAssociateChange}
                                      placeholder="521..."
                                      className="w-full pl-4 py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary"
                                  />
                              </div>
                          </div>
                          <div className="md:col-span-2 grid grid-cols-2 gap-10">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Día de Cumpleaños</label>
                                  <select 
                                      name="birth_day"
                                      value={associate?.birth_day || ''}
                                      onChange={handleAssociateChange}
                                      className="w-full py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary cursor-pointer"
                                  >
                                      <option value="" className="text-secondary">Día</option>
                                      {Array.from({ length: 31 }, (_, i) => (
                                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Mes de Cumpleaños</label>
                                  <select 
                                      name="birth_month"
                                      value={associate?.birth_month || ''}
                                      onChange={handleAssociateChange}
                                      className="w-full py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary cursor-pointer"
                                  >
                                      <option value="" className="text-secondary">Mes</option>
                                      {[
                                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                                      ].map((month, index) => (
                                          <option key={index + 1} value={index + 1}>{month}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white p-8 md:p-12 shadow-sm border border-neutral/50">
                      <div className="flex items-center justify-between mb-10">
                          <div>
                              <h3 className="text-2xl font-serif text-primary font-medium">Acerca de Mi / Mi trayectoria</h3>
                              <p className="text-secondary text-xs font-light mt-1 uppercase tracking-widest">Tu carta de presentación</p>
                          </div>
                          <div className="w-12 h-12 bg-background flex items-center justify-center text-brand border border-neutral">
                              <i className="fa-solid fa-graduation-cap"></i>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Especialidades</label>
                              <input 
                                  type="text"
                                  name="especialidades"
                                  value={associate?.especialidades || ''}
                                  onChange={handleAssociateChange}
                                  placeholder="Cruceros, Lujo, Destinos Exóticos..."
                                  className="w-full px-4 py-3 bg-background border border-neutral focus:border-brand outline-none transition-all text-xs font-medium"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Cargo Actual</label>
                              <input 
                                  type="text"
                                  name="position"
                                  value={profile?.position || ''}
                                  onChange={(e) => { handleProfileChange(e); handleAssociateChange(e); }}
                                  className="w-full px-4 py-3 bg-background border border-neutral focus:border-brand outline-none transition-all text-xs font-medium"
                              />
                          </div>
                      </div>

                      <div className="space-y-3 rich-text-editor">
                          <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60 mb-2 block">Mi Trayectoria Profersional</label>
                          <JoditEditor
                            ref={editor}
                            value={associate?.content || ''}
                            config={joditConfig}
                            onBlur={handleBioChange}
                            onChange={() => {}}
                          />
                      </div>
                  </div>

                  <div className="bg-white p-8 md:p-12 shadow-sm border border-neutral/50">
                      <div className="flex items-center justify-between mb-10">
                          <div>
                              <h3 className="text-2xl font-serif text-primary font-medium">Configuración de Seguridad</h3>
                              <p className="text-secondary text-xs font-light mt-1 uppercase tracking-widest">Protección de acceso</p>
                          </div>
                      </div>
                      
                      <div className="max-w-md space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[2px] text-secondary/60">Actualizar Contraseña</label>
                          <div className="relative">
                              <input 
                                  type="password"
                                  name="newPassword"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Escriba nueva contraseña..."
                                  className="w-full py-2 border-b-2 border-neutral focus:border-brand bg-transparent outline-none transition-all text-sm font-medium text-primary pr-10"
                                  autoComplete="new-password"
                              />
                              <i className="fa-solid fa-lock absolute right-2 top-2.5 text-neutral"></i>
                          </div>
                          <p className="text-[9px] text-secondary/60 italic pt-2">Si no desea cambiarla, deje este espacio en blanco.</p>
                      </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-end gap-4 pt-10">
                      <button 
                          type="button"
                          onClick={onBack}
                          className="px-8 py-3 bg-neutral/10 text-primary hover:bg-neutral/20 text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                          Descartar Cambios
                      </button>
                      <button 
                          type="submit"
                          disabled={saving}
                          className="px-14 py-4 bg-brand text-white text-[10px] font-bold uppercase tracking-[2px] hover:bg-accent transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[220px]"
                      >
                          {saving ? (
                              <>
                                  <i className="fa-solid fa-circle-notch fa-spin"></i> Procesando...
                              </>
                          ) : (
                              'Actualizar Perfil Maestro'
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
