import {useEffect, useRef, useState, type TouchEvent as ReactTouchEvent,} from 'react';
import type { MapPoint } from '../data/mockDataset';
import { getMarkerSvgUrl } from '../utils/markerUtils';

interface LocationPanelProps {
  points: MapPoint[];
  selectedMarker: MapPoint | null;
  onSelectMarker: (point: MapPoint | null) => void;
  sheetY: number;
  onSheetYChange: (sheetY: number) => void;
  mapInstance?: google.maps.Map | null;
  smoothPanTo?: (map: google.maps.Map, target: google.maps.LatLngLiteral, duration?: number) => void;
}

export const LocationPanel = ({
  points,
  selectedMarker,
  onSelectMarker,
  sheetY,
  onSheetYChange,
  mapInstance,
  smoothPanTo,
}: LocationPanelProps) => {
  const SNAP_TOP = 350;
  const SNAP_MID = 600;
  const SNAP_BOTTOM = 750;

  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startSheetYRef = useRef(0);

  const handleRef = useRef<HTMLDivElement>(null);
  const [isNotSmScreen, setIsNotSmScreen] = useState(true);

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;

    startYRef.current = e.touches[0].clientY;
    startSheetYRef.current = sheetY;
  };

  // Detect if screen is NOT in sm breakpoint (sm is 640px in Tailwind)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    setIsNotSmScreen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsNotSmScreen(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    const onMove = (e: globalThis.TouchEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();

      const touch = e.touches[0];
      const delta = touch.clientY - startYRef.current;

      const next = Math.min(
        SNAP_BOTTOM,
        Math.max(SNAP_TOP, startSheetYRef.current + delta)
      );

      onSheetYChange(next);
    };

    const onEnd = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;

      const snapPoints = [SNAP_TOP, SNAP_MID, SNAP_BOTTOM];

      const closest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - sheetY) < Math.abs(prev - sheetY) ? curr : prev
      );

      onSheetYChange(closest);
    };

    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);

    return () => {
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [sheetY, onSheetYChange]);
  useEffect(() => {
    document.body.style.overflow = isDraggingRef.current ? 'hidden' : '';
  }, [sheetY]);

  return (
    <div
      className="fixed left-0 right-0 bottom-0 w-full max-w-[640px] mx-auto bg-[#F5EDE0] flex flex-col sm:relative sm:max-w-[450px] h-full"
      style={isNotSmScreen ? {
        height: `calc(100vh - ${sheetY}px)`,
        transition: isDraggingRef.current ? 'none' : 'height 0.25s ease',
        touchAction: 'none',
      } : { touchAction: 'none' }}
    >
      <div
        ref={handleRef}
        onTouchStart={handleTouchStart}
        className="py-3 flex justify-center cursor-grab sm:hidden"
      >
        <div className="w-10 h-1.5 bg-gray-400 rounded-full" />
      </div>

      <div
        className="overflow-y-auto flex-1 min-h-0 px-5 pb-2 overscroll-contain"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {points.map((point) => {
          const isSelected = selectedMarker?.id === point.id;

          return (
            <button
              key={point.id}
              onClick={() => {
                onSelectMarker(point);
                if (mapInstance && smoothPanTo) {
                  smoothPanTo(mapInstance, { lat: point.lat, lng: point.lng }, 750);
                } else if (mapInstance) {
                  mapInstance.panTo({ lat: point.lat, lng: point.lng });
                }
              }}
              className={`w-full text-left border-b border-black/10 py-5 ${
                isSelected ? 'bg-black/5' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 mb-2.5">
                <img
                  src={getMarkerSvgUrl(point.type, false)}
                  className="w-[26px] h-[26px] flex-shrink-0"
                />
                <span className="font-[Roboto] text-[26px] text-[#1a1a1a]">
                  {point.name}
                </span>
              </div>

              <p className="pl-10 font-[Gilroy] text-[22px] text-[#444] leading-[120%]">
                {point.shortDescription}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};