// src/App.tsx
import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar'; 
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePathing } from './hooks/usePathing';
import { useClipboard } from './hooks/useClipboard';
import { type Pin, type PinColor, type MapState } from './types';
import { LatLng } from 'leaflet';

export default function App() {
  // 1. Storage & Global State
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");
  const [colorStates, setColorStates] = useLocalStorage<Record<PinColor, number>>(
    "color_visibility_states", 
    { red: 2, yellow: 2, orange: 2, green: 2, blue: 2, violet: 2 }
  );

  // 2. Data Selectors
  const mapData = useMemo(() => {
    const rawData = allMapData[activeMap];
    if (!rawData) return { pins: [], paths: [] };
    if (Array.isArray(rawData)) return { pins: rawData, paths: [] };
    return { pins: rawData.pins ?? [], paths: rawData.paths ?? [] };
  }, [allMapData, activeMap]);

  const saveMapData = (updates: Partial<{ pins: Pin[], paths: any[] }>) => {
    setAllMapData({ ...allMapData, [activeMap]: { ...mapData, ...updates } });
  };

  // 3. Extracted Logic Hooks
  const { exportToClipboard, importFromClipboard, appendFromClipboard } = useClipboard(allMapData, setAllMapData);
  const pathing = usePathing({ mapData, saveMapData });

  // 4. Pin Logic (Kept here as it's the core mapping function)
  const handleAddPin = (latlng: LatLng, color: PinColor, providedId?: string) => {
    const newPin: Pin = {
      id: providedId || crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng], color, label: '', notes: '', isVisible: true, showLabel: true
    };
    saveMapData({ pins: [...mapData.pins, newPin] });
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
        isPathingMode={pathing.isPathingMode}
        onTogglePathMode={pathing.togglePathingMode}
        paths={mapData.paths}
        onUpdatePath={pathing.handleUpdatePath}
        onDeletePath={pathing.handleDeletePath}
      />
      
      <GameMap 
        pins={mapData.pins}
        paths={mapData.paths}
        activeMapId={activeMap}
        colorStates={colorStates}
        
        // Pin Actions
        onAddPin={handleAddPin}
        onUpdatePin={(id, upd) => saveMapData({ pins: mapData.pins.map(p => p.id === id ? {...p, ...upd} : p) })}
        onDeletePin={(id) => saveMapData({ pins: mapData.pins.filter(p => p.id !== id) })}
        
        // Path Actions
        isPathingMode={pathing.isPathingMode}
        selectedPathNode={pathing.selectedPathNode}
        onSelectPathNode={(pathId, index) => pathing.setSelectedPathNode({ pathId, index })}
        onAddPath={pathing.handleAddPathNode}
        onMovePathNode={pathing.handleMovePathNode}
        onDeletePathNode={pathing.handleDeletePathNode}
    
      />
    </div>
  );
}