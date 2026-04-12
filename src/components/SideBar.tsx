import { useState } from 'react';
import { type PinColor } from '../types';
import { MAP_LIST } from '../constants/maps';

interface SidebarProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
  colorStates: Record<PinColor, number>;
  onToggleColor: (color: PinColor) => void;
  onExport: () => void;
  onImport: () => void;
  onAppend: () => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function Sidebar({
  activeMap,
  setActiveMap,
  colorStates,
  onToggleColor,
  onExport,
  onImport,
  onAppend
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