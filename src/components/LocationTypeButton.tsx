import type { MouseEventHandler } from 'react';
import { getLocationTypeStyle } from '../config/locationTypeStyles';

export type LocationTypeButtonVariant = 'ghost' | 'solid' | 'dark';

interface LocationTypeButtonProps {
  type: string;
  label: string;
  variant?: LocationTypeButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const LocationTypeButton = ({
  type,
  label,
  variant = 'ghost',
  onClick,
  className = '',
}: LocationTypeButtonProps) => {
  const styles = getLocationTypeStyle(type);

  const variantClasses = {
    ghost: `bg-white border border-current/15 ${styles.iconColorClass}`,
    solid: `${styles.className}`,
    dark: 'bg-slate-900 text-white',
  } as const;

  const dotClasses = {
    ghost: 'bg-current',
    solid: 'bg-white',
    dark: 'bg-white',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-3 rounded-full px-4 py-2 font-[Courier_New] text-sm font-semibold transition ${variantClasses[variant]} ${className}`}
    >
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${dotClasses[variant]}`} />
      <span>{label}</span>
    </button>
  );
};
