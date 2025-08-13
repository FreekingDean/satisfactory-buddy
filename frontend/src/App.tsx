import React from 'react';
import './App.css';
import SatisfactoryMap from './components/SatisfactoryMap';

function App() {
  return (
    <div className="flex w-screen h-screen bg-gradient-to-br from-satisfactory-dark to-satisfactory-darker">
      <div className="w-80 min-w-80 h-screen bg-black/80 backdrop-blur-xl border-r-2 border-white/10 p-5 overflow-y-auto text-white">
        <h2 className="mb-5 text-satisfactory-primary text-2xl border-b border-white/20 pb-2.5">Controls</h2>
        <div className="mb-5">
          <h3 className="mb-2.5 text-satisfactory-secondary text-lg">Map Controls</h3>
          <p className="my-1.5 text-gray-300 text-sm">Mouse wheel: Zoom</p>
          <p className="my-1.5 text-gray-300 text-sm">Click & drag: Pan</p>
        </div>
        <div className="mb-5">
          <h3 className="mb-2.5 text-satisfactory-secondary text-lg">Collectibles</h3>
          <p className="my-1.5 text-gray-300 text-sm">Auto-loaded from save file</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-5 bg-gradient-radial from-satisfactory-map to-satisfactory-mapDark">
        <SatisfactoryMap />
      </div>
    </div>
  );
}

export default App;
