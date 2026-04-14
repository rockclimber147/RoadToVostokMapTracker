// src/components/Sidebar.tsx
import { useState } from 'react';
import { type PinColor, type Path} from '../types';
import { MAP_LIST } from '../constants/maps';

interface SidebarProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
  colorStates: Record<PinColor, number>;
  onToggleColor: (color: PinColor) => void;
  onExport: () => void;
  onImport: () => void;
  onAppend: () => void;
  isPathingMode: boolean;
  onTogglePathMode: () => void;
  paths: Path[];
  onUpdatePath: (id: string, updates: Partial<Path>) => void;
  onDeletePath: (id: string) => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function Sidebar({
  activeMap,
  setActiveMap,
  colorStates,
  onToggleColor,
  onExport,
  onImport,
  onAppend,
  isPathingMode,
  onTogglePathMode,
  paths,
  onUpdatePath,
  onDeletePath
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`fixed top-0 right-0 h-full z-[1001] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-row-reverse ${
        isOpen ? 'translate-x-0' : 'translate-x-64'
      }`}
    >
      <div className="w-64 bg-[#050505]/95 backdrop-blur-xl text-[#E0E0E0] p-6 flex flex-col gap-8 border-l border-[#1A1A1A] shadow-2xl overflow-y-auto">
        
        <header className="space-y-1">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Road to Vostok Mapping Tool</h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#1A1A1A] to-transparent" />
        </header>

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

        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Filters</h2>
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {COLORS.map(color => {
              const state = colorStates[color];
              
              return (
                <button
                  key={color}
                  onClick={() => onToggleColor(color)}
                  className={`
                    relative w-8 h-8 rounded-full transition-all duration-300 border border-white/10
                    flex items-center justify-center
                    ${state === 0 ? 'opacity-10 grayscale scale-90' : 'opacity-100 scale-110'}
                  `}
                  style={{ 
                    backgroundColor: state === 2 ? color : 'transparent',
                  }}
                  title={state === 0 ? 'Hidden' : state === 1 ? 'Pin Only' : 'Pin + Label'}
                >
                  {state === 1 && (
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: color }} 
                    />
                  )}

                  {state > 0 && (
                    <div className="absolute -inset-1 border border-white/5 rounded-full pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* NEW: Tools Section for Pathing Mode */}
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
                  {/* Visibility Toggle */}
                  <button 
                    onClick={() => onUpdatePath(path.id, { isVisible: !path.isVisible })}
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${path.isVisible ? 'bg-[#E0E0E0] border-[#E0E0E0]' : 'border-[#404040]'}`}
                  >
                    {path.isVisible && <div className="w-2 h-2 bg-black" />}
                  </button>
                  
                  {/* Label Editor */}
                  <input 
                    value={path.label}
                    onChange={(e) => onUpdatePath(path.id, { label: e.target.value })}
                    className="flex-1 bg-transparent text-[10px] font-bold tracking-widest text-[#E0E0E0] uppercase focus:outline-none focus:border-b border-[#404040]"
                    placeholder="ROUTE NAME"
                  />
                  
                  {/* Delete Path */}
                  <button 
                    onClick={() => onDeletePath(path.id)}
                    className="text-[10px] text-red-500/50 hover:text-red-500 transition-colors"
                    title="Purge Route"
                  >
                    ✕
                  </button>
                </div>

                {/* Color Selector */}
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

        <footer className="mt-auto space-y-2">
          <button 
            onClick={onExport} 
            className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-blue-900/20 hover:border-blue-500/50 transition-all uppercase"
          >
            Copy to Clipboard
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={onImport} 
              className="flex-1 text-[9px] font-bold tracking-[0.1em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase opacity-40 hover:opacity-100"
              title="Overwrite current data"
            >
              Overwrite
            </button>
            <button 
              onClick={onAppend} 
              className="flex-1 text-[9px] font-bold tracking-[0.1em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase opacity-40 hover:opacity-100"
              title="Merge from clipboard"
            >
              Append
            </button>
          </div>
        </footer>
      </div>

      <div className="self-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-20 w-6 bg-[#050505]/95 backdrop-blur-xl border-l border-t border-b border-[#1A1A1A] flex items-center justify-center rounded-l-sm hover:bg-black transition-colors group"
        >
          <span className={`text-[10px] text-[#E0E0E0] transition-transform duration-500 ${isOpen ? '' : 'rotate-180'}`}>
            →
          </span>
        </button>
      </div>
    </div>
  );
}