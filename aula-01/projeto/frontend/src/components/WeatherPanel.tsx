import { useState } from 'react'
import { Search, MapPin, Loader2, CloudSun, Cloud, CloudRain, Droplets, Wind, Thermometer, Sun, CloudLightning, Snowflake, ThermometerSun } from 'lucide-react'

const API_URL = 'http://localhost:3000'

const getWeatherDetails = (code: number) => {
  if (code === 0) return { label: 'Céu limpo', icon: Sun, color: 'text-amber-400' }
  if (code === 1 || code === 2) return { label: 'Parcialmente nublado', icon: CloudSun, color: 'text-sky-300' }
  if (code === 3) return { label: 'Nublado', icon: Cloud, color: 'text-slate-400' }
  if (code >= 45 && code <= 48) return { label: 'Nevoeiro', icon: Cloud, color: 'text-slate-300' }
  if (code >= 51 && code <= 57) return { label: 'Garoa', icon: CloudRain, color: 'text-blue-300' }
  if (code >= 61 && code <= 65) return { label: 'Chuva', icon: CloudRain, color: 'text-blue-500' }
  if (code >= 66 && code <= 67) return { label: 'Chuva congelante', icon: CloudRain, color: 'text-cyan-400' }
  if (code >= 71 && code <= 77) return { label: 'Neve', icon: Snowflake, color: 'text-white' }
  if (code >= 80 && code <= 82) return { label: 'Pancadas', icon: CloudRain, color: 'text-blue-400' }
  if (code >= 85 && code <= 86) return { label: 'Neve rápida', icon: Snowflake, color: 'text-white' }
  if (code >= 95 && code <= 99) return { label: 'Temporal', icon: CloudLightning, color: 'text-indigo-400' }
  return { label: 'Condições variáveis', icon: CloudSun, color: 'text-slate-400' }
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
    setWeather(null)
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

  const renderWeatherCard = () => {
    if (!weather) return null;
    
    const details = getWeatherDetails(weather.current.weather_code);
    const Icon = details.icon;

    return (
      <div className="mt-8 relative group w-full animate-fade-in">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-dark p-8 sm:p-10 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden">
          
          {/* Subtle light reflections */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="flex flex-col items-center gap-4 z-10 w-full">
            <div className="flex items-center justify-center p-5 bg-white/5 rounded-full border border-white/10 mb-2 shadow-inner transition-transform hover:scale-110 duration-500">
              <Icon className={`w-16 h-16 sm:w-20 sm:h-20 ${details.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{weather.location}</h2>
              <p className="text-indigo-200/80 font-medium text-lg uppercase tracking-wider">{details.label}</p>
            </div>

            <div className="flex items-start justify-center mt-2 mb-6">
              <span className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 tracking-tighter ml-6">
                {Math.round(weather.current.temperature_2m)}
              </span>
              <span className="text-4xl font-bold text-white/50 mt-2">°</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-3 sm:gap-6 w-full pt-6 border-t border-white/10">
              <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/5 transition-all hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 duration-300">
                <ThermometerSun className="w-7 h-7 text-orange-400 mb-3 opacity-90" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase">Sensação</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-1">{Math.round(weather.current.apparent_temperature)}°</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/5 transition-all hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 duration-300">
                <Wind className="w-7 h-7 text-sky-400 mb-3 opacity-90" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase">Vento</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-1">{weather.current.wind_speed_10m} <span className="text-sm font-semibold text-slate-300">km/h</span></span>
              </div>

              <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/5 transition-all hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 duration-300">
                <Droplets className="w-7 h-7 text-blue-400 mb-3 opacity-90" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase">Umidade</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-1">{weather.current.relative_humidity_2m}<span className="text-sm text-slate-300">%</span></span>
              </div>

              <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/5 transition-all hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 duration-300">
                <CloudRain className="w-7 h-7 text-indigo-400 mb-3 opacity-90" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase">Volume</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-1">{weather.current.precipitation} <span className="text-sm font-semibold text-slate-300">mm</span></span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto pb-24 z-10 px-4">
      <div className="glass-dark p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/10">
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-indigo-300" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Digite o nome de uma cidade..."
              className="w-full pl-12 pr-14 py-4 rounded-xl bg-white/5 border border-transparent text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium text-lg placeholder:font-normal"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-2 p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white shadow-lg transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {status === 'loading' && !geoLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleGeolocation}
            disabled={status === 'loading' || geoLoading}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 transition-all disabled:opacity-50 border border-transparent hover:border-indigo-500/30 font-semibold text-sm w-full active:scale-[0.98]"
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            Usar minha localização atual
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-2xl glass bg-rose-500/10 border-rose-500/20 text-rose-300 text-center font-medium animate-fade-in flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          {error}
        </div>
      )}

      {status === 'success' && renderWeatherCard()}
    </div>
  )
}
