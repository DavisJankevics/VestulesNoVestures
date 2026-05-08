import React from 'react';
import type { MapPoint } from '../data/mockDataset';
import kmlImageMap from '../data/kmlImageMap.json';
const imageMap: Record<string, string> = kmlImageMap as unknown as Record<string, string>;
function resolveMapped(src: string) {
  const mapped = imageMap && imageMap[src] ? imageMap[src] : src;
  const base = import.meta.env.BASE_URL || '/';
  if (mapped.startsWith('/')) {
    return (base.endsWith('/') ? base.slice(0, -1) : base) + mapped;
  }
  return mapped;
}
import { getLocationTypeStyle } from '../config/locationTypeStyles';
import XIcon from '../assets/Buttons/x.svg?react';

interface VestulesDetailData {
  name: string;
  description: string;
  type: string;
}

type LocationDetailData = MapPoint | VestulesDetailData;

interface LocationDetailProps {
  point: LocationDetailData;
  onBack: () => void;
}

export const LocationDetail = ({ point, onBack }: LocationDetailProps) => {
  const styles = getLocationTypeStyle(point.type);
  const descRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const imgs = el.querySelectorAll('img');
    imgs.forEach((img) => {
      (img as HTMLImageElement).style.maxWidth = '100%';
      (img as HTMLImageElement).style.height = 'auto';
      (img as HTMLImageElement).style.display = 'block';
      (img as HTMLImageElement).style.margin = '8px 0';
      // Add onerror fallback: try mapped local file or appending .jpg when image fails to load
      (img as HTMLImageElement).onerror = function () {
        const elImg = this as HTMLImageElement & { _tried?: boolean };
        if (elImg._tried) return;
        elImg._tried = true;
        try {
          // check original src attribute (may be relative in HTML). Prefer mapped replacement when available.
          const orig = elImg.getAttribute('src') || elImg.src;
          if (imageMap && imageMap[orig]) {
            elImg.src = resolveMapped(orig);
            return;
          }
          if (!/\.(jpg|jpeg|png|gif)$/i.test(elImg.src)) {
            elImg.src = elImg.src + '.jpg';
          }
        } catch (e) {
          // noop
        }
      };
    });
  }, [point.description]);

  return (
    <div className={`${styles.className} w-full h-full min-h-0 flex flex-col gap-4 p-5 box-border`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[16px] font-[Roboto] leading-tight">{point.name}</h2>
        <button
          onClick={onBack}
          className="border-0 text-current"
        >
          <XIcon className={`${styles.iconColorClass}`} />
        </button>
      </div>

      {point.description && (
        <div
          ref={descRef}
          className="font-[Gilroy] m-0 text-[14px] leading-[120%] opacity-95"
          dangerouslySetInnerHTML={{ __html: String(point.description).replace(/src=(\"|\')(.*?)(\"|\')/gi, (m, q1, url) => `src=${q1}${resolveMapped(url)}${q1}`) }}
        />
      )}
    </div>
  );
};
