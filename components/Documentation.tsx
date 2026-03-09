import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { User, DocumentCategory, Document as DocType } from '../types';

interface DocumentationProps {
  user: User;
}

const Documentation: React.FC<DocumentationProps> = ({ user }) => {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<DocumentCategory | null>(null);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.role === 'admin';

  // Initial Fetch
  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch Documents when category changes
  useEffect(() => {
    if (currentCategory) {
      loadDocuments(currentCategory.id);
    }
  }, [currentCategory]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getDocumentCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      if (!currentCategory) setLoading(false);
    }
  };

  const loadDocuments = async (catId?: number) => {
    setLoading(true);
    try {
      let data: DocType[] = [];
      if (catId !== undefined) {
        data = await api.getDocumentsByCategory(catId);
      } else {
        // Si no hay categoría, intentamos traer todos para ver si existen
        const { data: allDocs, error } = await api.getAllDocuments();
        if (!error) data = allDocs;
      }
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const getBreadcrumbs = () => {
    const crumbs: DocumentCategory[] = [];
    let temp = currentCategory;
    while (temp) {
      crumbs.unshift(temp);
      const parent = categories.find(c => c.id === temp?.parent_id);
      temp = parent || null;
    }
    return crumbs;
  };

  const getFileIcon = (ext: string) => {
    const e = ext.toLowerCase();
    if (['pdf'].includes(e)) return 'fa-file-pdf text-red-500';
    if (['doc', 'docx'].includes(e)) return 'fa-file-word text-blue-500';
    if (['xls', 'xlsx', 'csv'].includes(e)) return 'fa-file-excel text-green-500';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(e)) return 'fa-file-image text-purple-500';
    if (['mp4', 'mov', 'avi'].includes(e)) return 'fa-file-video text-pink-500';
    return 'fa-file text-gray-400';
  };

  const handleCategoryClick = (cat: DocumentCategory) => {
    setCurrentCategory(cat);
    setSearchTerm(''); 
  };

  const handleBackToInicio = () => {
    setCurrentCategory(null);
    setSearchTerm('');
  };

  const handleCreateCategory = async () => {
    if (!isAdmin) return;
    const name = prompt("Nombre de la nueva categoría (folder):");
    if (name && name.trim()) {
        const parentId = currentCategory ? currentCategory.id : 0;
        const newCat = await api.createCategory(name, parentId);
        if (newCat) loadCategories();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin || !currentCategory) return;
    if (e.target.files && e.target.files[0]) {
        setIsUploading(true);
        const file = e.target.files[0];
        const description = prompt("Descripción del archivo (opcional):") || "";
        await api.uploadDocument(file, currentCategory.id, description);
        setIsUploading(false);
        loadDocuments(currentCategory.id);
        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (doc: DocType) => {
    if (!isAdmin) return;
    if (confirm(`¿Estás seguro de que deseas eliminar "${doc.name}"?`)) {
        await api.deleteDocument(doc.id, doc.storage_path);
        if (currentCategory) loadDocuments(currentCategory.id);
    }
  };

  const handleDeleteCategory = async (e: React.MouseEvent, cat: DocumentCategory) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${cat.name}"? Esto no eliminará los archivos del storage pero sí su referencia en la base de datos.`)) {
        await api.deleteCategory(cat.id);
        loadCategories();
    }
  };

  // --- Filtering Logic ---
  const filteredDocs = documents.filter(doc => {
     if (searchTerm.trim()) {
         return doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
     }
     return true;
  });

  const filteredCategories = categories.filter(cat => {
    if (searchTerm.trim()) {
        // If searching, show all matching categories regardless of parent
        return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (currentCategory) {
        return cat.parent_id === currentCategory.id;
    } else {
        return !cat.parent_id || cat.parent_id === 0;
    }
  });

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
                Recursos Corporativos
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
                Documentación
            </h1>
        </div>
        
        {/* Actions & Search */}
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
             <div className="relative w-full md:w-64">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral rounded-none focus:border-accent outline-none transition-colors text-sm"
                />
                <span className="absolute left-4 top-3.5 text-secondary">
                    <i className="fa-solid fa-search"></i>
                </span>
            </div>
            
            {isAdmin && (
                <div className="flex gap-2 w-full md:w-auto">
                    {!currentCategory ? (
                        <button 
                            onClick={handleCreateCategory}
                            className="flex-1 md:flex-none px-4 py-3 bg-white border border-brand text-brand text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-folder-plus mr-2"></i> Nueva Categoría
                        </button>
                    ) : (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex-1 md:flex-none px-4 py-3 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-md disabled:opacity-50"
                        >
                            {isUploading ? (
                                <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Subiendo...</>
                            ) : (
                                <><i className="fa-solid fa-cloud-arrow-up mr-2"></i> Subir Documento</>
                            )}
                        </button>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload} 
                    />
                </div>
            )}
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-sm overflow-x-auto pb-2 border-b border-neutral/50">
        <button 
            onClick={handleBackToInicio}
            className={`uppercase tracking-wider font-bold text-[10px] whitespace-nowrap px-2 py-1 rounded-sm hover:bg-neutral/50 transition-colors ${!currentCategory ? 'text-brand cursor-default' : 'text-secondary hover:text-accent'}`}
        >
            Inicio
        </button>
        {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.id}>
                <span className="text-gray-300 text-[10px]"><i className="fa-solid fa-chevron-right"></i></span>
                <button 
                    onClick={() => handleCategoryClick(crumb)}
                    disabled={index === getBreadcrumbs().length - 1}
                    className={`uppercase tracking-wider font-bold text-[10px] whitespace-nowrap px-2 py-1 rounded-sm transition-colors ${index === getBreadcrumbs().length - 1 ? 'text-brand cursor-default' : 'text-secondary hover:text-accent hover:bg-neutral/50'}`}
                >
                    {crumb.name}
                </button>
            </React.Fragment>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-surface border border-neutral shadow-sm min-h-[500px]">
        
        {loading ? (
             <div className="p-20 text-center">
                 <i className="fa-solid fa-circle-notch fa-spin text-brand text-3xl"></i>
             </div>
        ) : (
            <>
                {/* Categories Grid (Folders) */}
                {!currentCategory && (
                    <div className="p-8 border-b border-neutral/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Carpetas / Categorías</h3>
                            {!loading && categories.length === 0 && (
                                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                                    <i className="fa-solid fa-circle-info mr-1"></i> No hay categorías creadas
                                </span>
                            )}
                        </div>
                        {filteredCategories.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {filteredCategories.map(cat => (
                                    <div key={cat.id} className="relative group">
                                        <button 
                                            onClick={() => handleCategoryClick(cat)}
                                            className="w-full flex items-center gap-4 p-5 bg-white border border-neutral hover:border-accent hover:shadow-lg transition-all duration-300 text-left"
                                        >
                                            <div className="w-10 h-10 bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                                <i className="fa-solid fa-folder text-lg"></i>
                                            </div>
                                            <div className="truncate">
                                                <p className="font-serif font-medium text-primary text-base leading-tight group-hover:text-brand truncate">{cat.name}</p>
                                                <p className="text-[9px] text-secondary mt-1">Recursos corporativos</p>
                                            </div>
                                        </button>
                                        {isAdmin && (
                                            <button 
                                                onClick={(e) => handleDeleteCategory(e, cat)}
                                                className="absolute top-2 right-2 text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-secondary border border-dashed border-neutral">
                                <p className="font-serif italic text-sm">Organiza tus archivos creando categorías.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Documents List */}
                {currentCategory && (
                    <div className="p-0">
                        <div className="p-8 border-b border-neutral bg-[#FBFBFB] flex justify-between items-center">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                                Archivos en <span className="text-brand">{currentCategory.name}</span>
                            </h3>
                            <button 
                                onClick={handleBackToInicio}
                                className="text-[10px] font-bold text-brand hover:underline uppercase tracking-widest"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i> Volver al inicio
                            </button>
                        </div>

                    {filteredDocs.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-neutral">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary w-1/4">Nombre</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Tipo</th>
                                    <th className="hidden md:table-cell px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Descripción</th>
                                    <th className="hidden md:table-cell px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Fecha</th>
                                    <th className="hidden md:table-cell px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Tamaño</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral">
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id} className="hover:bg-background/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <i className={`fa-solid ${getFileIcon(doc.type)} text-xl w-6 text-center`}></i>
                                                <span className="font-medium text-primary text-sm group-hover:text-brand transition-colors truncate max-w-[200px] md:max-w-none block">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-neutral/30 text-secondary rounded-sm">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary italic">
                                            {doc.description || 'Sin descripción'}
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary">{doc.created_at}</td>
                                        <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary font-mono">{doc.size}</td>
                                        <td className="px-8 py-4 text-right flex justify-end gap-2">
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-brand hover:text-accent transition-colors px-3 py-2 bg-brand/5 hover:bg-brand/10 rounded-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" 
                                                title="Abrir en nueva ventana"
                                            >
                                                <i className="fa-solid fa-external-link"></i> Ver
                                            </a>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDeleteDoc(doc)}
                                                    className="text-secondary hover:text-red-500 transition-colors px-2 py-1" 
                                                    title="Eliminar"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center text-secondary">
                            <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-30"></i>
                            <p className="font-serif italic">No se encontraron archivos en esta vista.</p>
                            {isAdmin && currentCategory && (
                                <div className="mt-4">
                                    <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-brand hover:underline">Subir el primer documento a esta categoría</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    )}
    </div>
    </div>
  );
};

export default Documentation;
