import LZString from 'lz-string';
import { type MapState, type MapExport } from '../types';

/**
 * Encodes state to a URL-safe Base64 string
 */
export const encodeData = (data: MapExport): string => {
  const json = JSON.stringify(data);
  // Prepend a "v2" header so the decoder knows this is LZ compressed
  return 'v2|' + LZString.compressToBase64(json);
};

export const decodeData = (payload: string): MapExport => {
  if (payload.startsWith('v2|')) {
    // Decode the new compressed format
    const compressedStr = payload.slice(3); 
    const json = LZString.decompressFromBase64(compressedStr);
    return JSON.parse(json);
  } else {
    // Fallback: Run your exact original decode logic for old Base64 strings!
    const json = decodeURIComponent(Array.prototype.map.call(atob(payload), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  }
};

// Helper: Rounds coordinates to 2 decimal places (perfect for CRS.Simple)
const roundCoord = (num: number) => Math.round(num * 100) / 100;

/**
 * Transforms live state into lean export format
 */
export const packageForExport = (allMapData: MapState): MapExport => {
  const exportData: MapExport = {};

  Object.keys(allMapData).forEach((mapId) => {
    const data = allMapData[mapId];

    // 1. Skip completely empty maps
    if ((!data.pins || data.pins.length === 0) && (!data.paths || data.paths.length === 0)) {
      return; 
    }

    const mapExport: any = {};

    // 2. Prune Pins
    if (data.pins && data.pins.length > 0) {
      mapExport.pi = data.pins.map(pin => {
        const p: any = { p: [roundCoord(pin.pos[0]), roundCoord(pin.pos[1])] };
        
        // Only attach properties if they deviate from the defaults
        if (pin.color !== 'red') p.c = pin.color;
        if (pin.label) p.l = pin.label;
        if (pin.notes) p.n = pin.notes;
        
        return p;
      });
    }

    // 3. Prune Paths
    if (data.paths && data.paths.length > 0) {
      mapExport.pa = data.paths.map(path => {
        const expPath: any = {
          pts: path.points.map(pt => [roundCoord(pt[0]), roundCoord(pt[1])])
        };
        
        // Only attach properties if they deviate from the defaults
        if (path.color !== 'red') expPath.c = path.color;
        if (path.label && path.label !== 'ROUTE') expPath.l = path.label;
        if (path.isVisible === false) expPath.v = 0; // Use 0 instead of false for fewer bytes
        
        return expPath;
      });
    }

    exportData[mapId] = mapExport;
  });

  return exportData;
};

/**
 * Transforms lean export format back into full application state
 */
export const rehydrateData = (incoming: any): MapState => {
  const state: MapState = {};

  Object.keys(incoming).forEach((mapId) => {
    const entry = incoming[mapId];

    const legacyPins = Array.isArray(entry) ? entry : (entry.pi || []);
    const legacyPaths = Array.isArray(entry) ? [] : (entry.pa || []);

    state[mapId] = {
      pins: legacyPins.map((exp: any) => ({
        id: crypto.randomUUID(),
        pos: exp.p || exp.pos, 
        color: exp.c || exp.color || 'red', // Restore default if missing
        label: exp.l || exp.label || '',    // Restore empty string if missing
        notes: exp.n || exp.notes || '',
        isVisible: true,
        showLabel: true
      })),
      paths: legacyPaths.map((exp: any) => ({
        id: crypto.randomUUID(),
        points: exp.pts,
        color: exp.c || 'red',
        label: exp.l === undefined ? (exp.label || 'ROUTE') : exp.l, 
        isVisible: exp.v !== 0 && exp.v !== false // 0, false, or undefined
      }))
    };
  });

  return state;
};