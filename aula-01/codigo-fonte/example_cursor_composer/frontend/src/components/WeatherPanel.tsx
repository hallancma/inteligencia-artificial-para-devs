import { useState } from 'react'
import { Search, MapPin, Loader2, CloudSun, Cloud, Droplets, Wind } from 'lucide-react'

const API_URL = 'http://localhost:3000'

// WMO Weather codes - descrições em português
const WEATHER_LABELS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Principalmente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa densa',
  56: 'Garoa congelante leve',
  57: 'Garoa congelante densa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve fortes',
  95: 'Temporal',
  96: 'Temporal com granizo leve',
  99: 'Temporal com granizo forte',
}

function getWeatherLabel(code: number): string {
  return WEATHER_LABELS[code] ?? 'Condições variáveis'
}

interface WeatherData {
  location: string
  timezone?: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    precipitation: number
    weather_code: number
    cloud_cover: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function WeatherPanel() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const fetchWeather = async (params: URLSearchParams) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch(`${API_URL}/weather?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao buscar clima')
      setWeather(data)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clima')
      setStatus('error')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = city.trim()
    if (trimmed.length < 2) {
      setError('Digite pelo menos 2 caracteres')
      setStatus('error')
      return
    }
    fetchWeather(new URLSearchParams({ city: trimmed }))
  }

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador')
      setStatus('error')
      return
    }
    setGeoLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(
          new URLSearchParams({
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          })
        ).finally(() => setGeoLoading(false))
      },
      (err) => {
        setError(err.message === 'User denied Geolocation' ? 'Localização negada' : 'Erro ao obter localização')
        setStatus('error')
        setGeoLoading(false)
      }
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Digite uma cidade..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
        </div>
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={status === 'loading' || geoLoading}
          className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {geoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          Usar minha localização
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {weather && status === 'success' && (
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <CloudSun className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">{weather.location}</h2>
                <p className="text-sm text-muted-foreground">
                  {getWeatherLabel(weather.current.weather_code)}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{Math.round(weather.current.temperature_2m)}°</span>
              <span className="text-muted-foreground">
                Sensação: {Math.round(weather.current.apparent_temperature)}°
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>Umidade: {weather.current.relative_humidity_2m}%</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="w-4 h-4" />
                <span>Vento: {weather.current.wind_speed_10m} km/h</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <Cloud className="w-4 h-4" />
                <span>Nebulosidade: {weather.current.cloud_cover}%</span>
              </div>
              {weather.current.precipitation > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Droplets className="w-4 h-4" />
                  <span>Precipitação: {weather.current.precipitation} mm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
