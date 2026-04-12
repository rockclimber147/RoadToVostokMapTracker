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
  const [colorStates, setColorStates] = useLocalStorage<Record<PinColor, number>>(
    "color_visibility_states", 
    { red: 2, yellow: 2, orange: 2, green: 2, blue: 2, violet: 2 }
  );

  const cycleColorState = (color: PinColor) => {
    setColorStates({
      ...colorStates,
      [color]: (colorStates[color] + 1) % 3
    });
  };

  const currentPins = useMemo(() => allMapData[activeMap] || [], [allMapData, activeMap]);

  const savePins = (newPins: Pin[]) => {
    setAllMapData({ ...allMapData, [activeMap]: newPins });
  };

  const handleAddPin = (latlng: LatLng, color: PinColor, providedId?: string) => {
    const newPin: Pin = {
      id: providedId || crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng],
      color: color,
      label: '',
      notes: '',
      isVisible: true,
      showLabel: true
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
      .then(() => alert("ARCHIVE COPIED"))
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
      alert("LINK FAILED: INVALID DATA");
    }
  };

  const appendFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const incomingData: MapState = JSON.parse(text);

      if (typeof incomingData !== 'object' || incomingData === null) {
        alert("APPEND FAILED: Invalid data format");
        return;
      }

      const newData: MapState = { ...allMapData };

      Object.keys(incomingData).forEach((mapId) => {
        const existingPins = newData[mapId] || [];
        const incomingPins = incomingData[mapId] || [];
        const uniqueIncoming = incomingPins.filter(
          (inPin) => !existingPins.some((exPin) => exPin.id === inPin.id)
        );

        newData[mapId] = [...existingPins, ...uniqueIncoming];
      });

      setAllMapData(newData);
      alert("PINS APPENDED");
    } catch (err) {
      alert("APPEND ERROR: Check console");
      console.error(err);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black select-none">
      <Sidebar 
        activeMap={activeMap}
        setActiveMap={setActiveMap}
        colorStates={colorStates}
        onToggleColor={cycleColorState}
        onExport={exportToClipboard}
        onImport={importFromClipboard}
        onAppend={appendFromClipboard}
      />
      
      <GameMap 
        pins={currentPins}
        activeMapId={activeMap}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        colorStates={colorStates}
      />
    </div>
  );
}