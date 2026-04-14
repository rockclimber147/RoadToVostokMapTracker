// src/App.tsx
import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar'; 
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState } from './types';
import { LatLng } from 'leaflet';
import { 
  encodeData, 
  decodeData, 
  packageForExport, 
  rehydrateData 
} from './utils/serialization';

export default function App() {
  // Note: If you have existing data, you might need to clear localStorage 
  // or add a migration check because the structure changed from Pin[] to MapData
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");
  
  const [colorStates, setColorStates] = useLocalStorage<Record<PinColor, number>>(
    "color_visibility_states", 
    { red: 2, yellow: 2, orange: 2, green: 2, blue: 2, violet: 2 }
  );

  // Selector for current map data
  const mapData = useMemo(() => {
    const rawData = allMapData[activeMap];

    // CASE 1: Empty state
    if (!rawData) {
      return { pins: [], paths: [] };
    }

    // CASE 2: Legacy data (it's just an array of pins)
    if (Array.isArray(rawData)) {
      return { 
        pins: rawData, 
        paths: [] 
      };
    }

    return {
      pins: rawData.pins ?? [],
      paths: rawData.paths ?? []
    };
  }, [allMapData, activeMap]);

  const saveMapData = (updates: Partial<{ pins: Pin[], paths: any[] }>) => {
    setAllMapData({
      ...allMapData,
      [activeMap]: { ...mapData, ...updates }
    });
  };

  const handleAddPin = (latlng: LatLng, color: PinColor, providedId?: string) => {
    const newPin: Pin = {
      id: providedId || crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng],
      color,
      label: '',
      notes: '',
      isVisible: true,
      showLabel: true
    };
    saveMapData({ pins: [...mapData.pins, newPin] });
  };

  const exportToClipboard = () => {
    try {
      const packaged = packageForExport(allMapData);
      const encoded = encodeData(packaged);
      navigator.clipboard.writeText(encoded)
        .then(() => alert("TACTICAL DATA PACKAGED"))
        .catch(err => console.error(err));
    } catch (e) {
      alert("EXPORT FAILED");
    }
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const decoded = decodeData(text.trim());
      
      if (!window.confirm("PURGE LOCAL CACHE AND OVERWRITE?")) return;
      
      const hydrated = rehydrateData(decoded);
      setAllMapData(hydrated);
      alert("SYSTEM OVERWRITE SUCCESSFUL");
    } catch (e) {
      alert("LINK FAILED: INVALID DATA");
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

        // Deduplicate pins by position
        const uniquePins = incoming.pins.filter(inPin => 
          !existing.pins.some(exPin => 
            exPin.pos[0] === inPin.pos[0] && exPin.pos[1] === inPin.pos[1]
          )
        );

        mergedState[mapId] = {
          pins: [...existing.pins, ...uniquePins],
          paths: [...existing.paths, ...incoming.paths]
        };
      });

      setAllMapData(mergedState);
      alert("DATA MERGED");
    } catch (e) {
      alert("APPEND FAILED");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black select-none">
      <Sidebar 
        activeMap={activeMap}
        setActiveMap={setActiveMap}
        colorStates={colorStates}
        onToggleColor={(c) => setColorStates({...colorStates, [c]: (colorStates[c] + 1) % 3})}
        onExport={exportToClipboard}
        onImport={importFromClipboard}
        onAppend={appendFromClipboard}
      />
      
      <GameMap 
        pins={mapData.pins}
        paths={mapData.paths}
        activeMapId={activeMap}
        onAddPin={handleAddPin}
        onUpdatePin={(id, upd) => saveMapData({ pins: mapData.pins.map(p => p.id === id ? {...p, ...upd} : p) })}
        onDeletePin={(id) => saveMapData({ pins: mapData.pins.filter(p => p.id !== id) })}
        colorStates={colorStates}
      />
    </div>
  );
}