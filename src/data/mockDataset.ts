import mockDatasetJson from './mockDataset.json';

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  shortDescription: string;
  type: string;
}

export const mockPoints: MapPoint[] = mockDatasetJson as MapPoint[];
