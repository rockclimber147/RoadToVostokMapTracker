import { type PinColor } from '../../types';

interface ColorFiltersProps {
  colorStates: Record<PinColor, number>;
  onToggleColor: (color: PinColor) => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function ColorFilters({ colorStates, onToggleColor }: ColorFiltersProps) {
  return (
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
              style={{ backgroundColor: state === 2 ? color : 'transparent' }}
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
  );
}