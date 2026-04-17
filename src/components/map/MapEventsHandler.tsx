import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface MapEventsHandlerProps {
  isPathingMode: boolean;
  menu: { latlng: LatLng, x: number, y: number } | null;
  setMenu: (menu: { latlng: LatLng, x: number, y: number } | null) => void;
  onAddPath: (latlng: LatLng) => void;
}

export default function MapEventsHandler({ isPathingMode, menu, setMenu, onAddPath }: MapEventsHandlerProps) {
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