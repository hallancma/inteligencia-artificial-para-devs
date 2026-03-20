import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { WeatherData } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ChartPoint {
  time: string;
  temp: number;
  precip: number;
}

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs border border-white/10">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === 'temp'
            ? `${entry.value}°C`
            : `${entry.value}%`}
        </p>
      ))}
    </div>
  );
}

function HourlyForecast({ data }: { data: WeatherData }) {
  const { hourly } = data;

  const now = new Date();
  const startIndex = hourly.time.findIndex(
    (t) => new Date(t) >= now
  );
  const start = startIndex >= 0 ? startIndex : 0;

  const chartData: ChartPoint[] = hourly.time
    .slice(start, start + 24)
    .map((time, i) => ({
      time: new Date(time).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temp: hourly.temperature_2m[start + i],
      precip: hourly.precipitation_probability[start + i],
    }));

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/15 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
          <Clock size={18} className="text-white/60" />
          Previsão por Hora
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="temp"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(v: number) => `${v}°`}
            />
            <YAxis
              yAxisId="precip"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              hide
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#tempGradient)"
              name="Temperatura"
            />
            <Bar
              yAxisId="precip"
              dataKey="precip"
              fill="rgba(96, 165, 250, 0.4)"
              radius={[2, 2, 0, 0]}
              name="Precipitação"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default HourlyForecast;
