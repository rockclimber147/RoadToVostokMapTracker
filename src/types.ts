export type PinColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';

export interface Pin {
  id: string;
  pos: [number, number];
  color: PinColor;
  label: string;
  notes: string;
  isVisible: boolean;
  showLabel: boolean;
}

export interface Path {
  id: string;
  points: [number, number][];
  color: PinColor;
  label: string;
}

// Serialization Shorthands
export interface PinExport {
  p: [number, number]; // pos
  c: PinColor;        // color
  l: string;          // label
  n: string;          // notes
}

export interface PathExport {
  pts: [number, number][]; // points
  c: PinColor;             // color
  l: string;               // label
}

export interface MapExport {
  [mapId: string]: {
    pi: PinExport[]; // pins
    pa: PathExport[]; // paths
  };
}

export interface MapData {
  pins: Pin[];
  paths: Path[];
}

export interface MapState {
  [mapId: string]: MapData;
}