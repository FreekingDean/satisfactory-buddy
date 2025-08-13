import { useState, useCallback } from 'react';
import { MapState } from '../types/map';
import { calculateMapBounds, constrainMapPosition, MAP_WIDTH, MAP_HEIGHT } from '../utils/canvas';

interface UseMapControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useMapControls({ canvasRef }: UseMapControlsProps) {
  const [mapState, setMapState] = useState<MapState>({
    scale: 0.1,
    offsetX: 0,
    offsetY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    const bounds = calculateMapBounds(mapState, rect);
    const newPosition = constrainMapPosition(
      mapState.offsetX + deltaX,
      mapState.offsetY + deltaY,
      bounds
    );

    setMapState(prev => ({
      ...prev,
      offsetX: newPosition.x,
      offsetY: newPosition.y
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, mapState, lastMousePos, canvasRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    //e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const viewportScaleX = rect.width / MAP_WIDTH;
    const viewportScaleY = rect.height / MAP_HEIGHT;
    const minScale = Math.min(viewportScaleX, viewportScaleY);
    const maxScale = 3;
    
    const newScale = Math.max(minScale, Math.min(maxScale, mapState.scale * zoomFactor));
    const newOffsetX = mouseX - (mouseX - mapState.offsetX) * (newScale / mapState.scale);
    const newOffsetY = mouseY - (mouseY - mapState.offsetY) * (newScale / mapState.scale);

    const bounds = calculateMapBounds({ ...mapState, scale: newScale }, rect);
    const constrainedPosition = constrainMapPosition(newOffsetX, newOffsetY, bounds);

    setMapState({
      scale: newScale,
      offsetX: constrainedPosition.x,
      offsetY: constrainedPosition.y
    });
  }, [mapState, canvasRef]);

  return {
    mapState,
    setMapState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  };
}
