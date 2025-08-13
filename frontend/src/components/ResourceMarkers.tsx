import React, { useMemo } from 'react';
import { ResourceMarker } from '../types/map';
import MapMarker from './MapMarker';

interface ResourceMarkersProps {
  resources: Array<{ x: number; y: number; z?: number; className: string }>;
  mappings: Record<string, { type: string; purity: 'impure' | 'normal' | 'pure' }>;
  icons?: Record<string, HTMLImageElement>;
  visible?: boolean;
}

const ResourceMarkers: React.FC<ResourceMarkersProps> = ({ 
  resources, 
  mappings, 
  icons = {}, 
  visible = true 
}) => {
  const markers = useMemo((): ResourceMarker[] => {
    return resources
      .map((resource, index) => {
        const mapping = mappings[resource.className];
        if (!mapping) return null;

        return {
          id: `resource-${index}`,
          type: 'resource' as const,
          position: { x: resource.x, y: resource.y, z: resource.z },
          visible,
          data: {
            resourceType: mapping.type,
            purity: mapping.purity,
          }
        };
      })
      .filter(Boolean) as ResourceMarker[];
  }, [resources, mappings, visible]);

  return <MapMarker markers={markers} icons={icons} />;
};

export default ResourceMarkers;