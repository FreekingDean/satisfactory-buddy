import React from 'react';
import { AnyMarker } from '../types/map';
import './MapMarker.css';

interface MapMarkerProps {
  markers: AnyMarker[];
  icons?: Record<string, HTMLImageElement>;
  onMarkerClick?: (marker: AnyMarker) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ markers, icons = {}, onMarkerClick }) => {
  return (
    <div className="map-markers">
      {markers.map(marker => {
        if (marker.visible === false) return null;
        
        return (
          <div
            key={marker.id}
            className={`map-marker map-marker--${marker.type}`}
            style={{
              left: marker.position.x,
              top: marker.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            data-purity={marker.type === 'resource' ? marker.data.purity : undefined}
            data-collected={marker.type === 'collectible' ? marker.data.isCollected : undefined}
            onClick={() => onMarkerClick?.(marker)}
          >
            {getMarkerContent(marker, icons)}
          </div>
        );
      })}
    </div>
  );
};

const getMarkerContent = (marker: AnyMarker, icons: Record<string, HTMLImageElement>) => {
  const icon = getIconForMarker(marker, icons);
  
  if (icon) {
    return <img src={icon.src} alt={marker.type} className="marker-icon" />;
  }
  
  return <div className={`marker-dot marker-dot--${marker.type}`} />;
};

const getIconForMarker = (marker: AnyMarker, icons: Record<string, HTMLImageElement>): HTMLImageElement | null => {
  switch (marker.type) {
    case 'resource':
      return icons[marker.data.resourceType] || null;
    case 'collectible':
      return icons[marker.data.collectibleType] || null;
    case 'building':
      return icons[marker.data.buildingType] || null;
    default:
      return null;
  }
};

export default MapMarker;