import React, { useState, useMemo } from 'react';

// --- Types ---
type FileType = 'folder' | 'pdf' | 'doc' | 'xls' | 'img' | 'video';

interface DocItem {
  id: string;
  parentId: string | null; // null means root
  name: string;
  type: FileType;
  size?: string; // Only for files
  date: string;
  url?: string; // Mock URL for download
}

// --- Mock Data ---
const MOCK_DOCUMENTS: DocItem[] = [
  // Root Folders
  { id: '1', parentId: null, name: 'Recursos Humanos', type: 'folder', date: '2023-10-01' },
  { id: '2', parentId: null, name: 'Marketing & Branding', type: 'folder', date: '2023-09-15' },
  { id: '3', parentId: null, name: 'Operaciones y Procesos', type: 'folder', date: '2023-11-20' },
  { id: '4', parentId: null, name: 'Finanzas y Legal', type: 'folder', date: '2023-08-10' },

  // Marketing Items (id: 2)
  { id: '21', parentId: '2', name: 'Logos Traveliz 2026', type: 'folder', date: '2024-01-10' },
  { id: '22', parentId: '2', name: 'Brochure Corporativo.pdf', type: 'pdf', size: '4.5 MB', date: '2024-01-15' },
  { id: '23', parentId: '2', name: 'Plantilla Presentación.pptx', type: 'doc', size: '12 MB', date: '2023-12-05' },
  { id: '24', parentId: '2', name: 'Video Promocional Lujo.mp4', type: 'video', size: '150 MB', date: '2023-11-30' },

  // Logos Items (id: 21)
  { id: '211', parentId: '21', name: 'Logo_Horizontal_Blue.png', type: 'img', size: '1.2 MB', date: '2024-01-10' },
  { id: '212', parentId: '21', name: 'Logo_Vertical_Gold.png', type: 'img', size: '1.1 MB', date: '2024-01-10' },
  { id: '213', parentId: '21', name: 'Manual de Uso.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-10' },

  // HR Items (id: 1)
  { id: '11', parentId: '1', name: 'Manual de Empleado.pdf', type: 'pdf', size: '3.2 MB', date: '2023-10-05' },
  { id: '12', parentId: '1', name: 'Solicitud de Vacaciones.xlsx', type: 'xls', size: '45 KB', date: '2023-10-05' },
  { id: '13', parentId: '1', name: 'Política de Viáticos 2026.pdf', type: 'pdf', size: '1.8 MB', date: '2024-01-02' },

  // Operations (id: 3)
  { id: '31', parentId: '3', name: 'Protocolos de Seguridad.pdf', type: 'pdf', size: '5.1 MB', date: '2023-11-20' },
  { id: '32', parentId: '3', name: 'Contactos de Emergencia.docx', type: 'doc', size: '20 KB', date: '2023-11-22' },
];

const Documentation: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<{id: string | null, name: string}[]>([{ id: null, name: 'Inicio' }]);

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
    setSearchTerm(''); // Clear search on navigation
  };

  const handleBreadcrumbClick = (index: number) => {
    const newHistory = history.slice(0, index + 1);
    setHistory(newHistory);
    setCurrentFolderId(newHistory[newHistory.length - 1].id);
  };

  // --- Filtering Logic ---
  const filteredItems = useMemo(() => {
    // If searching, search EVERYTHING. If not, only show current folder content.
    if (searchTerm.trim()) {
      return MOCK_DOCUMENTS.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        doc.type !== 'folder' // Usually searching files is more useful, but can be changed
      );
    }
    return MOCK_DOCUMENTS.filter(doc => doc.parentId === currentFolderId);
  }, [currentFolderId, searchTerm]);

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
        
        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
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
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-sm overflow-x-auto pb-2">
        {history.map((item, index) => (
          <React.Fragment key={item.id || 'root'}>
            <button 
                onClick={() => handleBreadcrumbClick(index)}
                className={`uppercase tracking-wider font-bold text-[10px] whitespace-nowrap ${index === history.length - 1 ? 'text-brand cursor-default' : 'text-secondary hover:text-accent'}`}
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
        
        {/* Folders Grid */}
        {!searchTerm && folders.length > 0 && (
            <div className="p-8 border-b border-neutral bg-[#FBFBFB]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6">Carpetas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {folders.map(folder => (
                        <button 
                            key={folder.id}
                            onClick={() => handleFolderClick(folder)}
                            className="flex items-center gap-4 p-5 bg-white border border-neutral hover:border-accent hover:shadow-lg transition-all duration-300 group text-left"
                        >
                            <div className="w-10 h-10 bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                <i className="fa-solid fa-folder text-lg"></i>
                            </div>
                            <div>
                                <p className="font-serif font-medium text-primary text-base leading-tight group-hover:text-brand">{folder.name}</p>
                                <p className="text-[9px] text-secondary mt-1">{folder.date}</p>
                            </div>
                        </button>
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
                                        <span className="font-medium text-primary text-sm group-hover:text-brand transition-colors">{file.name}</span>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary">{file.date}</td>
                                <td className="hidden md:table-cell px-8 py-4 text-xs text-secondary font-mono">{file.size}</td>
                                <td className="px-8 py-4 text-right">
                                    <button className="text-secondary hover:text-accent transition-colors px-3 py-1" title="Descargar">
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                    <button className="text-secondary hover:text-brand transition-colors px-3 py-1" title="Vista Previa">
                                        <i className="fa-regular fa-eye"></i>
                                    </button>
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
                    </div>
                 )
             )}
        </div>

      </div>
    </div>
  );
};

export default Documentation;
