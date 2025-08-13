import React, { useEffect } from 'react';
import { CollectibleData, MapState } from '../types/map';
import { renderCollectible } from './CollectibleRenderer';

interface CollectibleComponentProps {
  id: string;
  data: CollectibleData;
  mapState: MapState;
  collectibleIcons: Map<string, HTMLImageElement>;
  onRegisterDraw: (id: string, drawFn: (ctx: CanvasRenderingContext2D) => void) => void;
  onUnregisterDraw: (id: string) => void;
}

const CollectibleComponent: React.FC<CollectibleComponentProps> = ({
  id,
  data,
  mapState,
  collectibleIcons,
  onRegisterDraw,
  onUnregisterDraw
}) => {
  useEffect(() => {
    const drawFn = (ctx: CanvasRenderingContext2D) => {
      renderCollectible({
        collectible: data,
        mapState,
        collectibleIcons,
        ctx
      });
    };

    onRegisterDraw(id, drawFn);

    return () => {
      onUnregisterDraw(id);
    };
  }, [id, data, mapState, collectibleIcons, onRegisterDraw, onUnregisterDraw]);

  return null; // No DOM rendering
};

export default CollectibleComponent;