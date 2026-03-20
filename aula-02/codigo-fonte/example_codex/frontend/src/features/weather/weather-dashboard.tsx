import { lazy, Suspense, type FormEvent } from 'react'
import { AlertCircle, Droplets, Gauge, LoaderCircle, LocateFixed, MapPin, RefreshCw, Search, Thermometer, Umbrella, Wind } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getWeatherAppearance, type WeatherResponse } from '@/lib/weather'

import { useWeatherDashboard } from './use-weather-dashboard'

const WeatherChartPanel = lazy(async () => {
  const module = await import('./weather-chart-panel')
  return { default: module.WeatherChartPanel }
})

export function WeatherDashboard() {
  const dashboard = useWeatherDashboard()

  return (
    <main
      className="min-h-dvh overflow-x-hidden text-slate-950 transition-[background-image] duration-700"
      style={dashboard.backgroundStyle}
    >
      <div className="relative isolate min-h-dvh">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.24),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),transparent)]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <WeatherHero
              citySearchPending={dashboard.citySearchPending}
              geolocationPending={dashboard.geolocationPending}
              isLoading={dashboard.isLoading}
              locationLabel={dashboard.locationLabel}
              onGeolocation={dashboard.actions.requestGeolocation}
              onQueryChange={dashboard.setQuery}
              onSubmit={dashboard.actions.submitCitySearch}
              query={dashboard.query}
            />
            <WeatherNowCard
              activeAppearance={dashboard.activeAppearance}
              weather={dashboard.weather}
              updatedAtLabel={dashboard.hourlyForecast[0]?.label ?? '--:--'}
            />
          </section>

          {dashboard.hasError ? (
            <WeatherErrorAlert
              errorMessage={dashboard.errorMessage ?? ''}
              onRetry={dashboard.actions.retryLastRequest}
            />
          ) : null}

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              <WeatherStatsGrid
                activeAppearance={dashboard.activeAppearance}
                uvDescriptor={dashboard.uvDescriptor}
                weather={dashboard.weather}
              />
              <Suspense fallback={<WeatherChartPanelSkeleton />}>
                <WeatherChartPanel
                  activeAppearance={dashboard.activeAppearance}
                  hourlyForecast={dashboard.hourlyForecast}
                  onHighlightTemperature={dashboard.setSelectedTemperature}
                  weather={dashboard.weather}
                />
              </Suspense>
            </div>
            <WeatherWeekPanel
              dailyForecast={dashboard.dailyForecast}
              onHighlightTemperature={dashboard.setSelectedTemperature}
              temperatureRange={dashboard.temperatureRange}
              weather={dashboard.weather}
            />
          </section>
        </div>
      </div>
    </main>
  )
}

type WeatherHeroProps = {
  citySearchPending: boolean
  geolocationPending: boolean
  isLoading: boolean
  locationLabel: string
  onGeolocation: () => void
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  query: string
}

function WeatherHero({
  citySearchPending,
  geolocationPending,
  isLoading,
  locationLabel,
  onGeolocation,
  onQueryChange,
  onSubmit,
  query,
}: WeatherHeroProps) {
  return (
    <Card className="overflow-hidden border-white/40 bg-white/40 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
      <CardHeader className="gap-4 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="weather-kicker">Painel Atmosférico</span>
            <CardTitle className="max-w-xl font-['Fraunces'] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Clima vivo, com leitura rápida e foco nas próximas horas.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7 text-slate-700">
              Busca por cidade, geolocalização instantânea, previsão horária interativa e visão de 7 dias sem expor a API externa no navegador.
            </CardDescription>
          </div>

          <div className="weather-chip max-w-max">
            <MapPin className="h-4 w-4" />
            <span>{locationLabel}</span>
          </div>
        </div>

        <form className="grid gap-3 md:grid-cols-[1fr_auto_auto]" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="city-search">
            Buscar cidade
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="city-search"
              autoComplete="off"
              className="h-13 rounded-full border-white/50 bg-white/70 pl-11 text-base text-slate-950 shadow-sm backdrop-blur"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Digite uma cidade"
              value={query}
            />
          </div>
          <Button
            className="h-13 rounded-full bg-slate-950 px-6 text-sm font-medium text-white hover:bg-slate-800"
            disabled={isLoading}
            type="submit"
          >
            {citySearchPending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
            ) : (
              <Search data-icon="inline-start" />
            )}
            Buscar
          </Button>
          <Button
            className="h-13 rounded-full border-white/50 bg-white/60 px-5 text-sm font-medium text-slate-900 backdrop-blur hover:bg-white/80"
            disabled={isLoading}
            onClick={onGeolocation}
            type="button"
            variant="outline"
          >
            {geolocationPending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
            ) : (
              <LocateFixed data-icon="inline-start" />
            )}
            Usar minha localização
          </Button>
        </form>
      </CardHeader>
    </Card>
  )
}

