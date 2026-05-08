import noradesKmlRaw from './Norades.kml?raw';

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: string;
}

export interface LineFeature {
  id: string;
  name: string;
  coords: { lat: number; lng: number }[];
  description: string;
  type: string;
}

function parseCoordinateText(coordText: string) {
  const parts = coordText
    .trim()
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts
    .map((p) => {
      const [lngStr, latStr] = p.split(',');
      const lng = parseFloat(lngStr);
      const lat = parseFloat(latStr);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
      return null;
    })
    .filter((v): v is { lat: number; lng: number } => v !== null);
}

function findAncestorFolderName(node: Element | null): string | null {
  while (node) {
    if (node.nodeName === 'Folder') {
      const nameEl = node.querySelector('name');
      if (nameEl && nameEl.textContent) return nameEl.textContent.trim();
    }
    node = node.parentElement;
  }
  return null;
}

function parseKmlPoints(kmlText: string): MapPoint[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(kmlText, 'application/xml');
    const placemarks = Array.from(doc.getElementsByTagName('Placemark'));
    const points: MapPoint[] = [];
    const lines: LineFeature[] = [];

    placemarks.forEach((pm, idx) => {
      const nameEl = pm.getElementsByTagName('name')[0];
      const descEl = pm.getElementsByTagName('description')[0];
      const pointEl = pm.getElementsByTagName('Point')[0];
      const lineEl = pm.getElementsByTagName('LineString')[0];

      if (pointEl) {
        const coords = pointEl.getElementsByTagName('coordinates')[0];
        const coordsText = coords ? coords.textContent ?? '' : '';
        const parsed = parseCoordinateText(coordsText);
        if (parsed.length === 0) return;
        const coord = parsed[0];

        const name = nameEl && nameEl.textContent ? nameEl.textContent.trim() : `point-${idx}`;
        const description = descEl && descEl.textContent ? descEl.textContent.trim() : '';
        const folderName = findAncestorFolderName(pm.parentElement);
        const type = folderName ?? '';

        points.push({
          id: `${idx}`,
          name,
          lat: coord.lat,
          lng: coord.lng,
          description,
          type,
        });
      } else if (lineEl) {
        const coords = lineEl.getElementsByTagName('coordinates')[0];
        const coordsText = coords ? coords.textContent ?? '' : '';
        const parsed = parseCoordinateText(coordsText);
        if (parsed.length === 0) return;

        const name = nameEl && nameEl.textContent ? nameEl.textContent.trim() : `line-${idx}`;
        const description = descEl && descEl.textContent ? descEl.textContent.trim() : '';
        const folderName = findAncestorFolderName(pm.parentElement);
        const type = folderName ?? '';

        lines.push({
          id: `${idx}`,
          name,
          coords: parsed,
          description,
          type,
        });
      }
    });

    // attach lines array to points by returning both via closure scope
    (parseKmlPoints as any).__lines = lines;
    return points;
  } catch (e) {
    // If parsing fails, return empty array
    // eslint-disable-next-line no-console
    console.error('Failed to parse KML', e);
    return [];
  }
}

const parsedPoints = parseKmlPoints(noradesKmlRaw as string);
export const mockPoints: MapPoint[] = parsedPoints;
export const mockLines: LineFeature[] = (parseKmlPoints as any).__lines || [];
