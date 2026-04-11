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
    <Popup>
      <div className="flex flex-col gap-2 min-w-[200px] p-1">
        <label className="text-xs font-bold uppercase text-gray-500">Label</label>
        <input 
          className="border p-1 rounded w-full"
          value={pin.label}
          placeholder="e.g. Loot Cache"
          onChange={(e) => onUpdatePin(pin.id, { label: e.target.value })}
        />

        <label className="text-xs font-bold uppercase text-gray-500 mt-1">Notes</label>
        <textarea 
          className="border p-1 rounded w-full h-20 resize-none"
          value={pin.notes}
          placeholder="Details..."
          onChange={(e) => onUpdatePin(pin.id, { notes: e.target.value })}
        />

        <div className="flex justify-between items-center mt-2 pt-2 border-t">
          <select 
            className="text-sm border rounded p-1"
            value={pin.color} 
            onChange={(e) => onUpdatePin(pin.id, { color: e.target.value as PinColor })}
          >
            {COLORS.map(c => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <button 
            className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition-colors"
            onClick={() => onDeletePin(pin.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Popup>
  );
}