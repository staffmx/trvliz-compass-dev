import React, { useState, useEffect, useRef } from 'react';
import { api, DocItem, FileType } from '../services/api';
import { User } from '../types';

interface DocumentationProps {
  user: User;
}

const Documentation: React.FC<DocumentationProps> = ({ user }) => {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<{id: number | null, name: string}[]>([{ id: null, name: 'Inicio' }]);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.role === 'admin';

  // Fetch Data
  useEffect(() => {
    loadDocuments();
  }, [currentFolderId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments(currentFolderId);
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return 'fa-folder text-brand';
      case 'pdf': return 'fa-file-pdf text-red-500';
      case 'doc': return 'fa-file-word text-blue-500';
      case 'xls': return 'fa-file-excel text-green-500';
      case 'img': return 'fa-file-image text-purple-500';
      case 'video': return 'fa-file-video text-pink-500';
      default: return 'fa-file text-gray-400';
    }
  };

  const handleFolderClick = (folder: DocItem) => {
    setCurrentFolderId(folder.id);
    setHistory([...history, { id: folder.id, name: folder.name }]);
    setSearchTerm(''); 
  };

  const handleBreadcrumbClick = (index: number) => {
    const newHistory = history.slice(0, index + 1);
    setHistory(newHistory);
    setCurrentFolderId(newHistory[newHistory.length - 1].id);
  };

  const handleCreateFolder = async () => {
    if (!isAdmin) return;
    const name = prompt("Nombre de la nueva carpeta:");
    if (name && name.trim()) {
        const newFolder = await api.createFolder(name, currentFolderId);
        if (newFolder) loadDocuments();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    if (e.target.files && e.target.files[0]) {
        setIsUploading(true);
        const file = e.target.files[0];
        await api.uploadFile(file, currentFolderId);
        setIsUploading(false);
        loadDocuments();
        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (doc: DocItem) => {
    if (!isAdmin) return;
    if (confirm(`¿Estás seguro de que deseas eliminar "${doc.name}"?`)) {
        await api.deleteDocument(doc);
        loadDocuments();
    }
  };

  // --- Filtering Logic ---
  const filteredItems = documents.filter(doc => {
     if (searchTerm.trim()) {
         return doc.name.toLowerCase().includes(searchTerm.toLowerCase());
     }
     return true;
  });

  const folders = filteredItems.filter(item => item.type === 'folder');
  const files = filteredItems.filter(item => item.type !== 'folder');

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
                    placeholder="Buscar archivo..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral rounded-none focus:border-accent outline-none transition-colors text-sm"
                />
                <span className="absolute left-4 top-3.5 text-secondary">
                    <i className="fa-solid fa-search"></i>
                </span>
            </div>
            
            {isAdmin && (
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={handleCreateFolder}
                        className="flex-1 md:flex-none px-4 py-3 bg-white border border-brand text-brand text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-folder-plus mr-2"></i> Carpeta
                    </button>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1 md:flex-none px-4 py-3 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-md disabled:opacity-50"
                    >
                        {isUploading ? (
                            <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Subiendo...</>
                        ) : (
                            <><i className="fa-solid fa-cloud-arrow-up mr-2"></i> Subir</>
                        )}
                    </button>
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
        {history.map((item, index) => (
          <React.Fragment key={item.id || 'root'}>
            <button 
                onClick={() => handleBreadcrumbClick(index)}
                className={`uppercase tracking-wider font-bold text-[10px] whitespace-nowrap px-2 py-1 rounded-sm hover:bg-neutral/50 transition-colors ${index === history.length - 1 ? 'text-brand cursor-default' : 'text-secondary hover:text-accent'}`}
            >
                {item.name}
            </button>
            {index < history.length - 1 && (
                <span className="text-gray-300 text-[10px]"><i className="fa-solid fa-chevron-right"></i></span>
            )}
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
                {/* Folders Grid */}
                {folders.length > 0 && (
                    <div className="p-8 border-b border-neutral bg-[#FBFBFB]">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6">Carpetas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {folders.map(folder => (
                                <div key={folder.id} className="relative group">
                                    <button 
                                        onClick={() => handleFolderClick(folder)}
                                        className="w-full flex items-center gap-4 p-5 bg-white border border-neutral hover:border-accent hover:shadow-lg transition-all duration-300 text-left"
                                    >
                                        <div className="w-10 h-10 bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                            <i className="fa-solid fa-folder text-lg"></i>
                                        </div>
                                        <div className="truncate">
                                            <p className="font-serif font-medium text-primary text-base leading-tight group-hover:text-brand truncate">{folder.name}</p>
                                            <p className="text-[9px] text-secondary mt-1">{folder.created_at}</p>
                                        </div>
                                    </button>
                                    {isAdmin && (
                                        <button 
                                            onClick={() => handleDelete(folder)}
                                            className="absolute top-2 right-2 text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Files List */}
                <div className="p-0">
                    {!searchTerm && folders.length > 0 && files.length > 0 && (
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary px-8 pt-8 mb-2">Archivos</h3>
                    )}

                    {files.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-neutral">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary w-1/2">Nombre</th>
                                    <th className="hidden md:table-cell px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Fecha</th>
                                    <th className="hidden md:table-cell px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Tamaño</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral">
                                {files.map(file => (
                                    <tr key={file.id} className="hover:bg-background/50 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <i className={`fa-solid ${getFileIcon(file.type)} text-xl w-6 text-center`}></i>
                                                <span className="font-medium text-primary text-sm group-hover:text-brand transition-colors truncate max-w-[200px] md:max-w-none block">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary">{file.created_at}</td>
                                        <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary font-mono">{file.size}</td>
                                        <td className="px-8 py-4 text-right flex justify-end gap-2">
                                            <a 
                                                href={file.url} 
                                                target="_blank" 
                                                download={file.name}
                                                className="text-secondary hover:text-accent transition-colors px-2 py-1" 
                                                title="Descargar"
                                            >
                                                <i className="fa-solid fa-download"></i>
                                            </a>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDelete(file)}
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
                        !folders.length && (
                            <div className="py-20 text-center text-secondary">
                                <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-30"></i>
                                <p className="font-serif italic">Esta carpeta está vacía.</p>
                                {isAdmin && (
                                    <div className="mt-4 flex gap-4 justify-center">
                                        <button onClick={handleCreateFolder} className="text-xs font-bold text-brand hover:underline">Crear Carpeta</button>
                                        <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-brand hover:underline">Subir Archivo</button>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Documentation;