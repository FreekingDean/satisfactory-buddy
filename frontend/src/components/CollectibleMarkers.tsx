import React, { useMemo } from 'react';
import { CollectibleMarker, CollectibleData } from '../types/map';
import MapMarker from './MapMarker';

interface CollectibleMarkersProps {
  collectibles: CollectibleData[];
  icons?: Record<string, HTMLImageElement>;
  visible?: boolean;
}

const CollectibleMarkers: React.FC<CollectibleMarkersProps> = ({ 
  collectibles, 
  icons = {}, 
  visible = true 
}) => {
  const markers = useMemo((): CollectibleMarker[] => {
    return collectibles.map((collectible, index) => ({
      id: `collectible-${index}`,
      type: 'collectible' as const,
      position: { x: collectible.x, y: collectible.y, z: collectible.z },
      visible,
      data: {
        collectibleType: extractCollectibleType(collectible.className),
        isCollected: collectible.isCollected,
      }
    }));
  }, [collectibles, visible]);

  return <MapMarker markers={markers} icons={icons} />;
};

const extractCollectibleType = (className: string): string => {
  const match = className.match(/BP_(\w+?)(\d+|_|$)/);
  return match ? match[1] : 'Unknown';
};

export default CollectibleMarkers;