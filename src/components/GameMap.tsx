// src/components/GameMap.tsx
import { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Tooltip, Polyline, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor, type Path } from '../types';
import { GAME_MAPS } from '../constants/maps';
import PinPopup from './PinPopup';
import ContextMenu from './ContextMenu';
import { createColoredIcon } from '../utils/icons';
import 'leaflet/dist/leaflet.css';

interface Props {
  pins?: Pin[];
  paths?: Path[];
  activeMapId: string;
  isPathingMode: boolean;
  selectedPathNode?: { pathId: string; index: number } | null;
  onAddPin: (latlng: LatLng, color: PinColor, id: string) => void;
  onAddPath: (latlng: LatLng) => void;
  onSelectPathNode: (pathId: string, index: number) => void;
  onMovePathNode: (pathId: string, index: number, latlng: LatLng) => void;
  onDeletePathNode: (pathId: string, index: number) => void;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  colorStates: Record<PinColor, number>;
}

export default function GameMap({ 
  pins = [], 
  paths = [],
  activeMapId, 
  isPathingMode,
  selectedPathNode,
  onAddPin, 
  onAddPath,
  onSelectPathNode,
  onMovePathNode,
  onDeletePathNode,
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
        if (isPathingMode) return; 
        setMenu({
          latlng: e.latlng,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY
        });
      },
      click: (e) => { 
        if (isPathingMode) {
          onAddPath(e.latlng);
        } else if (menu) {
          setMenu(null);
        }
      },
      movestart: () => { if (menu) setMenu(null); },
    });
    return null;
  }

  const activePaths = paths.filter(path => 
    path.isVisible && colorStates[path.color] > 0
  );

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

        {/* 1. RENDER PATH LINES */}
        {activePaths.map((path) => (
          <Polyline 
            key={`line-${path.id}-${path.color}`}
            positions={path.points} 
            color={path.color} 
            weight={3}
            dashArray="8, 8"
            opacity={0.8}
            interactive={false}
          />
        ))}

        {/* 2. RENDER PATH WAYPOINTS & START LABEL */}
        {activePaths.map((path) => {
          const isFullState = colorStates[path.color] === 2;

          return path.points.map((pos, idx) => {
            // OPTIMIZATION: If not pathing, ONLY render the first node (to hold the label)
            if (!isPathingMode && idx !== 0) return null;

            const isSelected = selectedPathNode?.pathId === path.id && selectedPathNode?.index === idx;

            // When pathing is OFF, the HTML is empty to hide the pip
            const pipHtml = isPathingMode 
              ? `<div class="w-3 h-3 rounded-full transition-all ${
                  isSelected ? 'border-[3px] border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border border-black/80 shadow-sm'
                }" style="background-color: ${path.color}"></div>`
              : `<div></div>`;

            const nodeIcon = L.divIcon({
              className: 'bg-transparent outline-none',
              html: pipHtml,
              // Collapse the anchor to 0x0 when not pathing so the label sits perfectly on the line
              iconSize: isPathingMode ? [12, 12] : [0, 0],
              iconAnchor: isPathingMode ? [6, 6] : [0, 0]
            });

            return (
              <Marker 
                key={`node-${path.id}-${idx}-${path.color}-${isPathingMode}`}
                position={pos}
                icon={nodeIcon}
                interactive={isPathingMode}
                draggable={isPathingMode}
                eventHandlers={{
                  click: () => { if (isPathingMode) onSelectPathNode(path.id, idx); },
                  contextmenu: () => { if (isPathingMode) onDeletePathNode(path.id, idx); },
                  dragend: (e) => { if (isPathingMode) onMovePathNode(path.id, idx, e.target.getLatLng()); }
                }}
              >
                {/* START LABEL */}
                {idx === 0 && path.label && (
                  <Tooltip 
                    key={`pathtooltip-${path.id}-${isFullState}`}
                    direction="top" 
                    // Adjust offset dynamically based on whether the pip is taking up space
                    offset={isPathingMode ? [0, -10] : [0, 0]} 
                    opacity={1}
                    permanent={isFullState} 
                    className="custom-tooltip"
                  >
                    <div className="px-1 py-0.5">
                      <div className="text-[10px] font-black tracking-[0.15em] uppercase text-[#E0E0E0]" style={{ color: path.color }}>
                        {path.label}
                      </div>
                    </div>
                  </Tooltip>
                )}
              </Marker>
            );
          });
        })}
        
        {/* 3. RENDER PINS */}
        {pins
          .filter(pin => colorStates[pin.color] > 0)
          .map((pin) => {
            const isFullState = colorStates[pin.color] === 2;

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