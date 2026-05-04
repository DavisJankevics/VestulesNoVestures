import type { MapPoint } from '../data/mockDataset';
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

  return (
    <div className={`${styles.className} w-full h-full min-h-0 flex flex-col gap-4 p-5 box-border`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[26px] font-extrabold leading-tight">{point.name}</h2>
        <button
          onClick={onBack}
          className="border-0 text-current"
        >
          <XIcon className={`${styles.iconColorClass}`} />
        </button>
      </div>

      {/* <p className="m-0 font-serif text-[15px] leading-[1.8]">
        {point.shortDescription}
      </p> */}

      {point.description && (
        <p className="font-[Gilroy] m-0 text-[22px] leading-[120%] opacity-95">{point.description}</p>
      )}
    </div>
  );
};
