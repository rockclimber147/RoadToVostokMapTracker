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
  paths?: Path[]; // Added optional safety
  activeMapId: string;
  isPathingMode: boolean;
  onAddPin: (latlng: LatLng, color: PinColor, id: string) => void;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
  colorStates: Record<PinColor, number>;
  onAddPath: (latlng: LatLng) => void;
  selectedPathNode?: { pathId: string; index: number } | null;
  onSelectPathNode: (pathId: string, index: number) => void;
  onMovePathNode: (pathId: string, index: number, latlng: LatLng) => void;
  onDeletePathNode: (pathId: string, index: number) => void;
}

export default function GameMap({ 
  pins = [], 
  paths = [],
  activeMapId, 
  isPathingMode,
  onAddPin, 
  onAddPath,
  onUpdatePin, 
  onDeletePin,
  colorStates,
  selectedPathNode,
  onSelectPathNode,
  onMovePathNode,
  onDeletePathNode
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
        // Block the right-click menu if we are actively mapping a path
        if (isPathingMode) return; 
        
        setMenu({
          latlng: e.latlng,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY
        });
      },
      click: (e) => { 
        if (isPathingMode) {
          // Left click adds a waypoint to the active route
          onAddPath(e.latlng);
        } else if (menu) {
          setMenu(null);
        }
      },
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

        {/* 1. RENDER PATH LINES */}
        {paths.map((path) => (
          <Polyline 
            key={`line-${path.id}`}
            positions={path.points} 
            color={path.color} 
            weight={3}
            dashArray="8, 8" // Tactical dashed appearance
            opacity={0.8}
            interactive={false} // Prevents line from intercepting clicks
          />
        ))}

        {/* 2. RENDER PATH WAYPOINTS */}
        {paths.map((path) => 
          path.points.map((pos, idx) => {
            // Check if this specific node is currently selected
            const isSelected = selectedPathNode?.pathId === path.id && selectedPathNode?.index === idx;

            const nodeIcon = L.divIcon({
              className: 'bg-transparent outline-none',
              // Highlight the selected node with a thicker white border and slight scale increase
              html: `<div class="w-3 h-3 rounded-full transition-all ${
                isSelected ? 'border-[3px] border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border border-black/80 shadow-sm'
              }" style="background-color: ${path.color}"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });

            return (
              <Marker 
                key={`node-${path.id}-${idx}`}
                position={pos}
                icon={nodeIcon}
                interactive={isPathingMode} // Only clickable/draggable while Pathing Mode is active
                draggable={isPathingMode}
                eventHandlers={{
                  click: () => {
                    // Left click to select for insertion
                    if (isPathingMode) onSelectPathNode(path.id, idx);
                  },
                  contextmenu: () => {
                    // Right click to delete the node
                    if (isPathingMode) onDeletePathNode(path.id, idx);
                  },
                  dragend: (e) => {
                    // Update the coordinates when you finish dragging
                    if (isPathingMode) onMovePathNode(path.id, idx, e.target.getLatLng());
                  }
                }}
              />
            );
          })
        )}
        
        {/* 3. RENDER PINS */}
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

      {/* Deploy Menu (Disabled in Pathing Mode automatically via MapEvents) */}
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