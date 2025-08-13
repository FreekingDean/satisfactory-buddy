import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapState } from '../types/map';
import { drawMapBackground, calculateFitScale } from '../utils/canvas';
import { useMapControls } from '../hooks/useMapControls';
import MapControls from './MapControls';
import './Map.css';

interface MapProps {
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);

  const { mapState, setMapState, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel } = useMapControls({ canvasRef });
  
  const handleResetView = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const fitScale = calculateFitScale(rect);
    setMapState({
      scale: fitScale,
      offsetX: rect.width / 2,
      offsetY: rect.height / 2
    });
  }, [setMapState]);

  const drawMap = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(mapState.offsetX, mapState.offsetY);
    ctx.scale(mapState.scale, mapState.scale);

    drawMapBackground(ctx, mapImage);
    
    ctx.restore();
  }, [mapState, mapImage]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setMapImage(img);
    img.src = '/map.jpg';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      if (mapState.scale === 0.1) {
        const fitScale = calculateFitScale(rect);
        setMapState({
          scale: fitScale,
          offsetX: rect.width / 2,
          offsetY: rect.height / 2
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
    <div className="map-container">
      {/* Glow effect */}
      <div className="map-glow-overlay" />
      
      {/* Main canvas container */}
      <div className="map-canvas-container">
        <div className="map-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="map-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>
      </div>

      {/* Controls overlay */}
      <div className="map-controls">
        <div className="map-zoom-display">
          Zoom: {(mapState.scale * 100).toFixed(0)}%
        </div>
      </div>

      {/* Loading indicator */}
      {!mapImage && (
        <div className="map-loading">
          <div className="map-loading-content">
            <div className="map-loading-spinner" />
            <div className="map-loading-text">Loading map...</div>
          </div>
        </div>
      )}
      
      <MapControls 
        scale={mapState.scale}
        onResetView={handleResetView}
      />
      
      <div 
        className="map-overlay"
        style={{
          transform: `translate(${mapState.offsetX}px, ${mapState.offsetY}px) scale(${mapState.scale})`,
          transformOrigin: '0 0'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Map;