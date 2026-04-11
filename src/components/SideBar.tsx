// src/components/Sidebar.tsx
import { useState } from 'react';
import { type PinColor } from '../types';
import { MAP_LIST } from '../constants/maps';

interface SidebarProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
  visibleColors: Set<PinColor>;
  onToggleColor: (color: PinColor) => void;
  onExport: () => void;
  onImport: () => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function Sidebar({
  activeMap,
  setActiveMap,
  visibleColors,
  onToggleColor,
  onExport,
  onImport
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`fixed top-0 right-0 h-full z-[1001] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-row-reverse ${
        isOpen ? 'translate-x-0' : 'translate-x-64'
      }`}
    >
      {/* Sidebar Content */}
      <div className="w-64 bg-[#050505]/95 backdrop-blur-xl text-[#E0E0E0] p-6 flex flex-col gap-8 border-l border-[#1A1A1A] shadow-2xl overflow-y-auto">
        
        {/* Minimalist Header */}
        <header className="space-y-1">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">System.Link</h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#1A1A1A] to-transparent" />
        </header>

        {/* Tactical Map Selection (Multi-select style) */}
        <section className="space-y-3">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Sector Selection</h2>
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

        {/* Filter Buttons */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Signal Filters</h2>
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {COLORS.map(color => {
              const isActive = visibleColors.has(color);
              return (
                <button
                  key={color}
                  onClick={() => onToggleColor(color)}
                  className={`
                    w-8 h-8 rounded-full transition-all duration-300 border border-white/5
                    ${isActive 
                      ? 'opacity-100 scale-110 ring-1 ring-white/20 ring-offset-4 ring-offset-[#050505]' 
                      : 'opacity-10 grayscale scale-90'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <footer className="mt-auto space-y-2">
          <button 
            onClick={onExport} 
            className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-blue-900/20 hover:border-blue-500/50 transition-all uppercase"
          >
            Export Archive
          </button>
          <button 
            onClick={onImport} 
            className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-green-900/20 hover:border-green-500/50 transition-all uppercase opacity-40 hover:opacity-100"
          >
            Load Uplink
          </button>
        </footer>
      </div>

      {/* Toggle Tab */}
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