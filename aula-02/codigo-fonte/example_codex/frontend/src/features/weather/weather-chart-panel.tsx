import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  formatFullDate,
  getWeatherAppearance,
  type HourlyForecast,
  type WeatherAppearance,
  type WeatherResponse,
} from '@/lib/weather'

type WeatherChartPanelProps = {
  activeAppearance: WeatherAppearance
  hourlyForecast: HourlyForecast[]
  onHighlightTemperature: (temperature: number) => void
  weather: WeatherResponse | null
}

export function WeatherChartPanel({
  activeAppearance,
  hourlyForecast,
  onHighlightTemperature,
  weather,
}: WeatherChartPanelProps) {
  return (
    <Card className="border-white/40 bg-white/50 shadow-[0_20px_60px_rgba(15,23,42,0.11)] backdrop-blur-2xl">
      <CardHeader className="gap-2 p-5 sm:p-6">
        <span className="weather-kicker">Próximas horas</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="font-['Fraunces'] text-3xl tracking-[-0.04em] text-slate-950">
              Ritmo térmico e chance de chuva
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Passe o cursor ou toque no gráfico para fazer o fundo acompanhar a temperatura prevista.
            </CardDescription>
          </div>
          {weather ? (
            <div className="weather-chip">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: activeAppearance.accent }} />
              <span>{formatFullDate(weather.current.time)}</span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-5 pt-0 sm:p-6 sm:pt-0">
        {weather ? (
          <>
            <ChartContainer
              className="h-[270px] w-full"
              config={{
                temperature: { label: 'Temperatura', color: activeAppearance.stroke },
                precipitationProbability: { label: 'Chance de chuva', color: '#0f766e' },
              }}
            >
              <AreaChart
                data={hourlyForecast}
                margin={{ left: 0, right: 12, top: 12, bottom: 0 }}
                onMouseMove={(state) => {
                  const nextTemperature = state.activePayload?.[0]?.payload?.temperature
                  if (typeof nextTemperature === 'number') {
                    onHighlightTemperature(nextTemperature)
                  }
                }}
              >
                <defs>
                  <linearGradient id="temperatureFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={activeAppearance.stroke} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={activeAppearance.stroke} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.24)" strokeDasharray="4 6" vertical={false} />
                <XAxis axisLine={false} dataKey="label" minTickGap={24} tickLine={false} tickMargin={10} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-6">
                          <span className="text-muted-foreground">{String(name)}</span>
                          <span className="font-mono font-medium text-foreground">
                            {String(name) === 'precipitationProbability' ? `${value}%` : `${value}°`}
                          </span>
                        </div>
                      )}
                      labelFormatter={(_, payload) =>
                        payload[0]?.payload?.label ? `Hora ${payload[0].payload.label}` : ''
                      }
                    />
                  }
                />
                <Area
                  dataKey="precipitationProbability"
                  fill="none"
                  stroke="#0f766e"
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  activeDot={{ r: 6, strokeWidth: 0, fill: activeAppearance.stroke }}
                  dataKey="temperature"
                  fill="url(#temperatureFill)"
                  stroke={activeAppearance.stroke}
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {hourlyForecast.slice(0, 4).map((hour) => {
                const hourAppearance = getWeatherAppearance(hour.weatherCode, weather.current.is_day === 1)

                return (
                  <button
                    key={hour.time}
                    className="weather-mini-card text-left"
                    onFocus={() => onHighlightTemperature(hour.temperature)}
                    onMouseEnter={() => onHighlightTemperature(hour.temperature)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{hour.label}</div>
                        <div className="text-xs text-slate-500">{hourAppearance.label}</div>
                      </div>
                      <hourAppearance.icon className={cn('h-5 w-5 text-slate-700', hourAppearance.iconClassName)} />
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <span className="font-['Fraunces'] text-4xl tracking-[-0.05em] text-slate-950">
                        {Math.round(hour.temperature)}°
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {hour.precipitationProbability}% chuva
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[270px] w-full rounded-[28px] bg-white/70" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-[24px] bg-white/70" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
