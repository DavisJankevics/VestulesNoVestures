export interface MapOptions {
  styleId?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

export const getMapOptions = (styleId?: string): any => {
  const options: any = {
    zoom: 16.5,
    center: { lat: 56.9387, lng: 24.0728 },
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    rotateControl: false,
    scaleControl: false,
    panControl: false,
    controlSize: 0,
    gestureHandling: 'greedy',
    clickableIcons: false,
    colorScheme: 'LIGHT',
    restriction:{
      latLngBounds: {
        north: 56.96,
        south: 56.925,
        west: 24.05,
        east: 24.12,
      },
      strictBounds: true,
    },
  };

  if (styleId) {
    options.mapId = styleId;
  }

  return options;
};

export const defaultCenter = {
  lat: 56.9387,
  lng: 24.0728,
};

