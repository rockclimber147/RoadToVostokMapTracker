// src/components/GameMap.tsx
import { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor } from '../types';
import { GAME_MAPS } from '../constants/maps';
import PinPopup from './PinPopup';
import ContextMenu from './ContextMenu';
import { createColoredIcon } from '../utils/icons';
import 'leaflet/dist/leaflet.css';

interface Props {
  pins: Pin[];
  activeMapId: string;
  onAddPin: (latlng: LatLng, color: PinColor) => void;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  colorStates: Record<PinColor, number>; // Updated to handle tri-state
}

export default function GameMap({ 
  pins, 
  activeMapId, 
  onAddPin, 
  onUpdatePin, 
  onDeletePin,
  colorStates 
}: Props) {
  const mapData = GAME_MAPS[activeMapId] || GAME_MAPS['map1'];
  const bounds: L.LatLngBoundsExpression = [[0, 0], [mapData.height, mapData.width]];
  
  // Dynamic buffer zone for panning
  const paddedMaxBounds: L.LatLngBoundsExpression = [
    [-mapData.height * 0.5, -mapData.width * 0.5], 
    [mapData.height * 1.5, mapData.width * 1.5]
  ];

  const [menu, setMenu] = useState<{ latlng: LatLng, x: number, y: number } | null>(null);

  function MapEvents() {
    useMapEvents({
      contextmenu: (e) => {
        setMenu({
          latlng: e.latlng,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY
        });
      },
      click: () => {
        if (menu) setMenu(null);
      },
      movestart: () => {
        if (menu) setMenu(null);
      },
    });
    return null;
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <MapContainer 
        key={activeMapId}
        crs={L.CRS.Simple} 
        bounds={bounds} 
        className="h-screen w-screen bg-black"
        maxBounds={paddedMaxBounds}
        maxBoundsViscosity={0.5}
        zoomControl={false}
        minZoom={-2}
        attributionControl={false}
      >
        <ImageOverlay url={mapData.url} bounds={bounds} />
        <MapEvents />
        
        {pins
        .filter(pin => colorStates[pin.color] > 0)
        .map((pin) => {
            const globalState = colorStates[pin.color];
            const isFullState = globalState === 2;

            return (
            <Marker 
                key={`${pin.id}-${isFullState}`} // ADD isFullState TO THE KEY
                position={pin.pos}
                icon={createColoredIcon(pin.color)}
            >
                <Tooltip 
                key={`tooltip-${pin.id}-${isFullState}`} // ADD KEY HERE TOO
                direction="top" 
                offset={[0, -20]} 
                opacity={1}
                permanent={isFullState} 
                className="custom-tooltip"
                >
                <div className="px-1 py-0.5">
                    <div className="text-[10px] font-black tracking-[0.15em] uppercase text-[#E0E0E0]">
                    {pin.label || (isFullState ? 'UNIDENTIFIED' : '')}
                    </div>
                    {pin.notes && (
                    <div className="notes-section text-[9px] mt-1 opacity-50 tracking-wide lowercase italic border-t border-white/10 pt-1">
                        {pin.notes}
                    </div>
                    )}
                </div>
                </Tooltip>
                <PinPopup 
                pin={pin} 
                onUpdatePin={onUpdatePin} 
                onDeletePin={onDeletePin} 
                />
            </Marker>
            );
        })}
      </MapContainer>

      {/* Deploy Menu */}
      {menu && (
        <ContextMenu 
          x={menu.x} 
          y={menu.y} 
          onClose={() => setMenu(null)}
          onSelectColor={(color) => {
            onAddPin(menu.latlng, color);
            setMenu(null);
          }}
        />
      )}
    </div>
  );
}