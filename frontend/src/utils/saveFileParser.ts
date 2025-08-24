import { CollectibleData } from '../types/map';
import { isCollectible } from './buildingIcons';

export async function loadSaveFile(): Promise<any> {
  const response = await fetch('/map.sav');
  if (!response.ok) {
    throw new Error(`Failed to fetch save file: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  console.log('Save file loaded, size:', arrayBuffer.byteLength);
  
  const { Parser } = await import('@etothepii/satisfactory-file-parser');
  const saveData = Parser.ParseSave('map', arrayBuffer);
  console.log('Save data parsed successfully:', saveData);
  
  return saveData;
}

function isItemCollected(item: any): boolean {
  return item.mPickedUp === true || 
         item.collected === true || 
         item.isCollected === true ||
         item.wasCollected === true ||
         (item.extra && item.extra.collected === true) ||
         (item.properties && item.properties.mIsLooted === true);
}

export function convertCoordinates(x: number, y: number): { x: number; y: number } {
  // Simplified coordinate conversion
  // Satisfactory world is roughly -400000 to +400000 for x and y
  // Convert to our -2500 to +2500 coordinate system
  const mapX = (x/12.3)-300;
  const mapY = (y/12.3); // Flip Y axis
  
  return { x: mapX, y: mapY };
}

export function extractCollectibles(saveData: any): CollectibleData[] {
  const extractedCollectibles: CollectibleData[] = [];
  
  if (!saveData?.levels || typeof saveData.levels !== 'object') {
    console.log('No levels object found or levels is not an object');
    return extractedCollectibles;
  }

  const levelKeys = Object.keys(saveData.levels);
  console.log(`Processing ${levelKeys.length} level objects`);
  
  for (const levelKey of levelKeys) {
    const levelObj = saveData.levels[levelKey];
    if (!levelObj || typeof levelObj !== 'object') continue;
    
    const allLevelItems = [
      ...(levelObj.objects || []),
      ...(levelObj.collectables || [])
    ];
    
    for (const item of allLevelItems) {
      const itemType = item?.typePath || item?.className || '';
      
      if (item?.transform?.translation && isCollectible(itemType)) {
        const { x, y, z } = item.transform.translation;
        const isCollected = isItemCollected(item);
        const mapCoords = convertCoordinates(x, y);
        
        // Log first few collectibles for debugging
        if (extractedCollectibles.length < 20) {
          console.log('Collectible found:', item)
        }
        
        extractedCollectibles.push({
          x: mapCoords.x,
          y: mapCoords.y,
          z: z / 100, // Convert to meters
          className: itemType,
          isCollected: isCollected
        });
      }
    }
  }
  
  console.log(`Extracted ${extractedCollectibles.length} collectibles`);
  return extractedCollectibles;
}
