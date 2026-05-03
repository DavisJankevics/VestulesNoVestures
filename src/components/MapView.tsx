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
  // Compute a clamped top position for the mobile filter so it sits above the panel.
  // `sheetY` corresponds to the panel's top in pixels, so the filter's bottom
  // should be a little above that (12px). Clamp to at least 12px from top.
  const filterTop = Math.max(12, sheetY - 12);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const vestulesData = {
    name: 'Vēstules no vēstures',
    description: 'Vēstules no vēstures ir interpretatīvās navigācijas projekts Āgenskalnā, kas aicina iepazīt pilsētvidi caur stāstiem.',
    type: 'Fakti',
  };

  const filteredPoints = selectedType ? points.filter((p) => p.type === selectedType) : points;

  const API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBGUQPJZZ_uD9VujzZR61icqpUtdLfjc60';

  const mapStyleId = import.meta.env.VITE_APP_MAP_STYLE_ID;
  const mapOptions = { ...getMapOptions(mapStyleId) };
  const activeDetail = selectedVestules || selectedMarker;

  delete (mapOptions as any).center;

  const handleTypeFilter = (type: string) => {
    setSelectedType((current) => {
      const next = current === type ? null : type;
      if (selectedMarker && next && selectedMarker.type !== next) {
        setSelectedMarker(null);
      }
      return next;
    });
  };

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
        <div className="relative w-full h-screen overflow-hidden">
          <div className='sm:flex sm:flex-row block w-full h-full'>
            <div className='min-w-[70%] w-full h-full'>
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
                        setMapCenter({lat: point.lat, lng: point.lng,});
                        mapInstance?.panTo({lat: point.lat, lng: point.lng,});
                      }}
                      icon={getMarkerSvgUrl(point.type, isSelected)}
                    />
                  );
                })}
              </GoogleMap>
            </div>
            <div className='sm:block hidden'>
              <LocationPanel
                points={filteredPoints}
                selectedMarker={selectedMarker}
                onSelectMarker={setSelectedMarker}
                sheetY={sheetY}
                onSheetYChange={setSheetY}
              />
            </div>
            <LocationTypeFilter
              selectedType={selectedType}
              onTypeFilter={handleTypeFilter}
              className="fixed left-4 bottom-4 z-30 max-w-[180px] hidden sm:block"
            />
          </div>
          <VestulesButton
            data={vestulesData}
            onClick={(data) => {
              if (selectedVestules) {
                setSelectedVestules(null);
              } else {
                setSelectedVestules(data);
              }
               setSelectedMarker(null);
            }}
            className="absolute top-4 left-4 z-30"
          />
          <div className="fixed inset-x-0 bottom-0 sm:hidden">
            <LocationTypeFilter
              selectedType={selectedType}
              onTypeFilter={handleTypeFilter}
              className="fixed left-4 z-30 max-w-[180px]"
              style={{
                top: `${filterTop}px`,
                transform: 'translateY(-100%)',
              }}
            />
            <LocationPanel
              points={filteredPoints}
              selectedMarker={selectedMarker}
              onSelectMarker={setSelectedMarker}
              sheetY={sheetY}
              onSheetYChange={setSheetY}
            />
          </div>


          {activeDetail && (
            <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
              <div className="w-full max-w-[520px] h-[80vh] rounded-[28px] overflow-hidden shadow-xl bg-transparent">
                <LocationDetail
                  point={activeDetail}
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