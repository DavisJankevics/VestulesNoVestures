import { useState } from 'react';
import { getLocationTypeStyle } from '../config/locationTypeStyles';

interface VestulesButtonData {
  name: string;
  description: string;
  type: string;
}

interface VestulesButtonProps {
  data: VestulesButtonData;
  onClick?: (data: VestulesButtonData) => void;
  className?: string;
  type?: string;
  active?: boolean;
}

export const VestulesButton = ({
  data,
  onClick,
  className = '',
  type = 'Fakti',
  active,
}: VestulesButtonProps) => {
  const [localSelected, setLocalSelected] = useState(false);
  const isSelected = typeof active === 'boolean' ? active : localSelected;

  const handleClick = () => {
    if (typeof active === 'boolean') {
      onClick?.(data);
    } else {
      setLocalSelected((s) => !s);
      onClick?.(data);
    }
  };
  const styles = getLocationTypeStyle(type);

  const baseStyles =
    'w-fit h-fit inline-flex items-center text-center justify-center gap-3 rounded-full py-1 px-2 font-[Courier_New] text-sm font-semibold transition';

  const variantStyles = {
    ghost: `bg-white border border-current/15 ${styles.iconColorClass} !${styles.textColorClass}`,
    solid: `${styles.className}`,
  } as const;

  const variant = isSelected ? 'ghost' : 'solid';

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {data.name}
    </button>
  );
};