export type PinColor = 'red' | 'yellow' | 'orange' | 'green' | 'blue' | 'violet';

export interface Pin {
  id: string; // Use crypto.randomUUID()
  pos: [number, number];
  color: PinColor;
  label: string;
  notes: string;
  isVisible: boolean;
}

export interface MapState {
  [mapId: string]: Pin[];
}