// src/components/Sidebar.tsx
import { useState } from 'react';
import { type PinColor } from '../types';

interface SidebarProps {
  activeMap: string;
  setActiveMap: (id: string) => void;
  visibleColors: Set<PinColor>;
  onToggleColor: (color: PinColor) => void;
  onExport: () => void;
  onImport: () => void;
}

const COLORS: PinColor[] = ['red', 'yellow', 'orange', 'green', 'blue', 'violet'];

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
      <div className="w-64 bg-[#0A0A0A]/90 backdrop-blur-xl text-[#E0E0E0] p-6 flex flex-col gap-8 border-l border-[#1A1A1A] shadow-2xl">
        
        {/* Minimalist Header */}
        <header className="space-y-1">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Map Tracker</h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#1A1A1A] to-transparent" />
        </header>

        {/* Map Selection */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Location</h2>
          <div className="relative group">
            <select 
              value={activeMap} 
              onChange={(e) => setActiveMap(e.target.value)}
              className="w-full bg-[#121212] border border-[#1A1A1A] rounded-none p-2 text-xs font-medium tracking-wide focus:outline-none focus:border-[#404040] transition-colors appearance-none cursor-pointer"
            >
              <option value="map1">VILLAGE</option>
              <option value="map2">HIGHWAY</option>
              <option value="map3">SCHOOL</option>
              <option value="map4">OUTPOST</option>
              <option value="map5">MINEFIELD</option>
              <option value="map6">APARTMENTS</option>
              <option value="map7">TERMINAL</option>
            </select>
            {/* Custom chevron for select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[8px]">▼</div>
          </div>
        </section>

        {/* Filter Buttons */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">Filters</h2>
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {COLORS.map(color => {
              const isActive = visibleColors.has(color);
              return (
                <button
                  key={color}
                  onClick={() => onToggleColor(color)}
                  title={`Toggle ${color}`}
                  className={`
                    w-8 h-8 rounded-full transition-all duration-300 border border-white/5
                    ${isActive 
                      ? 'opacity-100 scale-110 ring-1 ring-white/20 ring-offset-4 ring-offset-[#0A0A0A]' 
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
            className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase"
          >
            Export JSON
          </button>
          <button 
            onClick={onImport} 
            className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase opacity-40 hover:opacity-100"
          >
            Import JSON
          </button>
        </footer>
      </div>

      {/* Toggle Tab */}
      <div className="self-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-20 w-6 bg-[#0A0A0A]/90 backdrop-blur-xl border-l border-t border-b border-[#1A1A1A] flex items-center justify-center rounded-l-sm hover:bg-black transition-colors group"
        >
          <span className={`text-[10px] text-[#E0E0E0] transition-transform duration-500 ${isOpen ? '' : 'rotate-180'}`}>
            →
          </span>
        </button>
      </div>
    </div>
  );
}