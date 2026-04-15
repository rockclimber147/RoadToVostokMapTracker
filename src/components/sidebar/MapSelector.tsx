import { MAP_LIST } from '../../constants/maps';

interface MapSelectorProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
}

export default function MapSelector({ activeMap, setActiveMap }: MapSelectorProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Map Selection</h2>
      <div className="flex flex-col border border-[#1A1A1A]">
        {MAP_LIST.map((map) => {
          const isActive = activeMap === map.id;
          return (
            <button
              key={map.id}
              onClick={() => setActiveMap(map.id)}
              className={`
                w-full text-left px-3 py-2.5 text-[10px] font-bold tracking-widest transition-all duration-200
                border-b border-[#1A1A1A] last:border-b-0
                ${isActive 
                  ? 'bg-[#E0E0E0] text-black' 
                  : 'bg-transparent text-[#E0E0E0] opacity-40 hover:opacity-100 hover:bg-[#121212]'
                }
              `}
            >
              {map.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}