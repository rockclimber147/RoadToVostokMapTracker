// src/App.tsx
import { useState, useMemo } from 'react';
import GameMap from './components/GameMap';
import Sidebar from './components/SideBar'; 
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Pin, type PinColor, type MapState, type Path } from './types';
import { LatLng } from 'leaflet';
import { 
  encodeData, 
  decodeData, 
  packageForExport, 
  rehydrateData 
} from './utils/serialization';

export default function App() {
  const [allMapData, setAllMapData] = useLocalStorage<MapState>("game_map_data_v1", {});
  const [activeMap, setActiveMap] = useState("map1");

  const [isPathingMode, setIsPathingMode] = useState(false);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [selectedPathNode, setSelectedPathNode] = useState<{ pathId: string; index: number } | null>(null);
  
  const [colorStates, setColorStates] = useLocalStorage<Record<PinColor, number>>(
    "color_visibility_states", 
    { red: 2, yellow: 2, orange: 2, green: 2, blue: 2, violet: 2 }
  );

  const mapData = useMemo(() => {
    const rawData = allMapData[activeMap];

    if (!rawData) return { pins: [], paths: [] };

    if (Array.isArray(rawData)) return { pins: rawData, paths: [] };

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

  const togglePathingMode = () => {
    setIsPathingMode(prev => {
      if (prev) {
        setActivePathId(null);
        setSelectedPathNode(null); // Clear selection when exiting
      }
      return !prev;
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

  const handleAddPathNode = (latlng: LatLng) => {
    const currentPaths = mapData.paths;
    const pos: [number, number] = [latlng.lat, latlng.lng];

    if (!activePathId) {
      // First node creates the path
      const newId = crypto.randomUUID();
      const newPath: Path = { id: newId, points: [pos], color: 'red', label: 'NEW PATH' };
      saveMapData({ paths: [...currentPaths, newPath] });
      setActivePathId(newId);
      setSelectedPathNode({ pathId: newId, index: 0 }); // Auto-select new node
    } else {
      const updatedPaths = currentPaths.map(p => {
        if (p.id !== activePathId) return p;
        
        const newPoints = [...p.points];
        if (selectedPathNode && selectedPathNode.pathId === activePathId) {
          // INSERT: Place the new node right after the currently selected node
          newPoints.splice(selectedPathNode.index + 1, 0, pos);
          // Update selection to the newly created node so you can keep drawing continuously
          setSelectedPathNode({ pathId: activePathId, index: selectedPathNode.index + 1 });
        } else {
          // APPEND: Fallback if no node is selected
          newPoints.push(pos);
          setSelectedPathNode({ pathId: activePathId, index: newPoints.length - 1 });
        }
        return { ...p, points: newPoints };
      });
      saveMapData({ paths: updatedPaths });
    }
  };

  const handleMovePathNode = (pathId: string, index: number, latlng: LatLng) => {
    const updatedPaths = mapData.paths.map(p => {
      if (p.id !== pathId) return p;
      const newPoints = [...p.points];
      newPoints[index] = [latlng.lat, latlng.lng];
      return { ...p, points: newPoints };
    });
    saveMapData({ paths: updatedPaths });
  };

  const handleDeletePathNode = (pathId: string, index: number) => {
    const updatedPaths = mapData.paths.map(p => {
      if (p.id !== pathId) return p;
      // Remove the point at the given index
      const newPoints = p.points.filter((_, i) => i !== index);
      return { ...p, points: newPoints };
    }).filter(p => p.points.length > 0); // Automatically delete the whole path if 0 points remain

    saveMapData({ paths: updatedPaths });
    setSelectedPathNode(null); // Clear selection to prevent errors
    if (!updatedPaths.find(p => p.id === activePathId)) setActivePathId(null);
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
        // --- MISSING PROPS ADDED HERE ---
        isPathingMode={isPathingMode}
        onTogglePathMode={togglePathingMode}
      />
      
      <GameMap 
        pins={mapData.pins}
        paths={mapData.paths}
        activeMapId={activeMap}
        isPathingMode={isPathingMode}
        onAddPin={handleAddPin}
        onAddPath={handleAddPathNode}
        selectedPathNode={selectedPathNode}
        onSelectPathNode={(pathId, index) => setSelectedPathNode({ pathId, index })}
        onMovePathNode={handleMovePathNode}
        onDeletePathNode={handleDeletePathNode}
        onUpdatePin={(id, upd) => saveMapData({ pins: mapData.pins.map(p => p.id === id ? {...p, ...upd} : p) })}
        onDeletePin={(id) => saveMapData({ pins: mapData.pins.filter(p => p.id !== id) })}
        colorStates={colorStates}
      />
    </div>
  );
}