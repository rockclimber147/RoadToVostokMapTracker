// src/App.tsx
import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar'; 
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState, type MapExport } from './types';
import { LatLng } from 'leaflet';


const encodeData = (data: MapExport): string => {
  const json = JSON.stringify(data);
  // btoa alone fails on non-ASCII; this ensures it's safe for all characters
  return btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));
};

const decodeData = (base64: string): MapExport => {
  const json = decodeURIComponent(Array.prototype.map.call(atob(base64), (c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(json);
};


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
    const exportData: MapExport = {};

    Object.keys(allMapData).forEach((mapId) => {
      exportData[mapId] = allMapData[mapId].map(pin => ({
        p: pin.pos,
        c: pin.color,
        l: pin.label,
        n: pin.notes
      }));
    });

    try {
      const encoded = encodeData(exportData);
      navigator.clipboard.writeText(encoded)
        .then(() => alert("data copied to clipboard"))
        .catch(err => console.error(err));
    } catch (err) {
      alert("PACKAGING FAILED");
    }
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const incomingData = decodeData(text.trim());

      if (typeof incomingData !== 'object' || incomingData === null) {
        throw new Error("Invalid Format");
      }

      const rehydratedData: MapState = {};

      Object.keys(incomingData).forEach((mapId) => {
        rehydratedData[mapId] = incomingData[mapId].map(exp => ({
          id: crypto.randomUUID(),
          pos: exp.p,
          color: exp.c,
          label: exp.l,
          notes: exp.n,
          isVisible: true,
          showLabel: false
        }));
      });

      setAllMapData(rehydratedData);
      alert("data overwritten");
    } catch (err) {
      alert("DECODING FAILED: invalid data");
    }
  };

  const appendFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const incomingData = decodeData(text.trim());

      if (typeof incomingData !== 'object' || incomingData === null) {
        alert("APPEND FAILED: Invalid data format");
        return;
      }

      const newData: MapState = { ...allMapData };

      Object.keys(incomingData).forEach((mapId) => {
        const existingPins = newData[mapId] || [];
        
        const uniqueIncoming: Pin[] = incomingData[mapId]
          .map(exp => ({
            id: crypto.randomUUID(),
            pos: exp.p,
            color: exp.c,
            label: exp.l,
            notes: exp.n,
            isVisible: true,
            showLabel: false
          }))
          .filter(inPin => 
            !existingPins.some(exPin => 
              exPin.pos[0] === inPin.pos[0] && exPin.pos[1] === inPin.pos[1]
            )
          );

        newData[mapId] = [...existingPins, ...uniqueIncoming];
      });

      setAllMapData(newData);
      alert("data appended");
    } catch (err) {
      alert("APPEND ERROR: check console");
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
