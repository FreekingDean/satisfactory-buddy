import React, { useRef, useEffect, useState, useCallback } from 'react';
// import SaveFileUploader from './SaveFileUploader'; // Removed - using auto-load instead
import { getCollectibleIcon, getCollectibleDisplayName, isCollectible, getAllCollectibleIcons } from '../utils/buildingIcons';

interface MapState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

interface Collectible {
  x: number;
  y: number;
  z: number;
  className: string;
  isCollected: boolean;
}

const SatisfactoryMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapState, setMapState] = useState<MapState>({
    scale: 0.1,
    offsetX: 0,
    offsetY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [error, setError] = useState<string>('');
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [collectibleIcons, setCollectibleIcons] = useState<Map<string, HTMLImageElement>>(new Map());

  const drawMap = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(mapState.offsetX, mapState.offsetY);
    ctx.scale(mapState.scale, mapState.scale);

    if (mapImage) {
      const mapWidth = 5000;
      const mapHeight = 5000;
      ctx.drawImage(mapImage, -mapWidth/2, -mapHeight/2, mapWidth, mapHeight);
    } else {
      ctx.fillStyle = '#2a4a3a';
      ctx.fillRect(-2500, -2500, 5000, 5000);

      ctx.strokeStyle = '#4a6a5a';
      ctx.lineWidth = 1 / mapState.scale;
      
      for (let x = -2500; x <= 2500; x += 500) {
        ctx.beginPath();
        ctx.moveTo(x, -2500);
        ctx.lineTo(x, 2500);
        ctx.stroke();
      }
      
      for (let y = -2500; y <= 2500; y += 500) {
        ctx.beginPath();
        ctx.moveTo(-2500, y);
        ctx.lineTo(2500, y);
        ctx.stroke();
      }
    }

    
    collectibles.forEach(collectible => {
      const iconFilename = getCollectibleIcon(collectible.className);
      const icon = iconFilename ? collectibleIcons.get(iconFilename) : null;
      // Dynamic icon sizing based on zoom level, with better scaling
      const baseIconSize = 32;
      const minIconSize = 16;
      const maxIconSize = 64;
      const scaleFactor = Math.max(0.5, Math.min(2.0, 1.0 / mapState.scale));
      const size = Math.max(minIconSize, Math.min(maxIconSize, baseIconSize * scaleFactor));
      
      // Draw different styles for collected vs uncollected
      if (collectible.isCollected) {
        // Collected items are semi-transparent with a checkmark
        ctx.globalAlpha = 0.4;
      } else {
        ctx.globalAlpha = 1.0;
      }
      
      if (icon && icon.complete) {
        // Apply better icon positioning with pixel-perfect centering
        const iconX = Math.round(collectible.x - size/2);
        const iconY = Math.round(collectible.y - size/2);
        
        // Add subtle shadow for better visibility
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.fillRect(iconX + 2, iconY + 2, size, size);
        ctx.globalAlpha = collectible.isCollected ? 0.4 : 1.0;
        
        ctx.drawImage(icon, iconX, iconY, size, size);
      } else {
        // Enhanced fallback with better colors and styling
        ctx.fillStyle = collectible.isCollected ? '#666666' : '#FFD700';
        ctx.strokeStyle = collectible.isCollected ? '#444444' : '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, size/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      
      // Enhanced collected indicator with better positioning
      if (collectible.isCollected) {
        ctx.globalAlpha = 1.0;
        
        // Position indicator relative to icon size
        const indicatorSize = Math.max(8, size * 0.25);
        const indicatorX = collectible.x + size * 0.3;
        const indicatorY = collectible.y - size * 0.3;
        
        // Green circle background
        ctx.fillStyle = '#00DD00';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, indicatorSize * 0.15);
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, indicatorSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Checkmark with better proportions
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
      
      ctx.globalAlpha = 1.0;
      
      // Enhanced text rendering with better visibility and scaling
      if (mapState.scale > 0.3) {
        ctx.fillStyle = collectible.isCollected ? '#AAAAAA' : '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(2, 3 / mapState.scale);
        
        // Better font scaling
        const fontSize = Math.max(10, Math.min(16, 14 / mapState.scale));
        ctx.font = `${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const displayName = getCollectibleDisplayName(collectible.className);
        const textY = collectible.y + size/2 + Math.max(4, 8 / mapState.scale);
        
        // Multiple stroke passes for better text outline
        ctx.globalAlpha = 1.0;
        for (let i = 0; i < 3; i++) {
          ctx.strokeText(displayName, collectible.x, textY);
        }
        ctx.fillText(displayName, collectible.x, textY);
      }
    });
    
    ctx.restore();
  }, [mapState, collectibles, mapImage, collectibleIcons]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMapImage(img);
    };
    img.src = '/map.jpg';
  }, []);

  useEffect(() => {
    // Use the enhanced icon loading system
    const iconFilenames = getAllCollectibleIcons();

    const loadIcons = async () => {
      const iconMap = new Map<string, HTMLImageElement>();
      
      console.log(`Loading ${iconFilenames.length} collectible icons...`);
      
      for (const filename of iconFilenames) {
        const img = new Image();
        img.src = `/icons/${filename}`;
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            iconMap.set(filename, img);
            console.log(`Loaded icon: ${filename}`);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load collectible icon: ${filename}`);
            resolve();
          };
        });
      }
      
      console.log(`Successfully loaded ${iconMap.size} icons`);
      setCollectibleIcons(iconMap);
    };

    loadIcons();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const mapWidth = 5000;
      const mapHeight = 5000;
      
      canvas.width = mapWidth;
      canvas.height = mapHeight;
      
      if (mapState.scale === 0.1) {
        const rect = canvas.getBoundingClientRect();
        const viewportScaleX = rect.width / mapWidth;
        const viewportScaleY = rect.height / mapHeight;
        const fitScale = Math.max(viewportScaleX, viewportScaleY);
        
        setMapState({
          scale: fitScale,
          offsetX: mapWidth / 2,
          offsetY: mapHeight / 2
        });
      }

      drawMap(ctx, canvas);
    };

    resizeCanvas();
    
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    
    resizeObserver.observe(canvas);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawMap, mapState.scale]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setMapState(prev => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    const mapWidth = 5000;
    const mapHeight = 5000;
    
    // Calculate minimum scale to ensure map fills the viewport
    const viewportScaleX = rect.width / mapWidth;
    const viewportScaleY = rect.height / mapHeight;
    const minScale = Math.max(viewportScaleX, viewportScaleY);
    const maxScale = 3;
    
    const newScale = Math.max(minScale, Math.min(maxScale, mapState.scale * zoomFactor));

    setMapState(prev => ({
      ...prev,
      scale: newScale,
      offsetX: mouseX - (mouseX - prev.offsetX) * (newScale / prev.scale),
      offsetY: mouseY - (mouseY - prev.offsetY) * (newScale / prev.scale)
    }));
  };

  const resetView = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const mapWidth = 5000;
    const mapHeight = 5000;
    const rect = canvas.getBoundingClientRect();
    const viewportScaleX = rect.width / mapWidth;
    const viewportScaleY = rect.height / mapHeight;
    const fitScale = Math.max(viewportScaleX, viewportScaleY);
    
    setMapState({
      scale: fitScale,
      offsetX: mapWidth / 2,
      offsetY: mapHeight / 2
    });
  };

  // Auto-load save file on component mount
  useEffect(() => {
    const loadSaveFile = async () => {
      try {
        setError('');
        console.log('Auto-loading map.sav file...');
        
        const response = await fetch('/map.sav');
        if (!response.ok) {
          throw new Error(`Failed to fetch save file: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('Save file loaded, size:', arrayBuffer.byteLength);
        
        console.log('Loading parser...');
        const { Parser } = await import('@etothepii/satisfactory-file-parser');
        
        console.log('Parsing save file...');
        const saveData = Parser.ParseSave('map', arrayBuffer);
        
        console.log('Save data parsed successfully:', saveData);
        handleSaveFileParsed(saveData);
      } catch (error) {
        console.error('Error auto-loading save file:', error);
        setError(`Failed to load save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    loadSaveFile();
  }, []);

  const handleSaveFileParsed = useCallback((saveData: any) => {
    setError('');
    console.log('handleSaveFileParsed called with:', saveData);
    
    try {
      const extractedCollectibles: Collectible[] = [];
      
      console.log('Save data structure:', {
        hasLevels: !!saveData?.levels,
        levelsType: typeof saveData?.levels,
        levelsKeys: saveData?.levels ? Object.keys(saveData.levels) : 'no levels',
        levelsLength: saveData?.levels?.length,
        hasLevel0: !!saveData?.levels?.[0],
        hasObjects: !!saveData?.levels?.[0]?.objects,
        objectsLength: saveData?.levels?.[0]?.objects?.length
      });
      
      // Let's also check the top-level structure
      console.log('Top level saveData keys:', Object.keys(saveData));
      console.log('Full levels object:', saveData?.levels);
      
      if (saveData?.levels && typeof saveData.levels === 'object') {
        const levelKeys = Object.keys(saveData.levels);
        console.log(`Processing ${levelKeys.length} level objects`);
        
        // First, let's see what class names we actually have
        const classNames = new Set();
        const collectibleCandidates = [];
        let totalObjects = 0;
        
        for (const levelKey of levelKeys) {
          const levelObj = saveData.levels[levelKey];
          if (levelObj && typeof levelObj === 'object') {
            totalObjects++;
            
            // Log levels with content
            if (levelObj.objects?.length > 0 || levelObj.collectables?.length > 0) {
              console.log(`Level ${levelKey} has content:`, {
                objects: levelObj.objects?.length || 0,
                collectables: levelObj.collectables?.length || 0
              });
              console.log('First few items:', levelObj.objects?.slice(0, 2), levelObj.collectables?.slice(0, 2));
            }
            
            // Check both objects and collectables arrays
            const allLevelItems = [
              ...(levelObj.objects || []),
              ...(levelObj.collectables || [])
            ];
            
            for (const item of allLevelItems) {
              const itemType = item?.typePath || item?.className || '';
              
              if (itemType) {
                classNames.add(itemType);
                
                // Look for potential collectibles (expanded search)
                if (itemType.includes('Crystal') || 
                    itemType.includes('HardDrive') ||
                    itemType.includes('HardDisk') ||
                    itemType.includes('MercerSphere') ||
                    itemType.includes('Mercer') ||
                    itemType.includes('Somersloop') ||
                    itemType.includes('Sloop') ||
                    itemType.includes('sloop') ||
                    itemType.includes('Pickup') ||
                    itemType.includes('ItemPickup') ||
                    itemType.includes('Slug') ||
                    itemType.includes('PowerShard') ||
                    itemType.includes('ResourceSink') ||
                    itemType.includes('Alien') ||
                    itemType.includes('alien') ||
                    itemType.includes('WAT') ||
                    itemType.includes('Research')) {
                  collectibleCandidates.push(itemType);
                }
              }
              
              if (item?.transform?.translation && isCollectible(itemType)) {
                const { x, y, z } = item.transform.translation;
                
                // Check if item is collected based on various properties
                const isCollected = item.mPickedUp === true || 
                                  item.collected === true || 
                                  item.isCollected === true ||
                                  item.wasCollected === true ||
                                  (item.extra && item.extra.collected === true) ||
                                  (item.properties && item.properties.mIsLooted === true);
                
                // Use SC-InteractiveMap's exact coordinate system
                // The world bounds from SC-InteractiveMap with extra background
                const mappingBoundWest = -324698.832031;
                const mappingBoundEast = 425301.832031;
                const mappingBoundNorth = -375000;
                const mappingBoundSouth = 375000;
                
                // Background/map size - match SC-InteractiveMap exactly
                const backgroundSize = 32768;
                const extraBackgroundSize = 4096;
                const totalBackgroundSize = backgroundSize + (extraBackgroundSize * 2);
                
                // Calculate offsets like SC-InteractiveMap does
                const westEastLength = Math.abs(mappingBoundWest) + Math.abs(mappingBoundEast);
                const westEastRatio = westEastLength / backgroundSize;
                const northSouthLength = Math.abs(mappingBoundNorth) + Math.abs(mappingBoundSouth);
                const northSouthRatio = northSouthLength / backgroundSize;
                
                const westOffset = westEastRatio * extraBackgroundSize;
                const northOffset = northSouthRatio * extraBackgroundSize;
                
                // Adjust bounds with offsets
                const adjustedMappingBoundWest = mappingBoundWest - westOffset;
                const adjustedMappingBoundEast = mappingBoundEast + westOffset;
                const adjustedMappingBoundNorth = mappingBoundNorth - northOffset;
                const adjustedMappingBoundSouth = mappingBoundSouth + northOffset;
                
                // Calculate conversion ratios with adjusted bounds
                const xMax = Math.abs(adjustedMappingBoundWest) + Math.abs(adjustedMappingBoundEast);
                const yMax = Math.abs(adjustedMappingBoundNorth) + Math.abs(adjustedMappingBoundSouth);
                
                const xRatio = totalBackgroundSize / xMax;
                const yRatio = totalBackgroundSize / yMax;
                
                // Convert to raster coordinates exactly like SC-InteractiveMap
                const rasterX = ((xMax - adjustedMappingBoundEast) + x) * xRatio;
                const rasterY = (((yMax - adjustedMappingBoundNorth) + y) * yRatio) - totalBackgroundSize;
                
                // Convert to our 5000x5000 coordinate system
                const mapScale = 5000 / totalBackgroundSize;
                
                // Log first few collectibles for debugging coordinates and types
                if (extractedCollectibles.length < 5) {
                  console.log('Collectible found:', {
                    type: itemType,
                    gamePosition: { x, y, z },
                    rasterPosition: { x: rasterX, y: rasterY },
                    finalMapPosition: { 
                      x: rasterX * mapScale - 2500, 
                      y: -rasterY * mapScale - 2500 
                    },
                    isCollected
                  });
                }
                
                extractedCollectibles.push({
                  x: rasterX * mapScale - 2500,  // Center on our coordinate system
                  y: -rasterY * mapScale - 2500, // Flip Y and center
                  z: z / 100, // Convert to meters like SC-InteractiveMap
                  className: itemType,
                  isCollected: isCollected
                });
              }
            }
          }
        }
        
        console.log(`Total objects processed: ${totalObjects}`);
        console.log('Collectible candidates found:', Array.from(new Set(collectibleCandidates)));
        console.log('First 10 class names:', Array.from(classNames).sort().slice(0, 10));
        
      } else {
        console.log('No levels object found or levels is not an object');
      }
      
      console.log(`Extracted ${extractedCollectibles.length} collectibles:`, extractedCollectibles.slice(0, 5));
      setCollectibles(extractedCollectibles);
      
      if (extractedCollectibles.length > 0) {
        console.log('Collectibles set, should trigger re-render');
      }
    } catch (err) {
      console.error('Error extracting collectibles:', err);
      setError('Failed to extract collectibles from save file');
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setCollectibles([]);
  }, []);

  return (
    <div className="satisfactory-map-container">
      <canvas
        ref={canvasRef}
        style={{
          width: '5000px',
          height: '5000px',
          aspectRatio: '1',
          maxWidth: '100vw',
          maxHeight: '100vh',
          objectFit: 'contain'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default SatisfactoryMap;