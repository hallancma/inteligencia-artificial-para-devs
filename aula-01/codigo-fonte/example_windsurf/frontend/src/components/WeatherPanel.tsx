import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, Search, Loader2 } from 'lucide-react';

interface WeatherData {
  location: {
    name: string;
    country: string;
    admin1: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    weatherDescription: string;
    isDay: boolean;
    humidity: number | null;
    feelsLike: number | null;
  };
  forecast: {
    today: {
      max: number;
      min: number;
      weatherCode: number;
      weatherDescription: string;
    };
    tomorrow: {
      max: number;
      min: number;
      weatherCode: number;
      weatherDescription: string;
    };
  };
}

const WeatherPanel = () => {
  const [_city, setCity] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Obter cidade a partir das coordenadas
          try {
            const response = await fetch(
              `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=pt&format=json`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const cityName = data.results[0].name;
              setCity(cityName);
              setInputCity(cityName);
              fetchWeather(cityName);
            }
          } catch (err) {
            console.error('Erro ao obter cidade da localização:', err);
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(cityName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar dados do clima');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      fetchWeather(inputCity.trim());
    }
  };

  const getWeatherIcon = (weatherCode: number, isDay: boolean) => {
    if (weatherCode === 0) {
      return isDay ? <Sun className="w-16 h-16 text-yellow-400" /> : <Sun className="w-16 h-16 text-blue-200" />;
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      return <Cloud className="w-16 h-16 text-gray-400" />;
    } else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return <CloudRain className="w-16 h-16 text-blue-500" />;
    } else {
      return <Cloud className="w-16 h-16 text-gray-400" />;
    }
  };

  const getCardinalDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-8">
          Painel do Clima
        </h1>

        {/* Formulário de busca */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Digite o nome da cidade"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCity.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Buscar
            </button>
          </div>
        </form>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Dados do clima */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Localização */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {weather.location.name}
              </h2>
              <p className="text-gray-600">
                {weather.location.admin1 && `${weather.location.admin1}, `}{weather.location.country}
              </p>
            </div>

            {/* Clima atual */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weather.current.weatherCode, weather.current.isDay)}
                  <div>
                    <p className="text-5xl font-bold text-gray-800">
                      {Math.round(weather.current.temperature)}°C
                    </p>
                    <p className="text-gray-600 text-lg">
                      Sensação térmica: {weather.current.feelsLike !== null ? `${Math.round(weather.current.feelsLike)}°C` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium text-gray-700">
                    {weather.current.weatherDescription}
                  </p>
                  <p className="text-gray-500">
                    {weather.current.isDay ? 'Dia' : 'Noite'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Vento</p>
                    <p className="font-medium text-gray-800">
                      {weather.current.windSpeed} km/h {getCardinalDirection(weather.current.windDirection)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Umidade</p>
                    <p className="font-medium text-gray-800">
                      {weather.current.humidity !== null ? `${weather.current.humidity}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previsão */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Hoje</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(weather.forecast.today.weatherCode, true)}
                    <div>
                      <p className="text-gray-700">{weather.forecast.today.weatherDescription}</p>
                      <p className="text-sm text-gray-500">
                        Máx: {Math.round(weather.forecast.today.max)}° / 
                        Mín: {Math.round(weather.forecast.today.min)}°
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Amanhã</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(weather.forecast.tomorrow.weatherCode, true)}
                    <div>
                      <p className="text-gray-700">{weather.forecast.tomorrow.weatherDescription}</p>
                      <p className="text-sm text-gray-500">
                        Máx: {Math.round(weather.forecast.tomorrow.max)}° / 
                        Mín: {Math.round(weather.forecast.tomorrow.min)}°
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!weather && !loading && !error && (
          <div className="text-center py-12">
            <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Digite o nome de uma cidade para ver o clima
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPanel;
