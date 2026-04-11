import { MapContainer, ImageOverlay, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor } from '../types';
import 'leaflet/dist/leaflet.css';

interface Props {
  pins: Pin[];
  activeMapUrl: string; // Dynamic map image
  onAddPin: (latlng: LatLng) => void;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  visibleColors: Set<PinColor>; // For the expand/collapse logic
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
        .filter(pin => visibleColors.has(pin.color)) // Handle expand/collapse
        .map((pin) => (
          <Marker 
            key={pin.id} 
            position={pin.pos}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <strong>{pin.label || 'No Label'}</strong>
              {pin.notes && <p style={{ fontSize: '0.8rem' }}>{pin.notes}</p>}
            </Tooltip>

            <Popup>
              <div className="pin-editor">
                <input 
                  value={pin.label}
                  placeholder="Label"
                  onChange={(e) => onUpdatePin(pin.id, { label: e.target.value })}
                />
                <textarea 
                  value={pin.notes}
                  placeholder="Notes..."
                  onChange={(e) => onUpdatePin(pin.id, { notes: e.target.value })}
                />
                <select 
                  value={pin.color} 
                  onChange={(e) => onUpdatePin(pin.id, { color: e.target.value as PinColor })}
                >
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  {/* ... other colors */}
                </select>
                <button onClick={() => onDeletePin(pin.id)}>Delete</button>
              </div>
            </Popup>
          </Marker>
      ))}
    </MapContainer>
  );
}