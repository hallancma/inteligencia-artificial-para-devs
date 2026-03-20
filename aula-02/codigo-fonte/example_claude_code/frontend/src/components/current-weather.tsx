import { Droplets, Wind, Thermometer, CloudRain, MapPin } from 'lucide-react';
import type { WeatherData } from '@/lib/weather-utils';
import { getWeatherDescription, getUvLevel } from '@/lib/weather-utils';
import WeatherIcon from '@/components/weather-icon';
import { Card, CardContent } from '@/components/ui/card';

function UvBar({ value }: { value: number }) {
  const { label, color } = getUvLevel(value);
  const percentage = Math.min((value / 11) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Índice UV</span>
        <span className="font-medium" style={{ color }}>
          {value.toFixed(1)} - {label}
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #22c55e 0%, #eab308 33%, #f97316 55%, #ef4444 77%, #7c3aed 100%)',
          }}
        />
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-white/50" />
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function CurrentWeather({ data }: { data: WeatherData }) {
  const { current, current_units } = data;
  const location = [data.city, data.admin1, data.country].filter(Boolean).join(', ');

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/15 shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-1 text-white/70">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium truncate">{location}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-6xl sm:text-7xl font-light text-white tracking-tighter">
              {Math.round(current.temperature_2m)}
              <span className="text-3xl sm:text-4xl text-white/60">{current_units.temperature_2m}</span>
            </p>
            <p className="text-base text-white/80">
              {getWeatherDescription(current.weather_code)}
            </p>
            <p className="text-sm text-white/50">
              Sensação de {Math.round(current.apparent_temperature)}{current_units.apparent_temperature}
            </p>
          </div>
          <WeatherIcon code={current.weather_code} size={80} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <StatItem icon={Droplets} label="Umidade" value={`${current.relative_humidity_2m}${current_units.relative_humidity_2m}`} />
          <StatItem icon={Wind} label="Vento" value={`${current.wind_speed_10m} ${current_units.wind_speed_10m}`} />
          <StatItem icon={CloudRain} label="Precipitação" value={`${current.precipitation} ${current_units.precipitation}`} />
          <StatItem icon={Thermometer} label="Sensação" value={`${Math.round(current.apparent_temperature)}${current_units.apparent_temperature}`} />
        </div>

        <UvBar value={current.uv_index} />
      </CardContent>
    </Card>
  );
}

export default CurrentWeather;
