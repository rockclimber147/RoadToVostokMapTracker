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
      className={`fixed top-0 right-0 h-full z-[1001] transition-transform duration-300 ease-in-out flex flex-row-reverse ${
        isOpen ? 'translate-x-0' : 'translate-x-64'
      }`}
    >
      {/* Sidebar Content */}
      <div className="w-64 bg-slate-900 bg-opacity-80 backdrop-blur-md text-white p-4 flex flex-col gap-6 border-l border-slate-700">
        <h1 className="text-xl font-bold border-b border-slate-700 pb-2">Map Tracker</h1>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">Active Map</h2>
          <select 
            value={activeMap} 
            onChange={(e) => setActiveMap(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="map1">Village</option>
            <option value="map2">Highway</option>
            <option value="map3">School</option>
            <option value="map4">Outpost</option>
            <option value="map5">Minefield</option>
            <option value="map6">Apartments</option>
            <option value="map7">Terminal</option>
          </select>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase mb-3">Filter Pins</h2>
          {/* Grid of color-only toggle buttons */}
          <div className="grid grid-cols-3 gap-3">
            {COLORS.map(color => {
              const isActive = visibleColors.has(color);
              return (
                <button
                  key={color}
                  onClick={() => onToggleColor(color)}
                  title={`Toggle ${color} pins`}
                  className={`
                    w-12 h-12 rounded-full transition-all duration-200 
                    border-2 border-white border-opacity-20
                    ${isActive 
                      ? 'opacity-100 scale-100 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
                      : 'opacity-30 scale-90 grayscale-[50%]'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </section>

        <section className="mt-auto flex flex-col gap-2">
          <button 
            onClick={onExport} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-[10px] font-bold py-2 rounded uppercase tracking-tighter transition-colors"
          >
            Copy Pins to Clipboard
          </button>
          <button 
            onClick={onImport} 
            className="w-full bg-slate-700 hover:bg-slate-600 text-[10px] font-bold py-2 rounded uppercase tracking-tighter transition-colors border border-slate-600"
          >
            Import From Clipboard
          </button>
        </section>
      </div>

      {/* Toggle Tab */}
      <div className="pt-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-8 bg-slate-900 bg-opacity-80 backdrop-blur-md border-l border-t border-b border-slate-700 flex items-center justify-center rounded-l-md hover:bg-slate-800 transition-colors"
        >
          <span className="text-white text-lg font-bold">
            {isOpen ? '>' : '<'}
          </span>
        </button>
      </div>
    </div>
  );
}