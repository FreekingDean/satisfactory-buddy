export interface MapState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface CollectibleData {
  x: number;
  y: number;
  z: number;
  className: string;
  isCollected: boolean;
}

export interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface CanvasDrawFunction {
  (ctx: CanvasRenderingContext2D): void;
}

export interface DrawableComponent {
  id: string;
  drawFn: CanvasDrawFunction;
}