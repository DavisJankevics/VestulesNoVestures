export const getMarkerSvgUrl = (type: string, isSelected: boolean): string => {
  const variant = isSelected ? '_e' : '_f';
  
  switch (type) {
    case 'Fakti':
      return new URL(`../assets/Points/Red${variant}.svg`, import.meta.url).href;
    case 'Kultūra':
      return new URL(`../assets/Points/Green${variant}.svg`, import.meta.url).href;
    case 'Cilvēksstāsti':
      return new URL(`../assets/Points/Grey${variant}.svg`, import.meta.url).href;
    default:
      return new URL(`../assets/Points/Grey${variant}.svg`, import.meta.url).href;
  }
};
