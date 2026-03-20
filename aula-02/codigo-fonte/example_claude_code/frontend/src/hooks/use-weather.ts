import { useState, useRef, useCallback } from 'react';
import type { WeatherData } from '@/lib/weather-utils';

const API_BASE = 'http://localhost:3000';

type SearchParams =
  | { type: 'city'; city: string }
  | { type: 'coords'; lat: number; lon: number };

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });
  const lastSearchRef = useRef<SearchParams | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setState({ data: null, loading: true, error: null });

    const url =
      params.type === 'city'
        ? `${API_BASE}/api/weather?city=${encodeURIComponent(params.city)}`
        : `${API_BASE}/api/weather?lat=${params.lat}&lon=${params.lon}`;

    lastSearchRef.current = params;

    try {
      const response = await fetch(url);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || 'Erro ao buscar dados do clima');
      }

      setState({ data: body, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro desconhecido',
      });
    }
  }, []);

  const searchByCity = useCallback(
    (city: string) => search({ type: 'city', city }),
    [search]
  );

  const searchByCoords = useCallback(
    (lat: number, lon: number) => search({ type: 'coords', lat, lon }),
    [search]
  );

  const retry = useCallback(() => {
    if (lastSearchRef.current) {
      search(lastSearchRef.current);
    }
  }, [search]);

  return {
    ...state,
    searchByCity,
    searchByCoords,
    retry,
  };
}
