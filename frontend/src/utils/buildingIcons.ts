// Mapping of collectible typePath to their icon filenames
export const collectibleIconMap: { [key: string]: string } = {
  // Power Slugs - using actual crystal icons
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C': 'desc-crystal-c_64.png',
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C': 'desc-crystal-mk2-c_64.png', 
  '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C': 'desc-crystal-mk3-c_64.png',
  
  // Hard Drives
  '/Game/FactoryGame/Pickups/BP_ItemPickup_HardDrive.BP_ItemPickup_HardDrive_C': 'research-harddrive-0-c_64.png',
  
  // Mercer Spheres - using actual WAT path from SC-InteractiveMap
  '/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C': 'research-alien-mercersphere-c_64.png',
  '/Game/FactoryGame/Pickups/BP_ItemPickup_MercerSphere.BP_ItemPickup_MercerSphere_C': 'research-alien-mercersphere-c_64.png',
  
  // Somersloops - using actual WAT path from SC-InteractiveMap
  '/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C': 'research-alien-somersloop-c_64.png',
  '/Game/FactoryGame/Pickups/BP_ItemPickup_Somersloop.BP_ItemPickup_Somersloop_C': 'research-alien-somersloop-c_64.png',
  
  // Also support shorter class name formats
  'BP_Crystal_C': 'desc-crystal-c_64.png',
  'BP_Crystal_mk2_C': 'desc-crystal-mk2-c_64.png',
  'BP_Crystal_mk3_C': 'desc-crystal-mk3-c_64.png',
  'BP_ItemPickup_HardDrive_C': 'research-harddrive-0-c_64.png',
  'BP_ItemPickup_MercerSphere_C': 'research-alien-mercersphere-c_64.png',
  'BP_ItemPickup_Somersloop_C': 'research-alien-somersloop-c_64.png',
  
  // Match any crystal references
  'Crystal': 'desc-crystal-c_64.png',
  'Crystal_mk2': 'desc-crystal-mk2-c_64.png',
  'Crystal_mk3': 'desc-crystal-mk3-c_64.png',
};

export const getCollectibleIcon = (className: string): string | null => {
  // Try exact match first
  if (collectibleIconMap[className]) {
    return collectibleIconMap[className];
  }
  
  // Try partial matching for flexible typePath handling
  if (className.includes('MercerSphere') || className.includes('Mercer') || className.includes('WAT2')) {
    return 'research-alien-mercersphere-c_64.png';
  }
  if (className.includes('Somersloop') || className.includes('Sloop') || className.includes('WAT1')) {
    return 'research-alien-somersloop-c_64.png';
  }
  if (className.includes('HardDrive') || className.includes('HardDisk')) {
    return 'research-harddrive-0-c_64.png';
  }
  if (className.includes('Crystal_mk3')) {
    return 'desc-crystal-mk3-c_64.png';
  }
  if (className.includes('Crystal_mk2')) {
    return 'desc-crystal-mk2-c_64.png';
  }
  if (className.includes('Crystal')) {
    return 'desc-crystal-c_64.png';
  }
  
  return null;
};

export const getCollectibleDisplayName = (className: string): string => {
  const nameMap: { [key: string]: string } = {
    // Full typePath format
    '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal.BP_Crystal_C': 'Power Slug (Green)',
    '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk2.BP_Crystal_mk2_C': 'Power Slug (Yellow)',
    '/Game/FactoryGame/Resource/Environment/Crystal/BP_Crystal_mk3.BP_Crystal_mk3_C': 'Power Slug (Purple)',
    '/Game/FactoryGame/Pickups/BP_ItemPickup_HardDrive.BP_ItemPickup_HardDrive_C': 'Hard Drive',
    '/Game/FactoryGame/Pickups/BP_ItemPickup_MercerSphere.BP_ItemPickup_MercerSphere_C': 'Mercer Sphere',
    '/Game/FactoryGame/Pickups/BP_ItemPickup_Somersloop.BP_ItemPickup_Somersloop_C': 'Somersloop',
    '/Game/FactoryGame/Prototype/WAT/BP_WAT1.BP_WAT1_C': 'Somersloop',
    '/Game/FactoryGame/Prototype/WAT/BP_WAT2.BP_WAT2_C': 'Mercer Sphere',
    
    // Short format fallbacks
    'BP_Crystal_C': 'Power Slug (Green)',
    'BP_Crystal_mk2_C': 'Power Slug (Yellow)', 
    'BP_Crystal_mk3_C': 'Power Slug (Purple)',
    'BP_ItemPickup_HardDrive_C': 'Hard Drive',
    'BP_ItemPickup_MercerSphere_C': 'Mercer Sphere',
    'BP_ItemPickup_Somersloop_C': 'Somersloop',
  };
  
  if (nameMap[className]) {
    return nameMap[className];
  }
  
  // Try smart name detection based on content
  if (className.includes('MercerSphere') || className.includes('Mercer') || className.includes('WAT2')) {
    return 'Mercer Sphere';
  }
  if (className.includes('Somersloop') || className.includes('Sloop') || className.includes('WAT1')) {
    return 'Somersloop';
  }
  if (className.includes('HardDrive') || className.includes('HardDisk')) {
    return 'Hard Drive';
  }
  if (className.includes('Crystal_mk3')) {
    return 'Power Slug (Purple)';
  }
  if (className.includes('Crystal_mk2')) {
    return 'Power Slug (Yellow)';
  }
  if (className.includes('Crystal')) {
    return 'Power Slug (Green)';
  }
  
  // Extract meaningful name from typePath as fallback
  const parts = className.split('/');
  const lastPart = parts[parts.length - 1] || className;
  return lastPart.replace('BP_', '').replace('_C', '').replace(/_/g, ' ');
};

export const isCollectible = (className: string): boolean => {
  return className.includes('Crystal') || 
         className.includes('HardDrive') || 
         className.includes('HardDisk') ||
         className.includes('DropPod') ||
         className.includes('MercerSphere') || 
         className.includes('Mercer') ||
         className.includes('Somersloop') ||
         className.includes('Sloop') ||
         className.includes('WAT1') ||
         className.includes('WAT2') ||
         className.includes('BerryBush') ||
         className.includes('NutBush') ||
         className.includes('Pickup') ||
         className.includes('ItemPickup') ||
         className.includes('Slug') ||
         className.includes('PowerShard') ||
         className.includes('PowerSlugs') ||
         className.includes('ResourceSink');
};

// New utility function to get all available icon filenames for preloading
export const getAllCollectibleIcons = (): string[] => {
  const uniqueIcons = new Set(Object.values(collectibleIconMap));
  return Array.from(uniqueIcons);
};

// New utility function to determine collectible tier/rarity
export const getCollectibleTier = (className: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  if (className.includes('MercerSphere') || className.includes('Mercer') || className.includes('WAT2')) {
    return 'legendary';
  }
  if (className.includes('Somersloop') || className.includes('WAT1')) {
    return 'epic';
  }
  if (className.includes('HardDrive') || className.includes('DropPod')) {
    return 'rare';
  }
  if (className.includes('Crystal_mk3')) {
    return 'rare';
  }
  if (className.includes('Crystal_mk2')) {
    return 'uncommon';
  }
  return 'common';
};