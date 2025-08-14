import React from 'react';
import { CollectibleData, MapState } from '../types/map';
import { getCollectibleIcon } from '../utils/buildingIcons';
import { drawCollectedIndicator, drawCollectibleLabel, calculateIconSize } from '../utils/collectibleDrawing';
import { ResourceMappings, ResourceNodeData } from '../types/mappings';
import Mappings from '../data/mappings.json';

interface CollectibleRendererProps {
  collectible: CollectibleData;
  mapState: MapState;
  collectibleIcons: Map<string, HTMLImageElement>;
  ctx: CanvasRenderingContext2D;
}

export function renderCollectible({
  collectible,
  mapState,
  collectibleIcons,
  ctx
}: CollectibleRendererProps): void {
  const mappings: ResourceMappings = Mappings as ResourceMappings;
  const mapping: ResourceNodeData | undefined = mappings[collectible.className];
  if (!mapping) {
    return;
  }
  
  const iconFilename = mapping.type.toLowerCase() + "_64.png";

  const icon = iconFilename ? collectibleIcons.get(iconFilename) : null;
  const size = calculateIconSize(mapState.scale);
  
  // Set opacity for collected items
  ctx.globalAlpha = collectible.isCollected ? 0.4 : 1.0;
  ctx.fillStyle = collectible.isCollected ? '#666666' : '#FFD700';
  ctx.strokeStyle = collectible.isCollected ? '#444444' : '#FFA500';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(collectible.x, collectible.y, size/2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  if (icon && icon.complete) {
    const iconSize = size * 0.75; // Scale down icon size
    // Draw icon with shadow
    const iconX = collectible.x - (iconSize/2);
    const iconY = collectible.y - (iconSize/2);
    
    // Icon
    ctx.globalAlpha = collectible.isCollected ? 0.4 : 1.0;
    ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
  } else {
    // Fallback circle
  }
  
  // Draw collected indicator
  if (collectible.isCollected) {
    drawCollectedIndicator(ctx, collectible.x, collectible.y, size);
  }
  
  // Draw text label
  if (mapState.scale > 0.3) {
    drawCollectibleLabel(ctx, collectible, mapState, size);
  }
  
  ctx.globalAlpha = 1.0;
}
