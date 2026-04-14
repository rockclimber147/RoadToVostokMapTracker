// src/utils/serialization.ts
import { type MapState, type MapExport, type Pin, type Path } from '../types';

/**
 * Encodes state to a URL-safe Base64 string
 */
export const encodeData = (data: MapExport): string => {
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));
};

/**
 * Decodes Base64 string to MapExport structure
 */
export const decodeData = (base64: string): MapExport => {
  const json = decodeURIComponent(Array.prototype.map.call(atob(base64), (c: string) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(json);
};

/**
 * Transforms live state into lean export format
 */
export const packageForExport = (allMapData: MapState): MapExport => {
  const exportData: MapExport = {};

  Object.keys(allMapData).forEach((mapId) => {
    const data = allMapData[mapId];
    exportData[mapId] = {
      pi: (data.pins || []).map(pin => ({
        p: pin.pos,
        c: pin.color,
        l: pin.label,
        n: pin.notes
      })),
      pa: (data.paths || []).map(path => ({
        pts: path.points,
        c: path.color,
        l: path.label,
        v: path.isVisible
      }))
    };
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

    const legacyPins = Array.isArray(entry) ? entry : entry.pi;
    const legacyPaths = Array.isArray(entry) ? [] : (entry.pa || []);

    state[mapId] = {
      pins: (legacyPins || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        // Handle both old 'pos' and new shorthand 'p'
        pos: exp.p || exp.pos, 
        color: exp.c || exp.color,
        label: exp.l || exp.label,
        notes: exp.n || exp.notes,
        isVisible: true,
        showLabel: false
      })),
      paths: (legacyPaths || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        points: exp.pts,
        color: exp.c || 'red',
        label: exp.l || 'ROUTE',
        isVisible: exp.v !== false
      }))
    };
  });

  return state;
};