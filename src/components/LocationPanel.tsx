import { useState, useRef, type TouchEvent } from 'react';
import type { MapPoint } from '../data/mockDataset';
import { getMarkerSvgUrl } from '../utils/markerUtils';

interface LocationPanelProps {
  points: MapPoint[];
  selectedMarker: MapPoint | null;
  onSelectMarker: (point: MapPoint | null) => void;
  sheetY: number;
  onSheetYChange: (sheetY: number) => void;
}

export const LocationPanel = ({
  points,
  selectedMarker,
  onSelectMarker,
  sheetY,
  onSheetYChange,
}: LocationPanelProps) => {
  // Snap points (px from top of screen)
  const SNAP_TOP = 350;
  const SNAP_MID = 600;
  const SNAP_BOTTOM = 750;

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startSheetY, setStartSheetY] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartSheetY(sheetY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const delta = e.touches[0].clientY - startY;


    const next = Math.min(
      SNAP_BOTTOM,
      Math.max(SNAP_TOP, startSheetY + delta)
    );

    onSheetYChange(next);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const snapPoints = [SNAP_TOP, SNAP_MID, SNAP_BOTTOM];
    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - sheetY) < Math.abs(prev - sheetY) ? curr : prev
    );

    onSheetYChange(closest);
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 max-w-[520px] mx-auto bg-[#F5EDE0] flex flex-col"
      style={{
        height: `calc(100vh - ${sheetY}px)`,
        transition: isDragging ? 'none' : 'height 0.3s ease',
      }}
    >
      {/* Drag Handle */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="py-3 flex justify-center cursor-grab"
      >
        <div className="w-10 h-1.5 bg-gray-400 rounded-full" />
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto flex-1 min-h-0 px-5 pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {points.map((point) => {
          const isSelected = selectedMarker?.id === point.id;

          return (
            <button
              key={point.id}
              onClick={() => onSelectMarker(point)}
              className={`w-full text-left border-b border-black/10 py-5 ${
                isSelected ? 'bg-black/5' : 'bg-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5 mb-2.5">
                <img
                  src={getMarkerSvgUrl(point.type, false)}
                  alt={point.type}
                  className="w-[26px] h-[26px] flex-shrink-0"
                />
                <span className="font-[Courier_New] text-base font-bold text-[#1a1a1a] leading-5">
                  {point.name}
                </span>
              </div>

              <p className="pl-10 font-serif text-sm text-[#444] leading-[1.65]">
                {point.shortDescription}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};