import { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor } from '../types';
import PinPopup from './PinPopup';
import { createColoredIcon } from '../utils/icons';
import 'leaflet/dist/leaflet.css';

interface Props {
  pins: Pin[];
  activeMapUrl: string;
  onAddPin: (latlng: LatLng, color: PinColor) => void; // Added color param
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  visibleColors: Set<PinColor>;
}

const COLORS: PinColor[] = ['red', 'yellow', 'orange', 'green', 'blue', 'violet'];

export default function GameMap({ 
  pins, 
  activeMapUrl, 
  onAddPin, 
  onUpdatePin, 
  onDeletePin,
  visibleColors 
}: Props) {
  const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];
  const [contextMenu, setContextMenu] = useState<{ latlng: LatLng, x: number, y: number } | null>(null);

  function MapEvents() {
    useMapEvents({
      contextmenu: (e) => {
        setContextMenu({
          latlng: e.latlng,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY
        });
      },
      click: () => {
        if (contextMenu) setContextMenu(null);
      },
      movestart: () => {
        if (contextMenu) setContextMenu(null);
      }
    });
    return null;
  }

  const handleSelectColor = (color: PinColor) => {
    if (contextMenu) {
      onAddPin(contextMenu.latlng, color);
      setContextMenu(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        crs={L.CRS.Simple} 
        bounds={bounds} 
        style={{ height: '100vh', width: '100%', background: '#1a1a1a' }}
        maxBounds={bounds}
      >
        <ImageOverlay url={activeMapUrl} bounds={bounds} />
        <MapEvents />
        
        {pins
        .filter(pin => visibleColors.has(pin.color))
        .map((pin) => (
            <Marker 
            key={pin.id} 
            position={pin.pos}
            icon={createColoredIcon(pin.color)} // Use the colored icon here
            >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <strong>{pin.label || 'No Label'}</strong>
                {pin.notes && <p className="text-xs m-0">{pin.notes}</p>}
            </Tooltip>
            <PinPopup 
                pin={pin} 
                onUpdatePin={onUpdatePin} 
                onDeletePin={onDeletePin} 
            />
            </Marker>
        ))}
      </MapContainer>

      {/* Custom Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="fixed z-[2000] bg-slate-900 border border-slate-700 rounded-md shadow-xl p-2 flex flex-col gap-1 min-w-[140px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          /* Requirement: Close when the mouse stops hovering */
          onMouseLeave={() => setContextMenu(null)}
        >
          <p className="text-[10px] uppercase font-bold text-slate-500 px-2 pt-1 pb-1 border-b border-slate-800 mb-1">
            New Pin Color
          </p>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleSelectColor(color)}
              className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 px-2 py-1.5 rounded transition-all text-white text-sm text-left"
            >
              <div 
                className="w-3 h-3 rounded-full border border-black border-opacity-20" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="capitalize font-medium">{color}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}