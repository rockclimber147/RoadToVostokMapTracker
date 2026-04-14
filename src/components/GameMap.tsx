import { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor, type Path } from '../types';
import { GAME_MAPS } from '../constants/maps';
import PinPopup from './PinPopup';
import ContextMenu from './ContextMenu';
import { createColoredIcon } from '../utils/icons';
import 'leaflet/dist/leaflet.css';

interface Props {
  pins: Pin[];
  paths: Path[];
  activeMapId: string;
  onAddPin: (latlng: LatLng, color: PinColor, id: string) => void; // Updated signature
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  colorStates: Record<PinColor, number>;
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
  
  const paddedMaxBounds: L.LatLngBoundsExpression = [
    [-mapData.height * 0.5, -mapData.width * 0.5], 
    [mapData.height * 1.5, mapData.width * 1.5]
  ];

  const [menu, setMenu] = useState<{ latlng: LatLng, x: number, y: number } | null>(null);
  
  // Track the ID of the pin we just added to trigger the popup
  const [newestPinId, setNewestPinId] = useState<string | null>(null);

  const handleDeployPin = (latlng: LatLng, color: PinColor) => {
    const id = crypto.randomUUID();
    setNewestPinId(id);
    onAddPin(latlng, color, id);
    setMenu(null);
  };

  function MapEvents() {
    useMapEvents({
      contextmenu: (e) => {
        setMenu({
          latlng: e.latlng,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY
        });
      },
      click: () => { if (menu) setMenu(null); },
      movestart: () => { if (menu) setMenu(null); },
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
                key={`${pin.id}-${isFullState}`} 
                position={pin.pos}
                icon={createColoredIcon(pin.color)}
                eventHandlers={{
                  add: (e) => {
                    if (pin.id === newestPinId) {
                      e.target.openPopup();
                      setNewestPinId(null);
                    }
                  }
                }}
            >
                <Tooltip 
                  key={`tooltip-${pin.id}-${isFullState}`} 
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

      {menu && (
        <ContextMenu 
          x={menu.x} 
          y={menu.y} 
          onClose={() => setMenu(null)}
          onSelectColor={(color) => handleDeployPin(menu.latlng, color)}
        />
      )}
    </div>
  );
}