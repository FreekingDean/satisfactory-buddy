import React, { useState } from 'react';
import './MapControls.css';

interface MapControlsProps {
  scale: number;
  onToggleLayer?: (layer: string) => void;
  onResetView?: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ scale, onToggleLayer, onResetView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string>('all');

  const layers = [
    { id: 'all', name: 'All', icon: '🗺️', color: 'bg-blue-500' },
    { id: 'resources', name: 'Resources', icon: '⛏️', color: 'bg-orange-500' },
    { id: 'collectibles', name: 'Items', icon: '📦', color: 'bg-green-500' },
    { id: 'buildings', name: 'Buildings', icon: '🏭', color: 'bg-purple-500' }
  ];

  const handleLayerToggle = (layerId: string) => {
    setActiveLayer(layerId);
    onToggleLayer?.(layerId);
  };

  return (
    <div className="controls-container">
      {/* Main Controls Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="controls-button"
        data-expanded={isExpanded}
      >
        <div className="controls-icon-container">
          <div className="controls-icon" />
        </div>
        
        {/* Tooltip */}
        <div className="controls-tooltip">
          {isExpanded ? 'Close controls' : 'Open controls'}
        </div>
      </button>

      {/* Expanded Panel */}
      <div 
        className="controls-panel"
        data-expanded={isExpanded}
      >
        {/* Layer Controls */}
        <div className="controls-section">
          <div className="controls-section-header">
            Map Layers
          </div>
          
          <div className="layer-buttons">
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => handleLayerToggle(layer.id)}
                className="layer-button"
                data-active={activeLayer === layer.id}
              >
                <div className={`layer-icon ${layer.color}`}>
                  {layer.icon}
                </div>
                <span className="layer-name">{layer.name}</span>
                {activeLayer === layer.id && (
                  <div className="layer-status-dot" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Controls */}
        <div className="controls-section">
          <div className="controls-section-header">
            View
          </div>
          
          <div className="view-controls">
            <button
              onClick={onResetView}
              className="layer-button"
            >
              <div className="view-button">
                🔄
              </div>
              <span className="layer-name">Reset View</span>
            </button>
            
            <div className="zoom-controls">
              <div className="zoom-label">Zoom Level</div>
              <div className="zoom-container">
                <div className="zoom-bar">
                  <div 
                    className="zoom-progress"
                    style={{ width: `${Math.min((scale / 2) * 100, 100)}%` }}
                  />
                </div>
                <div className="zoom-text">
                  {(scale * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;