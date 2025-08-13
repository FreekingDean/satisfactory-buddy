import { CollectibleData, MapState } from '../types/map';
import { getCollectibleDisplayName } from './buildingIcons';

export function drawCollectedIndicator(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  iconSize: number
): void {
  ctx.globalAlpha = 1.0;
  
  const indicatorSize = Math.max(8, iconSize * 0.25);
  const indicatorX = x + iconSize * 0.3;
  const indicatorY = y - iconSize * 0.3;
  
  // Green circle
  ctx.fillStyle = '#00DD00';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(1, indicatorSize * 0.15);
  ctx.beginPath();
  ctx.arc(indicatorX, indicatorY, indicatorSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Checkmark
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, indicatorSize * 0.2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const checkSize = indicatorSize * 0.6;
  ctx.beginPath();
  ctx.moveTo(indicatorX - checkSize/2, indicatorY);
  ctx.lineTo(indicatorX - checkSize/4, indicatorY + checkSize/3);
  ctx.lineTo(indicatorX + checkSize/2, indicatorY - checkSize/3);
  ctx.stroke();
  
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
}

export function drawCollectibleLabel(
  ctx: CanvasRenderingContext2D,
  collectible: CollectibleData,
  mapState: MapState,
  iconSize: number
): void {
  ctx.fillStyle = collectible.isCollected ? '#AAAAAA' : '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(2, 3 / mapState.scale);
  
  const fontSize = Math.max(10, Math.min(16, 14 / mapState.scale));
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const displayName = getCollectibleDisplayName(collectible.className);
  const textY = collectible.y + iconSize/2 + Math.max(4, 8 / mapState.scale);
  
  // Text outline
  for (let i = 0; i < 3; i++) {
    ctx.strokeText(displayName, collectible.x, textY);
  }
  ctx.fillText(displayName, collectible.x, textY);
}

export function calculateIconSize(mapScale: number): number {
  const baseIconSize = 32;
  const minIconSize = 16;
  const maxIconSize = 64;
  const scaleFactor = Math.max(0.5, Math.min(2.0, 1.0 / mapScale));
  return Math.max(minIconSize, Math.min(maxIconSize, baseIconSize * scaleFactor));
}
