import { useState, useCallback, useRef } from 'react';
import { CanvasDrawFunction } from '../types/map';

export function useCanvasRenderer() {
  const [drawFunctions, setDrawFunctions] = useState<Map<string, CanvasDrawFunction>>(new Map());
  const drawFunctionsRef = useRef<Map<string, CanvasDrawFunction>>(new Map());

  const registerDrawFunction = useCallback((id: string, drawFn: CanvasDrawFunction) => {
    drawFunctionsRef.current.set(id, drawFn);
    setDrawFunctions(new Map(drawFunctionsRef.current));
  }, []);

  const unregisterDrawFunction = useCallback((id: string) => {
    drawFunctionsRef.current.delete(id);
    setDrawFunctions(new Map(drawFunctionsRef.current));
  }, []);

  const renderAll = useCallback((ctx: CanvasRenderingContext2D) => {
    // Use ref to get current functions without dependency
    drawFunctionsRef.current.forEach((drawFn) => {
      drawFn(ctx);
    });
  }, []); // No dependencies!

  return {
    registerDrawFunction,
    unregisterDrawFunction,
    renderAll
  };
}