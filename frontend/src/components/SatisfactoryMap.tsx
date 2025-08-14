import React, { useRef, useEffect, useState, useCallback } from 'react';
import { drawMapBackground, calculateFitScale } from '../utils/canvas';
import { useMapControls } from '../hooks/useMapControls';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useSaveFileLoader } from '../hooks/useSaveFileLoader';
import { useIconLoader } from '../hooks/useIconLoader';
import CollectiblesRenderer from './CollectiblesRenderer';

const SatisfactoryMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);

  const { mapState, setMapState, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel } = useMapControls({ canvasRef });
  const { registerDrawFunction, unregisterDrawFunction, renderAll } = useCanvasRenderer();
  const { collectibles, error } = useSaveFileLoader();
  const { collectibleIcons } = useIconLoader();

  const drawMap = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(mapState.offsetX, mapState.offsetY);
    ctx.scale(mapState.scale, mapState.scale);

    drawMapBackground(ctx, mapImage);
    renderAll(ctx);
    
    ctx.restore();
  }, [mapState, mapImage, renderAll]);

  // Load map image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setMapImage(img);
    img.src = '/map.jpg';
  }, []);


  // Canvas setup and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set canvas size accounting for device pixel ratio
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      
      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set CSS size to actual display size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Ensure crisp pixel rendering
      ctx.imageSmoothingEnabled = false;
      
      if (mapState.scale === 0.1) {
        const fitScale = calculateFitScale(rect);
        setMapState({
          scale: fitScale,
          offsetX: Math.round(rect.width / 2),
          offsetY: Math.round(rect.height / 2)
        });
      }

      drawMap(ctx, canvas);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    
    return () => resizeObserver.disconnect();
  }, [drawMap, mapState.scale, setMapState]);

  return (
    <div className="relative w-[min(80vw,80vh)] h-[min(80vw,80vh)] border-2 border-white/20 rounded-lg shadow-2xl overflow-hidden bg-gradient-radial from-satisfactory-map to-satisfactory-mapDark">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <CollectiblesRenderer
        collectibles={collectibles}
        mapState={mapState}
        collectibleIcons={collectibleIcons}
        onRegisterDraw={registerDrawFunction}
        onUnregisterDraw={unregisterDrawFunction}
      />
    </div>
  );
};

export default SatisfactoryMap;
