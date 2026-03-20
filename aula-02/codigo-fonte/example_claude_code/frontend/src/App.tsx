import { CloudSun, AlertCircle, RefreshCw } from 'lucide-react';
import { useWeather } from '@/hooks/use-weather';
import {
  getTemperatureGradient,
  getDefaultGradient,
} from '@/lib/weather-utils';
import SearchBar from '@/components/search-bar';
import CurrentWeather from '@/components/current-weather';
import HourlyForecast from '@/components/hourly-forecast';
import DailyForecast from '@/components/daily-forecast';
import WeatherSkeleton from '@/components/weather-skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function App() {
  const { data, loading, error, searchByCity, searchByCoords, retry } = useWeather();

  const gradient = data
    ? getTemperatureGradient(data.current.temperature_2m)
    : getDefaultGradient();

  return (
    <div
      className="min-h-screen transition-all duration-1000"
      style={{ background: gradient }}
    >
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-xl space-y-4">
        <SearchBar
          onSearchCity={searchByCity}
          onSearchCoords={searchByCoords}
          loading={loading}
        />

        {loading && <WeatherSkeleton />}

        {error && (
          <Card className="bg-red-500/15 backdrop-blur-xl border-red-400/20">
            <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
              <AlertCircle size={40} className="text-red-300" />
              <div>
                <p className="text-white font-medium">Algo deu errado</p>
                <p className="text-sm text-white/70 mt-1">{error}</p>
              </div>
              <Button
                onClick={retry}
                className="bg-white/20 border border-white/20 text-white hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <div className="space-y-4">
            <CurrentWeather data={data} />
            <HourlyForecast data={data} />
            <DailyForecast data={data} />
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center pt-24 text-center space-y-4">
            <div className="animate-float">
              <CloudSun size={72} className="text-white/30" strokeWidth={1} />
            </div>
            <p className="text-white/50 text-lg">
              Pesquise uma cidade para ver o clima
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
