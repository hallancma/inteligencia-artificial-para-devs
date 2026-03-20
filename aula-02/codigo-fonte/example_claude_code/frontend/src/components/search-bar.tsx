import React, { useState } from 'react';
import { Search, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SearchBar({
  onSearchCity,
  onSearchCoords,
  loading,
}: {
  onSearchCity: (city: string) => void;
  onSearchCoords: (lat: number, lon: number) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearchCity(trimmed);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        onSearchCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setGeoLoading(false);
      }
    );
  };

  const isDisabled = loading || geoLoading;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar cidade..."
          disabled={isDisabled}
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent disabled:opacity-50 transition-all"
        />
      </div>

      <Button
        type="submit"
        disabled={isDisabled || !query.trim()}
        className="h-12 px-5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 disabled:opacity-40 transition-all"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Search size={18} />
        )}
      </Button>

      <Button
        type="button"
        onClick={handleGeolocate}
        disabled={isDisabled}
        className="h-12 px-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 disabled:opacity-40 transition-all"
        title="Usar minha localização"
      >
        {geoLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Navigation size={18} />
        )}
      </Button>
    </form>
  );
}

export default SearchBar;
