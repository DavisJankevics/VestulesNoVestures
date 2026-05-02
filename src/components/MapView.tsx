import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';
import type { MapPoint } from '../data/mockDataset';
import { getMapOptions, defaultCenter } from '../config/mapConfig';
import { getMarkerSvgUrl } from '../utils/markerUtils';
import { LocationPanel } from './LocationPanel';
import { LocationDetail } from './LocationDetail';
import { LocationTypeFilter } from './LocationTypeFilter';
import { VestulesButton } from './VestulesButton';

interface MapViewProps {
  points: MapPoint[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const MapView = ({ points }: MapViewProps) => {
  const [selectedMarker, setSelectedMarker] = useState<MapPoint | null>(null);
  const [selectedVestules, setSelectedVestules] = useState<{ name: string; description: string; type: string } | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [sheetY, setSheetY] = useState(750);
  // const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // const panelHeightClass = isPanelCollapsed ? 'h-[20vh]' : 'h-[85vh]';

  const vestulesData = {
    name: 'Vēstules no vēstures',
    description: 'Vēstules no vēstures ir interpretatīvās navigācijas projekts Āgenskalnā, kas aicina iepazīt pilsētvidi caur stāstiem.',
    type: 'Fakti',
  };

  const filteredPoints = selectedType ? points.filter((point) => point.type === selectedType) : points;

  const API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBGUQPJZZ_uD9VujzZR61icqpUtdLfjc60';

  const mapStyleId = import.meta.env.VITE_APP_MAP_STYLE_ID;
  const mapOptions = { ...getMapOptions(mapStyleId) };
  delete (mapOptions as any).center;

  const handleLoadError = (error: Error) => {
    console.error('Failed to load Google Maps:', error);
    setLoadError(`Failed to load map: ${error.message}`);
  };

  const handleLoad = () => {
    console.log('Google Maps loaded successfully');
    setIsLoaded(true);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType((currentType) => {
      const nextType = currentType === type ? null : type;
      if (selectedMarker && nextType && selectedMarker.type !== nextType) {
        setSelectedMarker(null);
      }
      return nextType;
    });
  };

  const handleUnload = () => {
    setIsLoaded(false);
  };

  if (loadError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Map Loading Error</h2>
          <p className="text-red-700 mb-4">{loadError}</p>
          <div className="text-left bg-red-100 p-4 rounded text-sm text-red-800">
            <p className="font-semibold mb-2">Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your Google Maps API key in .env.local</li>
              <li>Verify "Maps JavaScript API" is enabled in Google Cloud Console</li>
              <li>Check API key restrictions (should allow localhost)</li>
              <li>Open browser console (F12) for more details</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      onLoad={handleLoad}
      onError={handleLoadError}
      onUnmount={handleUnload}
      libraries={['maps']}
    >
      {!isLoaded && (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700">Loading map...</p>
          </div>
        </div>
      )}
      {isLoaded && (
        <div className="relative w-full h-screen overflow-hidden flex flex-row">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
            options={mapOptions}
            onLoad={(map) => setMapInstance(map)}
          >
            {filteredPoints.map((point) => {
              const isSelected = selectedMarker?.id === point.id;
              return (
                <Marker
                  key={point.id}
                  position={{ lat: point.lat, lng: point.lng }}
                  onClick={() => {
                    setSelectedMarker(point);
                    setMapCenter({ lat: point.lat, lng: point.lng });
                    mapInstance?.panTo({ lat: point.lat, lng: point.lng });
                  }}
                  title={point.name}
                  icon={getMarkerSvgUrl(point.type, isSelected)}
                />
              );
            })}
          </GoogleMap>
          <VestulesButton
            data={vestulesData}
            onClick={(data) => {
              if (selectedVestules) {
                setSelectedVestules(null);
              } else {
                setSelectedVestules(data);
              }
            }}
            className='absolute top-4 left-4 z-30'
          />
          <div className='absolute left-0 right-0 bottom-0'>
            <LocationTypeFilter
              selectedType={selectedType}
              onTypeFilter={handleTypeFilter}
              className="w-[160px] max-w-[180px] ml-4 z-30 fixed"
              style={{ top: `${sheetY - 150}px` }}
            />
            <LocationPanel
              points={selectedType ? points.filter(p => p.type === selectedType) : points}
              selectedMarker={selectedMarker}
              onSelectMarker={setSelectedMarker}
              sheetY={sheetY}
              onSheetYChange={setSheetY}
            />
          </div>

          {(selectedMarker || selectedVestules) && (
            <div className="fixed inset-x-0 top-[10vh] bottom-[10vh] flex justify-center items-center px-4 z-40">
              <div className="w-full max-w-[520px] h-full rounded-[28px] overflow-hidden flex flex-col shadow-[0_24px_40px_rgba(15,23,42,0.16)] bg-transparent">
                <LocationDetail
                  point={selectedVestules || selectedMarker!}
                  onBack={() => {
                    setSelectedMarker(null);
                    setSelectedVestules(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </LoadScript>
  );
};