type WeatherNowCardProps = {
  activeAppearance: ReturnType<typeof getWeatherAppearance>
  updatedAtLabel: string
  weather: WeatherResponse | null
}

function WeatherNowCard({ activeAppearance, updatedAtLabel, weather }: WeatherNowCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden border-white/40 bg-gradient-to-br p-0 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl',
        activeAppearance.cardTone,
      )}
    >
      <CardContent className="flex h-full flex-col justify-between gap-6 p-5 sm:p-7">
        {weather ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="weather-kicker">Agora</span>
                <h2 className="font-['Fraunces'] text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
                  {Math.round(weather.current.temperature_2m)}
                  {weather.current_units.temperature_2m}
                </h2>
                <p className="max-w-xs text-sm leading-6 text-slate-700">{activeAppearance.summary}</p>
              </div>
              <div
                className="weather-icon-shell"
                style={{ boxShadow: `0 24px 50px ${activeAppearance.glow}` }}
              >
                <activeAppearance.icon className={cn('h-10 w-10', activeAppearance.iconClassName)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
              <WeatherStatPanel label="Sensação de agora" value={activeAppearance.label} />
              <WeatherStatPanel label="Atualizado" value={updatedAtLabel} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-24 rounded-full bg-white/60" />
            <Skeleton className="h-20 w-40 bg-white/70" />
            <Skeleton className="h-24 w-full bg-white/60" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function WeatherStatPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="weather-stat-panel">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function WeatherErrorAlert({
  errorMessage,
  onRetry,
}: {
  errorMessage: string
  onRetry: () => void
}) {
  return (
    <Alert className="border-red-500/30 bg-white/80 shadow-sm backdrop-blur-xl" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar a previsão</AlertTitle>
      <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>{errorMessage}</span>
        <Button className="w-full rounded-full sm:w-auto" onClick={onRetry} type="button" variant="secondary">
          <RefreshCw data-icon="inline-start" />
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  )
}

type WeatherStatsGridProps = {
  activeAppearance: ReturnType<typeof getWeatherAppearance>
  uvDescriptor: { label: string; progress: number; color: string }
  weather: WeatherResponse | null
}

function WeatherStatsGrid({ activeAppearance, uvDescriptor, weather }: WeatherStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        icon={Thermometer}
        label="Temperatura"
        tone={activeAppearance.accentSoft}
        value={weather ? `${Math.round(weather.current.temperature_2m)}${weather.current_units.temperature_2m}` : null}
      />
      <MetricCard
        icon={Droplets}
        label="Umidade"
        tone="#bfdbfe"
        value={weather ? `${Math.round(weather.current.relative_humidity_2m)}${weather.current_units.relative_humidity_2m}` : null}
      />
      <MetricCard
        icon={Wind}
        label="Vento"
        tone="#c7d2fe"
        value={weather ? `${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m}` : null}
      />
      <MetricCard
        icon={Umbrella}
        label="Precipitação"
        tone="#a5f3fc"
        value={weather ? `${weather.current.precipitation.toFixed(1)} ${weather.current_units.precipitation}` : null}
      />
      <UvCard uvDescriptor={uvDescriptor} weather={weather} />
    </div>
  )
}

function UvCard({
  uvDescriptor,
  weather,
}: {
  uvDescriptor: { label: string; progress: number; color: string }
  weather: WeatherResponse | null
}) {
  return (
    <Card className="border-white/40 bg-white/50 shadow-[0_14px_40px_rgba(15,23,42,0.09)] backdrop-blur-xl">
      <CardHeader className="gap-2 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Gauge className="h-4 w-4" />
          Índice UV
        </div>
        {weather ? (
          <>
            <div className="flex items-end justify-between gap-3">
              <CardTitle className="font-['Fraunces'] text-4xl tracking-[-0.04em] text-slate-950">
                {weather.current.uv_index.toFixed(1)}
              </CardTitle>
              <span className="text-sm font-medium text-slate-600">{uvDescriptor.label}</span>
            </div>
            <div className="h-3 rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#facc15_35%,#f97316_65%,#ef4444_100%)]">
              <div
                className="h-3 rounded-full border border-white/80 bg-white/40"
                style={{ width: `${Math.max(uvDescriptor.progress * 100, 10)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-20 bg-white/70" />
            <Skeleton className="h-3 w-full rounded-full bg-white/70" />
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

function WeatherWeekPanel({
  dailyForecast,
  onHighlightTemperature,
  temperatureRange,
  weather,
}: {
  dailyForecast: ReturnType<typeof useWeatherDashboard>['dailyForecast']
  onHighlightTemperature: (temperature: number) => void
  temperatureRange: ReturnType<typeof useWeatherDashboard>['temperatureRange']
  weather: WeatherResponse | null
}) {
  return (
    <Card className="border-white/40 bg-white/50 shadow-[0_20px_60px_rgba(15,23,42,0.11)] backdrop-blur-2xl">
      <CardHeader className="gap-2 p-5 sm:p-6">
        <span className="weather-kicker">Próximos 7 dias</span>
        <CardTitle className="font-['Fraunces'] text-3xl tracking-[-0.04em] text-slate-950">
          Sequência semanal
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Amplitude térmica e precipitação diária para planejar deslocamentos e exposição ao sol.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-5 pt-0 sm:p-6 sm:pt-0">
        {weather ? (
          dailyForecast.map((day) => {
            const appearance = getWeatherAppearance(day.weatherCode, true)
            const rangeWidth = Math.max(temperatureRange.max - temperatureRange.min, 1)
            const offset = ((day.min - temperatureRange.min) / rangeWidth) * 100
            const width = ((day.max - day.min) / rangeWidth) * 100

            return (
              <button
                key={day.date}
                className="weather-day-card"
                onFocus={() => onHighlightTemperature((day.max + day.min) / 2)}
                onMouseEnter={() => onHighlightTemperature((day.max + day.min) / 2)}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-11 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-900 shadow-sm"
                    style={{ boxShadow: `0 10px 22px ${appearance.glow}` }}
                  >
                    <appearance.icon className={cn('h-5 w-5', appearance.iconClassName)} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold capitalize text-slate-950">{day.label}</div>
                    <div className="truncate text-xs text-slate-500">{appearance.label}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="relative h-2 rounded-full bg-slate-200/80">
                    <div
                      className="absolute h-2 rounded-full"
                      style={{
                        left: `${offset}%`,
                        width: `${Math.max(width, 8)}%`,
                        background: `linear-gradient(90deg, ${appearance.accentSoft}, ${appearance.accent})`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <span>{Math.round(day.min)}°</span>
                    <span>{Math.round(day.max)}°</span>
                  </div>
                </div>
                <div className="text-right text-xs font-medium text-slate-600">
                  {day.precipitation.toFixed(1)} {weather.daily_units.precipitation_sum}
                </div>
              </button>
            )
          })
        ) : (
          Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[24px] bg-white/70" />
          ))
        )}
      </CardContent>
    </Card>
  )
}

type MetricCardProps = {
  icon: typeof Thermometer
  label: string
  tone: string
  value: string | null
}

function MetricCard({ icon: Icon, label, tone, value }: MetricCardProps) {
  return (
    <Card className="border-white/40 bg-white/50 shadow-[0_14px_40px_rgba(15,23,42,0.09)] backdrop-blur-xl">
      <CardHeader className="gap-4 p-5">
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-sm"
            style={{ boxShadow: `0 10px 22px ${tone}` }}
          >
            <Icon className="h-5 w-5 text-slate-900" />
          </div>
          <div className="text-sm font-medium text-slate-700">{label}</div>
        </div>
        {value ? (
          <CardTitle className="font-['Fraunces'] text-4xl tracking-[-0.04em] text-slate-950">
            {value}
          </CardTitle>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-11 w-24 bg-white/70" />
            <Skeleton className="h-4 w-20 bg-white/60" />
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

function WeatherChartPanelSkeleton() {
  return (
    <Card className="border-white/40 bg-white/50 shadow-[0_20px_60px_rgba(15,23,42,0.11)] backdrop-blur-2xl">
      <CardHeader className="gap-2 p-5 sm:p-6">
        <Skeleton className="h-5 w-28 bg-white/70" />
        <Skeleton className="h-10 w-72 bg-white/70" />
        <Skeleton className="h-4 w-full max-w-xl bg-white/60" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 pt-0 sm:p-6 sm:pt-0">
        <Skeleton className="h-[270px] w-full rounded-[28px] bg-white/70" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-[24px] bg-white/70" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
