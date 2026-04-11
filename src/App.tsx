import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState } from './types';
import { LatLng } from 'leaflet';

export default function App() {
  // Store pins for ALL maps in one object: { "map1": Pin[], "map2": Pin[] }
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");
  
  // Track which colors are currently visible (for expand/collapse)
  const [visibleColors, setVisibleColors] = useState<Set<PinColor>>(
    new Set(['red', 'yellow', 'orange', 'green', 'blue', 'violet'])
  );

  // Helper to get pins for the current map
  const currentPins = useMemo(() => allMapData[activeMap] || [], [allMapData, activeMap]);

  // Persistence logic: Update the specific map key in our global state
  const savePins = (newPins: Pin[]) => {
    setAllMapData({ ...allMapData, [activeMap]: newPins });
  };

  const handleAddPin = (latlng: LatLng) => {
    const newPin: Pin = {
      id: crypto.randomUUID(),
      pos: [latlng.lat, latlng.lng],
      color: 'red', // Default color
      label: 'New Pin',
      notes: '',
      isVisible: true
    };
    savePins([...currentPins, newPin]);
  };

  const handleUpdatePin = (id: string, updates: Partial<Pin>) => {
    const newPins = currentPins.map(p => p.id === id ? { ...p, ...updates } : p);
    savePins(newPins);
  };

  const handleDeletePin = (id: string) => {
    savePins(currentPins.filter(p => p.id !== id));
  };

  // Clipboard Logic
  const exportToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(allMapData))
      .then(() => alert("All map data copied to clipboard!"))
      .catch(err => console.error("Export failed", err));
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        setAllMapData(parsed);
        alert("Data imported successfully!");
      }
    } catch (err) {
      alert("Failed to import. Ensure clipboard contains valid JSON.");
    }
  };

  const toggleColorVisibility = (color: PinColor) => {
    const next = new Set(visibleColors);
    next.has(color) ? next.delete(color) : next.add(color);
    setVisibleColors(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* UI Overlay for Controls */}
      <div className="controls" style={{ 
        position: 'absolute', top: 10, right: 10, zIndex: 1000, 
        background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
      }}>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={exportToClipboard}>Export All to Clipboard</button>
          <button onClick={importFromClipboard}>Import from Clipboard</button>
        </div>

        <select value={activeMap} onChange={(e) => setActiveMap(e.target.value)}>
          <option value="map1">Map 1: Main World</option>
          <option value="map2">Map 2: Underground</option>
          {/* Add all 7 map options here */}
        </select>

        <div style={{ marginTop: '10px' }}>
          <strong>Filter Colors:</strong>
          {(['red', 'yellow', 'orange', 'green', 'blue', 'violet'] as PinColor[]).map(color => (
            <label key={color} style={{ display: 'block', textTransform: 'capitalize' }}>
              <input 
                type="checkbox" 
                checked={visibleColors.has(color)} 
                onChange={() => toggleColorVisibility(color)}
              /> {color}
            </label>
          ))}
        </div>
      </div>

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