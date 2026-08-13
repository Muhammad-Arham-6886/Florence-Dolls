import { WP_REST_URL } from '../config';

// Curated photography served from the store's own media library.
// Derived from the WP origin so it follows the production domain with no code change.
const uploads = `${WP_REST_URL}/../wp-content/uploads`;

export const IMAGERY = {
  hero: 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/98214-NINOS-4-1-scaled.jpg',
  heroSecondary: `${uploads}/2026/08/71HNd312H-L._AC_SL1500_.jpg`,
  categories: {
    'reborn-dolls': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/65373_7-copia-scaled.jpg',
    'doll-prams-and-pushchairs': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/40873_8-copia-scaled.jpg',
    'doll-furniture': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/21586-ninos-2-scaled.jpg',
    'doll-accessories': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/21587-ninos-1-1-scaled.jpg',
  },
  brand: {
    arias: 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/21583-ninos-2-1.jpg',
    llorens: 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/63311-63312-LITTLE-BABY_31cm_Llorens2025_1053-2048x1536-1.jpg',
  },
  about: 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/65395_10-copia-scaled.jpg',
  banners: {
    'reborn-dolls': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/38370-38372-LLORONES-38cm_Llorens20261718-1-1.jpg',
    'doll-prams-and-pushchairs': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/colecciones-home-carros-1000x640-1.jpg',
    'doll-furniture': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/colecciones-home-muebles-1000x640-1.jpg',
    'doll-accessories': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/63509-63510-RN-SUAVES-35cm_Llorens2026_1289-1-1.jpg',
    'new-arrivals': 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/42166-LLORONES-42cm_Llorens2026_1388.jpg',
    sale: 'https://thelondonhub.co.uk/florencedolls/wp-content/uploads/2026/08/38573-38574-LLORONES-38cm_Llorens2025_9467-1-1.jpg',
  },
};