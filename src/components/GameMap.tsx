// src/components/GameMap.tsx
import { MapContainer, ImageOverlay, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor } from '../types';
import PinPopup from './PinPopup'; // Import our new component
import 'leaflet/dist/leaflet.css';

interface Props {
  pins: Pin[];
  activeMapUrl: string;
  onAddPin: (latlng: LatLng) => void;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  visibleColors: Set<PinColor>;
}

function MapEvents({ onAddPin }: { onAddPin: (latlng: LatLng) => void }) {
  useMapEvents({
    contextmenu: (e) => onAddPin(e.latlng),
  });
  return null;
}

export default function GameMap({ 
  pins, 
  activeMapUrl, 
  onAddPin, 
  onUpdatePin, 
  onDeletePin,
  visibleColors 
}: Props) {
  const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

  return (
    <MapContainer 
      crs={L.CRS.Simple} 
      bounds={bounds} 
      style={{ height: '100vh', width: '100%', background: '#1a1a1a' }}
      maxBounds={bounds}
    >
      <ImageOverlay url={activeMapUrl} bounds={bounds} />
      <MapEvents onAddPin={onAddPin} />
      
      {pins
        .filter(pin => visibleColors.has(pin.color))
        .map((pin) => (
          <Marker key={pin.id} position={pin.pos}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <strong>{pin.label || 'No Label'}</strong>
              {pin.notes && <p className="text-xs m-0">{pin.notes}</p>}
            </Tooltip>

            {/* Clean delegation of logic */}
            <PinPopup 
              pin={pin} 
              onUpdatePin={onUpdatePin} 
              onDeletePin={onDeletePin} 
            />
          </Marker>
      ))}
    </MapContainer>
  );
}