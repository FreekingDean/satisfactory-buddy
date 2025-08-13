import { MapState, MapBounds } from '../types/map';

export const MAP_WIDTH = 5000;
export const MAP_HEIGHT = 5000;

export function calculateMapBounds(
  mapState: MapState, 
  canvasRect: DOMRect
): MapBounds {
  const scaledMapWidth = MAP_WIDTH * mapState.scale;
  const scaledMapHeight = MAP_HEIGHT * mapState.scale;
  
  let minOffsetX, maxOffsetX, minOffsetY, maxOffsetY;
  
  if (scaledMapWidth <= canvasRect.width) {
    minOffsetX = maxOffsetX = canvasRect.width / 2;
  } else {
    minOffsetX = scaledMapWidth / 2 - (scaledMapWidth - canvasRect.width);
    maxOffsetX = scaledMapWidth / 2;
  }
  
  if (scaledMapHeight <= canvasRect.height) {
    minOffsetY = maxOffsetY = canvasRect.height / 2;
  } else {
    minOffsetY = scaledMapHeight / 2 - (scaledMapHeight - canvasRect.height);
    maxOffsetY = scaledMapHeight / 2;
  }

  return {
    minX: minOffsetX,
    maxX: maxOffsetX,
    minY: minOffsetY,
    maxY: maxOffsetY
  };
}

export function constrainMapPosition(
  newX: number,
  newY: number,
  bounds: MapBounds
): { x: number; y: number } {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, newY))
  };
}

export function calculateFitScale(
  canvasRect: DOMRect,
  mapWidth: number = MAP_WIDTH,
  mapHeight: number = MAP_HEIGHT
): number {
  const viewportScaleX = canvasRect.width / mapWidth;
  const viewportScaleY = canvasRect.height / mapHeight;
  return Math.min(viewportScaleX, viewportScaleY);
}

export function drawMapBackground(
  ctx: CanvasRenderingContext2D,
  mapImage: HTMLImageElement | null
): void {
  if (mapImage) {
    ctx.drawImage(mapImage, -MAP_WIDTH/2, -MAP_HEIGHT/2, MAP_WIDTH, MAP_HEIGHT);
  } else {
    // Fallback grid
    ctx.fillStyle = '#2a4a3a';
    ctx.fillRect(-MAP_WIDTH/2, -MAP_HEIGHT/2, MAP_WIDTH, MAP_HEIGHT);

    ctx.strokeStyle = '#4a6a5a';
    ctx.lineWidth = 1;
    
    for (let x = -MAP_WIDTH/2; x <= MAP_WIDTH/2; x += 500) {
      ctx.beginPath();
      ctx.moveTo(x, -MAP_HEIGHT/2);
      ctx.lineTo(x, MAP_HEIGHT/2);
      ctx.stroke();
    }
    
    for (let y = -MAP_HEIGHT/2; y <= MAP_HEIGHT/2; y += 500) {
      ctx.beginPath();
      ctx.moveTo(-MAP_WIDTH/2, y);
      ctx.lineTo(MAP_WIDTH/2, y);
      ctx.stroke();
    }
  }
}