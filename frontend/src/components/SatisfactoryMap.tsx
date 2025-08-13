import React, { useState, useEffect } from 'react';
import { useSaveFileLoader } from '../hooks/useSaveFileLoader';
import { useIconLoader } from '../hooks/useIconLoader';
import Map from './Map';
import CollectibleMarkers from './CollectibleMarkers';
import ResourceMarkers from './ResourceMarkers';
import './SatisfactoryMap.css';

const SatisfactoryMap: React.FC = () => {
  const { collectibles, error } = useSaveFileLoader();
  const { collectibleIcons } = useIconLoader();
  const [resourceMappings, setResourceMappings] = useState<Record<string, any>>({});
  const [mapPoints, setMapPoints] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mappingsResponse, pointsResponse] = await Promise.all([
          fetch('/data/mappings.json'),
          fetch('/data/mappoints.json')
        ]);
        
        const mappings = await mappingsResponse.json();
        const points = await pointsResponse.json();
        
        setResourceMappings(mappings);
        setMapPoints(points);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    
    loadData();
  }, []);

  if (error) {
    return (
      <div className="satisfactory-app">
        <div className="error-container">
          <div className="error-message">
            Error loading data: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="satisfactory-app">
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-header-title">
            Satisfactory Buddy
          </h1>
          <p className="app-header-subtitle">
            Interactive map for resource exploration and planning
          </p>
        </div>

        {/* Map Container */}
        <div className="map-wrapper">
          <Map>
            <CollectibleMarkers 
              collectibles={collectibles} 
              icons={collectibleIcons}
            />
            <ResourceMarkers 
              resources={mapPoints}
              mappings={resourceMappings}
              icons={collectibleIcons}
            />
          </Map>
        </div>

        {/* Stats Panel */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-card-label">Collectibles</div>
            <div className="stats-card-value">{collectibles.length}</div>
            <div className="stats-card-description">Total items</div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-label">Resources</div>
            <div className="stats-card-value">{mapPoints.length}</div>
            <div className="stats-card-description">Resource nodes</div>
          </div>
          
          <div className="stats-card stats-card--status">
            <div className="stats-card-label">Status</div>
            <div className="status-row">
              <div className="status-indicator"></div>
              <div className="status-text">Live data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactoryMap;
