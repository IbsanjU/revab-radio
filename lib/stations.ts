import { RadioStation } from '@/types';

let stationsCache: RadioStation[] | null = null;

export async function fetchStations(): Promise<RadioStation[]> {
  if (stationsCache) {
    return stationsCache;
  }
  
  try {
    const response = await fetch('/stations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch stations');
    }
    const stations = await response.json();
    stationsCache = stations;
    return stations;
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}

export function getStationById(id: string, stations: RadioStation[]): RadioStation | undefined {
  return stations.find(station => station.id === id);
}

export function filterStationsByGenre(stations: RadioStation[], genre: string): RadioStation[] {
  if (!genre || genre === 'All') return stations;
  return stations.filter(station => station.genre === genre);
}

export function filterStationsByCountry(stations: RadioStation[], country: string): RadioStation[] {
  if (!country || country === 'All') return stations;
  return stations.filter(station => station.country === country);
}

export function searchStations(stations: RadioStation[], query: string): RadioStation[] {
  if (!query) return stations;
  
  const lowerQuery = query.toLowerCase();
  return stations.filter(station =>
    station.name.toLowerCase().includes(lowerQuery) ||
    station.genre.toLowerCase().includes(lowerQuery) ||
    station.country.toLowerCase().includes(lowerQuery) ||
    station.description?.toLowerCase().includes(lowerQuery)
  );
}

export function getUniqueGenres(stations: RadioStation[]): string[] {
  const genres = stations.map(station => station.genre);
  return ['All', ...Array.from(new Set(genres)).sort()];
}

export function getUniqueCountries(stations: RadioStation[]): string[] {
  const countries = stations.map(station => station.country);
  return ['All', ...Array.from(new Set(countries)).sort()];
}
