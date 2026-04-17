// src/components/GameMap.tsx
import { useState } from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Pin, type PinColor, type Path } from '../types';
import { GAME_MAPS } from '../constants/maps';
import ContextMenu from './ContextMenu';
import MapEventsHandler from './map/MapEventsHandler';
import PathLayer from './map/PathLayer';
import PinLayer from './map/PinLayer';
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

  const handleDeployPin = (latlng: LatLng, color: PinColor) => {
    const id = crypto.randomUUID();
    onAddPin(latlng, color, id);
    setMenu(null);
  };

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
        maxZoom={10}
        zoomSnap={0.1}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={120}
        attributionControl={false}
      >
        <ImageOverlay url={mapData.url} bounds={bounds} />
        
        <MapEventsHandler 
          isPathingMode={isPathingMode}
          menu={menu}
          setMenu={setMenu}
          onAddPath={onAddPath}
        />

        <PathLayer 
          activePaths={activePaths}
          isPathingMode={isPathingMode}
          selectedPathNode={selectedPathNode}
          colorStates={colorStates}
          onSelectPathNode={onSelectPathNode}
          onMovePathNode={onMovePathNode}
          onDeletePathNode={onDeletePathNode}
        />

        <PinLayer 
          pins={pins}
          colorStates={colorStates}
          onUpdatePin={onUpdatePin}
          onDeletePin={onDeletePin}
        />
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