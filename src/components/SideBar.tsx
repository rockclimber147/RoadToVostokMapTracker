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
      className={`fixed top-0 left-0 h-full z-[1001] transition-transform duration-300 ease-in-out flex ${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      }`}
    >
      {/* Sidebar Content */}
      <div className="w-64 bg-slate-900 bg-opacity-80 backdrop-blur-md text-white p-4 flex flex-col gap-6 border-r border-slate-700">
        <h1 className="text-xl font-bold border-b border-slate-700 pb-2">Map Tracker</h1>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase mb-2">Active Map</h2>
          <select 
            value={activeMap} 
            onChange={(e) => setActiveMap(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="map1">Main World</option>
            <option value="map2">Underground</option>
            {/* ... other maps */}
          </select>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase mb-2">Toggle Visibility</h2>
          <div className="grid grid-cols-1 gap-1">
            {COLORS.map(color => (
              <label key={color} className="flex items-center gap-2 cursor-pointer hover:bg-white hover:bg-opacity-10 p-1.5 rounded transition-all">
                <input 
                  type="checkbox" 
                  checked={visibleColors.has(color)} 
                  onChange={() => onToggleColor(color)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 checked:bg-blue-500"
                />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm capitalize">{color}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-auto flex flex-col gap-2">
          <button onClick={onExport} className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-bold py-2 rounded uppercase tracking-wider transition-colors">
            Copy All Data
          </button>
          <button onClick={onImport} className="w-full bg-slate-700 hover:bg-slate-600 text-xs font-bold py-2 rounded uppercase tracking-wider transition-colors border border-slate-600">
            Import Data
          </button>
        </section>
      </div>

      {/* Toggle Tab */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-8 bg-slate-900 bg-opacity-80 backdrop-blur-md border-r border-t border-b border-slate-700 mt-4 flex items-center justify-center rounded-r-md hover:bg-slate-800 transition-colors"
      >
        <span className="text-white text-lg font-bold">
          {isOpen ? '‹' : '›'}
        </span>
      </button>
    </div>
  );
}