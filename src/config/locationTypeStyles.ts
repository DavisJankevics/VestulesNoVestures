export interface LocationTypeStyle {
  className: string;
  iconColorClass: string;
}

export const locationTypeStyles: Record<string, LocationTypeStyle> = {
  Fakti: {
    className: 'bg-[#EE3724] text-white',
    iconColorClass: 'text-[#EE3724]',
  },
  Kultūra: {
    className: 'bg-[#989636] text-white',
    iconColorClass: 'text-[#989636]',
  },
  'Cilvēkstāsti': {
    className: 'bg-[#98998E] text-white',
    iconColorClass: 'text-[#98998E]',
  },
};

export const defaultLocationTypeStyle: LocationTypeStyle = {
  className: 'bg-[#F8FAFC] text-[#0F172A]',
  iconColorClass: 'text-[#0F172A]',
};

export const getLocationTypeStyle = (type: string): LocationTypeStyle => {
  return locationTypeStyles[type] ?? defaultLocationTypeStyle;
};
