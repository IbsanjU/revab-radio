'use client';

import { useState, useEffect, useMemo } from 'react';
import { RadioStation } from '@/types';
import { StationCard } from './StationCard';
import { StationSearch } from './StationSearch';
import { 
  searchStations, 
  filterStationsByGenre, 
  filterStationsByCountry,
  getUniqueGenres,
  getUniqueCountries
} from '@/lib/stations';

interface StationListProps {
  stations: RadioStation[];
}

export function StationList({ stations }: StationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const genres = useMemo(() => getUniqueGenres(stations), [stations]);
  const countries = useMemo(() => getUniqueCountries(stations), [stations]);

  const filteredStations = useMemo(() => {
    let result = stations;
    
    // Apply search
    if (searchQuery) {
      result = searchStations(result, searchQuery);
    }
    
    // Apply genre filter
    if (selectedGenre !== 'All') {
      result = filterStationsByGenre(result, selectedGenre);
    }
    
    // Apply country filter
    if (selectedCountry !== 'All') {
      result = filterStationsByCountry(result, selectedCountry);
    }
    
    return result;
  }, [stations, searchQuery, selectedGenre, selectedCountry]);

  return (
    <div className="space-y-6">
      <StationSearch
        value={searchQuery}
        onChange={setSearchQuery}
        genres={genres}
        countries={countries}
        selectedGenre={selectedGenre}
        selectedCountry={selectedCountry}
        onGenreChange={setSelectedGenre}
        onCountryChange={setSelectedCountry}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {filteredStations.length} {filteredStations.length === 1 ? 'Station' : 'Stations'}
          </h2>
        </div>

        {filteredStations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No stations found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
