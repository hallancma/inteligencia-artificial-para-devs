import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface WeatherData {
  city: string;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
  };
  timezone: string;
}

const weatherCodeMap: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌧️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Slight snow', icon: '❄️' },
  73: { label: 'Moderate snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Slight showers', icon: '🌦️' },
  81: { label: 'Moderate showers', icon: '🌦️' },
  82: { label: 'Violent showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export function WeatherPanel() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const params = new URLSearchParams();
      if (cityName) {
        params.append('city', cityName);
      } else if (lat !== undefined && lon !== undefined) {
        params.append('latitude', lat.toString());
        params.append('longitude', lon.toString());
      }

      const response = await fetch(`http://localhost:3000/api/weather?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch weather');
        return;
      }

      setWeather(data);
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather('', position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const getWeatherInfo = (code: number) => {
    return weatherCodeMap[code] || { label: 'Unknown', icon: '❓' };
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-3xl">🌤️</span> Weather
      </h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          Search
        </button>
      </form>

      <button
        onClick={handleGeolocation}
        disabled={loading}
        className="w-full mb-4 py-2 px-4 border rounded-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors disabled:opacity-50"
      >
        <MapPin className="w-4 h-4" />
        Use my location
      </button>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {weather && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="w-5 h-5" />
            {weather.city}
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div className="text-4xl">
              {getWeatherInfo(weather.current.weatherCode).icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {weather.current.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground">
                {getWeatherInfo(weather.current.weatherCode).label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-accent/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weather.current.humidity}%</div>
            </div>
            <div className="p-3 bg-accent/30 rounded-lg">
              <div className="text-sm text-muted-foreground">Wind</div>
              <div className="font-semibold">{weather.current.windSpeed} km/h</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Timezone: {weather.timezone}
          </div>
        </div>
      )}
    </div>
  );
}