import React, { useState } from 'react';

interface Supplier {
  id: number;
  name: string;
  category: 'Aerolínea' | 'Hotel' | 'Operador' | 'Seguros' | 'Traslados';
  logo: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  description: string;
  isPreferred?: boolean;
}

const Suppliers: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados (Mock Data) - En el futuro podría venir de Supabase
  const suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Emirates',
      category: 'Aerolínea',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png',
      contactName: 'Mesa de Ayuda Agencias',
      email: 'agencias.mx@emirates.com',
      phone: '+52 55 5555 1234',
      website: 'https://www.emirates.com/mx',
      description: 'Aerolínea partner preferente para rutas a Medio Oriente y Asia.',
      isPreferred: true
    },
    {
      id: 2,
      name: 'Marriott International',
      category: 'Hotel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_International.svg/2560px-Marriott_International.svg.png',
      contactName: 'Carla Ruiz',
      email: 'cruiz@marriott.com',
      description: 'Acceso a tarifas Luminous y Stars. Contactar para amenities especiales.',
      isPreferred: true
    },
    {
      id: 3,
      name: 'Mega Travel',
      category: 'Operador',
      logo: 'https://www.megatravel.com.mx/tools/img/logo-mega-travel.png',
      contactName: 'Soporte Ventas',
      email: 'ventas@megatravel.com.mx',
      phone: '800 123 4567',
      description: 'Operador mayorista para circuitos en Europa y Medio Oriente.',
    },
    {
      id: 4,
      name: 'Assist Card',
      category: 'Seguros',
      logo: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052013/assist-card_0.png?itok=J4QJ5j5_',
      website: 'https://www.assistcard.com',
      description: 'Seguro de viajero mandatorio para todos los bloqueos grupales.',
    },
    {
      id: 5,
      name: 'Four Seasons',
      category: 'Hotel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Four_Seasons_Hotels_and_Resorts_Logo.svg/2560px-Four_Seasons_Hotels_and_Resorts_Logo.svg.png',
      contactName: 'Concierge Desk',
      email: 'reservations.fs@fourseasons.com',
      description: 'Preferred Partner. Desayuno incluido y upgrade sujeto a disponibilidad.',
      isPreferred: true
    },
    {
      id: 6,
      name: 'Aeroméxico',
      category: 'Aerolínea',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Aeromexico_logo.svg/2560px-Aeromexico_logo.svg.png',
      phone: '01 800 000 0000',
      description: 'Línea aérea bandera de México. Convenio corporativo vigente 2026.',
    }
  ];

  const categories = ['Todos', 'Aerolínea', 'Hotel', 'Operador', 'Seguros'];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCategory = activeCategory === 'Todos' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
            Socios Comerciales
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
            Directorio de Proveedores
        </h1>
        <p className="text-secondary text-lg mt-6 max-w-2xl mx-auto font-light">
            Accede a la información de contacto y convenios de nuestros partners estratégicos globales.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        activeCategory === cat 
                        ? 'bg-brand border-brand text-white shadow-lg' 
                        : 'bg-white border-neutral text-secondary hover:border-brand hover:text-primary'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
            <input 
                type="text" 
                placeholder="Buscar proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral text-sm focus:border-accent outline-none transition-colors"
            />
            <span className="absolute left-4 top-3.5 text-secondary">
                <i className="fa-solid fa-search"></i>
            </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="bg-surface border border-neutral hover:shadow-xl hover:border-accent/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                {supplier.isPreferred && (
                    <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                        Preferred
                    </div>
                )}
                
                <div className="h-40 p-8 flex items-center justify-center bg-white border-b border-neutral group-hover:bg-background/50 transition-colors">
                    <img 
                        src={supplier.logo} 
                        alt={supplier.name} 
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>

                <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                        <span className={`inline-block px-2 py-1 mb-2 text-[9px] font-bold uppercase tracking-wider border ${
                            supplier.category === 'Aerolínea' ? 'text-blue-600 border-blue-100 bg-blue-50' :
                            supplier.category === 'Hotel' ? 'text-amber-600 border-amber-100 bg-amber-50' :
                            'text-gray-600 border-gray-100 bg-gray-50'
                        }`}>
                            {supplier.category}
                        </span>
                        <h3 className="font-serif text-2xl text-primary">{supplier.name}</h3>
                    </div>

                    <p className="text-sm text-secondary font-light leading-relaxed mb-6 flex-1">
                        {supplier.description}
                    </p>

                    <div className="space-y-3 pt-6 border-t border-neutral">
                        {supplier.contactName && (
                             <div className="flex items-start gap-3">
                                <i className="fa-solid fa-user text-accent text-xs mt-1"></i>
                                <span className="text-xs text-primary font-medium">{supplier.contactName}</span>
                            </div>
                        )}
                        {supplier.email && (
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-envelope text-accent text-xs mt-1"></i>
                                <a href={`mailto:${supplier.email}`} className="text-xs text-secondary hover:text-brand transition-colors break-all">
                                    {supplier.email}
                                </a>
                            </div>
                        )}
                        {supplier.phone && (
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-phone text-accent text-xs mt-1"></i>
                                <span className="text-xs text-secondary">{supplier.phone}</span>
                            </div>
                        )}
                        {supplier.website && (
                             <div className="flex items-start gap-3">
                                <i className="fa-solid fa-globe text-accent text-xs mt-1"></i>
                                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:text-brand transition-colors underline decoration-dotted">
                                    Sitio Oficial
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
          <div className="py-20 text-center text-secondary border border-dashed border-neutral bg-background/50">
              <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-30"></i>
              <p className="font-serif italic">No se encontraron proveedores con los filtros actuales.</p>
          </div>
      )}

    </div>
  );
};

export default Suppliers;