import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar'; // Fixed casing
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState } from './types';
import { LatLng } from 'leaflet';

export default function App() {
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");
  
  // Requirement: Tri-state visibility (0: hidden, 1: pin only, 2: pin + label)
  const [colorStates, setColorStates] = useState<Record<PinColor, number>>({
    red: 2, yellow: 2, orange: 2, green: 2, blue: 2, violet: 2
  });

  const cycleColorState = (color: PinColor) => {
    setColorStates(prev => ({
      ...prev,
      [color]: (prev[color] + 1) % 3
    }));
  };

  const currentPins = useMemo(() => allMapData[activeMap] || [], [allMapData, activeMap]);

  const savePins = (newPins: Pin[]) => {
    setAllMapData({ ...allMapData, [activeMap]: newPins });
  };

  const handleAddPin = (latlng: LatLng, color: PinColor) => {
    const newPin: Pin = {
      id: crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng],
      color: color,
      label: '',
      notes: '',
      isVisible: true,
      showLabel: true // Default newly placed pins to show labels
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
      .then(() => alert("Archive Copied"))
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
      alert("Link Failed: Invalid Data");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      <Sidebar 
        activeMap={activeMap}
        setActiveMap={setActiveMap}
        colorStates={colorStates} // Passing the Record instead of the Set
        onToggleColor={cycleColorState} // Passing the Cycle function
        onExport={exportToClipboard}
        onImport={importFromClipboard}
      />
      
      <GameMap 
        pins={currentPins}
        activeMapId={activeMap}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        colorStates={colorStates} // Passing the Record to the map
      />
    </div>
  );
}