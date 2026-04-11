// src/components/PinPopup.tsx
import { Popup } from 'react-leaflet';
import { type Pin, type PinColor } from '../types';

interface PinPopupProps {
  pin: Pin;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
}

const COLORS: PinColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

export default function PinPopup({ pin, onUpdatePin, onDeletePin }: PinPopupProps) {
  return (
    <Popup className="custom-dark-popup">
      <div className="flex flex-col gap-4 min-w-[220px] bg-[#0A0A0A] text-[#E0E0E0] p-2">
        {/* Label Input */}
        <div className="space-y-1">
          <label className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30">Label</label>
          <input 
            className="w-full bg-[#121212] border border-[#1A1A1A] rounded-none p-2 text-xs focus:outline-none focus:border-[#404040] transition-colors placeholder:opacity-20"
            value={pin.label}
            placeholder="IDENTIFIER..."
            onChange={(e) => onUpdatePin(pin.id, { label: e.target.value })}
          />
        </div>

        {/* Notes Input */}
        <div className="space-y-1">
          <label className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30">Notes</label>
          <textarea 
            className="w-full bg-[#121212] border border-[#1A1A1A] rounded-none p-2 text-xs h-20 resize-none focus:outline-none focus:border-[#404040] transition-colors placeholder:opacity-20"
            value={pin.notes}
            placeholder="COORDINATE DATA..."
            onChange={(e) => onUpdatePin(pin.id, { notes: e.target.value })}
          />
        </div>

        {/* Color Selection & Delete */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#1A1A1A]">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30">Type</span>
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdatePin(pin.id, { color: c })}
                  className={`w-3 h-3 rounded-full transition-all ${
                    pin.color === c ? 'ring-1 ring-white ring-offset-2 ring-offset-[#0A0A0A]' : 'opacity-30 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button 
            className="w-full text-[9px] font-bold tracking-[0.2em] py-2 border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase"
            onClick={() => onDeletePin(pin.id)}
          >
            Purge Pin
          </button>
        </div>
      </div>
    </Popup>
  );
}