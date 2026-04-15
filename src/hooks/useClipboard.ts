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
        .then(() => alert("Data copied to clipboard"))
        .catch(err => console.error(err));
    } catch (e) {
      alert("copy failed, check console");
    }
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const decoded = decodeData(text.trim());
      
      if (!window.confirm("PURGE LOCAL CACHE AND OVERWRITE?")) return;
      
      const hydrated = rehydrateData(decoded);
      setAllMapData(hydrated);
      alert("data overwritten");
    } catch (e) {
      alert("could not import");
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

        // Deduplicate pins by exact coordinate match
        const uniquePins = incoming.pins.filter(inPin => 
          !existing.pins.some(exPin => 
            exPin.pos[0] === inPin.pos[0] && exPin.pos[1] === inPin.pos[1]
          )
        );

        // Deduplicate paths by exact sequence and coordinate match
        const uniquePaths = incoming.paths.filter(inPath => 
          !existing.paths.some(exPath => 
            exPath.points.length === inPath.points.length &&
            exPath.points.every((exPt, idx) => 
              exPt[0] === inPath.points[idx][0] && exPt[1] === inPath.points[idx][1]
            )
          )
        );

        mergedState[mapId] = {
          pins: [...existing.pins, ...uniquePins],
          paths: [...existing.paths, ...uniquePaths] // Inject unique paths here
        };
      });

      setAllMapData(mergedState);
      alert("data appended");
    } catch (e) {
      alert("append failed");
    }
  };

  return { exportToClipboard, importFromClipboard, appendFromClipboard };
}