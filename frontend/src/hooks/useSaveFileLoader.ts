import { useState, useEffect } from 'react';
import { CollectibleData } from '../types/map';
import { loadSaveFile, extractCollectibles } from '../utils/saveFileParser';
import MapPoints from '../data/mappoints.json';
import { convertCoordinates } from '../utils/saveFileParser';

export function useSaveFileLoader() {
  const [collectibles, setCollectibles] = useState<CollectibleData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');
        setIsLoading(true);
        console.log('Auto-loading map.sav file...');
        
        

        let cd: CollectibleData[] = [];
        for (const point of MapPoints) {
          const {x, y} = convertCoordinates(point.x, point.y);
          point.x = x;
          point.y = y;
          //console.log(`Loaded point: ${point.className} at (${point.x}, ${point.y})`);
          cd.push(point as CollectibleData);
        }
        setCollectibles(cd);
        //const saveData = await loadSaveFile();
        //const extractedCollectibles = extractCollectibles(saveData);
        //setCollectibles(extractedCollectibles);
        console.log(`Successfully loaded ${cd.length} collectibles`);
      } catch (err) {
        console.error('Error loading save file:', err);
        setError(`Failed to load save file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setCollectibles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return {
    collectibles,
    error,
    isLoading
  };
}
