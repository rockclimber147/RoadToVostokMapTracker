import { type PinColor } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  onSelectColor: (color: PinColor) => void;
  onClose: () => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function ContextMenu({ x, y, onSelectColor, onClose }: ContextMenuProps) {
  return (
    <div 
      className="fixed z-[2000] bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#1A1A1A] shadow-[0_0_30px_rgba(0,0,0,0.5)] p-3 animate-in fade-in zoom-in duration-100 ease-out"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {/* Minimalist Grid: No text, just colors. 
        The grid layout matches the Sidebar visual language.
      */}
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className="w-7 h-7 rounded-full border border-white/5 hover:scale-125 hover:border-white/20 transition-all duration-200 shadow-lg active:scale-95"
            style={{ backgroundColor: color }}
            title={`DEPLOY ${color.toUpperCase()}`}
          />
        ))}
      </div>
    </div>
  );
}