import L from 'leaflet';

export const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.325C12 21.325 19 15.312 19 9.35C19 5.34594 15.865 2.112 12 2.112C8.135 2.112 5 5.34594 5 9.35C5 15.312 12 21.325 12 21.325Z" 
              fill="${color}" 
              stroke="white" 
              stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="white" fill-opacity="0.5"/>
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};