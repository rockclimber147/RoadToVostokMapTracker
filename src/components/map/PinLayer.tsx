import MarkerClusterGroup from 'react-leaflet-cluster';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { type Pin, type PinColor } from '../../types';
import PinPopup from '../PinPopup';
import { createColoredIcon } from '../../utils/icons';

interface PinLayerProps {
  pins: Pin[];
  colorStates: Record<PinColor, number>;
  onUpdatePin: (id: string, updates: Partial<Pin>) => void;
  onDeletePin: (id: string) => void;
}

export default function PinLayer({ pins, colorStates, onUpdatePin, onDeletePin }: PinLayerProps) {
  const createClusterIcon = (cluster: any) => {
    const children = cluster.getAllChildMarkers();

    const visibleLabels = children
      .map((marker: any) => marker.getIcon()?.options || {})
      .filter((opts: any) => opts.showLabel);

    const labelsHtml = visibleLabels.slice(0, 3).map((opts: any) => {
      return `<div class="text-[9px] font-black tracking-[0.1em] uppercase bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap mb-0.5" style="color: ${opts.pinColor};">
                ${opts.pinLabel || 'UNIDENTIFIED'}
              </div>`;
    }).join('');

    const hiddenCount = visibleLabels.length - 3;
    const extraHtml = hiddenCount > 0 
      ? `<div class="text-[8px] font-bold text-gray-400 tracking-wider uppercase mb-1">+${hiddenCount} more</div>` 
      : '';

    return L.divIcon({
      html: `
        <div class="relative flex flex-col items-center justify-center">
          <div class="absolute bottom-full mb-1 flex flex-col items-center pointer-events-none z-50">
            ${labelsHtml}
            ${extraHtml}
          </div>
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border-2 border-[#E0E0E0] text-[#E0E0E0] text-[10px] font-black shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            ${cluster.getChildCount()}
          </div>
        </div>
      `,
      className: 'bg-transparent',
      iconSize: L.point(32, 32, true),
      iconAnchor: [16, 16],
    });
  };

  return (
    <MarkerClusterGroup
      chunkedLoading={true}
      maxClusterRadius={50}
      iconCreateFunction={createClusterIcon}
      showCoverageOnHover={false}
    >
      {pins
        .filter(pin => colorStates[pin.color] > 0)
        .map((pin) => {
          const isFullState = colorStates[pin.color] === 2;

          const pinIcon = createColoredIcon(pin.color);
          Object.assign(pinIcon.options, {
            pinLabel: pin.label,
            pinColor: pin.color,
            showLabel: isFullState
          });

          return (
            <Marker 
              key={`pin-${pin.id}-${isFullState}`} 
              position={pin.pos}
              icon={pinIcon}
            >
              <Tooltip 
                key={`tooltip-${pin.id}-${isFullState}-${Math.random()}`} 
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
    </MarkerClusterGroup>
  );
}