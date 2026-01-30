import React, { useState } from 'react';

// --- Types ---
interface Supplier {
  id: number;
  name: string;
  serviceType: string[]; 
  logo: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  description: string;
  isPreferred?: boolean;
  
  // Updated fields
  country: string;
  city: string;
  region: string; // Changed to string to accommodate the new specific list
  distributionPlatforms: string[]; 
}

// --- Constants ---
const REGION_OPTIONS = [
  "AMÉRICA CENTRAL",
  "AMÉRICA DEL NORTE",
  "MÉXICO",
  "CARIBE",
  "AMÉRICA DEL SUR",
  "EUROPA CENTRAL",
  "EUROPA DEL ESTE Y BALCANES",
  "EUROPA DEL NORTE Y BÁLTICOS",
  "EUROPA MEDITERRÁNEO",
  "EUROPA OCCIDENTAL",
  "ÁFRICA",
  "MEDIO ORIENTE",
  "ASIA Y PACÍFICO",
  "OCEANÍA",
  "ANTÁRTIDA",
  "ÁRTICO"
];

// --- Mock Data (Updated with new Regions) ---
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: 'Emirates',
    serviceType: ['Aerolínea', 'Lujo'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png',
    contactName: 'Mesa de Ayuda Agencias',
    email: 'agencias.mx@emirates.com',
    phone: '+52 55 5555 1234',
    website: 'https://www.emirates.com/mx',
    description: 'Aerolínea partner preferente para rutas a Medio Oriente y Asia.',
    isPreferred: true,
    country: 'Emiratos Árabes Unidos',
    city: 'Dubai',
    region: 'MEDIO ORIENTE',
    distributionPlatforms: ['Sabre', 'Amadeus', 'NDC', 'Web Directa']
  },
  {
    id: 2,
    name: 'Marriott International',
    serviceType: ['Hotel', 'MICE'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marriott_International.svg/2560px-Marriott_International.svg.png',
    contactName: 'Carla Ruiz',
    email: 'cruiz@marriott.com',
    description: 'Acceso a tarifas Luminous y Stars. Contactar para amenities especiales.',
    isPreferred: true,
    country: 'Estados Unidos',
    city: 'Bethesda',
    region: 'AMÉRICA DEL NORTE',
    distributionPlatforms: ['Sabre', 'Web Directa', 'GDS']
  },
  {
    id: 3,
    name: 'Mega Travel',
    serviceType: ['Operador', 'Circuitos'],
    logo: 'https://www.megatravel.com.mx/tools/img/logo-mega-travel.png',
    contactName: 'Soporte Ventas',
    email: 'ventas@megatravel.com.mx',
    phone: '800 123 4567',
    description: 'Operador mayorista para circuitos en Europa y Medio Oriente.',
    country: 'México',
    city: 'Ciudad de México',
    region: 'MÉXICO',
    distributionPlatforms: ['Web Directa', 'Portal Agencias']
  },
  {
    id: 4,
    name: 'Assist Card',
    serviceType: ['Seguros', 'Asistencia'],
    logo: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052013/assist-card_0.png?itok=J4QJ5j5_',
    website: 'https://www.assistcard.com',
    description: 'Seguro de viajero mandatorio para todos los bloqueos grupales.',
    country: 'Suiza',
    city: 'Ginebra',
    region: 'EUROPA OCCIDENTAL',
    distributionPlatforms: ['Sabre', 'Amadeus', 'Web Directa']
  },
  {
    id: 5,
    name: 'Four Seasons',
    serviceType: ['Hotel', 'Lujo'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Four_Seasons_Hotels_and_Resorts_Logo.svg/2560px-Four_Seasons_Hotels_and_Resorts_Logo.svg.png',
    contactName: 'Concierge Desk',
    email: 'reservations.fs@fourseasons.com',
    description: 'Preferred Partner. Desayuno incluido y upgrade sujeto a disponibilidad.',
    isPreferred: true,
    country: 'Canadá',
    city: 'Toronto',
    region: 'AMÉRICA DEL NORTE',
    distributionPlatforms: ['Sabre', 'Amadeus', 'Web Directa']
  },
  {
    id: 6,
    name: 'Aeroméxico',
    serviceType: ['Aerolínea'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Aeromexico_logo.svg/2560px-Aeromexico_logo.svg.png',
    phone: '01 800 000 0000',
    description: 'Línea aérea bandera de México. Convenio corporativo vigente 2026.',
    country: 'México',
    city: 'Ciudad de México',
    region: 'MÉXICO',
    distributionPlatforms: ['Sabre', 'Amadeus', 'NDC', 'Web Directa']
  },
  {
    id: 7,
    name: 'Expedia TAAP',
    serviceType: ['Consolidador', 'Hotel'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Expedia_2023.svg/2560px-Expedia_2023.svg.png',
    description: 'Plataforma de consolidación hotelera con comisiones preferenciales.',
    country: 'Estados Unidos',
    city: 'Seattle',
    region: 'AMÉRICA DEL NORTE',
    distributionPlatforms: ['Web Directa']
  }
];

const Suppliers: React.FC = () => {
  // --- Filter States ---
  const [keyword, setKeyword] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [location, setLocation] = useState(''); // Country or City
  
  // Changed to array for multiple selection
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // --- Derived Constants for Options ---
  const allServiceTypes = Array.from(new Set(MOCK_SUPPLIERS.flatMap(s => s.serviceType))).sort();
  const allPlatforms = Array.from(new Set(MOCK_SUPPLIERS.flatMap(s => s.distributionPlatforms))).sort();

  // --- Filtering Logic ---
  const filteredSuppliers = MOCK_SUPPLIERS.filter(supplier => {
    // 1. Keyword (Searches in description)
    if (keyword && !supplier.description.toLowerCase().includes(keyword.toLowerCase())) return false;

    // 2. Name
    if (supplierName && !supplier.name.toLowerCase().includes(supplierName.toLowerCase())) return false;

    // 3. Location (Country or City)
    if (location) {
        const loc = location.toLowerCase();
        const matchesCountry = supplier.country.toLowerCase().includes(loc);
        const matchesCity = supplier.city.toLowerCase().includes(loc);
        if (!matchesCountry && !matchesCity) return false;
    }

    // 4. Region (OR logic: if any selected region matches)
    if (selectedRegions.length > 0) {
        if (!selectedRegions.includes(supplier.region)) return false;
    }

    // 5. Service Type (OR logic)
    if (selectedServiceTypes.length > 0) {
        const hasMatch = supplier.serviceType.some(type => selectedServiceTypes.includes(type));
        if (!hasMatch) return false;
    }

    // 6. Distribution Platforms (OR logic)
    if (selectedPlatforms.length > 0) {
        const hasMatch = supplier.distributionPlatforms.some(plat => selectedPlatforms.includes(plat));
        if (!hasMatch) return false;
    }

    return true;
  });

  // --- Handlers ---
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const toggleServiceType = (type: string) => {
    setSelectedServiceTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  const clearFilters = () => {
    setKeyword('');
    setSupplierName('');
    setLocation('');
    setSelectedRegions([]);
    setSelectedServiceTypes([]);
    setSelectedPlatforms([]);
  };

  return (
    <div className="max-w-site mx-auto px-mobile-x py-section-y animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-16 border-b border-neutral pb-12">
        <span className="text-brand text-xs font-bold uppercase tracking-[4px] mb-4 block">
            Socios Comerciales
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary">
            Directorio de Proveedores
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* --- LEFT COLUMN: FILTERS (30%) --- */}
        <aside className="w-full lg:w-[30%] bg-surface border border-neutral p-8 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-primary">Filtros</h3>
                <button 
                    onClick={clearFilters}
                    className="text-[10px] font-bold uppercase tracking-widest text-brand hover:text-accent underline"
                >
                    Limpiar
                </button>
            </div>

            <div className="space-y-8">
                {/* Palabras Clave */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Palabras Clave</label>
                    <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Ej. Circuitos, Lujo..."
                        className="w-full p-3 bg-background border border-neutral text-sm focus:border-accent outline-none"
                    />
                </div>

                {/* Nombre Proveedor */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Nombre del Proveedor</label>
                    <input 
                        type="text" 
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="Ej. Emirates"
                        className="w-full p-3 bg-background border border-neutral text-sm focus:border-accent outline-none"
                    />
                </div>

                {/* País o Ciudad */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">País o Ciudad</label>
                    <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej. México, Dubai"
                        className="w-full p-3 bg-background border border-neutral text-sm focus:border-accent outline-none"
                    />
                </div>

                {/* Región (Updated to 2 Columns) */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Región</label>
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {REGION_OPTIONS.map(region => (
                            <label key={region} className="flex items-start gap-2 cursor-pointer group p-1 hover:bg-neutral/30 transition-colors">
                                <div className={`mt-0.5 w-3 h-3 border flex-shrink-0 flex items-center justify-center transition-colors ${selectedRegions.includes(region) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                                    {selectedRegions.includes(region) && <i className="fa-solid fa-check text-white text-[8px]"></i>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedRegions.includes(region)}
                                    onChange={() => toggleRegion(region)}
                                />
                                <span className={`text-[8px] uppercase leading-tight ${selectedRegions.includes(region) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{region}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tipo de Servicio */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Tipo de Servicio</label>
                    <div className="space-y-2">
                        {allServiceTypes.map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedServiceTypes.includes(type) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                                    {selectedServiceTypes.includes(type) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedServiceTypes.includes(type)}
                                    onChange={() => toggleServiceType(type)}
                                />
                                <span className={`text-xs ${selectedServiceTypes.includes(type) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Plataformas */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Plataformas de Distribución</label>
                    <div className="space-y-2">
                        {allPlatforms.map(plat => (
                            <label key={plat} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedPlatforms.includes(plat) ? 'bg-brand border-brand' : 'border-neutral bg-white'}`}>
                                    {selectedPlatforms.includes(plat) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedPlatforms.includes(plat)}
                                    onChange={() => togglePlatform(plat)}
                                />
                                <span className={`text-xs ${selectedPlatforms.includes(plat) ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'}`}>{plat}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </aside>

        {/* --- RIGHT COLUMN: RESULTS (70%) --- */}
        <div className="w-full lg:w-[70%]">
            
            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                    {filteredSuppliers.length} Resultados Encontrados
                </p>
                <div className="text-[10px] text-secondary">
                    Mostrando resultados filtrados
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSuppliers.map(supplier => (
                    <div key={supplier.id} className="bg-surface border border-neutral hover:shadow-xl hover:border-accent/30 transition-all duration-300 group flex flex-col relative overflow-hidden">
                        {supplier.isPreferred && (
                            <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                                Preferred
                            </div>
                        )}
                        
                        <div className="h-32 p-6 flex items-center justify-center bg-white border-b border-neutral group-hover:bg-background/50 transition-colors relative">
                             {/* Region Badge */}
                            <span className="absolute bottom-2 left-2 text-[8px] font-bold uppercase tracking-wider text-secondary bg-background px-2 py-0.5 border border-neutral">
                                {supplier.region}
                            </span>
                            <img 
                                src={supplier.logo} 
                                alt={supplier.name} 
                                className="max-h-full max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {supplier.serviceType.map(tag => (
                                        <span key={tag} className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border text-brand border-brand/20 bg-brand/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-serif text-xl text-primary">{supplier.name}</h3>
                                <p className="text-[10px] text-secondary mt-1"><i className="fa-solid fa-location-dot mr-1"></i> {supplier.city}, {supplier.country}</p>
                            </div>

                            <p className="text-sm text-secondary font-light leading-relaxed mb-6 flex-1 line-clamp-3">
                                {supplier.description}
                            </p>

                            <div className="space-y-2 pt-4 border-t border-neutral">
                                {/* Distribution Platforms display */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {supplier.distributionPlatforms.map(plat => (
                                        <span key={plat} className="text-[9px] text-secondary bg-neutral/30 px-2 py-0.5 rounded-sm">
                                            {plat}
                                        </span>
                                    ))}
                                </div>

                                {supplier.contactName && (
                                     <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-user text-accent text-[10px]"></i>
                                        <span className="text-[10px] text-primary font-bold">{supplier.contactName}</span>
                                    </div>
                                )}
                                {supplier.email && (
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-envelope text-accent text-[10px]"></i>
                                        <a href={`mailto:${supplier.email}`} className="text-[10px] text-secondary hover:text-brand transition-colors break-all">
                                            {supplier.email}
                                        </a>
                                    </div>
                                )}
                                {supplier.website && (
                                     <div className="flex items-center gap-2 mt-2">
                                        <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-wider text-brand hover:text-accent transition-colors">
                                            Visitar Sitio Web <i className="fa-solid fa-arrow-right ml-1"></i>
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
                    <p className="font-serif italic text-lg mb-2">No se encontraron resultados</p>
                    <p className="text-xs">Intenta ajustar tus filtros de búsqueda.</p>
                    <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                        Limpiar Filtros
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Suppliers;