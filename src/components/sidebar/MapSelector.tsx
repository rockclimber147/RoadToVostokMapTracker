// src/components/sidebar/MapSelector.tsx
import { MAP_LIST, type MapDefinition } from '../../constants/maps';

interface MapSelectorProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
}

export default function MapSelector({ activeMap, setActiveMap }: MapSelectorProps) {
  // 1. Group the flat array into an object categorized by zone
  const mapsByZone = MAP_LIST.reduce((acc, map) => {
    if (!acc[map.zone]) {
      acc[map.zone] = [];
    }
    acc[map.zone].push(map);
    return acc;
  }, {} as Record<string, MapDefinition[]>);

  return (
    <section className="space-y-3">
      <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Map Selection</h2>
      
      <div className="flex flex-col border border-[#1A1A1A] bg-[#050505]">
        {Object.entries(mapsByZone).map(([zone, maps]) => (
          <div key={zone} className="border-b border-[#1A1A1A] last:border-b-0">
            
            {/* ZONE HEADER */}
            <div className="px-3 py-1.5 bg-[#141414] text-[9px] font-black tracking-[0.25em] text-[#E0E0E0] opacity-40 uppercase">
              {zone}
            </div>
            
            {/* MAP BUTTONS */}
            <div className="flex flex-col">
              {maps.map((map) => {
                const isActive = activeMap === map.id;
                const isPerma = map.isPermaDeath;

                // Determine colors based on Permadeath state
                const activeClasses = isPerma 
                  ? 'bg-red-900/40 text-red-500 border-l-[3px] border-l-red-500' 
                  : 'bg-[#E0E0E0] text-black border-l-[3px] border-l-transparent';
                  
                const inactiveClasses = isPerma 
                  ? 'bg-transparent text-red-500/60 hover:text-red-400 hover:bg-[#121212] border-l-[3px] border-l-transparent' 
                  : 'bg-transparent text-[#E0E0E0] opacity-40 hover:opacity-100 hover:bg-[#121212] border-l-[3px] border-l-transparent';

                return (
                  <button
                    key={map.id}
                    onClick={() => setActiveMap(map.id)}
                    className={`
                      w-full text-left px-3 py-2.5 text-[10px] font-bold tracking-widest transition-all duration-200
                      border-b border-[#1A1A1A]/50 last:border-b-0
                      ${isActive ? activeClasses : inactiveClasses}
                    `}
                  >
                    {map.label}
                  </button>
                );
              })}
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}