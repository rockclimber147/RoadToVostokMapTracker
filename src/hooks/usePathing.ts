// src/hooks/usePathing.ts
import { useState } from 'react';
import { LatLng } from 'leaflet';
import { type Path, type Pin } from '../types';

interface UsePathingProps {
  mapData: { pins: Pin[]; paths: Path[] };
  saveMapData: (updates: Partial<{ pins: Pin[], paths: Path[] }>) => void;
}

export function usePathing({ mapData, saveMapData }: UsePathingProps) {
  const [isPathingMode, setIsPathingMode] = useState(false);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [selectedPathNode, setSelectedPathNode] = useState<{ pathId: string; index: number } | null>(null);

  const togglePathingMode = () => {
    setIsPathingMode(prev => {
      if (prev) {
        setActivePathId(null);
        setSelectedPathNode(null); 
      }
      return !prev;
    });
  };

  const handleAddPathNode = (latlng: LatLng) => {
    const currentPaths = mapData.paths;
    const pos: [number, number] = [latlng.lat, latlng.lng];

    if (!activePathId) {
      const newId = crypto.randomUUID();
      const newPath: Path = { id: newId, points: [pos], color: 'red', label: 'NEW PATH' };
      saveMapData({ paths: [...currentPaths, newPath] });
      setActivePathId(newId);
      setSelectedPathNode({ pathId: newId, index: 0 }); 
    } else {
      const updatedPaths = currentPaths.map(p => {
        if (p.id !== activePathId) return p;
        
        const newPoints = [...p.points];
        if (selectedPathNode && selectedPathNode.pathId === activePathId) {
          newPoints.splice(selectedPathNode.index + 1, 0, pos);
          setSelectedPathNode({ pathId: activePathId, index: selectedPathNode.index + 1 });
        } else {
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
      const newPoints = p.points.filter((_, i) => i !== index);
      return { ...p, points: newPoints };
    }).filter(p => p.points.length > 0); 

    saveMapData({ paths: updatedPaths });
    setSelectedPathNode(null); 
    if (!updatedPaths.find(p => p.id === activePathId)) setActivePathId(null);
  };

  return {
    isPathingMode,
    selectedPathNode,
    setSelectedPathNode,
    togglePathingMode,
    handleAddPathNode,
    handleMovePathNode,
    handleDeletePathNode
  };
}