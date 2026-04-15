import { type Path, type PinColor } from '../../types';

interface ActiveRoutesProps {
  isPathingMode: boolean;
  onTogglePathMode: () => void;
  paths: Path[];
  onUpdatePath: (id: string, updates: Partial<Path>) => void;
  onDeletePath: (id: string) => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function ActiveRoutes({
  isPathingMode,
  onTogglePathMode,
  paths,
  onUpdatePath,
  onDeletePath
}: ActiveRoutesProps) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Tools</h2>
        <button 
          onClick={onTogglePathMode}
          className={`w-full py-3 text-[10px] font-bold tracking-[0.2em] border transition-all uppercase ${
            isPathingMode 
              ? 'bg-orange-900/40 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
              : 'border-[#1A1A1A] text-[#E0E0E0] opacity-40 hover:opacity-100'
          }`}
        >
          {isPathingMode ? 'End Route Tracking' : 'Start Route Tracking'}
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-1">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Active Routes</h2>
        </div>
        
        {paths.length === 0 && (
          <div className="text-[9px] uppercase opacity-20 tracking-widest text-center py-2">No Routes Configured</div>
        )}

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {paths.map(path => (
            <div key={path.id} className="flex flex-col gap-2 bg-[#0A0A0A] border border-[#1A1A1A] p-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUpdatePath(path.id, { isVisible: !path.isVisible })}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${path.isVisible ? 'bg-[#E0E0E0] border-[#E0E0E0]' : 'border-[#404040]'}`}
                >
                  {path.isVisible && <div className="w-2 h-2 bg-black" />}
                </button>
                
                <input 
                  value={path.label}
                  onChange={(e) => onUpdatePath(path.id, { label: e.target.value })}
                  className="flex-1 bg-transparent text-[10px] font-bold tracking-widest text-[#E0E0E0] uppercase focus:outline-none focus:border-b border-[#404040]"
                  placeholder="ROUTE NAME"
                />
                
                <button 
                  onClick={() => onDeletePath(path.id)}
                  className="text-[10px] text-red-500/50 hover:text-red-500 transition-colors"
                  title="Purge Route"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-1.5 pl-6">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdatePath(path.id, { color: c })}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      path.color === c ? 'ring-1 ring-white ring-offset-1 ring-offset-[#0A0A0A]' : 'opacity-30 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}