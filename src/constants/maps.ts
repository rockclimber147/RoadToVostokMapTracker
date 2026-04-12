export interface MapDefinition {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
}

export const GAME_MAPS: Record<string, MapDefinition> = {
  map1: { 
    id: 'map1', 
    label: 'VILLAGE', 
    url: '/maps/village.jpg', 
    width: 2000, 
    height: 2000 
  },
  map2: { 
    id: 'map2', 
    label: 'HIGHWAY', 
    url: '/maps/highway.jpg', 
    width: 2000, 
    height: 2000 
  },
  map3: { 
    id: 'map3', 
    label: 'SCHOOL', 
    url: '/maps/school.jpg', 
    width: 2000, 
    height: 2000 
  },
  map4: { 
    id: 'map4', 
    label: 'OUTPOST', 
    url: '/maps/outpost.jpg', 
    width: 2000, 
    height: 2000 
  },
  map5: { 
    id: 'map5', 
    label: 'MINEFIELD', 
    url: '/maps/minefield.jpg', 
    width: 2000, 
    height: 2000 
  },
  map6: { 
    id: 'map6', 
    label: 'APARTMENTS', 
    url: '/maps/apartments.jpg', 
    width: 2000, 
    height: 2000 
  },
  map7: { 
    id: 'map7', 
    label: 'TERMINAL', 
    url: '/maps/terminal.jpg', 
    width: 2000, 
    height: 2000 
  },
};

export const MAP_LIST = Object.values(GAME_MAPS);