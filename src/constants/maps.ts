export interface MapDefinition {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
}

const basePath = import.meta.env.BASE_URL;

export const GAME_MAPS: Record<string, MapDefinition> = {
  map1: { 
    id: 'map1', 
    label: 'VILLAGE', 
    url: `${basePath}maps/village.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map2: { 
    id: 'map2', 
    label: 'HIGHWAY', 
    url: `${basePath}maps/highway.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map3: { 
    id: 'map3', 
    label: 'SCHOOL', 
    url: `${basePath}maps/school.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map4: { 
    id: 'map4', 
    label: 'OUTPOST', 
    url: `${basePath}maps/outpost.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map5: { 
    id: 'map5', 
    label: 'MINEFIELD', 
    url: `${basePath}maps/minefield.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map6: { 
    id: 'map6', 
    label: 'APARTMENTS', 
    url: `${basePath}maps/apartments.jpg`, 
    width: 2000, 
    height: 2000 
  },
  map7: { 
    id: 'map7', 
    label: 'TERMINAL', 
    url: `${basePath}maps/terminal.jpg`, 
    width: 2000, 
    height: 2000 
  },
};

export const MAP_LIST = Object.values(GAME_MAPS);