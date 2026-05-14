import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Navigation, Star, Plus, Map as MapIcon, Layers, Info, X, ExternalLink, Loader2 } from 'lucide-react';
import { useUser } from '../lib/UserContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Orange pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface OsmPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface Location {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: number;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

export const PlacesView = () => {
  const { userData } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundPlaces, setFoundPlaces] = useState<OsmPlace[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo
  const [locations] = useState<Location[]>([
    { id: '1', name: 'Centro Empresarial Norte', category: 'Escritório', distance: '0.2km', rating: 4.8 },
    { id: '2', name: 'Almoxarifado Central', category: 'Logística', distance: '1.5km', rating: 4.2 },
    { id: '3', name: 'Canteiro de Obras - Setor Sul', category: 'Operacional', distance: '5.8km', rating: 4.5 },
    { id: '4', name: 'Prefeitura Municipal', category: 'Órgão Público', distance: '2.1km', rating: 3.9 },
  ]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setFoundPlaces(data);
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error('Error searching OSM:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MapPin className="w-5 h-5 text-brand-orange" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Inteligência Geográfica Gratuita</h1>
          </div>
          <p className="text-slate-500 text-sm italic">
            Alimentado por OpenStreetMap para {userData?.specialization || 'profissionais'}.
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
           <button className="px-4 py-2 bg-brand-orange text-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Lista</button>
           <button className="px-4 py-2 text-slate-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Mapa</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real OpenStreetMap Map */}
        <div className="lg:col-span-2 min-h-[500px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl z-0">
           <MapContainer 
             center={mapCenter} 
             zoom={13} 
             style={{ width: '100%', height: '100%' }}
             zoomControl={false}
           >
             <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
             <MapUpdater center={mapCenter} />
             {foundPlaces.map((place) => (
               <Marker 
                 key={place.place_id} 
                 position={[parseFloat(place.lat), parseFloat(place.lon)]}
                 icon={customIcon}
               >
                 <Popup>
                   <div className="p-1 min-w-[150px] text-slate-800">
                     <h4 className="font-bold text-xs mb-1">{place.display_name.split(',')[0]}</h4>
                     <p className="text-[9px] text-slate-500 line-clamp-2">{place.display_name}</p>
                     <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                       <a 
                         href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}`} 
                         target="_blank" 
                         rel="noreferrer"
                         className="text-[9px] text-blue-600 flex items-center gap-1"
                       >
                         Ver no OSM <ExternalLink className="w-2 h-2" />
                       </a>
                     </div>
                   </div>
                 </Popup>
               </Marker>
             ))}
           </MapContainer>
           
           <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-[1000] pointer-events-none">
              <div className="pointer-events-auto relative w-full max-w-sm">
                 <Search className={`absolute left-3 top-2.5 w-4 h-4 ${loading ? 'animate-pulse text-brand-orange' : 'text-slate-400'}`} />
                 <input 
                   type="text" 
                   placeholder="Buscar qualquer lugar (OSM)..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                   className="w-full bg-black/80 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-brand-orange transition-all"
                 />
                 {loading && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-brand-orange animate-spin" />}
              </div>
              <div className="flex flex-col gap-2 pointer-events-auto">
                 <button className="p-2.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-brand-orange transition-all shadow-xl">
                    <Layers className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                        });
                      }
                   }}
                   className="p-2.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-brand-orange transition-all shadow-xl"
                 >
                    <Navigation className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {foundPlaces.length > 0 ? 'Resultados (OSM)' : 'Pontos Salvos'}
              </h3>
              {foundPlaces.length > 0 && (
                <button 
                  onClick={() => setFoundPlaces([])}
                  className="p-1 px-2 text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Limpar
                </button>
              )}
           </div>
           
           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(foundPlaces.length > 0 ? foundPlaces : (searchQuery.length > 0 ? filteredLocations : locations)).map((loc: any) => {
                const isReal = !!loc.display_name;
                const id = isReal ? loc.place_id : loc.id;
                return (
                  <div 
                    key={id} 
                    onClick={() => {
                      if (isReal) setMapCenter([parseFloat(loc.lat), parseFloat(loc.lon)]);
                    }}
                    className="p-4 bg-card-bg border border-slate-800 rounded-2xl hover:border-slate-700 hover:bg-white/5 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                         <h4 className="text-sm font-bold text-slate-200 group-hover:text-brand-orange transition-all line-clamp-1">
                           {isReal ? loc.display_name.split(',')[0] : loc.name}
                         </h4>
                         <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded uppercase font-black tracking-widest mt-1 inline-block">
                           {isReal ? (loc.type || 'Local') : loc.category}
                         </span>
                      </div>
                      <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-600 group-hover:text-white transition-all group-hover:border-slate-600">
                         <Navigation className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                       <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-orange" /> {isReal ? 'OpenStreetMap' : loc.distance}
                       </span>
                       {!isReal && (
                         <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {loc.rating}
                         </span>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>

           <div className="p-6 bg-brand-blue/20 border border-brand-orange/20 rounded-3xl">
              <div className="flex gap-3 mb-4">
                 <Info className="w-5 h-5 text-brand-orange" />
                 <h5 className="text-xs font-bold text-white uppercase tracking-widest">Inteligência Zeus</h5>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {foundPlaces.length > 0 
                  ? "Esta busca utiliza OpenStreetMap, uma base de dados global mantida pela comunidade e totalmente gratuita."
                  : "Posso gerar um PDF de vistoria automaticamente se você registrar o check-in quando chegar em qualquer um desses locais."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

