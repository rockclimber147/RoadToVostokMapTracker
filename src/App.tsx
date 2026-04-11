// src/App.tsx
import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState } from './types';
import { LatLng } from 'leaflet';

export default function App() {
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");
  const [visibleColors, setVisibleColors] = useState<Set<PinColor>>(
    new Set(['red', 'yellow', 'orange', 'green', 'blue', 'violet'])
  );

  const currentPins = useMemo(() => allMapData[activeMap] || [], [allMapData, activeMap]);

  const savePins = (newPins: Pin[]) => {
    setAllMapData({ ...allMapData, [activeMap]: newPins });
  };

  const handleAddPin = (latlng: LatLng) => {
    const newPin: Pin = {
      id: crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng],
      color: 'red',
      label: '',
      notes: '',
      isVisible: true
    };
    savePins([...currentPins, newPin]);
  };

  const handleUpdatePin = (id: string, updates: Partial<Pin>) => {
    savePins(currentPins.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePin = (id: string) => {
    savePins(currentPins.filter(p => p.id !== id));
  };

  const exportToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(allMapData))
      .then(() => alert("Data copied!"))
      .catch(err => console.error(err));
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        setAllMapData(parsed);
      }
    } catch (err) {
      alert("Invalid JSON data");
    }
  };

  const toggleColorVisibility = (color: PinColor) => {
    const next = new Set(visibleColors);
    next.has(color) ? next.delete(color) : next.add(color);
    setVisibleColors(next);
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      <Sidebar 
        activeMap={activeMap}
        setActiveMap={setActiveMap}
        visibleColors={visibleColors}
        onToggleColor={toggleColorVisibility}
        onExport={exportToClipboard}
        onImport={importFromClipboard}
      />
      
      <GameMap 
        pins={currentPins}
        activeMapUrl={`/maps/${activeMap}.jpg`}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        visibleColors={visibleColors}
      />
    </div>
  );
}