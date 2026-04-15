import { useState } from 'react';
import { type PinColor, type Path } from '../types';

import MapSelector from './sidebar/MapSelector';
import ColorFilters from './sidebar/ColorFilters';
import ActiveRoutes from './sidebar/ActiveRoutes';
import DataActions from './sidebar/DataActions';

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

export default function Sidebar(props: SidebarProps) {
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

        <MapSelector 
          activeMap={props.activeMap} 
          setActiveMap={props.setActiveMap} 
        />

        <ColorFilters 
          colorStates={props.colorStates} 
          onToggleColor={props.onToggleColor} 
        />

        <ActiveRoutes 
          isPathingMode={props.isPathingMode}
          onTogglePathMode={props.onTogglePathMode}
          paths={props.paths}
          onUpdatePath={props.onUpdatePath}
          onDeletePath={props.onDeletePath}
        />

        <DataActions 
          onExport={props.onExport}
          onImport={props.onImport}
          onAppend={props.onAppend}
        />
        
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