// src/hooks/useClipboard.ts
import { type MapState } from '../types';
import { 
  encodeData, 
  decodeData, 
  packageForExport, 
  rehydrateData 
} from '../utils/serialization';

export function useClipboard(
  allMapData: MapState, 
  setAllMapData: (data: MapState) => void
) {
  const exportToClipboard = () => {
    try {
      const packaged = packageForExport(allMapData);
      const encoded = encodeData(packaged);
      navigator.clipboard.writeText(encoded)
        .then(() => alert("TACTICAL DATA PACKAGED"))
        .catch(err => console.error(err));
    } catch (e) {
      alert("EXPORT FAILED");
    }
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const decoded = decodeData(text.trim());
      
      if (!window.confirm("PURGE LOCAL CACHE AND OVERWRITE?")) return;
      
      const hydrated = rehydrateData(decoded);
      setAllMapData(hydrated);
      alert("SYSTEM OVERWRITE SUCCESSFUL");
    } catch (e) {
      alert("LINK FAILED: INVALID DATA");
    }
  };

  const appendFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const decoded = decodeData(text.trim());
      const incomingState = rehydrateData(decoded);

      const mergedState: MapState = { ...allMapData };

      Object.keys(incomingState).forEach(mapId => {
        const existing = mergedState[mapId] || { pins: [], paths: [] };
        const incoming = incomingState[mapId];

        const uniquePins = incoming.pins.filter(inPin => 
          !existing.pins.some(exPin => 
            exPin.pos[0] === inPin.pos[0] && exPin.pos[1] === inPin.pos[1]
          )
        );

        mergedState[mapId] = {
          pins: [...existing.pins, ...uniquePins],
          paths: [...existing.paths, ...incoming.paths]
        };
      });

      setAllMapData(mergedState);
      alert("DATA MERGED");
    } catch (e) {
      alert("APPEND FAILED");
    }
  };

  return { exportToClipboard, importFromClipboard, appendFromClipboard };
}