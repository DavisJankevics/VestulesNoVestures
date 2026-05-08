import { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { MapView } from './components/MapView'
import { mockPoints, mockLines } from './data/mockDataset'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBGUQPJZZ_uD9VujzZR61icqpUtdLfjc60';

  if (loadError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50 p-4">
        <p className="text-red-700">{loadError}</p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => setLoadError(String(e))}
      libraries={['maps']}
    >
      {!isLoaded && (
        <div className="w-full h-screen flex items-center justify-center">
          Loading map...
        </div>
      )}

      {isLoaded && (
        <div className='h-[100dvh]'>
          <MapView points={mockPoints} lines={mockLines} />
        </div>
      )}
    </LoadScript>
  )
}

export default App

