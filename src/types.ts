export type PinColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';

export interface Pin {
  id: string; // Use crypto.randomUUID()
  pos: [number, number];
  color: PinColor;
  label: string;
  notes: string;
  isVisible: boolean;
  showLabel: boolean;
}

export interface PinExport {
  p: [number, number]; // shorthand for pos
  c: PinColor;         // shorthand for color
  l: string;           // shorthand for label
  n: string;           // shorthand for notes
}

export type MapExport = Record<string, PinExport[]>;

export interface MapState {
  [mapId: string]: Pin[];
}