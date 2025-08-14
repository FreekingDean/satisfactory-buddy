import { useState, useEffect } from 'react';
import { getAllCollectibleIcons } from '../utils/buildingIcons';

export function useIconLoader() {
  const [collectibleIcons, setCollectibleIcons] = useState<Map<string, HTMLImageElement>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const iconFilenames = getAllCollectibleIcons();
    
    const loadIcons = async () => {
      setIsLoading(true);
      const iconMap = new Map<string, HTMLImageElement>();
      
      console.log(`Loading ${iconFilenames.length} collectible icons...`);
      
      for (const filename of iconFilenames) {
        const img = new Image();
        img.src = `/items/${filename}`;
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            console.log(`Loaded collectible icon: ${filename}`);
            iconMap.set(filename, img);
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
      setIsLoading(false);
    };

    loadIcons();
  }, []);

  return { collectibleIcons, isLoading };
}
