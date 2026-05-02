import { LocationTypeButton } from './LocationTypeButton';
import { locationTypeStyles } from '../config/locationTypeStyles';

interface LocationTypeFilterProps {
  selectedType: string | null;
  onTypeFilter: (type: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const LocationTypeFilter = ({
  selectedType,
  onTypeFilter,
  className = '',
  style,
}: LocationTypeFilterProps) => {
  return (
    <div className={`space-y-3 ${className}`} style={style}>
      {Object.keys(locationTypeStyles).map((type) => (
        <LocationTypeButton
          key={type}
          type={type}
          label={type}
          variant={selectedType === type ? 'solid' : 'ghost'}
          onClick={() => onTypeFilter(type)}
          className="w-full"
        />
      ))}
    </div>
  );
};
