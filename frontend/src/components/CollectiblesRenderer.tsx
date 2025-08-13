import React, { useEffect, useRef } from 'react';
import { CollectibleData, MapState } from '../types/map';
import { renderCollectible } from './CollectibleRenderer';

interface CollectiblesRendererProps {
  collectibles: CollectibleData[];
  mapState: MapState;
  collectibleIcons: Map<string, HTMLImageElement>;
  onRegisterDraw: (id: string, drawFn: (ctx: CanvasRenderingContext2D) => void) => void;
  onUnregisterDraw: (id: string) => void;
}

const CollectiblesRenderer: React.FC<CollectiblesRendererProps> = ({
  collectibles,
  mapState,
  collectibleIcons,
  onRegisterDraw,
  onUnregisterDraw
}) => {
  // Use refs to get current values without causing re-registration
  const collectiblesRef = useRef(collectibles);
  const mapStateRef = useRef(mapState);
  const iconsRef = useRef(collectibleIcons);
  
  // Update refs when props change
  collectiblesRef.current = collectibles;
  mapStateRef.current = mapState;
  iconsRef.current = collectibleIcons;

  useEffect(() => {
    const drawAllCollectibles = (ctx: CanvasRenderingContext2D) => {
      collectiblesRef.current.forEach(collectible => {
        renderCollectible({
          collectible,
          mapState: mapStateRef.current,
          collectibleIcons: iconsRef.current,
          ctx
        });
      });
    };

    onRegisterDraw('all-collectibles', drawAllCollectibles);

    return () => {
      onUnregisterDraw('all-collectibles');
    };
  }, [onRegisterDraw, onUnregisterDraw]); // Only register/unregister once

  return null;
};

export default CollectiblesRenderer;