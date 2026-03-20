import type { WeatherData } from '@/lib/weather-utils';
import { formatDayName, getTemperatureBarColor } from '@/lib/weather-utils';
import WeatherIcon from '@/components/weather-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

function DailyForecast({ data }: { data: WeatherData }) {
  const { daily } = data;

  const globalMin = Math.min(...daily.temperature_2m_min);
  const globalMax = Math.max(...daily.temperature_2m_max);
  const range = globalMax - globalMin || 1;

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/15 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
          <CalendarDays size={18} className="text-white/60" />
          Próximos 7 Dias
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-1">
        {daily.time.map((date, i) => {
          const min = daily.temperature_2m_min[i];
          const max = daily.temperature_2m_max[i];
          const precip = daily.precipitation_sum[i];
          const leftPercent = ((min - globalMin) / range) * 100;
          const widthPercent = ((max - min) / range) * 100;

          return (
            <div
              key={date}
              className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="w-16 text-sm text-white/70 shrink-0">
                {formatDayName(date)}
              </span>

              <div className="shrink-0">
                <WeatherIcon code={daily.weather_code[i]} size={24} />
              </div>

              <span className="w-10 text-right text-sm text-blue-300 shrink-0">
                {Math.round(min)}°
              </span>

              <div className="flex-1 h-2 rounded-full bg-white/5 relative mx-1">
                <div
                  className="absolute h-full rounded-full transition-all duration-500"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 4)}%`,
                    background: `linear-gradient(90deg, ${getTemperatureBarColor(min)}, ${getTemperatureBarColor(max)})`,
                  }}
                />
              </div>

              <span className="w-10 text-sm text-orange-300 shrink-0">
                {Math.round(max)}°
              </span>

              <span className="w-14 text-right text-xs text-white/40 shrink-0">
                {precip > 0 ? `${precip.toFixed(1)}mm` : ''}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default DailyForecast;
