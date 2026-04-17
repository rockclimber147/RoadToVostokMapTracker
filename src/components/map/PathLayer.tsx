import { Polyline, Marker, Tooltip } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { type Path, type PinColor } from '../../types';

interface PathLayerProps {
  activePaths: Path[];
  isPathingMode: boolean;
  selectedPathNode?: { pathId: string; index: number } | null;
  colorStates: Record<PinColor, number>;
  onSelectPathNode: (pathId: string, index: number) => void;
  onMovePathNode: (pathId: string, index: number, latlng: LatLng) => void;
  onDeletePathNode: (pathId: string, index: number) => void;
}

export default function PathLayer({
  activePaths,
  isPathingMode,
  selectedPathNode,
  colorStates,
  onSelectPathNode,
  onMovePathNode,
  onDeletePathNode
}: PathLayerProps) {
  return (
    <>
      {/* RENDER PATH LINES */}
      {activePaths.map((path) => (
        <Polyline 
          key={`line-${path.id}-${path.color}`}
          positions={path.points} 
          color={path.color} 
          weight={3}
          opacity={0.8}
          interactive={false}
        />
      ))}

      {/* RENDER PATH WAYPOINTS & START LABEL */}
      {activePaths.map((path) => {
        const isFullState = colorStates[path.color] === 2;

        return path.points.map((pos, idx) => {
          if (!isPathingMode && idx !== 0) return null;

          const isSelected = selectedPathNode?.pathId === path.id && selectedPathNode?.index === idx;

          const pipHtml = isPathingMode 
            ? `<div class="w-3 h-3 rounded-full transition-all ${
                isSelected ? 'border-[3px] border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border border-black/80 shadow-sm'
              }" style="background-color: ${path.color}"></div>`
            : `<div></div>`;

          const nodeIcon = L.divIcon({
            className: 'bg-transparent outline-none',
            html: pipHtml,
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
              {idx === 0 && path.label && (
                <Tooltip 
                  key={`pathtooltip-${path.id}-${isFullState}`}
                  direction="top" 
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
    </>
  );
}