export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface MapState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging?: boolean;
}

export interface MapMarker {
  id: string;
  position: Position;
  type: string;
  visible?: boolean;
  data?: Record<string, any>;
}

export interface ResourceMarker extends MapMarker {
  type: 'resource';
  data: {
    resourceType: string;
    purity: 'impure' | 'normal' | 'pure';
  };
}

export interface CollectibleMarker extends MapMarker {
  type: 'collectible';
  data: {
    collectibleType: string;
    isCollected?: boolean;
  };
}

export interface BuildingMarker extends MapMarker {
  type: 'building';
  data: {
    buildingType: string;
    rotation?: number;
  };
}

export type AnyMarker = ResourceMarker | CollectibleMarker | BuildingMarker;

// Legacy interface for backward compatibility
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